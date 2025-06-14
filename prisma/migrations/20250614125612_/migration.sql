/*
  Warnings:

  - Added the required column `email` to the `magiclink` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `magiclink` DROP FOREIGN KEY `MagicLink_userId_fkey`;

-- AlterTable
ALTER TABLE `magiclink` ADD COLUMN `email` VARCHAR(191) NOT NULL,
    MODIFY `userId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `isActive` BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE `magiclink` ADD CONSTRAINT `MagicLink_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
