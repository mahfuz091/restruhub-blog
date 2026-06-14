-- AlterTable
ALTER TABLE "public"."Post" ADD COLUMN     "bannerAltText" TEXT,
ADD COLUMN     "canonicalUrl" TEXT,
ADD COLUMN     "metaDescription" VARCHAR(160),
ADD COLUMN     "metaTitle" VARCHAR(70),
ALTER COLUMN "shortDesc" DROP NOT NULL;
