ALTER TABLE "admins" ADD COLUMN "pending_two_factor_method" varchar(10);--> statement-breakpoint
ALTER TABLE "admins" ADD COLUMN "pending_phone" varchar(20);