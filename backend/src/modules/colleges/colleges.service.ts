import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CollegesService {
    constructor(private prisma: PrismaService) { }

    async create(data: any, vendorId: string) {
        // Create college with initial contact if provided
        const { contacts, ...collegeData } = data;

        const college = await this.prisma.college.create({
            data: {
                ...collegeData,
                vendorId: vendorId,
                status: 'Proposal Prepared', // Default status
                activities: {
                    create: {
                        type: 'STATUS_CHANGE',
                        description: 'College created and Proposal Sent to Draft.',
                        performedBy: 'System'
                    }
                },
                contacts: contacts ? {
                    create: contacts.map(c => ({
                        name: c.name,
                        email: c.email,
                        phone: c.phone,
                        // role is not in schema directly but usually stored in description or separate field if needed. 
                        // For now assuming schema Contact matches input or ignoring extra fields.
                        // Wait, looking at schema, Contact only has name, email, phone. 
                        // If user sent role, we might lose it unless we added it to schema.
                        // I will assume for now we just store basics.
                    }))
                } : undefined
            },
            include: {
                contacts: true
            }
        });

        return college;
    }

    async findAll(vendorId?: string) {
        const where = vendorId ? { vendorId } : {};
        return this.prisma.college.findMany({
            where,
            include: {
                contacts: true,
                _count: {
                    select: { requirements: true }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });
    }

    async findOne(id: string) {
        return this.prisma.college.findUnique({
            where: { id },
            include: {
                contacts: true,
                activities: {
                    orderBy: { createdAt: 'desc' }
                },
                requirements: {
                    include: {
                        collegeProposals: true
                    }
                },
                vendor: true,
                documents: true,
            }
        });
    }

    async updateStatus(id: string, status: string, userId: string) {
        return this.prisma.college.update({
            where: { id },
            data: {
                status,
                lastAction: `Status updated to ${status}`,
                activities: {
                    create: {
                        type: 'STATUS_CHANGE',
                        description: `Status updated to "${status}"`,
                        performedBy: userId
                    }
                }
            }
        });
    }

    async addActivity(id: string, data: { type: string, description: string, performedBy: string }) {
        return this.prisma.college.update({
            where: { id },
            data: {
                lastAction: data.description,
                activities: {
                    create: data
                }
            }
        });
    }

    // AI Logic: Checks for colleges stuck in 'Proposal Sent' for > 3 days
    async runAutoFollowUpScheduler() {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        const collegesToFollowUp = await this.prisma.college.findMany({
            where: {
                status: 'Proposal Sent',
                updatedAt: {
                    lt: threeDaysAgo
                },
                // Avoid infinite loop if we already flagged it
                NOT: {
                    activities: {
                        some: {
                            type: 'AI_FOLLOW_UP',
                            createdAt: { gt: threeDaysAgo }
                        }
                    }
                }
            }
        });

        const results = [];
        for (const college of collegesToFollowUp) {
            const updated = await this.prisma.college.update({
                where: { id: college.id },
                data: {
                    status: 'AI Auto Follow-Up Initiated',  // or keep same status but add flag
                    lastAction: 'AI initiated auto-follow up',
                    activities: {
                        create: {
                            type: 'AI_FOLLOW_UP',
                            description: 'No response for 3 days. AI suggests sending follow-up email.',
                            performedBy: 'AI Agent'
                        }
                    }
                }
            });
            results.push(updated);
        }
        return { processed: results.length, colleges: results.map(c => c.name) };
    }
}
