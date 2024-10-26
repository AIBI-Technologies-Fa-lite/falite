/*
  Warnings:

  - You are about to drop the column `final` on the `Verification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CommonData" ADD COLUMN     "final" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Verification" DROP COLUMN "final";
