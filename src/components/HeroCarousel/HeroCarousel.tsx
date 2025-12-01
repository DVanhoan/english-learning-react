import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";

export default function HeroCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const progress = (current * 100) / count;
  React.useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);
  return (
    <div className="mx-auto w-full py-0">
      <Carousel setApi={setApi} className="w-full overflow-hidden">
        <CarouselContent>
          <CarouselItem className="w-full">
            <Card className="w-full overflow-hidden p-0">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row w-full md:min-h-[240px] lg:min-h-[280px]">
                  {/* Hình ảnh bên trái - đã giảm chiều cao tối đa */}
                  <div className="w-full md:w-[42%] lg:w-[38%] max-h-[200px] md:max-h-[300px]">
                    <img
                      src="/images/flashcard.jpg"
                      alt="flashcard"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Nội dung chữ bên phải - mô tả tính năng flashcard */}
                  <div className="w-full md:w-[58%] lg:w-[62%] flex flex-col justify-center px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 bg-white">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 leading-snug text-balance text-primary-color">
                      Ghi nhớ từ vựng dễ dàng với Flashcard
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base mb-4 break-words max-w-prose text-pretty leading-normal text-primary-color">
                      Hệ thống flashcard thông minh giúp bạn học từ vựng hiệu
                      quả hơn thông qua lặp lại ngắt quãng (spaced repetition).
                      Mỗi thẻ sẽ giúp bạn ghi nhớ từ mới, cách phát âm, ví dụ sử
                      dụng, và hình ảnh minh họa sinh động.
                    </p>
                    <button className="text-white px-4 py-2 rounded-md text-sm font-medium w-fit hover:bg-primary-color/90 transition bg-primary-color">
                      Khám phá ngay
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
          <CarouselItem className="w-full">
            <Card className="w-full overflow-hidden p-0">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row w-full md:min-h-[240px] lg:min-h-[280px]">
                  {/* Hình ảnh minh họa luyện nghe */}
                  <div className="w-full md:w-[42%] lg:w-[38%] max-h-[200px] md:max-h-[300px]">
                    <img
                      src="/images/dictation.jpg"
                      alt="dictation"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Nội dung chữ bên phải */}
                  <div className="w-full md:w-[58%] lg:w-[62%] flex flex-col justify-center px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 bg-white">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 leading-snug text-balance text-primary-color">
                      Rèn luyện kỹ năng nghe – chép chính tả hiệu quả
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base mb-4 break-words max-w-prose text-pretty leading-normal text-primary-color">
                      Cải thiện khả năng nghe hiểu và chính tả tiếng Anh với các
                      bài luyện nghe thực tế. Nghe từng câu, nhập lại nội dung
                      và nhận phản hồi tức thì giúp bạn tiến bộ mỗi ngày. Phù
                      hợp cho mọi trình độ – từ cơ bản đến nâng cao.
                    </p>
                    <button className="text-white px-4 py-2 rounded-md text-sm font-medium w-fit hover:bg-primary-color/90 transition bg-primary-color">
                      Bắt đầu luyện nghe
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
          <CarouselItem className="w-full">
            <Card className="w-full overflow-hidden p-0">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row w-full md:min-h-[240px] lg:min-h-[280px]">
                  {/* Hình ảnh minh họa khóa học */}
                  <div className="w-full md:w-[42%] lg:w-[38%] max-h-[200px] md:max-h-[300px]">
                    <img
                      src="/images/courses.jpg"
                      alt="carousel-courses"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Nội dung chữ bên phải */}
                  <div className="w-full md:w-[58%] lg:w-[62%] flex flex-col justify-center px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 bg-white">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 leading-snug text-balance text-primary-color">
                      Khoá học đa dạng, phù hợp mọi trình độ
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base mb-4 break-words max-w-prose text-pretty leading-normal text-primary-color">
                      Từ người mới bắt đầu đến học viên nâng cao, K-English cung
                      cấp các khoá học phong phú: Giao tiếp, luyện thi
                      TOEIC/IELTS, từ vựng theo chủ đề, và khoá học chuyên biệt
                      cho người đi làm. Lộ trình rõ ràng, bài kiểm tra định kỳ
                      giúp bạn học tập hiệu quả và có định hướng.
                    </p>
                    <button className="text-white px-4 py-2 rounded-md text-sm font-medium w-fit hover:bg-primary-color/90 transition bg-primary-color">
                      Xem các khoá học
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        </CarouselContent>

        <CarouselPrevious className="top-1/2 -translate-y-1/2 left-4" />
        <CarouselNext className="top-1/2 -translate-y-1/2 right-4" />
      </Carousel>

      <Progress
        value={progress}
        className="mt-4 w-24 ml-auto [&>div]:bg-primary-color"
      />
    </div>
  );
}
