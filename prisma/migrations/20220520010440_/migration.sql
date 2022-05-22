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
CREATE TABLE "ContentType" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentGroup" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "contentTypeId" TEXT NOT NULL,

    CONSTRAINT "ContentGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Content" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "order" INTEGER NOT NULL,
    "tier" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "groupSize" INTEGER NOT NULL,
    "requireFullParty" BOOLEAN NOT NULL,
    "iconSrc" TEXT,
    "bannerSrc" TEXT,
    "contentDifficultyId" TEXT,
    "contentGroupId" TEXT NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentDifficulty" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentDifficulty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocalizedText" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "text" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "contentTypeId" TEXT,
    "contentGroupId" TEXT,
    "contentId" TEXT,
    "contentDifficultyId" TEXT,

    CONSTRAINT "LocalizedText_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_discordId_key" ON "User"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "Region_name_key" ON "Region"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Server_name_key" ON "Server"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ContentGroup_order_contentTypeId_key" ON "ContentGroup"("order", "contentTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "Content_order_contentGroupId_key" ON "Content"("order", "contentGroupId");

-- AddForeignKey
ALTER TABLE "Server" ADD CONSTRAINT "Server_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentGroup" ADD CONSTRAINT "ContentGroup_contentTypeId_fkey" FOREIGN KEY ("contentTypeId") REFERENCES "ContentType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_contentGroupId_fkey" FOREIGN KEY ("contentGroupId") REFERENCES "ContentGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_contentDifficultyId_fkey" FOREIGN KEY ("contentDifficultyId") REFERENCES "ContentDifficulty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocalizedText" ADD CONSTRAINT "LocalizedText_contentTypeId_fkey" FOREIGN KEY ("contentTypeId") REFERENCES "ContentType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocalizedText" ADD CONSTRAINT "LocalizedText_contentGroupId_fkey" FOREIGN KEY ("contentGroupId") REFERENCES "ContentGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocalizedText" ADD CONSTRAINT "LocalizedText_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocalizedText" ADD CONSTRAINT "LocalizedText_contentDifficultyId_fkey" FOREIGN KEY ("contentDifficultyId") REFERENCES "ContentDifficulty"("id") ON DELETE SET NULL ON UPDATE CASCADE;
