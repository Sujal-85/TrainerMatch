import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { RequirementsModule } from '../requirements/requirements.module';
import { TrainersModule } from '../trainers/trainers.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, RequirementsModule, TrainersModule, NotificationsModule],
  controllers: [MatchesController],
  providers: [MatchesService],
  exports: [MatchesService],
})
export class MatchesModule { }