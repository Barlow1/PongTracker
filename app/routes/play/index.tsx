import { LinksFunction, LoaderFunction } from "remix";
import Home from "~/containers/Home/Home";
import { useUser } from "~/hooks/useRootData";
import { requireUser } from "~/utils/user.session";

export const links: LinksFunction = () => [
  {
    rel: 'image',
    href: '/PlayHero.jpeg',
  },
];
export const loader: LoaderFunction = async ({request}: {request: Request}) => {
    const user = await requireUser(request);
    return user ? user : null;
}

export default function Play() {
    const user = useUser();
  return <>{user ? <Home user={user} /> : null}</>;
}
