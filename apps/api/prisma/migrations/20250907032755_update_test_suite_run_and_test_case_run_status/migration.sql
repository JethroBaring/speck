/*
  Warnings:

  - The `status` column on the `test_suite_runs` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."TestSuiteRunStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED', 'TIMEOUT');

-- AlterEnum
ALTER TYPE "public"."TestCaseRunStatus" ADD VALUE 'PENDING';

-- AlterEnum
ALTER TYPE "public"."TestStepStatus" ADD VALUE 'PENDING';

-- AlterTable
ALTER TABLE "public"."test_suite_runs" DROP COLUMN "status",
ADD COLUMN     "status" "public"."TestSuiteRunStatus" NOT NULL DEFAULT 'RUNNING';

-- DropEnum
DROP TYPE "public"."TestRunStatus";
