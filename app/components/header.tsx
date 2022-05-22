import type { User } from "~/models/user.server";
import { Form, Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import Dropdown from "~/components/dropdown";

export const handle = {
  i18n: ["components\\header", "dictionary\\locale"],
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
      <div className="mx-auto grid h-20 w-[76.25rem] grid-cols-3">
        <div className="flex items-center justify-start">
          <Link to="/">
            <div className="text-[1.125rem] font-[900] uppercase leading-[1.25rem]">
              {t("shortTitle", { ns: "root" })}
            </div>
          </Link>
        </div>
        <div className="flex items-center justify-center gap-[2.6875rem]">
          <Link
            className={`${
              props.pathname !== "/tools/party-finder"
                ? "text-loa-inactive "
                : ""
            }flex items-center justify-center gap-[0.625rem]`}
            to="/tools/party-finder"
          >
            <span className="material-symbols-rounded filled-icon text-[1.5rem]">
              grid_view
            </span>
            <div className="text-[1.125rem] font-[400] leading-[1.25rem]">
              {t("partyFinderPageTitle", { ns: "root" })}
            </div>
          </Link>
          <Link
            className={`${
              props.pathname !== "/help" ? "text-loa-inactive " : ""
            }flex items-center justify-center gap-[0.625rem]`}
            to="/"
          >
            <span className="material-symbols-outlined filled-icon text-[1.5rem]">
              help
            </span>
            <div className="text-[1.125rem] font-[400] leading-[1.25rem]">
              {t("helpPageTitle", { ns: "root" })}
            </div>
          </Link>
        </div>
        <div className="flex items-center justify-end gap-[0.625rem]">
          <Dropdown
            button={
              <div className="flex h-[2.5rem] w-[7.5rem] cursor-pointer items-center justify-center rounded-[0.9375rem] bg-loa-button">
                <div className="w-[4.25rem] text-ellipsis text-[1rem] font-[400] leading-[1.25rem]">
                  {t(props.currentLocale, { ns: "dictionary\\locale" })}
                </div>
                <span className="material-symbols-outlined text-[1.25rem]">
                  expand_more
                </span>
              </div>
            }
            horizontalAlignment="center"
            horizontalPanelAnchor="center"
            origin="origin-top"
            panel={
              <div className="mt-[0.6875rem] flex w-[7.5rem] flex-col items-center rounded-[0.9375rem] border-[0.125rem] border-loa-button bg-loa-panel">
                {props.supportedLocales.map((locale, index) => {
                  return (
                    <Form action="/change-language" key={index} method="post">
                      <input name="locale" type="hidden" value={locale} />
                      <input
                        name="pathname"
                        type="hidden"
                        value={props.pathname}
                      />
                      {index !== 0 && (
                        <hr className="mx-[0.625rem] border-loa-button" />
                      )}
                      <button
                        className="w-[6.25rem] overflow-hidden text-ellipsis py-[1.375rem] text-[1rem] font-[500] leading-[1.25rem]"
                        type="submit"
                      >
                        {t(locale, { ns: "dictionary\\locale" })}
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
                    <span className="material-symbols-outlined filled-icon text-[1.5rem]">
                      person
                    </span>
                    <div className="text-[1rem] font-[500] leading-[1.25rem]">
                      {t("myRoster", { ns: "components\\header" })}
                    </div>
                  </Link>
                  <hr className="mx-[1.25rem] border-loa-button" />
                  <Form action="/logout" method="post">
                    <button
                      className="flex items-center justify-start gap-[0.625rem] py-[1.375rem] px-[1.25rem] text-loa-red"
                      type="submit"
                    >
                      <span className="material-symbols-outlined text-[1.5rem]">
                        logout
                      </span>
                      <div className="text-[1rem] font-[500] leading-[1.25rem]">
                        {t("logout", { ns: "components\\header" })}
                      </div>
                    </button>
                  </Form>
                </div>
              }
              verticalAlignment="bottom"
              verticalPanelAnchor="top"
            />
          ) : (
            <Link
              className="rounded-[0.9375rem] bg-loa-button-border py-[0.625rem] px-[1.375rem] text-[1rem] font-[400] leading-[1.25rem]"
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
