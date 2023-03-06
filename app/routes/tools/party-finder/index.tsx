import type { LoaderFunction } from "@remix-run/node";
import type { ItemType } from "~/components/dropdown";
import type { FilteredPartyFindPosts } from "~/routes/api/party-find-post/filter";
import type { LocaleType } from "~/i18n";
import { Job, JobType } from "@prisma/client";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import AddPartyButton from "~/components/tools/party-finder/add-party-button";
import ContentFilter from "~/components/tools/party-finder/content-filter";
import Button from "~/components/button";
import Checkbox from "~/components/checkbox";
import Dropdown from "~/components/dropdown";
import GoToTopButton from "~/components/go-to-top-button";
import { prisma } from "~/db.server";
import i18next from "~/i18next.server";
import { getUserFromRequest } from "~/session.server";
import {
  convertStringToInt,
  generateJobIconPath,
  generateProperLocaleDateString,
  getColorCodeFromDifficulty,
  printTime,
  putFromAndToOnRight,
} from "~/utils";

type LoaderData = {
  contents: Awaited<ReturnType<typeof getContents>>;
  locale: LocaleType;
  regions: Awaited<ReturnType<typeof getAllRegions>>;
  user: Awaited<ReturnType<typeof getUser>>;
};

const getContents = async () => {
  return await prisma.content.findMany({
    select: {
      id: true,
      nameEn: true,
      nameKo: true,
      contentTabs: {
        select: {
          id: true,
          nameEn: true,
          nameKo: true,
          difficultyNameEn: true,
          difficultyNameKo: true,
          contentStages: { select: { id: true, nameEn: true, nameKo: true } },
        },
      },
    },
  });
};

const getAllRegions = async () => {
  return await prisma.region.findMany({ select: { id: true, name: true } });
};

const getUser = async (id: string) => {
  return await prisma.user.findFirst({
    where: { id },
    select: {
      id: true,
      rosters: {
        select: {
          id: true,
          server: {
            select: {
              id: true,
              name: true,
              region: { select: { id: true, name: true, abbr: true } },
            },
          },
          characters: {
            select: { id: true, name: true, job: true, itemLevel: true },
          },
        },
      },
    },
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserFromRequest(request);

  return json<LoaderData>({
    contents: await getContents(),
    locale: (await i18next.getLocale(request)) as LocaleType,
    regions: await getAllRegions(),
    user: user ? await getUser(user.id) : null,
  });
};

// This is used to cancel previous on-going AJAX calls in case of multiple clicks.
let abortController = new AbortController();

export default function ToolsPartyFinderIndexPage() {
  const { t } = useTranslation();
  const data = useLoaderData() as unknown as LoaderData;

  // Flattening out the characters this user has for all rosters.
  const _characters =
    data.user?.rosters
      .sort((a, b) => a.server.name.localeCompare(b.server.name))
      .sort((a, b) => a.server.region.name.localeCompare(b.server.region.name))
      .map((r) =>
        r.characters
          .sort((a, b) => b.itemLevel - a.itemLevel)
          .map((c) => ({ ...c, roster: r }))
      )
      .flat() ?? [];

  // Map the character array into dropdown item types.
  const characters = [
    { id: "-", text: { en: "-------", ko: "-------" } },
  ].concat(
    _characters.map((c) => {
      return {
        id: c.id,
        text: {
          en: `${t(c.job, { ns: "dictionary\\job", lng: "en" })} [${
            c.name
          }] lv.${c.itemLevel.toFixed(0)} ${c.roster.server.region.abbr}`,
          ko: `${t(c.job, { ns: "dictionary\\job", lng: "ko" })} [${
            c.name
          }] lv.${c.itemLevel.toFixed(0)} ${c.roster.server.region.abbr}`,
        },
      };
    })
  );

  // Filter for character.
  const [characterFilter, _setCharacterFilter] = React.useState<
    ItemType | undefined
  >(undefined);

  // Do some required computation every time we set the character filter.
  const setCharacterFilter = (item: ItemType | undefined) => {
    // If the selection made is already selected, no change.
    if (item && characterFilter && item.id === characterFilter.id) return;

    if (item) {
      // Check if the job filter currently has the previously selected character's job,
      // and remove it since the selection is changing.
      const _jobFilterList = [...jobFilterList];

      if (characterFilter && _jobFilterList.length > 0) {
        const jobId = _jobFilterList.findIndex(
          (j) => j === _characters.find((c) => c.id === characterFilter.id)?.job
        );
        if (jobId !== -1) _jobFilterList.splice(jobId, 1);
      }

      // If the selection made is '-', that means no character filter.
      if (item.id === "-") {
        // First set the job filter back because we're not adding a new job filter.
        setJobFilterList(_jobFilterList);

        // See if previous character filter has region filter set too.
        if (
          characterFilter &&
          regionFilter &&
          regionFilter.id ===
            _characters.find((c) => c.id === characterFilter.id)?.roster.server
              .region.id
        ) {
          // If yes, unset it.
          setRegionFilter(undefined);
        }

        // Also unset the character filter.
        setCharacterFilter(undefined);

        return;
      }

      // If the selection is a valid character, find it from the character array.
      const character = _characters.find((c) => c.id === item.id);

      if (character) {
        // Add the new character's job to job filter.
        if (!_jobFilterList.find((j) => j === character.job))
          _jobFilterList.push(character.job);
        setJobFilterList(_jobFilterList);

        // Set the region filter accordingly.
        setRegionFilter({
          id: character.roster.server.region.id,
          text: {
            en: character.roster.server.region.name,
            ko: character.roster.server.region.name,
          },
        });
      }
    }

    _setCharacterFilter(item);
  };

  const [jobFilterList, _setJobFilterList] = React.useState<string[]>([]);
  const setJobFilterList = (items: string[]) => {
    if (characterFilter) {
      const selectedCharJob = _characters.find(
        (c) => c.id === characterFilter.id
      )?.job;

      if (selectedCharJob && !items.includes(selectedCharJob))
        setCharacterFilter(undefined);
    }

    _setJobFilterList(items);
  };

  const contentTypeUnselector: ItemType & {
    tiers: (ItemType & { stages: ItemType[] })[];
  } = { id: "-", text: { en: "-------", ko: "-------" }, tiers: [] };

  const contentTierUnselector: ItemType & { stages: ItemType[] } = {
    id: "-",
    text: { en: "-------", ko: "-------" },
    stages: [],
  };

  const contentStageUnselector: ItemType = {
    id: "-",
    text: { en: "-------", ko: "-------" },
  };

  const contentTypes: (ItemType & {
    tiers: (ItemType & { stages: ItemType[] })[];
  })[] = [contentTypeUnselector].concat(
    data.contents.map((d) => {
      return {
        id: d.id,
        text: { en: d.nameEn, ko: d.nameKo },
        tiers: [contentTierUnselector].concat(
          d.contentTabs.map((t) => {
            return {
              id: t.id,
              text: {
                en: `${t.nameEn}${
                  t.difficultyNameEn ? ` [${t.difficultyNameEn}]` : ""
                }`,
                ko: `${t.nameKo}${
                  t.difficultyNameKo ? ` [${t.difficultyNameKo}]` : ""
                }`,
              },
              stages: [contentStageUnselector].concat(
                t.contentStages.map((s) => {
                  return { id: s.id, text: { en: s.nameEn, ko: s.nameKo } };
                })
              ),
            };
          }) ?? []
        ),
      };
    })
  );
  const [contentTypeFilter, setContentTypeFilter] = React.useState<
    ItemType | undefined
  >(undefined);
  const [contentTierFilter, setContentTierFilter] = React.useState<
    ItemType | undefined
  >(undefined);
  const [contentStageFilter, setContentStageFilter] = React.useState<
    ItemType | undefined
  >(undefined);

  const [regionFilter, _setRegionFilter] = React.useState<ItemType | undefined>(
    undefined
  );
  const setRegionFilter = (item: ItemType | undefined) => {
    if (item && regionFilter && item.id === regionFilter.id) return;

    if (
      characterFilter &&
      _characters.find((c) => c.id === characterFilter.id)?.roster.server.region
        .id !== item?.id
    )
      setCharacterFilter(undefined);

    if (item && item.id === "-") _setRegionFilter(undefined);
    else _setRegionFilter(item);
  };

  const [practicePartyFilter, setPracticePartyFilter] = React.useState(false);
  const [reclearPartyFilter, setReclearPartyFilter] = React.useState(false);

  const dayFilterList: {
    dayFilter: boolean;
    setDayFilter: React.Dispatch<React.SetStateAction<boolean>>;
  }[] = [];

  const [dayFilter0, setDayFilter0] = React.useState(false);
  dayFilterList.push({ dayFilter: dayFilter0, setDayFilter: setDayFilter0 });
  const [dayFilter1, setDayFilter1] = React.useState(false);
  dayFilterList.push({ dayFilter: dayFilter1, setDayFilter: setDayFilter1 });
  const [dayFilter2, setDayFilter2] = React.useState(false);
  dayFilterList.push({ dayFilter: dayFilter2, setDayFilter: setDayFilter2 });
  const [dayFilter3, setDayFilter3] = React.useState(false);
  dayFilterList.push({ dayFilter: dayFilter3, setDayFilter: setDayFilter3 });
  const [dayFilter4, setDayFilter4] = React.useState(false);
  dayFilterList.push({ dayFilter: dayFilter4, setDayFilter: setDayFilter4 });
  const [dayFilter5, setDayFilter5] = React.useState(false);
  dayFilterList.push({ dayFilter: dayFilter5, setDayFilter: setDayFilter5 });
  const [dayFilter6, setDayFilter6] = React.useState(false);
  dayFilterList.push({ dayFilter: dayFilter6, setDayFilter: setDayFilter6 });

  const _times = [];
  for (let i = 0; i < 24; i++) {
    _times.push(i);
  }
  const [times] = React.useState<ItemType[]>(
    [{ id: "-", text: { en: "-------", ko: "-------" } }].concat(
      _times.map((t) => ({
        id: t.toString(),
        text: { en: printTime(t, 0), ko: printTime(t, 0) },
      }))
    )
  );
  const [startTimeFilter, setStartTimeFilter] = React.useState<
    ItemType | undefined
  >(undefined);
  const [endTimeFilter, setEndTimeFilter] = React.useState<
    ItemType | undefined
  >(undefined);

  const _years = [];
  for (let i = 2017; i <= 2027; i++) {
    _years.push(i);
  }
  const [years] = React.useState<ItemType[]>(
    [{ id: "-", text: { en: "-------", ko: "-------" } }].concat(
      _years.map((y) => ({
        id: y.toString(),
        text: { en: y.toString(), ko: y.toString() },
      }))
    )
  );
  const [yearFilter, setYearFilter] = React.useState<ItemType | undefined>(
    undefined
  );

  const _months = [];
  for (let i = 1; i <= 12; i++) {
    _months.push(i);
  }
  const monthUnselector: ItemType = {
    id: "-",
    text: { en: "-------", ko: "-------" },
  };
  const [months] = React.useState<ItemType[]>(
    [monthUnselector].concat(
      _months.map((m) => ({
        id: m.toString(),
        i18n: {
          keyword: `month${m}Filter`,
          namespace: "routes\\tools\\party-finder",
        },
      }))
    )
  );
  const [monthFilter, setMonthFilter] = React.useState<ItemType | undefined>(
    undefined
  );

  const [partyFindPosts, setPartyFindPosts] =
    React.useState<FilteredPartyFindPosts>([]);

  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);

    abortController.abort();
    abortController = new AbortController();

    fetch("/api/party-find-post/filter", {
      method: "POST",
      signal: abortController.signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobFilterList,
        contentTypeFilter,
        contentTierFilter,
        contentStageFilter,
        regionFilter: regionFilter?.id,
        practicePartyFilter,
        reclearPartyFilter,
        dayFilterList: dayFilterList.map((l) => l.dayFilter),
        startTimeFilter: convertStringToInt(startTimeFilter?.id),
        endTimeFilter: convertStringToInt(endTimeFilter?.id),
        yearFilter: convertStringToInt(yearFilter?.id),
        monthFilter: convertStringToInt(monthFilter?.id),
        timezone: Intl?.DateTimeFormat()?.resolvedOptions()?.timeZone,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setPartyFindPosts(data);
        setLoading(false);
      })
      .catch(() => {});
  }, [
    jobFilterList,
    contentTypeFilter,
    contentTierFilter,
    contentStageFilter,
    regionFilter,
    practicePartyFilter,
    reclearPartyFilter,
    ...dayFilterList.map((l) => l.dayFilter),
    startTimeFilter,
    endTimeFilter,
    yearFilter,
    monthFilter,
  ]);

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
        {data.user && (
          <AddPartyButton
            characters={characters}
            contentTypes={contentTypes}
            locale={data.locale}
            userId={data.user.id}
          />
        )}
      </div>
      <div className="mt-[1.25rem] flex gap-[1.25rem]">
        <div className="flex w-[18.125rem] flex-col gap-[1.25rem]">
          {data.user && (
            <>
              <hr className="border-loa-button" />
              <div className="flex flex-col gap-[1.25rem]">
                <div className="text-[1.25rem] font-[400]">
                  {t("filterByCharacter", {
                    ns: "routes\\tools\\party-finder",
                  })}
                </div>
                <Dropdown
                  items={characters}
                  locale={data.locale}
                  onChange={setCharacterFilter}
                  selected={characterFilter}
                  style={{
                    panel: {
                      alignment: "center",
                      anchor: "center",
                      backgroundColorClass: "bg-loa-panel",
                      borderColorClass: "border-loa-button",
                      borderWidth: "0.0875rem",
                      cornerRadius: "0.9375rem",
                      item: {
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        lineHeight: "1.25rem",
                        px: "1.25rem",
                        py: "0.625rem",
                        separator: {
                          colorClass: "border-loa-button",
                          margin: "0.4375rem",
                        },
                      },
                      margin: 0.2917,
                      maxHeight: 17.5,
                    },
                    selectButton: {
                      backgroundColorClass: "bg-loa-inactive",
                      cornerRadius: "0.9375rem",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      gap: "",
                      inactiveTextColorClass: "text-loa-grey",
                      lineHeight: "1.25rem",
                      px: "1.25rem",
                      py: "0.625rem",
                    },
                  }}
                />
              </div>
            </>
          )}
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
                      jobFilterList.find((f) => f === job)
                        ? "bg-loa-button-border "
                        : "bg-loa-panel "
                    }cursor-pointer rounded-[0.9375rem] py-[0.3125rem] px-[0.75rem] text-[0.75rem] font-[500]`}
                    key={index}
                    onClick={() => {
                      const tempArray = [...jobFilterList];
                      const index = tempArray.findIndex((f) => f === job);

                      if (index !== -1) tempArray.splice(index, 1);
                      else tempArray.push(job);

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
              <ContentFilter
                contentStage={contentStageFilter}
                contentTier={contentTierFilter}
                contentType={contentTypeFilter}
                contentTypes={contentTypes}
                locale={data.locale}
                required={false}
                setContentStage={(item) => {
                  if (item && item.id === "-") setContentStageFilter(undefined);
                  else setContentStageFilter(item);
                }}
                setContentTier={(item) => {
                  if (item && item.id === "-") setContentTierFilter(undefined);
                  else setContentTierFilter(item);
                }}
                setContentType={(item) => {
                  setContentTypeFilter;
                  if (item && item.id === "-") setContentTypeFilter(undefined);
                  else setContentTypeFilter(item);
                }}
              />
            </div>
          </div>
          <hr className="border-loa-button" />
          <div className="flex flex-col gap-[1.25rem]">
            <div className="text-[1.25rem] font-[400]">
              {t("filterByRegion", { ns: "routes\\tools\\party-finder" })}
            </div>
            <Dropdown
              items={[
                { id: "-", text: { en: "-------", ko: "-------" } },
              ].concat(
                data.regions.map((r) => ({
                  id: r.id,
                  text: { en: r.name, ko: r.name },
                }))
              )}
              locale={data.locale}
              onChange={setRegionFilter}
              selected={regionFilter}
              style={{
                panel: {
                  alignment: "center",
                  anchor: "center",
                  backgroundColorClass: "bg-loa-panel",
                  borderColorClass: "border-loa-button",
                  borderWidth: "0.0875rem",
                  cornerRadius: "0.9375rem",
                  item: {
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    lineHeight: "1.25rem",
                    px: "1.25rem",
                    py: "0.625rem",
                    separator: {
                      colorClass: "border-loa-button",
                      margin: "0.4375rem",
                    },
                  },
                  margin: 0.2917,
                  maxHeight: 17.5,
                },
                selectButton: {
                  backgroundColorClass: "bg-loa-inactive",
                  cornerRadius: "0.9375rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  gap: "",
                  inactiveTextColorClass: "text-loa-grey",
                  lineHeight: "1.25rem",
                  px: "1.25rem",
                  py: "0.625rem",
                },
              }}
            />
          </div>
          <hr className="border-loa-button" />
          <div className="flex flex-col gap-[1.25rem]">
            <div className="flex flex-col gap-[1.25rem]">
              <div className="text-[1.25rem] font-[400]">
                {t("filterByType", { ns: "routes\\tools\\party-finder" })}
              </div>
              <div className="grid grid-cols-2">
                <Checkbox
                  isChecked={practicePartyFilter}
                  onClick={() => {
                    setPracticePartyFilter(!practicePartyFilter);
                  }}
                  style={{
                    gap: "0.8125rem",
                    box: {
                      backgroundColorClass: "bg-loa-white",
                      checkColorClass: "text-loa-body",
                      size: 1.875,
                    },
                    text: {
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      lineHeight: "1.25rem",
                    },
                  }}
                  text={t("practiceParty", {
                    ns: "routes\\tools\\party-finder",
                  })}
                />
                <Checkbox
                  isChecked={reclearPartyFilter}
                  onClick={() => {
                    setReclearPartyFilter(!reclearPartyFilter);
                  }}
                  style={{
                    gap: "0.8125rem",
                    box: {
                      backgroundColorClass: "bg-loa-white",
                      checkColorClass: "text-loa-body",
                      size: 1.875,
                    },
                    text: {
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      lineHeight: "1.25rem",
                    },
                  }}
                  text={t("reclearParty", {
                    ns: "routes\\tools\\party-finder",
                  })}
                />
              </div>
            </div>
            <div className="flex flex-col gap-[1.25rem]">
              <div className="text-[1.25rem] font-[400]">
                {t("filterByDayOfTheWeek", {
                  ns: "routes\\tools\\party-finder",
                })}
              </div>
              <div className="grid grid-cols-7">
                {dayFilterList.map((l, index) => {
                  return (
                    <div
                      className="flex flex-col items-center gap-[0.5rem]"
                      key={index}
                    >
                      <div className="text-[0.875rem] font-[500]">
                        {t(
                          `${
                            ["mon", "tue", "wed", "thu", "fri", "sat", "sun"][
                              index
                            ]
                          }Checkbox`,
                          { ns: "routes\\tools\\party-finder" }
                        )}
                      </div>
                      <Checkbox
                        isChecked={l.dayFilter}
                        onClick={() => {
                          l.setDayFilter(!l.dayFilter);
                        }}
                        style={{
                          gap: "",
                          box: {
                            backgroundColorClass: "bg-loa-white",
                            checkColorClass: "text-loa-body",
                            size: 1.875,
                          },
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col gap-[1.25rem]">
              <div className="text-[1.25rem] font-[400]">
                {t("filterByStartTime", { ns: "routes\\tools\\party-finder" })}
              </div>
              <div className="flex flex-col gap-[0.625rem]">
                <div className="flex items-center justify-between gap-[0.625rem]">
                  {!putFromAndToOnRight.includes(data.locale) && (
                    <div className="text-[0.875rem] font-[500]">
                      {t("from", { ns: "routes\\tools\\party-finder" })}
                    </div>
                  )}
                  <Dropdown
                    items={times}
                    locale={data.locale}
                    onChange={(item) => {
                      if (item && item.id === "-")
                        setStartTimeFilter(undefined);
                      else setStartTimeFilter(item);
                    }}
                    selected={startTimeFilter}
                    style={{
                      additionalClass: "w-full",
                      panel: {
                        alignment: "center",
                        anchor: "center",
                        backgroundColorClass: "bg-loa-panel",
                        borderColorClass: "border-loa-button",
                        borderWidth: "0.0875rem",
                        cornerRadius: "0.9375rem",
                        item: {
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          lineHeight: "1.25rem",
                          px: "1.25rem",
                          py: "0.625rem",
                          separator: {
                            colorClass: "border-loa-button",
                            margin: "0.4375rem",
                          },
                        },
                        margin: 0.2917,
                        maxHeight: 17.5,
                      },
                      selectButton: {
                        backgroundColorClass: "bg-loa-inactive",
                        cornerRadius: "0.9375rem",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        gap: "",
                        inactiveTextColorClass: "text-loa-grey",
                        lineHeight: "1.25rem",
                        px: "1.25rem",
                        py: "0.625rem",
                      },
                    }}
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
                    items={times}
                    locale={data.locale}
                    onChange={(item) => {
                      if (item && item.id === "-") setEndTimeFilter(undefined);
                      else setEndTimeFilter(item);
                    }}
                    selected={endTimeFilter}
                    style={{
                      additionalClass: "w-full",
                      panel: {
                        alignment: "center",
                        anchor: "center",
                        backgroundColorClass: "bg-loa-panel",
                        borderColorClass: "border-loa-button",
                        borderWidth: "0.0875rem",
                        cornerRadius: "0.9375rem",
                        item: {
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          lineHeight: "1.25rem",
                          px: "1.25rem",
                          py: "0.625rem",
                          separator: {
                            colorClass: "border-loa-button",
                            margin: "0.4375rem",
                          },
                        },
                        margin: 0.2917,
                        maxHeight: 17.5,
                      },
                      selectButton: {
                        backgroundColorClass: "bg-loa-inactive",
                        cornerRadius: "0.9375rem",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        gap: "",
                        inactiveTextColorClass: "text-loa-grey",
                        lineHeight: "1.25rem",
                        px: "1.25rem",
                        py: "0.625rem",
                      },
                    }}
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
                <Dropdown
                  items={years}
                  locale={data.locale}
                  onChange={(item) => {
                    if (item && item.id === "-") setYearFilter(undefined);
                    else setYearFilter(item);
                  }}
                  selected={yearFilter}
                  style={{
                    additionalClass: "w-full",
                    panel: {
                      alignment: "center",
                      anchor: "center",
                      backgroundColorClass: "bg-loa-panel",
                      borderColorClass: "border-loa-button",
                      borderWidth: "0.0875rem",
                      cornerRadius: "0.9375rem",
                      item: {
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        lineHeight: "1.25rem",
                        px: "1.25rem",
                        py: "0.625rem",
                        separator: {
                          colorClass: "border-loa-button",
                          margin: "0.4375rem",
                        },
                      },
                      margin: 0.2917,
                      maxHeight: 17.5,
                    },
                    selectButton: {
                      backgroundColorClass: "bg-loa-inactive",
                      cornerRadius: "0.9375rem",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      gap: "",
                      inactiveTextColorClass: "text-loa-grey",
                      lineHeight: "1.25rem",
                      px: "1.25rem",
                      py: "0.625rem",
                    },
                  }}
                />
                <Dropdown
                  items={months}
                  locale={data.locale}
                  onChange={(item) => {
                    if (item && item.id === "-") setMonthFilter(undefined);
                    else setMonthFilter(item);
                  }}
                  selected={monthFilter}
                  style={{
                    additionalClass: "w-full",
                    panel: {
                      alignment: "center",
                      anchor: "center",
                      backgroundColorClass: "bg-loa-panel",
                      borderColorClass: "border-loa-button",
                      borderWidth: "0.0875rem",
                      cornerRadius: "0.9375rem",
                      item: {
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        lineHeight: "1.25rem",
                        px: "1.25rem",
                        py: "0.625rem",
                        separator: {
                          colorClass: "border-loa-button",
                          margin: "0.4375rem",
                        },
                      },
                      margin: 0.2917,
                      maxHeight: 17.5,
                    },
                    selectButton: {
                      backgroundColorClass: "bg-loa-inactive",
                      cornerRadius: "0.9375rem",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      gap: "",
                      inactiveTextColorClass: "text-loa-grey",
                      lineHeight: "1.25rem",
                      px: "1.25rem",
                      py: "0.625rem",
                    },
                  }}
                />
              </div>
            </div>
          </div>
          <hr className="mb-[2.5rem] border-loa-button" />
        </div>
        <div className="flex flex-grow flex-col gap-[1.25rem]">
          {(jobFilterList.length > 0 ||
            contentTypeFilter ||
            contentTierFilter ||
            contentStageFilter ||
            regionFilter ||
            practicePartyFilter ||
            reclearPartyFilter ||
            dayFilterList.find((l) => l.dayFilter) ||
            startTimeFilter ||
            endTimeFilter ||
            yearFilter ||
            monthFilter) && (
            <div className="flex flex-wrap gap-[0.8125rem]">
              {jobFilterList.map((job, index) => {
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
                      {t(job, { ns: "dictionary\\job" })}
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
              {contentTypeFilter && (
                <Button
                  onClick={() => {
                    setContentTypeFilter(undefined);
                    setContentTierFilter(undefined);
                    setContentStageFilter(undefined);
                  }}
                  style={{
                    additionalClass: "",
                    backgroundColorClass: "bg-loa-button-border",
                    cornerRadius: "0.9375rem",
                    fontSize: "",
                    fontWeight: "",
                    lineHeight: "",
                    px: "0.8125rem",
                    py: "0.25rem",
                    textColorClass: "text-loa-white",
                  }}
                  text={
                    <div className="flex items-center justify-center gap-[0.1875rem]">
                      <div className="text-[0.75rem] font-[500] leading-[1.25rem]">
                        {contentTypeFilter.text
                          ? contentTypeFilter.text[data.locale]
                          : ""}
                      </div>
                      <span
                        className="material-symbols-outlined text-[1.0625rem] text-loa-close-icon"
                        style={{ fontVariationSettings: '"wght" 500' }}
                      >
                        close
                      </span>
                    </div>
                  }
                />
              )}
              {contentTierFilter && (
                <Button
                  onClick={() => {
                    setContentTierFilter(undefined);
                    setContentStageFilter(undefined);
                  }}
                  style={{
                    additionalClass: "",
                    backgroundColorClass: "bg-loa-button-border",
                    cornerRadius: "0.9375rem",
                    fontSize: "",
                    fontWeight: "",
                    lineHeight: "",
                    px: "0.8125rem",
                    py: "0.25rem",
                    textColorClass: "text-loa-white",
                  }}
                  text={
                    <div className="flex items-center justify-center gap-[0.1875rem]">
                      <div className="text-[0.75rem] font-[500] leading-[1.25rem]">
                        {contentTierFilter.text
                          ? contentTierFilter.text[data.locale]
                          : ""}
                      </div>
                      <span
                        className="material-symbols-outlined text-[1.0625rem] text-loa-close-icon"
                        style={{ fontVariationSettings: '"wght" 500' }}
                      >
                        close
                      </span>
                    </div>
                  }
                />
              )}
              {contentStageFilter && (
                <Button
                  onClick={() => {
                    setContentStageFilter(undefined);
                  }}
                  style={{
                    additionalClass: "",
                    backgroundColorClass: "bg-loa-button-border",
                    cornerRadius: "0.9375rem",
                    fontSize: "",
                    fontWeight: "",
                    lineHeight: "",
                    px: "0.8125rem",
                    py: "0.25rem",
                    textColorClass: "text-loa-white",
                  }}
                  text={
                    <div className="flex items-center justify-center gap-[0.1875rem]">
                      <div className="text-[0.75rem] font-[500] leading-[1.25rem]">
                        {contentStageFilter.text
                          ? contentStageFilter.text[data.locale]
                          : ""}
                      </div>
                      <span
                        className="material-symbols-outlined text-[1.0625rem] text-loa-close-icon"
                        style={{ fontVariationSettings: '"wght" 500' }}
                      >
                        close
                      </span>
                    </div>
                  }
                />
              )}
              {regionFilter && (
                <Button
                  onClick={() => {
                    setRegionFilter(undefined);
                  }}
                  style={{
                    additionalClass: "",
                    backgroundColorClass: "bg-loa-button-border",
                    cornerRadius: "0.9375rem",
                    fontSize: "",
                    fontWeight: "",
                    lineHeight: "",
                    px: "0.8125rem",
                    py: "0.25rem",
                    textColorClass: "text-loa-white",
                  }}
                  text={
                    <div className="flex items-center justify-center gap-[0.1875rem]">
                      <div className="text-[0.75rem] font-[500] leading-[1.25rem]">
                        {regionFilter.text
                          ? regionFilter.text[data.locale]
                          : ""}
                      </div>
                      <span
                        className="material-symbols-outlined text-[1.0625rem] text-loa-close-icon"
                        style={{ fontVariationSettings: '"wght" 500' }}
                      >
                        close
                      </span>
                    </div>
                  }
                />
              )}
              {practicePartyFilter && (
                <div
                  className="flex cursor-pointer items-center gap-[0.1875rem] rounded-[0.9375rem] bg-loa-button-border px-[0.8125rem] py-[0.25rem]"
                  onClick={() => {
                    setPracticePartyFilter(false);
                  }}
                >
                  <div className="text-[0.75rem] font-[500] leading-[1.25rem]">
                    {t("practiceParty", {
                      ns: "routes\\tools\\party-finder",
                    })}
                  </div>
                  <span
                    className="material-symbols-outlined text-[1.0625rem] text-loa-close-icon"
                    style={{ fontVariationSettings: '"wght" 500' }}
                  >
                    close
                  </span>
                </div>
              )}
              {reclearPartyFilter && (
                <div
                  className="flex cursor-pointer items-center gap-[0.1875rem] rounded-[0.9375rem] bg-loa-button-border px-[0.8125rem] py-[0.25rem]"
                  onClick={() => {
                    setReclearPartyFilter(false);
                  }}
                >
                  <div className="text-[0.75rem] font-[500] leading-[1.25rem]">
                    {t("reclearParty", {
                      ns: "routes\\tools\\party-finder",
                    })}
                  </div>
                  <span
                    className="material-symbols-outlined text-[1.0625rem] text-loa-close-icon"
                    style={{ fontVariationSettings: '"wght" 500' }}
                  >
                    close
                  </span>
                </div>
              )}
              {dayFilterList.find((l) => l.dayFilter) &&
                dayFilterList
                  .map((l, index) => ({ ...l, index }))
                  .filter((l) => l.dayFilter)
                  .map((l) => (
                    <Button
                      onClick={() => {
                        l.setDayFilter(false);
                      }}
                      style={{
                        additionalClass: "",
                        backgroundColorClass: "bg-loa-button-border",
                        cornerRadius: "0.9375rem",
                        fontSize: "",
                        fontWeight: "",
                        lineHeight: "",
                        px: "0.8125rem",
                        py: "0.25rem",
                        textColorClass: "text-loa-white",
                      }}
                      text={
                        <div className="flex items-center justify-center gap-[0.1875rem]">
                          <div className="text-[0.75rem] font-[500] leading-[1.25rem]">
                            {t(
                              `${
                                [
                                  "mon",
                                  "tue",
                                  "wed",
                                  "thu",
                                  "fri",
                                  "sat",
                                  "sun",
                                ][l.index]
                              }Filter`,
                              { ns: "routes\\tools\\party-finder" }
                            )}
                          </div>
                          <span
                            className="material-symbols-outlined text-[1.0625rem] text-loa-close-icon"
                            style={{ fontVariationSettings: '"wght" 500' }}
                          >
                            close
                          </span>
                        </div>
                      }
                    />
                  ))}
              {(startTimeFilter || endTimeFilter) && (
                <Button
                  onClick={() => {
                    setStartTimeFilter(undefined);
                    setEndTimeFilter(undefined);
                  }}
                  style={{
                    additionalClass: "",
                    backgroundColorClass: "bg-loa-button-border",
                    cornerRadius: "0.9375rem",
                    fontSize: "",
                    fontWeight: "",
                    lineHeight: "",
                    px: "0.8125rem",
                    py: "0.25rem",
                    textColorClass: "text-loa-white",
                  }}
                  text={
                    <div className="flex items-center justify-center gap-[0.1875rem]">
                      <div className="text-[0.75rem] font-[500] leading-[1.25rem]">
                        {`${
                          startTimeFilter
                            ? printTime(parseInt(startTimeFilter.id), 0)
                            : ""
                        } ~ ${
                          endTimeFilter
                            ? printTime(parseInt(endTimeFilter.id), 0)
                            : ""
                        }`}
                      </div>
                      <span
                        className="material-symbols-outlined text-[1.0625rem] text-loa-close-icon"
                        style={{ fontVariationSettings: '"wght" 500' }}
                      >
                        close
                      </span>
                    </div>
                  }
                />
              )}
              {yearFilter && (
                <Button
                  onClick={() => {
                    setYearFilter(undefined);
                  }}
                  style={{
                    additionalClass: "",
                    backgroundColorClass: "bg-loa-button-border",
                    cornerRadius: "0.9375rem",
                    fontSize: "",
                    fontWeight: "",
                    lineHeight: "",
                    px: "0.8125rem",
                    py: "0.25rem",
                    textColorClass: "text-loa-white",
                  }}
                  text={
                    <div className="flex items-center justify-center gap-[0.1875rem]">
                      <div className="text-[0.75rem] font-[500] leading-[1.25rem]">
                        {yearFilter.id}
                      </div>
                      <span
                        className="material-symbols-outlined text-[1.0625rem] text-loa-close-icon"
                        style={{ fontVariationSettings: '"wght" 500' }}
                      >
                        close
                      </span>
                    </div>
                  }
                />
              )}
              {monthFilter && (
                <Button
                  onClick={() => {
                    setMonthFilter(undefined);
                  }}
                  style={{
                    additionalClass: "",
                    backgroundColorClass: "bg-loa-button-border",
                    cornerRadius: "0.9375rem",
                    fontSize: "",
                    fontWeight: "",
                    lineHeight: "",
                    px: "0.8125rem",
                    py: "0.25rem",
                    textColorClass: "text-loa-white",
                  }}
                  text={
                    <div className="flex items-center justify-center gap-[0.1875rem]">
                      <div className="text-[0.75rem] font-[500] leading-[1.25rem]">
                        {t(`month${monthFilter.id}Filter`, {
                          ns: "routes\\tools\\party-finder",
                        })}
                      </div>
                      <span
                        className="material-symbols-outlined text-[1.0625rem] text-loa-close-icon"
                        style={{ fontVariationSettings: '"wght" 500' }}
                      >
                        close
                      </span>
                    </div>
                  }
                />
              )}
            </div>
          )}
          <div className="flex w-full flex-col gap-[1.25rem]">
            {partyFindPosts.map((partyFindPost, index) => {
              const convertedDate = new Date(partyFindPost.startTime);
              const dateString = generateProperLocaleDateString(
                data.locale,
                convertedDate
              );
              const timeString = printTime(
                convertedDate.getHours(),
                convertedDate.getMinutes()
              );

              return (
                <Link
                  className={`${
                    index % 2 === 0 ? "bg-loa-panel " : "bg-loa-button "
                  }flex w-full gap-[1.25rem] rounded-[0.9375rem] py-[1.25rem] px-[1.25rem]`}
                  key={index}
                  to={`/party-find-post/${partyFindPost.id}`}
                >
                  <div className="flex w-[7.625rem] flex-col">
                    <div className="h-[2.5rem] overflow-hidden whitespace-normal text-[0.9375rem] font-[700] leading-[1.25rem]">
                      {
                        {
                          en: partyFindPost.contentStage.contentTab.content
                            .nameEn,
                          ko: partyFindPost.contentStage.contentTab.content
                            .nameKo,
                        }[data.locale]
                      }
                    </div>
                    <div className="text-[0.9375rem] font-[500] leading-[1.25rem]">
                      {partyFindPost.isPracticeParty &&
                        t("practiceParty", {
                          ns: "routes\\tools\\party-finder",
                        })}
                      {partyFindPost.isReclearParty &&
                        t("reclearParty", {
                          ns: "routes\\tools\\party-finder",
                        })}
                    </div>
                  </div>
                  <div className="flex w-[9.9375rem] flex-col">
                    <div className="h-[2.5rem] overflow-hidden whitespace-normal text-[0.9375rem] font-[700] leading-[1.25rem]">
                      <span>
                        {
                          {
                            en: partyFindPost.contentStage.contentTab.nameEn,
                            ko: partyFindPost.contentStage.contentTab.nameKo,
                          }[data.locale]
                        }
                      </span>
                      {partyFindPost.contentStage.contentTab
                        .difficultyNameEn && (
                        <span
                          className={getColorCodeFromDifficulty(
                            partyFindPost.contentStage.contentTab
                              .difficultyNameEn
                          )}
                        >
                          {` [${
                            {
                              en: partyFindPost.contentStage.contentTab
                                .difficultyNameEn,
                              ko: partyFindPost.contentStage.contentTab
                                .difficultyNameKo,
                            }[data.locale]
                          }]`}
                        </span>
                      )}
                    </div>
                    <div className="truncate text-[0.9375rem] font-[500] leading-[1.25rem]">
                      {
                        {
                          en: partyFindPost.contentStage.nameEn,
                          ko: partyFindPost.contentStage.nameKo,
                        }[data.locale]
                      }
                    </div>
                  </div>
                  <div className="flex w-[19.9375rem] flex-col gap-[0.4375rem]">
                    <div className="truncate text-[0.9375rem] font-[500] leading-[1.25rem]">
                      {partyFindPost.title}
                    </div>
                    <div className="flex h-[2rem] items-end gap-[0.3125rem]">
                      {partyFindPost.partyFindSlots.map((slot, index) => {
                        let circle, star;

                        if (
                          slot.partyFindApplyState &&
                          slot.partyFindApplyState.id
                        ) {
                          const iconPath = generateJobIconPath(
                            slot.partyFindApplyState.character.job
                          );

                          circle = (
                            <div
                              className={`${
                                slot.jobType === JobType.SUPPORT
                                  ? "border-loa-green "
                                  : "border-loa-red "
                              }rounded-full border-2 px-[0.125rem] py-[0.125rem]`}
                            >
                              <div
                                className="h-[1.5625rem] w-[1.5625rem] rounded-full bg-contain bg-center bg-no-repeat"
                                style={{
                                  backgroundImage: iconPath
                                    ? `url('${iconPath}')`
                                    : "",
                                }}
                              ></div>
                            </div>
                          );
                        } else {
                          circle = (
                            <div
                              className={`${
                                slot.jobType === JobType.SUPPORT
                                  ? "bg-loa-green "
                                  : ""
                              }${
                                slot.jobType === JobType.DPS
                                  ? "bg-loa-red "
                                  : ""
                              }${
                                slot.jobType === JobType.ANY
                                  ? "bg-loa-grey "
                                  : ""
                              }h-[2.0625rem] w-[2.0625rem] rounded-full`}
                            />
                          );
                        }

                        if (
                          slot.partyFindApplyState &&
                          slot.partyFindApplyState.id &&
                          slot.partyFindApplyState.character.roster.userId ===
                            partyFindPost.authorId
                        ) {
                          star = (
                            <div className="material-symbols-outlined absolute right-[-5px] top-[-5px] text-[1.125rem] text-loa-party-leader-star">
                              star
                            </div>
                          );
                        }

                        return (
                          <div className="relative" key={index}>
                            {circle}
                            {star}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex w-[13.125rem] flex-col">
                    <div className="text-[0.9375rem] font-[400] leading-[1.25rem]">
                      {partyFindPost.recurring
                        ? [
                            <span key={1}>{`${t("every", {
                              ns: "routes\\tools\\party-finder",
                            })} `}</span>,
                            <span
                              className="text-loa-party-leader-star"
                              key={2}
                            >{`${t(
                              [
                                "sunFilter",
                                "monFilter",
                                "tueFilter",
                                "wedFilter",
                                "thuFilter",
                                "friFilter",
                                "satFilter",
                              ][convertedDate.getDay()],
                              { ns: "routes\\tools\\party-finder" }
                            )} `}</span>,
                            <span key={3}>{timeString}</span>,
                          ]
                        : [
                            <span
                              className="whitespace-pre"
                              key={1}
                            >{`${dateString}  `}</span>,
                            <span
                              className="whitespace-pre text-loa-party-leader-star"
                              key={2}
                            >
                              {`${t(
                                [
                                  "sunList",
                                  "monList",
                                  "tueList",
                                  "wedList",
                                  "thuList",
                                  "friList",
                                  "satList",
                                ][convertedDate.getDay()],
                                { ns: "routes\\tools\\party-finder" }
                              )}  `}
                            </span>,
                            <span key={3}>{timeString}</span>,
                          ]}
                    </div>
                    <div className="min-h-[1.25rem] text-[0.9375rem] font-[400] leading-[1.25rem]">
                      {partyFindPost.recurring
                        ? putFromAndToOnRight.includes(data.locale)
                          ? `${dateString} ${t("from", {
                              ns: "routes\\tools\\party-finder",
                            })}`
                          : `${t("from", {
                              ns: "routes\\tools\\party-finder",
                            })} ${dateString}`
                        : ``}
                    </div>
                    <div className="grid grid-cols-2 text-[0.9375rem] font-[500] leading-[1.25rem]">
                      <div className="text-loa-green">
                        {t("average", { ns: "routes\\tools\\party-finder" })}{" "}
                        {(
                          partyFindPost.partyFindSlots.reduce(
                            (prev, current) =>
                              prev +
                              (current.partyFindApplyState &&
                              current.partyFindApplyState.id
                                ? current.partyFindApplyState.character
                                    .itemLevel
                                : 0),
                            0
                          ) /
                          partyFindPost.partyFindSlots.filter(
                            (slot) =>
                              slot.partyFindApplyState &&
                              slot.partyFindApplyState.id
                          ).length
                        ).toFixed(0)}{" "}
                      </div>
                      <div className="text-loa-pink">
                        {partyFindPost.server.region.shortName}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
