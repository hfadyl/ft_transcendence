import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserGateway } from './users.gateway';
import { MulterModule } from '@nestjs/platform-express';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [
    JwtModule.register({}),
    MulterModule.register({
      dest: './uploads',
    }),
    ChatModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UserGateway, JwtService],
  exports: [UsersService, UserGateway],
})
export class UsersModule {}
