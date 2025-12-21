import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);
    private readonly n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

    constructor(private prisma: PrismaService) {
        if (!this.n8nWebhookUrl) {
            this.logger.warn('N8N_WEBHOOK_URL is not set. Notifications will default to console logs.');
        }
    }

    private async triggerN8n(type: 'EMAIL' | 'WHATSAPP' | 'SMS', recipient: string, data: any) {
        if (!this.n8nWebhookUrl) {
            this.logger.log(`[MOCK ${type}] To: ${recipient}, Data: ${JSON.stringify(data)}`);
            return;
        }

        try {
            await axios.post(this.n8nWebhookUrl, {
                type,
                recipient,
                data
            });
            this.logger.log(`[n8n] Triggered ${type} for ${recipient}`);
        } catch (error) {
            this.logger.error(`Failed to trigger n8n webhook: ${error.message}`);
        }
    }

    async sendWhatsApp(to: string, message: string) {
        return this.triggerN8n('WHATSAPP', to, { message });
    }

    async sendEmail(to: string, subject: string, body: string) {
        return this.triggerN8n('EMAIL', to, { subject, message: body });
    }

    async sendSMS(to: string, message: string) {
        // SMS often mapped to Twilio in n8n, similar payload
        return this.triggerN8n('SMS', to, { message });
    }

    async create(data: {
        recipientId: string;
        recipientType: string;
        title: string;
        message: string;
        type: any;
        entityId?: string;
        entityType?: string;
    }) {
        return this.prisma.notification.create({
            data: {
                recipientId: data.recipientId,
                recipientType: data.recipientType,
                title: data.title,
                message: data.message,
                type: data.type,
                entityId: data.entityId,
                entityType: data.entityType,
            }
        });
    }

    async sendInAppNotification(userId: string, title: string, message: string, type: 'INFO' | 'ALERT' | 'SUCCESS' = 'INFO') {
        // DB Notification (Mock Logic maintained or real DB insert)
        return this.prisma.notification.create({
            data: {
                recipientId: userId,
                recipientType: 'TRAINER',
                title,
                message,
                type: 'MATCH_SUGGESTED',
            }
        });
    }

    async notifyTrainerMatch(trainerId: string, requirementTitle: string, matchScore: number) {
        const trainer = await this.prisma.trainer.findUnique({ where: { id: trainerId } });
        if (!trainer) return;

        const message = `New Match! You have a ${matchScore}% match for "${requirementTitle}". Check app to apply.`;
        const subject = `New Requirement Match: ${requirementTitle}`;

        // DB Notification
        await this.sendInAppNotification(trainer.id, 'New Requirement Match', message);

        // N8N Triggers
        if (trainer.email) {
            await this.sendEmail(trainer.email, subject, message);
        }
        if (trainer.phone) {
            await this.sendWhatsApp(trainer.phone, message);
        }
    }
}
