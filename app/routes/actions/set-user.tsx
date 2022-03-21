import { json } from "remix";
import type { ActionFunction } from "remix";
import { getUserSession } from "~/utils/user.session";
import { Player } from "~/utils/types";

export const action: ActionFunction = async ({ request }) => {
  const userSession = await getUserSession(request);
  const requestText = await request.text();
  const form = new URLSearchParams(requestText);
  const name = form.get("name");
  const id = Number(form.get("id"));
  const email = String(form.get("email"));
  const orgId = Number(form.get("orgId"));
  const user: Player = { id, email, name, orgId };
  try {
    userSession.setUser(user);
    return json(
      { success: true },
      {
        headers: { "Set-Cookie": await userSession.commit() },
      }
    );
  } catch {
    return json({ success: false });
  }
};
