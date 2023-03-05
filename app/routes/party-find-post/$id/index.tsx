import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import type { ItemType } from "~/components/dropdown";
import type { ActionBody as ApplyActionBody } from "~/routes/api/party-find-post/$id/apply";
import type { ActionBody as DeleteActionBody } from "~/routes/api/party-find-post/$id/delete";
import type { ActionBody as LeaveActionBody } from "~/routes/api/party-find-post/$id/leave";
import type { LocaleType } from "~/i18n";
import { JobType, PartyFindApplyStateValue } from "@prisma/client";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import EditPartyButton from "~/components/tools/party-finder/edit-party-button";
import Button from "~/components/button";
import Dropdown from "~/components/dropdown";
import Modal from "~/components/modal";
import { prisma } from "~/db.server";
import i18next from "~/i18next.server";
import { getUserFromRequest } from "~/session.server";
import {
  elapsedTimeSpaced,
  generateJobIconPath,
  generateProperLocaleDateString,
  getContentByType,
  getJobTypeFromJob,
  printTime,
  printTimeElapsed,
  putFromAndToOnRight,
} from "~/utils";

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  return { title: data.title };
};

type LoaderData = {
  abyssalDungeon: Awaited<ReturnType<typeof getAbyssalDungeon>>;
  abyssRaid: Awaited<ReturnType<typeof getAbyssRaid>>;
  chaosDungeon: Awaited<ReturnType<typeof getChaosDungeon>>;
  guardianRaid: Awaited<ReturnType<typeof getGuardianRaid>>;
  legionRaid: Awaited<ReturnType<typeof getLegionRaid>>;
  locale: LocaleType;
  partyFindPost: Awaited<ReturnType<typeof getPartyFindPost>>;
  title: string;
  user: Awaited<ReturnType<typeof getUser>>;
};

const getAbyssalDungeon = async () => {
  return await prisma.abyssalDungeon.findFirst({
    select: {
      id: true,
      nameEn: true,
      nameKo: true,
      tabs: {
        select: {
          id: true,
          nameEn: true,
          nameKo: true,
          difficultyNameEn: true,
          difficultyNameKo: true,
          stages: { select: { id: true, nameEn: true, nameKo: true } },
        },
      },
    },
  });
};

const getAbyssRaid = async () => {
  return await prisma.abyssRaid.findFirst({
    select: {
      id: true,
      nameEn: true,
      nameKo: true,
      tabs: {
        select: {
          id: true,
          nameEn: true,
          nameKo: true,
          stages: { select: { id: true, nameEn: true, nameKo: true } },
        },
      },
    },
  });
};

const getChaosDungeon = async () => {
  return await prisma.chaosDungeon.findFirst({
    select: {
      id: true,
      nameEn: true,
      nameKo: true,
      tabs: {
        select: {
          id: true,
          nameEn: true,
          nameKo: true,
          stages: { select: { id: true, nameEn: true, nameKo: true } },
        },
      },
    },
  });
};

const getGuardianRaid = async () => {
  return await prisma.guardianRaid.findFirst({
    select: {
      id: true,
      nameEn: true,
      nameKo: true,
      tabs: {
        select: {
          id: true,
          nameEn: true,
          nameKo: true,
          stages: { select: { id: true, nameEn: true, nameKo: true } },
        },
      },
    },
  });
};

const getLegionRaid = async () => {
  return await prisma.legionRaid.findFirst({
    select: {
      id: true,
      nameEn: true,
      nameKo: true,
      tabs: {
        select: {
          id: true,
          nameEn: true,
          nameKo: true,
          difficultyNameEn: true,
          difficultyNameKo: true,
          stages: { select: { id: true, nameEn: true, nameKo: true } },
        },
      },
    },
  });
};

const getPartyFindPost = async (id: string) => {
  return await prisma.partyFindPost.findUnique({
    where: { id },
    select: {
      id: true,
      updatedAt: true,

      contentType: true,
      isPracticeParty: true,
      isReclearParty: true,
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
              abyssRaid: {
                select: { id: true, nameEn: true, nameKo: true },
              },
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
              legionRaid: {
                select: { id: true, nameEn: true, nameKo: true },
              },
            },
          },
        },
      },

      authorId: true,

      server: {
        select: { id: true, region: { select: { id: true, name: true } } },
      },

      partyFindSlots: {
        orderBy: { index: "asc" },
        select: {
          id: true,
          jobType: true,
          partyFindApplyState: {
            select: {
              id: true,
              character: {
                select: {
                  id: true,
                  name: true,
                  job: true,
                  itemLevel: true,
                  roster: { select: { id: true, userId: true } },
                },
              },
            },
          },
        },
      },

      applyStates: {
        select: {
          id: true,
          state: true,
          character: {
            select: {
              id: true,
              name: true,
              job: true,
              roster: { select: { id: true, userId: true } },
            },
          },
        },
      },
    },
  });
};

const getUser = async (id: string, regionId: string) => {
  return await prisma.user.findFirst({
    where: { id },
    select: {
      id: true,
      rosters: {
        where: { server: { regionId } },
        select: {
          id: true,
          server: { select: { id: true, name: true } },
          characters: {
            select: { id: true, name: true, job: true, itemLevel: true },
          },
        },
      },
    },
  });
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const t = await i18next.getFixedT(request, "root");

  if (!params.id) return redirect("/");

  const partyFindPost = await getPartyFindPost(params.id);

  if (!partyFindPost) return redirect("/");

  const user = await getUserFromRequest(request);

  return json<LoaderData>({
    abyssalDungeon: await getAbyssalDungeon(),
    abyssRaid: await getAbyssRaid(),
    chaosDungeon: await getChaosDungeon(),
    guardianRaid: await getGuardianRaid(),
    legionRaid: await getLegionRaid(),
    locale: (await i18next.getLocale(request)) as LocaleType,
    partyFindPost,
    title: `${partyFindPost.title} | ${t("shortTitle")}`,
    user: user ? await getUser(user.id, partyFindPost.server.region.id) : null,
  });
};

export default function PartyFindPostIdPage() {
  const data = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [character, setCharacter] = React.useState<ItemType | undefined>(
    undefined
  );

  const [isDeleteWarningOpen, setIsDeleteWarningOpen] = React.useState(false);
  const [allowDeleteWarningToClose, setAllowDeleteWarningToClose] =
    React.useState(true);
  const [isDeleteButtonEnabled, setIsDeleteButtonEnabled] =
    React.useState(true);
  let _isDeleteButtonEnabled = true;

  const [showPopup, setShowPopup] = React.useState(false);

  const [isApplyModalOpen, setIsApplyModalOpen] = React.useState(false);
  const [allowApplyModalToClose, setAllowApplyModalToClose] =
    React.useState(true);
  const [isApplyModalButtonEnabled, setIsApplyModalButtonEnabled] =
    React.useState(true);
  let _isApplyModalButtonEnabled = true;

  if (data.partyFindPost) {
    const authorJob = data.partyFindPost.partyFindSlots.find(
      (s) =>
        data.partyFindPost &&
        s.partyFindApplyState &&
        s.partyFindApplyState.id &&
        s.partyFindApplyState.character.roster.userId ===
          data.partyFindPost.authorId
    )?.partyFindApplyState?.character.job;
    const iconPath = authorJob ? generateJobIconPath(authorJob) : "";

    const updatedAtTime = new Date(data.partyFindPost.updatedAt);
    const updatedAtDateString = generateProperLocaleDateString(
      data.locale,
      updatedAtTime
    );
    const updatedAtTimeString = printTime(
      updatedAtTime.getHours(),
      updatedAtTime.getMinutes()
    );
    const updatedAtElapsedTimes = printTimeElapsed(updatedAtTime);
    const updatedAtElapsedTimeString = `${updatedAtElapsedTimes[0]}${
      elapsedTimeSpaced.includes(data.locale) ? " " : ""
    }${t(
      `${updatedAtElapsedTimes[1]}${
        updatedAtElapsedTimes[0] === "1" ? "" : "s"
      }`,
      { ns: "dictionary\\time-elapsed" }
    )} ${t("ago", { ns: "dictionary\\time-elapsed" })}`;

    const startTime = new Date(data.partyFindPost.startTime);
    const startDateString = generateProperLocaleDateString(
      data.locale,
      startTime
    );
    const startTimeString = printTime(
      startTime.getHours(),
      startTime.getMinutes()
    );

    const contentByType = getContentByType(data.partyFindPost);

    const _characters =
      data.user?.rosters
        .sort((a, b) => a.server.name.localeCompare(b.server.name))
        .map((r) =>
          r.characters
            .sort((a, b) => b.itemLevel)
            .map((c) => ({ ...c, roster: r }))
        )
        .flat() ?? [];
    const characters = _characters
      .filter(
        (c) =>
          data.partyFindPost &&
          data.partyFindPost.partyFindSlots.find(
            (s) =>
              !(s.partyFindApplyState && s.partyFindApplyState.id) &&
              [JobType.ANY, getJobTypeFromJob(c.job)].includes(s.jobType)
          )
      )
      .map((c) => ({
        id: c.id,
        text: {
          en: `${t(c.job, { ns: "dictionary\\job", lng: "en" })} [${
            c.name
          }] lv.${c.itemLevel.toFixed(0)} ${c.roster.server.name}`,
          ko: `${t(c.job, { ns: "dictionary\\job", lng: "ko" })} [${
            c.name
          }] lv.${c.itemLevel.toFixed(0)} ${c.roster.server.name}`,
        },
      }));

    const userApplyState = data.partyFindPost.applyStates.find(
      (a) => data.user && a.character.roster.userId === data.user.id
    );

    let applyText:
      | "apply"
      | "author"
      | "leave"
      | "alreadyApplied"
      | "noCharacter" = "apply";
    let applyColor: "bg-loa-green" | "bg-loa-red" | "bg-loa-button" =
      "bg-loa-button";
    let applyDisabled: boolean = false;

    if (data.user) {
      if (data.partyFindPost.authorId === data.user.id) applyText = "author";
      else if (
        userApplyState &&
        userApplyState.state === PartyFindApplyStateValue.ACCEPTED
      ) {
        applyText = "leave";
        applyColor = "bg-loa-red";
        applyDisabled = false;
      } else if (
        userApplyState &&
        userApplyState.state === PartyFindApplyStateValue.WAITING
      ) {
        applyText = "alreadyApplied";
        applyColor = "bg-loa-button";
        applyDisabled = true;
      } else if (characters.length === 0) {
        applyText = "noCharacter";
        applyColor = "bg-loa-button";
        applyDisabled = true;
      } else {
        applyText = "apply";
        applyColor = "bg-loa-green";
        applyDisabled = false;
      }
    }

    const contentTypes: (ItemType & {
      tiers: (ItemType & { stages: ItemType[] })[];
    })[] = [
      data.chaosDungeon,
      data.guardianRaid,
      data.abyssalDungeon,
      data.abyssRaid,
      data.legionRaid,
    ].map((d) => ({
      id: d?.id ?? "",
      text: { en: d?.nameEn ?? "", ko: d?.nameKo ?? "" },
      tiers:
        d?.tabs.map((t) => ({
          id: t.id,
          text: {
            en: `${t.nameEn}${
              (t as any).difficultyNameEn
                ? ` [${(t as any).difficultyNameEn}]`
                : ""
            }`,
            ko: `${t.nameKo}${
              (t as any).difficultyNameKo
                ? ` [${(t as any).difficultyNameKo}]`
                : ""
            }`,
          },
          stages: t.stages.map((s) => ({
            id: s.id,
            text: { en: s.nameEn, ko: s.nameKo },
          })),
        })) ?? [],
    }));

    const initContentType = contentTypes.find(
      (c) => c.id === contentByType?.contentType?.id
    );

    const initContentTiers = initContentType?.tiers ?? [];
    const initContentTier = initContentTiers.find(
      (c) => c.id === contentByType?.contentTab?.id
    );

    const initContentStages = initContentTier?.stages ?? [];
    const initContentStage = initContentStages.find(
      (c) => c.id === contentByType?.contentStage?.id
    );

    return (
      <div className="mx-auto my-[2.5rem] flex w-[46.875rem] flex-col">
        <div
          style={{
            left: "50vw",
            position: "fixed",
            top: "6.5rem",
            transform: "translate(-50%,0)",
            zIndex: 999,
          }}
        >
          <div
            className="flex rounded-[1.25rem] bg-loa-panel-border py-[1.25rem] px-[1.25rem] transition"
            style={{
              opacity: showPopup ? 1 : 0,
              transform: showPopup ? "" : "translate(0, -1.5rem)",
            }}
          >
            {t("urlCopied", { ns: "routes\\party-find-post\\id" })}
          </div>
        </div>
        <div className="flex">
          <Button
            onClick={() => {
              navigate(-1);
            }}
            style={{
              additionalClass:
                "w-[1.875rem] h-[1.875rem] rounded-full flex items-center justify-center",
              backgroundColorClass: "bg-loa-button",
              cornerRadius: "",
              fontSize: "",
              fontWeight: "",
              lineHeight: "",
              px: "",
              py: "",
              textColorClass: "",
            }}
            text={
              <span className="material-symbols-outlined text-[0.9375rem]">
                navigate_before
              </span>
            }
          />
        </div>
        <div className="mt-[1.25rem] flex items-start gap-[1.5625rem]">
          <div
            className="min-h-[4.0625rem] min-w-[4.0625rem] rounded-full bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${iconPath}')` }}
          ></div>
          <div className="flex flex-grow flex-col items-start">
            <div className="mt-[-0.15625rem] mb-[0.3125rem] max-h-[3.125rem] min-h-[3.125rem] w-full truncate whitespace-normal text-[1.25rem] font-[700] leading-[1.5625rem]">
              {data.partyFindPost.title}
            </div>
            <div className="text-[0.75rem] font-[400] leading-[1.25rem] text-loa-grey">{`${t(
              "lastUpdated",
              {
                ns: "routes\\party-find-post\\id",
              }
            )} ${updatedAtElapsedTimeString} ${updatedAtDateString} ${updatedAtTimeString}`}</div>
          </div>
          {data.user && data.user.id === data.partyFindPost.authorId && (
            <div className="flex gap-[0.625rem]">
              {
                <EditPartyButton
                  backgroundColor="bg-loa-button"
                  contentTypes={contentTypes}
                  initContentType={initContentType}
                  initContentTier={initContentTier}
                  initContentTiers={initContentTiers}
                  initContentStage={initContentStage}
                  initContentStages={initContentStages}
                  initIsPracticeParty={data.partyFindPost.isPracticeParty}
                  initIsReclearParty={data.partyFindPost.isReclearParty}
                  initIsRecurring={data.partyFindPost.recurring}
                  initStartDate={new Date(data.partyFindPost.startTime)
                    .toISOString()
                    .slice(0, -1)}
                  initTitle={data.partyFindPost.title}
                  locale={data.locale}
                  partyFindPostId={data.partyFindPost.id}
                  userId={data.user.id}
                />
              }
              <Button
                onClick={() => {
                  setIsDeleteWarningOpen(true);
                }}
                style={{
                  additionalClass: "",
                  backgroundColorClass: "bg-loa-red",
                  cornerRadius: "0.9375rem",
                  fontSize: "1rem",
                  fontWeight: "500",
                  lineHeight: "1.25rem",
                  px: "0.9375rem",
                  py: "0.9375rem",
                  textColorClass: "text-loa-white",
                }}
                text={t("delete", { ns: "routes\\party-find-post\\id" })}
              />
              <Modal
                closeWhenClickedOutside={allowDeleteWarningToClose}
                isOpened={isDeleteWarningOpen}
                setIsOpened={setIsDeleteWarningOpen}
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
              >
                <div className="flex w-[36.25rem] flex-col gap-[3.125rem] rounded-[1.25rem] bg-loa-panel-border py-[1.875rem] px-[2.1875rem]">
                  <div>
                    <div className="float-right">
                      <div
                        className="material-symbols-outlined flex h-[1.25rem] w-[1.25rem] cursor-pointer items-center justify-center"
                        onClick={() => {
                          setIsDeleteWarningOpen(false);
                        }}
                      >
                        close
                      </div>
                    </div>
                    <div className="text-center text-[1.25rem] font-[700] leading-[1.25rem]">
                      {t("deleteTitle", { ns: "routes\\party-find-post\\id" })}
                    </div>
                  </div>
                  <div className="flex flex-col gap-[1.5625rem]">
                    <div className="w-full whitespace-normal text-[1.25rem] font-[400] leading-[1.25rem]">
                      {t("confirmDelete", {
                        ns: "routes\\party-find-post\\id",
                      })}
                    </div>
                    <Button
                      disabled={!isDeleteButtonEnabled}
                      onClick={() => {
                        if (_isDeleteButtonEnabled) {
                          _isDeleteButtonEnabled = false;
                          setIsDeleteButtonEnabled(false);
                          setAllowDeleteWarningToClose(false);

                          const actionBody: DeleteActionBody = {
                            partyFindPostId: data.partyFindPost?.id ?? "",
                            userId: data.user?.id ?? "",
                          };

                          fetch(
                            `/api/party-find-post/${
                              data.partyFindPost?.id ?? ""
                            }/delete`,
                            {
                              method: "POST",
                              credentials: "same-origin",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify(actionBody),
                            }
                          )
                            .catch(() => {})
                            .finally(() => {
                              navigate("/my-roster/my-posts");
                            });
                        }
                      }}
                      style={{
                        additionalClass: "",
                        backgroundColorClass: "bg-loa-red",
                        cornerRadius: "0.9375rem",
                        disabledBackgroundColorClass: "bg-loa-inactive",
                        disabledTextColorClass: "text-loa-grey",
                        fontSize: "1.25rem",
                        fontWeight: "700",
                        lineHeight: "1.25rem",
                        px: "",
                        py: "1.25rem",
                        textColorClass: "text-loa-white",
                      }}
                      text={t("delete", { ns: "routes\\party-find-post\\id" })}
                    />
                  </div>
                </div>
              </Modal>
            </div>
          )}
        </div>
        <div className="mt-[1.25rem] flex flex-col gap-[1.25rem]">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                if (
                  navigator &&
                  navigator.clipboard &&
                  !showPopup &&
                  window &&
                  window.location
                ) {
                  navigator.clipboard.writeText(window.location.href);
                  setShowPopup(true);
                  setTimeout(() => {
                    setShowPopup(false);
                  }, 2000);
                }
              }}
              style={{
                additionalClass: "flex gap-[0.3125rem] items-center",
                backgroundColorClass: "bg-loa-button-border",
                cornerRadius: "0.3125rem",
                fontSize: "0.75rem",
                fontWeight: "400",
                lineHeight: "1.25rem",
                px: "0.3125rem",
                py: "0.3125rem",
                textColorClass: "text-loa-white",
              }}
              text={
                <>
                  <span className="material-symbols-outlined filled-icon text-[0.9375rem]">
                    share
                  </span>
                  <span>
                    {t("share", { ns: "routes\\party-find-post\\id" })}
                  </span>
                </>
              }
            />
          </div>
          <div className="flex flex-col gap-[1.25rem] rounded-[0.9375rem] bg-loa-panel p-[1.25rem]">
            <div className="text-[1.25rem] font-[700] leading-[1.25rem]">
              {t("basicInfo", { ns: "routes\\party-find-post\\id" })}
            </div>
            <div
              style={{
                columnGap: "2rem",
                display: "grid",
                gridTemplateColumns: "max-content auto max-content auto",
                rowGap: "1rem",
              }}
            >
              <div className="text-[1rem] font-[400] leading-[1.25rem]">
                {t("type", { ns: "routes\\party-find-post\\id" })}
              </div>
              <div className="text-[1rem] font-[700] leading-[1.25rem]">
                {{
                  en: contentByType?.contentType?.nameEn,
                  ko: contentByType?.contentType?.nameKo,
                }[data.locale] ?? ""}
              </div>
              <div className="text-[1rem] font-[400] leading-[1.25rem]">
                {t("partyType", { ns: "routes\\party-find-post\\id" })}
              </div>
              <div className="text-[1rem] font-[700] leading-[1.25rem]">
                {data.partyFindPost.isPracticeParty &&
                  t("practiceParty", { ns: "routes\\party-find-post\\id" })}
                {data.partyFindPost.isReclearParty &&
                  t("reclearParty", { ns: "routes\\party-find-post\\id" })}
              </div>
              <div className="text-[1rem] font-[400] leading-[1.25rem]">
                {t("tier", { ns: "routes\\party-find-post\\id" })}
              </div>
              <div className="text-[1rem] font-[700] leading-[1.25rem]">
                <span>
                  {{
                    en: contentByType?.contentTab?.nameEn,
                    ko: contentByType?.contentTab?.nameKo,
                  }[data.locale] ?? ""}
                </span>
                {contentByType &&
                  contentByType.contentTab &&
                  contentByType.contentTab.difficultyNameEn && (
                    <span
                      className={`${
                        contentByType.contentTab.difficultyNameEn.toLowerCase() ===
                        "normal"
                          ? "text-loa-green"
                          : ""
                      }${
                        contentByType.contentTab.difficultyNameEn.toLowerCase() ===
                        "hard"
                          ? "text-loa-red"
                          : ""
                      }`}
                    >{` [${
                      {
                        en: contentByType.contentTab.difficultyNameEn,
                        ko: contentByType.contentTab.difficultyNameKo,
                      }[data.locale]
                    }]`}</span>
                  )}
              </div>
              <div className="text-[1rem] font-[400] leading-[1.25rem]">
                {t("region", { ns: "routes\\party-find-post\\id" })}
              </div>
              <div className="text-[1rem] font-[700] leading-[1.25rem]">
                {data.partyFindPost.server.region.name}
              </div>
              <div className="text-[1rem] font-[400] leading-[1.25rem]">
                {t("stage", { ns: "routes\\party-find-post\\id" })}
              </div>
              <div className="text-[1rem] font-[700] leading-[1.25rem]">
                {{
                  en: contentByType?.contentStage?.nameEn,
                  ko: contentByType?.contentStage?.nameKo,
                }[data.locale] ?? ""}
              </div>
              <div className="text-[1rem] font-[400] leading-[1.25rem]">
                {t("schedule", { ns: "routes\\party-find-post\\id" })}
              </div>
              <div className="text-[1rem] font-[700] leading-[1.25rem]">
                <div>
                  {data.partyFindPost.recurring
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
                          ][startTime.getDay()],
                          { ns: "routes\\tools\\party-finder" }
                        )} `}</span>,
                        <span key={3}>{`${startTimeString}`}</span>,
                      ]
                    : [
                        <span
                          className="whitespace-pre"
                          key={1}
                        >{`${startDateString}  `}</span>,
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
                            ][startTime.getDay()],
                            { ns: "routes\\tools\\party-finder" }
                          )}  `}
                        </span>,
                        <span key={3}>{startTimeString}</span>,
                      ]}
                </div>
                <div>
                  {data.partyFindPost.recurring
                    ? putFromAndToOnRight.includes(data.locale)
                      ? `${startDateString} ${t("from", {
                          ns: "routes\\party-find-post\\id",
                        })}`
                      : `${t("from", {
                          ns: "routes\\party-find-post\\id",
                        })} ${startDateString}`
                    : ``}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-[1.25rem] rounded-[0.9375rem] bg-loa-panel p-[1.25rem]">
            <div className="text-[1.25rem] font-[700] leading-[1.25rem]">
              {t("partyMembers", { ns: "routes\\party-find-post\\id" })}
            </div>
            <div
              style={{
                columnGap: "1.25rem",
                display: "grid",
                gridTemplateColumns:
                  "max-content max-content max-content max-content",
                rowGap: "0.3125rem",
              }}
            >
              {data.partyFindPost.partyFindSlots
                .filter(
                  (s) => s.partyFindApplyState && s.partyFindApplyState.id
                )
                .map((s, index) => {
                  if (!s.partyFindApplyState || !s.partyFindApplyState.id)
                    return [];

                  return [
                    <div className="relative flex shrink-0" key={index * 4}>
                      <div
                        className={`${
                          getJobTypeFromJob(
                            s.partyFindApplyState.character.job
                          ) === JobType.SUPPORT
                            ? "border-loa-green"
                            : "border-loa-red"
                        } rounded-full border-2 p-[0.125rem]`}
                      >
                        <div
                          className="h-[1.5625rem] w-[1.5625rem] rounded-full bg-contain bg-center bg-no-repeat"
                          style={{
                            backgroundImage: `url('${generateJobIconPath(
                              s.partyFindApplyState.character.job
                            )}')`,
                          }}
                        />
                      </div>
                      {data.partyFindPost &&
                        s.partyFindApplyState.character.roster.userId ===
                          data.partyFindPost.authorId && (
                          <div className="material-symbols-outlined absolute right-[-5px] top-[-5px] text-[1.125rem] text-loa-party-leader-star">
                            star
                          </div>
                        )}
                    </div>,
                    <div
                      className="flex items-center justify-start text-[0.9375rem] font-[500] leading-[1.25rem]"
                      key={index * 4 + 1}
                    >
                      {s.partyFindApplyState.character.name}
                    </div>,
                    <div
                      className="flex items-center justify-start text-[0.9375rem] font-[500] leading-[1.25rem]"
                      key={index * 4 + 2}
                    >
                      {t(s.partyFindApplyState.character.job, {
                        ns: "dictionary\\job",
                      })}
                    </div>,
                    <div
                      className="flex items-center justify-start text-[0.9375rem] font-[500] leading-[1.25rem]"
                      key={index * 4 + 3}
                    >
                      {`LV.${s.partyFindApplyState.character.itemLevel.toFixed(
                        2
                      )}`}
                    </div>,
                  ];
                })}
            </div>
          </div>
          {data.user &&
            applyText !== "author" && [
              <Button
                disabled={applyDisabled}
                key={1}
                onClick={() => {
                  if (applyText === "apply" || applyText === "leave")
                    setIsApplyModalOpen(true);
                }}
                style={{
                  additionalClass: "",
                  backgroundColorClass: applyColor,
                  cornerRadius: "0.9375rem",
                  disabledBackgroundColorClass: "bg-loa-inactive",
                  disabledTextColorClass: "text-loa-grey",
                  fontSize: "1.25rem",
                  fontWeight: "700",
                  lineHeight: "1.25rem",
                  px: "",
                  py: "1.25rem",
                  textColorClass: "text-loa-white",
                }}
                text={t(applyText, { ns: "routes\\party-find-post\\id" })}
              />,
              applyText === "apply" && (
                <Modal
                  closeWhenClickedOutside={allowApplyModalToClose}
                  isOpened={applyText === "apply" && isApplyModalOpen}
                  key={2}
                  setIsOpened={setIsApplyModalOpen}
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                >
                  <div className="flex w-[36.25rem] flex-col gap-[3.125rem] overflow-visible rounded-[1.25rem] bg-loa-panel-border py-[1.875rem] px-[2.1875rem]">
                    <div>
                      <div className="float-right">
                        <div
                          className="material-symbols-outlined flex h-[1.25rem] w-[1.25rem] cursor-pointer items-center justify-center"
                          onClick={() => {
                            setIsApplyModalOpen(false);
                          }}
                        >
                          close
                        </div>
                      </div>
                      <div className="text-center text-[1.25rem] font-[700] leading-[1.25rem]">
                        {t("characterSelectTitle", {
                          ns: "routes\\party-find-post\\id",
                        })}
                      </div>
                    </div>
                    <div className="flex flex-col gap-[1.5625rem]">
                      <div className="w-full whitespace-normal">
                        <div className="w-full text-[1.25rem] font-[400] leading-[1.25rem]">
                          {t("characterSelectMessage", {
                            ns: "routes\\party-find-post\\id",
                          })}
                        </div>
                        <div className="w-full text-[0.875rem] font-[400] leading-[1.25rem]">
                          {t("characterSelectRegionMessage", {
                            ns: "routes\\party-find-post\\id",
                          })}
                        </div>
                      </div>
                      <Dropdown
                        invalid={!character}
                        items={characters}
                        locale={data.locale}
                        onChange={setCharacter}
                        selected={character}
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
                            invalid: {
                              outlineColorClass: "outline-loa-red",
                              outlineWidth: "0.175rem",
                            },
                            lineHeight: "1.25rem",
                            px: "1.25rem",
                            py: "0.625rem",
                          },
                        }}
                      />
                      <Button
                        disabled={!character || !isApplyModalButtonEnabled}
                        onClick={() => {
                          if (
                            _isApplyModalButtonEnabled &&
                            character &&
                            data.partyFindPost
                          ) {
                            _isApplyModalButtonEnabled = false;
                            setIsApplyModalButtonEnabled(false);
                            setAllowApplyModalToClose(false);

                            const actionBody: ApplyActionBody = {
                              characterId: character.id ?? "",
                              partyFindPostId: data.partyFindPost.id ?? "",
                              userId: data.user?.id ?? "",
                            };

                            fetch(
                              `/api/party-find-post/${
                                data.partyFindPost?.id ?? ""
                              }/apply`,
                              {
                                method: "POST",
                                credentials: "same-origin",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(actionBody),
                              }
                            )
                              .catch(() => {})
                              .finally(() => {
                                setIsApplyModalOpen(false);
                                _isApplyModalButtonEnabled = true;
                                setIsApplyModalButtonEnabled(true);
                                setAllowApplyModalToClose(true);

                                if (data.partyFindPost) {
                                  navigate(
                                    `/party-find-post/${data.partyFindPost.id}`
                                  );
                                } else {
                                  navigate("/");
                                }
                              });
                          }
                        }}
                        style={{
                          additionalClass: "",
                          backgroundColorClass: "bg-loa-green",
                          cornerRadius: "0.9375rem",
                          disabledBackgroundColorClass: "bg-loa-inactive",
                          disabledTextColorClass: "text-loa-grey",
                          fontSize: "1.25rem",
                          fontWeight: "700",
                          lineHeight: "1.25rem",
                          px: "",
                          py: "1.25rem",
                          textColorClass: "text-loa-white",
                        }}
                        text={t("apply", { ns: "routes\\party-find-post\\id" })}
                      />
                    </div>
                  </div>
                </Modal>
              ),
              applyText === "leave" &&
                userApplyState &&
                userApplyState.state === PartyFindApplyStateValue.ACCEPTED && (
                  <Modal
                    closeWhenClickedOutside={allowApplyModalToClose}
                    isOpened={applyText === "leave" && isApplyModalOpen}
                    key={3}
                    setIsOpened={setIsApplyModalOpen}
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                  >
                    <div className="flex w-[36.25rem] flex-col gap-[3.125rem] overflow-visible rounded-[1.25rem] bg-loa-panel-border py-[1.875rem] px-[2.1875rem]">
                      <div>
                        <div className="float-right">
                          <div
                            className="material-symbols-outlined flex h-[1.25rem] w-[1.25rem] cursor-pointer items-center justify-center"
                            onClick={() => {
                              setIsApplyModalOpen(false);
                            }}
                          >
                            close
                          </div>
                        </div>
                        <div className="text-center text-[1.25rem] font-[700] leading-[1.25rem]">
                          {t("leaveTitle", {
                            ns: "routes\\party-find-post\\id",
                          })}
                        </div>
                      </div>
                      <div className="flex flex-col gap-[1.5625rem]">
                        <div className="flex items-center justify-center gap-[0.3125rem] truncate text-[1.5rem] font-[700] leading-[1.875rem]">
                          <div className="text-loa-party-leader-star">
                            {t(userApplyState.character.job, {
                              ns: "dictionary\\job",
                            })}
                          </div>
                          <span>{userApplyState.character.name}</span>
                        </div>
                        <div className="w-full whitespace-normal text-[1.25rem] font-[400] leading-[1.25rem]">
                          {t("leaveMessage", {
                            ns: "routes\\party-find-post\\id",
                          })}
                        </div>
                        <Button
                          disabled={!isApplyModalButtonEnabled}
                          onClick={() => {
                            if (
                              _isApplyModalButtonEnabled &&
                              data.partyFindPost
                            ) {
                              _isApplyModalButtonEnabled = false;
                              setIsApplyModalButtonEnabled(false);
                              setAllowApplyModalToClose(false);

                              const actionBody: LeaveActionBody = {
                                characterId: userApplyState.character.id,
                                partyFindPostId: data.partyFindPost.id ?? "",
                                userId: data.user?.id ?? "",
                              };

                              fetch(
                                `/api/party-find-post/${
                                  data.partyFindPost?.id ?? ""
                                }/leave`,
                                {
                                  method: "POST",
                                  credentials: "same-origin",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify(actionBody),
                                }
                              )
                                .catch(() => {})
                                .finally(() => {
                                  setIsApplyModalOpen(false);
                                  _isApplyModalButtonEnabled = true;
                                  setIsApplyModalButtonEnabled(true);
                                  setAllowApplyModalToClose(true);

                                  if (data.partyFindPost) {
                                    navigate(
                                      `/party-find-post/${data.partyFindPost.id}`
                                    );
                                  } else {
                                    navigate("/");
                                  }
                                });
                            }
                          }}
                          style={{
                            additionalClass: "",
                            backgroundColorClass: "bg-loa-red",
                            cornerRadius: "0.9375rem",
                            disabledBackgroundColorClass: "bg-loa-inactive",
                            disabledTextColorClass: "text-loa-grey",
                            fontSize: "1.25rem",
                            fontWeight: "700",
                            lineHeight: "1.25rem",
                            px: "",
                            py: "1.25rem",
                            textColorClass: "text-loa-white",
                          }}
                          text={t("leave", {
                            ns: "routes\\party-find-post\\id",
                          })}
                        />
                      </div>
                    </div>
                  </Modal>
                ),
            ]}
        </div>
      </div>
    );
  }

  return <div></div>;
}
