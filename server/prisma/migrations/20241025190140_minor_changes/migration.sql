/*
  Warnings:

  - Added the required column `status` to the `Verification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Verification" ADD COLUMN     "status" "Status" NOT NULL;
