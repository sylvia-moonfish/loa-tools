import type { ActionFunction } from "@remix-run/node";
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
      const characterDb = await prisma.character.findFirst({
        where: { id: actionBody.characterId },
        select: { id: true },
      });

      if (!characterDb) return json({});

      const partyFindSlotDb = await prisma.partyFindSlot.findFirst({
        where: {
          id: actionBody.partyFindSlotId,
          characterId: characterDb.id,
          isAuthor: false,
        },
        select: {
          id: true,
          partyFindPost: { select: { id: true, authorId: true } },
        },
      });

      if (!partyFindSlotDb) return json({});
      if (partyFindSlotDb.partyFindPost.id !== params.id) return json({});
      if (partyFindSlotDb.partyFindPost.authorId !== user.id) return json({});

      await prisma.partyFindSlot.update({
        where: { id: partyFindSlotDb.id },
        data: { characterId: null },
      });
    } catch (e) {
      console.log(e);
    }
  }

  return json({});
};
