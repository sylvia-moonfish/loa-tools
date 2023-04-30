import type { ActionFunction } from "@remix-run/node";
import { PartyFindApplyStateValue, PartyFindPostState } from "@prisma/client";
import { json } from "@remix-run/node";
import { prisma } from "~/db.server";
import { requireUser } from "~/session.server";

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
    // Get the character.
    try {
      const characterDb = await prisma.character.findFirst({
        where: { id: actionBody.characterId },
        select: { id: true, roster: { select: { userId: true } } },
      });

      // Validate: Check if the character exists.
      if (!characterDb) return json({});

      // Validate: Check if the user making the request is the owner of the character.
      if (characterDb.roster.userId !== user.id) return json({});

      // Get the post.
      const partyFindPostDb = await prisma.partyFindPost.findFirst({
        where: { id: actionBody.partyFindPostId },
        select: { id: true, state: true, startTime: true, authorId: true },
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

      // Validate: Check if the user is not the author of the post.
      // (Author cannot leave the group.)
      if (partyFindPostDb.authorId === user.id) return json({});

      // Find the apply state that belongs to this character.
      const partyFindApplyStateDb = await prisma.partyFindApplyState.findFirst({
        where: {
          characterId: characterDb.id,
          partyFindPostId: partyFindPostDb.id,
        },
      });

      // Validate: Check if the apply state exists for this character.
      if (!partyFindApplyStateDb) return json({});

      // Change the apply state for this post that belongs to this character to WITHDRAWN.
      await prisma.partyFindApplyState.update({
        where: {
          id: partyFindApplyStateDb.id,
        },
        data: { state: PartyFindApplyStateValue.WITHDRAWN },
      });

      // If the apply state was attached to a slot, detach them.
      if (partyFindApplyStateDb.partyFindSlotId) {
        await prisma.partyFindSlot.update({
          where: { id: partyFindApplyStateDb.partyFindSlotId },
          data: { partyFindApplyState: { disconnect: true } },
        });
      }

      // If this post was full but the above update emptied a slot,
      // change the state to RERECRUITING.
      if (partyFindPostDb.state === PartyFindPostState.FULL) {
        const emptySlot = await prisma.partyFindSlot.findFirst({
          where: {
            partyFindPostId: partyFindPostDb.id,
            partyFindApplyState: null,
          },
        });

        if (emptySlot) {
          await prisma.partyFindPost.update({
            where: { id: partyFindPostDb.id },
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
