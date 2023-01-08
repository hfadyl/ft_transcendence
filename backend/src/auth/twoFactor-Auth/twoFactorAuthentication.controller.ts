import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  ForbiddenException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { twofacCode } from './dto/2faCode.dto';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';

@Controller('2fa')
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twofac: TwoFactorAuthenticationService,
    private readonly userService: UsersService,
    private config: ConfigService,
  ) {}
  //Route: "http://localhost:8000/api/2fa/generate" to generate the secret and the qr code
  @UseGuards(AuthGuard('jwt'))
  @Get('generate')
  async register(@Res() response: Response, @Req() request: Request) {
    const { otpauthUrl } = await this.twofac.generateSecret(request.user);
    return this.twofac.pipeQrCodeStream(response, otpauthUrl);
  }

  isNumber(str: string) {
    const pattern = /^\d+$/;
    return pattern.test(str);
  }

  validateData(code: string) {
    if (!code) {
      throw new ForbiddenException('Code is required');
    }
    if (!this.isNumber(code)) {
      throw new ForbiddenException('Code must be a number');
    }
    if (code.length !== 6) {
      throw new ForbiddenException('Code must be 6 digits');
    }
  }

  //Route: "http://localhost:8000/api/2fa/turn-on" to validate the code and turn on the 2fa
  @UseGuards(AuthGuard('jwt'))
  @Post('turn-on')
  @HttpCode(200)
  async turnOnTwoFactorAuth(@Req() request, @Body() twofacCode: twofacCode) {
    this.validateData(twofacCode.code);
    const isCodeValid = this.twofac.isTwoFactorAuthenticationValid(
      twofacCode.code,
      request.user,
    );
    if (!isCodeValid) {
      throw new ForbiddenException('Wrong Authentication Code');
    }
    await this.userService.turnOnTwoFactorAuthentication(request.user.email);
    return { statusCode: 200, message: 'Authenticated' };
  }

  //Route: "http://localhost:8000/api/2fa/authenticate" to validate the code and authenticate the user
  @UseGuards(AuthGuard('checkJwt'))
  @Post('authenticate')
  @HttpCode(200)
  async authenticate(@Req() request, @Body() twofacCode: twofacCode) {
    this.validateData(twofacCode.code);
    const isCodeValid = this.twofac.isTwoFactorAuthenticationValid(
      twofacCode.code,
      request.user,
    );
    if (!isCodeValid) {
      throw new ForbiddenException('Wrong Authentication Code');
    }
    const cookie = await this.userService.signToken(request.user['id']);
    return { statusCode: 200, message: 'Authenticated', jwt: cookie };
  }

  //Route: "http://localhost:8000/api/2fa/disable2fa" to disable the 2fa
  @UseGuards(AuthGuard('jwt'))
  @Post('disable2fa')
  @HttpCode(200)
  async disable2fa(@Req() request) {
    await this.twofac.disableTwoFactorAuthentication(request.user);
    return { statusCode: 200, message: '2fa disabled' };
  }
}
