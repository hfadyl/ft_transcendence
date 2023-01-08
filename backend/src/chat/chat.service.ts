import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    @Inject(forwardRef(() => ChatGateway))
    private chatgateway: ChatGateway,
  ) {}

  async createRoom(
    user: User,
    name: string,
    state: string,
    password: string,
    participants: [],
  ) {
    const hash = password ? await argon.hash(password) : null;
    const room = await this.prisma.room.create({
      data: {
        is_channel: true,
        name,
        state,
        password: hash,
        lst_msg_ts: new Date(),
      },
    });
    if (room) {
      await this.make_user_owner(room.id, user.id);
      await this.make_user_admin(room.id, user.id);
      for (let i = 0; i < participants?.length; i++) {
        await this.addmembership(room.id, participants[i], user);
        // join room
        let client = this.chatgateway.clients;
        for (let j = 0; j < client.length; j++)
          if (client[j].userid === participants[i])
            client[j].client.join(room.id);
      }

      let client = this.chatgateway.clients;
      for (let i = 0; i < client.length; i++)
        if (client[i].userid === user.id) client[i].client.join(room.id);

      return { message: 'OK' };
    }
    throw new ForbiddenException('Error: in creating room');
  }

  async join_protected_room(roomid: string, userid: string, password: string) {
    const room = await this.prisma.room.findUnique({
      where: {
        id: roomid,
      },
    });
    if (room) {
      if (room.password) {
        if (await argon.verify(room.password, password)) {
          const u = await this.prisma.membership.create({
            data: {
              uid: userid,
              rid: roomid,
            },
          });
          if (u) {
            return { message: 'user joined room' };
          }
          throw new ForbiddenException('Error: in joining room');
        }
        throw new ForbiddenException('Error: wrong password');
      }
      const u = await this.prisma.membership.create({
        data: {
          uid: userid,
          rid: roomid,
        },
      });
      if (u) {
        let client = this.chatgateway.clients;
        for (let i = 0; i < client.length; i++) {
          if (client[i].userid === userid) client[i].client.join(roomid);
        }

        return { message: 'user joined room' };
      }
      throw new ForbiddenException('Error: in joining room');
    }
    throw new ForbiddenException('Error: room does not exist');
  }

  async join_public_room(roomid: string, userid: string) {
    const room = await this.prisma.room.findUnique({
      where: {
        id: roomid,
      },
    });
    if (room) {
      const u = await this.prisma.membership.create({
        data: {
          uid: userid,
          rid: roomid,
        },
      });
      if (u) {
        let client = this.chatgateway.clients;
        for (let i = 0; i < client.length; i++) {
          if (client[i].userid === userid) client[i].client.join(roomid);
        }

        return { message: 'user joined room' };
      }
      throw new ForbiddenException('Error: in joining room');
    }
    throw new ForbiddenException('Error: room does not exist');
  }

  async addmembership(roomid: string, userid: string, user: User) {
    if (
      this.check_is_admin(roomid, user.id) ||
      this.check_is_owner(roomid, user.id)
    ) {
      const u = await this.prisma.membership.create({
        data: {
          uid: userid,
          rid: roomid,
        },
      });
      if (u) {
        return { message: 'user added to room' };
      }
      throw new ForbiddenException('Error: in adding user to room');
    }
    throw new ForbiddenException(
      'Error: you are not admin or owner of this room',
    );
  }

  async check_is_admin(roomid: string, userid: string) {
    const check = await this.prisma.membership.findUnique({
      where: {
        uid_rid: {
          uid: userid,
          rid: roomid,
        },
      },
    });
    if (check) return check.is_admin;
  }

  async check_is_owner(roomid: string, userid: string) {
    const check = await this.prisma.membership.findUnique({
      where: {
        uid_rid: {
          uid: userid,
          rid: roomid,
        },
      },
    });
    if (check) return check.is_owner;
  }

  //function to get banned users
  async get_bannedUsers(roomid: string) {
    const users = await this.prisma.membership.findMany({
      where: {
        rid: roomid,
        is_banned: true,
      },
      select: {
        user: {
          select: {
            login: true,
          },
        },
      },
    });
    var ret = [];
    if (users) {
      for (let i = 0; i < users.length; i++) {
        ret.push(users[i].user.login);
      }
    }
    return ret;
  }

  async make_user_admin(roomid: string, userid: string) {
    const u = await this.prisma.membership.upsert({
      where: {
        uid_rid: {
          uid: userid,
          rid: roomid,
        },
      },
      update: {
        is_admin: true,
      },
      create: {
        uid: userid,
        rid: roomid,
        is_admin: true,
      },
    });
    if (u) {
      return { message: 'user is admin' };
    }
    throw new ForbiddenException('Error: in making user admin');
  }

  async unmake_user_admin(roomid: string, userid: string) {
    const u = await this.prisma.membership.upsert({
      where: {
        uid_rid: {
          uid: userid,
          rid: roomid,
        },
      },
      update: {
        is_admin: false,
      },
      create: {
        uid: userid,
        rid: roomid,
        is_admin: false,
      },
    });
    if (u) {
      return { message: 'user is no longer an admin' };
    }
    throw new ForbiddenException('Error: in unmaking user admin');
  }

  async make_user_owner(roomid: string, userid: string) {
    const u = await this.prisma.membership.upsert({
      where: {
        uid_rid: {
          uid: userid,
          rid: roomid,
        },
      },
      update: {
        is_owner: true,
      },
      create: {
        uid: userid,
        rid: roomid,
        is_owner: true,
      },
    });
    if (u) {
      return { message: 'user is owner' };
    }
    throw new ForbiddenException('Error: in making user owner');
  }

  async unmake_user_owner(roomid: string, userid: string) {
    const u = await this.prisma.membership.upsert({
      where: {
        uid_rid: {
          uid: userid,
          rid: roomid,
        },
      },
      update: {
        is_owner: false,
      },
      create: {
        uid: userid,
        rid: roomid,
        is_owner: false,
      },
    });
    if (u) {
      return { message: 'user is no longer an owner' };
    }
    throw new ForbiddenException('Error: in unmaking user owner');
  }

  async getRooms(user: User) {
    const rooms = await this.prisma.room.findMany({
      where: {
        NOT: {
          state: 'private',
        },
      },
      select: {
        id: true,
        name: true,
        is_channel: true,
        state: true,
        membership: {
          select: {
            user: {
              select: {
                id: true,
                login: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });
    var ret = [];
    if (rooms) {
      for (let i = 0; i < rooms.length; i++) {
        const check = await this.prisma.membership.findUnique({
          where: {
            uid_rid: {
              uid: user.id,
              rid: rooms[i].id,
            },
          },
        });
        if (check) {
          if (rooms[i].is_channel === true) {
            ret.push({
              ...rooms[i],
              isJoined: true,
            });
          }
        } else {
          if (rooms[i].is_channel === true) {
            ret.push({
              ...rooms[i],
              isJoined: false,
            });
          }
        }
      }
    }
    var ret_edit = [];
    for (let i = 0; i < ret.length; i++) {
      ret_edit.push({
        id: ret[i].id,
        name: ret[i].name,
        state: ret[i].state,
        isJoined: ret[i].isJoined,
        participants: ret[i].membership.map((m) => {
          return {
            id: m.user.id,
            username: m.user.login,
            avatar: m.user.avatarUrl,
          };
        }),
      });
    }
    return ret_edit;
  }

  async ban_user(roomid: string, userid: string) {
    const u = await this.prisma.membership.update({
      where: {
        uid_rid: {
          uid: userid,
          rid: roomid,
        },
      },
      data: {
        is_banned: true,
      },
    });
    if (u) {
      return { message: 'user is banned' };
    }
    throw new ForbiddenException('Error: in banning user');
  }

  async unban_user(roomid: string, userid: string) {
    const u = await this.prisma.membership.update({
      where: {
        uid_rid: {
          uid: userid,
          rid: roomid,
        },
      },
      data: {
        is_banned: false,
      },
    });
    if (u) {
      return { message: 'user is unbanned' };
    }
    throw new ForbiddenException('Error: in unbanning user');
  }

  async mute_user(roomid: string, userid: string, duration: string) {
    const format_duration = this.format_date(duration);
    const u = await this.prisma.membership.update({
      where: {
        uid_rid: {
          uid: userid,
          rid: roomid,
        },
      },
      data: {
        is_muted: true,
        mute_at: new Date(),
        duration: format_duration,
      },
    });
    if (u) {
      return { message: 'user is muted' };
    }
    throw new ForbiddenException('Error: in muting user');
  }

  format_date(duration: string) {
    const cuurent_date = new Date();
    if (duration === '30min') {
      cuurent_date.setMinutes(cuurent_date.getMinutes() + 30);
    } else if (duration === '1h') {
      cuurent_date.setHours(cuurent_date.getHours() + 1);
    } else if (duration === '4h') {
      cuurent_date.setHours(cuurent_date.getHours() + 4);
    } else if (duration === '8h') {
      cuurent_date.setHours(cuurent_date.getHours() + 8);
    } else if (duration === '1d') {
      cuurent_date.setDate(cuurent_date.getDate() + 1);
    } else if (duration === '1w') {
      cuurent_date.setDate(cuurent_date.getDate() + 7);
    } else if (duration === '15m') {
      cuurent_date.setMinutes(cuurent_date.getMinutes() + 15);
    } else if (duration === '2m') {
      cuurent_date.setMinutes(cuurent_date.getMinutes() + 2);
    }
    return cuurent_date;
  }

  async unmute_user(roomid: string, userid: string) {
    const u = await this.prisma.membership.update({
      where: {
        uid_rid: {
          uid: userid,
          rid: roomid,
        },
      },
      data: {
        is_muted: false,
        duration: null,
        mute_at: null,
      },
    });
    if (u) {
      return { message: 'user is unmuted' };
    }
    throw new ForbiddenException('Error: in unmuting user');
  }

  async change_password(roomid: string, userid: string, password: string) {
    const hash = await argon.hash(password);
    const u = await this.prisma.membership.update({
      where: {
        uid_rid: {
          uid: userid,
          rid: roomid,
        },
      },
      data: {
        room: {
          update: {
            password: hash,
          },
        },
      },
    });
    if (u) {
      return { message: 'password changed' };
    }
    throw new ForbiddenException('Error: in changing password');
  }

  async leave_room(roomid: string, userid: string) {
    const room = await this.prisma.room.findUnique({
      where: {
        id: roomid,
      },
      include: {
        membership: {
          select: {
            user: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });
    //check if user in the room
    const user = room?.membership.find((m) => m.user.id === userid);
    if (!user) {
      throw new ForbiddenException('Error: user not in the room');
    }
    if (room.membership.length === 1) {
      await this.delete_room(roomid);
      return { message: 'user left room' };
    } else {
      const membership = await this.prisma.membership.findMany({
        where: {
          rid: roomid,
        },
        orderBy: {
          id: 'asc',
        },
      });
      if (await this.check_is_owner(roomid, userid))
        await this.make_user_owner(
          room.id,
          membership[0].uid === userid ? membership[1].uid : membership[0].uid,
        );
      if (
        (await this.check_is_admin(roomid, userid)) ||
        (await this.check_is_owner(roomid, userid))
      )
        await this.make_user_admin(
          room.id,
          membership[0].uid === userid ? membership[1].uid : membership[0].uid,
        );
      const u = await this.prisma.membership.delete({
        where: {
          uid_rid: {
            uid: userid,
            rid: roomid,
          },
        },
      });
      if (u) {
        return { message: 'user left room' };
      }
    }
    throw new ForbiddenException('Error: in leaving room');
  }

  async remove_user(roomid: string, userid: string) {
    const u = await this.prisma.membership.delete({
      where: {
        uid_rid: {
          uid: userid,
          rid: roomid,
        },
      },
    });
    if (u) {
      return { message: 'user removed from room' };
    }
    throw new ForbiddenException('Error: in removing user from room');
  }

  async delete_room(roomid: string) {
    const u = await this.prisma.room.delete({
      where: {
        id: roomid,
      },
    });
    if (u) {
      return { message: 'room deleted' };
    }
    throw new ForbiddenException('Error: in deleting room');
  }

  async get_messages(roomid: string) {
    return await this.prisma.message.findMany({
      where: {
        roomId: roomid,
      },
      include: {
        User: true,
      },
    });
  }

  //----------- utils for chatgateway ------------//

  async push_message(roomid: string, userid: string, message: string) {
    const room = await this.prisma.room.findUnique({
      where: {
        id: roomid,
      },
      include: {
        membership: {
          select: {
            user: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });
    if (room?.is_channel === false) {
      const user = room?.membership.find((m) => m.user.id !== userid);
      if ((await this.check_is_blocked(userid, user.user.id)) === false) {
        const u = await this.prisma.message.create({
          data: {
            msg: message,
            roomId: roomid,
            userId: userid,
          },
        });
        if (u) {
          return u;
        } else throw new ForbiddenException('Error: in pushing message to DB');
      }
    } else {
      const u = await this.prisma.message.create({
        data: {
          msg: message,
          roomId: roomid,
          userId: userid,
        },
      });
      if (u) {
        return u;
      } else throw new ForbiddenException('Error: in pushing message to DB');
    }
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

  async check_state_room(roomid: string) {
    const state = await this.prisma.room.findUnique({
      where: {
        id: roomid,
      },
      select: {
        state: true,
      },
    });
    if (state.state == 'public') return 'public';
    else if (state.state == 'private') return 'private';
    else return 'protected';
  }

  async check_is_banned(roomid: string, userid: string) {
    const u = await this.prisma.membership.findUnique({
      where: {
        uid_rid: {
          uid: userid,
          rid: roomid,
        },
      },
    });
    if (u?.is_banned == true) {
      return true;
    }
    return false;
  }

  async check_is_muted(roomid: string, userid: string) {
    const u = await this.prisma.membership.findUnique({
      where: {
        uid_rid: {
          uid: userid,
          rid: roomid,
        },
      },
    });
    if (u?.is_muted == true) {
      const current_date = new Date();
      if (current_date > u?.duration) {
        await this.unmute_user(roomid, userid);
        return false;
      } else {
        return true;
      }
    }
    return false;
  }

  //function to get rooms that can i join
  // async get_rooms_join(userid: string) {
  //   const rooms = await this.prisma.room.findMany({
  //     where: {
  //       is_channel: true,
  //     },
  //     include: {
  //       membership: {
  //         select: {
  //           user: {
  //             select: {
  //               id: true,
  //               avatarUrl: true,
  //               login: true,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });
  //   const rooms_join = [];
  //   for (let i = 0; i < rooms.length; i++) {
  //     if (rooms[i].state !== 'private') {
  //       const u = await this.prisma.membership.findUnique({
  //         where: {
  //           uid_rid: {
  //             uid: userid,
  //             rid: rooms[i].id,
  //           },
  //         },
  //       });
  //       if (!u) {
  //         rooms_join.push(rooms[i]);
  //       }
  //     }
  //   }
  //   const rooms_join_edit = [];
  //   for (let i = 0; i < rooms_join.length; i++) {
  //     rooms_join_edit.push({
  //       id: rooms_join[i].id,
  //       name: rooms_join[i].name,
  //       state: rooms_join[i].state,
  //       participants: rooms_join[i].membership.map((m) => {
  //         return {
  //           id: m.user.id,
  //           username: m.user.login,
  //           avatar: m.user.avatarUrl,
  //         };
  //       }),
  //     });
  //   }
  //   return rooms_join_edit;
  // }

  //function to get my rooms and DM's
  async get_my_rooms(userid: string) {
    const rooms = await this.prisma.room.findMany({
      where: {
        membership: {
          some: {
            uid: userid,
          },
        },
      },
      include: {
        membership: {
          select: {
            unreadMessages: true,
            user: {
              select: {
                id: true,
                avatarUrl: true,
                login: true,
              },
            },
          },
        },
      },
    });
    if (!rooms) throw new ForbiddenException('Error: in getting rooms');
    const rooms_edit = [];
    for (let i = 0; i < rooms.length; i++) {
      rooms_edit.push({
        id: rooms[i].id,
        lastMessage: await this.get_last_message(rooms[i].id, userid),
        lastMessageTime: rooms[i].lst_msg_ts,
        unreadMessages: rooms[i].membership
          .map((m) => {
            if (m.user.id === userid) return m.unreadMessages;
          })
          .filter((un) => un !== undefined)[0],
        state: rooms[i].is_channel === false ? null : rooms[i].state,
        avatar:
          rooms[i].is_channel === false
            ? rooms[i].membership[0]?.user?.id !== userid
              ? rooms[i].membership[0]?.user?.avatarUrl
              : rooms[i].membership[1]?.user?.avatarUrl
            : null,
        name:
          rooms[i].is_channel === false
            ? rooms[i].membership[0]?.user?.id !== userid
              ? rooms[i].membership[0]?.user?.login
              : rooms[i].membership[1]?.user?.login
            : rooms[i].name,
      });
    }
    //update unreadMessages to false of all rooms
    for (let i = 0; i < rooms.length; i++) {
      await this.update_unreadMessages(rooms[i].id, userid, false);
    }
    return rooms_edit;
  }

  async get_last_message(roomid: string, userid: string) {
    const last_message = await this.prisma.room.findUnique({
      where: {
        id: roomid,
      },
      include: {
        messages: {
          select: {
            msg: true,
            userId: true,
          },
        },
        membership: {
          select: {
            user: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });
    // check owner of last msg if blocked
    const blocked = await this.check_is_blocked(
      last_message?.messages[last_message.messages.length - 1]?.userId,
      userid,
    );
    // if blocked return last msg of a non blocked user
    if (blocked) {
      for (let i = last_message.messages.length - 1; i >= 0; i--) {
        const blocked = await this.check_is_blocked(
          last_message.messages[i].userId,
          userid,
        );
        if (!blocked) {
          return last_message.messages[i].msg;
        }
      }
    }
    // if not blocked return last msg
    else {
      return last_message.lst_msg;
    }
  }

  async update_unreadMessages(
    roomId: string,
    userId: string,
    content: boolean,
  ) {
    const update = await this.prisma.membership.update({
      where: {
        uid_rid: {
          uid: userId,
          rid: roomId,
        },
      },
      data: {
        unreadMessages: content,
      },
    });
    if (update) return true;
    else return false;
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
    }
    return false;
  }

  async get_room(user: User, roomid: string) {
    const room = await this.prisma.room.findUnique({
      where: {
        id: roomid,
      },
      include: {
        membership: {
          select: {
            user: {
              select: {
                id: true,
                avatarUrl: true,
                login: true,
              },
            },
          },
        },
        messages: {
          select: {
            id: true,
            User: true,
            userId: true,
            msg: true,
            createdAt: true,
          },
        },
      },
    });

    if (!room) throw new ForbiddenException("Room doesn't exist!");

    //update unreadMessages to false of this user in this room
    await this.update_unreadMessages(roomid, user.id, false);

    //destruct membership to participents
    const participants = [];
    for (let i = 0; i < room.membership.length; i++) {
      participants.push({
        id: room.membership[i].user.id,
        username: room.membership[i].user.login,
        avatar: room.membership[i].user.avatarUrl,
        isOwner: await this.check_is_owner(room.id, room.membership[i].user.id),
        isAdmin: await this.check_is_admin(room.id, room.membership[i].user.id),
        isMutted: await this.check_is_muted(
          room.id,
          room.membership[i].user.id,
        ),
        isBanned: await this.check_is_banned(
          room.id,
          room.membership[i].user.id,
        ),
      });
    }

    //destruct messages and not get messages of blocked users
    const messages = [];
    for (let i = 0; i < room.messages.length; i++) {
      if (
        (await this.check_is_blocked(user.id, room.messages[i].userId)) ||
        (await this.check_is_banned(room.id, user.id))
      ) {
        continue;
      }
      messages.push({
        id: room.messages[i].id,
        username: room.messages[i].User.login,
        avatar: room.messages[i].User.avatarUrl,
        message: room.messages[i].msg,
        time: room.messages[i].createdAt,
      });
    }

    const ret = {
      id: room.id,
      userId:
        room.is_channel === false
          ? room.membership[0]?.user?.id !== user.id
            ? room.membership[0]?.user?.id
            : room.membership[1]?.user?.id
          : null,
      isBlocked:
        room.is_channel === false
          ? await this.check_is_blocked(
              user.id,
              room.membership[0]?.user?.id !== user.id
                ? room.membership[0]?.user?.id
                : room.membership[1]?.user?.id,
            )
          : null,
      name:
        room.is_channel === false
          ? room.membership[0]?.user?.id !== user.id
            ? room.membership[0]?.user?.login
            : room.membership[1]?.user?.login
          : room.name,
      avatar:
        room.is_channel === false
          ? room.membership[0]?.user?.id !== user.id
            ? room.membership[0]?.user?.avatarUrl
            : room.membership[1]?.user?.avatarUrl
          : null,
      state: room.is_channel === false ? null : room.state,
      isAdmin: await this.check_is_admin(room.id, user.id),
      isOwner: await this.check_is_owner(room.id, user.id),
      participants: room.is_channel === false ? null : participants,
      messages: messages,
    };
    return ret;
  }

  async get_last_active_room(userid: string) {
    const room = await this.prisma.room.findFirst({
      where: {
        membership: {
          some: {
            uid: userid,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        id: true,
      },
    });
    if (room) return room.id;
  }

  async delete_password(user: User, roomid: string) {
    const room = await this.prisma.room.findUnique({
      where: {
        id: roomid,
      },
    });
    if (!room) throw new ForbiddenException("Room doesn't exist!");
    if (room.is_channel === false)
      throw new ForbiddenException('Not a channel!');
    if (room.state !== 'protected')
      throw new ForbiddenException('Not a private channel!');
    await this.prisma.room.update({
      where: {
        id: roomid,
      },
      data: {
        state: 'private',
        password: null,
      },
    });
  }

  async set_last_msg(roomid: string, message: string, userid: string) {
    const room = await this.prisma.room.findUnique({
      where: {
        id: roomid,
      },
      include: {
        membership: {
          select: {
            user: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });
    if (room) {
      if (room.is_channel === false) {
        if (
          (await this.check_is_blocked(
            userid,
            room.membership[0].user.id === userid
              ? room.membership[1].user.id
              : room.membership[0].user.id,
          )) === false
        ) {
          const update = await this.prisma.room.update({
            where: {
              id: roomid,
            },
            data: {
              lst_msg: message,
              lst_msg_ts: new Date(),
            },
          });
          if (!update) {
            throw new ForbiddenException("Room doesn't exist!");
          }
        }
      } else {
        const update = await this.prisma.room.update({
          where: {
            id: roomid,
          },
          data: {
            lst_msg: message,
            lst_msg_ts: new Date(),
          },
        });
        if (!update) {
          throw new ForbiddenException("Room doesn't exist!");
        }
      }
    }
  }

  async get_blockedUsers(roomId: string, userId: string) {
    const room = await this.prisma.room.findUnique({
      where: {
        id: roomId,
      },
      include: {
        membership: {
          select: {
            user: {
              select: {
                id: true,
                login: true,
              },
            },
          },
        },
      },
    });
    if (!room) throw new ForbiddenException("Room doesn't exist!");
    const users = [];
    for (let i = 0; i < room.membership.length; i++) {
      if (
        room.membership[i].user.id !== userId &&
        (await this.check_is_blocked(userId, room.membership[i].user.id))
      ) {
        users.push(room.membership[i].user.login);
      }
    }
    return users;
  }

  async update_all_unreadMessages(
    roomid: string,
    userid: string,
    content: boolean,
  ) {
    const membership = await this.prisma.room.findMany({
      where: {
        id: roomid,
        membership: {
          some: {
            uid: userid,
          },
        },
      },
      include: {
        membership: {
          select: {
            uid: true,
          },
        },
      },
    });
    for (let i = 0; i < membership.length; i++) {
      if (membership[i].membership[0].uid === userid) continue;
      await this.prisma.membership.update({
        where: {
          uid_rid: {
            uid: membership[i].membership[0].uid,
            rid: roomid,
          },
        },
        data: {
          unreadMessages: content,
        },
      });
    }
  }

  async check_is_channel(roomid: string) {
    const room = await this.prisma.room.findUnique({
      where: {
        id: roomid,
      },
    });
    if (room) return room.is_channel;
  }
}
