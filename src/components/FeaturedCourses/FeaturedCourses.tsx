import { Link } from "react-router-dom";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import CourseItem from "../CourseItem";
import type { Course as BackendCourse } from "@/types/course.type";
import type { Category } from "@/types/category.type";
import { CourseApi } from "@/api/course.api";
import AnimatedBackground from "./AnimatedBackground";

export interface Course {
  id: string;
  title: string;
  summary: string;
  label: string;
  instructor: string;
  published: string;
  url: string;
  image: string;
  lessonsCount?: number;
  students?: number;
  likes?: number;
  rating?: number;
  ratingCount?: number;
  hours?: number;
}

const useNewestCourses = (n = 4) =>
  useQuery({
    queryKey: ["courses", "newest", n],
    queryFn: () => CourseApi.getNewest(n),
  });

const FeaturedCourses = () => {
  const { data: newest, isLoading, isError } = useNewestCourses(4);


  return (
    <section className="relative py-32 main-layout overflow-hidden bg-gradient-to-br from-slate-50 via-sky-50/30 to-blue-50/20">
      <AnimatedBackground />

      <div className="relative z-10 container mx-auto flex flex-col items-center gap-12 lg:px-10">
        <div className="relative w-full flex flex-col items-center text-center">
          <div className="relative mb-6">
            <Badge className="relative bg-gradient-to-r from-[#155e94] to-blue-900 text-white text-[16px] px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <span className="relative z-10">Khám phá ngay</span>
            </Badge>
          </div>

          <div className="relative mb-3 md:mb-4 lg:mb-6">
            <h2 className="text-5xl font-bold md:text-4xl lg:max-w-3xl lg:text-5xl bg-gradient-to-r  bg-primary-color bg-clip-text text-transparent animate-fade-in">
              Các khoá học nổi bật
            </h2>
            <div
              className="absolute inset-0 text-5xl font-bold md:text-4xl lg:max-w-3xl lg:text-5xl text-[#155e94]/15 blur-md -z-10"
              style={{ animationDelay: "0.2s" }}
            >
              Hành trình học tập nổi bật
            </div>
          </div>

          <p
            className="mb-6 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            Những khoá học chất lượng, được lựa chọn đặc biệt để giúp bạn chinh
            phục tiếng Anh hiệu quả hơn.
          </p>

          <div className="animate-slide-up" style={{ animationDelay: "0.6s" }}>
            <Button
              className="rounded-full bg-gradient-to-r bg-primary-color text-white px-8 py-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
              asChild
            >
              <Link to="/courses" className="flex items-center font-semibold">
                Xem tất cả khoá học
                <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading && (
            <div className="col-span-full text-center text-gray-500">
              Đang tải khoá học mới nhất...
            </div>
          )}
          {isError && !isLoading && (
            <div className="col-span-full text-center text-red-500">
              Tải khoá học thất bại. Vui lòng thử lại sau.
            </div>
          )}
          {newest &&
            newest.length > 0 &&
            newest.map((c) => {
              const mapped: BackendCourse = {
                id: c.id,
                title: c.title,
                shortDescription: c.shortDescription,
                detailDescription: c.detailDescription,
                learningOutcomes: c.learningOutcomes,
                requirements: c.requirements,
                status: c.status,
                price: c.price,
                discountPrice: c.discountPrice ?? null,
                isFree: c.isFree,
                category: c.category as Category,
                teacher: c.teacher,
                thumbnailUrl: c.thumbnailUrl,
                createdAt: c.createdAt,
                updatedAt: c.updatedAt,
                duration: c.duration,
                chaptersDetails: c.chaptersDetails ?? [],
                numberOfLessons: c.numberOfLessons,
              };
              return <CourseItem key={c.id} course={mapped} />;
            })}
          {newest && newest.length === 0 && !isLoading && (
            <div className="col-span-full text-center text-gray-500">
              Không có khoá học nào.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
