/*
  Warnings:

  - You are about to drop the column `characterId` on the `PartyFindSlot` table. All the data in the column will be lost.
  - You are about to drop the column `isAuthor` on the `PartyFindSlot` table. All the data in the column will be lost.
  - You are about to drop the `_CharacterToPartyFindPost` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[partyFindSlotId]` on the table `PartyFindApplyState` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "PartyFindSlot" DROP CONSTRAINT "PartyFindSlot_characterId_fkey";

-- DropForeignKey
ALTER TABLE "_CharacterToPartyFindPost" DROP CONSTRAINT "_CharacterToPartyFindPost_A_fkey";

-- DropForeignKey
ALTER TABLE "_CharacterToPartyFindPost" DROP CONSTRAINT "_CharacterToPartyFindPost_B_fkey";

-- AlterTable
ALTER TABLE "PartyFindApplyState" ADD COLUMN     "partyFindSlotId" TEXT;

-- AlterTable
ALTER TABLE "PartyFindSlot" DROP COLUMN "characterId",
DROP COLUMN "isAuthor",
ADD COLUMN     "partyFindApplyStateId" TEXT;

-- DropTable
DROP TABLE "_CharacterToPartyFindPost";

-- CreateIndex
CREATE UNIQUE INDEX "PartyFindApplyState_partyFindSlotId_key" ON "PartyFindApplyState"("partyFindSlotId");

-- AddForeignKey
ALTER TABLE "PartyFindApplyState" ADD CONSTRAINT "PartyFindApplyState_partyFindSlotId_fkey" FOREIGN KEY ("partyFindSlotId") REFERENCES "PartyFindSlot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
