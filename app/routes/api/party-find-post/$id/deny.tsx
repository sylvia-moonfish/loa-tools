import type { ActionFunction } from "@remix-run/node";
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
    typeof actionBody.partyFindPostId === "string" &&
    actionBody.partyFindPostId === params.id &&
    typeof actionBody.userId === "string" &&
    actionBody.userId === user.id &&
    typeof actionBody.characterId === "string" &&
    actionBody.characterId.length > 0
  ) {
    try {
      const characterDb = await prisma.character.findFirst({
        where: { id: actionBody.characterId },
        select: { id: true, job: true },
      });

      if (!characterDb) return json({});

      const partyFindPostDb = await prisma.partyFindPost.findFirst({
        where: { id: params.id },
        select: {
          id: true,
          authorId: true,
          waitlistCharacters: {
            where: { id: characterDb.id },
            select: { id: true },
          },
        },
      });

      if (!partyFindPostDb) return json({});
      if (partyFindPostDb.authorId !== user.id) return json({});
      if (partyFindPostDb.waitlistCharacters.length === 0) return json({});

      await prisma.partyFindPost.update({
        where: { id: partyFindPostDb.id },
        data: {
          waitlistCharacters: { disconnect: { id: characterDb.id } },
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  return json({});
};
