-- CreateEnum
CREATE TYPE "Relic" AS ENUM ('SALVATION', 'DOMINION', 'BETRAYAL', 'YEARNING', 'DESTRUCTIVE', 'CHARMING', 'ENTROPY', 'NIGHTMARE', 'HALLUCINATION');

-- CreateTable
CREATE TABLE "RelicPiece" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "number" INTEGER NOT NULL,
    "relic" "Relic" NOT NULL,
    "characterId" TEXT NOT NULL,

    CONSTRAINT "RelicPiece_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RelicPiece" ADD CONSTRAINT "RelicPiece_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
