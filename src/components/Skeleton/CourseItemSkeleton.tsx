import { Skeleton } from "@/components/ui/skeleton";

export default function CourseItemSkeleton() {
  return (
    <div className="relative group cursor-pointer transition-all duration-200">
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 group-hover:shadow-xl transition-shadow duration-200">
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Skeleton className="h-full w-full bg-gray-300 animate-pulse" />
        </div>

        <div className="p-3 space-y-2">
          <Skeleton className="h-4 w-11/12 bg-gray-300 animate-pulse" />
          <Skeleton className="h-3 w-1/2 bg-gray-300 animate-pulse" />

          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-6 bg-gray-300 animate-pulse" />
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-3 w-3 rounded-full bg-gray-300 animate-pulse"
                />
              ))}
            </div>
            <Skeleton className="h-3 w-10 bg-gray-300 animate-pulse" />
          </div>

          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-16 bg-gray-300 animate-pulse" />
            <Skeleton className="h-3 w-20 bg-gray-300 animate-pulse" />
            <Skeleton className="h-4 w-4 rounded-full bg-gray-300 animate-pulse" />
          </div>

          <div className="flex gap-3">
            <Skeleton className="h-5 w-20 rounded-md bg-gray-300 animate-pulse" />
            <Skeleton className="h-5 w-20 rounded-md bg-gray-300 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
