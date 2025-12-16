import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { RequirementsService } from './requirements.service';
import { RequirementsController } from './requirements.controller';
import { AiModule } from '../ai/ai.module';
import { ProposalsModule } from '../proposals/proposals.module';

@Module({
  imports: [PrismaModule, ProposalsModule, AiModule],
  controllers: [RequirementsController],
  providers: [RequirementsService],
  exports: [RequirementsService],
})
export class RequirementsModule { }