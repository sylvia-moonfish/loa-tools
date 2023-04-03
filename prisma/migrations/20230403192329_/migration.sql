-- CreateEnum
CREATE TYPE "ContentTabType" AS ENUM ('VALTAN', 'VYKAS', 'KAKUL_SAYDON', 'BRELSHAZA');

-- AlterTable
ALTER TABLE "ContentTab" ADD COLUMN     "contentTabType" "ContentTabType";
