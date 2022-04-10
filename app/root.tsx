import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useSetupTranslations } from "remix-i18next";

import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import { i18n } from "~/i18n.server";
import { getUser } from "./session.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Notes",
  viewport: "width=device-width,initial-scale=1",
});

type LoaderData = {
  i18n: Awaited<ReturnType<typeof i18n.getTranslations>>;
  locale: string;
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    i18n: await i18n.getTranslations(request, ["common", "index"]),
    locale: await i18n.getLocale(request), // get server-side locale on the loader so it can reach client.
    user: await getUser(request),
  });
};

export default function App() {
  const data = useLoaderData<LoaderData>();
  useSetupTranslations(data.locale); // set-up translation on the root level.

  // let's see if i can use this right after set-up...
  let commonT = useTranslation("common").t;

  // TODO: create common layout here with translation above.
  // TODO: make language selector dropdown on the common layout?

  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <div>{commonT("test")}</div>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
