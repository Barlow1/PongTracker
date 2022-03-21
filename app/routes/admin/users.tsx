import { User } from '@prisma/client';
import { LoaderFunction, useLoaderData } from 'remix';
import { H1, Paragraph } from '~/components/Typography/Typography';
import { getUsers } from '~/services/user.server';
import { requireAdminUser } from '~/utils/user.session';

export const loader: LoaderFunction = async ({ request }) => {
  await requireAdminUser(request);
  const users = await getUsers();
  return users;
};
export default function Users() {
  const users: User[] = useLoaderData();

  return (
    <div className="container main-content">
      <div className="page justify-center text-center">
        <H1>Users</H1>
        {users.map((user) => {
          return (
            <div
              className="border-2 border-gray-100 rounded-md p-10"
              key={user.id}
            >
              <Paragraph>Organization: {user.orgId}</Paragraph>
              <Paragraph>Name: {user.name}</Paragraph>
              <Paragraph>Email: {user.email}</Paragraph>
            </div>
          );
        })}
      </div>
    </div>
  );
}
