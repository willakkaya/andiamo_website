CREATE TABLE "employees" (
	"id" text PRIMARY KEY NOT NULL,
	"name_key" text NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"location" text NOT NULL,
	"pin_hash" text NOT NULL,
	"is_manager" boolean DEFAULT false NOT NULL,
	"acknowledged_at" timestamp with time zone,
	"signature_name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "employees_name_key_unique" UNIQUE("name_key")
);
--> statement-breakpoint
CREATE TABLE "module_progress" (
	"id" text PRIMARY KEY NOT NULL,
	"employee_id" text NOT NULL,
	"module_id" text NOT NULL,
	"best_pct" double precision DEFAULT 0 NOT NULL,
	"passed" boolean DEFAULT false NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"last_attempt_at" timestamp with time zone DEFAULT now() NOT NULL,
	"wrong_question_ids" text[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "module_progress" ADD CONSTRAINT "module_progress_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "module_progress_employee_module_idx" ON "module_progress" USING btree ("employee_id","module_id");