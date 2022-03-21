import { LinksFunction } from "remix";

import LandingPage from "~/containers/LandingPage/LandingPage";

export const links: LinksFunction = () => [
  {
    rel: "image",
    href: "/android-chrome-192x192.png",
  },
];

export default function Index() {
                                   

  return <LandingPage />;
}
