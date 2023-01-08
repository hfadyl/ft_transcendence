import { Email } from './dto/email.dto';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UserGateway } from './users.gateway';
import { UsersService } from './users.service';
import { Helper } from './utils/helper';
import { Notification } from './utils/type';
import { username } from './dto/username.dto';
import { fullname } from './dto/fullname.dto';
import { phonenumber } from './dto/phonenumber.dto';
import { country } from './dto/country.dto';
import { validate_country } from './utils/validate_country';
@Controller('users')
export class UsersController {
  constructor(
    private userservice: UsersService,
    private gateway: UserGateway,
  ) {}

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
    if (!/^[a-zA-Z0-9_-]+$/.test(name))
      throw new ForbiddenException(
        'Name must only contain letters and numbers',
      );
  }

  isUUID(str: string) {
    return str.match(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
    );
  }

  isNumber(str: string) {
    return str.match(/^[0-9]+$/);
  }

  // Route: "http://localhost:8000/api/users/me" to get the current user info
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@Req() req) {
    return {
      id: req.user.id,
      losses: req.user.Losses,
      wins: req.user.Wins,
      avatar: req.user.avatarUrl,
      country: req.user.country,
      email: req.user.email,
      fullName: req.user.fullName,
      username: req.user.login,
      phoneNumber: req.user.phonenumber,
      score: req.user.score,
      twoFactor: req.user.twofactor,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
    };
  }

  // Route: "http://localhost:8000/api/users/updateUsername" to update the userName
  @Put('updateUsername')
  @UseGuards(AuthGuard('jwt'))
  async updateUserName(@Req() req, @Body() body: username) {
    if (!body['username']) {
      throw new ForbiddenException('username is required');
    }
    this.validatename(body['username']);
    if (body['username'] !== req.user.username) {
      const ret = await this.userservice.updateUserName(
        req.user.id,
        body['username'],
      );
      await this.gateway.change_login(req.user.login, body['username']);
      return ret;
    }
  }

  //Route: "http://localhost:8000/api/users/updateEmail" to update the email
  @Put('updateEmail')
  @UseGuards(AuthGuard('jwt'))
  async updateEmail(@Req() req, @Body() body: Email) {
    if (!body['email']) {
      throw new ForbiddenException('email is required');
    }
    return this.userservice.updateEmail(req.user.email, body['email']);
  }

  //Route: "http://localhost:8000/api/users/updatefullName" to update the fullName
  @Put('updatefullName')
  @UseGuards(AuthGuard('jwt'))
  async updateFullName(@Req() req, @Body() body: fullname) {
    if (!body['fullName']) {
      throw new ForbiddenException('Full name is required');
    }
    this.validatename(body['fullName']);
    return this.userservice.updatefullName(req.user.email, body['fullName']);
  }

  //Route: "http://localhost:8000/api/users/updatePhoneNumber" to update phone number
  @Put('updatePhoneNumber')
  @UseGuards(AuthGuard('jwt'))
  async updatePhoneNumber(@Req() req, @Body() body: phonenumber) {
    if (!body['phoneNumber']) {
      throw new ForbiddenException('Phone number is required');
    }
    if (!this.isNumber(body['phoneNumber']))
      throw new ForbiddenException('Phone number must be a number');
    if (body['phoneNumber'].length > 15)
      throw new ForbiddenException('Phone number must be less than that');
    return this.userservice.updatePhoneNumber(req.user, body['phoneNumber']);
  }

  //Route: "http://localhost:8000/api/users/updateCountry" to update country
  @Put('updateCountry')
  @UseGuards(AuthGuard('jwt'))
  async updateCountry(@Req() req, @Body() body: country) {
    if (!body['country']) {
      throw new ForbiddenException('country is required');
    }
    validate_country(body['country']);
    this.validateDataFromInjection(body['country']);
    return this.userservice.updateCountry(req.user, body['country']);
  }

  // Route: "http://localhost:8000/api/users/searchUserbyUsername" to search a user by userName
  // @Get('searchUserbyUsername')
  // @UseGuards(AuthGuard('jwt'))
  // async searchUserBylogin(@Body() body: username) {
  //   if (!body['username']) {
  //     throw new ForbiddenException('Username is required');
  //   }
  //   this.validatename(body['username']);
  //   const login = body['username'];
  //   return this.userservice.searchUserBylogin(login);
  // }

  // Route: "http://localhost:8000/api/users/getAllUsers" to get username and avatar of all users
  @Get('getallUsers')
  @UseGuards(AuthGuard('jwt'))
  async getAllUsers(@Req() req) {
    return this.userservice.getAllUsers(req.user);
  }

  // Route: "http://localhost:8000/api/users/getUser" to get user info by username
  @Get('getUser')
  @UseGuards(AuthGuard('jwt'))
  async getUser(@Req() req) {
    if (!req.query.username)
      throw new ForbiddenException('Username is required');
    this.validatename(req.query.username);
    return this.userservice.getUser(req.user, req.query.username);
  }

  // Route: "http://localhost:8000/api/users/Status" to get the status of the user
  // @Get('Status')
  // @UseGuards(AuthGuard('jwt'))
  // async getStatus(@Req() req) {
  //   return this.userservice.getStatus(req.user.email);
  // }

  // Route: "http://localhost:8000/api/users/Wins" to get the wins of the user
  @Get('Wins')
  @UseGuards(AuthGuard('jwt'))
  async getWins(@Req() req) {
    return this.userservice.getWins(req.user.id);
  }

  // Route: "http://localhost:8000/api/users/Losses" to get the losses of the user
  @Get('Losses')
  @UseGuards(AuthGuard('jwt'))
  async getLosses(@Req() req) {
    return this.userservice.getLosses(req.user.id);
  }

  // Route: "http://localhost:8000/api/users/Level" to get the level of the user
  // @Get('Level')
  // @UseGuards(AuthGuard('jwt'))
  // async getLevel(@Req() req) {
  //   return this.userservice.getLevel(req.user.email);
  // }

  // Route: "http://localhost:8000/api/users/Score" to get the score of the user
  @Get('Score')
  @UseGuards(AuthGuard('jwt'))
  async getScore(@Req() req) {
    return this.userservice.getScore(req.user.id);
  }

  // Route: "http://localhost:8000/api/users/deleteUser" to delete the user
  @Delete('deleteUser')
  @UseGuards(AuthGuard('jwt'))
  async deleteUser(@Req() req) {
    return this.userservice.deleteUser(req.user.id);
  }

  // Route: "http://localhost:8000/api/users/sendFriendRequest" to send a friend request
  @Post('sendFriendRequest')
  @UseGuards(AuthGuard('jwt'))
  async sendFriendRequest(@Req() req) {
    if (!req.query.id) {
      throw new ForbiddenException('Id is required');
    }
    if (!this.isUUID(req.query.id)) {
      throw new ForbiddenException('Id is not valid');
    }
    if (req.query.id === req.user.id) {
      throw new ForbiddenException(
        'You cannot send a friend request to yourself',
      );
    }
    const friendreq = await this.userservice.sendFriendRequest(
      req.user.id,
      req.query.id,
    );
    const notif: Notification = {
      type: 'request',
      reciver: (await this.userservice.getUserById(req.query.id)).login,
      reciverId: req.query.id,
      sender: req.user['login'],
      senderId: req.user['id'],
      message: `${req.user['login']} sent you a friend request`,
      image: req.user['avatarUrl'],
      createdAt: new Date(),
      seen: false,
    };
    await this.userservice.addnotification(notif);
    await this.gateway.sendNotification({
      id: await this.userservice.getnotificationId(
        req.user['id'],
        (
          await this.userservice.getUserById(req.query.id)
        ).id,
      ),
      ...notif,
    });
    return friendreq;
  }

  // Route: "http://localhost:8000/api/users/cancelFriendRequest" to cancel a friend request
  @Delete('cancelFriendRequest')
  @UseGuards(AuthGuard('jwt'))
  async cancelFriendRequest(@Req() req) {
    if (!req.query.id) {
      throw new ForbiddenException('Id is required');
    }
    if (!this.isUUID(req.query.id)) {
      throw new ForbiddenException('Id is not valid');
    }
    if (req.query.id === req.user.id) {
      throw new ForbiddenException(
        'You cannot cancel a friend request to yourself',
      );
    }
    return this.userservice.cancelFriendRequest(req.user.id, req.query.id);
  }

  // Route: "http://localhost:8000/api/users/acceptfriendrequest" to accept a friend request
  @Post('acceptfriendrequest')
  @UseGuards(AuthGuard('jwt'))
  async acceptFriendRequest(@Req() req) {
    if (!req.query.id) throw new ForbiddenException('Id is required');
    if (!this.isUUID(req.query.id)) {
      throw new ForbiddenException('Id is not valid');
    }
    if (req.query.id === req.user.id) {
      throw new ForbiddenException(
        'You cannot accept a friend request to yourself',
      );
    }
    const ret = await this.userservice.acceptFriendRequest(
      req.user,
      req.query.id,
    );
    const notif: Notification = {
      type: 'request',
      reciver: (await this.userservice.getUserById(req.query.id)).login,
      reciverId: req.query.id,
      sender: req.user['login'],
      senderId: req.user['id'],
      message: `${req.user['login']} accepted your friend request`,
      image: req.user['avatarUrl'],
      createdAt: new Date(),
      seen: false,
    };
    await this.userservice.addnotification(notif);
    await this.gateway.sendNotification({
      id: await this.userservice.getnotificationId(
        req.user['id'],
        (
          await this.userservice.getUserById(req.query.id)
        ).id,
      ),
      ...notif,
    });
    return ret;
  }

  //Route: "http://localhost:8000/api/users/unFriend" to unfriend a friend
  @Post('unFriend')
  @UseGuards(AuthGuard('jwt'))
  async unFriend(@Req() req) {
    if (!req.query.id) {
      throw new ForbiddenException('Id is required');
    }
    if (!this.isUUID(req.query.id)) {
      throw new ForbiddenException('Id is not valid');
    }
    if (req.query.id === req.user.id) {
      throw new ForbiddenException('You cannot unfriend yourself');
    }
    return this.userservice.unFriend(req.user, req.query.id);
  }

  // Route: "http://localhost:8000/api/users/declineFriendRequest" to decline a friend request
  @Delete('declineFriendRequest')
  @UseGuards(AuthGuard('jwt'))
  async declineFriendRequest(@Req() req) {
    if (!req.query.id) {
      throw new ForbiddenException('Id is required');
    }
    if (!this.isUUID(req.query.id)) {
      throw new ForbiddenException('Id is not valid');
    }
    if (req.query.id === req.user.id) {
      throw new ForbiddenException(
        'You cannot decline a friend request to yourself',
      );
    }
    return this.userservice.declineFriendRequest(req.user, req.query.id);
  }

  // Route: "http://localhost:8000/api/users/getFriendRequests" to get the friend requests of the user
  @Get('getFriendRequests')
  @UseGuards(AuthGuard('jwt'))
  async getFriendRequests(@Req() req) {
    return this.userservice.getFriendRequests(req.user);
  }

  //Route: "http://localhost:8000/api/users/getFriends" to get the friends of the user
  @Get('getFriends')
  @UseGuards(AuthGuard('jwt'))
  async getFriends(@Req() req) {
    const friends = await this.userservice.getFriends(req.user);
    return friends;
  }

  // Route: "http://localhost:8000/api/users/getFriendbyUsername" to get the friend by username
  @Get('getFriendsByUsername')
  @UseGuards(AuthGuard('jwt'))
  async getFriendByUsername(@Req() req) {
    if (!req.query.username) {
      throw new ForbiddenException('username is required');
    }
    this.validatename(req.query.username);
    return this.userservice.getFriendByUsername(req.user, req.query.username);
  }

  // Route: "http://localhost:8000/api/users/blockUser" to block a user
  @Post('blockUser')
  @UseGuards(AuthGuard('jwt'))
  async Block(@Req() req) {
    if (!req.query.id) {
      throw new ForbiddenException('Id is required');
    }
    if (!this.isUUID(req.query.id)) {
      throw new ForbiddenException('Id is not valid');
    }
    if (req.query.id === req.user.id) {
      throw new ForbiddenException('You cannot block yourself');
    }
    return this.userservice.blockUser(req.user, req.query.id);
  }

  // Route: "http://localhost:8000/api/users/getblockedUsers" to get the blocked users of the user
  @Get('getblockedUsers')
  @UseGuards(AuthGuard('jwt'))
  async getBlockedUsers(@Req() req) {
    return this.userservice.getBlockedUsers(req.user);
  }

  // Route: "http://localhost:8000/api/users/unblockUser" to unblock a user
  @Delete('unblockUser')
  @UseGuards(AuthGuard('jwt'))
  async unblockUser(@Req() req) {
    if (!req.query.id) {
      throw new ForbiddenException('Id is required');
    }
    if (!this.isUUID(req.query.id)) {
      throw new ForbiddenException('Id is not valid');
    }
    if (req.query.id === req.user.id) {
      throw new ForbiddenException('You cannot unblock yourself');
    }
    return this.userservice.unBlockUser(req.user, req.query.id);
  }

  // Route: "http://localhost:8000/api/users/upload" to upload a avatar
  @Post('uploadAvatar')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: Helper.destinationPath,
        filename: Helper.customFileName,
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req) {
    if (!file) throw new ForbiddenException('File is required');
    if (file.size > 1024 * 1024) {
      throw new ForbiddenException('File size must be less than 5MB');
    }
    await this.userservice.upload(req.user, file.filename);
  }

  // Route: "http://localhost:8000/api/users/pictures/:filename" to get avatar
  @Get('pictures/:filename')
  async getPicture(@Param('filename') filename: string, @Res() res) {
    const file = await Helper.checkFile(filename);
    if (!file) throw new ForbiddenException('Picture not found in the server');
    // this.validatename(filename);
    res.sendFile(filename, { root: './uploads' });
  }

  // Route: "http://localhost:8000/api/users/getUserById/:id" to get user by id in param
  @Get('getUserById/:id')
  @UseGuards(AuthGuard('jwt'))
  async getUserById(@Param() param) {
    if (!param.id) throw new ForbiddenException('Id is required');
    if (!this.isUUID(param.id)) {
      throw new ForbiddenException('Id is not valid');
    }
    return await this.userservice.getUserById(param.id);
  }

  @Get('getNotifications')
  @UseGuards(AuthGuard('jwt'))
  async getNotification(@Req() req) {
    return await this.userservice.getNotifications(req.user);
  }

  @Post('notificationsSeen')
  @UseGuards(AuthGuard('jwt'))
  async notificationsSeen(@Req() req) {
    if (!req.query.id) {
      return this.userservice.updateSeen(req.user);
    } else if (!this.isUUID(req.query.id)) {
      throw new ForbiddenException('Id is not valid');
    }
    return await this.userservice.notificationsSeen(req.user, req.query.id);
  }

  @Get('getTopPlayers')
  @UseGuards(AuthGuard('jwt'))
  async getTopPlayers(@Req() req) {
    return await this.userservice.getTopPlayers(req.user);
  }
}
