import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getUserById } from "~/models/user.server";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export type Session = {
  lng: string | undefined;
  loginRedirect: string | undefined;
  state: string | undefined;
  userId: string | undefined;
};

export async function getSession(request: Request): Promise<Session> {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  return {
    lng: session.get("lng"),
    loginRedirect: session.get("loginRedirect"),
    state: session.get("state"),
    userId: session.get("userId"),
  };
}

export async function getUser(request: Request) {
  const userId = (await getSession(request)).userId;

  if (userId) {
    const user = await getUserById(userId);

    if (user) return user;
  }

  return undefined;
}

export async function requireUser(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const user = await getUser(request);

  if (user) return user;

  const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);

  throw redirect(`/login?${searchParams}`);
}

export async function saveSession({
  request,
  session,
  redirectTo,
}: {
  request: Request;
  session: Session;
  redirectTo: string;
}) {
  const _session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  session.lng ? _session.set("lng", session.lng) : _session.unset("lng");
  session.loginRedirect
    ? _session.set("loginRedirect", session.loginRedirect)
    : _session.unset("loginRedirect");
  session.state
    ? _session.set("state", session.state)
    : _session.unset("state");
  session.userId
    ? _session.set("userId", session.userId)
    : _session.unset("userId");

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(_session, {
        maxAge: undefined,
      }),
    },
  });
}
