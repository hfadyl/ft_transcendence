import { Injectable, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { authenticator } from 'otplib';
import { PrismaService } from 'src/prisma/prisma.service';
import { toFileStream } from 'qrcode';
import { User } from '@prisma/client';

@Injectable()
export class TwoFactorAuthenticationService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  public async generateSecret(user: any) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(
      user.email,
      this.config.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'),
      secret,
    );
    await this.prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        twoFactorAuthenticationSecret: secret,
      },
    });
    return { secret, otpauthUrl };
  }

  public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

  public isTwoFactorAuthenticationValid(
    twoFactorAuthenticationCode: string,
    user: User,
  ) {
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user['twoFactorAuthenticationSecret'],
    });
  }

  public async disableTwoFactorAuthentication(user: User) {
    await this.prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        twoFactorAuthenticationSecret: '',
        twofactor: false,
      },
    });
  }

}
