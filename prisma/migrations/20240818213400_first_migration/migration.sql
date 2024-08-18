-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `participantCI` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_participantCI_key`(`participantCI`),
    INDEX `User_participantCI_idx`(`participantCI`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Participant` (
    `CI` VARCHAR(191) NOT NULL,
    `firstname` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `telephone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `birthDate` DATETIME(3) NOT NULL,
    `institutionISO` INTEGER NOT NULL,
    `gender` ENUM('MALE', 'FEMALE') NOT NULL,
    `participantType` ENUM('STUDENT', 'TEACHER') NOT NULL,

    INDEX `Participant_institutionISO_idx`(`institutionISO`),
    PRIMARY KEY (`CI`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Institution` (
    `ISO` INTEGER NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `abbreviation` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`ISO`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SquadParticipant` (
    `participantCI` VARCHAR(191) NOT NULL,
    `disciplineId` VARCHAR(191) NOT NULL,
    `roleId` VARCHAR(191) NOT NULL,

    INDEX `SquadParticipant_participantCI_idx`(`participantCI`),
    INDEX `SquadParticipant_roleId_idx`(`roleId`),
    INDEX `SquadParticipant_disciplineId_idx`(`disciplineId`),
    PRIMARY KEY (`participantCI`, `disciplineId`, `roleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Discipline` (
    `disciplineId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `genreCategory` ENUM('FEMALE', 'MALE', 'MIXED') NOT NULL,

    PRIMARY KEY (`disciplineId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DisciplineRole` (
    `roleId` VARCHAR(191) NOT NULL,
    `disciplineId` VARCHAR(191) NOT NULL,
    `role` ENUM('TEAM_MANAGER', 'PLAYER', 'COACHING_STAFF') NOT NULL,
    `restrictGenres` BOOLEAN NOT NULL,
    `participantsLimit` INTEGER NOT NULL,
    `allowedParticipantType` ENUM('STUDENT', 'TEACHER') NOT NULL,

    UNIQUE INDEX `DisciplineRole_roleId_key`(`roleId`),
    INDEX `DisciplineRole_disciplineId_idx`(`disciplineId`),
    PRIMARY KEY (`disciplineId`, `role`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
