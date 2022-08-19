import type { User } from "@prisma/client";
import { prisma } from "~/db.server";

/*export async function getUser({ id }: Pick<User, "id">) {
  return prisma.user.findFirst({
    include: {
      characters: { include: { server: { include: { region: true } } } },
    },
    where: { id },
  });
}

export async function getUserByDiscordId({
  discordId,
}: Pick<User, "discordId">) {
  return prisma.user.findFirst({ where: { discordId } });
}

export async function upsertUser({
  discordId,
  discordUsername,
  discordDiscriminator,
  discordAvatarHash,
}: Pick<
  User,
  "discordId" | "discordUsername" | "discordDiscriminator" | "discordAvatarHash"
>) {
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
}*/
