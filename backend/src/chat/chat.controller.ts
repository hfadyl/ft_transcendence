import {
  Controller,
  Get,
  Post,
  Req,
  Body,
  ForbiddenException,
  Delete,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { joinRoom } from './dto/joinRoom.dto';
import { createRoom } from './dto/createRoom.dto';
import { rid_uid } from './dto/rid_uid.dto';
import { roomId } from './dto/roomid.dto';
import { muteUser } from './dto/muteuser.dto';

@Controller('chat')
@UseGuards(AuthGuard('jwt'))
export class ChatController {
  constructor(private chatservice: ChatService) {}

  validateDataFromInjection(data: string) {
    if (!/^[a-zA-Z0-9_-]+$/.test(data))
      throw new ForbiddenException(
        'Input must only contain letters and numbers',
      );
  }

  validatename(name: string) {
    if (name.length < 4)
      throw new ForbiddenException('Name must be at least 4 characters long');
    if (name.length > 20)
      throw new ForbiddenException('Name must be at most 20 characters long');
    if (!/^[\s\w]{3,20}$/.test(name))
      throw new ForbiddenException(
        'Invalid name, don not use special characters',
      );
  }

  validatePassword(password: string) {
    if (password.length < 6)
      throw new ForbiddenException(
        'Password must be at least 8 characters long',
      );
    if (password.length > 20)
      throw new ForbiddenException(
        'Password must be at most 20 characters long',
      );
  }

  // Route Post: "http://localhost:8000/api/chat/createRoom" to create room takes body: name, state, participants, password
  @Post('createRoom')
  async createRoom(@Req() req, @Body() body: createRoom) {
    if (!body['name'] && !body['state'] && !body['participants'])
      throw new ForbiddenException(
        'requier name, state and participants of room',
      );
    if (body['state'] === 'proteced' && !body['password'])
      throw new ForbiddenException('requier password');
    if (
      body['state'] !== 'public' &&
      body['state'] !== 'protected' &&
      body['state'] !== 'private'
    )
      throw new ForbiddenException(
        'state must be public or protected or private',
      );
    if (!body['participants']) body['participants'] = [];
    this.validatename(body['name']);
    if (body['password']) this.validatePassword(body['password']);
    if (body['participants'].length !== 0)
      body['participants'].forEach((element) => {
        this.validateDataFromInjection(element);
      });
    return await this.chatservice.createRoom(
      req.user,
      body['name'],
      body['state'],
      body['password'],
      body['participants'],
    );
  }

  // Route Post: "http://localhost:8000/api/chat/joinRoom" to join a room takes body: roomid
  @Post('joinRoom')
  async joinRoom(@Req() req, @Body() body: joinRoom) {
    if (!body['roomId']) {
      throw new ForbiddenException('requier roomId');
    }
    this.validateDataFromInjection(body['roomId']);
    const state = await this.chatservice.check_state_room(body['roomId']);
    if (state === 'public') {
      return await this.chatservice.join_public_room(
        body['roomId'],
        req.user.id,
      );
    }
    if (state === 'protected') {
      if (!body['password']) {
        throw new ForbiddenException('requier password');
      }
      this.validatePassword(body['password']);
      return await this.chatservice.join_protected_room(
        body['roomId'],
        req.user.id,
        body['password'],
      );
    }
  }

  // Route Post: "http://localhost:8000/api/chat/makeUserAdmin" to make user an admin takes body: roomid, userid
  @Post('makeUserAdmin')
  async makeUserAdmin(@Req() req, @Body() body: rid_uid) {
    if (!body['roomId'] && !body['userId']) {
      throw new ForbiddenException('requier roomId and userId');
    }
    this.validateDataFromInjection(body['roomId']);
    this.validateDataFromInjection(body['userId']);
    if (this.chatservice.check_is_admin(body['roomId'], req.user.id)) {
      return await this.chatservice.make_user_admin(
        body['roomId'],
        body['userId'],
      );
    } else {
      throw new ForbiddenException('you are not admin of this room');
    }
  }

  // Route Post: "http://localhost:8000/api/chat/unmakeUserAdmin" to unmake user an admin takes body: roomid, userid
  @Post('unmakeUserAdmin')
  async unmakeUserAdmin(@Req() req, @Body() body: rid_uid) {
    if (!body['roomId'] && !body['userId']) {
      throw new ForbiddenException('requier roomId and userId');
    }
    this.validateDataFromInjection(body['roomId']);
    this.validateDataFromInjection(body['userId']);
    if (
      this.chatservice.check_is_admin(body['roomId'], req.user.id) ||
      this.chatservice.check_is_owner(body['roomId'], req.user.id)
    ) {
      return await this.chatservice.unmake_user_admin(
        body['roomId'],
        body['userId'],
      );
    } else {
      throw new ForbiddenException('you are not admin or owner of this room');
    }
  }

  // Route Post: "http://localhost:8000/api/chat/banUser" to ban user from a room takes body: roomid, userid
  @Post('banUser')
  async banUser(@Req() req, @Body() body: rid_uid) {
    if (!body['roomId'] && !body['userId']) {
      throw new ForbiddenException('requier roomId and userId');
    }
    this.validateDataFromInjection(body['roomId']);
    this.validateDataFromInjection(body['userId']);
    if (
      (await this.chatservice.check_is_admin(body['roomId'], req.user.id)) ||
      (await this.chatservice.check_is_owner(body['roomId'], req.user.id))
    ) {
      return await this.chatservice.ban_user(body['roomId'], body['userId']);
    } else {
      throw new ForbiddenException('you are not admin or owner of this room');
    }
  }

  // Route Post: "http://localhost:8000/api/chat/unbanUser" to unban user from a room takes body: roomid, userid
  @Post('unbanUser')
  async unbanUser(@Req() req, @Body() body: rid_uid) {
    if (!body['roomId'] && !body['userId']) {
      throw new ForbiddenException('requier roomId and userId');
    }
    this.validateDataFromInjection(body['roomId']);
    this.validateDataFromInjection(body['userId']);
    if (
      (await this.chatservice.check_is_admin(body['roomId'], req.user.id)) ||
      (await this.chatservice.check_is_owner(body['roomId'], req.user.id))
    ) {
      return await this.chatservice.unban_user(body['roomId'], body['userId']);
    } else {
      throw new ForbiddenException('you are not admin or owner of this room');
    }
  }

  // Route Post: "http://localhost:8000/api/chat/muteUser" to mute user from a room takes body: roomid, userid
  @Post('muteUser')
  async muteUser(@Req() req, @Body() body: muteUser) {
    if (!body['roomId'] && !body['userId'] && !body['duration'])
      throw new ForbiddenException('requier roomId and userId and duration');
    this.validateDataFromInjection(body['roomId']);
    this.validateDataFromInjection(body['userId']);
    this.validateDataFromInjection(body['duration']);
    if (
      (await this.chatservice.check_is_admin(body['roomId'], req.user.id)) ||
      (await this.chatservice.check_is_owner(body['roomId'], req.user.id))
    ) {
      return await this.chatservice.mute_user(
        body['roomId'],
        body['userId'],
        body['duration'],
      );
    } else {
      throw new ForbiddenException('you are not admin or owner of this room');
    }
  }

  // Route Post: "http://localhost:8000/api/chat/unMuteUser" to unmute user from a room takes body: roomid, userid
  @Post('unMuteUser')
  async unMuteUser(@Req() req, @Body() body: rid_uid) {
    if (!body['roomId'] && !body['userId']) {
      throw new ForbiddenException('requier roomId and userId');
    }
    this.validateDataFromInjection(body['roomId']);
    this.validateDataFromInjection(body['userId']);
    if (
      this.chatservice.check_is_admin(body['roomId'], req.user.id) ||
      this.chatservice.check_is_owner(body['roomId'], req.user.id)
    ) {
      return await this.chatservice.unmute_user(body['roomId'], body['userId']);
    } else {
      throw new ForbiddenException('you are not admin or owner of this room');
    }
  }

  // Route Post: "http://localhost:8000/api/chat/changePassword" to change password of a room takes body: roomid, password
  @Post('changePassword')
  async changePassword(@Req() req, @Body() body) {
    if (!body['id'] && !body['password']) {
      throw new ForbiddenException('requier id and password');
    }
    this.validateDataFromInjection(body['roomId']);
    if (this.chatservice.check_is_owner(body['id'], req.user.id)) {
      return await this.chatservice.change_password(
        body['id'],
        req.user.id,
        body['password'],
      );
    } else {
      throw new ForbiddenException('you are not owner of this room');
    }
  }

  // Route Detele: "http://localhost:8000/api/chat/deletePassword" to delete password of a room takes body: roomid
  @Delete('deletePassword')
  async deletePassword(@Req() req, @Body() body: roomId) {
    if (!body['roomId']) throw new ForbiddenException('requier roomId');
    this.validateDataFromInjection(body['roomId']);
    if (this.chatservice.check_is_owner(body['roomId'], req.user.id)) {
      return await this.chatservice.delete_password(req.user, body['roomId']);
    } else {
      throw new ForbiddenException('you are not owner of this room');
    }
  }

  // Route Delete: "http://localhost:8000/api/chat/leaveRoom" to leave room takes body: roomid
  @Delete('leaveRoom')
  async leaveRoom(@Req() req, @Body() body: roomId) {
    if (!body['roomId']) {
      throw new ForbiddenException('requier roomId');
    }
    this.validateDataFromInjection(body['roomId']);
    return await this.chatservice.leave_room(body['roomId'], req.user.id);
  }

  // @Get('getRoomsToJoin')
  // async getRoomsJoin(@Req() req) {
  //   return await this.chatservice.get_rooms_join(req.user.id);
  // }

  @Get('getMyRooms')
  async getMyRooms(@Req() req) {
    return await this.chatservice.get_my_rooms(req.user.id);
  }

  @Get('getRoom')
  async getRoom(@Req() req) {
    if (!req.query.id) {
      throw new ForbiddenException('requier id');
    }
    this.validateDataFromInjection(req.query.id);
    return await this.chatservice.get_room(req.user, req.query.id);
  }

  @Get('getLastActiveRoom')
  async getLastActiveRoom(@Req() req) {
    return await this.chatservice.get_last_active_room(req.user.id);
  }

  // Route Get: "http://localhost:8000/api/chat/getRooms" to get rooms
  @Get('getRooms')
  async getRooms(@Req() req) {
    return await this.chatservice.getRooms(req.user);
  }

  // * we may not need this route
  // Route Delete: "http://localhost:8000/api/chat/removeUser" to remove user from a room takes body: roomid, userid
  @Delete('removeUser')
  async removeUser(@Req() req, @Body() body: rid_uid) {
    if (!body['roomId'] && !body['userId']) {
      throw new ForbiddenException('requier roomId and userId');
    }
    if (
      this.chatservice.check_is_admin(body['roomId'], req.user.id) ||
      this.chatservice.check_is_owner(body['roomId'], req.user.id)
    ) {
      return await this.chatservice.remove_user(body['roomId'], body['userId']);
    } else {
      throw new ForbiddenException('you are not admin or owner of this room');
    }
  }

  // * we may not need this route
  // Route Delete: "http://localhost:8000/api/chat/deletRoom" to delete a room takes body: roomid
  // @Delete('deleteRoom')
  // async deleteRoom(@Req() req, @Body() body) {
  //   if (!body['roomid']) {
  //     throw new ForbiddenException('requier roomid');
  //   }
  //   if (this.chatservice.check_is_owner(body['roomid'], req.user.id)) {
  //     return await this.chatservice.delete_room(body['roomid']);
  //   } else {
  //     throw new ForbiddenException('you are not owner of this room');
  //   }
  // }

  // Route Get: "http://localhost:8000/api/chat/getMessages" to get messages of a room takes body: roomid
  // @Get('getMessages')
  // async getMessages(@Req() req, @Body() body: roomId) {
  //   if (!body['roomid']) {
  //     throw new ForbiddenException('requier roomid');
  //   }
  //   return await this.chatservice.get_messages(body['roomid']);
  // }

  // * we may not need this route, but we can use its function to make some user an owner when the owner leaving the room
  // // Route Post: "http://localhost:8000/api/chat/makeUserOwner" to make user an owner takes body: roomid, userid
  // @Post('makeUserOwner')
  // async makeUserOwner(@Req() req, @Body() body) {
  //   if (!body['roomid'] && !body['userid']) {
  //     throw new ForbiddenException('requier roomid and userid');
  //   }
  //   if (this.chatservice.check_is_owner(body['roomdid'], req.user.id)) {
  //     return await this.chatservice.make_user_owner(
  //       body['roomid'],
  //       body['userid'],
  //     );
  //   } else {
  //     throw new ForbiddenException('you are not owner of this room');
  //   }
  // }

  // * we may not need this route
  // Route Post: "http://localhost:8000/api/chat/unmakeUserOwner" to unmake user an owner takes body: roomid, userid
  // @Post('unmakeUserOwner')
  // async unmakeUserOwner(@Req() req, @Body() body) {
  //   if (!body['roomid'] && !body['userid']) {
  //     throw new ForbiddenException('requier roomid and userid');
  //   }
  //   if (this.chatservice.check_is_owner(body['roomid'], req.user.id)) {
  //     return await this.chatservice.unmake_user_owner(
  //       body['roomid'],
  //       body['userid'],
  //     );
  //   } else {
  //     throw new ForbiddenException('you are not owner of this room');
  //   }
  // }

  // * we may not need this route
  // Route Post: "http://localhost:8000/api/chat/addUserToRoom" to add user to a room takes body: roomid, userid
  // @Post('addUserToRoom')
  // async addUserToRoom(@Req() req, @Body() body) {
  //   if (!body['roomid'] && !body['userid']) {
  //     throw new ForbiddenException('requier roomid and userid');
  //   }
  //   return await this.chatservice.addmembership(
  //     body['roomid'],
  //     body['userid'],
  //     req.user,
  //   );
  // }
}
