import { ActionFunction, redirect } from "@remix-run/node";
import { Job } from "@prisma/client";
import { json } from "@remix-run/node";
import { prisma } from "~/db.server";
import { requireUser } from "~/session.server";
import { validateFloat, validateInt, validateText } from "~/utils";

export type ActionBody = {
  job: string;
  characterName: string;
  region: string;
  server: string;
  isMainCharacter: boolean;
  rosterLevel: number;
  combatLevel: number;
  itemLevel: number;
  guild: string;
  stronghold: string;
  crit: number;
  specialization: number;
  domination: number;
  swiftness: number;
  endurance: number;
  expertise: number;
  engravings: { id: string; level: number }[];
  characterId: string;
  userId: string;
};

export type ActionData = {
  success: boolean;
  navigateUrl?: string;
  errorMessage?: string;
};

export const action: ActionFunction = async ({ params, request }) => {
  const user = await requireUser(request, "/character/add");
  const actionBody: ActionBody = await request.json();

  if (
    typeof params.id === "string" &&
    params.id.length > 0 &&
    actionBody &&
    typeof actionBody.job === "string" &&
    Object.values(Job).includes(actionBody.job as Job) &&
    typeof actionBody.characterName === "string" &&
    validateText(true, actionBody.characterName, 16, 2) &&
    typeof actionBody.region === "string" &&
    actionBody.region.length > 0 &&
    typeof actionBody.server === "string" &&
    actionBody.server.length > 0 &&
    typeof actionBody.isMainCharacter === "boolean" &&
    typeof actionBody.rosterLevel === "number" &&
    validateInt(true, actionBody.rosterLevel.toString(), undefined, 1) &&
    typeof actionBody.combatLevel === "number" &&
    validateInt(true, actionBody.combatLevel.toString(), undefined, 1) &&
    typeof actionBody.itemLevel === "number" &&
    validateFloat(true, actionBody.itemLevel.toString(), undefined, 0) &&
    typeof actionBody.guild === "string" &&
    validateText(false, actionBody.guild, 20) &&
    typeof actionBody.stronghold === "string" &&
    validateText(false, actionBody.stronghold, 20) &&
    typeof actionBody.crit === "number" &&
    validateInt(true, actionBody.crit.toString(), undefined, 0) &&
    typeof actionBody.specialization === "number" &&
    validateInt(true, actionBody.specialization.toString(), undefined, 0) &&
    typeof actionBody.domination === "number" &&
    validateInt(true, actionBody.domination.toString(), undefined, 0) &&
    typeof actionBody.swiftness === "number" &&
    validateInt(true, actionBody.swiftness.toString(), undefined, 0) &&
    typeof actionBody.endurance === "number" &&
    validateInt(true, actionBody.endurance.toString(), undefined, 0) &&
    typeof actionBody.expertise === "number" &&
    validateInt(true, actionBody.expertise.toString(), undefined, 0) &&
    typeof actionBody.userId === "string" &&
    actionBody.userId === user.id &&
    typeof actionBody.characterId === "string" &&
    actionBody.characterId === params.id
  ) {
    try {
      const navigateUrl = `/character/${actionBody.characterId}`;

      let rosterDb = await prisma.roster.findFirst({
        where: { serverId: actionBody.server, userId: user.id },
      });

      if (!rosterDb) {
        rosterDb = await prisma.roster.create({
          data: {
            level: actionBody.rosterLevel,
            serverId: actionBody.server,
            userId: user.id,
          },
        });
      } else if (rosterDb.level !== actionBody.rosterLevel) {
        rosterDb = await prisma.roster.update({
          where: { id: rosterDb.id },
          data: { level: actionBody.rosterLevel },
        });
      }

      if (!rosterDb)
        return json<ActionData>({
          success: false,
          errorMessage: "commonError",
        });

      if (actionBody.stronghold) {
        let strongholdDb = await prisma.stronghold.findFirst({
          where: { rosterId: rosterDb.id },
        });

        if (!strongholdDb) {
          strongholdDb = await prisma.stronghold.create({
            data: {
              name: actionBody.stronghold,
              level: 0,
              rosterId: rosterDb.id,
            },
          });
        } else if (strongholdDb.name !== actionBody.stronghold) {
          strongholdDb = await prisma.stronghold.update({
            where: { id: strongholdDb.id },
            data: { name: actionBody.stronghold },
          });
        }
      }

      let guildDb = undefined;

      if (actionBody.guild) {
        guildDb = await prisma.guild.findFirst({
          where: { name: actionBody.guild, serverId: actionBody.server },
        });

        if (!guildDb) {
          guildDb = await prisma.guild.create({
            data: { name: actionBody.guild, serverId: actionBody.server },
          });
        }
      }

      if (actionBody.isMainCharacter) {
        const primaryCharacters = await prisma.character.findMany({
          where: { isPrimary: true, rosterId: rosterDb.id },
        });

        for (let i = 0; i < primaryCharacters.length; i++) {
          await prisma.character.update({
            where: { id: primaryCharacters[i].id },
            data: { isPrimary: false },
          });
        }
      }

      let characterDb = await prisma.character.findFirst({
        where: { rosterId: rosterDb.id, id: params.id },
      });

      if (!characterDb) {
        characterDb = await prisma.character.create({
          data: {
            name: actionBody.characterName,
            isPrimary: actionBody.isMainCharacter,
            job: actionBody.job as Job,
            onTimeBadge: 0,
            friendlyBadge: 0,
            professionalBadge: 0,
            combatLevel: actionBody.combatLevel,
            itemLevel: actionBody.itemLevel,
            comment: "",
            crit: actionBody.crit,
            specialization: actionBody.specialization,
            domination: actionBody.domination,
            swiftness: actionBody.swiftness,
            endurance: actionBody.endurance,
            expertise: actionBody.expertise,

            rosterId: rosterDb.id,
            guildId: guildDb ? guildDb.id : undefined,
          },
        });
      } else {
        characterDb = await prisma.character.update({
          where: { id: characterDb.id },
          data: {
            name: actionBody.characterName,
            isPrimary: actionBody.isMainCharacter,
            job: actionBody.job as Job,
            combatLevel: actionBody.combatLevel,
            itemLevel: actionBody.itemLevel,
            comment: "",
            crit: actionBody.crit,
            specialization: actionBody.specialization,
            domination: actionBody.domination,
            swiftness: actionBody.swiftness,
            endurance: actionBody.endurance,
            expertise: actionBody.expertise,

            rosterId: rosterDb.id,
            guildId: guildDb ? guildDb.id : undefined,
          },
        });
      }

      if (!characterDb)
        return json<ActionData>({
          success: false,
          errorMessage: "commonError",
        });

      let index = 1;

      for (let i = 0; i < actionBody.engravings.length; i++) {
        const engraving = actionBody.engravings[i];

        if (engraving.id.length > 0 && engraving.level > 0) {
          let engravingSlot = await prisma.engravingSlot.findFirst({
            where: { characterId: characterDb.id, index },
          });

          if (!engravingSlot) {
            engravingSlot = await prisma.engravingSlot.create({
              data: {
                index,
                level: engraving.level,
                engravingId: engraving.id,
                characterId: characterDb.id,
              },
            });
          } else if (
            engravingSlot.engravingId !== engraving.id ||
            engravingSlot.level !== engraving.level
          ) {
            engravingSlot = await prisma.engravingSlot.update({
              where: { id: engravingSlot.id },
              data: { level: engraving.level, engravingId: engraving.id },
            });
          }

          index++;
        }
      }

      return json<ActionData>({ success: true, navigateUrl });
    } catch {}
  }

  return json<ActionData>({ success: false, errorMessage: "commonError" });
};
