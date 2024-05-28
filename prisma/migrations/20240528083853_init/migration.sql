/*
  Warnings:

  - A unique constraint covering the columns `[issueId]` on the table `Question` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `issueId` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Question` ADD COLUMN `issueId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Question_issueId_key` ON `Question`(`issueId`);
