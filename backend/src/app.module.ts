import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { twoFactorAuthentication } from './auth/twoFactor-Auth/twoFactorAuthentication.module';
import { UsersModule } from './users/users.module';
import { JwtService } from '@nestjs/jwt';
import { ChatModule } from './chat/chat.module';
import { GameModule } from './game/game.module';
import { UserGateway } from './users/users.gateway';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    twoFactorAuthentication,
    UsersModule,
    ChatModule,
    GameModule,
  ],
  controllers: [],
  providers: [JwtService],
})
export class AppModule {}
