import {
  faGear,
  faHome,
  faNewspaper,
  faPlus,
  faSignOut,
  faTrophy,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Link, LoaderFunction, Outlet, useLoaderData } from 'remix';
import Switch from '~/components/DarkModeSwitch/DarkModeSwitch';
import { Theme } from '~/components/ThemeProvider/ThemeProvider';
import useTheme from '~/hooks/useTheme';
import { Logo } from '~/root';
import { requireUser } from '~/utils/user.session';

export const loader: LoaderFunction = async ({
  request,
}: {
  request: Request;
}) => {
  const user = await requireUser(request);
  return user ? user : null;
};

export default function Play() {
  const user = useLoaderData();
  const [theme, setTheme] = useTheme();
  const toggleTheme = () => {
    if (theme === Theme.DARK) {
      setTheme(Theme.LIGHT);
    } else {
      setTheme(Theme.DARK);
    }
  };
  return (
    <div className="lg:flex grow px-6">
      <div className="hidden lg:block shrink-0">
        <div
          className={
            'side-nav h-full max-h-screen overflow-x-hidden overflow-y-auto w-64 xl:w-80 2xl:w-96 sticky top-0 py-16 pl-6 pr-3 xl:pr-5 2xl:pr-6'
          }
        >
          <nav className="mad:nav">
            <Logo />
            <ul>
              <li className="py-2">
                <Link className="underlined" prefetch="intent" to={'/play'}>
                  Play&nbsp;
                  <FontAwesomeIcon icon={faHome} />
                </Link>
              </li>
              <li className="py-2">
                <Link
                  className="underlined"
                  prefetch="intent"
                  to={'/play/match'}
                >
                  Record Match&nbsp;
                  <FontAwesomeIcon icon={faPlus} />
                </Link>
              </li>
              <li className="py-2">
                <Link
                  className="underlined"
                  prefetch="intent"
                  to={'/play/history'}
                >
                  Match History&nbsp;
                  <FontAwesomeIcon icon={faNewspaper} />
                </Link>
              </li>
              <li className="py-2">
                <Link
                  className="underlined"
                  prefetch="intent"
                  to={'/play/leaderboard'}
                >
                  Leaderboard&nbsp;
                  <FontAwesomeIcon icon={faTrophy} />
                </Link>
              </li>
              {user ? (
                <li className="py-2">
                  <Link
                    className="underlined"
                    prefetch="intent"
                    to={'/play/settings'}
                  >
                    Settings&nbsp;
                    <FontAwesomeIcon icon={faGear} />
                  </Link>
                </li>
              ) : null}
              {user ? (
                <li className="py-2">
                  <Form
                    reloadDocument
                    replace
                    action="/actions/logout"
                    method="post"
                  >
                    <button className="underlined" type={'submit'}>
                      Logout &nbsp;
                      <FontAwesomeIcon icon={faSignOut} />
                    </button>
                  </Form>
                </li>
              ) : null}
              <li className="py-2">
                <Switch
                  isOn={theme === Theme.LIGHT}
                  handleToggle={toggleTheme}
                />
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="lg:hidden border-b">
        <div className="pt-5">
          <Logo />
        </div>
        <div className="top-6 right-6 flex gap-2 items-center w-full">
          <details className="w-full">
            <summary className="pb-4 pt-6 cursor-pointer">Navigation</summary>
            <nav className="mad:nav w-full">
              <ul>
                <li className="py-2">
                  <Link className="underlined" prefetch="intent" to={'/play'}>
                    Home&nbsp;
                    <FontAwesomeIcon icon={faHome} />
                  </Link>
                </li>
                <li className="py-2">
                  <Link
                    className="underlined"
                    prefetch="intent"
                    to={'/play/match'}
                  >
                    Record Match&nbsp;
                    <FontAwesomeIcon icon={faPlus} />
                  </Link>
                </li>
                <li className="py-2">
                  <Link
                    className="underlined"
                    prefetch="intent"
                    to={'/play/history'}
                  >
                    Match History&nbsp;
                    <FontAwesomeIcon icon={faNewspaper} />
                  </Link>
                </li>
                <li className="py-2">
                  <Link
                    className="underlined"
                    prefetch="intent"
                    to={'/play/leaderboard'}
                  >
                    Leaderboard&nbsp;
                    <FontAwesomeIcon icon={faTrophy} />
                  </Link>
                </li>
                {user ? (
                  <li className="py-2">
                    <Link
                      className="underlined"
                      prefetch="intent"
                      to={'/play/settings'}
                    >
                      Settings&nbsp;
                      <FontAwesomeIcon icon={faGear} />
                    </Link>
                  </li>
                ) : null}
                {user ? (
                  <li className="py-2">
                    <Form
                      reloadDocument
                      replace
                      action="/actions/logout"
                      method="post"
                    >
                      <button className="underlined" type={'submit'}>
                        Logout &nbsp;
                        <FontAwesomeIcon icon={faSignOut} />
                      </button>
                    </Form>
                  </li>
                ) : null}
                <li className="py-2">
                  <Switch
                    isOn={theme === Theme.LIGHT}
                    handleToggle={toggleTheme}
                  />
                </li>
              </ul>
            </nav>
          </details>
        </div>
      </div>
      <div className="py-6 md:py-8 lg:py-10 lg:pr-6 lg:pl-3 xl:pl-5 2xl:pl-6 w-full justify-center">
        <Outlet />
      </div>
    </div>
  );
}
