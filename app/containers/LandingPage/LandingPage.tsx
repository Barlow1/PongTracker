import { Link } from "remix";
import Button from "~/components/Button/Button";
import { H1 } from "~/components/Typography/Typography";
import { useUser } from "~/hooks/useRootData";
import { routes } from "~/routes";



const LandingPage = () => {
  const user = useUser();
  return (
    <>
      <div className="container main-content">
        <div className="page justify-center text-center">
          <img
            className="justify-self-center"
            src="/android-chrome-192x192.png"
          />
          <H1 className="justify-self-center">PongTracker</H1>
          {user ? (
            <Link
              className="justify-self-center"
              prefetch="intent"
              to={"/play"}
            >
              <Button color="blue">Play now!</Button>
            </Link>
          ) : (
            <Link className="justify-self-center" to={routes.register.path}>
              <Button color="blue">Get Started</Button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default LandingPage;
