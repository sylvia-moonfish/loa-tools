/*import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import type { RootContext } from "~/root";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { prisma } from "~/db.server";
import i18next from "~/i18next.server";
import { getUserFromRequest } from "~/session.server";
import {
  generateJobIconPath,
  generateProperLocaleDateString,
  getContentByType,
  printTime,
  putFromAndToOnRight,
} from "~/utils";

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  return { title: data.title };
};

export const handle = {
  i18n: [
    "dictionary\\job",
    "routes\\tools\\party-finder",
    "routes\\tools\\party-finder\\id",
  ],
};

type LoaderData = {
  locale: string;
  paramsId: string;
  partyFindPost: Awaited<ReturnType<typeof getPartyFindPost>>;
  title: string;
  user: Awaited<ReturnType<typeof getUser>>;
};

const getUser = async (id: string) => {
  return await prisma.user.findFirst({ where: { id }, select: { id: true } });
};

const getPartyFindPost = async (id: string) => {
  return await prisma.partyFindPost.findUnique({
    where: { id },
    select: {
      id: true,
      updatedAt: true,
      contentType: true,
      isPracticeParty: true,
      isFarmingParty: true,
      title: true,
      startTime: true,
      recurring: true,

      chaosDungeon: {
        select: {
          id: true,
          nameEn: true,
          nameKo: true,
          chaosDungeonTab: {
            select: {
              id: true,
              nameEn: true,
              nameKo: true,
              chaosDungeon: {
                select: { id: true, nameEn: true, nameKo: true },
              },
            },
          },
        },
      },

      guardianRaid: {
        select: {
          id: true,
          nameEn: true,
          nameKo: true,
          guardianRaidTab: {
            select: {
              id: true,
              nameEn: true,
              nameKo: true,
              guardianRaid: {
                select: { id: true, nameEn: true, nameKo: true },
              },
            },
          },
        },
      },

      abyssalDungeon: {
        select: {
          id: true,
          nameEn: true,
          nameKo: true,
          abyssalDungeonTab: {
            select: {
              id: true,
              nameEn: true,
              nameKo: true,
              difficultyNameEn: true,
              difficultyNameKo: true,
              abyssalDungeon: {
                select: { id: true, nameEn: true, nameKo: true },
              },
            },
          },
        },
      },

      abyssRaid: {
        select: {
          id: true,
          nameEn: true,
          nameKo: true,
          abyssRaidTab: {
            select: {
              id: true,
              nameEn: true,
              nameKo: true,
              abyssRaid: { select: { id: true, nameEn: true, nameKo: true } },
            },
          },
        },
      },

      legionRaid: {
        select: {
          id: true,
          nameEn: true,
          nameKo: true,
          legionRaidTab: {
            select: {
              id: true,
              nameEn: true,
              nameKo: true,
              difficultyNameEn: true,
              difficultyNameKo: true,
              legionRaid: { select: { id: true, nameEn: true, nameKo: true } },
            },
          },
        },
      },

      authorId: true,

      server: {
        select: {
          id: true,
          name: true,
          region: {
            select: { id: true, name: true, abbr: true, shortName: true },
          },
        },
      },

      partyFindSlots: {
        select: {
          id: true,
          index: true,
          jobType: true,
          isAuthor: true,
          character: {
            select: {
              id: true,
              name: true,
              job: true,
              itemLevel: true,
              roster: {
                select: {
                  userId: true,
                },
              },
            },
          },
        },
        orderBy: { index: "asc" },
        where: { characterId: { not: null } },
      },
    },
  });
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const t = await i18next.getFixedT(request, "root");

  if (!params.id) return redirect("/tools/party-finder");

  const partyFindPost = await getPartyFindPost(params.id);

  if (!partyFindPost) return redirect("/tools/party-finder");

  const user = await getUserFromRequest(request);

  return json<LoaderData>({
    locale: await i18next.getLocale(request),
    paramsId: params.id,
    partyFindPost,
    title: `${partyFindPost.title} | ${t("shortTitle")}`,
    user: user ? await getUser(user.id) : null,
  });
};

export default function ToolsPartyFinderIdPage() {
  const { setPathname } = useOutletContext<RootContext>();
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();

  React.useEffect(() => {
    setPathname(`/tools/party-finder/${data.paramsId}`);
  });

  if (data.partyFindPost) {
    const authorChar = data.partyFindPost?.partyFindSlots.find(
      (partyFindSlot) => partyFindSlot.isAuthor
    )?.character;
    const authorJobIconPath = authorChar
      ? `url('${generateJobIconPath(authorChar.job)}')`
      : "";

    const content = getContentByType(data.partyFindPost);

    let difficulty = "";

    if (data.partyFindPost.isPracticeParty) {
      difficulty = "objectivePractice";
    } else if (data.partyFindPost.isFarmingParty) {
      difficulty = "objectiveFarm";
    }

    const updatedTime = new Date(data.partyFindPost.updatedAt);
    const updatedDateString = generateProperLocaleDateString(
      data.locale,
      updatedTime
    );
    const updatedTimeString = printTime(
      updatedTime.getHours(),
      updatedTime.getMinutes()
    );

    const startTime = new Date(data.partyFindPost.startTime);
    const dateString = generateProperLocaleDateString(data.locale, startTime);
    const timeString = printTime(startTime.getHours(), startTime.getMinutes());

    const slotArray = data.partyFindPost.partyFindSlots.map(
      (partyFindSlot, index) => index
    );

    return (
      <div className="mx-auto mt-[3.125rem] flex w-[46.75rem] flex-col">
        <div className="flex items-center">
          <div
            className="h-[4.0625rem] w-[4.0625rem] rounded-full bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: authorJobIconPath }}
          ></div>
          <div className="ml-[1.5625rem] flex w-[23.25rem] flex-col gap-[0.3125rem]">
            <div className="h-[2.5rem] w-[23.25rem] overflow-hidden whitespace-normal break-all text-[1.25rem] font-[700] leading-[1.25rem]">
              {data.partyFindPost.title}
            </div>
            <div className="text-[0.75rem] font-[400] leading-[1.25rem] text-loa-grey">
              {`${t("lastUpdated", {
                ns: "routes\\tools\\party-finder\\id",
              })} ${updatedDateString} ${updatedTimeString}`}
            </div>
          </div>
          <div className="flex flex-grow"></div>
          {data.user && data.user.id === data.partyFindPost.authorId && (
            <div className="flex gap-[0.625rem]">
              <div className="rounded-[0.9375rem] bg-loa-button p-[0.9375rem] text-[1rem] font-[500] leading-[1.25rem]">
                {t("edit", { ns: "routes\\tools\\party-finder\\id" })}
              </div>
              <div className="rounded-[0.9375rem] bg-loa-red p-[0.9375rem] text-[1rem] font-[500] leading-[1.25rem]">
                {t("delete", { ns: "routes\\tools\\party-finder\\id" })}
              </div>
            </div>
          )}
        </div>
        <div className="mt-[1.375rem] flex flex-col gap-[1.25rem] rounded-[0.9375rem] bg-loa-panel p-[1.25rem]">
          <div className="text-[1.25rem] font-[700] leading-[1.25rem]">
            {t("basicInfo", { ns: "routes\\tools\\party-finder\\id" })}
          </div>
          <div className="flex gap-[2.8125rem]">
            <div className="flex flex-col gap-[0.9375rem] text-[1rem] font-[400] leading-[1.25rem]">
              <div>{t("type", { ns: "routes\\tools\\party-finder\\id" })}</div>
              <div>{t("tier", { ns: "routes\\tools\\party-finder\\id" })}</div>
              <div>{t("stage", { ns: "routes\\tools\\party-finder\\id" })}</div>
            </div>
            <div className="flex flex-col gap-[0.9375rem] text-[1rem] font-[700] leading-[1.25rem]">
              <div>
                {content &&
                  content.contentType &&
                  {
                    en: content.contentType.nameEn,
                    ko: content.contentType.nameKo,
                  }[data.locale]}
              </div>
              <div>
                <span>
                  {content &&
                    content.contentTab &&
                    {
                      en: content.contentTab.nameEn,
                      ko: content.contentTab.nameKo,
                    }[data.locale]}
                </span>
                {content &&
                  content.contentTab &&
                  content.contentTab.difficultyNameEn && (
                    <span
                      className={`${
                        content.contentTab.difficultyNameEn.toLowerCase() ===
                        "normal"
                          ? "text-loa-green"
                          : ""
                      }${
                        content.contentTab.difficultyNameEn.toLowerCase() ===
                        "hard"
                          ? "text-loa-red"
                          : ""
                      }`}
                    >{` [${
                      {
                        en: content.contentTab.difficultyNameEn,
                        ko: content.contentTab.difficultyNameKo,
                      }[data.locale]
                    }]`}</span>
                  )}
              </div>
              <div>
                {content &&
                  content.contentStage &&
                  {
                    en: content.contentStage.nameEn,
                    ko: content.contentStage.nameKo,
                  }[data.locale]}
              </div>
            </div>
            <div className="flex flex-col gap-[0.9375rem] text-[1rem] font-[400] leading-[1.25rem]">
              <div>
                {t("difficulty", { ns: "routes\\tools\\party-finder\\id" })}
              </div>
              <div>
                {t("region", { ns: "routes\\tools\\party-finder\\id" })}
              </div>
              <div>
                {t("schedule", { ns: "routes\\tools\\party-finder\\id" })}
              </div>
            </div>
            <div className="flex flex-col gap-[0.9375rem] text-[1rem] font-[700] leading-[1.25rem]">
              <div>{t(difficulty, { ns: "routes\\tools\\party-finder" })}</div>
              <div>{data.partyFindPost.server?.region?.name}</div>
              <div>
                {data.partyFindPost.recurring
                  ? `${t("every", { ns: "routes\\tools\\party-finder" })} ${t(
                      [
                        "sunFilter",
                        "monFilter",
                        "tueFilter",
                        "wedFilter",
                        "thuFilter",
                        "friFilter",
                        "satFilter",
                      ][startTime.getDay()],
                      { ns: "routes\\tools\\party-finder" }
                    )} ${timeString} ${
                      putFromAndToOnRight.includes(data.locale)
                        ? `${dateString} ${t("from", {
                            ns: "routes\\tools\\party-finder",
                          })}`
                        : `${t("from", {
                            ns: "routes\\tools\\party-finder",
                          })} ${dateString}`
                    }`
                  : `${dateString} ${timeString} ${t(
                      [
                        "sunList",
                        "monList",
                        "tueList",
                        "wedList",
                        "thuList",
                        "friList",
                        "satList",
                      ][startTime.getDay()],
                      { ns: "routes\\tools\\party-finder" }
                    )}`}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-[1.25rem] flex flex-col gap-[1.25rem] rounded-[0.9375rem] bg-loa-panel p-[1.25rem]">
          <div className="text-[1.25rem] font-[700] leading-[1.25rem]">
            {t("partyMembers", { ns: "routes\\tools\\party-finder\\id" })}
          </div>
          <div className="flex gap-[2.8125rem] text-[0.9375rem] font-[500] leading-[1.25rem]">
            <div className="flex flex-col gap-[0.9375rem]">
              {slotArray.map((slot) => {
                let circle, star;

                if (
                  data.partyFindPost?.partyFindSlots &&
                  data.partyFindPost.partyFindSlots.length > slot
                ) {
                  const _slot = data.partyFindPost.partyFindSlots[slot];

                  if (_slot && _slot.character && _slot.character.id) {
                    const iconPath = generateJobIconPath(_slot.character.job);

                    circle = (
                      <div
                        className="h-[1.6875rem] w-[1.6875rem] rounded-full bg-contain bg-center bg-no-repeat"
                        style={{ backgroundImage: `url('${iconPath}')` }}
                      ></div>
                    );

                    if (_slot.isAuthor) {
                      star = (
                        <div className="material-symbols-outlined absolute right-[-5px] top-[-5px] text-[1.125rem] text-loa-party-leader-star">
                          star
                        </div>
                      );
                    }
                  }
                }

                return (
                  <div
                    className="relative flex h-[1.6875rem] items-center justify-center"
                    key={slot}
                  >
                    {circle}
                    {star}
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col gap-[0.9375rem]">
              {slotArray.map((slot) => {
                let text;

                if (
                  data.partyFindPost?.partyFindSlots &&
                  data.partyFindPost.partyFindSlots.length > slot
                ) {
                  const _slot = data.partyFindPost.partyFindSlots[slot];

                  if (_slot && _slot.character && _slot.character.id) {
                    text = _slot.character.name;
                  }
                }

                return (
                  <div
                    className="flex h-[1.6875rem] items-center justify-center"
                    key={slot}
                  >
                    {text}
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col gap-[0.9375rem]">
              {slotArray.map((slot) => {
                let text;

                if (
                  data.partyFindPost?.partyFindSlots &&
                  data.partyFindPost.partyFindSlots.length > slot
                ) {
                  const _slot = data.partyFindPost.partyFindSlots[slot];

                  if (_slot && _slot.character && _slot.character.id) {
                    text = t(_slot.character.job, { ns: "dictionary\\job" });
                  }
                }

                return (
                  <div
                    className="flex h-[1.6875rem] items-center justify-center"
                    key={slot}
                  >
                    {text}
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col gap-[0.9375rem]">
              {slotArray.map((slot) => {
                let text;

                if (
                  data.partyFindPost?.partyFindSlots &&
                  data.partyFindPost.partyFindSlots.length > slot
                ) {
                  const _slot = data.partyFindPost.partyFindSlots[slot];

                  if (_slot && _slot.character && _slot.character.id) {
                    text = `LV.${_slot.character.itemLevel}`;
                  }
                }

                return (
                  <div
                    className="flex h-[1.6875rem] items-center justify-center"
                    key={slot}
                  >
                    {text}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="mt-[1.25rem] w-full">
          <div className="flex h-[3.75rem] w-full items-center justify-center rounded-[0.9375rem] bg-loa-green text-[1.25rem] font-[700] leading-[1.25rem]">
            {t("apply", { ns: "routes\\tools\\party-finder\\id" })}
          </div>
        </div>
      </div>
    );
  }

  return <div></div>;
}
*/
export default function temp() {
  return <div></div>;
}
