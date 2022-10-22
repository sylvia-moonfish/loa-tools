import type { Alarm, User } from "@prisma/client";
import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import type { LocaleType } from "~/i18n";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useChangeLanguage } from "remix-i18next";
import Header from "~/components/header";
import fontsStylesheetUrl from "~/styles/fonts.css";
import materialSymbolsStylesheetUrl from "~/styles/material-symbols.css";
import tailwindStylesheetUrl from "~/styles/tailwind.css";
import { prisma } from "~/db.server";
import i18nConfig from "~/i18n";
import i18next from "~/i18next.server";
import { getUserFromRequest } from "~/session.server";

export const links: LinksFunction = () => {
  return [
    { href: fontsStylesheetUrl, rel: "stylesheet" },
    {
      href: materialSymbolsStylesheetUrl,
      rel: "stylesheet",
    },
    { href: tailwindStylesheetUrl, rel: "stylesheet" },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  viewport: "width=device-width,initial-scale=1",
});

export const handle = {
  i18n: [
    "components\\my-roster\\expandable-panel",
    "components\\tools\\party-finder\\add-party-button",
    "components\\tools\\party-finder\\content-filter",
    "components\\header",
    "dictionary\\job",
    "dictionary\\locale",
    "dictionary\\party-find-apply-state-value",
    "dictionary\\party-find-content-type",
    "dictionary\\party-find-post-state",
    "dictionary\\time-elapsed",
    "routes\\character\\add",
    "routes\\character\\id",
    "routes\\my-roster\\my-parties",
    "routes\\party-find-post\\id",
    "routes\\tools\\party-finder\\id",
    "routes\\tools\\party-finder",
    "routes\\my-roster",
    "error-messages",
    "root",
  ],
};

type LoaderData = {
  alarms:
    | {
        id: Alarm["id"];
        createdAt: Alarm["createdAt"];
        message: Alarm["message"];
        link: Alarm["link"];
        isRead: Alarm["isRead"];
      }[]
    | undefined;
  locale: LocaleType;
  user:
    | {
        id: User["id"];
        discordId: User["discordId"];
        discordAvatarHash: User["discordAvatarHash"];
      }
    | undefined;
};

export const loader: LoaderFunction = async ({ request }) => {
  const _user = await getUserFromRequest(request);
  const user =
    _user &&
    (await prisma.user.findFirst({
      where: { id: _user.id },
      select: { id: true, discordId: true, discordAvatarHash: true },
    }));
  const alarms = user
    ? await prisma.alarm.findMany({
        orderBy: { createdAt: "desc" },
        where: { userId: user.id },
        select: {
          id: true,
          createdAt: true,
          message: true,
          link: true,
          isRead: true,
        },
      })
    : undefined;

  return json<LoaderData>({
    alarms,
    locale: (await i18next.getLocale(request)) as LocaleType,
    user: user ?? undefined,
  });
};

export default function App() {
  const data = useLoaderData<LoaderData>();
  const location = useLocation();
  const { i18n } = useTranslation();

  useChangeLanguage(data.locale);

  return (
    <html className="h-full" dir={i18n.dir()} lang={data.locale}>
      <head>
        <Meta />
        <Links />
      </head>
      <body className="flex min-h-screen select-none flex-col whitespace-nowrap bg-loa-body text-loa-white">
        <Header
          alarms={data.alarms}
          currentLocale={data.locale}
          location={location}
          supportedLocales={i18nConfig.supportedLngs || []}
          user={data.user}
        />
        <div className="flex w-full flex-grow">
          <Outlet />
        </div>
        <footer className="z-10 grid h-20 grid-cols-3 items-center justify-between border-t-2 border-loa-panel-border bg-loa-panel px-28">
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
