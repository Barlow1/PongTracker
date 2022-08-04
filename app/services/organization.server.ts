import { Organization, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getOrganizations = async (): Promise<Organization[]> => {
  return prisma.organization.findMany();
};

export const getOrganizationByCode = async (
  code: string
): Promise<Organization | null> => {
  return prisma.organization
    .findUnique({
      where: {
        code,
      },
    })
    .finally(() => {
      prisma.$disconnect();
    });
};

export const getOrganizationCodeCount = async (
  code: string
): Promise<number | null> => {
  return prisma.organization
    .count({
      where: {
        code: { startsWith: code },
      },
    })
    .finally(() => {
      prisma.$disconnect();
    });
};
