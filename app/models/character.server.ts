import type { Character, User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Character } from "@prisma/client";

export function getCharacter({
  id,
  userId,
}: Pick<Character, "id"> & { userId: User["id"] }) {
  return prisma.character.findFirst({
    where: { id, userId },
  });
}

export function getPrimaryCharacter({ userId }: { userId: User["id"] }) {
  return prisma.character.findFirst({
    where: {
      userId,
      isPrimary: true,
    },
  });
}

export function getCharacters({ userId }: { userId: User["id"] }) {
  return prisma.character.findMany({
    where: { userId },
    include: {
      server: {
        include: {
          region: true,
        },
      },
    },
  });
}
