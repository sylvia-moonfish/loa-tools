import type { ActionFunction } from "@remix-run/node";
import {
  AlarmMessageType,
  ContentType,
  JobType,
  PartyFindApplyStateValue,
  PartyFindPostState,
} from "@prisma/client";
import { json } from "@remix-run/node";
import { prisma } from "~/db.server";
import { requireUser } from "~/session.server";
import { getJobTypeFromJob } from "~/utils";

export type ActionBody = {
  characterId: string;
  partyFindPostId: string;
  userId: string;
};

export type ActionData = {
  success: boolean;
  errorMessage?: string;
};

export const action: ActionFunction = async ({ params, request }) => {
  const user = await requireUser(request);
  const actionBody: ActionBody = await request.json();

  if (
    typeof params.id === "string" &&
    params.id.length > 0 &&
    actionBody &&
    typeof actionBody.characterId === "string" &&
    actionBody.characterId.length > 0 &&
    typeof actionBody.partyFindPostId === "string" &&
    actionBody.partyFindPostId === params.id &&
    typeof actionBody.userId === "string" &&
    actionBody.userId === user.id
  ) {
    try {
      // Get the character that is trying to apply for the post.
      const characterDb = await prisma.character.findFirst({
        where: { id: actionBody.characterId },
        select: {
          id: true,
          job: true,
          roster: {
            select: {
              id: true,
              userId: true,
              server: { select: { id: true, regionId: true } },
            },
          },
        },
      });

      // Validate: Check if the character exists.
      if (!characterDb || characterDb.roster.userId !== user.id)
        return json<ActionData>({ success: false });

      // Get the post the character is applying for.
      const partyFindPostDb = await prisma.partyFindPost.findFirst({
        where: { id: params.id },
        select: {
          id: true,
          contentType: true,
          state: true,
          startTime: true,
          authorId: true,
          server: { select: { id: true, regionId: true } },
          contentStage: { select: { id: true } },
          partyFindSlots: {
            select: {
              id: true,
              jobType: true,
              partyFindApplyState: { select: { id: true } },
            },
          },
          applyStates: {
            select: {
              id: true,
              state: true,
              character: {
                select: {
                  id: true,
                  roster: { select: { id: true, userId: true } },
                },
              },
            },
          },
        },
      });

      // Validate: Check if the post exists.
      if (!partyFindPostDb) return json<ActionData>({ success: false });

      // Validate: Check if the post start time has not expired. Update state and exit if the time is expired.
      if (
        new Date().getTime() > new Date(partyFindPostDb.startTime).getTime()
      ) {
        await prisma.partyFindPost.update({
          where: { id: partyFindPostDb.id },
          data: { state: PartyFindPostState.EXPIRED },
        });
        await prisma.partyFindApplyState.updateMany({
          where: { partyFindPostId: partyFindPostDb.id },
          data: { state: PartyFindApplyStateValue.EXPIRED },
        });
        return json<ActionData>({ success: false });
      }

      // Validate: You cannot apply to your own post.
      if (partyFindPostDb.authorId === user.id)
        return json<ActionData>({ success: false });

      // Validate: Check if the post is recruiting.
      if (
        ![
          PartyFindPostState.RECRUITING.toString(),
          PartyFindPostState.RERECRUITING.toString(),
        ].includes(partyFindPostDb.state)
      )
        return json<ActionData>({ success: false });

      // Validate: See if this user has already applied/accepted for this post.
      if (
        partyFindPostDb.applyStates.find(
          (a) =>
            a.character.roster.userId === user.id &&
            [
              PartyFindApplyStateValue.ACCEPTED.toString(),
              PartyFindApplyStateValue.WAITING.toString(),
            ].includes(a.state.toString())
        )
      ) {
        return json<ActionData>({ success: false });
      }

      // Validate: Check if the applying character is in the same region as the post.
      if (
        partyFindPostDb.server.regionId !== characterDb.roster.server.regionId
      )
        return json<ActionData>({ success: false });

      // Validate: Check if there is an appliable slot for this character.
      if (
        !partyFindPostDb.partyFindSlots.find(
          (s) =>
            [JobType.ANY, getJobTypeFromJob(characterDb.job)].includes(
              s.jobType
            ) && !(s.partyFindApplyState && s.partyFindApplyState.id)
        )
      )
        return json<ActionData>({ success: false });

      // Validate: Check if this character is already approved to any other post
      // for the same weekly content.
      // First check if this content is weekly restricted.
      if (
        partyFindPostDb.contentType === ContentType.ABYSSAL_DUNGEON ||
        partyFindPostDb.contentType === ContentType.ABYSS_RAID ||
        partyFindPostDb.contentType === ContentType.LEGION_RAID
      ) {
        // Make the Date instance from start time of the post.
        const startDate = new Date(partyFindPostDb.startTime);

        // This will be the cloest Wed from the start time. (day = 3)
        const refDate = new Date(partyFindPostDb.startTime);
        refDate.setUTCMinutes(0);
        refDate.setUTCSeconds(0);
        refDate.setUTCMilliseconds(0);
        refDate.setUTCHours(7);
        refDate.setUTCDate(
          refDate.getUTCDate() + ((10 - refDate.getUTCDay()) % 7)
        );

        // Next weekly reset is closest Wed.
        const nextMaintenance = new Date(refDate.getTime());

        // If start time on Wed (after reset), then closest Wed is the same date as the start time
        // so we have to go to the next reset day (next week Wed)
        while (nextMaintenance <= startDate)
          nextMaintenance.setDate(nextMaintenance.getDate() + 7);

        // Calculate the last weekly reset day. First start from closest Wed.
        const prevMaintenance = new Date(refDate.getTime());

        // Go back week by week until the reset day is smaller than start day.
        while (prevMaintenance > startDate)
          prevMaintenance.setDate(prevMaintenance.getDate() - 7);

        // See if there are any post that:
        // 1. Is for the same content / content tab type AND
        // 2. Is in the same weekly reset week AND
        // 3. Has this character as approved.
        const _existingApplyState = await prisma.partyFindApplyState.findFirst({
          where: {
            characterId: characterDb.id,
            state: PartyFindApplyStateValue.ACCEPTED,
            partyFindPost: {
              contentStageId: partyFindPostDb.contentStage.id,
              startTime: { lt: nextMaintenance, gte: prevMaintenance },
              contentType: partyFindPostDb.contentType,
            },
          },
        });

        // If any apply state that corresponds to the above condition is found,
        // return an error.
        if (_existingApplyState) {
          return json<ActionData>({
            success: false,
            errorMessage: "alreadyAcceptedCharacter",
          });
        }
      }

      // If all validations passed, upsert the apply state for this character!
      await prisma.partyFindApplyState.upsert({
        where: {
          partyFindPostId_characterId: {
            partyFindPostId: partyFindPostDb.id,
            characterId: characterDb.id,
          },
        },
        update: {
          state: PartyFindApplyStateValue.WAITING,
          partyFindSlot: { disconnect: true },
        },
        create: {
          state: PartyFindApplyStateValue.WAITING,
          partyFindPostId: partyFindPostDb.id,
          characterId: characterDb.id,
        },
      });

      // Insert the alarm for application to the post owner!
      await prisma.alarm.create({
        data: {
          message: AlarmMessageType.PARTY_FIND_POST_SOMEONE_APPLIED,
          link: "/my-roster/my-posts",
          isRead: false,
          userId: partyFindPostDb.authorId,
        },
      });
    } catch (e) {
      console.log(e);
      return json<ActionData>({ success: false });
    }

    return json<ActionData>({ success: true });
  }

  return json<ActionData>({ success: false });
};
