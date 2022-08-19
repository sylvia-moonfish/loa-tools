import type { PartyFindPost } from "@prisma/client";
import { prisma } from "~/db.server";

/*export async function getPartyFindPosts() {
  return prisma.partyFindPost.findMany({
    orderBy: { startTime: "desc" },
    include: {
      chaosDungeon: {
        include: { chaosDungeonTab: { include: { chaosDungeon: true } } },
      },
      guardianRaid: {
        include: { guardianRaidTab: { include: { guardianRaid: true } } },
      },
      abyssalDungeon: {
        include: { abyssalDungeonTab: { include: { abyssalDungeon: true } } },
      },
      abyssRaid: {
        include: { abyssRaidTab: { include: { abyssRaid: true } } },
      },
      legionRaid: {
        include: { legionRaidTab: { include: { legionRaid: true } } },
      },
      partyFindSlots: { include: { character: true } },
      server: { include: { region: true } },
    },
  });
}

export async function addPartyFindPost({
  contentType,
  isPracticeParty,
  isFarmingParty,
  title,
  startTime,
  recurring,
  chaosDungeonId,
  guardianRaidId,
  abyssalDungeonId,
  abyssRaidId,
  legionRaidId,
  authorId,
  serverId,
}: Pick<
  PartyFindPost,
  | "contentType"
  | "isPracticeParty"
  | "isFarmingParty"
  | "title"
  | "startTime"
  | "recurring"
  | "chaosDungeonId"
  | "guardianRaidId"
  | "abyssalDungeonId"
  | "abyssRaidId"
  | "legionRaidId"
  | "authorId"
  | "serverId"
>) {
  return prisma.partyFindPost.create({
    data: {
      contentType,
      isPracticeParty,
      isFarmingParty,
      title,
      startTime,
      recurring,
      chaosDungeonId,
      guardianRaidId,
      abyssalDungeonId,
      abyssRaidId,
      legionRaidId,
      authorId,
      serverId,
    },
  });
}*/
