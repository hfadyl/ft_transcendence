import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request, Response } from 'express';
import { Strategy, Profile } from 'passport-42';
import { AuthService } from '../auth.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private authService: AuthService, private config: ConfigService) {
    super({
      clientID: config.get('clientID'),
      clientSecret: config.get('clientSecret'),
      callbackURL: config.get('callbackURL'),
    });
  }

  async validate(
    accesToken: string,
    refreshToken: string,
    profile: Profile,
    cb: any,
  ) {
    const user = await this.authService.validateUser({
      id: profile.id,
      username: profile.username,
      displayName: profile.displayName,
      lastName: profile.name.familyName,
      firstName: profile.name.givenName,
      email: profile.emails[0].value,
      avatarUrl: profile._json.image.link,
    });
    if (user) cb(null, user);
    else cb(null, false);
    // return user || null;
  }
}
