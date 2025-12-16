import { Controller, Get, Post, Put, Body, Param, UseGuards, Req } from '@nestjs/common';
import { CollegesService } from './colleges.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('colleges')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class CollegesController {
    constructor(private readonly collegesService: CollegesService) { }

    @Post()
    @Roles('VENDOR_ADMIN', 'SUPER_ADMIN')
    async create(@Body() createCollegeDto: any, @Req() req: any) {
        // Assume user has a vendorId attached to their profile/request
        // For now, if not present in request user, we might mock or take from body
        const vendorId = req.user?.vendorId || createCollegeDto.vendorId;
        console.log('Create College Request:', { body: createCollegeDto, user: req.user, vendorId });
        if (!vendorId && req.user.role !== 'SUPER_ADMIN') {
            // In real app, throw Forbidden or Bad Request
        }
        return this.collegesService.create(createCollegeDto, vendorId);
    }

    @Get()
    @Roles('VENDOR_ADMIN', 'VENDOR_USER', 'SUPER_ADMIN')
    async findAll(@Req() req: any) {
        // Filter by user's vendor
        const user = req.user;

        // If the user has a vendorId, filter by it.
        // If Super Admin has no vendorId, they might see all (optional logic)
        // But for "one vendor in firebase" request, we enforce vendorId filter if present.

        const vendorId = user?.vendorId;

        // If vendorId is present, we strictly filter by it.
        // If not (e.g. maybe Super Admin), we might return all (or none if strict).
        // Based on request "use its id then according fetch the colleges", we prioritize vendorId.

        return this.collegesService.findAll(vendorId);
    }

    @Post('ai/trigger-follow-up')
    @Roles('VENDOR_ADMIN', 'SUPER_ADMIN')
    async triggerAiFollowUp() {
        return this.collegesService.runAutoFollowUpScheduler();
    }

    @Get(':id')
    @Roles('VENDOR_ADMIN', 'VENDOR_USER', 'SUPER_ADMIN')
    async findOne(@Param('id') id: string) {
        return this.collegesService.findOne(id);
    }

    @Put(':id/status')
    @Roles('VENDOR_ADMIN', 'SUPER_ADMIN')
    async updateStatus(
        @Param('id') id: string,
        @Body('status') status: string,
        @Req() req: any
    ) {
        return this.collegesService.updateStatus(id, status, req.user?.uid || 'user');
    }

    @Post(':id/activities')
    @Roles('VENDOR_ADMIN', 'SUPER_ADMIN', 'VENDOR_USER')
    async addActivity(
        @Param('id') id: string,
        @Body() body: { type: string, description: string },
        @Req() req: any
    ) {
        return this.collegesService.addActivity(id, {
            ...body,
            performedBy: req.user?.uid || 'user'
        });
    }
}
