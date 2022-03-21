// this is needed by things the root needs, so to avoid circular deps we have to
// put it in its own file which is silly I know...

import type { LoaderData } from "../root";
import { handle } from "../root";
import { useMatchLoaderData } from "./useMatchLoaderData";

export const useRootData = () => useMatchLoaderData<LoaderData>(handle.id);
export function useUser() {
  const { session } = useRootData();
  const { user } = session;
  return user;
}
export function useRequiredUser() {
  const { session } = useRootData();
  const { user } = session;
  if (!user) throw new Error("User is required when using useUser");
  return user;
}
