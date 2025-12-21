import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import axios from 'axios';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await this.comparePasswords(pass, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        vendorId: user.vendorId,
      },
    };
  }

  async register(email: string, password: string, role: string, vendorId?: string) {
    const hashedPassword = await this.hashPassword(password);
    const normalizedRole = role ? role.toUpperCase() : 'VENDOR_ADMIN';
    return this.usersService.create({
      email,
      password,
      passwordHash: hashedPassword,
      role: normalizedRole,
      vendorId,
    });
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  private async comparePasswords(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async validateFirebaseUser(firebaseUser: any) {
    const { email, uid } = firebaseUser;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      // Return basic firebase info if user needs to be registered manually
      return {
        email,
        uid,
        isNew: true
      };
    }

    // User exists
    if (!user.vendorId && user.role === 'VENDOR_ADMIN') {
      const seedVendor = await this.usersService.findFirstVendor();
      if (seedVendor) {
        await this.usersService.update(user.id, { vendorId: seedVendor.id });
        user.vendorId = seedVendor.id;
      }
    }

    return user;
  }

  async syncProfile(uid: string, email: string, data: any) {
    const { role } = data;
    let vendorId = undefined;

    // Normalize role
    let normalizedRole = role ? role.toUpperCase() : undefined;
    if (normalizedRole === 'VENDOR') normalizedRole = 'VENDOR_ADMIN';
    if (normalizedRole === 'TRAINER') normalizedRole = 'TRAINER';

    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(email);

    // If role is vendor, create the organization if not already linked
    if ((normalizedRole === 'VENDOR_ADMIN') && (!existingUser || !existingUser.vendorId)) {
      const vendorName = data.companyName || (email.split('@')[0] + "'s Organization");
      const vendor = await this.usersService.createVendorForUser(vendorName);
      vendorId = vendor.id;
    }

    if (existingUser) {
      // Update existing user with role and vendorId if provided
      const finalRole = normalizedRole || existingUser.role;
      return this.usersService.update(existingUser.id, {
        role: finalRole,
        vendorId: vendorId || existingUser.vendorId,
        firebaseUid: uid || existingUser.firebaseUid
      });
    }

    // Create the user if it doesn't exist
    let finalRole = normalizedRole || 'TRAINER';
    if (finalRole === 'VENDOR') finalRole = 'VENDOR_ADMIN';

    // Hardcode Admin for specific email request
    if (email.toLowerCase() === 'admin@gmail.com') {
      finalRole = 'SUPER_ADMIN';
    }

    if (finalRole === 'TRAINER') {
      return this.usersService.createTrainerWithUser({
        email,
        password: '',
        passwordHash: null,
        role: finalRole,
        firebaseUid: uid,
        vendorId
      }, {
        ...data,
        fullName: data.displayName || data.fullName // Ensure name is passed
      });
    }

    const newUser = await this.usersService.create({
      email,
      password: '', // No local password
      passwordHash: null,
      role: finalRole, // Map frontend roles to backend enums
      firebaseUid: uid,
      vendorId,
    });

    return newUser;
  }

  getLinkedInAuthUrl(): string {
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const redirectUri = process.env.LINKEDIN_REDIRECT_URI;
    const scope = 'openid profile email'; // Updated scopes for LinkedIn OpenID Connect

    return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&scope=${encodeURIComponent(scope)}`;
  }

  async handleLinkedInCallback(code: string): Promise<string> {
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    const redirectUri = process.env.LINKEDIN_REDIRECT_URI;

    try {
      // 1. Exchange code for access token
      const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
        params: {
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          client_id: clientId,
          client_secret: clientSecret,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const accessToken = tokenResponse.data.access_token;

      // 2. Fetch user profile (using OpenID UserInfo endpoint for simpler integration)
      const profileResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const profile = profileResponse.data;
      // Profile structure: { sub: 'id', name: 'Name', given_name: 'First', family_name: 'Last', picture: 'url', email: 'email', email_verified: true }

      const email = profile.email;
      const linkedInId = profile.sub;
      const displayName = profile.name;
      const photoURL = profile.picture;

      if (!email) {
        throw new Error('LinkedIn account does not have a verified email.');
      }

      // 3. Find or Create Firebase User
      let uid;
      try {
        const userRecord = await admin.auth().getUserByEmail(email);
        uid = userRecord.uid;

        // Optional: Update user profile if needed
        // await admin.auth().updateUser(uid, { displayName, photoURL });
      } catch (error) {
        if (error.code === 'auth/user-not-found') {
          // Create new user
          const newUser = await admin.auth().createUser({
            email,
            emailVerified: true,
            displayName,
            photoURL,
          });
          uid = newUser.uid;
        } else {
          throw error;
        }
      }

      // 4. Create Custom Token
      const customToken = await admin.auth().createCustomToken(uid, {
        linkedInId,
        provider: 'linkedin',
      });

      return customToken;

    } catch (error) {
      console.error('LinkedIn Auth Error:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with LinkedIn');
    }
  }
}
