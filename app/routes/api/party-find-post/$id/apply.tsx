import type { ActionFunction } from "@remix-run/node";
import { JobType } from "@prisma/client";
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
    typeof actionBody.characterId === "string" &&
    actionBody.characterId.length > 0 &&
    typeof actionBody.partyFindPostId === "string" &&
    actionBody.partyFindPostId === params.id &&
    typeof actionBody.userId === "string" &&
    actionBody.userId === user.id
  ) {
    try {
      const characterDb = await prisma.character.findFirst({
        where: { id: actionBody.characterId },
        select: {
          id: true,
          job: true,
          roster: {
            select: {
              id: true,
              userId: true,
              server: { select: { id: true, regionId: true } },
            },
          },
        },
      });

      if (!characterDb || characterDb.roster.userId !== user.id)
        return json({});

      const partyFindPostDb = await prisma.partyFindPost.findFirst({
        where: { id: params.id },
        select: {
          id: true,
          authorId: true,
          server: { select: { id: true, regionId: true } },
          partyFindSlots: {
            select: { id: true, jobType: true, characterId: true },
          },
          waitlistCharacters: { select: { id: true } },
        },
      });

      if (!partyFindPostDb || partyFindPostDb.authorId === user.id)
        return json({});

      if (
        partyFindPostDb.server.regionId !== characterDb.roster.server.regionId
      )
        return json({});

      if (
        partyFindPostDb.partyFindSlots.find(
          (s) => s.characterId === characterDb.id
        )
      )
        return json({});

      if (
        partyFindPostDb.waitlistCharacters.find((c) => c.id === characterDb.id)
      )
        return json({});

      if (
        !partyFindPostDb.partyFindSlots.find((s) =>
          [JobType.ANY, getJobTypeFromJob(characterDb.job)].includes(s.jobType)
        )
      )
        return json({});

      await prisma.partyFindPost.update({
        where: { id: partyFindPostDb.id },
        data: { waitlistCharacters: { connect: { id: characterDb.id } } },
      });
    } catch (e) {
      console.log(e);
    }
  }

  return json({});
};
