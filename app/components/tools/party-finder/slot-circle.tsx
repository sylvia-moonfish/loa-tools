import type { LocaleType } from "~/i18n";
import { Job, JobType, Relic } from "@prisma/client";
import * as React from "react";
import InfoOverlay from "~/components/tools/party-finder/info-overlay";
import { generateJobIconPath } from "~/utils";

export default function SlotCircle(props: {
  locale: LocaleType;
  slot: {
    id: string;
    index: number;
    jobType: JobType;
    partyFindApplyState: {
      id: string;
      character: {
        id: string;
        name: string;
        job: Job;
        itemLevel: number;
        relicPieces: { id: string; number: number; relic: Relic }[];
        engravingSlots: {
          id: string;
          level: number;
          engraving: { id: string; nameEn: string; nameKo: string };
        }[];
        roster: { id: string; level: number; userId: string };
      };
    };
  };
  star: boolean;
}) {
  const [isAppliedSlot, setIsAppliedSlot] = React.useState(
    !!props.slot.partyFindApplyState && !!props.slot.partyFindApplyState.id
  );
  const [overlayEnabled, setOverlayEnabled] = React.useState(false);

  let circle, star;

  if (isAppliedSlot) {
    const iconPath = generateJobIconPath(
      props.slot.partyFindApplyState.character.job
    );

    circle = (
      <div
        className={`${
          props.slot.jobType === JobType.SUPPORT
            ? "border-loa-green "
            : "border-loa-red "
        }rounded-full border-2 px-[0.125rem] py-[0.125rem]`}
      >
        <div
          className="h-[1.5625rem] w-[1.5625rem] rounded-full bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: iconPath ? `url('${iconPath}')` : "" }}
        ></div>
      </div>
    );

    if (props.star) {
      star = (
        <div className="material-symbols-outlined absolute right-[-5px] top-[-5px] text-[1.125rem] text-loa-party-leader-star">
          star
        </div>
      );
    }
  } else {
    circle = (
      <div
        className={`${
          props.slot.jobType === JobType.SUPPORT ? "bg-loa-green " : ""
        }${props.slot.jobType === JobType.DPS ? "bg-loa-red " : ""}${
          props.slot.jobType === JobType.ANY ? "bg-loa-grey " : ""
        }h-[2.0625rem] w-[2.0625rem] rounded-full`}
      ></div>
    );
  }

  return (
    <div className="relative">
      <div
        className="relative"
        onMouseEnter={() => {
          setOverlayEnabled(true);
        }}
        onMouseLeave={() => {
          setOverlayEnabled(false);
        }}
      >
        {circle}
        {star}
      </div>
      {isAppliedSlot && (
        <InfoOverlay
          enabled={overlayEnabled}
          relicPieces={
            props.slot.partyFindApplyState.character.relicPieces ?? []
          }
          engravings={
            props.slot.partyFindApplyState.character.engravingSlots ?? []
          }
          itemLevel={props.slot.partyFindApplyState.character.itemLevel}
          job={props.slot.partyFindApplyState.character.job}
          locale={props.locale}
          name={props.slot.partyFindApplyState.character.name}
          rosterLevel={props.slot.partyFindApplyState.character.roster.level}
        />
      )}
    </div>
  );
}
