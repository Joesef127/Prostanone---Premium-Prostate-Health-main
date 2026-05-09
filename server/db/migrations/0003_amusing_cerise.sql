DO $$  
BEGIN  
  IF EXISTS (  
    SELECT 1  
    FROM "admins"  
    WHERE "verification_token" IS NOT NULL  
      AND length("verification_token") > 64  
  ) THEN  
    RAISE EXCEPTION 'admins.verification_token has values longer than 64 characters';  
  END IF;  
END $$;  

ALTER TABLE "admins" ALTER COLUMN "verification_token" SET DATA TYPE varchar(64);--> statement-breakpoint  

ALTER TABLE "admins" ADD COLUMN "login_challenge" varchar(64);--> statement-breakpoint  
ALTER TABLE "admins" ADD COLUMN "login_challenge_expires_at" timestamp;  
ALTER TABLE "admins"  
  ADD CONSTRAINT "admins_login_challenge_pair_chk"  
  CHECK (("login_challenge" IS NULL) = ("login_challenge_expires_at" IS NULL));