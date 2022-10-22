/*
  Warnings:

  - A unique constraint covering the columns `[partyFindPostId,characterId]` on the table `PartyFindApplyState` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[index,partyFindPostId]` on the table `PartyFindSlot` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[partyFindPostId,partyFindApplyStateId]` on the table `PartyFindSlot` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PartyFindApplyState_partyFindPostId_characterId_key" ON "PartyFindApplyState"("partyFindPostId", "characterId");

-- CreateIndex
CREATE UNIQUE INDEX "PartyFindSlot_index_partyFindPostId_key" ON "PartyFindSlot"("index", "partyFindPostId");

-- CreateIndex
CREATE UNIQUE INDEX "PartyFindSlot_partyFindPostId_partyFindApplyStateId_key" ON "PartyFindSlot"("partyFindPostId", "partyFindApplyStateId");
