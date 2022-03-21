import { ActionFunction, redirect } from "remix";
import { getUserSession } from "~/utils/user.session";

export const action: ActionFunction = async ({ request }) => {
  const userSession = await getUserSession(request);

    try {
      
    return redirect('/',
      {
        headers: { "Set-Cookie": await userSession.destroy() },
      }
    );
    } catch {
     return redirect("/");
    }
 
};
