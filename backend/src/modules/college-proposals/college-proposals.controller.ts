import { Controller, Get, Patch, Body, Param } from '@nestjs/common';
import { CollegeProposalsService } from './college-proposals.service';

@Controller('college-proposals')
export class CollegeProposalsController {
    constructor(private readonly service: CollegeProposalsService) { }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() body: any) {
        return this.service.update(id, body);
    }

    @Get(':id/pdf')
    async generatePdf(@Param('id') id: string) {
        return this.service.generatePdf(id);
    }
}
