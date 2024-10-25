/*
  Warnings:

  - You are about to drop the column `pincodeId` on the `Verification` table. All the data in the column will be lost.
  - You are about to drop the `Pincode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PincodeToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `pincode` to the `Verification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Verification" DROP CONSTRAINT "Verification_pincodeId_fkey";

-- DropForeignKey
ALTER TABLE "_PincodeToUser" DROP CONSTRAINT "_PincodeToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_PincodeToUser" DROP CONSTRAINT "_PincodeToUser_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "pincodes" INTEGER[];

-- AlterTable
ALTER TABLE "Verification" DROP COLUMN "pincodeId",
ADD COLUMN     "pincode" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Pincode";

-- DropTable
DROP TABLE "_PincodeToUser";
