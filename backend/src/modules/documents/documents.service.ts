import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DocumentsService {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        return this.prisma.document.create({
            data,
        });
    }

    async findAll(query: { collegeId?: string; type?: string; searchTerm?: string }) {
        const where: any = {};

        if (query.collegeId) {
            where.collegeId = query.collegeId;
        }
        if (query.type && query.type !== 'ALL') {
            where.type = query.type;
        }
        if (query.searchTerm) {
            where.OR = [
                { title: { contains: query.searchTerm, mode: 'insensitive' } },
                { folderName: { contains: query.searchTerm, mode: 'insensitive' } },
            ];
        }

        return this.prisma.document.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                college: true,
                trainer: true,
                requirement: true,
            }
        });
    }

    async delete(id: string) {
        return this.prisma.document.delete({
            where: { id },
        });
    }
}
