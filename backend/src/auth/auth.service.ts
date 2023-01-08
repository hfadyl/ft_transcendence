import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async validateUser(details: AuthDto): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        checkID: details.id,
      },
    });
    if (user) return { ...user, firstLogin: false };
    const checkUserName = await this.prisma.user.findUnique({
      where: {
        login: details.username,
      },
    });
    let data = {
      checkID: details.id,
      login: details.username,
      fullName: details.displayName,
      firstName: details.firstName,
      lastName: details.lastName,
      email: details.email,
      avatarUrl: details.avatarUrl,
      twoFactorAuthenticationSecret: '',
    };
    if (checkUserName) {
      data = {
        ...data,
        login: details.username + '_',
      };
    }

    const newUser = await this.prisma.user.create({
      data,
    });
    return { ...newUser, firstLogin: true };
  }
}
