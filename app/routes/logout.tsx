import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { getSession, saveSession } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request);
  session.userId = undefined;

  return saveSession({
    request,
    session,
    redirectTo: "/",
  });
};

export const loader: LoaderFunction = async () => {
  return redirect("/");
};
