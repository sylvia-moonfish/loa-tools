-- CreateEnum
CREATE TYPE "Job" AS ENUM ('GUNLANCER', 'BERSERKER', 'PALADIN', 'STRIKER', 'WARDANCER', 'SCRAPPER', 'SOULFIST', 'GLAIVIER', 'DEADEYE', 'ARTILLERIST', 'SHARPSHOOTER', 'GUNSLINGER', 'BARD', 'SORCERESS', 'DEATHBLADE', 'SHADOWHUNTER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "discordId" TEXT NOT NULL,
    "discordUsername" TEXT NOT NULL,
    "discordDiscriminator" TEXT NOT NULL,
    "discordAvatarHash" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

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
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL,
    "job" "Job" NOT NULL,
    "itemLevel" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChaosDungeon" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameKo" TEXT NOT NULL,

    CONSTRAINT "ChaosDungeon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChaosDungeonTab" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "index" INTEGER NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameKo" TEXT NOT NULL,
    "chaosDungeonId" TEXT NOT NULL,

    CONSTRAINT "ChaosDungeonTab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChaosDungeonStage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "index" INTEGER NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameKo" TEXT NOT NULL,
    "tier" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "chaosDungeonTabId" TEXT NOT NULL,

    CONSTRAINT "ChaosDungeonStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuardianRaid" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameKo" TEXT NOT NULL,

    CONSTRAINT "GuardianRaid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuardianRaidTab" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "index" INTEGER NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameKo" TEXT NOT NULL,
    "guardianRaidId" TEXT NOT NULL,

    CONSTRAINT "GuardianRaidTab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuardianRaidStage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "index" INTEGER NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameKo" TEXT NOT NULL,
    "tier" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "guardianRaidTabId" TEXT NOT NULL,

    CONSTRAINT "GuardianRaidStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AbyssalDungeon" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameKo" TEXT NOT NULL,

    CONSTRAINT "AbyssalDungeon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AbyssalDungeonTab" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "index" INTEGER NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameKo" TEXT NOT NULL,
    "difficultyNameEn" TEXT,
    "difficultyNameKo" TEXT,
    "abyssalDungeonId" TEXT NOT NULL,

    CONSTRAINT "AbyssalDungeonTab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AbyssalDungeonStage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "index" INTEGER NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameKo" TEXT NOT NULL,
    "tier" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "groupSize" INTEGER NOT NULL,
    "abyssalDungeonTabId" TEXT NOT NULL,

    CONSTRAINT "AbyssalDungeonStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AbyssRaid" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameKo" TEXT NOT NULL,

    CONSTRAINT "AbyssRaid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AbyssRaidTab" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "index" INTEGER NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameKo" TEXT NOT NULL,
    "abyssRaidId" TEXT NOT NULL,

    CONSTRAINT "AbyssRaidTab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AbyssRaidStage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "index" INTEGER NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameKo" TEXT NOT NULL,
    "tier" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "abyssRaidTabId" TEXT NOT NULL,

    CONSTRAINT "AbyssRaidStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegionRaid" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameKo" TEXT NOT NULL,

    CONSTRAINT "LegionRaid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegionRaidTab" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "index" INTEGER NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameKo" TEXT NOT NULL,
    "difficultyNameEn" TEXT NOT NULL,
    "difficultyNameKo" TEXT NOT NULL,
    "legionRaidId" TEXT NOT NULL,

    CONSTRAINT "LegionRaidTab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegionRaidStage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "index" INTEGER NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameKo" TEXT NOT NULL,
    "tier" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "legionRaidTabId" TEXT NOT NULL,

    CONSTRAINT "LegionRaidStage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_discordId_key" ON "User"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "Region_name_key" ON "Region"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Server_name_key" ON "Server"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ChaosDungeonTab_index_chaosDungeonId_key" ON "ChaosDungeonTab"("index", "chaosDungeonId");

-- CreateIndex
CREATE UNIQUE INDEX "ChaosDungeonStage_index_chaosDungeonTabId_key" ON "ChaosDungeonStage"("index", "chaosDungeonTabId");

-- CreateIndex
CREATE UNIQUE INDEX "GuardianRaidTab_index_guardianRaidId_key" ON "GuardianRaidTab"("index", "guardianRaidId");

-- CreateIndex
CREATE UNIQUE INDEX "GuardianRaidStage_index_guardianRaidTabId_key" ON "GuardianRaidStage"("index", "guardianRaidTabId");

-- CreateIndex
CREATE UNIQUE INDEX "AbyssalDungeonTab_index_abyssalDungeonId_key" ON "AbyssalDungeonTab"("index", "abyssalDungeonId");

-- CreateIndex
CREATE UNIQUE INDEX "AbyssalDungeonStage_index_abyssalDungeonTabId_key" ON "AbyssalDungeonStage"("index", "abyssalDungeonTabId");

-- CreateIndex
CREATE UNIQUE INDEX "AbyssRaidTab_index_abyssRaidId_key" ON "AbyssRaidTab"("index", "abyssRaidId");

-- CreateIndex
CREATE UNIQUE INDEX "AbyssRaidStage_index_abyssRaidTabId_key" ON "AbyssRaidStage"("index", "abyssRaidTabId");

-- CreateIndex
CREATE UNIQUE INDEX "LegionRaidTab_index_legionRaidId_key" ON "LegionRaidTab"("index", "legionRaidId");

-- CreateIndex
CREATE UNIQUE INDEX "LegionRaidStage_index_legionRaidTabId_key" ON "LegionRaidStage"("index", "legionRaidTabId");

-- AddForeignKey
ALTER TABLE "Server" ADD CONSTRAINT "Server_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChaosDungeonTab" ADD CONSTRAINT "ChaosDungeonTab_chaosDungeonId_fkey" FOREIGN KEY ("chaosDungeonId") REFERENCES "ChaosDungeon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChaosDungeonStage" ADD CONSTRAINT "ChaosDungeonStage_chaosDungeonTabId_fkey" FOREIGN KEY ("chaosDungeonTabId") REFERENCES "ChaosDungeonTab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuardianRaidTab" ADD CONSTRAINT "GuardianRaidTab_guardianRaidId_fkey" FOREIGN KEY ("guardianRaidId") REFERENCES "GuardianRaid"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuardianRaidStage" ADD CONSTRAINT "GuardianRaidStage_guardianRaidTabId_fkey" FOREIGN KEY ("guardianRaidTabId") REFERENCES "GuardianRaidTab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AbyssalDungeonTab" ADD CONSTRAINT "AbyssalDungeonTab_abyssalDungeonId_fkey" FOREIGN KEY ("abyssalDungeonId") REFERENCES "AbyssalDungeon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AbyssalDungeonStage" ADD CONSTRAINT "AbyssalDungeonStage_abyssalDungeonTabId_fkey" FOREIGN KEY ("abyssalDungeonTabId") REFERENCES "AbyssalDungeonTab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AbyssRaidTab" ADD CONSTRAINT "AbyssRaidTab_abyssRaidId_fkey" FOREIGN KEY ("abyssRaidId") REFERENCES "AbyssRaid"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AbyssRaidStage" ADD CONSTRAINT "AbyssRaidStage_abyssRaidTabId_fkey" FOREIGN KEY ("abyssRaidTabId") REFERENCES "AbyssRaidTab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegionRaidTab" ADD CONSTRAINT "LegionRaidTab_legionRaidId_fkey" FOREIGN KEY ("legionRaidId") REFERENCES "LegionRaid"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegionRaidStage" ADD CONSTRAINT "LegionRaidStage_legionRaidTabId_fkey" FOREIGN KEY ("legionRaidTabId") REFERENCES "LegionRaidTab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
