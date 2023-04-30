import type { ActionFunction } from "@remix-run/node";
import { PartyFindApplyStateValue, PartyFindPostState } from "@prisma/client";
import { json } from "@remix-run/node";
import { prisma } from "~/db.server";
import { requireUser } from "~/session.server";

export type ActionBody = {
  characterId: string;
  partyFindSlotId: string;
  userId: string;
};

export const action: ActionFunction = async ({ params, request }) => {
  const user = await requireUser(request);
  const actionBody: ActionBody = await request.json();

  if (
    typeof params.id === "string" &&
    params.id.length > 0 &&
    actionBody &&
    typeof actionBody.partyFindSlotId === "string" &&
    actionBody.partyFindSlotId.length > 0 &&
    typeof actionBody.userId === "string" &&
    actionBody.userId === user.id &&
    typeof actionBody.characterId === "string" &&
    actionBody.characterId.length > 0
  ) {
    try {
      // Get the character.
      const characterDb = await prisma.character.findFirst({
        where: { id: actionBody.characterId },
        select: { id: true },
      });

      // Validate: Check if the character exists.
      if (!characterDb) return json({});

      // Get the slot.
      const partyFindSlotDb = await prisma.partyFindSlot.findFirst({
        where: { id: actionBody.partyFindSlotId },
        select: {
          id: true,
          partyFindPost: {
            select: { id: true, state: true, startTime: true, authorId: true },
          },
        },
      });

      // Validate: Check if the slot exists.
      if (!partyFindSlotDb) return json({});

      // Validate: Check if the post id matches.
      if (partyFindSlotDb.partyFindPost.id !== params.id) return json({});

      // Validate: Check if the post start time has not expired. Update state and exit if the time is expired.
      if (
        new Date().getTime() >
        new Date(partyFindSlotDb.partyFindPost.startTime).getTime()
      ) {
        await prisma.partyFindPost.update({
          where: { id: partyFindSlotDb.partyFindPost.id },
          data: { state: PartyFindPostState.EXPIRED },
        });
        await prisma.partyFindApplyState.updateMany({
          where: { partyFindPostId: partyFindSlotDb.partyFindPost.id },
          data: { state: PartyFindApplyStateValue.EXPIRED },
        });
        return json({});
      }

      // Validate: Check if the user making this request is the author of the post.
      if (partyFindSlotDb.partyFindPost.authorId !== user.id) return json({});

      // Get the apply state of the slot.
      const applyStateDb = await prisma.partyFindApplyState.findFirst({
        where: {
          partyFindSlotId: partyFindSlotDb.id,
          partyFindPostId: partyFindSlotDb.partyFindPost.id,
        },
        select: { id: true, characterId: true },
      });

      // Validate: Check if the apply state exists.
      if (!applyStateDb) return json({});

      // Validate: Check if this character is assigned to this slot.
      if (applyStateDb.characterId !== characterDb.id) return json({});

      // Kick the player.
      await prisma.partyFindApplyState.update({
        where: { id: applyStateDb.id },
        data: {
          state: PartyFindApplyStateValue.REJECTED,
          partyFindSlot: { disconnect: true },
        },
      });

      // If this post was full but the above update empied a slot,
      // change the state to RERECRUITING.
      if (partyFindSlotDb.partyFindPost.state === PartyFindPostState.FULL) {
        const emptySlot = await prisma.partyFindSlot.findFirst({
          where: {
            partyFindPostId: partyFindSlotDb.partyFindPost.id,
            partyFindApplyState: null,
          },
        });

        if (emptySlot) {
          await prisma.partyFindPost.update({
            where: { id: partyFindSlotDb.partyFindPost.id },
            data: { state: PartyFindPostState.RERECRUITING },
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  return json({});
};
