import type { ActionFunction } from "@remix-run/node";
import type { ItemType } from "~/components/dropdown";
import {
  ContentType,
  JobType,
  PartyFindApplyStateValue,
  PartyFindPostState,
} from "@prisma/client";
import { json } from "@remix-run/node";
import { prisma } from "~/db.server";
import { requireUser } from "~/session.server";
import { getJobTypeFromJob, validateText } from "~/utils";

export type ActionBody = {
  contentType: ItemType;
  contentTierId: string;
  contentStageId: string;
  partyTitle: string;
  isPracticeParty: boolean;
  isReclearParty: boolean;
  enforceRole: boolean;
  startDate: number;
  isRecurring: boolean;
  characterId: string;
  userId: string;
};

export type ActionData = {
  success: boolean;
  errorMessage?: string;
  partyFindPostId?: string;
};

export const action: ActionFunction = async ({ request }) => {
  const user = await requireUser(request, "/tools/party-finder");

  const actionBody: ActionBody = await request.json();

  if (
    actionBody &&
    actionBody.contentType &&
    typeof actionBody.contentTierId === "string" &&
    actionBody.contentTierId.length > 0 &&
    typeof actionBody.contentStageId === "string" &&
    actionBody.contentStageId.length > 0 &&
    typeof actionBody.partyTitle === "string" &&
    validateText(true, actionBody.partyTitle, 35, 1) &&
    typeof actionBody.isPracticeParty === "boolean" &&
    typeof actionBody.isReclearParty === "boolean" &&
    typeof actionBody.enforceRole === "boolean" &&
    typeof actionBody.startDate === "number" &&
    typeof actionBody.isRecurring === "boolean" &&
    typeof actionBody.characterId === "string" &&
    actionBody.characterId.length > 0 &&
    typeof actionBody.userId === "string" &&
    actionBody.userId === user.id
  ) {
    try {
      // If the start time is already expired, throw this away.
      if (new Date().getTime() > new Date(actionBody.startDate).getTime())
        return json<ActionData>({
          success: false,
          errorMessage: "commonError",
        });

      // Get the content type and the required group size.
      const contentStage = await prisma.contentStage.findFirst({
        where: { id: actionBody.contentStageId },
        select: { id: true, contentType: true, groupSize: true },
      });

      if (!contentStage)
        return json<ActionData>({
          success: false,
          errorMessage: "commonError",
        });

      let groupSize: number | null = 4;

      switch (contentStage.contentType) {
        case ContentType.CHAOS_DUNGEON:
        case ContentType.GUARDIAN_RAID:
          break;
        case ContentType.ABYSSAL_DUNGEON:
        case ContentType.LEGION_RAID:
          groupSize = contentStage.groupSize;
          break;
        case ContentType.ABYSS_RAID:
          groupSize = 8;
          break;
      }

      if (!groupSize)
        return json<ActionData>({
          success: false,
          errorMessage: "commonError",
        });

      // Validate the author's character first.
      const characterDb = await prisma.character.findFirst({
        where: { id: actionBody.characterId },
        select: {
          id: true,
          job: true,
          roster: { select: { id: true, serverId: true, userId: true } },
        },
      });

      if (!characterDb || characterDb.roster.userId !== user.id)
        return json<ActionData>({
          success: false,
          errorMessage: "commonError",
        });

      // Create the post based on the payload.
      const partyFindPostDb = await prisma.partyFindPost.create({
        data: {
          state: PartyFindPostState.RECRUITING,
          contentType: contentStage.contentType,
          isPracticeParty: actionBody.isPracticeParty,
          isReclearParty: actionBody.isReclearParty,
          title: actionBody.partyTitle,
          startTime: new Date(actionBody.startDate),
          recurring: actionBody.isRecurring,
          contentStageId: contentStage.id,
          authorId: user.id,
          serverId: characterDb.roster.serverId,
        },
      });

      if (!partyFindPostDb)
        return json<ActionData>({
          success: false,
          errorMessage: "commonError",
        });

      // Create empty slots to fill the required group size.
      for (let i = 1; i <= groupSize; i++) {
        await prisma.partyFindSlot.create({
          data: {
            index: i,
            jobType: actionBody.enforceRole
              ? i % 4 === 1
                ? JobType.SUPPORT
                : JobType.DPS
              : JobType.ANY,
            partyFindPostId: partyFindPostDb.id,
          },
        });
      }

      // Find the first eligible slot that the author's character can join.
      const partyFindSlotDb = await prisma.partyFindSlot.findFirst({
        orderBy: { index: "asc" },
        where: {
          jobType: { in: [JobType.ANY, getJobTypeFromJob(characterDb.job)] },
          partyFindPostId: partyFindPostDb.id,
        },
      });

      if (!partyFindSlotDb)
        return json<ActionData>({
          success: false,
          errorMessage: "commonError",
        });

      // Create a state for the author's character and link it to the eligible slot in the party.
      await prisma.partyFindApplyState.create({
        data: {
          state: PartyFindApplyStateValue.ACCEPTED,
          partyFindPostId: partyFindPostDb.id,
          partyFindSlotId: partyFindSlotDb.id,
          characterId: characterDb.id,
        },
      });

      return json<ActionData>({
        success: true,
        partyFindPostId: partyFindPostDb.id,
      });
    } catch {}
  }

  return json<ActionData>({ success: false, errorMessage: "commonError" });
};
