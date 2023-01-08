import { UsersModule } from 'src/users/users.module';
import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';

@Module({
  imports: [UsersModule],
  providers: [GameService, GameGateway],
  controllers: [GameController],
})
export class GameModule {}
