/*
  Warnings:

  - You are about to drop the column `error_message` on the `test_case_runs` table. All the data in the column will be lost.
  - You are about to drop the column `logs` on the `test_case_runs` table. All the data in the column will be lost.
  - You are about to drop the column `stack_trace` on the `test_case_runs` table. All the data in the column will be lost.
  - You are about to drop the column `browser` on the `test_suite_runs` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `test_suite_runs` table. All the data in the column will be lost.
  - You are about to drop the column `environment` on the `test_suite_runs` table. All the data in the column will be lost.
  - You are about to drop the column `error_message` on the `test_suite_runs` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `test_suite_runs` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `test_suite_runs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."test_case_runs" DROP COLUMN "error_message",
DROP COLUMN "logs",
DROP COLUMN "stack_trace";

-- AlterTable
ALTER TABLE "public"."test_suite_runs" DROP COLUMN "browser",
DROP COLUMN "created_at",
DROP COLUMN "environment",
DROP COLUMN "error_message",
DROP COLUMN "updated_at",
DROP COLUMN "version";
