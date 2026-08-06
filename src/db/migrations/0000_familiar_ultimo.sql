CREATE TYPE "public"."task_status" AS ENUM('pending', 'completed', 'overdue');--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"describe" text,
	"status" "task_status" DEFAULT 'pending' NOT NULL,
	"slug" text NOT NULL,
	"due_date" timestamp NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp,
	CONSTRAINT "tasks_slug_unique" UNIQUE("slug")
);
