import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getSession, getUser, saveSession } from "~/session.server";
import { generateRandomString } from "~/utils.server";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirectTo") || "/";

  if (!process.env.DISCORD_CLIENT_ID || (await getUser(request)))
    return redirect(redirectTo);

  const session = await getSession(request);
  session.loginRedirect = redirectTo;
  session.state = generateRandomString(10);

  return saveSession({
    request,
    session,
    redirectTo: `https://discord.com/api/oauth2/authorize?${new URLSearchParams(
      [
        ["client_id", process.env.DISCORD_CLIENT_ID],
        ["redirect_uri", `${url.origin}/discord/redirect`],
        ["response_type", "code"],
        ["scope", "identify"],
        ["state", session.state],
      ]
    )}`,
  });
};
/*import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import type { RootContext } from "~/root";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import * as React from "react";
import { useTranslation } from "react-i18next";

import { i18n } from "~/i18n.server";
import { createUserSession, getUserId } from "~/session.server";
import { verifyLogin } from "~/models/user.server";
import { validateEmail } from "~/utils";

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  return {
    title: data.title,
  };
};

export const handle = {
  i18n: ["common", "validation"],
};

type LoaderData = {
  title: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  if (userId) return redirect("/");

  const t = await i18n.getFixedT(request, "common");

  return json<LoaderData>({
    title: `${t("login")} | ${t("shortTitle")}`,
  });
};

interface ActionData {
  errors?: {
    email?: string;
    password?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const t = await i18n.getFixedT(request, "validation");

  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = formData.get("redirectTo");

  if (!validateEmail(email)) {
    return json<ActionData>(
      { errors: { email: t("emailInvalid") } },
      { status: 400 }
    );
  }

  if (typeof password !== "string") {
    return json<ActionData>(
      { errors: { password: t("passwordRequired") } },
      { status: 400 }
    );
  }

  if (password.length < 4) {
    return json<ActionData>(
      { errors: { password: t("passwordTooShort") } },
      { status: 400 }
    );
  }

  const user = await verifyLogin(email, password);

  if (!user) {
    return json<ActionData>(
      { errors: { email: t("credentialInvalid") } },
      { status: 400 }
    );
  }

  return createUserSession({
    request,
    userId: user.id,
    redirectTo: typeof redirectTo === "string" ? redirectTo : "/",
  });
};

export default function LoginPage() {
  const { setPathname } = useOutletContext<RootContext>();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  const actionData = useActionData() as ActionData;

  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setPathname("/login");

    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Form
        className="flex w-full max-w-md flex-col gap-8"
        method="post"
        noValidate
      >
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-col gap-2">
            <label className="text-sm" htmlFor="email">
              {t("email")}
            </label>
            <input
              aria-describedby="email-error"
              aria-invalid={actionData?.errors?.email ? true : undefined}
              autoComplete="email"
              autoFocus={true}
              className="w-full rounded-md px-2 py-1 text-lg text-gray-900"
              id="email"
              name="email"
              ref={emailRef}
              required
              type="email"
            />
            {actionData?.errors?.email && (
              <div className="text-sm text-red-700" id="email-error">
                {actionData.errors.email}
              </div>
            )}
          </div>
          <div className="flex w-full flex-col gap-2">
            <label className="text-sm" htmlFor="password">
              {t("password")}
            </label>
            <input
              aria-describedby="password-error"
              aria-invalid={actionData?.errors?.password ? true : undefined}
              autoComplete="current-password"
              className="w-full rounded-md px-2 py-1 text-lg text-gray-900"
              id="password"
              name="password"
              ref={passwordRef}
              required
              type="password"
            />
            {actionData?.errors?.password && (
              <div className="text-sm text-red-700" id="password-error">
                {actionData.errors.password}
              </div>
            )}
          </div>
        </div>
        <input name="redirectTo" type="hidden" value={redirectTo} />
        <button
          className="w-full rounded-md bg-indigo-700 py-2 px-4 transition hover:bg-indigo-600 active:bg-indigo-800"
          type="submit"
        >
          {t("login")}
        </button>
        <div className="text-center">
          소셜 로그인 할건데 귀찮아서 아직 안 함
        </div>
      </Form>
    </div>
  );
}
*/
