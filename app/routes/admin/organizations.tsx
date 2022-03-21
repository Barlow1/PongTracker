import { Organization } from '@prisma/client';
import { LoaderFunction, useLoaderData } from 'remix';
import { H1, Paragraph } from '~/components/Typography/Typography';
import { getOrganizations } from '~/services/organization.server';
import { requireAdminUser } from '~/utils/user.session';

export const loader: LoaderFunction = async ({ request }) => {
  await requireAdminUser(request);
  const orgs = await getOrganizations();
  return orgs;
};
export default function Users() {
  const orgs: Organization[] = useLoaderData();

  return (
    <div className="container main-content">
      <div className="page justify-center text-center">
        <H1>Organizations</H1>
        {orgs.map((org) => {
          return (
            <div
              className="border-2 border-gray-100 rounded-md p-10"
              key={org.id}
            >
              <Paragraph>ID: {org.id}</Paragraph>
              <Paragraph>Name: {org.name}</Paragraph>
            </div>
          );
        })}
      </div>
    </div>
  );
}
