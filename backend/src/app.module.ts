import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { VendorsModule } from './modules/vendors/vendors.module';
import { CollegesModule } from './modules/colleges/colleges.module';
import { RequirementsModule } from './modules/requirements/requirements.module';
import { ProposalsModule } from './modules/proposals/proposals.module';
import { TrainersModule } from './modules/trainers/trainers.module';
import { MatchesModule } from './modules/matches/matches.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AiModule } from './modules/ai/ai.module';
import { GoogleModule } from './modules/google/google.module';
import { PrismaModule } from './prisma/prisma.module';

import { CollegeProposalsModule } from './modules/college-proposals/college-proposals.module';
import { UploadsModule } from './modules/uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    VendorsModule,
    CollegesModule,
    RequirementsModule,
    ProposalsModule,
    CollegeProposalsModule,
    TrainersModule,
    MatchesModule,
    SessionsModule,
    DocumentsModule,
    NotificationsModule,
    DashboardModule,
    AiModule,
    GoogleModule,
    UploadsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }