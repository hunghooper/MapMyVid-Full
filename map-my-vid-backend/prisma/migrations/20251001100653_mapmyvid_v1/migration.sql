-- CreateEnum
CREATE TYPE "VideoStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('RESTAURANT', 'CAFE', 'HOTEL', 'ATTRACTION', 'STORE', 'OTHER');

-- CreateEnum
CREATE TYPE "SearchStatus" AS ENUM ('PENDING', 'FOUND', 'NOT_FOUND', 'ERROR');

-- CreateTable
CREATE TABLE "videos" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "mime_type" TEXT NOT NULL,
    "duration" INTEGER,
    "city" TEXT,
    "country" TEXT,
    "summary" TEXT,
    "status" "VideoStatus" NOT NULL DEFAULT 'PROCESSING',
    "error_message" TEXT,
    "processing_time_ms" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "video_id" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "type" "LocationType" NOT NULL,
    "context" TEXT NOT NULL,
    "ai_address" TEXT,
    "google_name" TEXT,
    "formatted_address" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "place_id" TEXT,
    "rating" DOUBLE PRECISION,
    "google_maps_url" TEXT,
    "types" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "search_status" "SearchStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "locations_video_id_idx" ON "locations"("video_id");

-- CreateIndex
CREATE INDEX "locations_place_id_idx" ON "locations"("place_id");

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
