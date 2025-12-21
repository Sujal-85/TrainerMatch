import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import Razorpay = require('razorpay');

@Injectable()
export class SubscriptionsService {
    private razorpay: Razorpay;
    private readonly logger = new Logger(SubscriptionsService.name);

    constructor(
        private prisma: PrismaService,
        private configService: ConfigService,
    ) {
        const keyId = this.configService.get<string>('RAZORPAY_KEY_ID');
        const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');

        if (keyId && keySecret) {
            this.razorpay = new Razorpay({
                key_id: keyId,
                key_secret: keySecret,
            });
        } else {
            this.logger.warn('Razorpay credentials missing. Subscriptions related features will not work.');
        }
    }

    async createSubscription(vendorId: string, planType: 'STARTER' | 'MASTER' | 'CUSTOM', billingCycle: 'MONTHLY' | 'YEARLY') {
        const vendor = await this.prisma.vendor.findUnique({ where: { id: vendorId } });
        if (!vendor) throw new Error('Vendor not found');

        // Define Plan IDs (These should be created in Razorpay Dashboard first or via API)
        // For now, mapping to provided plan logic
        const planIdMap = {
            STARTER: { MONTHLY: 'plan_starter_monthly', YEARLY: 'plan_starter_yearly' },
            MASTER: { MONTHLY: 'plan_master_monthly', YEARLY: 'plan_master_yearly' },
            CUSTOM: { MONTHLY: 'plan_custom_monthly', YEARLY: 'plan_custom_yearly' },
        };

        const razorpayPlanId = planIdMap[planType][billingCycle];

        if (!this.razorpay) {
            throw new Error('Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.');
        }

        const subscription = await this.razorpay.subscriptions.create({
            plan_id: razorpayPlanId,
            total_count: billingCycle === 'MONTHLY' ? 120 : 10, // Max periods
            quantity: 1,
            customer_notify: 1,
            expire_by: Math.floor(Date.now() / 1000) + 3600, // 1 hour for initial payment
            addons: [],
            notes: {
                vendorId: vendor.id,
            },
        });

        return this.prisma.subscription.create({
            data: {
                vendorId: vendor.id,
                razorpaySubId: subscription.id,
                razorpayPlanId: subscription.plan_id,
                status: 'PENDING',
                planType: planType,
                billingCycle: billingCycle,
                currentStart: new Date(),
                currentEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days initially
                trialStart: new Date(),
                trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            },
        });
    }

    async cancelSubscription(subscriptionId: string) {
        const sub = await this.prisma.subscription.findUnique({ where: { id: subscriptionId } });
        if (!sub) throw new Error('Subscription not found');

        if (!this.razorpay) {
            throw new Error('Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.');
        }

        await this.razorpay.subscriptions.cancel(sub.razorpaySubId, false); // Cancel at end of cycle

        return this.prisma.subscription.update({
            where: { id: subscriptionId },
            data: { cancelAtPeriodEnd: true },
        });
    }

    async getCurrentSubscription(vendorId: string) {
        return this.prisma.subscription.findUnique({
            where: { vendorId },
        });
    }

    async handleWebhook(payload: any) {
        const { event, payload: eventPayload } = payload;
        const razorpaySubId = eventPayload.subscription.entity.id;

        const sub = await this.prisma.subscription.findUnique({
            where: { razorpaySubId },
        });

        if (!sub) {
            this.logger.warn(`Subscription ${razorpaySubId} not found in database for event ${event}`);
            return;
        }

        switch (event) {
            case 'subscription.activated':
                await this.prisma.subscription.update({
                    where: { razorpaySubId },
                    data: {
                        status: 'ACTIVE',
                        currentStart: new Date(eventPayload.subscription.entity.current_start * 1000),
                        currentEnd: new Date(eventPayload.subscription.entity.current_end * 1000),
                    },
                });
                break;

            case 'subscription.charged':
                await this.prisma.subscription.update({
                    where: { razorpaySubId },
                    data: {
                        status: 'ACTIVE',
                        currentStart: new Date(eventPayload.subscription.entity.current_start * 1000),
                        currentEnd: new Date(eventPayload.subscription.entity.current_end * 1000),
                    },
                });
                // Here you could also record a payment/invoice model if we had one
                break;

            case 'subscription.halted':
                await this.prisma.subscription.update({
                    where: { razorpaySubId },
                    data: { status: 'HALTED' },
                });
                break;

            case 'subscription.cancelled':
                await this.prisma.subscription.update({
                    where: { razorpaySubId },
                    data: { status: 'CANCELLED' },
                });
                break;

            case 'subscription.expired':
                await this.prisma.subscription.update({
                    where: { razorpaySubId },
                    data: { status: 'EXPIRED' },
                });
                break;
        }
    }
}
