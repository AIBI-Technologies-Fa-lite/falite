/*
  Warnings:

  - Added the required column `of_id` to the `Verification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Verification" ADD COLUMN     "of_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_of_id_fkey" FOREIGN KEY ("of_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
