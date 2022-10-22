import type { ActionFunction } from "@remix-run/node";
import {
  AlarmMessageType,
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
        return json({});

      // Get the post the character is applying for.
      const partyFindPostDb = await prisma.partyFindPost.findFirst({
        where: { id: params.id },
        select: {
          id: true,
          state: true,
          startTime: true,
          authorId: true,
          server: { select: { id: true, regionId: true } },
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
      if (!partyFindPostDb) return json({});

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
        return json({});
      }

      // Validate: You cannot apply to your own post.
      if (partyFindPostDb.authorId === user.id) return json({});

      // Validate: Check if the post is recruiting.
      if (
        ![
          PartyFindPostState.RECRUITING.toString(),
          PartyFindPostState.RERECRUITING.toString(),
        ].includes(partyFindPostDb.state)
      )
        return json({});

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
        return json({});
      }

      // Validate: Check if the applying character is in the same region as the post.
      if (
        partyFindPostDb.server.regionId !== characterDb.roster.server.regionId
      )
        return json({});

      // Validate: Check if there is an appliable slot for this character.
      if (
        !partyFindPostDb.partyFindSlots.find(
          (s) =>
            [JobType.ANY, getJobTypeFromJob(characterDb.job)].includes(
              s.jobType
            ) && !(s.partyFindApplyState && s.partyFindApplyState.id)
        )
      )
        return json({});

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
    }
  }

  return json({});
};
