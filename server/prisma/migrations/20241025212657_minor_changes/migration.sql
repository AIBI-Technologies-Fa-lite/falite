/*
  Warnings:

  - Made the column `clientName` on table `CommonData` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CommonData" ALTER COLUMN "clientName" SET NOT NULL;
