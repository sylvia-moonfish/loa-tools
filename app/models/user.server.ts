import type { User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByDiscordId(discordId: User["discordId"]) {
  return prisma.user.findUnique({ where: { discordId } });
}

export async function upsertUser({
  discordId,
  discordUsername,
  discordDiscriminator,
  discordAvatarHash,
}: {
  discordId: User["discordId"];
  discordUsername: User["discordUsername"];
  discordDiscriminator: User["discordDiscriminator"];
  discordAvatarHash: User["discordAvatarHash"];
}) {
  return prisma.user.upsert({
    where: {
      discordId,
    },
    update: {
      discordUsername,
      discordDiscriminator,
      discordAvatarHash,
    },
    create: {
      discordId,
      discordUsername,
      discordDiscriminator,
      discordAvatarHash,
    },
  });
}
