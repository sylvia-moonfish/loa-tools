import type { ActionFunction } from "@remix-run/node";
import { JobType, PartyFindContentType } from "@prisma/client";
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
          contentType: true,
          startTime: true,
          partyFindSlots: {
            where: {
              character: null,
              jobType: {
                in: [JobType.ANY, getJobTypeFromJob(characterDb.job)],
              },
            },
            select: { id: true, index: true },
          },
          waitlistCharacters: {
            where: { id: characterDb.id },
            select: { id: true },
          },
        },
      });

      if (!partyFindPostDb) return json({});
      if (partyFindPostDb.authorId !== user.id) return json({});
      if (
        partyFindPostDb.partyFindSlots.length === 0 ||
        partyFindPostDb.waitlistCharacters.length === 0
      )
        return json({});

      await prisma.partyFindSlot.update({
        where: {
          id: partyFindPostDb.partyFindSlots.sort(
            (a, b) => a.index - b.index
          )[0].id,
        },
        data: { characterId: characterDb.id },
      });

      await prisma.partyFindPost.update({
        where: { id: partyFindPostDb.id },
        data: {
          waitlistCharacters: { disconnect: { id: characterDb.id } },
        },
      });

      let baseName = undefined;
      switch (partyFindPostDb.contentType) {
        case PartyFindContentType.ABYSSAL_DUNGEON:
          baseName = "abyssalDungeonId";
          break;
        case PartyFindContentType.ABYSS_RAID:
          baseName = "abyssRaidId";
          break;
        case PartyFindContentType.LEGION_RAID:
          baseName = "legionRaidId";
          break;
      }

      if (!baseName) return json({});

      const selector: { [attr: string]: any } = {};
      selector[baseName] = true;
      const where = await prisma.partyFindPost.findFirst({
        where: { id: partyFindPostDb.id },
        select: selector,
      });

      if (!where) return json({});

      const startDate = new Date(partyFindPostDb.startTime);
      const refDate = new Date(partyFindPostDb.startTime);
      refDate.setUTCMinutes(0);
      refDate.setUTCSeconds(0);
      refDate.setUTCMilliseconds(0);
      refDate.setUTCHours(7);
      refDate.setUTCDate(
        refDate.getUTCDate() + ((10 - refDate.getUTCDay()) % 7)
      );

      const nextMaintenance = new Date(refDate.getTime());
      while (nextMaintenance <= startDate)
        nextMaintenance.setDate(nextMaintenance.getDate() + 7);

      const prevMaintenance = new Date(refDate.getTime());
      while (prevMaintenance > startDate)
        prevMaintenance.setDate(prevMaintenance.getDate() - 7);

      const waitingPostsDb = await prisma.partyFindPost.findMany({
        where: {
          ...where,
          startTime: { lt: nextMaintenance, gte: prevMaintenance },
          contentType: partyFindPostDb.contentType,
          waitlistCharacters: { some: { id: characterDb.id } },
        },
        select: { id: true },
      });

      for (let i = 0; i < waitingPostsDb.length; i++) {
        await prisma.partyFindPost.update({
          where: { id: waitingPostsDb[i].id },
          data: { waitlistCharacters: { disconnect: { id: characterDb.id } } },
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  return json({});
};
