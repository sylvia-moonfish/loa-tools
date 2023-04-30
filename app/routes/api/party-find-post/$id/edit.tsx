import type { ActionFunction } from "@remix-run/node";
import type { ItemType } from "~/components/dropdown";
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
      // If the start time is already expired, throw this away.
      if (new Date().getTime() > new Date(actionBody.startDate).getTime())
        return json<ActionData>({
          success: false,
          errorMessage: "commonError",
        });

      // Get the post.
      const partyFindPostDb = await prisma.partyFindPost.findFirst({
        where: { id: params.id },
        select: { id: true, authorId: true },
      });

      // Validate: Check if post exists and that the user who made the edit request is the author.
      if (!partyFindPostDb || partyFindPostDb.authorId !== user.id)
        return json<ActionData>({
          success: false,
          errorMessage: "commonError",
        });

      // Validate: If content type could not be determined, abort.
      const contentStage = await prisma.contentStage.findFirst({
        where: { id: actionBody.contentStageId },
        select: { id: true, contentType: true },
      });

      if (!contentStage)
        return json<ActionData>({
          success: false,
          errorMessage: "commonError",
        });

      // Update post information.
      await prisma.partyFindPost.update({
        where: { id: partyFindPostDb.id },
        data: {
          contentType: contentStage.contentType,
          isPracticeParty: actionBody.isPracticeParty,
          isReclearParty: actionBody.isReclearParty,
          title: actionBody.partyTitle,
          startTime: new Date(actionBody.startDate),
          recurring: actionBody.isRecurring,
          contentStageId: contentStage.id,
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
