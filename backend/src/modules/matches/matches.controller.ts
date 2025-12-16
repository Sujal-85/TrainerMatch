import { Controller, Get, Post, Param, UseGuards, Body } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('matches')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) { }

  @Get(':requirementId')
  @Roles('VENDOR_ADMIN', 'VENDOR_USER')
  async getMatches(@Param('requirementId') requirementId: string) {
    const matches = await this.matchesService.getTopMatches(requirementId);
    return {
      requirementId,
      matches: matches.map(match => ({
        trainer: {
          id: match.trainer.id,
          name: match.trainer.name,
          email: match.trainer.email,
          skills: match.trainer.skills,
          tags: match.trainer.tags,
          hourlyRate: match.trainer.hourlyRate,
          location: match.trainer.location,
        },
        score: match.score,
        explanation: match.explanation,
      })),
    };
  }
  @Post(':requirementId/auto-notify')
  @Roles('VENDOR_ADMIN', 'VENDOR_USER')
  async autoNotify(@Param('requirementId') requirementId: string) {
    return this.matchesService.autoNotifyTopMatches(requirementId);
  }
}