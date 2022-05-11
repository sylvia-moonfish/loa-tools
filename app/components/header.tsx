import type { User } from "~/models/user.server";
import { Form, Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import Dropdown from "~/components/dropdown";

export const handle = {
  i18n: ["components\\header", "locale"],
};

export default function Header(props: {
  currentLocale: string;
  pathname: string;
  supportedLocales: readonly string[];
  user: User | undefined;
}) {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 left-0 right-0 min-w-[76.25rem] border-b-2 border-loa-panel-border bg-loa-panel">
      <div className="mx-auto grid h-20 w-[76.25rem] grid-cols-3 gap-[0.625rem]">
        <div className="flex items-center justify-start">
          <Link to="/">
            <h1 className="text-[1.125rem] font-black uppercase">
              {t("shortTitle", { ns: "root" })}
            </h1>
          </Link>
        </div>
        <div className="flex items-center justify-center gap-[2.6875rem]">
          <Link
            className="flex items-center justify-center gap-[0.625rem]"
            to="/tools/party-finder"
          >
            <span className="material-icons-round text-[1.5rem]">
              grid_view
            </span>
            <div>{t("partyFinderPageTitle", { ns: "root" })}</div>
          </Link>
          <Link
            className="flex items-center justify-center gap-[0.625rem]"
            to="/"
          >
            <span className="material-icons text-[1.5rem]">help</span>
            <div>{t("helpPageTitle", { ns: "root" })}</div>
          </Link>
        </div>
        <div className="flex items-center justify-end gap-[0.625rem]">
          <Dropdown
            button={
              <div className="flex h-[2.5rem] w-[7.5rem] cursor-pointer items-center justify-center rounded-[0.9375rem] bg-loa-button">
                <div className="w-[4.25rem] overflow-hidden text-ellipsis">
                  {t(props.currentLocale, { ns: "locale" })}
                </div>
                <span className="material-icons text-[0.75rem]">
                  expand_more
                </span>
              </div>
            }
            horizontalAlignment="center"
            horizontalPanelAnchor="center"
            origin="origin-top"
            panel={
              <div className="mt-[0.6875rem] flex flex-col rounded-[0.9375rem] border-[0.125rem] border-loa-button bg-loa-panel px-[1.25rem]">
                {props.supportedLocales.map((locale, index) => {
                  return (
                    <Form action="/change-language" key={index} method="post">
                      <input name="locale" type="hidden" value={locale} />
                      <input
                        name="pathname"
                        type="hidden"
                        value={props.pathname}
                      />
                      <button
                        className={`${
                          index !== 0
                            ? "border-t-[0.0625rem] border-loa-button "
                            : ""
                        }py-[1.375rem] leading-[1.25rem]`}
                        type="submit"
                      >
                        {t(locale, { ns: "locale" })}
                      </button>
                    </Form>
                  );
                })}
              </div>
            }
            verticalAlignment="bottom"
            verticalPanelAnchor="top"
          />
          {props.user ? (
            <Dropdown
              button={
                <img
                  alt="discord avatar"
                  className="h-[2.5rem] w-[2.5rem] cursor-pointer rounded-full"
                  src={`https://cdn.discordapp.com/avatars/${
                    props.user.discordId
                  }/${props.user.discordAvatarHash}.${
                    props.user.discordAvatarHash.substring(0, 2) === "a_"
                      ? "gif"
                      : "png"
                  }`}
                />
              }
              horizontalAlignment="right"
              horizontalPanelAnchor="right"
              origin="origin-top"
              panel={
                <div className="mt-[0.6875rem] flex w-[15.875rem] flex-col items-stretch justify-center rounded-[0.9375rem] border-[0.125rem] border-loa-button bg-loa-panel">
                  <Link
                    className="flex items-center justify-start gap-[0.625rem] py-[1.375rem] px-[1.25rem]"
                    to="/characters"
                  >
                    <span className="material-icons text-[1.5rem]">group</span>
                    <div>{t("myRoster", { ns: "components\\header" })}</div>
                  </Link>
                  <hr className="mx-[1.25rem] border-loa-button" />
                  <Form action="/logout" method="post">
                    <button
                      className="flex items-center justify-start gap-[0.625rem] py-[1.375rem] px-[1.25rem] text-loa-red"
                      type="submit"
                    >
                      <span className="material-icons text-[1.5rem]">
                        logout
                      </span>
                      <div>{t("logout", { ns: "components\\header" })}</div>
                    </button>
                  </Form>
                </div>
              }
              verticalAlignment="bottom"
              verticalPanelAnchor="top"
            />
          ) : (
            <Link
              className="rounded-[0.9375rem] bg-loa-button-border py-[0.625rem] px-[1.375rem] leading-[1.25rem]"
              to={`/login?${new URLSearchParams({
                redirectTo: props.pathname,
              })}`}
            >
              {t("login", { ns: "components\\header" })}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
