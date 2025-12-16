import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RequirementsService } from '../requirements/requirements.service';
import { TrainersService } from '../trainers/trainers.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class MatchesService {
  constructor(
    private prisma: PrismaService,
    private requirementsService: RequirementsService,
    private trainersService: TrainersService,
    private notificationsService: NotificationsService
  ) { }

  /**
   * Calculate match score between a requirement and a trainer
   * Factors considered:
   * 1. Skills/Tags overlap (25% weight)
   * 2. Domain expertise overlap (15% weight)
   * 3. Location distance (20% weight)
   * 4. Availability check (20% weight)
   * 5. Budget fit (10% weight)
   * 6. Rating weight (10% weight)
   */
  async calculateMatchScore(requirementId: string, trainerId: string): Promise<{ score: number; explanation: string }> {
    const requirement = await this.requirementsService.findOne(requirementId);
    const trainer = await this.trainersService.findOne(trainerId);

    if (!requirement || !trainer) {
      throw new Error('Requirement or trainer not found');
    }

    // 1. Tags overlap calculation (25% weight)
    const tagsOverlapScore = this.calculateTagsOverlap(requirement.tags, trainer.tags);

    // 2. Domain overlap calculation (15% weight) - using strings for now
    // Assuming requirement title or description might contain domain keywords if not explicit field
    // For now, let's assume we check if any domain matches requirement tags or text
    const domainScore = this.calculateDomainOverlap(requirement.tags, trainer.domain || []);

    // 3. Location distance calculation (20% weight)
    const locationScore = this.calculateLocationScore(
      requirement.location,
      trainer.latitude,
      trainer.longitude
    );

    // 4. Availability check (20% weight)
    const availabilityScore = await this.checkAvailability(requirement.startDate, requirement.endDate, trainerId);

    // 5. Budget fit (10% weight)
    const budgetScore = this.calculateBudgetFit(requirement.budgetMin, requirement.budgetMax, trainer.hourlyRate);

    // 6. Rating weight (10% weight)
    const ratingScore = await this.calculateRatingWeight(trainerId);

    // Weighted average calculation
    const finalScore = (
      tagsOverlapScore * 0.25 +
      domainScore * 0.15 +
      locationScore * 0.20 +
      availabilityScore * 0.20 +
      budgetScore * 0.10 +
      ratingScore * 0.10
    );

    // Create explanation
    const explanation = `
      Skills Match: ${Math.round(tagsOverlapScore * 100)}% (25%)
      Domain Expertise: ${Math.round(domainScore * 100)}% (15%)
      Location Proximity: ${Math.round(locationScore * 100)}% (20%)
      Availability: ${Math.round(availabilityScore * 100)}% (20%)
      Budget Fit: ${Math.round(budgetScore * 100)}% (10%)
      Rating: ${Math.round(ratingScore * 100)}% (10%)
      Final Score: ${Math.round(finalScore * 100)}%
    `.trim();

    return {
      score: parseFloat(finalScore.toFixed(2)),
      explanation,
    };
  }

  private calculateDomainOverlap(reqTags: string[], trainerDomains: string[]): number {
    if (!reqTags?.length || !trainerDomains?.length) return 0.5; // Neutral if missing info
    const match = trainerDomains.some(d => reqTags.some(t => t.toLowerCase().includes(d.toLowerCase())));
    return match ? 1 : 0;
  }

  async autoNotifyTopMatches(requirementId: string) {
    const topMatches = await this.getTopMatches(requirementId);
    const requirement = await this.requirementsService.findOne(requirementId);

    const results = [];
    console.log(`Auto-notifying for Requirement: ${requirementId}, Total Matches: ${topMatches.length}`);

    for (const match of topMatches) {
      if (match.score > 0.7) {
        try {
          console.log(`Notifying trainer: ${match.trainer.email}`);
          await this.notificationsService.notifyTrainerMatch(
            match.trainer.id,
            requirement.title,
            Math.round(match.score * 100)
          );
          results.push(match.trainer.email);
        } catch (error) {
          console.error(`Failed to notify trainer ${match.trainer.id}:`, error);
          // Continue with other trainers even if one fails
        }
      }
    }
    return { notified: results.length, trainers: results };
  }

  /**
   * Calculate tags overlap between requirement and trainer
   */
  private calculateTagsOverlap(reqTags: string[], trainerTags: string[]): number {
    if (!reqTags || reqTags.length === 0 || !trainerTags || trainerTags.length === 0) {
      return 0;
    }

    const intersection = reqTags.filter(tag => trainerTags.includes(tag));
    return intersection.length / Math.max(reqTags.length, trainerTags.length);
  }

  /**
   * Calculate location score using Haversine formula
   */
  private calculateLocationScore(
    requirementLocation: string | null,
    trainerLat: number | null,
    trainerLng: number | null
  ): number {
    // If either location is not specified, give neutral score
    if (!requirementLocation || trainerLat === null || trainerLng === null) {
      return 0.5;
    }

    // Parse requirement location (assuming format "lat,lng")
    const [reqLatStr, reqLngStr] = requirementLocation.split(',');
    if (!reqLatStr || !reqLngStr) {
      return 0.5;
    }

    const reqLat = parseFloat(reqLatStr.trim());
    const reqLng = parseFloat(reqLngStr.trim());

    if (isNaN(reqLat) || isNaN(reqLng)) {
      return 0.5;
    }

    // Calculate distance using Haversine formula
    const distance = this.haversineDistance(reqLat, reqLng, trainerLat, trainerLng);

    // Convert distance to score (closer = higher score)
    // Assuming 100km as maximum distance for good match
    const maxDistance = 100;
    const score = Math.max(0, 1 - distance / maxDistance);
    return score;
  }

  /**
   * Haversine formula to calculate distance between two points
   */
  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Check trainer availability for given dates
   */
  private async checkAvailability(
    startDate: Date | null,
    endDate: Date | null,
    trainerId: string
  ): Promise<number> {
    if (!startDate || !endDate) {
      return 0.5; // Neutral score if dates not specified
    }

    // Check if trainer has availability entries for the required period
    const availability = await this.prisma.trainerAvailability.findMany({
      where: {
        trainerId,
        date: {
          gte: startDate,
          lte: endDate,
        },
        isAvailable: true,
      },
    });

    // Calculate how many days are covered
    const requirementDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (requirementDays <= 0) {
      return 0.5;
    }

    const availableDays = availability.length;
    return Math.min(1, availableDays / requirementDays);
  }

  /**
   * Calculate budget compatibility
   */
  private calculateBudgetFit(
    budgetMin: number | null,
    budgetMax: number | null,
    hourlyRate: number | null
  ): number {
    if (budgetMin === null || budgetMax === null || hourlyRate === null) {
      return 0.5; // Neutral score if budget not specified
    }

    if (hourlyRate >= budgetMin && hourlyRate <= budgetMax) {
      return 1; // Perfect fit
    }

    // If outside range, calculate how far off it is
    if (hourlyRate < budgetMin) {
      // Trainer is cheaper than minimum - might be inexperienced
      const diff = budgetMin - hourlyRate;
      const percentage = diff / budgetMin;
      return Math.max(0, 1 - percentage);
    } else {
      // Trainer is more expensive than maximum
      const diff = hourlyRate - budgetMax;
      const percentage = diff / budgetMax;
      return Math.max(0, 1 - percentage);
    }
  }

  /**
   * Calculate rating weight
   */
  private async calculateRatingWeight(trainerId: string): Promise<number> {
    const ratings = await this.prisma.rating.findMany({
      where: { trainerId },
    });

    if (ratings.length === 0) {
      return 0.5; // Neutral score if no ratings
    }

    // Calculate average rating (1-5 scale)
    const totalScore = ratings.reduce((sum, rating) => sum + rating.score, 0);
    const averageRating = totalScore / ratings.length;

    // Normalize to 0-1 scale
    return (averageRating - 1) / 4;
  }

  /**
   * Get top 5 matched trainers for a requirement
   */
  async getTopMatches(requirementId: string): Promise<any[]> {
    // Get all trainers
    const trainers = await this.prisma.trainer.findMany();

    // Calculate scores for each trainer
    const scoredTrainers = [];
    for (const trainer of trainers) {
      try {
        const scoreData = await this.calculateMatchScore(requirementId, trainer.id);
        scoredTrainers.push({
          trainer,
          score: scoreData.score,
          explanation: scoreData.explanation,
        });
      } catch (error) {
        // Skip trainers that can't be scored
        console.error(`Error scoring trainer ${trainer.id}:`, error);
      }
    }

    // Sort by score descending and take top 5
    scoredTrainers.sort((a, b) => b.score - a.score);
    return scoredTrainers.slice(0, 5);
  }
}