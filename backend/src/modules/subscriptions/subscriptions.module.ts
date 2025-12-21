import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { SubscriptionRemindersService } from './reminders.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [
        ConfigModule,
        NotificationsModule,
        ScheduleModule.forRoot(),
    ],
    controllers: [SubscriptionsController],
    providers: [
        SubscriptionsService,
        PrismaService,
        SubscriptionRemindersService
    ],
    exports: [SubscriptionsService],
})
export class SubscriptionsModule { }
