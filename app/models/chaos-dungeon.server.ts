import { prisma } from "~/db.server";

export type {
  ChaosDungeon,
  ChaosDungeonTab,
  ChaosDungeonStage,
} from "@prisma/client";

export async function getChaosDungeon() {
  return prisma.chaosDungeon.findFirst({
    include: { tabs: { include: { stages: true } } },
  });
}
