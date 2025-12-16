import { Controller, Get, Post, Put, Body, Param, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { TrainersService } from './trainers.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('trainers')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class TrainersController {
    constructor(private readonly trainersService: TrainersService) { }

    @Post()
    @Roles('VENDOR_ADMIN', 'SUPER_ADMIN')
    async create(@Body() createTrainerDto: any) {
        return this.trainersService.create(createTrainerDto);
    }

    @Get('profile')
    @Roles('TRAINER', 'SUPER_ADMIN', 'VENDOR_ADMIN')
    async getProfile(@Request() req) {
        const user = req.user;
        const trainer = await this.trainersService.findByUserId(user.id);
        if (!trainer) {
            throw new NotFoundException('Trainer profile not found for this user');
        }
        return trainer;
    }

    @Put('profile')
    @Roles('TRAINER')
    async updateProfile(@Request() req, @Body() updateData: any) {
        const user = req.user;
        const trainer = await this.trainersService.findByUserId(user.id);
        if (!trainer) {
            throw new NotFoundException('Trainer profile not found');
        }
        return this.trainersService.update(trainer.id, updateData);
    }

    @Get('stats')
    @Roles('TRAINER')
    async getStats(@Request() req) {
        const user = req.user;
        const trainer = await this.trainersService.findByUserId(user.id);
        if (!trainer) {
            throw new NotFoundException('Trainer profile not found');
        }
        return this.trainersService.getStats(trainer.id);
    }

    @Get('availability')
    @Roles('TRAINER')
    async getAvailability(@Request() req) {
        const user = req.user;
        const trainer = await this.trainersService.findByUserId(user.id);
        if (!trainer) return [];
        return this.trainersService.getAvailability(trainer.id);
    }

    @Post('availability')
    @Roles('TRAINER')
    async addAvailability(@Request() req, @Body() data: any) {
        const user = req.user;
        const trainer = await this.trainersService.findByUserId(user.id);
        if (!trainer) throw new NotFoundException('Trainer not found');

        return this.trainersService.addAvailability(trainer.id, data);
    }

    @Get()
    @Roles('VENDOR_ADMIN', 'VENDOR_USER', 'SUPER_ADMIN', 'TRAINER')
    async findAll() {
        return this.trainersService.findAll();
    }

    @Get(':id')
    @Roles('VENDOR_ADMIN', 'VENDOR_USER', 'SUPER_ADMIN', 'TRAINER')
    async findOne(@Param('id') id: string) {
        return this.trainersService.findOne(id);
    }
}
