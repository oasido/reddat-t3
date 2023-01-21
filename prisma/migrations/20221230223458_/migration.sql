/*
  Warnings:

  - You are about to drop the column `image` on the `Subreddit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Subreddit" DROP COLUMN "image";
ALTER TABLE "Subreddit" ADD COLUMN     "avatar" STRING;
ALTER TABLE "Subreddit" ADD COLUMN     "cover" STRING;
