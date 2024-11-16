-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('DIRECTOR', 'ADMIN', 'SUPERVISOR', 'CRE', 'OF', 'ACCOUNTS') NOT NULL;

-- AlterTable
ALTER TABLE `Verification` ADD COLUMN `billable` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `clientBillable` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `ofBillable` BOOLEAN NOT NULL DEFAULT false;
