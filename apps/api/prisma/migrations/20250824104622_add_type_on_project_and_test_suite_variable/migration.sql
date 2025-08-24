/*
  Warnings:

  - Added the required column `type` to the `project_variables` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `test_suite_variables` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."project_variables" ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."test_suite_variables" ADD COLUMN     "type" TEXT NOT NULL;
