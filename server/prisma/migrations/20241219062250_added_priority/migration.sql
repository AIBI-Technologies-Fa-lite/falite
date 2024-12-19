-- AlterTable
ALTER TABLE `Verification` ADD COLUMN `priority` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `working` BOOLEAN NOT NULL DEFAULT false;
