import { Controller, Post, Body, Get, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('subscriptions')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class SubscriptionsController {
    constructor(private readonly subscriptionsService: SubscriptionsService) { }

    @Get('current')
    @Roles('VENDOR_ADMIN')
    async getCurrent(@Req() req) {
        const vendorId = req.user.vendorId;
        return this.subscriptionsService.getCurrentSubscription(vendorId);
    }

    @Post('create')
    @Roles('VENDOR_ADMIN')
    async create(
        @Req() req,
        @Body() body: { planType: 'STARTER' | 'MASTER' | 'CUSTOM'; billingCycle: 'MONTHLY' | 'YEARLY' }
    ) {
        const vendorId = req.user.vendorId;
        return this.subscriptionsService.createSubscription(vendorId, body.planType, body.billingCycle);
    }

    @Delete(':id')
    @Roles('VENDOR_ADMIN')
    async cancel(@Param('id') id: string) {
        return this.subscriptionsService.cancelSubscription(id);
    }

    // Webhook endpoint (Public, but should be secured with Razorpay signature verification)
    @Post('webhook')
    async handleWebhook(@Body() payload: any) {
        return this.subscriptionsService.handleWebhook(payload);
    }
}
