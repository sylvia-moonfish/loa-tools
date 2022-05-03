import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { ChevronDownIcon, ViewGridIcon } from "@heroicons/react/solid";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
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
import { getPrimaryCharacter } from "~/models/character.server";
import fontsStylesheetUrl from "~/styles/fonts.css";
import tailwindStylesheetUrl from "~/styles/tailwind.css";
import { initOptions } from "~/i18n.config";
import { i18n } from "~/i18n.server";
import { getUser } from "~/session.server";
import { getLanguageTextFromLocale } from "~/utils";

export const links: LinksFunction = () => {
  return [
    { href: fontsStylesheetUrl, rel: "stylesheet" },
    { href: tailwindStylesheetUrl, rel: "stylesheet" },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  viewport: "width=device-width,initial-scale=1",
});

export const handle = {
  i18n: ["common"],
};

type LoaderData = {
  locale: string;
  pathname: string;
  primaryCharacter: Awaited<ReturnType<typeof getPrimaryCharacter>> | undefined;
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  return json<LoaderData>({
    locale: await i18n.getLocale(request),
    pathname: new URL(request.url).pathname,
    primaryCharacter: user
      ? await getPrimaryCharacter({ userId: user.id })
      : undefined,
    user: user,
  });
};

export type RootContext = {
  setPathname: React.Dispatch<React.SetStateAction<string>>;
};

export default function App() {
  const data = useLoaderData<LoaderData>();
  useChangeLanguage(data.locale);

  const { i18n, t } = useTranslation();

  const supportedLanguages = (initOptions.supportedLngs as string[]).reduce(
    (result: { locale: string; text: string }[], element) => {
      const text = getLanguageTextFromLocale(element);

      if (text) {
        result.push({
          locale: element,
          text,
        });
      }

      return result;
    },
    []
  );

  const [openLanguageDropdown, setOpenLanguageDropdown] = React.useState(false);
  const [pathname, setPathname] = React.useState(data.pathname);

  const context: RootContext = { setPathname };

  return (
    <html className="h-full" dir={i18n.dir()} lang={data.locale}>
      <head>
        <Meta />
        <Links />
      </head>
      <body
        className="flex min-h-screen select-none flex-col whitespace-nowrap bg-loa-body text-loa-white"
        onClick={() => {
          setOpenLanguageDropdown(false);
        }}
      >
        <header className="sticky top-0 left-0 right-0 grid h-20 grid-cols-3 items-center justify-between border-b-2 border-loa-panel-border bg-loa-panel">
          <div className="pl-28">
            <Link to="/">
              <h1 className="text-lg font-black uppercase transition">
                {t("shortTitle")}
              </h1>
            </Link>
          </div>
          <div className="flex items-center justify-center">
            <Link
              className="flex items-center justify-center gap-2.5 transition"
              to="/"
            >
              <ViewGridIcon className="h-6 w-6" />
              <div>{t("partyFinder")}</div>
            </Link>
          </div>
          <div className="flex items-center justify-end pr-28">
            <div className="relative flex items-center justify-center">
              <div
                className={`flex h-[2.5rem] w-[7.5rem] cursor-pointer items-center justify-center rounded-2xl bg-loa-button transition`}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenLanguageDropdown(!openLanguageDropdown);
                }}
              >
                <div className="w-[4.25rem] overflow-hidden text-ellipsis">
                  {getLanguageTextFromLocale(data.locale)}
                </div>
                <div>
                  <ChevronDownIcon className="h-5 w-5" />
                </div>
              </div>
              <div
                className={`${
                  openLanguageDropdown ? "scale-y-100" : "scale-y-0"
                } absolute top-2/4 left-2/4 flex origin-top -translate-x-2/4 flex-col items-stretch overflow-hidden rounded-md bg-loa-panel shadow-2xl transition`}
              >
                {supportedLanguages.map((language, index) => (
                  <Form
                    action="/change-language"
                    className="flex flex-col items-stretch"
                    key={index}
                    method="post"
                  >
                    <input
                      name="locale"
                      type="hidden"
                      value={language.locale}
                    />
                    <input name="pathname" type="hidden" value={pathname} />
                    <button
                      className="hover:bg-indigo-600 active:bg-indigo-800 px-8 py-4 text-center transition"
                      type="submit"
                    >
                      {language.text}
                    </button>
                  </Form>
                ))}
              </div>
            </div>
            {data.user ? (
              <div className="flex items-stretch justify-center">
                <Link
                  className="hover:bg-indigo-600 active:bg-indigo-800 flex items-center justify-center px-8 py-4 transition"
                  to="/characters"
                >
                  {data.primaryCharacter
                    ? data.primaryCharacter.name
                    : t("noPrimaryCharacter")}
                </Link>
                <Form
                  action="/logout"
                  className="flex items-stretch justify-center"
                  method="post"
                >
                  <button
                    className="hover:bg-indigo-600 active:bg-indigo-800 flex items-center justify-center px-8 py-4 transition"
                    type="submit"
                  >
                    {t("logout")}
                  </button>
                </Form>
              </div>
            ) : (
              <Link
                className="hover:bg-indigo-600 active:bg-indigo-800 flex items-center justify-center transition"
                to={`/login?redirectTo=${pathname}`}
              >
                <span className="px-8 py-4">{t("login")}</span>
              </Link>
            )}
          </div>
        </header>
        <div className="flex w-full flex-grow">
          <div className="w-96"></div>
          <Outlet context={context} />
          <div className="w-96"></div>
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
