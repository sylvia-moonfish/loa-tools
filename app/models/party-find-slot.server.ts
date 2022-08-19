import type { PartyFindSlot } from "@prisma/client";
import { prisma } from "~/db.server";

/*export async function addPartyFindSlot({
  index,
  jobType,
  isAuthor,
  partyFindPostId,
  characterId,
}: Pick<
  PartyFindSlot,
  "jobType" | "isAuthor" | "partyFindPostId" | "characterId"
> & {
  index: number;
}) {
  return prisma.partyFindSlot.create({
    data: { index, isAuthor, jobType, partyFindPostId, characterId },
  });
}*/
