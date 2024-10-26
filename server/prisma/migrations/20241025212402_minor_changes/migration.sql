/*
  Warnings:

  - Made the column `product` on table `CommonData` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CommonData" ALTER COLUMN "product" SET NOT NULL;
