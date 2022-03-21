import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuLink,
  MenuPopover,
} from '@reach/menu-button';
import React from 'react';
import { Form, Link, useFetcher } from 'remix';
import { routes, RoutesKeys } from '~/routes';
import { Sling as Hamburger } from 'hamburger-react';
import { Transition, animated } from '@react-spring/web';
import useTheme from '~/hooks/useTheme';
import { Theme } from '../ThemeProvider/ThemeProvider';
import Switch from '../DarkModeSwitch/DarkModeSwitch';
import { useUser } from '~/hooks/useRootData';
import { ROLE } from '~/utils/types';

export function MobileNavigation() {
  const [theme, setTheme] = useTheme();
  const user = useUser();
  const toggleTheme = () => {
    if (theme === Theme.DARK) {
      setTheme(Theme.LIGHT);
    } else {
      setTheme(Theme.DARK);
    }
  };
  const logoutFetcher = useFetcher();
  const Links = Object.entries(routes).map(([name, page]) => {
    return (
      <MenuLink
        key={name}
        className="flex p-9 hover:bg-secondary border-b border-gray-200 text-primary dark:border-gray-600 hover:no-underline"
        as={Link}
        to={page.path}
      >
        {page.title}
      </MenuLink>
    );
  });
  return (
    <div className="md:hidden">
      <Menu>
        {({ isExpanded }) => (
          <>
            <MenuButton>
              <Hamburger
                aria-label="navigation menu"
                aria-controls="nav-menu"
                aria-expanded={isExpanded ? 'true' : undefined}
                aria-haspopup="true"
                toggled={isExpanded}
              />
            </MenuButton>
            {isExpanded && (
              <MenuPopover
                position={(r) => ({
                  top: `calc(${Number(r?.top) + Number(r?.height)}px + 1.5rem)`,
                  left: 0,
                  bottom: 0,
                  right: 0,
                })}
                className="z-50 bg-primary block md:hidden"
              >
                <Transition
                  items={isExpanded}
                  from={{
                    transform: 'translate3d(0,100px,0)',
                  }}
                  enter={{ transform: 'translate3d(0,0px,0)' }}
                  leave={{ transform: 'translate3d(0,100px,0)' }}
                  reverse={true}
                >
                  {(styles) => (
                    <animated.div style={styles}>
                      <MenuItems className="p-0 bg-transparent border-none focus:outline-none">
                        {user?.role === ROLE.ADMIN && (
                          <>
                            <MenuLink
                              as={Link}
                              to="/admin/users"
                              className="flex p-9 hover:bg-secondary border-b border-gray-200 text-primary dark:border-gray-600 hover:no-underline"
                            >
                              Users
                            </MenuLink>
                            <MenuLink
                              to={`/admin/organizations`}
                              className="flex p-9 hover:bg-secondary border-b border-gray-200 text-primary dark:border-gray-600 hover:no-underline"
                              as={Link}
                            >
                              Organizations
                            </MenuLink>
                          </>
                        )}
                        {user ? (
                          <>
                            <MenuLink
                              to={`/play`}
                              className="flex p-9 hover:bg-secondary border-b border-gray-200 text-primary dark:border-gray-600 hover:no-underline"
                              as={Link}
                            >
                              Play
                            </MenuLink>
                            <logoutFetcher.Form
                              reloadDocument
                              action="actions/logout"
                              method="post"
                            >
                              <MenuItem
                                className="flex p-9 hover:bg-secondary border-b border-gray-200 text-primary dark:border-gray-600 hover:no-underline"
                                onClick={(event) => {
                                  event.preventDefault();
                                }}
                                // eslint-disable-next-line @typescript-eslint/no-empty-function
                                onSelect={() => {}}
                                onMouseUp={(event) => {
                                  event.preventDefault();
                                  logoutFetcher.submit(
                                    {},
                                    {
                                      action: 'actions/logout',
                                      method: 'post',
                                    }
                                  );
                                }}
                              >
                                <button className="underlined" type={'submit'}>
                                  Logout
                                </button>
                              </MenuItem>
                            </logoutFetcher.Form>
                          </>
                        ) : (
                          Links
                        )}
                      </MenuItems>
                      <MenuItem
                        onClick={(event) => {
                          event.preventDefault();
                        }}
                        // eslint-disable-next-line @typescript-eslint/no-empty-function
                        onSelect={() => {}}
                        onMouseUp={(event) => {
                          event.preventDefault();
                          toggleTheme();
                        }}
                      >
                        <div className="mx-auto my-5">
                          <Switch
                            isOn={theme === Theme.LIGHT}
                            handleToggle={toggleTheme}
                          />
                        </div>
                      </MenuItem>
                    </animated.div>
                  )}
                </Transition>
              </MenuPopover>
            )}
          </>
        )}
      </Menu>
    </div>
  );
}

export function DesktopNavigation() {
  const [theme, setTheme] = useTheme();
  const user = useUser();
  const toggleTheme = () => {
    if (theme === Theme.DARK) {
      setTheme(Theme.LIGHT);
    } else {
      setTheme(Theme.DARK);
    }
  };
  const Links = (Object.keys(routes) as Array<RoutesKeys>).map((key) => {
    return (
      <Link
        key={routes[key].path}
        to={`${routes[key].path}`}
        className="underlined"
        prefetch="intent"
      >
        {routes[key].title}
      </Link>
    );
  });
  return (
    <nav aria-label="Main navigation" className="header-nav hidden md:flex">
      <ul>
        {user?.role === ROLE.ADMIN && (
          <>
            <Link to={`/admin/users`} className="underlined" prefetch="intent">
              Users
            </Link>
            <Link
              to={`/admin/organizations`}
              className="underlined"
              prefetch="intent"
            >
              Organizations
            </Link>
          </>
        )}
        {user && (
          <Link to={`/play`} className="underlined" prefetch="intent">
            Play
          </Link>
        )}
        {user ? (
          <Form reloadDocument action="actions/logout" method="post">
            <button className="underlined" type={'submit'}>
              Logout
            </button>
          </Form>
        ) : (
          Links
        )}

        <Switch isOn={theme === Theme.LIGHT} handleToggle={toggleTheme} />
      </ul>
    </nav>
  );
}

export function Navigation() {
  return (
    <>
      <MobileNavigation />
      <DesktopNavigation />
    </>
  );
}
export default Navigation;
