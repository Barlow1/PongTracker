import { Organization, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Player, PlayerWithOrg } from '~/utils/types';
const saltRounds = 10;
const prisma = new PrismaClient();

interface CreateUser {
  organization: string;
  organizationName: string;
  name: string;
  email: string;
  password: string;
}

interface EditUser {
  id: number;
  name: string;
}
interface LoginUser {
  email: string;
  password: string;
}

const exclude = <T, Key extends keyof T>(
  item: T,
  ...keys: Key[]
): Omit<T, Key> => {
  for (const key of keys) {
    delete item[key];
  }
  return item;
};

export const createUser = async ({
  name,
  email,
  password,
  organization,
  organizationName,
}: CreateUser): Promise<PlayerWithOrg> => {
  const encrypted = bcrypt.hashSync(password, saltRounds);

  return prisma.user
    .create({
      data: {
        password: encrypted,
        name,
        email,
        organization: {
          connectOrCreate: {
            where: {
              code: organization,
            },
            create: {
              name: organizationName,
              code: organization,
            },
          },
        },
      },
      include: {
        organization: true,
      },
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log('Error adding user', error);
      return error;
    })
    .finally(() => {
      prisma.$disconnect();
    });
};

export const updateUser = async ({
  id,
  name,
}: EditUser): Promise<PlayerWithOrg> => {
  return prisma.user
    .update({
      data: {
        name,
      },
      where: {
        id
      },
      include: {
        organization: true,
      },
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log('Error editing user', error);
      return error;
    })
    .finally(() => {
      prisma.$disconnect();
    });
};

export const getUsers = async (): Promise<Player[]> => {
  return prisma.user
    .findMany()
    .then((users) =>
      users.map((user) => {
        const player: Player = exclude(user, 'password');
        return player;
      })
    )
    .finally(() => {
      prisma.$disconnect();
    });
};

export const getUserWithOrg = async (
  id: number
): Promise<(Player & { organization: Organization }) | null> => {
  return prisma.user
    .findUnique({
      where: {
        id,
      },
      include: {
        organization: true,
      },
    })
    .then((user) => {
      if (user) {
        const player: Player & { organization: Organization } = exclude(
          user,
          'password'
        );
        return player;
      }
      return null;
    })
    .finally(() => {
      prisma.$disconnect();
    });
};

export const getUserByEmail = async (email: string): Promise<Player | null> => {
  return prisma.user
    .findUnique({
      where: {
        email,
      },
    })
    .then((user) => {
      if (user) {
        const player: Player = exclude(user, 'password');
        return player;
      }
      return null;
    })
    .finally(() => {
      prisma.$disconnect();
    });
};

export const getUsersByOrgId = async (orgId: number): Promise<Player[]> => {
  return prisma.user
    .findMany({
      where: {
        orgId,
      },
    })
    .then((users) =>
      users.map((user) => {
        const player: Player = exclude(user, 'password');
        return player;
      })
    )
    .finally(() => {
      prisma.$disconnect();
    });
};

export const login = async ({
  password,
  email,
}: LoginUser): Promise<PlayerWithOrg> => {
  const user = await prisma.user
    .findUnique({
      where: {
        email,
      },
      include: {
        organization: true,
      },
    })
    .finally(() => {
      prisma.$disconnect();
    });
  if (!user) {
    throw new Error('User is not registered');
  }
  const checkPassword = bcrypt.compareSync(password, user.password);
  if (!checkPassword) throw new Error('Email address or password not valid');
  const player: PlayerWithOrg = exclude(user, 'password');
  return player;
};
