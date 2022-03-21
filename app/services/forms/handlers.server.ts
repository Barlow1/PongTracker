import { json, redirect } from 'remix';
import { getUserSession } from '~/utils/user.session';
import { getOrganizationByCode } from '../organization.server';
import { createUser, login } from '../user.server';
import {
  LoginActionData,
  LoginErrors,
  LoginFields,
  RegistrationActionData,
  RegistrationErrors,
  RegistrationFields,
} from './types';

const getEmailError = (email: string | null) => {
  if (!email) return `Email is required`;
  if (!/^.+@.+\..+$/.test(email)) return `Email is not valid`;
  return null;
};

const getNameError = (name: string | null) => {
  if (!name) return `Name is required`;
  if (name.length > 60) return `Name is too long`;
  return null;
};

const getPasswordError = (password: string | null) => {
  if (!password) return `Password is required`;
  return null;
};

const getOrganizationError = async (organization: string | null) => {
  if (!organization) return `Organization Code is required`;
  if (organization.length > 60) return `Organization Code is too long`;
  return null;
};

const getOrganizationNameError = (organization: string | null) => {
  if (organization?.length && organization?.length > 60) {
        return `Organization Name is too long`;
  }
  return null;
};

function getErrorMessage(error: unknown) {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  return 'Unknown Error';
}

export const handleRegistrationFormSubmission = async (request: Request) => {
  const requestText = await request.text();
  const form = new URLSearchParams(requestText);

  const fields: RegistrationFields = {
    name: form.get('name') ?? '',
    email: form.get('email') ?? '',
    password: form.get('password') ?? '',
    organization: form.get('organization') ?? '',
    organizationName: form.get('organizationName') ?? '',
  };

  const errors: RegistrationErrors = {
    generalError: null,
    name: getNameError(fields.name),
    email: getEmailError(fields.email),
    password: getPasswordError(fields.password),
    organization: await getOrganizationError(fields.organization),
    organizationName: getOrganizationNameError(fields.organizationName),
  };

  let data: RegistrationActionData;

  if (Object.values(errors).some((err) => err !== null)) {
    data = { status: 'error', errors };
    return json(data, 400);
  }

  try {
    if (!fields.organizationName) {
      const existing = await getOrganizationByCode(fields.organization);
      if (!existing) {
        errors.generalError = 'Organization code not found.';
        data = { status: 'organizationError', errors };
        return json(data, 404);
      }
      fields.organizationName = existing.name;
    }
    const user = await createUser(fields);
    const userSession = await getUserSession(request);
    userSession.setUser(user);
    data = { status: 'success' };
    return redirect('/play', {
      headers: { 'Set-Cookie': await userSession.commit() },
    });
  } catch (error: unknown) {
    errors.generalError = getErrorMessage(error);
    data = { status: 'error', errors };
    return json(data, 500);
  }
};

export const handleLoginFormSubmission = async (request: Request) => {
  const requestText = await request.text();
  const form = new URLSearchParams(requestText);

  const fields: LoginFields = {
    email: form.get('email') ?? '',
    password: form.get('password') ?? '',
  };

  const errors: LoginErrors = {
    generalError: null,
    email: getEmailError(fields.email),
    password: getPasswordError(fields.password),
  };

  let data: LoginActionData;

  if (Object.values(errors).some((err) => err !== null)) {
    data = { status: 'error', errors };
    return json(data, 400);
  }

  try {
    const user = await login(fields);
    const userSession = await getUserSession(request);
    userSession.setUser(user);
    data = { status: 'success' };
    return redirect('/play', {
      headers: { 'Set-Cookie': await userSession.commit() },
    });
  } catch (error: unknown) {
    errors.generalError = getErrorMessage(error);
    data = { status: 'error', errors };
    return json(data, 500);
  }
};
