import { prisma } from "~/db.server";

export type { Region, Server } from "@prisma/client";

export function getAllRegions() {
  return prisma.region.findMany({
    include: {
      servers: true,
    },
  });
}
