/*
  Warnings:

  - The values [REWORK,COMPLETED] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Branch` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('PENDING', 'REJECTED', 'ONGOING', 'CANNOTVERIFY', 'REFER', 'POSITIVE', 'NEGATIVE', 'REASSIGN', 'REVIEW');
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
COMMIT;

-- CreateIndex
CREATE UNIQUE INDEX "Branch_code_key" ON "Branch"("code");
