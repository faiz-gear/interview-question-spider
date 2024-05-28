-- CreateTable
CREATE TABLE `Question` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `level` VARCHAR(255) NOT NULL,
    `link` VARCHAR(255) NOT NULL,
    `answer` TEXT NOT NULL,

    UNIQUE INDEX `Question_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Label` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `Label_label_key`(`label`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QuestionsOnLabels` (
    `QuestionId` INTEGER NOT NULL,
    `LabelId` INTEGER NOT NULL,

    PRIMARY KEY (`QuestionId`, `LabelId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `QuestionsOnLabels` ADD CONSTRAINT `QuestionsOnLabels_QuestionId_fkey` FOREIGN KEY (`QuestionId`) REFERENCES `Question`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuestionsOnLabels` ADD CONSTRAINT `QuestionsOnLabels_LabelId_fkey` FOREIGN KEY (`LabelId`) REFERENCES `Label`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
