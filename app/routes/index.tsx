import { LinksFunction } from "remix";

import LandingPage from "~/containers/LandingPage/LandingPage";

export const links: LinksFunction = () => [
  {
    rel: "image",
    href: "/PongTrackerHero.jpeg",
  },
];

export default function Index() {
                                   

  return <LandingPage />;
}
