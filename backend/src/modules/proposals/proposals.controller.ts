import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('proposals')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class ProposalsController {
    constructor(private readonly proposalsService: ProposalsService) { }

    @Post()
    @Roles('TRAINER')
    async create(@Body() createProposalDto: any) {
        return this.proposalsService.create(createProposalDto);
    }

    @Post(':id/status')
    @Roles('VENDOR_ADMIN', 'VENDOR_USER', 'SUPER_ADMIN')
    async updateStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.proposalsService.updateStatus(id, status);
    }

    @Get()
    @Roles('VENDOR_ADMIN', 'VENDOR_USER', 'SUPER_ADMIN')
    async findAll() {
        return this.proposalsService.findAll();
    }

    @Get('requirement/:id')
    @Roles('VENDOR_ADMIN', 'VENDOR_USER', 'SUPER_ADMIN')
    async findByRequirement(@Param('id') id: string) {
        return this.proposalsService.findByRequirementId(id);
    }
}
