import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) { }

    async getStats(): Promise<any> {
        try {
            console.log('Fetching stats...');
            if (!this.prisma) {
                throw new Error('Prisma service is not initialized');
            }

            // Fetch only Colleges and Requirements for now
            const [totalColleges, activeRequirements, trainersMatched, sessionsScheduled] = await Promise.all([
                this.prisma.college.count(),
                this.prisma.requirement.count({
                    where: {
                        status: {
                            not: 'DRAFT',
                        },
                    },
                }),
                this.prisma.match.count({
                    where: {
                        status: 'ACCEPTED'
                    }
                }),
                this.prisma.session.count({
                    where: {
                        status: 'SCHEDULED'
                    }
                })
            ]);

            return {
                totalColleges,
                activeRequirements,
                trainersMatched,
                sessionsScheduled,
            };
        } catch (error) {
            console.error('Dashboard Stats Error:', error);
            throw error;
        }
    }

    async getAnalytics(): Promise<any> {
        try {
            const [matches, ratings, requirements] = await Promise.all([
                this.prisma.match.findMany({
                    include: { requirement: true },
                    where: { createdAt: { gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) } }
                }),
                this.prisma.match.findMany({ // Assuming ratings are on matches or trainers, checking schema
                    where: { status: 'ACCEPTED' },
                    include: { trainer: true }
                }),
                this.prisma.requirement.findMany()
            ]);

            // 1. Match Success Data (Last 6 Months)
            const matchSuccessData = this.aggregateMatchSuccess(matches);

            // Calculate overall match success rate for the KPI
            const totalMatches = matches.length;
            const successfulMatches = matches.filter(m => m.status === 'ACCEPTED').length;
            const matchSuccess = totalMatches > 0 ? Math.round((successfulMatches / totalMatches) * 100) : 0;

            // 2. Trainer Performance (Aggregate from matches)
            const trainerPerformanceData = this.aggregateTrainerPerformance(ratings);

            // 3. Category Distribution
            const categoryDistribution = this.aggregateCategoryDistribution(requirements);

            return {
                matchSuccessData,
                trainerPerformanceData,
                categoryDistribution,
                matchSuccess
            };
        } catch (error) {
            console.error('Analytics Error:', error);
            throw error;
        }
    }

    private aggregateMatchSuccess(matches: any[]) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        const data = [];

        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(currentMonth - i);
            const monthName = months[d.getMonth()];

            const monthMatches = matches.filter(m => {
                const md = new Date(m.createdAt);
                return md.getMonth() === d.getMonth() && md.getFullYear() === d.getFullYear();
            });

            const success = monthMatches.filter(m => m.status === 'ACCEPTED').length;
            const total = monthMatches.length;

            data.push({ month: monthName, success, total });
        }
        return data;
    }

    private aggregateTrainerPerformance(matches: any[]) {
        const trainerStats = {};
        matches.forEach(m => {
            if (!m.trainer) return;
            const name = m.trainer.name || m.trainer.email;
            if (!trainerStats[name]) {
                trainerStats[name] = { matches: 0, rating: 4.5 }; // Default rating
            }
            trainerStats[name].matches++;
        });

        return Object.entries(trainerStats)
            .map(([trainer, stats]: [string, any]) => ({ trainer, ...stats }))
            .sort((a, b) => b.matches - a.matches)
            .slice(0, 5);
    }

    private aggregateCategoryDistribution(requirements: any[]) {
        const categories = {};
        let total = 0;
        requirements.forEach(r => {
            if (r.tags && r.tags.length > 0) {
                // Use first tag as category
                const cat = r.tags[0];
                categories[cat] = (categories[cat] || 0) + 1;
                total++;
            } else {
                categories['Other'] = (categories['Other'] || 0) + 1;
                total++;
            }
        });

        return Object.entries(categories)
            .map(([category, count]: [string, number]) => ({
                category: category.charAt(0).toUpperCase() + category.slice(1),
                percentage: Math.round((count / total) * 100)
            }))
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 5);
    }
    async getAdminStats(): Promise<any> {
        try {
            const [totalUsers, totalVendors, totalTrainers, pendingApprovals] = await Promise.all([
                this.prisma.user.count(),
                this.prisma.vendor.count(),
                this.prisma.trainer.count(),
                // Assuming pending approvals might typically be unverified users or specific status
                // For now, let's just count users created in the last 24 hours as a proxy for "new/pending"
                // or if you have a verified field, use that.
                this.prisma.user.count({
                    where: {
                        createdAt: {
                            gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                        }
                    }
                })
            ]);

            const recentUsers = await this.prisma.user.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    vendor: true,
                    trainer: true
                }
            });

            return {
                stats: [
                    { name: 'Total Users', value: totalUsers.toString(), icon: 'Users', change: '+12%', color: 'bg-blue-500' },
                    { name: 'Active Vendors', value: totalVendors.toString(), icon: 'Building2', change: '+5%', color: 'bg-indigo-500' },
                    { name: 'Total Trainers', value: totalTrainers.toString(), icon: 'Activity', change: 'Stable', color: 'bg-emerald-500' },
                    { name: 'New Registrations', value: pendingApprovals.toString(), icon: 'ShieldCheck', change: '24h', color: 'bg-amber-500' },
                ],
                recentUsers
            };
        } catch (error) {
            console.error('Admin Stats Error:', error);
            throw error;
        }
    }
}
