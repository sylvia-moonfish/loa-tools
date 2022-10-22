-- CreateEnum
CREATE TYPE "PartyFindPostState" AS ENUM ('RECRUITING', 'FULL', 'RERECRUITING', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PartyFindApplyStateValue" AS ENUM ('WAITING', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- AlterTable
ALTER TABLE "PartyFindPost" ADD COLUMN     "state" "PartyFindPostState" NOT NULL DEFAULT 'RECRUITING';

-- CreateTable
CREATE TABLE "PartyFindApplyState" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "state" "PartyFindApplyStateValue" NOT NULL,
    "partyFindPostId" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,

    CONSTRAINT "PartyFindApplyState_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PartyFindApplyState" ADD CONSTRAINT "PartyFindApplyState_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartyFindApplyState" ADD CONSTRAINT "PartyFindApplyState_partyFindPostId_fkey" FOREIGN KEY ("partyFindPostId") REFERENCES "PartyFindPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
