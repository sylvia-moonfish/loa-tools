import type { Server } from "@prisma/client";
import { prisma } from "~/db.server";

export type { Server } from "@prisma/client";

export function getServer({ id }: Pick<Server, "id">) {
  return prisma.server.findFirst({ where: { id } });
}
