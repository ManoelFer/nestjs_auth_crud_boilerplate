/*
  Warnings:

  - A unique constraint covering the columns `[cellphone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cellphone` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `cellphone` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_cellphone_key` ON `User`(`cellphone`);
