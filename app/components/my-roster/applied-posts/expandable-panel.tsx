import type {
  Character,
  Content,
  ContentStage,
  ContentTab,
  PartyFindApplyState,
  PartyFindPost,
} from "@prisma/client";
import type { LocaleType } from "~/i18n";
import { PartyFindApplyStateValue } from "@prisma/client";
import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import {
  generateProperLocaleDateString,
  getColorCodeFromDifficulty,
  printTime,
  putFromAndToOnRight,
} from "~/utils";

export default function ExpandablePanel(props: {
  applyState: {
    id: PartyFindApplyState["id"];
    state: PartyFindApplyState["state"];
    character: {
      id: Character["id"];
      name: Character["name"];
      job: Character["job"];
    };
  };
  locale: LocaleType;
  partyFindPost: {
    id: PartyFindPost["id"];
    contentType: PartyFindPost["contentType"];
    startTime: PartyFindPost["startTime"];
    recurring: PartyFindPost["recurring"];
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
  };
}) {
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
    props.applyState.state = PartyFindApplyStateValue.EXPIRED;
    statusColor = "bg-loa-red";
  } else {
    switch (props.applyState.state) {
      case PartyFindApplyStateValue.WAITING:
        statusColor = "bg-loa-button";
        break;
      case PartyFindApplyStateValue.ACCEPTED:
        statusColor = "bg-loa-green";
        break;
      case PartyFindApplyStateValue.REJECTED:
        statusColor = "bg-loa-red";
        break;
      case PartyFindApplyStateValue.EXPIRED:
        statusColor = "bg-loa-red";
        break;
      case PartyFindApplyStateValue.DELETED:
        statusColor = "bg-loa-red";
        break;
    }
  }

  return (
    <div className="relative">
      <Link
        className="flex w-full cursor-pointer gap-[1.25rem] rounded-[0.9375rem] bg-loa-panel p-[1.25rem]"
        to={`/party-find-post/${props.partyFindPost.id}`}
      >
        <div className="flex w-[15.6875rem] flex-col">
          <div className="overflow-hidden whitespace-normal text-[0.9375rem] font-[700] leading-[1.25rem]">
            {t(props.applyState.character.job, { ns: "dictionary\\job" })}
          </div>
          <div className="overflow-hidden whitespace-normal text-[0.9375rem] font-[700] leading-[1.25rem]">
            {props.applyState.character.name}
          </div>
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
        </div>
        <div className="flex flex-grow flex-col">
          <div className="overflow-hidden whitespace-normal text-[0.9375rem] font-[400] leading-[1.25rem]">
            {
              {
                en: props.partyFindPost.contentStage.contentTab.content.nameEn,
                ko: props.partyFindPost.contentStage.contentTab.content.nameKo,
              }[props.locale]
            }
          </div>
          <div className="overflow-hidden whitespace-normal text-[0.9375rem] font-[400] leading-[1.25rem]">
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
          <div className="truncate text-[0.9375rem] font-[400] leading-[1.25rem]">
            {
              {
                en: props.partyFindPost.contentStage.nameEn,
                ko: props.partyFindPost.contentStage.nameKo,
              }[props.locale]
            }
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div
            className={`${statusColor} rounded-[0.625rem] p-[0.9375rem] text-[1rem] font-[500] leading-[1.25rem]`}
          >
            {t(props.applyState.state, {
              ns: "dictionary\\party-find-apply-state-value",
            })}
          </div>
        </div>
      </Link>
    </div>
  );
}
