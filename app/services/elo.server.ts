import { PrismaClient } from '@prisma/client';
import { Player, TEAM } from '~/utils/types';

class EloRank {
  constructor(k = 32) {
    this.k = k;
  }
  private k: number;

  setKFactor(k: number) {
    this.k = k;
  }
  getKFactor() {
    return this.k;
  }

  getExpected(a: number, b: number) {
    return 1 / (1 + Math.pow(10, (b - a) / 400));
  }
  updateRating(expected: number, actual: number, current: number) {
    return Math.round(current + this.k * (actual - expected));
  }
}

export const recalculateEloRankings = async (
  teamOnePlayers: Player[],
  teamTwoPlayers: Player[],
  winner: string
) => {
  if (!teamOnePlayers.length || !teamTwoPlayers.length) {
    throw new Error(
      'Cannot recalculate elo, one of the teams selected is empty.'
    );
  }
  if (teamOnePlayers.length !== teamTwoPlayers.length) {
    throw new Error('Cannot recalculate elo for teams of different sizes.');
  }
  const teamOneAverage =
    teamOnePlayers.reduce((total, player) => {
      return (total += player.elo);
    }, 0) / teamOnePlayers.length;

  const teamTwoAverage =
    teamTwoPlayers.reduce((total, player) => {
      return (total += player.elo);
    }, 0) / teamTwoPlayers.length;

  const elo = new EloRank();
  const expectedScoreTeamOne = elo.getExpected(teamOneAverage, teamTwoAverage);
  const expectedScoreTeamTwo = elo.getExpected(teamTwoAverage, teamOneAverage);

  const updatedTeamOne = teamOnePlayers.map((player) => {
    const won = winner === TEAM.TEAM1 ? 1 : 0;
    player.elo = elo.updateRating(expectedScoreTeamOne, won, player.elo);
    return player;
  });
  const updatedTeamTwo = teamTwoPlayers.map((player) => {
    const won = winner === TEAM.TEAM2 ? 1 : 0;
    player.elo = elo.updateRating(expectedScoreTeamTwo, won, player.elo);
    return player;
  });

  console.log('Updated Team 1 Rankings', updatedTeamOne);
  console.log('Updated Team 2 Rankings', updatedTeamTwo);

  return updateEloForPlayers([...updatedTeamOne, ...updatedTeamTwo]);
};

export const getPlayerElo = async (playerId: number) => {
  const prisma = new PrismaClient();
  return prisma.user
    .findUnique({
      where: {
        id: playerId,
      },
      select: {
        elo: true,
      },
    })
    .then((player) => {
      return player?.elo;
    })
    .catch(() => {
      console.error(`Failed to find Elo for player ${playerId}`);
    })
    .finally(() => {
      prisma.$disconnect();
    });
};

const updateEloForPlayers = async (players: Player[]) => {
  const prisma = new PrismaClient();
  await prisma.$connect();
  return prisma
    .$transaction(
      players.map((player) => {
        return prisma.user.update({
          where: {
            id: player.id,
          },
          data: {
            elo: player.elo,
          },
        });
      })
    )
    .then(() => {
      console.log('Player Elo was updated successfully');
      return true;
    })
    .catch((e) => {
      console.error('Failed to update Player Elo scores', e);
      return false;
    })
    .finally(() => {
      prisma.$disconnect();
    });
};

export default EloRank;
