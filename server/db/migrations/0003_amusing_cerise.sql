ALTER TABLE "admins" ALTER COLUMN "verification_token" SET DATA TYPE varchar(64);--> statement-breakpoint
ALTER TABLE "admins" ADD COLUMN "login_challenge" varchar(64);--> statement-breakpoint
ALTER TABLE "admins" ADD COLUMN "login_challenge_expires_at" timestamp;