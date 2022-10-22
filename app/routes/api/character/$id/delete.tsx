import type { ActionFunction } from "@remix-run/node";
import { PartyFindPostState } from "@prisma/client";
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
      // Get the character that we want to delete.
      const characterDb = await prisma.character.findFirst({
        where: { id: params.id },
        select: { id: true, roster: { select: { id: true, userId: true } } },
      });

      // Validate: Check if the character exists.
      if (!characterDb) return json({});

      // Validate: Check if the owner of this character is the user who is making this request.
      if (characterDb.roster.userId !== user.id) return json({});

      // Delete all engraving slots for this character.
      await prisma.engravingSlot.deleteMany({
        where: { characterId: characterDb.id },
      });

      // Find all posts this user created with this character.
      const partyFindPostsDb = await prisma.partyFindPost.findMany({
        where: {
          authorId: user.id,
          partyFindSlots: {
            some: { partyFindApplyState: { characterId: characterDb.id } },
          },
        },
      });

      // For each post, delete all apply states and slots, then delete post.
      for (let i = 0; i < partyFindPostsDb.length; i++) {
        await prisma.partyFindApplyState.deleteMany({
          where: { partyFindPostId: partyFindPostsDb[i].id },
        });

        await prisma.partyFindSlot.deleteMany({
          where: { partyFindPostId: partyFindPostsDb[i].id },
        });

        await prisma.partyFindPost.delete({
          where: { id: partyFindPostsDb[i].id },
        });
      }

      // Check the apply states this character made.
      // If there's a post that this character got accepted into and is FULL,
      // the state of the post should be changed to RERECRUITING.
      const acceptedFullPostsDb = await prisma.partyFindPost.findMany({
        where: {
          state: PartyFindPostState.FULL,
          partyFindSlots: {
            some: { partyFindApplyState: { characterId: characterDb.id } },
          },
        },
      });

      // Delete all the apply states that this character made first.
      await prisma.partyFindApplyState.deleteMany({
        where: { characterId: characterDb.id },
      });

      // Then update the states for the accepted posts.
      for (let i = 0; i < acceptedFullPostsDb.length; i++) {
        await prisma.partyFindPost.update({
          where: { id: acceptedFullPostsDb[i].id },
          data: { state: PartyFindPostState.RERECRUITING },
        });
      }

      // Delete this character.
      await prisma.character.delete({ where: { id: characterDb.id } });
    } catch (e) {
      console.log(e);
    }
  }

  return json({});
};
