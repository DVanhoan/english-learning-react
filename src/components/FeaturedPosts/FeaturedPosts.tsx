import { Link } from "react-router-dom";
import PostItem from "../PostItem";
import { Button } from "../ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import AnimatedBlogBackground from "./AnimatedBlogBackground";
import { useQuery } from "@tanstack/react-query";
import { PostApi } from "@/api/post.api";
import PostItemSkeleton from "../Skeleton/PostItemSkeleton";

export default function FeaturedPosts() {
  const { data: latestPostsData, isLoading } = useQuery({
    queryKey: ["latest-posts"],
    queryFn: () => PostApi.getLatestPosts(6),
  });

  const posts = latestPostsData?.data || [];

  return (
    <section className="relative w-full py-24 bg-gradient-to-br from-slate-50 via-sky-50/30 to-blue-50/20 overflow-hidden">
      <AnimatedBlogBackground />

      <div className="relative z-10 px-4 md:px-6 flex flex-col items-center max-w-7xl mx-auto">
        <div className="mb-20 space-y-8 text-center max-w-4xl">
          <div className="inline-flex items-center justify-center">
            <span className="bg-sky-100/80 backdrop-blur-sm text-sky-700 px-6 py-3 rounded-full text-sm font-bold tracking-wider uppercase shadow-lg">
              CHIA SẺ KIẾN THỨC
            </span>
          </div>

          <h2 className="text-4xl md:text-4xl lg:text-4xl font-bold text-slate-900 leading-tight">
            Những kiến thức quý giá để
            <br />
            <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              nâng cao trình độ tiếng Anh
            </span>
          </h2>
        </div>

        <div className="w-full mb-16">
          <div className="block lg:hidden">
            <Carousel className="w-full">
              <CarouselContent className="-ml-4">
                {isLoading ? (
                  <>
                    {[...Array(3)].map((_, i) => (
                      <CarouselItem
                        key={i}
                        className="pl-4 basis-full sm:basis-1/2"
                      >
                        <PostItemSkeleton />
                      </CarouselItem>
                    ))}
                  </>
                ) : (
                  posts.map((post) => (
                    <CarouselItem
                      key={post.id}
                      className="pl-4 basis-full sm:basis-1/2"
                    >
                      <PostItem post={post} />
                    </CarouselItem>
                  ))
                )}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          </div>

          <div className="hidden lg:grid grid-cols-3 gap-8">
            {isLoading ? (
              <>
                {[...Array(3)].map((_, i) => (
                  <PostItemSkeleton key={i} />
                ))}
              </>
            ) : (
              posts
                .slice(0, 3)
                .map((post) => <PostItem key={post.id} post={post} />)
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-slate-300 text-slate-700 hover:bg-white hover:border-sky-400 hover:text-sky-600 px-10 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm bg-white/80"
            asChild
          >
            <Link to="/posts">Xem tất cả bài viết</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
