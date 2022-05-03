import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { ChevronDownIcon } from "@heroicons/react/solid";
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
        className="flex min-h-screen select-none flex-col whitespace-nowrap bg-gray-900 text-gray-100"
        onClick={() => {
          setOpenLanguageDropdown(false);
        }}
      >
        <header className="sticky top-0 left-0 right-0 grid grid-cols-3 items-stretch justify-between">
          <div className="flex items-stretch justify-start px-8 py-4">
            <Link to="/">
              <h1 className="text-3xl font-bold uppercase transition hover:text-indigo-600 active:text-indigo-800">
                {t("shortTitle")}
              </h1>
            </Link>
          </div>
          <div className="flex items-stretch justify-center">
            <Link
              className="flex items-center justify-center transition hover:bg-indigo-600 active:bg-indigo-800"
              to="/"
            >
              <span className="px-8 py-4">Menu Stuff</span>
            </Link>
          </div>
          <div className="flex items-stretch justify-end">
            <div className="relative flex items-stretch">
              <div
                className={`${
                  openLanguageDropdown ? "bg-indigo-500" : ""
                } flex cursor-pointer items-center justify-center gap-2 px-8 py-4 transition hover:bg-indigo-600 active:bg-indigo-800`}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenLanguageDropdown(!openLanguageDropdown);
                }}
              >
                <div>{getLanguageTextFromLocale(data.locale)}</div>
                <div>
                  <ChevronDownIcon className="h-5 w-5" />
                </div>
              </div>
              <div
                className={`${
                  openLanguageDropdown ? "scale-y-100" : "scale-y-0"
                } absolute top-2/4 left-2/4 flex origin-top -translate-x-2/4 flex-col items-stretch overflow-hidden rounded-md bg-gray-800 shadow-2xl transition`}
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
                      className="px-8 py-4 text-center transition hover:bg-indigo-600 active:bg-indigo-800"
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
                  className="flex items-center justify-center px-8 py-4 transition hover:bg-indigo-600 active:bg-indigo-800"
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
                    className="flex items-center justify-center px-8 py-4 transition hover:bg-indigo-600 active:bg-indigo-800"
                    type="submit"
                  >
                    {t("logout")}
                  </button>
                </Form>
              </div>
            ) : (
              <Link
                className="flex items-center justify-center transition hover:bg-indigo-600 active:bg-indigo-800"
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
