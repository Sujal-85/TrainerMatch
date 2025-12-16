import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('sessions')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class SessionsController {
    constructor(private readonly sessionsService: SessionsService) { }

    @Post()
    @Roles('VENDOR_ADMIN', 'VENDOR_USER')
    async create(@Body() createSessionDto: any) {
        return this.sessionsService.create(createSessionDto);
    }

    @Get()
    @Roles('VENDOR_ADMIN', 'VENDOR_USER', 'TRAINER', 'SUPER_ADMIN')
    async findAll(@Request() req, @Query('trainerId') queryTrainerId?: string) {
        const user = req.user;
        let filterTrainerId = queryTrainerId;

        if (user.role === 'TRAINER') {
            if (!user.trainer?.id) {
                return []; // Or throw error
            }
            filterTrainerId = user.trainer.id;
        }

        return this.sessionsService.findAll(filterTrainerId);
    }

    @Get(':id')
    @Roles('VENDOR_ADMIN', 'VENDOR_USER', 'TRAINER', 'SUPER_ADMIN')
    async findOne(@Param('id') id: string) {
        return this.sessionsService.findOne(id);
    }
    @Patch(':id')
    @Roles('VENDOR_ADMIN', 'VENDOR_USER', 'TRAINER')
    async update(@Param('id') id: string, @Body() updateSessionDto: any) {
        return this.sessionsService.update(id, updateSessionDto);
    }

    @Post(':id/replace-trainer')
    @Roles('VENDOR_ADMIN', 'VENDOR_USER')
    async replaceTrainer(@Param('id') id: string, @Body('trainerId') trainerId: string) {
        return this.sessionsService.updateTrainer(id, trainerId);
    }

    @Post(':id/feedback')
    @Roles('TRAINER', 'VENDOR_ADMIN')
    async addFeedback(@Param('id') id: string, @Body() body: { feedback: string, rating: number }) {
        return this.sessionsService.addFeedback(id, body.feedback, body.rating);
    }

    @Post(':id/attendance')
    @Roles('TRAINER', 'VENDOR_ADMIN')
    async markAttendance(@Param('id') id: string, @Body() body: { attendance: any }) {
        return this.sessionsService.markAttendance(id, body.attendance);
    }
}
