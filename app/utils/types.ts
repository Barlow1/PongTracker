import { Organization, User } from '@prisma/client';

export type Player = Omit<User, 'password'>;

export type PlayerWithOrg = Omit<
  User & { organization: Organization },
  'password'
>;

export enum TEAM {
  TEAM1 = 'Team1',
  TEAM2 = 'Team2',
}

export enum ROLE {
    USER = 'USER',
    ADMIN = 'ADMIN'
}
