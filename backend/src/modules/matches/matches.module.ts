import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { RequirementsModule } from '../requirements/requirements.module';
import { TrainersModule } from '../trainers/trainers.module';
import { NotificationsModule } from '../notifications/notifications.module';

import { AiModule } from '../ai/ai.module';

@Module({
  imports: [PrismaModule, RequirementsModule, TrainersModule, NotificationsModule, AiModule],
  controllers: [MatchesController],
  providers: [MatchesService],
  exports: [MatchesService],
})
export class MatchesModule { }