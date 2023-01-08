import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { FortyTwoStrategy } from './utils/FortyTwoStrategy';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule, PassportSerializer } from '@nestjs/passport';
import { JwtStrategy } from './utils/jwt.strategy';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    JwtModule.register({}),
    PassportModule.register({ defaultStrategy: '42' }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [FortyTwoStrategy, AuthService, JwtStrategy],
})
export class AuthModule {}
