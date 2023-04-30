import { Alarm, AlarmMessageType, User } from "@prisma/client";
import type { Location } from "@remix-run/react";
import { Form, Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import Dropdown from "~/components/old-dropdown";
import { generateDiscordAvatarSrc } from "~/utils";

export const handle = {
  i18n: ["components\\header", "dictionary\\locale"],
};

export default function Header(props: {
  alarms:
    | {
        id: Alarm["id"];
        createdAt: Alarm["createdAt"];
        message: Alarm["message"];
        link: Alarm["link"];
        isRead: Alarm["isRead"];
      }[]
    | undefined;
  currentLocale: string;
  location: Location;
  supportedLocales: readonly string[];
  user:
    | {
        id: User["id"];
        discordId: User["discordId"];
        discordAvatarHash: User["discordAvatarHash"];
      }
    | undefined;
}) {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 left-0 right-0 z-10 min-w-[76.25rem] border-b-2 border-loa-panel-border bg-loa-panel">
      <div className="mx-auto grid h-20 w-[76.25rem] grid-cols-3">
        <div className="flex items-center justify-start">
          <Link to="/">
            <div className="text-[1.125rem] font-[900] uppercase leading-[1.40625rem]">
              {t("shortTitle", { ns: "root" })}
            </div>
          </Link>
        </div>
        <div className="flex items-center justify-center gap-[2.6875rem]">
          <Link
            className={`${
              props.location.pathname !== "/tools/party-finder"
                ? "text-loa-inactive "
                : ""
            }flex items-center justify-center gap-[0.625rem]`}
            to="/tools/party-finder"
          >
            <span className="material-symbols-rounded filled-icon text-[1.5rem]">
              grid_view
            </span>
            <div className="text-[1.125rem] font-[400] leading-[1.40625rem]">
              {t("partyFinderPageTitle", { ns: "root" })}
            </div>
          </Link>
          <Link
            className={`${
              props.location.pathname !== "/help" ? "text-loa-inactive " : ""
            }flex items-center justify-center gap-[0.625rem]`}
            to="/"
          >
            <span className="material-symbols-outlined filled-icon text-[1.5rem]">
              help
            </span>
            <div className="text-[1.125rem] font-[400] leading-[1.40625rem]">
              {t("helpPageTitle", { ns: "root" })}
            </div>
          </Link>
          <Link
            className={`${
              ![
                "/my-roster",
                "/my-roster/my-posts",
                "/my-roster/applied-posts",
              ].includes(props.location.pathname)
                ? "text-loa-inactive "
                : ""
            }flex items-center justify-center gap-[0.625rem]`}
            to="/my-roster"
          >
            <span className="material-symbols-outlined filled-icon text-[1.5rem]">
              group
            </span>
            <div className="text-[1.125rem] font-[400] leading-[1.40625rem]">
              {t("myRosterAndPartyTitle", { ns: "root" })}
            </div>
          </Link>
        </div>
        <div className="flex items-center justify-end">
          {props.alarms && (
            <Dropdown
              button={
                <div className="relative">
                  <div
                    className={`${
                      props.alarms.length > 0 ? "cursor-pointer" : ""
                    } material-symbols-outlined filled-icon mr-[1.25rem] mt-[0.25rem] text-[1.75rem]`}
                  >
                    notifications
                  </div>
                  {props.alarms.filter((a) => !a.isRead).length > 0 && (
                    <div className="absolute right-[15px] top-[-1px] w-[1rem] rounded-full bg-loa-red text-center text-[0.625rem] text-[1.125rem] font-[400] leading-[1rem]">
                      {props.alarms.filter((a) => !a.isRead).length}
                    </div>
                  )}
                </div>
              }
              disabled={props.alarms.length === 0}
              horizontalAlignment="right"
              horizontalPanelAnchor="right"
              origin="origin-top"
              panel={
                <div className="flex w-[7.5rem] flex-col items-stretch rounded-[0.9375rem] border-[0.125rem] border-loa-button bg-loa-panel">
                  {props.supportedLocales.map((locale, index) => {
                    return (
                      <Form
                        action="/change-language"
                        className="flex flex-col items-stretch"
                        key={index}
                        method="post"
                      >
                        <input name="locale" type="hidden" value={locale} />
                        <input
                          name="pathname"
                          type="hidden"
                          value={props.location.pathname}
                        />
                        {index !== 0 && (
                          <hr className="mx-[0.625rem] border-loa-button" />
                        )}
                        <button
                          className="overflow-hidden text-ellipsis py-[1.375rem] text-[1rem] font-[500] leading-[1.25rem]"
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
          )}
          <Dropdown
            button={
              <div className="mr-[0.625rem] flex h-[2.5rem] w-[7.5rem] cursor-pointer items-center justify-center rounded-[0.9375rem] bg-loa-button">
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
              <div className="mt-[0.6875rem] flex w-[7.5rem] flex-col items-stretch rounded-[0.9375rem] border-[0.125rem] border-loa-button bg-loa-panel">
                {props.supportedLocales.map((locale, index) => {
                  return (
                    <Form
                      action="/change-language"
                      className="flex flex-col items-stretch"
                      key={index}
                      method="post"
                    >
                      <input name="locale" type="hidden" value={locale} />
                      <input
                        name="pathname"
                        type="hidden"
                        value={props.location.pathname}
                      />
                      {index !== 0 && (
                        <hr className="mx-[0.625rem] border-loa-button" />
                      )}
                      <button
                        className="overflow-hidden text-ellipsis py-[1.375rem] text-[1rem] font-[500] leading-[1.25rem]"
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
                props.user.discordAvatarHash ? (
                  <img
                    alt="discord avatar"
                    className="h-[2.5rem] w-[2.5rem] cursor-pointer rounded-full"
                    src={generateDiscordAvatarSrc(
                      props.user.discordId,
                      props.user.discordAvatarHash ?? ""
                    )}
                  />
                ) : (
                  <div className="h-[2.5rem] w-[2.5rem] cursor-pointer rounded-full bg-loa-grey"></div>
                )
              }
              horizontalAlignment="right"
              horizontalPanelAnchor="right"
              origin="origin-top"
              panel={
                <div className="mt-[0.6875rem] flex w-[15.875rem] flex-col items-stretch rounded-[0.9375rem] border-[0.125rem] border-loa-button bg-loa-panel">
                  <Link
                    className="flex items-center justify-start gap-[0.625rem] py-[1.375rem] px-[1.25rem]"
                    to="/my-roster"
                  >
                    <span className="material-symbols-outlined filled-icon text-[1.5rem]">
                      person
                    </span>
                    <div className="text-[1rem] font-[500] leading-[1.25rem]">
                      {t("myRoster", { ns: "components\\header" })}
                    </div>
                  </Link>
                  <hr className="mx-[1.25rem] border-loa-button" />
                  <Link
                    className="flex items-center justify-start gap-[0.625rem] py-[1.375rem] px-[1.25rem]"
                    to="/my-roster/my-posts"
                  >
                    <span className="material-symbols-outlined filled-icon text-[1.5rem]">
                      group
                    </span>
                    <div className="text-[1rem] font-[500] leading-[1.25rem]">
                      {t("recruiting", { ns: "routes\\my-roster\\my-parties" })}
                    </div>
                  </Link>
                  <hr className="mx-[1.25rem] border-loa-button" />
                  <Link
                    className="flex items-center justify-start gap-[0.625rem] py-[1.375rem] px-[1.25rem]"
                    to="/my-roster/applied-posts"
                  >
                    <span className="material-symbols-outlined filled-icon text-[1.5rem]">
                      inventory
                    </span>
                    <div className="text-[1rem] font-[500] leading-[1.25rem]">
                      {t("applying", { ns: "routes\\my-roster\\my-parties" })}
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
                redirectTo: props.location.pathname,
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
