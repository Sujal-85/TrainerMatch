import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PropStatus } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ProposalsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService
  ) { }

  async create(data: any) {
    // Notify Vendor about new proposal?
    // For now, simple return.
    return this.prisma.proposal.create({
      data,
    });
  }

  async updateStatus(id: string, status: string) {
    // Cast status to PropStatus or validate it.
    // Ensure we trigger the correct overload for 'include'
    const proposal = await this.prisma.proposal.update({
      where: { id },
      data: { status: status as PropStatus },
      include: { trainer: true, requirement: true }
    });

    if (proposal.trainer && proposal.trainer.email) {
      if (status === 'ACCEPTED') {
        await this.notificationsService.sendEmail(
          proposal.trainer.email,
          `Proposal Accepted: ${proposal.requirement?.title || 'Training Request'}`,
          `Great news! Your proposal for "${proposal.requirement?.title}" has been accepted. The vendor will contact you shortly.`
        );
      } else if (status === 'REJECTED') {
        await this.notificationsService.sendEmail(
          proposal.trainer.email,
          `Update on Proposal: ${proposal.requirement?.title || 'Training Request'}`,
          `Your proposal for "${proposal.requirement?.title}" was not selected at this time. We encourage you to apply for other opportunities.`
        );
      }
    }
    return proposal;
  }

  async findByRequirementId(requirementId: string) {
    return this.prisma.proposal.findMany({
      where: { requirementId },
    });
  }

  async findAll() {
    return this.prisma.proposal.findMany({
      include: {
        requirement: true,
        trainer: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}