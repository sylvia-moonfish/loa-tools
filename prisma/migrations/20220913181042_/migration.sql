/*
  Warnings:

  - You are about to drop the column `partyFindApplyStateId` on the `PartyFindSlot` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "PartyFindSlot_partyFindPostId_partyFindApplyStateId_key";

-- AlterTable
ALTER TABLE "PartyFindSlot" DROP COLUMN "partyFindApplyStateId";
