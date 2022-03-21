export const routes: Routes = {
  home: {
    title: "Home",
    path: "/",
  },
  register: {
    title: "Register",
    path: "/register",
  },
  login: {
    title: "Login",
    path: "/login",
  },
};

export type Routes = {
  home: {
    title: string;
    path: string;
  };
  register: {
    title: string;
    path: string;
  };
  login: {
    title: string;
    path: string;
  };
};

export type RoutesKeys = keyof Routes;
