import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { prisma } from "~/db.server";
import { requireUser } from "~/session.server";

export type ActionBody = { characterId: string; userId: string };

export const action: ActionFunction = async ({ params, request }) => {
  const user = await requireUser(request);
  const actionBody: ActionBody = await request.json();

  if (
    typeof params.id === "string" &&
    params.id.length > 0 &&
    actionBody &&
    typeof actionBody.characterId === "string" &&
    actionBody.characterId === params.id &&
    typeof actionBody.userId === "string" &&
    actionBody.userId === user.id
  ) {
    try {
      const characterDb = await prisma.character.findFirst({
        where: { id: params.id },
        select: { id: true, roster: { select: { id: true, userId: true } } },
      });

      if (!characterDb) return json({});
      if (characterDb.roster.userId !== user.id) return json({});

      await prisma.engravingSlot.deleteMany({
        where: { characterId: characterDb.id },
      });

      await prisma.partyFindPost.deleteMany({
        where: {
          partyFindSlots: {
            some: { characterId: characterDb.id, isAuthor: true },
          },
        },
      });

      await prisma.partyFindSlot.deleteMany({
        where: { characterId: characterDb.id },
      });

      await prisma.character.update({
        where: { id: characterDb.id },
        data: { waitlistPosts: { set: [] } },
      });

      await prisma.character.delete({ where: { id: characterDb.id } });
    } catch (e) {
      console.log(e);
    }
  }

  return json({});
};
