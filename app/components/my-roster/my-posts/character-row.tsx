import type {
  _Character,
  _PartyFindSlot,
} from "~/components/my-roster/my-posts/expandable-panel";
import type { ActionBody as ApproveActionBody } from "~/routes/api/party-find-post/$id/approve";
import type { ActionBody as DenyActionBody } from "~/routes/api/party-find-post/$id/deny";
import type { ActionBody as KickActionBody } from "~/routes/api/party-find-post/$id/kick";
import { JobType } from "@prisma/client";
import { Link, useNavigate } from "@remix-run/react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import Button from "~/components/button";
import { generateJobIconPath, getJobTypeFromJob } from "~/utils";

export default function CharacterRow(props: {
  character: _Character | undefined;
  isAuthor: boolean;
  isWaitlist: boolean;
  jobType: JobType;
  loading: boolean;
  partyFindPostId: string;
  partyFindSlot?: _PartyFindSlot;
  printEngravings: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string;
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (props.character) {
    return (
      <Link
        className="flex gap-[1.25rem] rounded-[0.9375rem] transition hover:bg-loa-button"
        to={`/character/${props.character.id}`}
      >
        <div className="relative">
          <div
            className={`${
              getJobTypeFromJob(props.character.job) === JobType.SUPPORT
                ? "border-loa-green"
                : "border-loa-red"
            } rounded-full border-2 p-[0.125rem]`}
          >
            <div
              className="h-[1.5625rem] w-[1.5625rem] rounded-full bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('${generateJobIconPath(
                  props.character.job
                )}')`,
              }}
            />
          </div>
          {props.partyFindSlot && props.isAuthor && (
            <div className="material-symbols-outlined absolute right-[-5px] top-[-5px] text-[1.125rem] text-loa-party-leader-star">
              star
            </div>
          )}
        </div>
        <div className="flex items-center justify-start text-[0.9375rem] font-[500] leading-[1.25rem]">
          {props.character.name}
        </div>
        <div className="flex items-center justify-start text-[0.9375rem] font-[500] leading-[1.25rem]">
          {t(props.character.job, { ns: "dictionary\\job" })}
        </div>
        <div className="flex items-center justify-start text-[0.9375rem] font-[500] leading-[1.25rem]">
          {`LV.${props.character.itemLevel.toFixed(0)}`}
        </div>
        {!props.printEngravings && (
          <div className="flex items-center justify-start text-[0.9375rem] font-[500] leading-[1.25rem]">
            {`(${props.character.roster.user.discordUsername}#${props.character.roster.user.discordDiscriminator})`}
          </div>
        )}
        {props.printEngravings && (
          <div className="flex flex-grow items-center justify-start gap-[0.625rem] overflow-hidden">
            {props.character.engravingSlots
              .sort((a, b) => a.index - b.index)
              .map((s, index) => {
                return (
                  <div
                    className="min-h-[1.6875rem] min-w-[1.6875rem] rounded-full bg-contain bg-center bg-no-repeat"
                    key={index}
                    style={{
                      backgroundColor: s.engraving ? "" : "#2d2d3a",
                      backgroundImage: s.engraving
                        ? `url('${s.engraving.iconPath}')`
                        : "",
                    }}
                  ></div>
                );
              })}
          </div>
        )}
        {props.isWaitlist && (
          <div
            className="flex shrink-0"
            onClick={(e) => {
              e.preventDefault();
            }}
            style={{
              columnGap: "1.25rem",
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            }}
          >
            <Button
              disabled={props.loading}
              onClick={() => {
                if (!props.loading) {
                  props.setLoading(true);

                  const actionBody: ApproveActionBody = {
                    characterId: props.character?.id ?? "",
                    partyFindPostId: props.partyFindPostId,
                    userId: props.userId,
                  };

                  fetch(
                    `/api/party-find-post/${props.partyFindPostId}/approve`,
                    {
                      method: "POST",
                      credentials: "same-origin",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(actionBody),
                    }
                  )
                    .then((response) => response.json())
                    .catch(() => {})
                    .finally(() => {
                      props.setLoading(false);
                      navigate("/my-roster/my-posts");
                    });
                }
              }}
              style={{
                additionalClass: "",
                backgroundColorClass: "bg-loa-green",
                cornerRadius: "0.625rem",
                disabledBackgroundColorClass: "bg-loa-inactive",
                disabledTextColorClass: "text-loa-grey",
                fontSize: "0.8125rem",
                fontWeight: "500",
                lineHeight: "1.25rem",
                px: "0.625rem",
                py: "0.3125rem",
                textColorClass: "text-loa-white",
              }}
              text={t("approve", {
                ns: "components\\my-roster\\expandable-panel",
              })}
            />
            <Button
              onClick={() => {
                if (!props.loading) {
                  props.setLoading(true);

                  const actionBody: DenyActionBody = {
                    characterId: props.character?.id ?? "",
                    partyFindPostId: props.partyFindPostId,
                    userId: props.userId,
                  };

                  fetch(`/api/party-find-post/${props.partyFindPostId}/deny`, {
                    method: "POST",
                    credentials: "same-origin",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(actionBody),
                  })
                    .then((response) => response.json())
                    .catch(() => {})
                    .finally(() => {
                      props.setLoading(false);
                      navigate("/my-roster/my-posts");
                    });
                }
              }}
              disabled={props.loading}
              style={{
                additionalClass: "",
                backgroundColorClass: "bg-loa-red",
                cornerRadius: "0.625rem",
                disabledBackgroundColorClass: "bg-loa-inactive",
                disabledTextColorClass: "text-loa-grey",
                fontSize: "0.8125rem",
                fontWeight: "500",
                lineHeight: "1.25rem",
                px: "0.625rem",
                py: "0.3125rem",
                textColorClass: "text-loa-white",
              }}
              text={t("deny", {
                ns: "components\\my-roster\\expandable-panel",
              })}
            />
          </div>
        )}
        {!props.isWaitlist && props.partyFindSlot && !props.isAuthor && (
          <div
            className="flex shrink-0"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <Button
              onClick={() => {
                if (!props.loading) {
                  props.setLoading(true);

                  const actionBody: KickActionBody = {
                    characterId: props.character?.id ?? "",
                    partyFindSlotId: props.partyFindSlot?.id ?? "",
                    userId: props.userId,
                  };

                  fetch(`/api/party-find-post/${props.partyFindPostId}/kick`, {
                    method: "POST",
                    credentials: "same-origin",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(actionBody),
                  })
                    .then((response) => response.json())
                    .catch(() => {})
                    .finally(() => {
                      props.setLoading(false);
                      navigate("/my-roster/my-posts");
                    });
                }
              }}
              disabled={props.loading}
              style={{
                additionalClass: "",
                backgroundColorClass: "bg-loa-red",
                cornerRadius: "0.625rem",
                disabledBackgroundColorClass: "bg-loa-inactive",
                disabledTextColorClass: "text-loa-grey",
                fontSize: "0.8125rem",
                fontWeight: "500",
                lineHeight: "1.25rem",
                px: "0.625rem",
                py: "0.3125rem",
                textColorClass: "text-loa-white",
              }}
              text={t("kick", {
                ns: "components\\my-roster\\expandable-panel",
              })}
            />
          </div>
        )}
      </Link>
    );
  } else {
    return (
      <div className="flex">
        <div
          className={`${
            props.jobType === JobType.SUPPORT ? "bg-loa-green" : ""
          }${props.jobType === JobType.DPS ? "bg-loa-red" : ""}${
            props.jobType === JobType.ANY ? "bg-loa-grey" : ""
          } h-[2.0625rem] w-[2.0625rem] rounded-full`}
        />
      </div>
    );
  }
}
