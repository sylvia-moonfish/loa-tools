import { prisma } from "~/db.server";

export type { ContentType } from "@prisma/client";

export function getAllContentTypes() {
  return prisma.contentType.findMany({
    include: {
      name: true,
      contentGroups: {
        include: {
          name: true,
          contents: {
            include: {},
          },
        },
      },
    },
  });
}
