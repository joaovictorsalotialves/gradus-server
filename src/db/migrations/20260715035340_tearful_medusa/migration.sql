ALTER TABLE "tasks" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "deleted_at" DROP NOT NULL;