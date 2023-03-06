-- CreateEnum
CREATE TYPE "Language" AS ENUM ('KR', 'EN');

-- CreateEnum
CREATE TYPE "EngravingType" AS ENUM ('COMBAT', 'CLASS');

-- CreateEnum
CREATE TYPE "Job" AS ENUM ('DESTROYER', 'GUNLANCER', 'BERSERKER', 'PALADIN', 'STRIKER', 'WARDANCER', 'SCRAPPER', 'SOULFIST', 'GLAIVIER', 'DEADEYE', 'ARTILLERIST', 'SHARPSHOOTER', 'GUNSLINGER', 'BARD', 'ARCANIST', 'SORCERESS', 'DEATHBLADE', 'SHADOWHUNTER');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('CHAOS_DUNGEON', 'GUARDIAN_RAID', 'ABYSSAL_DUNGEON', 'ABYSS_RAID', 'LEGION_RAID');

-- CreateEnum
CREATE TYPE "PartyFindPostState" AS ENUM ('RECRUITING', 'FULL', 'RERECRUITING', 'EXPIRED');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('DPS', 'SUPPORT', 'ANY');

-- CreateEnum
CREATE TYPE "PartyFindApplyStateValue" AS ENUM ('WAITING', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "AlarmMessageType" AS ENUM ('PARTY_FIND_POST_SOMEONE_APPLIED', 'PARTY_FIND_POST_RECRUIT_COMPLETE', 'PARTY_FIND_POST_APPROVED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "discordId" TEXT NOT NULL,
    "discordUsername" TEXT NOT NULL,
    "discordDiscriminator" TEXT NOT NULL,
    "discordAvatarHash" TEXT,
    "languages" "Language"[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "abbr" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Server" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guild" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roster" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "level" INTEGER NOT NULL,
    "serverId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Roster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stronghold" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "rosterId" TEXT NOT NULL,

    CONSTRAINT "Stronghold_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL,
    "job" "Job" NOT NULL,
    "onTimeBadge" INTEGER NOT NULL,
    "friendlyBadge" INTEGER NOT NULL,
    "professionalBadge" INTEGER NOT NULL,
    "combatLevel" INTEGER NOT NULL,
    "itemLevel" DOUBLE PRECISION NOT NULL,
    "comment" TEXT NOT NULL,
    "crit" INTEGER NOT NULL,
    "specialization" INTEGER NOT NULL,
    "domination" INTEGER NOT NULL,
    "swiftness" INTEGER NOT NULL,
    "endurance" INTEGER NOT NULL,
    "expertise" INTEGER NOT NULL,
    "rosterId" TEXT NOT NULL,
    "guildId" TEXT,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Engraving" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameKo" TEXT NOT NULL,
    "isPositive" BOOLEAN NOT NULL,
    "iconPath" TEXT NOT NULL,
    "type" "EngravingType" NOT NULL,
    "job" "Job",

    CONSTRAINT "Engraving_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EngravingSlot" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "index" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "engravingId" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,

    CONSTRAINT "EngravingSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Content" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameKo" TEXT NOT NULL,
    "contentType" "ContentType" NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentTab" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "index" INTEGER NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameKo" TEXT NOT NULL,
    "difficultyNameEn" TEXT,
    "difficultyNameKo" TEXT,
    "contentType" "ContentType" NOT NULL,
    "contentId" TEXT NOT NULL,

    CONSTRAINT "ContentTab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentStage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "index" INTEGER NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameKo" TEXT NOT NULL,
    "tier" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "groupSize" INTEGER,
    "contentType" "ContentType" NOT NULL,
    "contentTabId" TEXT NOT NULL,

    CONSTRAINT "ContentStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartyFindPost" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "state" "PartyFindPostState" NOT NULL,
    "contentType" "ContentType" NOT NULL,
    "isPracticeParty" BOOLEAN NOT NULL,
    "isReclearParty" BOOLEAN NOT NULL,
    "title" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "recurring" BOOLEAN NOT NULL,
    "contentStageId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,

    CONSTRAINT "PartyFindPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartyFindSlot" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "index" INTEGER NOT NULL,
    "jobType" "JobType" NOT NULL,
    "partyFindPostId" TEXT NOT NULL,

    CONSTRAINT "PartyFindSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartyFindApplyState" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "state" "PartyFindApplyStateValue" NOT NULL,
    "partyFindPostId" TEXT NOT NULL,
    "partyFindSlotId" TEXT,
    "characterId" TEXT NOT NULL,

    CONSTRAINT "PartyFindApplyState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alarm" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "message" "AlarmMessageType" NOT NULL,
    "link" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Alarm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_discordId_key" ON "User"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "Region_name_key" ON "Region"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Region_abbr_key" ON "Region"("abbr");

-- CreateIndex
CREATE UNIQUE INDEX "Region_shortName_key" ON "Region"("shortName");

-- CreateIndex
CREATE UNIQUE INDEX "Server_name_key" ON "Server"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Guild_name_serverId_key" ON "Guild"("name", "serverId");

-- CreateIndex
CREATE UNIQUE INDEX "Roster_serverId_userId_key" ON "Roster"("serverId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Stronghold_rosterId_key" ON "Stronghold"("rosterId");

-- CreateIndex
CREATE UNIQUE INDEX "Character_name_rosterId_key" ON "Character"("name", "rosterId");

-- CreateIndex
CREATE UNIQUE INDEX "EngravingSlot_characterId_index_key" ON "EngravingSlot"("characterId", "index");

-- CreateIndex
CREATE UNIQUE INDEX "EngravingSlot_characterId_engravingId_key" ON "EngravingSlot"("characterId", "engravingId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentTab_index_contentId_key" ON "ContentTab"("index", "contentId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentStage_index_contentTabId_key" ON "ContentStage"("index", "contentTabId");

-- CreateIndex
CREATE UNIQUE INDEX "PartyFindSlot_index_partyFindPostId_key" ON "PartyFindSlot"("index", "partyFindPostId");

-- CreateIndex
CREATE UNIQUE INDEX "PartyFindApplyState_partyFindSlotId_key" ON "PartyFindApplyState"("partyFindSlotId");

-- CreateIndex
CREATE UNIQUE INDEX "PartyFindApplyState_partyFindPostId_characterId_key" ON "PartyFindApplyState"("partyFindPostId", "characterId");

-- AddForeignKey
ALTER TABLE "Server" ADD CONSTRAINT "Server_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guild" ADD CONSTRAINT "Guild_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Roster" ADD CONSTRAINT "Roster_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Roster" ADD CONSTRAINT "Roster_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stronghold" ADD CONSTRAINT "Stronghold_rosterId_fkey" FOREIGN KEY ("rosterId") REFERENCES "Roster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_rosterId_fkey" FOREIGN KEY ("rosterId") REFERENCES "Roster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EngravingSlot" ADD CONSTRAINT "EngravingSlot_engravingId_fkey" FOREIGN KEY ("engravingId") REFERENCES "Engraving"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EngravingSlot" ADD CONSTRAINT "EngravingSlot_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentTab" ADD CONSTRAINT "ContentTab_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentStage" ADD CONSTRAINT "ContentStage_contentTabId_fkey" FOREIGN KEY ("contentTabId") REFERENCES "ContentTab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartyFindPost" ADD CONSTRAINT "PartyFindPost_contentStageId_fkey" FOREIGN KEY ("contentStageId") REFERENCES "ContentStage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartyFindPost" ADD CONSTRAINT "PartyFindPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartyFindPost" ADD CONSTRAINT "PartyFindPost_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartyFindSlot" ADD CONSTRAINT "PartyFindSlot_partyFindPostId_fkey" FOREIGN KEY ("partyFindPostId") REFERENCES "PartyFindPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartyFindApplyState" ADD CONSTRAINT "PartyFindApplyState_partyFindPostId_fkey" FOREIGN KEY ("partyFindPostId") REFERENCES "PartyFindPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartyFindApplyState" ADD CONSTRAINT "PartyFindApplyState_partyFindSlotId_fkey" FOREIGN KEY ("partyFindSlotId") REFERENCES "PartyFindSlot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartyFindApplyState" ADD CONSTRAINT "PartyFindApplyState_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alarm" ADD CONSTRAINT "Alarm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
