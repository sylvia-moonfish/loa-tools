import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getSession, saveSession } from "~/session.server";

export const loader: LoaderFunction = async () => {
  return redirect("/");
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const locale = formData.get("locale");
  const redirectTo = formData.get("pathname");

  if (typeof locale !== "string" || typeof redirectTo !== "string") {
    return redirect("/");
  }

  const session = await getSession(request);
  session.lng = locale;

  return saveSession({ request, session, redirectTo });
};
