import { Link, Outlet, useLocation } from "@remix-run/react";
import { useTranslation } from "react-i18next";

export default function MyRosterPage() {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <div className="mx-auto my-[2.1875rem] flex w-[46.875rem] flex-col">
      <div className="flex gap-[1.25rem]">
        <Link
          className={`${
            location.pathname === "/my-roster"
              ? "border-b-[0.15625rem] border-loa-button-border "
              : "text-loa-inactive "
          }p-[1.25rem] text-[1.625rem] font-[400] leading-[1.25rem]`}
          to="/my-roster"
        >
          {t("myRoster", { ns: "routes\\my-roster" })}
        </Link>
        <Link
          className={`${
            location.pathname === "/my-roster/my-posts"
              ? "border-b-[0.15625rem] border-loa-button-border "
              : "text-loa-inactive "
          }p-[1.25rem] text-[1.625rem] font-[400] leading-[1.25rem]`}
          to="/my-roster/my-posts"
        >
          {t("recruiting", { ns: "routes\\my-roster\\my-parties" })}
        </Link>
        <Link
          className={`${
            location.pathname === "/my-roster/applied-posts"
              ? "border-b-[0.15625rem] border-loa-button-border "
              : "text-loa-inactive "
          }p-[1.25rem] text-[1.625rem] font-[400] leading-[1.25rem]`}
          to="/my-roster/applied-posts"
        >
          {t("applying", { ns: "routes\\my-roster\\my-parties" })}
        </Link>
      </div>
      <div className="mt-[1.171875rem]">
        <Outlet />
      </div>
    </div>
  );
}
