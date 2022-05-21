import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import type { RootContext } from "~/root";
import { Job } from "@prisma/client";
import { json } from "@remix-run/node";
import { Link, useOutletContext } from "@remix-run/react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import GoToTopButton from "~/components/goToTopButton";
import { i18n } from "~/i18n.server";
import { useOptionalUser } from "~/utils";

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  return { title: data.title };
};

export const handle = {
  i18n: ["dictionary\\job", "routes\\tools\\party-finder"],
};

type LoaderData = {
  title: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const t = await i18n.getFixedT(request, "root");

  return json<LoaderData>({
    title: `${t("partyFinderPageTitle")} | ${t("shortTitle")}`,
  });
};

export default function ToolsPartyFinderPage() {
  const { setPathname } = useOutletContext<RootContext>();
  const { t } = useTranslation();
  const user = useOptionalUser();

  React.useEffect(() => {
    setPathname("/tools/party-finder");
  });

  return (
    <div className="mx-auto mt-[2.5rem] flex w-[76.25rem] flex-col">
      <GoToTopButton />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[0.5625rem]">
          <div className="text-[1.625rem]">
            {t("title", { ns: "routes\\tools\\party-finder" })}
          </div>
          <span className="material-symbols-outlined text-[1.25rem]">help</span>
        </div>
        <Link
          className="rounded-[0.9375rem] bg-loa-button py-[0.9375rem] px-[0.875rem] font-[500]"
          to="/"
        >
          + {t("postParty", { ns: "routes\\tools\\party-finder" })}
        </Link>
      </div>
      <div className="mt-[1.25rem] flex gap-[1.25rem]">
        <div className="flex w-[18.125rem] flex-col">
          <div className="flex flex-col gap-[1.25rem] border-t-[0.0625rem] border-loa-button py-[1.25rem]">
            <div className="text-[1.25rem]">
              {t("filterByJobs", { ns: "routes\\tools\\party-finder" })}
            </div>
            <div className="flex flex-wrap gap-[0.625rem]">
              {Object.values(Job).map((job, index) => {
                return (
                  <div
                    className="rounded-[0.9375rem] bg-loa-panel py-[0.3125rem] px-[0.75rem] text-[0.75rem] font-[500]"
                    key={index}
                  >
                    {t(job, { ns: "dictionary\\job" })}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-[1.25rem] border-t-[0.0625rem] border-loa-button py-[1.25rem]">
            <div className="text-[1.25rem]">
              {t("filterByContents", { ns: "routes\\tools\\party-finder" })}
            </div>
          </div>
        </div>
        <div className="flex-grow">파티 리스트</div>
      </div>
    </div>
  );
}
