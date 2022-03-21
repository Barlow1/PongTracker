import { User } from '@prisma/client';
import { createCookieSessionStorage, redirect } from 'remix';
import { ROLE } from './types';

const date = new Date();
const userSessionExpirationDate = new Date(date.setDate(date.getDate() + 30));

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: 'CJB_user',
      secure: true,
      sameSite: 'lax',
      path: '/',
      expires: userSessionExpirationDate, // 30 days
    },
  });

async function getUserSession(request: Request) {
  const session = await getSession(request.headers.get('Cookie'));
  return {
    getUser: () => {
      const user = session.get('user');
      return user ? user : null;
    },
    setUser: (user: Partial<User>) => session.set('user', user),
    commit: () => commitSession(session),
    destroy: () => destroySession(session),
  };
}

export { getUserSession };

export const getUser = async (request: Request) => {
  const userSession = await getUserSession(request);
  const user = userSession.getUser();
  return user ? user : null;
};

export async function requireUser(request: Request): Promise<User> {
  const user = await getUser(request);
  if (!user) {
    const session = await getUserSession(request);
    await session.destroy();
    throw redirect('/login', {
      headers: {
        'Set-Cookie': await session.destroy(),
      },
    });
  }
  return user;
}

export async function requireAdminUser(request: Request): Promise<User> {
  const user = await getUser(request);
  if (!user) {
    const session = await getUserSession(request);
    await session.destroy();
    throw redirect('/login', {
      headers: {
        'Set-Cookie': await session.destroy(),
      },
    });
  }
  if (user.role !== ROLE.ADMIN) {
    throw redirect('/');
  }
  return user;
}
