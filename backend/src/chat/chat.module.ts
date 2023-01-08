import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [ChatService, ChatGateway, JwtService],
  controllers: [ChatController],
  exports: [ChatGateway],
})
export class ChatModule {}
