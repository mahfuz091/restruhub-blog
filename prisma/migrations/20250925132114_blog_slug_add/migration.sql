/*
  Warnings:

  - A unique constraint covering the columns `[postSlug]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `postSlug` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Post" ADD COLUMN     "postSlug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Post_postSlug_key" ON "public"."Post"("postSlug");
