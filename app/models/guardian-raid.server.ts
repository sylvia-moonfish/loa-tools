import { prisma } from "~/db.server";

export type {
  GuardianRaid,
  GuardianRaidTab,
  GuardianRaidStage,
} from "@prisma/client";

export async function getGuardianRaid() {
  return prisma.guardianRaid.findFirst({
    include: { tabs: { include: { stages: true } } },
  });
}
