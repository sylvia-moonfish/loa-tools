import type { LegionRaidStage } from "@prisma/client";
import { prisma } from "~/db.server";

/*export async function getLegionRaid() {
  return prisma.legionRaid.findFirst({
    include: { tabs: { include: { stages: true } } },
  });
}

export async function getLegionRaidStage(id: LegionRaidStage["id"]) {
  return prisma.legionRaidStage.findFirst({ where: { id } });
}*/
