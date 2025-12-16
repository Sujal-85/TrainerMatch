import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AiService } from './ai.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('ai')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class AiController {
    constructor(private readonly aiService: AiService) { }

    @Post('generate-proposal')
    @Roles('TRAINER', 'trainer')
    async generateProposal(@Body() body: { requirement: string, trainerProfile: string }) {
        return this.aiService.generateProposal(body.requirement, body.trainerProfile);
    }

    @Post('interpret-requirements')
    @Roles('VENDOR_ADMIN', 'VENDOR_USER', 'VENDOR', 'vendor')
    async interpretRequirements(@Body() body: { text: string }) {
        return this.aiService.interpretRequirements(body.text);
    }
}
