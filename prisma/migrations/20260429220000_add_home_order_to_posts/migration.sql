-- Add explicit editorial ordering for home page listings.
ALTER TABLE "Post"
ADD COLUMN "homeOrder" INTEGER NOT NULL DEFAULT 999;
