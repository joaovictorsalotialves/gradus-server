CREATE TYPE "task_status" AS ENUM('pending', 'completed', 'overdue');--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "status" SET DATA TYPE "task_status" USING "status"::"task_status";--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "status" SET DEFAULT 'pending'::"task_status";