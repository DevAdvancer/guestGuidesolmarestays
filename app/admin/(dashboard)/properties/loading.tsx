import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-40 mb-2" />
          <Skeleton className="h-5 w-60" />
        </div>
        <Skeleton className="h-10 w-36 rounded-md shadow-sm" />
      </div>

      {/* Property Cards Skeleton Grid */}
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between shadow-sm animate-pulse"
          >
            <div className="flex items-center gap-4">
              {/* Icon Skeleton */}
              <Skeleton className="h-14 w-14 rounded-xl" />

              <div className="space-y-2">
                {/* Title Skeleton */}
                <Skeleton className="h-6 w-48" />
                {/* PIN/Meta Skeleton */}
                <div className="flex items-center gap-4">
                  <Skeleton className="h-5 w-24 rounded" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Status Badge Skeleton */}
              <Skeleton className="h-6 w-16 rounded-full" />

              {/* Action Buttons Skeletons */}
              <div className="flex gap-1">
                <Skeleton className="h-9 w-9 rounded-md" />
                <Skeleton className="h-9 w-9 rounded-md" />
                <Skeleton className="h-9 w-9 rounded-md" />
                <Skeleton className="h-9 w-9 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
