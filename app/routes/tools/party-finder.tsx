import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import type { RootContext } from "~/root";
import { Job } from "@prisma/client";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useOutletContext } from "@remix-run/react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import Dropdown from "~/components/dropdown";
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
  locale: string;
  title: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const t = await i18n.getFixedT(request, "root");

  return json<LoaderData>({
    locale: await i18n.getLocale(request),
    title: `${t("partyFinderPageTitle")} | ${t("shortTitle")}`,
  });
};

export default function ToolsPartyFinderPage() {
  const { setPathname } = useOutletContext<RootContext>();
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
  const user = useOptionalUser();

  const putFromAndToOnRight = ["ko"];

  React.useEffect(() => {
    setPathname("/tools/party-finder");
  });

  return (
    <div className="mx-auto mt-[2.5rem] flex w-[76.25rem] flex-col">
      <GoToTopButton />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[0.5625rem]">
          <div className="text-[1.625rem] font-[400] leading-[1.5rem]">
            {t("title", { ns: "routes\\tools\\party-finder" })}
          </div>
          <span className="material-symbols-outlined text-[1.5rem]">help</span>
        </div>
        <Link
          className="rounded-[0.9375rem] bg-loa-button py-[0.9375rem] px-[0.875rem] text-[1rem] font-[500]"
          to="/"
        >
          + {t("postParty", { ns: "routes\\tools\\party-finder" })}
        </Link>
      </div>
      <div className="mt-[1.25rem] flex gap-[1.25rem]">
        <div className="flex w-[18.125rem] flex-col gap-[1.25rem]">
          <hr className="border-loa-button" />
          <div className="flex flex-col gap-[1.25rem]">
            <div className="text-[1.25rem] font-[400]">
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
          <hr className="border-loa-button" />
          <div className="flex flex-col gap-[1.25rem]">
            <div className="text-[1.25rem] font-[400]">
              {t("filterByContents", { ns: "routes\\tools\\party-finder" })}
            </div>
            <div className="flex flex-col gap-[0.625rem]">
              <Dropdown
                button={
                  <div className="flex cursor-pointer items-center justify-between rounded-[0.9375rem] bg-loa-inactive py-[0.4375rem] px-[1.25rem]">
                    <div className="text-[0.875rem] font-[500]">
                      {t("contentType", { ns: "routes\\tools\\party-finder" })}
                    </div>
                    <span className="material-symbols-outlined text-[1.5rem]">
                      expand_more
                    </span>
                  </div>
                }
                horizontalAlignment="center"
                horizontalPanelAnchor="center"
                origin="origin-top"
                panel={<div>panel</div>}
                verticalAlignment="bottom"
                verticalPanelAnchor="top"
              />
              <Dropdown
                button={
                  <div className="flex cursor-pointer items-center justify-between rounded-[0.9375rem] bg-loa-inactive py-[0.4375rem] px-[1.25rem]">
                    <div className="text-[0.875rem] font-[500]">
                      {t("contentGroup", { ns: "routes\\tools\\party-finder" })}
                    </div>
                    <span className="material-symbols-outlined text-[1.5rem]">
                      expand_more
                    </span>
                  </div>
                }
                horizontalAlignment="center"
                horizontalPanelAnchor="center"
                origin="origin-top"
                panel={<div>panel</div>}
                verticalAlignment="bottom"
                verticalPanelAnchor="top"
              />
              <Dropdown
                button={
                  <div className="flex cursor-pointer items-center justify-between rounded-[0.9375rem] bg-loa-inactive py-[0.4375rem] px-[1.25rem]">
                    <div className="text-[0.875rem] font-[500]">
                      {t("content", { ns: "routes\\tools\\party-finder" })}
                    </div>
                    <span className="material-symbols-outlined text-[1.5rem]">
                      expand_more
                    </span>
                  </div>
                }
                horizontalAlignment="center"
                horizontalPanelAnchor="center"
                origin="origin-top"
                panel={<div>panel</div>}
                verticalAlignment="bottom"
                verticalPanelAnchor="top"
              />
            </div>
          </div>
          <hr className="border-loa-button" />
          <div className="flex flex-col gap-[1.25rem]">
            <div className="flex flex-col gap-[1.25rem]">
              <div className="text-[1.25rem] font-[400]">
                {t("filterByObjectives", { ns: "routes\\tools\\party-finder" })}
              </div>
              <div className="grid grid-cols-2">
                <div className="flex cursor-pointer items-center gap-[0.8125rem]">
                  <span className="m-[0.2378rem] h-[1.4rem] w-[1.4rem] rounded-[0.45rem] bg-loa-white"></span>
                  <div className="overflow-hidden text-ellipsis text-[0.875rem] font-[500]">
                    {t("objectivePractice", {
                      ns: "routes\\tools\\party-finder",
                    })}
                  </div>
                </div>
                <div className="flex cursor-pointer items-center gap-[0.8125rem]">
                  <span className="m-[0.2378rem] h-[1.4rem] w-[1.4rem] rounded-[0.45rem] bg-loa-white"></span>
                  <div className="overflow-hidden text-ellipsis text-[0.875rem] font-[500]">
                    {t("objectiveFarm", { ns: "routes\\tools\\party-finder" })}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[1.25rem]">
              <div className="text-[1.25rem] font-[400]">
                {t("filterByDayOfTheWeek", {
                  ns: "routes\\tools\\party-finder",
                })}
              </div>
              <div className="grid grid-cols-7">
                <div className="flex flex-col items-center">
                  <div className="text-[0.875rem] font-[500]">
                    {t("mon", { ns: "routes\\tools\\party-finder" })}
                  </div>
                  <span className="m-[0.2378rem] h-[1.4rem] w-[1.4rem] rounded-[0.45rem] bg-loa-white"></span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-[0.875rem] font-[500]">
                    {t("tue", { ns: "routes\\tools\\party-finder" })}
                  </div>
                  <span className="m-[0.2378rem] h-[1.4rem] w-[1.4rem] rounded-[0.45rem] bg-loa-white"></span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-[0.875rem] font-[500]">
                    {t("wed", { ns: "routes\\tools\\party-finder" })}
                  </div>
                  <span className="m-[0.2378rem] h-[1.4rem] w-[1.4rem] rounded-[0.45rem] bg-loa-white"></span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-[0.875rem] font-[500]">
                    {t("thu", { ns: "routes\\tools\\party-finder" })}
                  </div>
                  <span className="m-[0.2378rem] h-[1.4rem] w-[1.4rem] rounded-[0.45rem] bg-loa-white"></span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-[0.875rem] font-[500]">
                    {t("fri", { ns: "routes\\tools\\party-finder" })}
                  </div>
                  <span className="m-[0.2378rem] h-[1.4rem] w-[1.4rem] rounded-[0.45rem] bg-loa-white"></span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-[0.875rem] font-[500]">
                    {t("sat", { ns: "routes\\tools\\party-finder" })}
                  </div>
                  <span className="m-[0.2378rem] h-[1.4rem] w-[1.4rem] rounded-[0.45rem] bg-loa-white"></span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-[0.875rem] font-[500]">
                    {t("sun", { ns: "routes\\tools\\party-finder" })}
                  </div>
                  <span className="material-symbols-outlined filled-icon text-[1.875rem]">
                    priority
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[1.25rem]">
              <div className="text-[1.25rem] font-[400]">
                {t("filterByStartTime", { ns: "routes\\tools\\party-finder" })}
              </div>
              <div className="flex flex-col gap-[0.625rem] self-start">
                <div className="flex items-center justify-between gap-[0.625rem]">
                  {!putFromAndToOnRight.includes(data.locale) && (
                    <div className="text-[0.875rem] font-[500]">
                      {t("from", { ns: "routes\\tools\\party-finder" })}
                    </div>
                  )}
                  <Dropdown
                    button={
                      <div className="flex w-[10.125rem] cursor-pointer items-center justify-between rounded-[0.9375rem] bg-loa-inactive px-[1.0625rem] py-[0.4375rem]">
                        <div className="text-[0.875rem] font-[500]">
                          AM 00:00
                        </div>
                        <span className="material-symbols-outlined text-[1.5rem]">
                          expand_more
                        </span>
                      </div>
                    }
                    horizontalAlignment="center"
                    horizontalPanelAnchor="center"
                    origin="origin-top"
                    panel={<div>panel</div>}
                    verticalAlignment="bottom"
                    verticalPanelAnchor="top"
                  />
                  {putFromAndToOnRight.includes(data.locale) && (
                    <div className="text-[0.875rem] font-[500]">
                      {t("from", { ns: "routes\\tools\\party-finder" })}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between gap-[0.625rem]">
                  {!putFromAndToOnRight.includes(data.locale) && (
                    <div className="text-[0.875rem] font-[500]">
                      {t("to", { ns: "routes\\tools\\party-finder" })}
                    </div>
                  )}
                  <Dropdown
                    button={
                      <div className="flex w-[10.125rem] cursor-pointer items-center justify-between rounded-[0.9375rem] bg-loa-inactive px-[1.0625rem] py-[0.4375rem]">
                        <div className="text-[0.875rem] font-[500]">
                          AM 00:00
                        </div>
                        <span className="material-symbols-outlined text-[1.5rem]">
                          expand_more
                        </span>
                      </div>
                    }
                    horizontalAlignment="center"
                    horizontalPanelAnchor="center"
                    origin="origin-top"
                    panel={<div>panel</div>}
                    verticalAlignment="bottom"
                    verticalPanelAnchor="top"
                  />
                  {putFromAndToOnRight.includes(data.locale) && (
                    <div className="text-[0.875rem] font-[500]">
                      {t("to", { ns: "routes\\tools\\party-finder" })}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[1.25rem]">
              <div className="text-[1.25rem] font-[400]">
                {t("filterByDate", { ns: "routes\\tools\\party-finder" })}
              </div>
              <div className="flex items-center gap-[0.625rem]">
                <div className="flex items-center gap-[0.625rem]">
                  <Dropdown
                    button={
                      <div className="flex cursor-pointer items-center justify-between gap-[0.25rem] rounded-[0.9375rem] bg-loa-inactive px-[1rem] py-[0.4375rem]">
                        <div className="text-[0.875rem] font-[500]">2000</div>
                        <span className="material-symbols-outlined text-[1.5rem]">
                          expand_more
                        </span>
                      </div>
                    }
                    horizontalAlignment="center"
                    horizontalPanelAnchor="center"
                    origin="origin-top"
                    panel={<div>panel</div>}
                    verticalAlignment="bottom"
                    verticalPanelAnchor="top"
                  />
                  <div className="text-[0.875rem] font-[500]">
                    {t("year", { ns: "routes\\tools\\party-finder" })}
                  </div>
                </div>
                <div className="flex items-center gap-[0.625rem]">
                  <Dropdown
                    button={
                      <div className="flex cursor-pointer items-center justify-between gap-[0.25rem] rounded-[0.9375rem] bg-loa-inactive px-[1rem] py-[0.4375rem]">
                        <div className="text-[0.875rem] font-[500]">12</div>
                        <span className="material-symbols-outlined text-[1.5rem]">
                          expand_more
                        </span>
                      </div>
                    }
                    horizontalAlignment="center"
                    horizontalPanelAnchor="center"
                    origin="origin-top"
                    panel={<div>panel</div>}
                    verticalAlignment="bottom"
                    verticalPanelAnchor="top"
                  />
                  <div className="text-[0.875rem] font-[500]">
                    {t("month", { ns: "routes\\tools\\party-finder" })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr className="border-loa-button" />
        </div>
        <div className="flex-grow">?????? ?????????</div>
      </div>
    </div>
  );
}
