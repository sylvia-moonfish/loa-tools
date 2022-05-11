import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
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
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useChangeLanguage } from "remix-i18next";
import Header, { handle as HeaderHandle } from "~/components/header";
import fontsStylesheetUrl from "~/styles/fonts.css";
import tailwindStylesheetUrl from "~/styles/tailwind.css";
import { initOptions } from "~/i18n.config";
import { i18n } from "~/i18n.server";
import { getUserFromRequest } from "~/session.server";

export const links: LinksFunction = () => {
  return [
    { href: fontsStylesheetUrl, rel: "stylesheet" },
    { href: "/material-icons/iconfont/material-icons.css", rel: "stylesheet" },
    { href: tailwindStylesheetUrl, rel: "stylesheet" },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  viewport: "width=device-width,initial-scale=1",
});

export const handle = {
  i18n: [...new Set(["root", ...HeaderHandle.i18n])],
};

type LoaderData = {
  locale: string;
  pathname: string;
  user: Awaited<ReturnType<typeof getUserFromRequest>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    locale: await i18n.getLocale(request),
    pathname: new URL(request.url).pathname,
    user: await getUserFromRequest(request),
  });
};

export type RootContext = {
  setPathname: React.Dispatch<React.SetStateAction<string>>;
};

export default function App() {
  const data = useLoaderData<LoaderData>();
  useChangeLanguage(data.locale);

  const { i18n } = useTranslation();

  const [pathname, setPathname] = React.useState(data.pathname);

  const context: RootContext = { setPathname };

  return (
    <html className="h-full" dir={i18n.dir()} lang={data.locale}>
      <head>
        <Meta />
        <Links />
      </head>
      <body className="flex min-h-screen select-none flex-col whitespace-nowrap bg-loa-body text-loa-white">
        <Header
          currentLocale={data.locale}
          pathname={pathname}
          supportedLocales={initOptions.supportedLngs || []}
          user={data.user}
        />
        <div className="flex w-full flex-grow">
          <Outlet context={context} />
        </div>
        <footer className="grid h-20 grid-cols-3 items-center justify-between border-t-2 border-loa-panel-border bg-loa-panel px-28">
          <div className="flex items-center justify-start">
            social stuff goes here
          </div>
          <div className="flex items-center justify-center">
            2022 - All Rights Reserved.
          </div>
          <div className="flex items-center justify-end">placeholder</div>
        </footer>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
