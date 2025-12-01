import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function PostItemSkeleton() {
  return (
    <Card className="overflow-hidden w-full h-full flex flex-col">
      {/* Image Skeleton */}
      <div className="aspect-[16/9] w-full overflow-hidden">
        <Skeleton className="w-full h-full bg-gray-300 animate-pulse" />
      </div>

      {/* Nội dung */}
      <CardContent className="p-4 space-y-2 flex-1 flex flex-col">
        {/* Category + Date */}
        <div className="flex items-center gap-2 text-xs">
          <Skeleton className="h-4 w-20 rounded-full bg-gray-300 animate-pulse" />
          <Skeleton className="h-3 w-12 bg-gray-300 animate-pulse" />
        </div>

        {/* Title */}
        <Skeleton className="h-5 w-3/4 bg-gray-300 animate-pulse" />

        {/* Excerpt */}
        <div className="space-y-1">
          <Skeleton className="h-3 w-full bg-gray-300 animate-pulse" />
          <Skeleton className="h-3 w-5/6 bg-gray-300 animate-pulse" />
          <Skeleton className="h-3 w-4/6 bg-gray-300 animate-pulse" />
        </div>

        {/* Author */}
        <div className="flex items-center gap-2 pt-2">
          <Skeleton className="h-4 w-4 rounded-full bg-gray-300 animate-pulse" />
          <Skeleton className="h-3 w-24 bg-gray-300 animate-pulse" />
        </div>

        {/* Stats (views, comment, heart) */}
        <div className="mt-4 flex items-center justify-between w-full">
          <Skeleton className="h-3 w-20 bg-gray-300 animate-pulse" />
          <div className="flex gap-x-3">
            <Skeleton className="h-3 w-12 bg-gray-300 animate-pulse" />
            <Skeleton className="h-3 w-10 bg-gray-300 animate-pulse" />
            <Skeleton className="h-3 w-10 bg-gray-300 animate-pulse" />
          </div>
        </div>
      </CardContent>

      {/* Footer: Button */}
      <CardFooter className="p-4 pt-0 mt-auto">
        <Skeleton className="h-4 w-24 bg-gray-300 animate-pulse" />
      </CardFooter>
    </Card>
  );
}
