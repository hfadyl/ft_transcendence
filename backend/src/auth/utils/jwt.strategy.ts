import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          // This is a hack to get the token from the cookie
          let data = request?.headers.cookie;
          if (data) {
            let token = data.split('; ').find((row) => row.startsWith('jwt='));
            if (token) {
              token = token.split('=')[1];
              return token;
            }
          } else {
            return null;
          }
        },
      ]),
      secretOrKey: config.get('jwt_secret'),
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
