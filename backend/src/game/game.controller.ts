import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GameService } from './game.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('game')
@UseGuards(AuthGuard('jwt'))
export class GameController {
  constructor(private readonly gameService: GameService) {}

  validatename(name: string) {
    if (name.length < 4)
      throw new ForbiddenException('Name must be at least 4 characters long');
    if (name.length > 20)
      throw new ForbiddenException('Name must be at most 20 characters long');
    if (!/^[a-zA-Z0-9_-]+$/.test(name))
      throw new ForbiddenException(
        'Name must only contain letters and numbers',
      );
  }

  @Get('getMatchHistory')
  async getMatchHistory(@Req() req) {
    if (!req.query.username) {
      throw new ForbiddenException('Username not provided');
    }
    this.validatename(req.query.username);
    return await this.gameService.getMatchHistory(req.query.username);
  }
}
