import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService
  ) { }

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        passwordHash: createUserDto.passwordHash || null,
        role: createUserDto.role as any,
        vendorId: createUserDto.vendorId,
        firebaseUid: createUserDto.firebaseUid,
      },
    });

    // Send Welcome Email
    if (user.email) {
      await this.notificationsService.sendEmail(
        user.email,
        'Welcome to TrainerMatch!',
        'Thank you for signing up. We are excited to have you on board.'
      );
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { trainer: true },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async createVendorForUser(name: string) {
    return this.prisma.vendor.create({
      data: {
        name: name,
        description: 'Auto-created vendor organization'
      }
    });
  }

  async findFirstVendor() {
    return this.prisma.vendor.findFirst();
  }

  async update(id: string, data: any) {
    return this.prisma.user.update({
      where: { id },
      data,
      include: { vendor: true }
    });
  }

  async createTrainerProfile(userId: string, data: any) {
    // Fallback for name to avoid errors
    const name = data.displayName || data.fullName || data.name || data.email?.split('@')[0] || 'Trainer';

    return this.prisma.trainer.create({
      data: {
        userId: userId,
        name: name,
        email: data.email,
        skills: Array.isArray(data.skills) ? data.skills : [],
        location: data.location || null,
        bio: data.experience ? `Experience: ${data.experience}` : null,
        tags: [],
      }
    });
  }

  async createTrainerWithUser(userData: CreateUserDto, trainerData: any) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: userData.email,
          passwordHash: userData.passwordHash || null,
          role: userData.role as any,
          vendorId: userData.vendorId,
          firebaseUid: userData.firebaseUid,
        },
      });

      // Validating Name
      const name = trainerData.displayName || trainerData.fullName || userData.email.split('@')[0];

      await tx.trainer.create({
        data: {
          userId: user.id,
          name: name,
          email: userData.email,
          skills: Array.isArray(trainerData.skills) ? trainerData.skills : [],
          location: trainerData.location || null,
          bio: trainerData.experience ? `Experience: ${trainerData.experience}` : null,
          tags: [],
        }
      });

      // Trigger Welcome Email (Non-blocking ideally, but await here is fine for simplicity)
      if (userData.email) {
        // Note: using 'this' inside transaction callback context might be tricky if not arrow function.
        // Since it's an arrow function `async (tx) =>`, `this` should be preserved.
        await this.notificationsService.sendEmail(
          userData.email,
          'Welcome to TrainerMatch!',
          `Hi ${name}, welcome to the platform!`
        ).catch(e => console.error('Failed to send welcome email', e));
      }

      return user;
    });
  }
}
