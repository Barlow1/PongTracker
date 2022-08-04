import {
  faCheckCircle,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Organization } from '@prisma/client';
import {
  ActionFunction,
  Form,
  LoaderFunction,
  useActionData,
  useLoaderData,
  useSubmit,
} from 'remix';
import Field from '~/components/FormElements/Field';
import InputError from '~/components/FormElements/InputError';
import { H1, H4, Paragraph } from '~/components/Typography/Typography';
import { handleEditUserFormSubmission } from '~/services/forms/handlers.server';
import { EditUserActionData } from '~/services/forms/types';
import { getUserWithOrg } from '~/services/user.server';
import { Player } from '~/utils/types';
import { requireUser } from '~/utils/user.session';

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await requireUser(request);
  const user = await getUserWithOrg(sessionUser.id);
  return { user };
};

export const action: ActionFunction = async ({ request }) => {
  return handleEditUserFormSubmission(request);
};

export default function Settings() {
  const { user } =
    useLoaderData<{ user: Player & { organization: Organization } }>();
  const data = useActionData<EditUserActionData>();
  const success = data?.status === 'success';
  const submit = useSubmit();
  const handleSubmitEvent = (event: {
    keyCode?: number;
    currentTarget: {
      form:
        | HTMLInputElement
        | HTMLFormElement
        | HTMLButtonElement
        | FormData
        | { [name: string]: string }
        | null;
      blur: () => void;
    };
  }) => {
    console.log('charCode', event.keyCode);

    if (event.keyCode && event.keyCode === 13) {
      submit(event.currentTarget.form, { method: 'post', replace: true });
      event.currentTarget.blur();
    } else if (!event.keyCode) {
      submit(event.currentTarget.form, {
        method: 'post',
        replace: true,
      });
    }
  };

  return (
    <div className="container main-content">
      <div className="form-page">
        <H1>Settings</H1>
        <Paragraph>
          Under construction!{' '}
          <FontAwesomeIcon color="yellow" icon={faTriangleExclamation} />{' '}
          Settings is currently view only for some fields.
        </Paragraph>
        <Form className="form">
          <H4>User</H4>
          {success ? (
            <Paragraph>
              <FontAwesomeIcon color="green" icon={faCheckCircle} />{' '}
              Successfully updated your information!
            </Paragraph>
          ) : (
            <InputError id="edit-user-error">
              {data?.errors.generalError}
            </InputError>
          )}
          <Field
            name="name"
            type="text"
            label="Full Name"
            defaultValue={user.name || ''}
            error={data?.status === 'error' ? data.errors.name : null}
            onBlur={handleSubmitEvent}
            onKeyUp={handleSubmitEvent}
          />
          <Field
            disabled
            name="email"
            type="email"
            label="Email"
            defaultValue={user.email || ''}
            className={'disabled:bg-gray-600 disabled:text-gray-300'}
          />
          <Field
            disabled
            name="organization"
            type="text"
            label="Organization"
            defaultValue={user.organization.name || ''}
            className={'disabled:bg-gray-600 disabled:text-gray-300'}
          />
          <Field
            disabled
            name="organizationCode"
            type="text"
            label="Organization Code"
            defaultValue={user.organization.code || ''}
            className={'disabled:bg-gray-600 disabled:text-gray-300'}
          />
        </Form>
      </div>
    </div>
  );
}
