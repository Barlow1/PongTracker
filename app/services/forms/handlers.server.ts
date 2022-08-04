import { json, redirect } from 'remix';
import { getUserSession, requireUser } from '~/utils/user.session';
import {
  getOrganizationByCode,
  getOrganizationNameCount,
} from '../organization.server';
import { createUser, getUserByEmail, login, updateUser } from '../user.server';
import {
  EditUserActionData,
  EditUserErrors,
  EditUserFields,
  LoginActionData,
  LoginErrors,
  LoginFields,
  RegistrationActionData,
  RegistrationErrors,
  RegistrationFields,
} from './types';

const getRegisterEmailError = async (email: string | null) => {
  if (!email) return `Email is required`;
  if (await getUserByEmail(email))
    return 'Email is already taken, please log in.';
  if (!/^.+@.+\..+$/.test(email)) return `Email is not valid`;
  return null;
};

const getLoginEmailError = (email: string | null) => {
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

const getOrganizationError = (
  organization: string | null,
  isExistingOrganization: string | null
) => {
  if (isExistingOrganization === 'true') {
    if (!organization) return `Organization Code is required`;
    if (organization.length > 60) return `Organization Code is too long`;
  }

  return null;
};

const getIsExistingOrganizationError = (
  isExistingOrganization: string | null
) => {
  if (!isExistingOrganization) return `This field is required`;
  return null;
};

const getOrganizationNameError = (
  organization: string | null,
  isExistingOrganization: string | null
) => {
  if (isExistingOrganization === 'false') {
    if (!organization?.length) return `Organization Name is required`;
    if (organization?.length && organization?.length > 60) {
      return `Organization Name is too long`;
    }
  }
  return null;
};

function getErrorMessage(error: unknown) {
  if (typeof error === 'string') return error;
  if (error instanceof Error) {
    if (error.message.includes('prisma')) {
      return 'Sorry, our database had an error. Can you please try again?';
    }
    return error.message;
  }
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
    isExistingOrganization: form.get('isExistingOrganization') ?? '',
  };

  const errors: RegistrationErrors = {
    generalError: null,
    name: getNameError(fields.name),
    email: await getRegisterEmailError(fields.email),
    password: getPasswordError(fields.password),
    organization: getOrganizationError(
      fields.organization,
      fields.isExistingOrganization
    ),
    organizationName: getOrganizationNameError(
      fields.organizationName,
      fields.isExistingOrganization
    ),
    isExistingOrganization: getIsExistingOrganizationError(
      fields.isExistingOrganization
    ),
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
    } else {
      const cleansedName = fields.organizationName.replace(/\W+/, ' ');
      const organizationNameCount = await getOrganizationNameCount(
        fields.organizationName
      );
      const trimmedName = cleansedName.replace(' ', '');
      const newOrganizationCode = `${trimmedName}${
        organizationNameCount || ''
      }`;
      fields.organization = newOrganizationCode;
      fields.organizationName = cleansedName;
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
    email: getLoginEmailError(fields.email),
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

export const handleEditUserFormSubmission = async (request: Request) => {
  const requestText = await request.text();
  const form = new URLSearchParams(requestText);

  const fields: EditUserFields = {
    name: form.get('name') ?? '',
  };

  const errors: EditUserErrors = {
    generalError: null,
    name: getNameError(fields.name),
  };

  let data: EditUserActionData;
  if (Object.values(errors).some((err) => err !== null)) {
    data = { status: 'error', errors };
    return json(data, 400);
  }

  try {
    const user = await requireUser(request);
    await updateUser({ id: user.id, ...fields });
    data = { status: 'success' };
    return json({
      ...data,
    });
  } catch (error: unknown) {
    errors.generalError = getErrorMessage(error);
    data = { status: 'error', errors };
    return json(data, 500);
  }
};
