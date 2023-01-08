import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { TwoFactorAuthenticationController } from './twoFactorAuthentication.controller';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';
import { checkJwtStrategy } from './utils/check-jwt.strategy';

@Module({
  imports: [UsersModule],
  controllers: [TwoFactorAuthenticationController],
  providers: [TwoFactorAuthenticationService, checkJwtStrategy],
})
export class twoFactorAuthentication {}
