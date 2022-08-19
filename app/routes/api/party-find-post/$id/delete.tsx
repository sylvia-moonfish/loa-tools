import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { prisma } from "~/db.server";
import { requireUser } from "~/session.server";

export type ActionBody = { partyFindPostId: string; userId: string };

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
    actionBody.userId === user.id
  ) {
    try {
      const partyFindPostDb = await prisma.partyFindPost.findFirst({
        where: { id: params.id },
        select: { id: true, authorId: true },
      });

      if (!partyFindPostDb) return json({});
      if (partyFindPostDb.authorId !== user.id) return json({});

      await prisma.partyFindSlot.deleteMany({
        where: { partyFindPostId: partyFindPostDb.id },
      });

      await prisma.partyFindPost.update({
        where: { id: partyFindPostDb.id },
        data: { waitlistCharacters: { set: [] } },
      });

      await prisma.partyFindPost.delete({ where: { id: partyFindPostDb.id } });
    } catch (e) {
      console.log(e);
    }
  }

  return json({});
};
