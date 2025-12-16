import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TrainersService {
  constructor(private prisma: PrismaService) { }

  async findOne(id: string) {
    return this.prisma.trainer.findUnique({
      where: { id },
      include: {
        user: true,
        availability: true,
        ratings: true,
      }
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.trainer.findUnique({
      where: { userId },
      include: {
        user: true,
        availability: true,
      }
    });
  }

  async findAll() {
    return this.prisma.trainer.findMany({
      include: {
        user: true,
      }
    });
  }

  async create(data: any) {
    return this.prisma.trainer.create({
      data,
    });
  }

  async update(id: string, data: any) {
    return this.prisma.trainer.update({
      where: { id },
      data,
    });
  }

  async getStats(trainerId: string) {
    const matchesCount = await this.prisma.match.count({
      where: { trainerId }
    });

    const proposalsCount = await this.prisma.proposal.count({
      where: {
        trainerId,
        status: { in: ['SUBMITTED', 'ACCEPTED'] }
      }
    });

    const ratingsAgg = await this.prisma.rating.aggregate({
      _avg: { score: true },
      where: { trainerId }
    });

    return {
      views: 1240, // Mock for now as we don't track views
      matches: matchesCount,
      proposals: proposalsCount,
      rating: ratingsAgg._avg.score || 0
    };
  }

  async getAvailability(trainerId: string) {
    return this.prisma.trainerAvailability.findMany({
      where: { trainerId },
      orderBy: { date: 'asc' }
    });
  }

  async addAvailability(trainerId: string, data: any) {
    return this.prisma.trainerAvailability.create({
      data: {
        trainerId,
        date: new Date(data.date),
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : false, // Default to blocked if not specified
      }
    });
  }
}