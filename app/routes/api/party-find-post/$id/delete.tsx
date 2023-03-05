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
      // Get the post that will be deleted.
      const partyFindPostDb = await prisma.partyFindPost.findFirst({
        where: { id: params.id },
        select: { id: true, startTime: true, authorId: true },
      });

      // Validate: Check if the post exists.
      if (!partyFindPostDb) return json({});

      // Validate: Check if the user making this delete request is the post's author.
      if (partyFindPostDb.authorId !== user.id) return json({});

      // Delete all the apply states for this post.
      await prisma.partyFindApplyState.deleteMany({
        where: { partyFindPostId: partyFindPostDb.id },
      });

      // Delete all the slots for this post.
      await prisma.partyFindSlot.deleteMany({
        where: { partyFindPostId: partyFindPostDb.id },
      });

      // Delete the post itself.
      await prisma.partyFindPost.delete({ where: { id: partyFindPostDb.id } });
    } catch (e) {
      console.log(e);
    }
  }

  return json({});
};
