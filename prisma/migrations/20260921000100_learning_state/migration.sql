ALTER TABLE "Course" ADD COLUMN "slug" TEXT;
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");
ALTER TABLE "Progress" ADD COLUMN "lessonsCompleted" INTEGER NOT NULL DEFAULT 0;
