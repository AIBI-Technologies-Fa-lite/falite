/*
  Warnings:

  - Added the required column `phone` to the `Verification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Verification` ADD COLUMN `lat` DOUBLE NULL,
    ADD COLUMN `long` DOUBLE NULL,
    ADD COLUMN `phone` INTEGER NOT NULL;
