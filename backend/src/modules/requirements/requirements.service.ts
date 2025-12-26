import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class RequirementsService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService
  ) { }

  async findOne(id: string) {
    return this.prisma.requirement.findUnique({
      where: { id },
      include: {
        matches: {
          include: {
            trainer: true
          },
          orderBy: { score: 'desc' }
        },
        proposals: true,
        collegeProposals: true,
        college: true,
        vendor: true
      }
    });
  }

  async findAll() {
    return this.prisma.requirement.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        matches: true,
        proposals: true,
        vendor: true,
        college: true,
        collegeProposals: true,
      }
    });
  }

  async create(data: any) {
    // 1. Create Requirement
    const requirement = await this.prisma.requirement.create({
      data,
    });

    // 2. Automated AI Proposal Generation
    try {
      // Fetch details needed for context
      const college = await this.prisma.college.findUnique({ where: { id: data.collegeId } });
      const vendor = await this.prisma.vendor.findUnique({ where: { id: data.vendorId } });

      if (college && vendor) {
        // Generate content
        const proposalData = await this.aiService.generateProposalJSON(requirement, college, vendor);

        // Save CollegeProposal
        await this.prisma.collegeProposal.create({
          data: {
            requirementId: requirement.id,
            title: proposalData.title,
            modules: proposalData.modules || [],
            timeline: proposalData.timeline || '',
            trainerCount: proposalData.trainerCount || 1,
            costing: parseFloat(proposalData.costing) || (requirement.budgetMin || 0),
            terms: proposalData.terms || '',
            vendorInfo: vendor as any, // Snapshot
            collegeInfo: college as any, // Snapshot
            status: 'DRAFT',
            emailTemplate: JSON.stringify({
              subject: proposalData.emailSubject,
              body: proposalData.emailBody
            })
          }
        });
        console.log(`AI Proposal generated for Requirement ${requirement.id}`);
      }
    } catch (e) {
      console.error('Failed to generate AI proposal:', e);
      // Don't fail the requirement creation, simply log it.
    }

    return requirement;
  }
}