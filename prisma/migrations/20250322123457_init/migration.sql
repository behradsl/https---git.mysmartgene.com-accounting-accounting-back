/*
  Warnings:

  - You are about to alter the column `serviceType` on the `Registry` table. The data in that column could be lost. The data in that column will be cast from `TinyText` to `Enum(EnumId(3))`.
  - You are about to alter the column `kitType` on the `Registry` table. The data in that column could be lost. The data in that column will be cast from `TinyText` to `Enum(EnumId(4))`.

*/
-- AlterTable
ALTER TABLE `Registry` MODIFY `serviceType` ENUM('WES100', 'WES200', 'WES300', 'BRCA_1_2', 'CANCER_PANEL_16_GENES', 'CANCER_PANEL_69_GENES', 'CANCER_PANEL_88_GENES', 'CANCER_PANEL_171_GENES', 'CANCER_PANEL_554_GENES', 'S16S_RNA', 'RNA_SEQ_6G', 'RNA_SEQ_12G', 'RNA_SEQ_9G', 'WHOLE_GENOME_30X', 'WHOLE_GENOME_10X', 'WHOLE_GENOME_1X') NOT NULL,
    MODIFY `kitType` ENUM('AGILENT_SURESELECT_V7', 'AGILENT_SURESELECT_V8', 'TWIST2') NOT NULL;
