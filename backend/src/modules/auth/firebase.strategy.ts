import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-firebase-jwt';
import * as firebaseAdmin from 'firebase-admin';
import { AuthService } from './auth.service';

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, 'firebase-jwt') {
    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(token: string) {
        try {
            if (firebaseAdmin.apps.length === 0) {
                // Initialize with specific projectId to avoid "Unable to detect a Project Id" error
                // when using applicationDefault() without GOOGLE_APPLICATION_CREDENTIALS set.
                // For simple ID token verification, projectId is sufficient.
                const projectId = process.env.FIREBASE_PROJECT_ID || 'trainermatch-8550';
                firebaseAdmin.initializeApp({
                    projectId: projectId
                });
            }

            const firebaseUser = await firebaseAdmin
                .auth()
                .verifyIdToken(token);

            if (!firebaseUser) {
                throw new UnauthorizedException();
            }

            const user = await this.authService.validateFirebaseUser(firebaseUser);
            if (!user) {
                // If service returns null, user is not in DB and not new (shouldn't happen with updated service)
                throw new UnauthorizedException('User not found in system');
            }
            return user;
        } catch (err) {
            console.log(err);
            throw new UnauthorizedException();
        }
    }
}
