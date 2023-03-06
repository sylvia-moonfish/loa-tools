import type {
  Character,
  Content,
  ContentStage,
  ContentTab,
  Engraving,
  EngravingSlot,
  PartyFindApplyState,
  PartyFindPost,
  PartyFindSlot,
  Region,
  Roster,
  Server,
  User,
} from "@prisma/client";
import type { ItemType } from "~/components/dropdown";
import type { ActionBody as DeleteActionBody } from "~/routes/api/party-find-post/$id/delete";
import type { LocaleType } from "~/i18n";
import { PartyFindApplyStateValue, PartyFindPostState } from "@prisma/client";
import { Link, useNavigate } from "@remix-run/react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import EditPartyButton from "~/components/tools/party-finder/edit-party-button";
import CharacterRow from "~/components/my-roster/my-posts/character-row";
import Button from "~/components/button";
import Modal from "~/components/modal";
import {
  generateProperLocaleDateString,
  getColorCodeFromDifficulty,
  getJobTypeFromJob,
  printTime,
  putFromAndToOnRight,
} from "~/utils";

export type _Character = {
  id: Character["id"];
  name: Character["name"];
  job: Character["job"];
  itemLevel: Character["itemLevel"];
  roster: {
    id: Roster["id"];
    user: {
      id: User["id"];
      discordId: User["discordId"];
      discordUsername: User["discordUsername"];
      discordDiscriminator: User["discordDiscriminator"];
    };
  };
  engravingSlots: {
    id: EngravingSlot["id"];
    index: EngravingSlot["index"];
    level: EngravingSlot["level"];
    engraving: {
      id: Engraving["id"];
      nameEn: Engraving["nameEn"];
      nameKo: Engraving["nameKo"];
      iconPath: Engraving["iconPath"];
    };
  }[];
};

export type _ApplyState = {
  id: PartyFindApplyState["id"];
  state: PartyFindApplyState["state"];
  character: _Character;
};

export type _PartyFindSlot = {
  id: PartyFindSlot["id"];
  index: PartyFindSlot["index"];
  jobType: PartyFindSlot["jobType"];
  partyFindApplyState: _ApplyState | null;
};

export default function ExpandablePanel(props: {
  contentTypes: (ItemType & { tiers: (ItemType & { stages: ItemType[] })[] })[];
  loading: boolean;
  locale: LocaleType;
  partyFindPost: {
    id: PartyFindPost["id"];

    state: PartyFindPost["state"];
    isPracticeParty: PartyFindPost["isPracticeParty"];
    isReclearParty: PartyFindPost["isReclearParty"];
    contentType: PartyFindPost["contentType"];
    startTime: PartyFindPost["startTime"];
    recurring: PartyFindPost["recurring"];
    title: PartyFindPost["title"];

    contentStage: {
      id: ContentStage["id"];
      nameEn: ContentStage["nameEn"];
      nameKo: ContentStage["nameKo"];
      contentTab: {
        id: ContentTab["id"];
        nameEn: ContentTab["nameEn"];
        nameKo: ContentTab["nameKo"];
        difficultyNameEn: ContentTab["difficultyNameEn"];
        difficultyNameKo: ContentTab["difficultyNameKo"];
        content: {
          id: Content["id"];
          nameEn: Content["nameEn"];
          nameKo: Content["nameKo"];
        };
      };
    };

    authorId: PartyFindPost["authorId"];
    server: {
      id: Server["id"];
      region: { id: Region["id"]; shortName: Region["shortName"] };
    };

    partyFindSlots: _PartyFindSlot[];

    applyStates: _ApplyState[];
  };
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string;
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const startDate = new Date(props.partyFindPost.startTime);
  const startDateString = generateProperLocaleDateString(
    props.locale,
    startDate
  );
  const startTimeString = printTime(
    startDate.getHours(),
    startDate.getMinutes()
  );

  let statusColor: "bg-loa-green" | "bg-loa-red" | "bg-loa-button" =
    "bg-loa-button";

  if (startDate <= new Date()) {
    props.partyFindPost.state = PartyFindPostState.EXPIRED;
    statusColor = "bg-loa-red";
  } else {
    switch (props.partyFindPost.state) {
      case PartyFindPostState.RECRUITING:
        statusColor = "bg-loa-button";
        break;
      case PartyFindPostState.FULL:
        statusColor = "bg-loa-green";
        break;
      case PartyFindPostState.RERECRUITING:
        statusColor = "bg-loa-button";
        break;
      case PartyFindPostState.EXPIRED:
        statusColor = "bg-loa-red";
        break;
    }
  }

  const initContentType = props.contentTypes.find(
    (c) => c.id === props.partyFindPost.contentStage.contentTab.content.id
  );

  const initContentTiers = initContentType?.tiers ?? [];
  const initContentTier = initContentTiers.find(
    (c) => c.id === props.partyFindPost.contentStage.contentTab.id
  );

  const initContentStages = initContentTier?.stages ?? [];
  const initContentStage = initContentStages.find(
    (c) => c.id === props.partyFindPost.contentStage.id
  );

  const [isOpened, setIsOpened] = React.useState(false);

  const [isDeleteWarningOpen, setIsDeleteWarningOpen] = React.useState(false);
  const [allowDeleteWarningToClose, setAllowDeleteWarningToClose] =
    React.useState(true);
  const [isDeleteButtonEnabled, setIsDeleteButtonEnabled] =
    React.useState(true);

  return (
    <div className="relative">
      <div
        className="absolute flex max-h-[6.25rem] min-h-[6.25rem] w-full cursor-pointer gap-[1.25rem] rounded-[0.9375rem] bg-loa-panel p-[1.25rem]"
        onClick={() => {
          setIsOpened(!isOpened);
        }}
        style={{ zIndex: 2 }}
      >
        <div className="flex w-[9.25rem] flex-col">
          <div className="h-[2.5rem] overflow-hidden whitespace-normal text-[0.9375rem] font-[700] leading-[1.25rem]">
            {
              {
                en: props.partyFindPost.contentStage.contentTab.content.nameEn,
                ko: props.partyFindPost.contentStage.contentTab.content.nameKo,
              }[props.locale]
            }
          </div>
          <div className="text-[0.9375rem] font-[500] leading-[1.25rem]">
            {props.partyFindPost.isPracticeParty &&
              t("practiceParty", { ns: "routes\\tools\\party-finder" })}
            {props.partyFindPost.isReclearParty &&
              t("reclearParty", { ns: "routes\\tools\\party-finder" })}
          </div>
        </div>
        <div className="flex w-[10.75rem] flex-col">
          <div className="h-[2.5rem] overflow-hidden whitespace-normal text-[0.9375rem] font-[700] leading-[1.25rem]">
            <span>
              {
                {
                  en: props.partyFindPost.contentStage.contentTab.nameEn,
                  ko: props.partyFindPost.contentStage.contentTab.nameKo,
                }[props.locale]
              }
            </span>
            {props.partyFindPost.contentStage.contentTab.difficultyNameEn && (
              <span
                className={getColorCodeFromDifficulty(
                  props.partyFindPost.contentStage.contentTab.difficultyNameEn
                )}
              >{` [${
                {
                  en: props.partyFindPost.contentStage.contentTab
                    .difficultyNameEn,
                  ko: props.partyFindPost.contentStage.contentTab
                    .difficultyNameKo,
                }[props.locale]
              }]`}</span>
            )}
          </div>
          <div className="truncate text-[0.9375rem] font-[500] leading-[1.25rem]">
            {
              {
                en: props.partyFindPost.contentStage.nameEn,
                ko: props.partyFindPost.contentStage.nameKo,
              }[props.locale]
            }
          </div>
        </div>
        <div className="flex flex-col">
          <div className="text-[0.9375rem] font-[400] leading-[1.25rem]">
            {props.partyFindPost.recurring
              ? [
                  <span key={1}>{`${t("every", {
                    ns: "routes\\tools\\party-finder",
                  })} `}</span>,
                  <span className="text-loa-party-leader-star" key={2}>{`${t(
                    [
                      "sunFilter",
                      "monFilter",
                      "tueFilter",
                      "wedFilter",
                      "thuFilter",
                      "friFilter",
                      "satFilter",
                    ][startDate.getDay()],
                    { ns: "routes\\tools\\party-finder" }
                  )} `}</span>,
                  <span key={3}>{startTimeString}</span>,
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
                      ][startDate.getDay()],
                      { ns: "routes\\tools\\party-finder" }
                    )}  `}
                  </span>,
                  <span key={3}>{startTimeString}</span>,
                ]}
          </div>
          <div className="min-h-[1.25rem] text-[0.9375rem] font-[400] leading-[1.25rem]">
            {props.partyFindPost.recurring
              ? putFromAndToOnRight.includes(props.locale)
                ? `${startDateString} ${t("from", {
                    ns: "routes\\tools\\party-finder",
                  })}`
                : `${t("from", {
                    ns: "routes\\tools\\party-finder",
                  })} ${startDateString}`
              : ``}
          </div>
          <div className="flex items-center justify-between gap-[0.5rem] text-[0.9375rem] font-[500] leading-[1.25rem]">
            <span className="text-loa-green">{`${t("average", {
              ns: "routes\\tools\\party-finder",
            })} ${(
              props.partyFindPost.partyFindSlots.reduce(
                (prev, current) =>
                  prev +
                  (current.partyFindApplyState && current.partyFindApplyState.id
                    ? current.partyFindApplyState.character.itemLevel
                    : 0),
                0
              ) /
              props.partyFindPost.partyFindSlots.filter(
                (s) => s.partyFindApplyState && s.partyFindApplyState.id
              ).length
            ).toFixed(0)} `}</span>
            <span className="text-loa-pink">
              {props.partyFindPost.server.region.shortName}
            </span>
          </div>
        </div>
        <div className="flex flex-grow"></div>
        <div className="flex items-center justify-center">
          <div
            className={`${statusColor} rounded-[0.625rem] p-[0.9375rem] text-[1rem] font-[500] leading-[1.25rem]`}
          >
            {t(props.partyFindPost.state, {
              ns: "dictionary\\party-find-post-state",
            })}
          </div>
        </div>
      </div>
      <div
        className="flex flex-col rounded-[0.9375rem] bg-loa-button"
        style={{
          maxHeight: isOpened ? "56.25rem" : "6.25rem",
          overflow: "hidden",
          transitionDuration: "200ms",
          transitionProperty: "max-height",
          transitionTimingFunction: "ease-in-out",
          paddingTop: "6.25rem",
          zIndex: 1,
        }}
      >
        <div className="py-[1.25rem] px-[1.875rem]">
          <div className="flex flex-col gap-[0.9375rem]">
            <div className="text-[0.9375rem] font-[500] leading-[1.25rem]">
              {t("partyMemberList", {
                ns: "components\\my-roster\\expandable-panel",
              })}
            </div>
            <div className="flex flex-col gap-[0.3125rem] rounded-[0.9375rem] bg-loa-panel p-[0.9375rem]">
              <div className="text-[0.9375rem] font-[500] leading-[1.25rem]">
                {t("party1Title", {
                  ns: "components\\my-roster\\expandable-panel",
                })}
              </div>
              <div className="flex flex-col gap-[0.3125rem]">
                {props.partyFindPost.partyFindSlots
                  .filter((s) => s.index <= 4)
                  .sort((a, b) => a.index - b.index)
                  .map((s, index) => {
                    return (
                      <CharacterRow
                        character={
                          s.partyFindApplyState?.character ?? undefined
                        }
                        isAuthor={
                          s.partyFindApplyState?.character.roster.user.id ===
                          props.partyFindPost.authorId
                        }
                        isWaitlist={false}
                        jobType={s.jobType}
                        key={index}
                        loading={props.loading}
                        partyFindPostId={props.partyFindPost.id}
                        partyFindSlot={s}
                        printEngravings={false}
                        setLoading={props.setLoading}
                        userId={props.userId}
                      />
                    );
                  })}
              </div>
              {props.partyFindPost.partyFindSlots.length > 4 && [
                <hr
                  className="border-dashed border-loa-button"
                  key="separator"
                />,
                <div
                  className="text-[0.9375rem] font-[500] leading-[1.25rem]"
                  key="party2Title"
                >
                  {t("party2Title", {
                    ns: "components\\my-roster\\expandable-panel",
                  })}
                </div>,
                <div
                  className="flex flex-col gap-[0.3125rem]"
                  key="party2Panel"
                >
                  {props.partyFindPost.partyFindSlots
                    .filter((s) => s.index > 4)
                    .sort((a, b) => a.index - b.index)
                    .map((s, index) => {
                      return (
                        <CharacterRow
                          character={
                            s.partyFindApplyState?.character ?? undefined
                          }
                          isAuthor={
                            s.partyFindApplyState?.character.roster.user.id ===
                            props.partyFindPost.authorId
                          }
                          isWaitlist={false}
                          jobType={s.jobType}
                          key={index}
                          loading={props.loading}
                          partyFindPostId={props.partyFindPost.id}
                          partyFindSlot={s}
                          printEngravings={false}
                          setLoading={props.setLoading}
                          userId={props.userId}
                        />
                      );
                    })}
                </div>,
              ]}
            </div>
            <div>
              {t("waitList", {
                ns: "components\\my-roster\\expandable-panel",
              })}
            </div>
            <div
              className="flex flex-col gap-[0.3125rem] rounded-[0.9375rem] bg-loa-panel p-[0.9375rem]"
              style={{
                maxHeight: "11.9375rem",
                overflowX: "hidden",
                overflowY: "auto",
              }}
            >
              {props.partyFindPost.applyStates
                .filter((a) => a.state === PartyFindApplyStateValue.WAITING)
                .map((a, index) => {
                  return (
                    <CharacterRow
                      character={a.character}
                      isAuthor={
                        a.character.roster.user.id ===
                        props.partyFindPost.authorId
                      }
                      isWaitlist={true}
                      jobType={getJobTypeFromJob(a.character.job)}
                      key={index}
                      loading={props.loading}
                      printEngravings={true}
                      partyFindPostId={props.partyFindPost.id}
                      setLoading={props.setLoading}
                      userId={props.userId}
                    />
                  );
                })}
            </div>
            <div
              style={{
                columnGap: "0.9375rem",
                display: "grid",
                gridTemplateColumns:
                  "minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)",
              }}
            >
              <Link to={`/party-find-post/${props.partyFindPost.id}`}>
                <Button
                  style={{
                    additionalClass: "",
                    backgroundColorClass: "bg-loa-panel",
                    cornerRadius: "0.9375rem",
                    fontSize: "1rem",
                    fontWeight: "500",
                    lineHeight: "1.25rem",
                    px: "1.875rem",
                    py: "0.9375rem",
                    textColorClass: "text-loa-white",
                  }}
                  text={t("detailPage", {
                    ns: "components\\my-roster\\expandable-panel",
                  })}
                />
              </Link>
              {props.partyFindPost.state === PartyFindPostState.EXPIRED ? (
                <div></div>
              ) : (
                <EditPartyButton
                  backgroundColor="bg-loa-green"
                  contentTypes={props.contentTypes}
                  initContentType={initContentType}
                  initContentTier={initContentTier}
                  initContentTiers={initContentTiers}
                  initContentStage={initContentStage}
                  initContentStages={initContentStages}
                  initIsPracticeParty={props.partyFindPost.isPracticeParty}
                  initIsReclearParty={props.partyFindPost.isReclearParty}
                  initIsRecurring={props.partyFindPost.recurring}
                  initStartDate={new Date(props.partyFindPost.startTime)
                    .toISOString()
                    .slice(0, -1)}
                  initTitle={props.partyFindPost.title}
                  locale={props.locale}
                  partyFindPostId={props.partyFindPost.id}
                  userId={props.userId}
                />
              )}
              <div>
                <Button
                  disabled={props.loading}
                  onClick={() => {
                    if (!props.loading) {
                      setIsDeleteWarningOpen(true);
                    }
                  }}
                  style={{
                    additionalClass: "",
                    backgroundColorClass: "bg-loa-red",
                    cornerRadius: "0.9375rem",
                    disabledBackgroundColorClass: "bg-loa-inactive",
                    disabledTextColorClass: "text-loa-grey",
                    fontSize: "1rem",
                    fontWeight: "500",
                    lineHeight: "1.25rem",
                    px: "1.875rem",
                    py: "0.9375rem",
                    textColorClass: "text-loa-white",
                  }}
                  text={t("delete", {
                    ns: "components\\my-roster\\expandable-panel",
                  })}
                />
                <Modal
                  closeWhenClickedOutside={allowDeleteWarningToClose}
                  isOpened={!props.loading && isDeleteWarningOpen}
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
                        {t("deleteTitle", {
                          ns: "components\\my-roster\\expandable-panel",
                        })}
                      </div>
                    </div>
                    <div className="flex flex-col gap-[1.5625rem]">
                      <div className="w-full whitespace-normal text-[1.25rem] font-[400] leading-[1.25rem]">
                        {t("confirmDelete", {
                          ns: "components\\my-roster\\expandable-panel",
                        })}
                      </div>
                      <Button
                        disabled={!isDeleteButtonEnabled}
                        onClick={() => {
                          if (isDeleteButtonEnabled && !props.loading) {
                            setIsDeleteButtonEnabled(false);
                            setAllowDeleteWarningToClose(false);
                            props.setLoading(true);

                            const actionBody: DeleteActionBody = {
                              partyFindPostId: props.partyFindPost.id,
                              userId: props.userId,
                            };

                            fetch(
                              `/api/party-find-post/${props.partyFindPost.id}/delete`,
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
                                props.setLoading(false);
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
                        text={t("delete", {
                          ns: "components\\my-roster\\expandable-panel",
                        })}
                      />
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
