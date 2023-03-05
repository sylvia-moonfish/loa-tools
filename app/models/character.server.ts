import type { Character, Server, User } from "@prisma/client";
import { prisma } from "~/db.server";

/*export async function getCharacter({
  id,
  userId,
}: Pick<Character, "id"> & { userId: User["id"] }) {
  return prisma.character.findFirst({
    include: { server: true },
    where: { id, userId },
  });
}

export async function getPrimaryCharacter({ userId }: { userId: User["id"] }) {
  return prisma.character.findFirst({
    where: {
      userId,
      isPrimary: true,
    },
  });
}

export async function getCharacters({ userId }: { userId: User["id"] }) {
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

export async function addCharacter({
  name,
  isPrimary,
  job,
  itemLevel,
  userId,
  serverId,
}: Pick<Character, "name" | "isPrimary" | "job" | "itemLevel"> & {
  userId: User["id"];
  serverId: Server["id"];
}) {
  return prisma.character.create({
    data: {
      name,
      isPrimary,
      job,
      itemLevel,
      userId: userId,
      serverId: serverId,
    },
  });
}*/
