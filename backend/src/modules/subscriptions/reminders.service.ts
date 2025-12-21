import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SubscriptionRemindersService {
    private readonly logger = new Logger(SubscriptionRemindersService.name);

    constructor(
        private prisma: PrismaService,
        private notificationsService: NotificationsService,
    ) { }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleReminders() {
        this.logger.log('Running daily subscription reminders check...');

        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

        const startOfTargetDay = new Date(sevenDaysFromNow.setHours(0, 0, 0, 0));
        const endOfTargetDay = new Date(sevenDaysFromNow.setHours(23, 59, 59, 999));

        const endingSoon = await this.prisma.subscription.findMany({
            where: {
                currentEnd: {
                    gte: startOfTargetDay,
                    lte: endOfTargetDay,
                },
                status: 'ACTIVE',
            },
            include: {
                vendors: true,
            }
        });

        for (const sub of endingSoon) {
            for (const vendor of sub.vendors) {
                // Find admin users for this vendor
                const admins = await this.prisma.user.findMany({
                    where: {
                        vendorId: vendor.id,
                        role: 'VENDOR_ADMIN',
                    }
                });

                for (const admin of admins) {
                    await this.notificationsService.create({
                        recipientId: admin.id,
                        recipientType: 'USER',
                        title: 'Subscription Ending Soon',
                        message: `Your subscription for ${vendor.name} is ending in 7 days. Please ensure your payment method is up to date to avoid service interruption.`,
                        type: 'PAYMENT_DUE',
                        entityId: sub.id,
                        entityType: 'Subscription',
                    });
                }
            }
        }
    }
}
