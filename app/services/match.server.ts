import { Match, PrismaClient } from '@prisma/client';
import { Player, TEAM } from '~/utils/types';

interface ICreateMatch {
  gameType: string;
  winner: string;
  teamOneScore: number;
  teamTwoScore: number;
}

interface ICreatePlayerMatch {
  match: Match;
  teamOnePlayers: Player[];
  teamTwoPlayers: Player[];
}

const prisma = new PrismaClient();

export const createMatch = async ({
  gameType,
  winner,
  teamOneScore,
  teamTwoScore,
}: ICreateMatch): Promise<Match> => {
  return prisma.match
    .create({
      data: {
        gameType,
        winner,
        teamOneScore,
        teamTwoScore,
      },
    })
    .finally(() => {
      prisma.$disconnect();
    });
};

export const createPlayerMatches = async ({
  match,
  teamOnePlayers,
  teamTwoPlayers,
}: ICreatePlayerMatch): Promise<void> => {
  const teamOneMatchPlayers = teamOnePlayers.map((player: Player) => {
    return {
      matchId: match.id,
      team: TEAM.TEAM1,
      won: match.winner === TEAM.TEAM1,
      playerId: player.id,
    };
  });
  const teamTwoMatchPlayers = teamTwoPlayers.map((player: Player) => {
    return {
      matchId: match.id,
      team: TEAM.TEAM2,
      won: match.winner === TEAM.TEAM2,
      playerId: player.id,
    };
  });
  await prisma.playerMatch
    .createMany({
      data: [...teamOneMatchPlayers, ...teamTwoMatchPlayers],
    })
    .finally(() => {
      prisma.$disconnect();
    });
};

export const getMatchesByPlayerId = (playerId: number) => {
  return prisma.match
    .findMany({
      where: {
        playerMatches: {
          some: {
            playerId: playerId,
          },
        },
      },
      include: {
        playerMatches: {
          include: {
            player: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    })
    .finally(() => {
      prisma.$disconnect();
    });
};

export const getWinCount = (playerId: number) => {
  return prisma.match
    .count({
      where: {
        playerMatches: {
          some: {
            playerId,
            won: true,
          },
        },
      },
    })
    .finally(() => {
      prisma.$disconnect();
    });
};
