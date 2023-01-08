import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { ChatGateway } from 'src/chat/chat.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { Notification } from './utils/type';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private chatgateway: ChatGateway,
  ) {}

  async turnOnTwoFactorAuthentication(email: string) {
    return this.prisma.user.update({
      where: { email },
      data: { twofactor: true },
    });
  }

  async signToken(id: string) {
    const payload = {
      sub: id,
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: this.config.get('jwt_expiresIn'),
      secret: this.config.get('jwt_secret'),
    });
    return token;
  }

  async signCheckToken(id: string) {
    const payload = {
      sub: id,
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: this.config.get('jwt_expiresIn'),
      secret: this.config.get('checkjwt_secret'),
    });
    return token;
  }

  async updateUserName(id: string, username: string) {
    const user = await this.prisma.user.findUnique({
      where: { login: username },
    });
    if (!user) {
      return await this.prisma.user.update({
        where: { id },
        data: { login: username },
      });
    } else {
      throw new ForbiddenException('Username already taken');
    }
  }

  async updateEmail(email: string, newEmail: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: newEmail },
    });
    if (!user) {
      return await this.prisma.user.update({
        where: { email },
        data: { email: newEmail },
      });
    } else {
      throw new ForbiddenException('Email already taken');
    }
  }

  async updatefullName(email: string, fullName: string) {
    return await this.prisma.user.update({
      where: { email: email },
      data: { fullName: fullName },
    });
  }

  async updatePhoneNumber(user: User, phoneNumber: string) {
    return await this.prisma.user.update({
      where: { email: user.email },
      data: { phonenumber: phoneNumber },
    });
  }

  async updateCountry(user: User, country: string) {
    return await this.prisma.user.update({
      where: { email: user.email },
      data: { country: country },
    });
  }

  async getAchievements(user: User) {
    const Achievements = await this.prisma.achievements.findMany({
      where: {
        uid: user.id,
      },
      select: {
        number: true,
      },
    });
    var ret = [];
    if (Achievements) {
      Achievements.forEach((element) => {
        ret.push(element.number.toString());
      });
    }
    return ret;
  }

  // async searchUserBylogin(userName: string) {
  //   const user = await this.prisma.user.findUnique({
  //     where: { login: userName },
  //   });
  //   if (user) {
  //     return {
  //       username: user['login'],
  //       avatar: user['avatarUrl'],
  //     };
  //   } else {
  //     throw new ForbiddenException('User Not Found');
  //   }
  // }

  async getAllUsers(user: User) {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        login: true,
        avatarUrl: true,
        score: true,
      },
    });
    return await this.filterfriendsbyblock(users, user);
  }

  async getUser(user: User, username: string) {
    const us = await this.prisma.user.findUnique({
      where: { login: username },
    });
    if (us) {
      const checkstatus = await this.prisma.friendrequest.findFirst({
        where: {
          OR: [
            {
              senderId: user.id,
              receiverId: us.id,
            },
            {
              senderId: us.id,
              receiverId: user.id,
            },
          ],
        },
      });
      let isFriend = false;
      let isBlocked = false;
      let isPending = false;
      let isRequested = false;

      if (checkstatus) {
        if (checkstatus.status === 'pending') {
          if (checkstatus.senderId === user.id) {
            isPending = true;
          } else if (checkstatus.senderId === us.id) {
            isRequested = true;
          } else {
            isPending = false;
          }
        } else if (checkstatus.status === 'blocked') {
          isBlocked = true;
        } else if (checkstatus.status === 'accepted') {
          isFriend = true;
        }
      }
      const howmanyfriends = await this.getFriendByUsername(user, us.login);
      const roomId = await this.prisma.room.findFirst({
        where: {
          is_channel: false,
          //cheeck in membership is hase user and us
          AND: [
            {
              membership: {
                some: {
                  uid: user.id,
                },
              },
            },
            {
              membership: {
                some: {
                  uid: us.id,
                },
              },
            },
          ],
        },
        select: {
          id: true,
        },
      });
      if (isBlocked) {
        throw new ForbiddenException('User Not Found');
      } else if (isFriend) {
        return {
          ...us,
          isFriend: true,
          friends: howmanyfriends.length,
          isPending,
          isRequested,
          roomId: roomId?.id,
          achievements: await this.getAchievements(us),
        };
      } else {
        return {
          ...us,
          isFriend: false,
          friends: howmanyfriends.length,
          isPending,
          isRequested,
          roomId: null,
          achievements: await this.getAchievements(us),
        };
      }
    } else throw new ForbiddenException('User Not Found');
  }

  // async uploadAvatar(email: string, avatar: string) {
  //   return this.prisma.user.update({
  //     where: { email },
  //     data: {
  //       avatarUrl: avatar,
  //     },
  //   });
  // }

  // async getStatus(email: string) {
  //   const user = await this.prisma.user.findUnique({
  //     where: { email },
  //     select: {
  //       status: true,
  //     },
  //   });
  //   return user;
  // }

  async getWins(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        Wins: true,
      },
    });
    return user;
  }

  async getLosses(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        Losses: true,
      },
    });
    return user;
  }

  // async getLevel(email: string) {
  //   const user = await this.prisma.user.findUnique({
  //     where: { email },
  //     select: {
  //       level: true,
  //     },
  //   });
  //   return user;
  // }

  async getScore(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        score: true,
      },
    });
    return user;
  }

  async deleteUser(id: string) {
    // const user = await this.prisma.user.findUnique({
    //   where: { email },
    //   select: {
    //     id: true,
    //   },
    // });
    await this.prisma.friendrequest.deleteMany({
      where: {
        OR: [
          {
            senderId: id,
          },
          {
            receiverId: id,
          },
        ],
      },
    });
    await this.prisma.user.delete({
      where: { id },
    });
    return { message: 'User deleted' };
  }

  async sendFriendRequest(snd_Id: string, rcv_Id: string) {
    const send = await this.prisma.friendrequest.upsert({
      where: {
        senderId_receiverId: {
          senderId: snd_Id,
          receiverId: rcv_Id,
        },
      },
      update: {
        status: 'pending',
      },
      create: {
        senderId: snd_Id,
        receiverId: rcv_Id,
        status: 'pending',
      },
    });
    if (send) {
      return { message: 'Friend request sent' };
    } else throw new ForbiddenException('Friend request not sent');
  }

  async cancelFriendRequest(snd_id: string, rcv_id: string) {
    //check if the request is pending
    const checkstatus = await this.prisma.friendrequest.findFirst({
      where: {
        senderId: snd_id,
        receiverId: rcv_id,
        status: 'pending',
      },
    });
    if (checkstatus) {
      const cancel = await this.prisma.friendrequest.delete({
        where: {
          senderId_receiverId: {
            senderId: snd_id,
            receiverId: rcv_id,
          },
        },
      });
      if (cancel) {
        // await this.deleteNotification(snd_id, rcv_id);
        return { message: 'Friend request canceled' };
      }
    }
    throw new ForbiddenException('Friend request not canceled');
  }

  // async deleteNotification(senderId: string, receiverId: string) {
  //   const notification = await this.prisma.notification.findFirst({
  //     where: {
  //       OR: [
  //         {
  //           senderId: senderId,
  //           receiverId: receiverId,
  //           type: 'request',
  //         },
  //         {
  //           senderId: receiverId,
  //           receiverId: senderId,
  //           type: 'request',
  //         },
  //       ],
  //     },
  //   });
  //   if (notification) {
  //     await this.prisma.notification.delete({
  //       where: {
  //         id: notification.id,
  //       },
  //     });
  //   }
  // }

  async acceptFriendRequest(user: User, sendID: string) {
    const check = await this.prisma.friendrequest.findUnique({
      where: { senderId_receiverId: { senderId: sendID, receiverId: user.id } },
    });
    if (check) {
      if (check.status === 'pending') {
        const u = await this.prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            receivefriendrequest: {
              update: {
                where: {
                  senderId_receiverId: {
                    senderId: sendID,
                    receiverId: user.id,
                  },
                },
                data: {
                  status: 'accepted',
                },
              },
            },
          },
        });
        //create a room between two users "DM"
        if (u) {
          await this.createroom(user, sendID);
        }
        return { message: 'Friend request accepted' };
      } else if (check.status === 'declined') {
        return { message: 'You have declined this request' };
      } else {
        throw new ForbiddenException('Friend request already accepted');
      }
    }
  }

  async createroom(user: User, sendID: string) {
    //check if the room already exists
    const check = await this.prisma.room.findFirst({
      where: {
        is_channel: false,
        AND: [
          {
            membership: {
              some: {
                user: {
                  id: user.id,
                },
              },
            },
          },
          {
            membership: {
              some: {
                user: {
                  id: sendID,
                },
              },
            },
          },
        ],
      },
    });
    if (!check) {
      const room = await this.prisma.room.create({
        data: {
          is_channel: false,
          lst_msg_ts: new Date(),
        },
      });
      await this.prisma.membership.create({
        data: {
          uid: user.id,
          rid: room.id,
        },
      });
      await this.prisma.membership.create({
        data: {
          uid: sendID,
          rid: room.id,
        },
      });

      //joining the room from accept friendrequest
      let clients = this.chatgateway.clients;
      clients.forEach((client) => {
        if (client.userid === user.id) {
          client.client.join(room.id);
        }
        if (client.userid === sendID) {
          client.client.join(room.id);
        }
      });

      return { message: 'Room created' };
    } else {
      return { message: 'Room already exists' };
    }
  }

  async declineFriendRequest(user: User, sendID: string) {
    //check if the request is pending
    const checkstatus = await this.prisma.friendrequest.findFirst({
      where: {
        senderId: sendID,
        receiverId: user.id,
        status: 'pending',
      },
    });
    if (checkstatus) {
      const bl = await this.prisma.friendrequest.delete({
        where: {
          senderId_receiverId: {
            senderId: sendID,
            receiverId: user.id,
          },
        },
      });
      if (bl) {
        // await this.deleteNotification(sendID, user.id);
        return { message: 'declined' };
      }
    }
    throw new ForbiddenException('Friend request not declined');
  }

  async getFriendRequests(user: User) {
    const friendrequest = await this.prisma.friendrequest.findMany({
      where: {
        receiverId: user.id,
        status: 'pending',
      },
      select: {
        sender: {
          select: {
            id: true,
            login: true,
            avatarUrl: true,
            createdAt: true,
          },
        },
        receiver: {
          select: {
            id: true,
            login: true,
            avatarUrl: true,
            createdAt: true,
          },
        },
      },
    });
    let friends = [];
    for (let req of friendrequest) {
      const friend = req.sender.id === user.id ? req.receiver : req.sender;
      friends.push(friend);
    }
    return friends;
  }

  async getFriends(user: User) {
    const friendrequest = await this.prisma.friendrequest.findMany({
      where: {
        OR: [{ senderId: user.id }, { receiverId: user.id }],
        status: 'accepted',
      },
      select: {
        sender: {
          select: {
            id: true,
            login: true,
            avatarUrl: true,
          },
        },
        receiver: {
          select: {
            id: true,
            login: true,
            avatarUrl: true,
          },
        },
      },
    });
    let friends = [];
    for (let req of friendrequest) {
      const friend = req.sender.id === user.id ? req.receiver : req.sender;
      friends.push(friend);
    }
    return friends;
  }

  async getFriendByUsername(user: User, username: string) {
    const us = await this.prisma.user.findUnique({
      where: { login: username },
    });
    const friendrequest = await this.prisma.friendrequest.findMany({
      where: {
        OR: [{ senderId: us.id }, { receiverId: us.id }],
        status: 'accepted',
      },
      select: {
        sender: {
          select: {
            id: true,
            login: true,
            avatarUrl: true,
          },
        },
        receiver: {
          select: {
            id: true,
            login: true,
            avatarUrl: true,
          },
        },
      },
    });
    let friends = [];
    for (let req of friendrequest) {
      const friend = req.sender.id === us.id ? req.receiver : req.sender;
      const check = await this.prisma.friendrequest.findMany({
        where: {
          OR: [
            { senderId: friend.id, receiverId: user.id, status: 'accepted' },
            { senderId: user.id, receiverId: friend.id, status: 'accepted' },
          ],
        },
      });
      const tmp = await this.prisma.friendrequest.findMany({
        where: {
          OR: [
            { senderId: friend.id, receiverId: user.id, status: 'pending' },
            { senderId: user.id, receiverId: friend.id, status: 'pending' },
          ],
        },
      });
      let isPending = false;
      let isRequested = false;
      if (tmp.length > 0) {
        if (tmp[0].senderId === user.id) {
          isPending = true;
        } else isRequested = true;
      }
      if (check.length > 0) {
        const score = await this.get_score(friend.id);
        friends.push({
          ...friend,
          isFriend: true,
          ...score,
          isPending,
          isRequested,
        });
      } else {
        const score = await this.get_score(friend.id);
        friends.push({
          ...friend,
          isFriend: false,
          ...score,
          isPending,
          isRequested,
        });
      }
    }
    return await this.filterfriendsbyblock(friends, user);
  }

  async filterfriendsbyblock(friends: any[], user: User) {
    const allusers = await Promise.all(
      friends.map(async (us) => {
        const blocked = await this.prisma.friendrequest.findFirst({
          where: {
            OR: [
              { senderId: user.id, receiverId: us.id },
              { senderId: us.id, receiverId: user.id },
            ],
            status: 'blocked',
          },
        });
        if (!blocked) {
          return us;
        }
      }),
    );
    return allusers.filter((us) => us);
  }

  async get_score(id: string) {
    const score = await this.prisma.user.findUnique({
      where: { id },
      select: {
        score: true,
      },
    });
    return score;
  }

  async unFriend(user: User, friendID: string) {
    const friend = await this.prisma.friendrequest.deleteMany({
      where: {
        OR: [
          { senderId: user.id, receiverId: friendID, status: 'accepted' },
          { senderId: friendID, receiverId: user.id, status: 'accepted' },
        ],
      },
    });
    if (friend) {
      // await this.deleteNotification(user.id, friendID);
      return { message: 'Unfriended' };
    }
    throw new ForbiddenException('You cannot unfriend this user');
  }

  async blockUser(user: User, Id: string) {
    const bl = await this.prisma.friendrequest.updateMany({
      where: {
        OR: [
          { senderId: user.id, receiverId: Id },
          { senderId: Id, receiverId: user.id },
        ],
      },
      data: {
        status: 'blocked',
        senderId: user.id,
        receiverId: Id,
      },
    });
    if (bl.count !== 0) {
      return { message: 'Blocked' };
    } else if (bl.count === 0) {
      const bl = await this.prisma.friendrequest.create({
        data: {
          status: 'blocked',
          senderId: user.id,
          receiverId: Id,
        },
      });
      return { message: 'Blocked' };
    } else throw new ForbiddenException("You can't Block this user");
  }

  async getBlockedUsers(user: User) {
    const blocked = await this.prisma.friendrequest.findMany({
      where: {
        OR: [{ senderId: user.id }, { receiverId: user.id }],
        status: 'blocked',
      },
      select: {
        sender: {
          select: {
            id: true,
            login: true,
            avatarUrl: true,
          },
        },
        receiver: {
          select: {
            id: true,
            login: true,
            avatarUrl: true,
          },
        },
      },
    });
    let blockedones = [];
    for (let req of blocked) {
      req.sender.id === user.id && blockedones.push(req.receiver);
    }
    return blockedones;
  }

  async unBlockUser(user: User, Id: string) {
    const bl = await this.prisma.friendrequest.deleteMany({
      where: {
        senderId: user.id,
        receiverId: Id,
      },
    });
    if (bl) {
      return await this.getBlockedUsers(user);
    }
    throw new ForbiddenException("You can't Unblock this user");
  }

  async upload(user: User, filename: string) {
    const url = this.config.get('route_upload') + filename;
    const us = await this.prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl: url },
    });
    if (us) {
      return { message: 'uploaded' };
    }
    throw new ForbiddenException('You cannot upload this image');
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (user) {
      return user;
    }
    throw new ForbiddenException('User not found');
  }

  async getuserbysocket(cookie: string) {
    const parse = cookie.includes('checkJwt=')
      ? cookie
          .split('; ')
          .find((row) => row.startsWith('checkJwt='))
          .split('=')[1]
      : cookie
          .split('; ')
          .find((row) => row.startsWith('jwt='))
          .split('=')[1];
    const secret = cookie.includes('checkJwt=')
      ? this.config.get('checkjwt_secret')
      : this.config.get('jwt_secret');
    const jwt = await this.jwt.verify(parse, {
      secret: secret,
    });
    const user = await this.prisma.user.findUnique({
      where: { id: jwt.sub },
    });
    return user;
  }

  async addnotification(notification: Notification) {
    const exist = await this.prisma.notification.findFirst({
      where: {
        senderId: notification.senderId,
        receiverId: notification.reciverId,
        type: notification.type,
      },
    });
    if (exist) {
      const not = await this.prisma.notification.update({
        where: {
          id: exist.id,
        },
        data: {
          createdAt: new Date(),
        },
      });
      if (not) {
        return not;
      } else throw new ForbiddenException('Cannot add notification');
    } else {
      const not = await this.prisma.notification.create({
        data: {
          type: notification.type,
          senderId: notification.senderId,
          receiverId: notification.reciverId,
          message: notification.message,
          image: notification.image,
          seen: false,
        },
      });
      if (not) {
        return not;
      } else throw new ForbiddenException('Cannot add notification');
    }
  }

  async getNotifications(user: User) {
    const nots = await this.prisma.notification.findMany({
      where: { receiverId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: {
            login: true,
          },
        },
      },
    });
    if (nots) {
      return nots.map((not) => {
        return {
          ...not,
          sender: not.sender.login,
        };
      });
    }
    throw new ForbiddenException('Cannot get notifications');
  }

  async notificationsSeen(user: User, id: string) {
    if (!id) {
      const nots = await this.prisma.notification.updateMany({
        where: { receiverId: user.id, seen: false },
        data: { seen: true },
      });
      if (nots) {
        return nots;
      }
    } else {
      const nots = await this.prisma.notification.update({
        where: { id },
        data: { seen: true },
      });
      if (nots) {
        return nots;
      }
    }
    throw new ForbiddenException('Cannot get notifications');
  }

  async getnotificationId(senderid: string, reciverid: string) {
    const not = await this.prisma.notification.findFirst({
      where: {
        senderId: senderid,
        receiverId: reciverid,
        type: 'request',
      },
    });
    if (not) {
      return not.id;
    }
    throw new ForbiddenException('Cannot get notification');
  }

  async check_is_blocked(userid: string, userid2: string) {
    const fr = await this.prisma.friendrequest.findFirst({
      where: {
        OR: [
          {
            receiverId: userid,
            senderId: userid2,
          },
          {
            receiverId: userid2,
            senderId: userid,
          },
        ],
      },
    });
    if (fr) {
      if (fr.status == 'blocked') return true;
      else return false;
    }
  }

  async getTopPlayers(user: User) {
    const top = await this.prisma.user.findMany({
      orderBy: { score: 'desc' },
      take: 10,
      select: {
        id: true,
        login: true,
        score: true,
        avatarUrl: true,
      },
    });
    if (top) {
      let topplayers = [];
      for (let player of top) {
        if (!(await this.check_is_blocked(user.id, player.id))) {
          topplayers.push({ ...player, isBlocked: false });
        } else {
          topplayers.push({ ...player, isBlocked: true });
        }
      }
      return topplayers;
    }
    throw new ForbiddenException('Cannot get top players');
  }

  async updateSeen(user: User) {
    const nots = await this.prisma.notification.updateMany({
      where: { receiverId: user.id, seen: false },
      data: { seen: true },
    });
    if (nots) {
      return nots;
    }
    throw new ForbiddenException('Cannot update seen');
  }
}
