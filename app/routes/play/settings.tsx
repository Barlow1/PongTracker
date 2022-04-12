import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Organization } from '@prisma/client';
import { Form, LoaderFunction, useLoaderData } from 'remix';
import Field from '~/components/FormElements/Field';
import { H1, H4, Paragraph } from '~/components/Typography/Typography';
import { getUserWithOrg } from '~/services/user.server';
import { Player } from '~/utils/types';
import { requireUser } from '~/utils/user.session';

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await requireUser(request);
  const user = await getUserWithOrg(sessionUser.id);
  return { user };
};

export default function Settings() {
  const { user } =
    useLoaderData<{ user: Player & { organization: Organization } }>();
  return (
    <div className="container main-content">
      <div className="form-page">
        <H1>Settings</H1>
        <Paragraph>
          Under construction!{' '}
          <FontAwesomeIcon color="yellow" icon={faTriangleExclamation} />{' '}
          Settings is currently view only.
        </Paragraph>
        <Form className="form">
          <H4>User</H4>
          <Field
            disabled
            name="name"
            type="text"
            label="Full Name"
            defaultValue={user.name || ''}
          />
          <Field
            disabled
            name="email"
            type="email"
            label="Email"
            defaultValue={user.email || ''}
          />
          <Field
            disabled
            name="organization"
            type="text"
            label="Organization"
            defaultValue={user.organization.name || ''}
          />
        </Form>
      </div>
    </div>
  );
}
