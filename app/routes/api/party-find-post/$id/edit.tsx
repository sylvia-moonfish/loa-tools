import type { ActionFunction } from "@remix-run/node";
import type { ItemType } from "~/components/dropdown";
import { PartyFindContentType } from "@prisma/client";
import { json } from "@remix-run/node";
import { prisma } from "~/db.server";
import { requireUser } from "~/session.server";
import { validateText } from "~/utils";

export type ActionBody = {
  contentType: ItemType;
  contentTierId: string;
  contentStageId: string;
  partyTitle: string;
  isPracticeParty: boolean;
  isReclearParty: boolean;
  startDate: number;
  isRecurring: boolean;
  partyFindPostId: string;
  userId: string;
};

export type ActionData = {
  success: boolean;
  errorMessage?: string;
  partyFindPostId?: string;
};

export const action: ActionFunction = async ({ params, request }) => {
  const user = await requireUser(request, "/tools/party-finder");

  const actionBody: ActionBody = await request.json();

  if (
    typeof params.id === "string" &&
    actionBody &&
    actionBody.contentType &&
    typeof actionBody.contentTierId === "string" &&
    actionBody.contentTierId.length > 0 &&
    typeof actionBody.contentStageId === "string" &&
    actionBody.contentStageId.length > 0 &&
    typeof actionBody.partyTitle === "string" &&
    validateText(true, actionBody.partyTitle, 35, 1) &&
    typeof actionBody.isPracticeParty === "boolean" &&
    typeof actionBody.isReclearParty === "boolean" &&
    typeof actionBody.startDate === "number" &&
    typeof actionBody.isRecurring === "boolean" &&
    typeof actionBody.userId === "string" &&
    actionBody.userId === user.id &&
    typeof actionBody.partyFindPostId === "string" &&
    actionBody.partyFindPostId.length > 0 &&
    actionBody.partyFindPostId === params.id
  ) {
    try {
      const partyFindPostDb = await prisma.partyFindPost.findFirst({
        where: { id: params.id },
        select: {
          id: true,
          authorId: true,
          partyFindSlots: {
            select: { id: true, isAuthor: true, characterId: true },
          },
        },
      });

      if (
        !partyFindPostDb ||
        partyFindPostDb.authorId !== user.id ||
        partyFindPostDb.partyFindSlots.find((s) => !s.isAuthor && s.characterId)
      )
        return json<ActionData>({
          success: false,
          errorMessage: "commonError",
        });

      let contentType = undefined;
      let groupSize = 4;

      switch (actionBody.contentType.text?.en) {
        case "Chaos Dungeon":
          if (
            await prisma.chaosDungeonStage.findFirst({
              where: { id: actionBody.contentStageId },
            })
          )
            contentType = PartyFindContentType.CHAOS_DUNGEON;
          break;
        case "Guardian Raid":
          if (
            await prisma.guardianRaidStage.findFirst({
              where: { id: actionBody.contentStageId },
            })
          )
            contentType = PartyFindContentType.GUARDIAN_RAID;
          break;
        case "Abyssal Dungeon":
          const abyssalDungeonStage =
            await prisma.abyssalDungeonStage.findFirst({
              where: { id: actionBody.contentStageId },
            });
          if (abyssalDungeonStage) {
            contentType = PartyFindContentType.ABYSSAL_DUNGEON;
            groupSize = abyssalDungeonStage.groupSize;
          }
          break;
        case "Abyss Raid":
          if (
            await prisma.abyssRaidStage.findFirst({
              where: { id: actionBody.contentStageId },
            })
          ) {
            contentType = PartyFindContentType.ABYSS_RAID;
            groupSize = 8;
          }
          break;
        case "Legion Raid":
          const legionRaidStage = await prisma.legionRaidStage.findFirst({
            where: { id: actionBody.contentStageId },
          });
          if (legionRaidStage) {
            contentType = PartyFindContentType.LEGION_RAID;
            groupSize = legionRaidStage.groupSize;
          }
          break;
      }

      if (!contentType)
        return json<ActionData>({
          success: false,
          errorMessage: "commonError",
        });

      await prisma.partyFindPost.update({
        where: { id: partyFindPostDb.id },
        data: {
          contentType,
          isPracticeParty: actionBody.isPracticeParty,
          isReclearParty: actionBody.isReclearParty,
          title: actionBody.partyTitle,
          startTime: new Date(actionBody.startDate),
          recurring: actionBody.isRecurring,

          chaosDungeonId:
            contentType === PartyFindContentType.CHAOS_DUNGEON
              ? actionBody.contentStageId
              : null,
          guardianRaidId:
            contentType === PartyFindContentType.GUARDIAN_RAID
              ? actionBody.contentStageId
              : null,
          abyssalDungeonId:
            contentType === PartyFindContentType.ABYSSAL_DUNGEON
              ? actionBody.contentStageId
              : null,
          abyssRaidId:
            contentType === PartyFindContentType.ABYSS_RAID
              ? actionBody.contentStageId
              : null,
          legionRaidId:
            contentType === PartyFindContentType.LEGION_RAID
              ? actionBody.contentStageId
              : null,
        },
      });

      return json<ActionData>({
        success: true,
        partyFindPostId: partyFindPostDb.id,
      });
    } catch (e) {
      console.log(e);
    }
  }

  return json<ActionData>({ success: false, errorMessage: "commonError" });
};
