import { Controller, Get, Post, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('documents')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) { }

    @Post()
    @Roles('VENDOR_ADMIN', 'VENDOR_USER', 'TRAINER')
    async create(@Body() data: any) {
        return this.documentsService.create(data);
    }

    @Get()
    @Roles('VENDOR_ADMIN', 'VENDOR_USER', 'TRAINER')
    async findAll(@Query() query: any) {
        return this.documentsService.findAll(query);
    }

    @Delete(':id')
    @Roles('VENDOR_ADMIN')
    async delete(@Param('id') id: string) {
        return this.documentsService.delete(id);
    }
}
