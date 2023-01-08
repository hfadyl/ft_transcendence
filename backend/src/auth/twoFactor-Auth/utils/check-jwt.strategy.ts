import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class checkJwtStrategy extends PassportStrategy(Strategy, 'checkJwt') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          // This is a hack to get the token from the cookie
          let data = request?.headers.cookie;
          if (data) {
            if (data.includes('jwt')) {
              data = data.split('=')[1];
              return data;
            }
          } else {
            return null;
          }
        },
      ]),
      secretOrKey: config.get('checkjwt_secret'),
    });
  }

  async validate(payload: { sub: string }) {
    return this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });
  }
}
