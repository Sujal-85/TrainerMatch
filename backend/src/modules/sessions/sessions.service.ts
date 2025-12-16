import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class SessionsService {
    constructor(
        private prisma: PrismaService,
        private notificationsService: NotificationsService
    ) { }

    async create(data: any) {
        const session = await this.prisma.session.create({
            data,
            include: { trainer: true }
        });

        if (session.trainer && session.trainer.email) {
            const dateStr = new Date(session.startTime).toLocaleString();
            await this.notificationsService.sendEmail(
                session.trainer.email,
                `New Session Scheduled: ${session.title}`,
                `You have been scheduled for a new session "${session.title}" on ${dateStr}. Location: ${session.location}.`
            );
        }

        return session;
    }

    async findAll(trainerId?: string) {
        const whereClause = trainerId ? { trainerId } : {};
        return this.prisma.session.findMany({
            where: whereClause,
            include: {
                college: true,
                trainer: true,
            },
            orderBy: { startTime: 'asc' }
        });
    }

    async findOne(id: string) {
        return this.prisma.session.findUnique({
            where: { id },
            include: {
                college: true,
                trainer: true,
            },
        });
    }
    async update(id: string, data: any) {
        return this.prisma.session.update({
            where: { id },
            data,
        });
    }

    async updateTrainer(sessionId: string, newTrainerId: string) {
        // Fetch current session first to get old trainer? Optional.
        // Let's just update and notify new trainer.

        const session = await this.prisma.session.update({
            where: { id: sessionId },
            data: { trainerId: newTrainerId },
            include: { trainer: true }
        });

        if (session.trainer && session.trainer.email) {
            await this.notificationsService.sendEmail(
                session.trainer.email,
                `Session Re-assigned: ${session.title}`,
                `You have been assigned to cover session "${session.title}" on ${new Date(session.startTime).toLocaleString()}.`
            );
        }

        return session;
    }

    async addFeedback(sessionId: string, feedback: string, rating: number) {
        return this.prisma.session.update({
            where: { id: sessionId },
            data: {
                feedback,
                feedbackRating: rating,
                status: 'COMPLETED' // Auto-complete on feedback? Optional logic
            }
        });
    }

    async markAttendance(sessionId: string, attendance: any) {
        return this.prisma.session.update({
            where: { id: sessionId },
            data: { attendance }
        });
    }
}
