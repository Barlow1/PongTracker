import { useEffect } from 'react';
import { ActionFunction, Link, useFetcher } from 'remix';
import Button from '~/components/Button/Button';
import Field from '~/components/FormElements/Field';
import InputError from '~/components/FormElements/InputError';
import { Paragraph } from '~/components/Typography/Typography';
import { routes } from '~/routes';
import { handleRegistrationFormSubmission } from '~/services/forms/handlers.server';

export const action: ActionFunction = async ({
  request,
}: {
  request: Request;
}) => {
  return handleRegistrationFormSubmission(request);
};

export default function Register() {
  const register = useFetcher();
  const data = register.type === 'done' ? register.data : null;
  const success = data?.status === 'success';

  useEffect(() => {
    return () => {
      window.location.reload();
    };
  }, []);
  return (
    <>
      <div className="form-page">
        <register.Form className="form" method="post">
          {data?.status === 'error' || data?.status === 'organizationError' ? (
            <InputError id="general-register-error">
              {data.errors.generalError}
            </InputError>
          ) : null}
          <Field
            name="name"
            type="text"
            label="Name"
            error={data?.status === 'error' ? data.errors.name : null}
            disabled={register.state === 'loading' || success}
          />
          <Field
            name="email"
            type="email"
            label="Email"
            error={data?.status === 'error' ? data.errors.email : null}
            disabled={register.state === 'loading' || success}
          />
          <Field
            name="password"
            type="password"
            label="Password"
            error={data?.status === 'error' ? data.errors.password : null}
            disabled={register.state === 'loading' || success}
          />
          {data?.status === 'organizationError' ? (
            <Paragraph>Create a new organization.</Paragraph>
          ) : (
            <Paragraph>
              Enter the organization code you received from your coworker or
              create a new one.
            </Paragraph>
          )}
          <Field
            name="organization"
            type="text"
            label="Organization Code"
            error={data?.status === 'error' ? data.errors.organization : null}
            disabled={register.state === 'loading' || success}
          />
          {(data?.status === 'organizationError' ||
            (data?.status === 'error' && data?.errors.organizationName)) && (
            <Field
              name="organizationName"
              type="text"
              label="Organization Name"
              error={
                data?.status === 'error' ? data.errors.organizationName : null
              }
              disabled={register.state === 'loading' || success}
            />
          )}
          {success ? (
            <Paragraph>Success! Your account has been created</Paragraph>
          ) : (
            <Button
              color="blue"
              style={{ maxWidth: '200px' }}
              className="self-center w-full"
              type="submit"
            >
              Let's Play!
            </Button>
          )}
        </register.Form>
        <Paragraph className="md:text-center">
          Already have an account?{' '}
          <Link className="underlined" to={routes.login.path}>
            Login
          </Link>
        </Paragraph>
      </div>
    </>
  );
}
