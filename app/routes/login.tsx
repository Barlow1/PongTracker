import {
  ActionFunction,
  Link,
  useActionData,
  useFetcher,
} from "remix";
import Button from "~/components/Button/Button";
import Field from "~/components/FormElements/Field";
import InputError from "~/components/FormElements/InputError";
import { Paragraph } from "~/components/Typography/Typography";

import { routes } from "~/routes";
import { handleLoginFormSubmission } from "~/services/forms/handlers.server";
import { LoginActionData } from "~/services/forms/types";

export const action: ActionFunction = async ({
  request,
}: {
  request: Request;
}) => {
  return handleLoginFormSubmission(request);
};

export default function Login() {
  const login = useFetcher();
  const data = useActionData<LoginActionData>();
  const success = data?.status === "success";
  return (
    <>
      <div className="form-page">
        <login.Form reloadDocument={true} className="form" method="post">
          {data?.status === "error" ? (
            <InputError id="general-login-error">
              {data.errors.generalError}
            </InputError>
          ) : null}
          <Field
            name="email"
            type="email"
            label="Email"
            error={data?.status === "error" ? data.errors.email : null}
            disabled={login.state === "loading" || success}
          />
          <Field
            name="password"
            type="password"
            label="Password"
            error={data?.status === "error" ? data.errors.password : null}
            disabled={login.state === "loading" || success}
          />
          {success ? (
            <Paragraph>You have been successfully logged in!</Paragraph>
          ) : (
            <Button
              color="blue"
              style={{ maxWidth: "200px" }}
              className="self-center w-full"
              type="submit"
            >
              Login
            </Button>
          )}
        </login.Form>
        <Paragraph className="md:text-center">
          Don't have an account?{" "}
          <Link className="underlined" to={routes.register.path}>
            Register here
          </Link>
        </Paragraph>
      </div>
    </>
  );
}
