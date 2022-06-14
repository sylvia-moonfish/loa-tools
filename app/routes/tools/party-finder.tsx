import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import type { RootContext } from "~/root";
import { Job } from "@prisma/client";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useOutletContext } from "@remix-run/react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import Checkbox from "~/components/checkbox";
import Dropdown from "~/components/dropdown";
import GoToTopButton from "~/components/go-to-top-button";
import { getChaosDungeon } from "~/models/chaos-dungeon.server";
import { getGuardianRaid } from "~/models/guardian-raid.server";
import { i18n } from "~/i18n.server";
import { useOptionalUser } from "~/utils";

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  return { title: data.title };
};

export const handle = {
  i18n: ["dictionary\\job", "routes\\tools\\party-finder"],
};

type ContentFilterBaseType = {
  id: string | undefined;
  name: { [locale: string]: string | undefined };
};

type LoaderData = {
  chaosDungeon: Awaited<ReturnType<typeof getChaosDungeon>>;
  guardianRaid: Awaited<ReturnType<typeof getGuardianRaid>>;
  locale: string;
  title: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const t = await i18n.getFixedT(request, "root");

  return json<LoaderData>({
    chaosDungeon: await getChaosDungeon(),
    guardianRaid: await getGuardianRaid(),
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

  const [jobFilterList, setJobFilterList] = React.useState<
    { text: string; value: string }[]
  >([]);

  const [contentTypes, setContentTypes] = React.useState<
    (ContentFilterBaseType & {
      tiers:
        | (ContentFilterBaseType & { stages: ContentFilterBaseType[] })[]
        | undefined;
    })[]
  >(
    [data.chaosDungeon, data.guardianRaid].map((d) => {
      return {
        id: d?.id,
        name: {
          en: d?.nameEn,
          ko: d?.nameKo,
        },
        tiers: d?.tabs.map((t) => {
          return {
            id: t.id,
            name: { en: t.nameEn, ko: t.nameKo },
            stages: t.stages.map((s) => {
              return { id: s.id, name: { en: s.nameEn, ko: s.nameKo } };
            }),
          };
        }),
      };
    })
  );
  const [contentTiers, setContentTiers] = React.useState<
    (ContentFilterBaseType & { stages: ContentFilterBaseType[] })[]
  >([]);
  const [contentStages, setContentStages] = React.useState<
    ContentFilterBaseType[]
  >([]);
  const [contentFilterList, setContentFilterList] = React.useState<
    { text: string; value: string }[]
  >([]);
  const [filterPracticeParty, setFilterPracticeParty] = React.useState(false);
  const [filterFarmingParty, setFilterFarmingParty] = React.useState(false);

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
                    className={`${
                      jobFilterList.find((f) => f.value === job)
                        ? "bg-loa-button-border "
                        : "bg-loa-panel "
                    }cursor-pointer rounded-[0.9375rem] py-[0.3125rem] px-[0.75rem] text-[0.75rem] font-[500]`}
                    key={index}
                    onClick={() => {
                      const index = jobFilterList.findIndex(
                        (f) => f.value === job
                      );

                      const tempArray = [...jobFilterList];

                      if (index !== -1) {
                        tempArray.splice(index, 1);
                      } else {
                        tempArray.push({
                          text: t(job, { ns: "dictionary\\job" }),
                          value: job,
                        });
                      }

                      setJobFilterList(tempArray);
                    }}
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
                  <div
                    className={`${
                      contentTypes.length === 0
                        ? "cursor-not-allowed "
                        : "cursor-pointer "
                    }flex items-center justify-between rounded-[0.9375rem] bg-loa-inactive py-[0.4375rem] px-[1.25rem]`}
                  >
                    <div className="text-[0.875rem] font-[500]">
                      {contentFilterList.length > 0
                        ? contentFilterList[0].text
                        : t("contentType", {
                            ns: "routes\\tools\\party-finder",
                          })}
                    </div>
                    <span className="material-symbols-outlined text-[1.5rem]">
                      expand_more
                    </span>
                  </div>
                }
                disabled={contentTypes.length === 0}
                fullWidth={true}
                horizontalAlignment="center"
                horizontalPanelAnchor="center"
                origin="origin-top"
                panel={
                  <div className="mt-[0.6875rem] flex w-full flex-col items-stretch rounded-[0.9375rem] border-[0.125rem] border-loa-button bg-loa-panel">
                    {contentTypes.map((contentType, index) => {
                      return (
                        <div
                          className="flex flex-col items-stretch"
                          key={index}
                        >
                          {index !== 0 && (
                            <hr className="mx-[0.625rem] border-loa-button" />
                          )}
                          <div
                            className="cursor-pointer overflow-hidden text-ellipsis py-[1.375rem] text-center text-[1rem] font-[500] leading-[1.25rem]"
                            onClick={() => {
                              if (
                                contentFilterList.length > 0 &&
                                contentFilterList[0].value === contentType.id
                              )
                                return;

                              const text = contentType.name[data.locale];
                              if (!text) return;

                              const value = contentType.id;
                              if (!value) return;

                              if (!contentType.tiers) return;

                              const _contentFilterList = [{ text, value }];
                              setContentFilterList(_contentFilterList);
                              setContentTiers(contentType.tiers);
                              setContentStages([]);
                            }}
                          >
                            {contentType.name[data.locale]}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                }
                verticalAlignment="bottom"
                verticalPanelAnchor="top"
              />
              <Dropdown
                button={
                  <div
                    className={`${
                      contentTiers.length === 0
                        ? "cursor-not-allowed "
                        : "cursor-pointer "
                    }flex items-center justify-between rounded-[0.9375rem] bg-loa-inactive py-[0.4375rem] px-[1.25rem]`}
                  >
                    <div className="text-[0.875rem] font-[500]">
                      {contentFilterList.length > 1
                        ? contentFilterList[1].text
                        : t("contentTier", {
                            ns: "routes\\tools\\party-finder",
                          })}
                    </div>
                    <span className="material-symbols-outlined text-[1.5rem]">
                      expand_more
                    </span>
                  </div>
                }
                disabled={contentTiers.length === 0}
                fullWidth={true}
                horizontalAlignment="center"
                horizontalPanelAnchor="center"
                origin="origin-top"
                panel={
                  <div className="mt-[0.6875rem] flex w-full flex-col items-stretch rounded-[0.9375rem] border-[0.125rem] border-loa-button bg-loa-panel">
                    {contentTiers.map((contentTier, index) => {
                      return (
                        <div
                          className="flex flex-col items-stretch"
                          key={index}
                        >
                          {index !== 0 && (
                            <hr className="mx-[0.625rem] border-loa-button" />
                          )}
                          <div
                            className="cursor-pointer overflow-hidden text-ellipsis py-[1.375rem] text-center text-[1rem] font-[500] leading-[1.25rem]"
                            onClick={() => {
                              if (contentFilterList.length < 1) return;
                              if (
                                contentFilterList.length > 1 &&
                                contentFilterList[1].value === contentTier.id
                              )
                                return;

                              const text = contentTier.name[data.locale];
                              if (!text) return;

                              const value = contentTier.id;
                              if (!value) return;

                              if (!contentTier.stages) return;

                              const _contentFilterList = [
                                contentFilterList[0],
                                { text, value },
                              ];
                              setContentFilterList(_contentFilterList);
                              setContentStages(contentTier.stages);
                            }}
                          >
                            {contentTier.name[data.locale]}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                }
                verticalAlignment="bottom"
                verticalPanelAnchor="top"
              />
              <Dropdown
                button={
                  <div
                    className={`${
                      contentStages.length === 0
                        ? "cursor-not-allowed "
                        : "cursor-pointer "
                    }flex items-center justify-between rounded-[0.9375rem] bg-loa-inactive py-[0.4375rem] px-[1.25rem]`}
                  >
                    <div className="text-[0.875rem] font-[500]">
                      {contentFilterList.length > 2
                        ? contentFilterList[2].text
                        : t("contentStage", {
                            ns: "routes\\tools\\party-finder",
                          })}
                    </div>
                    <span className="material-symbols-outlined text-[1.5rem]">
                      expand_more
                    </span>
                  </div>
                }
                disabled={contentStages.length === 0}
                fullWidth={true}
                horizontalAlignment="center"
                horizontalPanelAnchor="center"
                origin="origin-top"
                panel={
                  <div className="mt-[0.6875rem] flex w-full flex-col items-stretch rounded-[0.9375rem] border-[0.125rem] border-loa-button bg-loa-panel">
                    {contentStages.map((contentStage, index) => {
                      return (
                        <div
                          className="flex flex-col items-stretch"
                          key={index}
                        >
                          {index !== 0 && (
                            <hr className="mx-[0.625rem] border-loa-button" />
                          )}
                          <div
                            className="cursor-pointer overflow-hidden text-ellipsis py-[1.375rem] text-center text-[1rem] font-[500] leading-[1.25rem]"
                            onClick={() => {
                              if (contentFilterList.length < 2) return;
                              if (
                                contentFilterList.length > 2 &&
                                contentFilterList[2].value === contentStage.id
                              )
                                return;

                              const text = contentStage.name[data.locale];
                              if (!text) return;

                              const value = contentStage.id;
                              if (!value) return;

                              const _contentFilterList = [
                                contentFilterList[0],
                                contentFilterList[1],
                                { text, value },
                              ];
                              setContentFilterList(_contentFilterList);
                            }}
                          >
                            {contentStage.name[data.locale]}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                }
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
                <Checkbox
                  boxSizeRem={1.875}
                  checked={filterPracticeParty}
                  divClassName="gap-[0.8125rem]"
                  onClick={() => {
                    setFilterPracticeParty(!filterPracticeParty);
                  }}
                  textClassName="text-[0.875rem] font-[500]"
                >
                  {t("objectivePractice", {
                    ns: "routes\\tools\\party-finder",
                  })}
                </Checkbox>
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
        <div className="flex flex-grow flex-col gap-[1.25rem]">
          {(jobFilterList.length > 0 || contentFilterList.length > 0) && (
            <div className="flex flex-wrap gap-[0.8125rem]">
              {jobFilterList.map((f, index) => {
                return (
                  <div
                    className="flex cursor-pointer items-center gap-[0.1875rem] rounded-[0.9375rem] bg-loa-button-border px-[0.8125rem] py-[0.25rem]"
                    key={index}
                    onClick={() => {
                      const tempArray = [...jobFilterList];
                      tempArray.splice(index, 1);
                      setJobFilterList(tempArray);
                    }}
                  >
                    <div className="text-[0.75rem] font-[500] leading-[1.25rem]">
                      {f.text}
                    </div>
                    <span
                      className="material-symbols-outlined text-[1.0625rem] text-loa-close-icon"
                      style={{ fontVariationSettings: '"wght" 500' }}
                    >
                      close
                    </span>
                  </div>
                );
              })}
              {contentFilterList.map((contentFilter, index) => {
                return (
                  <div
                    className="flex cursor-pointer items-center gap-[0.1875rem] rounded-[0.9375rem] bg-loa-button-border px-[0.8125rem] py-[0.25rem]"
                    key={index}
                    onClick={() => {
                      if (index === 0) {
                        setContentStages([]);
                        setContentTiers([]);
                        setContentFilterList([]);
                      } else if (index === 1) {
                        setContentStages([]);
                        setContentFilterList([contentFilterList[0]]);
                      } else if (index === 2) {
                        setContentFilterList([
                          contentFilterList[0],
                          contentFilterList[1],
                        ]);
                      }
                    }}
                  >
                    <div className="text-[0.75rem] font-[500] leading-[1.25rem]">
                      {contentFilter.text}
                    </div>
                    <span
                      className="material-symbols-outlined text-[1.0625rem] text-loa-close-icon"
                      style={{ fontVariationSettings: '"wght" 500' }}
                    >
                      close
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex">파티 리스트가 들어갈 곳임</div>
        </div>
      </div>
    </div>
  );
}
