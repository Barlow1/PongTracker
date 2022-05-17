export type RegistrationFields = {
  name: string;
  email: string;
  password: string;
  organization: string;
  organizationName: string;
};

export type RegistrationErrors = Record<
  keyof RegistrationFields | "generalError",
  string | null
>;

export type RegistrationActionData =
  | { status: "success" }
  | { status: "error" | "organizationError"; errors: RegistrationErrors };

export type LoginFields = {
  email: string;
  password: string;
};

export type LoginErrors = Record<
  keyof LoginFields | "generalError",
  string | null
>;

export type LoginActionData =
  | { status: "success" }
  | { status: "error"; errors: LoginErrors };

  export type EditUserFields = {
    name: string;
  };

  export type EditUserErrors = Record<
    keyof EditUserFields | 'generalError',
    string | null
  >;

  export type EditUserActionData =
    | { status: 'success' }
    | { status: 'error'; errors: EditUserErrors };
