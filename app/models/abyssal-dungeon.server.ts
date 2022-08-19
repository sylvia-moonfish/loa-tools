import type { AbyssalDungeonStage } from "@prisma/client";
import { prisma } from "~/db.server";

/*export async function getAbyssalDungeon() {
  return prisma.abyssalDungeon.findFirst({
    include: { tabs: { include: { stages: true } } },
  });
}

export async function getAbyssalDungeonStage(id: AbyssalDungeonStage["id"]) {
  return prisma.abyssalDungeonStage.findFirst({ where: { id } });
}*/
