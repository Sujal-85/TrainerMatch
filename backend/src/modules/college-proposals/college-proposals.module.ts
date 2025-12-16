import { Module } from '@nestjs/common';
import { CollegeProposalsService } from './college-proposals.service';
import { CollegeProposalsController } from './college-proposals.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [CollegeProposalsController],
    providers: [CollegeProposalsService],
    exports: [CollegeProposalsService]
})
export class CollegeProposalsModule { }
