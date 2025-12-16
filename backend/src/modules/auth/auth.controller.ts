import { Controller, Post, Body, UseGuards, Request, Get, Response, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(
      createUserDto.email,
      createUserDto.password,
      createUserDto.role,
      createUserDto.vendorId,
    );
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    if (req.user?.isNew) {
      // User authenticated with Firebase but not in Postgres
      // Return a status indicating profile needed, or null
      return { isNew: true, message: 'Profile not created' };
    }
    return req.user;
  }

  @Get('linkedin')
  linkedinLogin(@Response() res) {
    const url = this.authService.getLinkedInAuthUrl();
    res.redirect(url);
  }

  @Get('linkedin/callback')
  async linkedinCallback(@Query('code') code: string, @Response() res) {
    try {
      const customToken = await this.authService.handleLinkedInCallback(code);
      // Redirect to frontend with the custom token
      // Assuming frontend is running on localhost:3000 for dev env
      // Ideally this URL should be configurable via env vars (FRONTEND_URL)
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/auth/linkedin-callback?token=${customToken}`);
    } catch (error) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/auth/login?error=linkedin_auth_failed`);
    }
  }

  @UseGuards(FirebaseAuthGuard)
  @Post('sync-profile')
  async syncProfile(@Request() req, @Body() body: any) {
    // req.user has { uid, email, isNew: true } if from our updated strategy
    const { uid, email } = req.user;

    // Call service to create user with correct role and extra data
    return this.authService.syncProfile(uid, email, body);
  }
}
