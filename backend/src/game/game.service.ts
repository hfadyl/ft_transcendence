import { PrismaService } from './../prisma/prisma.service';
import {
  Injectable,
  ForbiddenException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GameGateway } from './game.gateway';
import * as moment from 'moment';

@Injectable()
export class GameService {
  constructor(
    private prisma: PrismaService,
    private gamegateway: GameGateway,
  ) {}

  async get_User_by_username(username: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        login: username,
      },
      select: {
        id: true,
        login: true,
        avatarUrl: true,
      },
    });
    if (!user) throw new ForbiddenException("User doesn't exist");
    return {
      id: user.id,
      username: user.login,
      avatar: user.avatarUrl,
    };
  }

  async update_level(userid: string, score: number) {
    score *= 3;
    await this.prisma.user.update({
      where: {
        id: userid,
      },
      data: {
        score: {
          increment: score,
        },
      },
    });
  }
  async update_loss(userid: string) {
    await this.prisma.user.update({
      where: {
        id: userid,
      },
      data: {
        Losses: {
          increment: 1,
        },
      },
    });
  }

  async update_win(userid: string) {
    await this.prisma.user.update({
      where: {
        id: userid,
      },
      data: {
        Wins: {
          increment: 1,
        },
      },
    });
  }

  async push_game_to_db(
    winner: string,
    loser: string,
    winnerScore: number,
    loserScore: number,
    maxViews: number,
  ) {
    const winnerid = await this.prisma.user.findUnique({
      where: {
        login: winner,
      },
    });
    const loserid = await this.prisma.user.findUnique({
      where: {
        login: loser,
      },
    });
    const game = await this.prisma.game.create({
      data: {
        winnerId: winnerid?.id,
        loserId: loserid?.id,
        winnerScore: winnerScore,
        loserScore: loserScore,
        maxViews: maxViews,
      },
    });
    // Update the level for the winner and loser
    await this.update_level(winnerid?.id, winnerScore);
    await this.update_level(loserid?.id, loserScore);
    // Update the win and loss counts for the winner and loser
    await this.update_win(winnerid?.id);
    await this.update_loss(loserid?.id);
    // Check if the winner or loser have earned any achievements
    await this.checkEarnedAchievements(winnerid);
    await this.checkEarnedAchievements(loserid);
  }

  async getMatchHistory(username: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        login: username,
      },
    });
    const games = await this.prisma.game.findMany({
      where: {
        OR: [
          {
            winnerId: user.id,
          },
          {
            loserId: user.id,
          },
        ],
      },
      select: {
        winnerId: true,
        loserId: true,
        winnerScore: true,
        loserScore: true,
        maxViews: true,
        createdAt: true,
      },
    });
    const ret = [];
    if (games) {
      for (let i = 0; i < games.length; i++) {
        ret.push({
          username:
            games[i].winnerId == user.id
              ? await this.getLoginbyId(games[i].loserId)
              : await this.getLoginbyId(games[i].winnerId),
          results:
            games[i].winnerId == user.id
              ? games[i].loserScore + '-' + games[i].winnerScore
              : games[i].winnerScore + '-' + games[i].loserScore,
          maxViews: games[i].maxViews,
          status: games[i].winnerId === user.id ? 'win' : 'lose',
          avatar:
            games[i].winnerId == user.id
              ? await this.getAvatarbyId(games[i].loserId)
              : await this.getAvatarbyId(games[i].winnerId),
          earnedScore:
            games[i].winnerId == user.id
              ? games[i].winnerScore * 3
              : games[i].loserScore * 3,
          date: this.fomratDate(games[i].createdAt),
        });
      }
    }
    return ret;
  }

  fomratDate(dateString: Date) {
    const moment = require('moment');
    const formattedDate = moment(dateString).format('DD/MM/YYYY');
    return formattedDate;
  }

  async getLoginbyId(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        login: true,
      },
    });
    return user?.login;
  }

  async getAvatarbyId(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        avatarUrl: true,
      },
    });
    return user?.avatarUrl;
  }

  async getUserScorebyUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        login: username,
      },
      select: {
        score: true,
      },
    });
    return user?.score;
  }

  async checkEarnedAchievements(user: User) {
    // Query the `game` table for all games that the user has played in
    const games = await this.prisma.game.findMany({
      where: {
        OR: [
          {
            winnerId: user.id,
          },
          {
            loserId: user.id,
          },
        ],
      },
      select: {
        winnerId: true,
        loserId: true,
        winnerScore: true,
        loserScore: true,
      },
    });
    // If the user has played any games, check for achievements
    if (games) {
      let winStreak = 0;
      let loseStreak = 0;
      for (let i = 0; i < games.length; i++) {
        if (games[i].winnerId === user.id) {
          winStreak++;
          loseStreak = 0;
        } else {
          loseStreak++;
          winStreak = 0;
        }
      }
      if (winStreak === 3) await this.push_achievement(user.id, 1);
      // Check if the user has won 5 games in a row
      if (winStreak === 5) await this.push_achievement(user.id, 2);
      // Check if the user has won their first game
      if (games.length === 1 && games[0].winnerId === user.id)
        await this.push_achievement(user.id, 3);
      // Check if the user has reached a score of 200
      if (100 < user?.score && user?.score <= 200)
        await this.push_achievement(user.id, 4);

      // Query the `user` table to get the total number of wins
      const totalWins = await this.prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          Wins: true,
        },
      });

      // Check if the user has won 5 total games
      if (totalWins?.Wins === 5) await this.push_achievement(user.id, 5);

      // Check if the user has won a game with a clean sheet
      if (
        games.length > 0 &&
        games[games.length - 1].winnerId === user.id &&
        games[games.length - 1].loserScore === 0
      )
        await this.push_achievement(user.id, 6);

      // Check if the user has played in 15 games
      if (games.length === 15) await this.push_achievement(user.id, 7);

      // Check if the user has won a game against a team leader
      var team_leader = ['hfadyl', 'fsarbout', 'mait-si-'];
      if (games.length > 0) {
        if (games[games.length - 1].winnerId === user.id) {
          if (
            team_leader.includes(
              await this.getLoginbyId(games[games.length - 1].loserId),
            )
          )
            await this.push_achievement(user.id, 8);
        }
      }
    }
  }

  async push_achievement(userid: string, number: number) {
    // Query the `achievements` table to see if an achievement with the same `number` already exists for the given `userid`
    const existingAchievement = await this.prisma.achievements.findFirst({
      where: {
        uid: userid,
        number: number,
      },
    });

    // If no existing achievement was found, proceed with the insertion
    if (!existingAchievement) {
      await this.prisma.achievements.create({
        data: {
          uid: userid,
          number: number,
        },
      });
      const user = await this.prisma.user.findUnique({
        where: {
          id: userid,
        },
      });
      await this.gamegateway.emitAchievements(number, user?.login);
    }
  }
}
