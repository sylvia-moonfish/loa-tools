-- CreateEnum
CREATE TYPE "AlarmMessageType" AS ENUM ('PARTY_FIND_POST_SOMEONE_APPLIED', 'PARTY_FIND_POST_RECRUIT_COMPLETE', 'PARTY_FIND_POST_APPROVED');

-- CreateTable
CREATE TABLE "Alarm" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "message" "AlarmMessageType" NOT NULL,
    "link" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Alarm_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Alarm" ADD CONSTRAINT "Alarm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
