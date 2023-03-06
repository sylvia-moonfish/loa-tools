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

export const action: ActionFunction = async ({ params, request }) => {
  const user = await requireUser(request);
  const actionBody: ActionBody = await request.json();

  if (
    typeof params.id === "string" &&
    params.id.length > 0 &&
    actionBody &&
    typeof actionBody.partyFindPostId === "string" &&
    actionBody.partyFindPostId === params.id &&
    typeof actionBody.userId === "string" &&
    actionBody.userId === user.id &&
    typeof actionBody.characterId === "string" &&
    actionBody.characterId.length > 0
  ) {
    try {
      // Get the character that is going to be accepted.
      const characterDb = await prisma.character.findFirst({
        where: { id: actionBody.characterId },
        select: { id: true, job: true, roster: { select: { userId: true } } },
      });

      // Validate: Check if the character exists.
      if (!characterDb) return json({});

      // Get the post that the character will be approved for.
      const partyFindPostDb = await prisma.partyFindPost.findFirst({
        where: { id: params.id },
        select: {
          id: true,
          state: true,
          contentType: true,
          startTime: true,
          authorId: true,
          contentStageId: true,
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

      // Validate: Check if the request is made by the author of the post.
      if (partyFindPostDb.authorId !== user.id) return json({});

      // Validate: Check if the post is recruiting.
      if (
        ![
          PartyFindPostState.RECRUITING.toString(),
          PartyFindPostState.RERECRUITING.toString(),
        ].includes(partyFindPostDb.state)
      )
        return json({});

      // Get the apply state of the character for this post.
      const applyStateDb = await prisma.partyFindApplyState.findFirst({
        where: {
          partyFindPostId: partyFindPostDb.id,
          characterId: characterDb.id,
        },
        select: { id: true, state: true, partyFindSlotId: true },
      });

      // Validate: Check if the apply state exists.
      if (!applyStateDb) return json({});

      // Validate: Check if the apply state is in WAITING.
      if (applyStateDb.state !== PartyFindApplyStateValue.WAITING)
        return json({});

      // Validate: Validate the WAITING state of the apply state.
      // If the state already has slot assigned, that means this character is already accepted.
      if (applyStateDb.partyFindSlotId) {
        await prisma.partyFindApplyState.update({
          where: { id: applyStateDb.id },
          data: { state: PartyFindApplyStateValue.ACCEPTED },
        });
      }

      // Get the appliable slot for this character.
      const partyFindSlotDb = await prisma.partyFindSlot.findFirst({
        orderBy: { index: "asc" },
        where: {
          partyFindPostId: partyFindPostDb.id,
          partyFindApplyState: null,
          jobType: { in: [JobType.ANY, getJobTypeFromJob(characterDb.job)] },
        },
      });

      // Validate: Check if eligible slot exists.
      if (!partyFindSlotDb) return json({});

      // Approve the apply state and link it to the eligible slot once all validations passed.
      await prisma.partyFindApplyState.update({
        where: { id: applyStateDb.id },
        data: {
          state: PartyFindApplyStateValue.ACCEPTED,
          partyFindSlot: { connect: { id: partyFindSlotDb.id } },
        },
      });

      // Send out an alarm to the accepted user.
      await prisma.alarm.create({
        data: {
          message: AlarmMessageType.PARTY_FIND_POST_APPROVED,
          link: "/my-roster/applied-posts",
          isRead: false,
          userId: characterDb.roster.userId,
        },
      });

      // If all slots are filled, change the state of the post to FULL.
      if (
        !(await prisma.partyFindSlot.findFirst({
          where: {
            partyFindPostId: partyFindPostDb.id,
            partyFindApplyState: null,
          },
          select: { id: true },
        }))
      ) {
        await prisma.partyFindPost.update({
          where: { id: partyFindPostDb.id },
          data: { state: PartyFindPostState.FULL },
        });

        // Send out an alarm to all accepted party members.
        const partyMembersDb = await prisma.partyFindSlot.findMany({
          where: { partyFindPostId: partyFindPostDb.id },
          select: {
            id: true,
            partyFindApplyState: {
              select: {
                id: true,
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

        for (let i = 0; i < partyMembersDb.length; i++) {
          const applyState = partyMembersDb[i].partyFindApplyState;

          if (applyState && applyState.id) {
            await prisma.alarm.create({
              data: {
                message: AlarmMessageType.PARTY_FIND_POST_RECRUIT_COMPLETE,
                link: "/my-roster/applied-posts",
                isRead: false,
                userId: applyState.character.roster.userId,
              },
            });
          }
        }
      }

      // Check if this character applied to any other post for the same weekly content and cancel them.
      // If the content type for this post is not a weekly content, skip and return.
      if (
        partyFindPostDb.contentType !== ContentType.ABYSSAL_DUNGEON &&
        partyFindPostDb.contentType !== ContentType.ABYSS_RAID &&
        partyFindPostDb.contentType !== ContentType.LEGION_RAID
      )
        return json({});

      // Make the Date instance from start time of the post.
      const startDate = new Date(partyFindPostDb.startTime);

      // This will be the closest Wed from the start time. (day = 3)
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

      // Delete all apply states which:
      // 1. Is for the same content AND
      // 2. Is in the same weekly reset week.
      await prisma.partyFindApplyState.deleteMany({
        where: {
          id: { not: applyStateDb.id },
          partyFindPost: {
            contentStageId: partyFindPostDb.contentStageId,
            startTime: { lt: nextMaintenance, gte: prevMaintenance },
            contentType: partyFindPostDb.contentType,
            id: { not: partyFindPostDb.id },
          },
          characterId: characterDb.id,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  return json({});
};
