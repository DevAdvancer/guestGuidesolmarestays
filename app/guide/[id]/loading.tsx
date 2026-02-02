import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5DC' }}>
      {/* Fake Header */}
      <div className="h-16 w-full bg-white/80 backdrop-blur-md fixed top-0 z-50 border-b border-gray-100" />

      {/* Hero Section Skeleton */}
      <section className="relative h-[85vh] w-full z-0">
        <Skeleton className="h-full w-full bg-gray-200" />
      </section>

      {/* Content Skeleton Wrapper */}
      <div className="relative z-10 -mt-32 flex flex-col items-center px-4 pb-8 space-y-8">

        {/* White Box Skeleton */}
        <div className="w-[90%] max-w-4xl rounded-3xl bg-white p-8 text-center shadow-xl md:p-12 flex flex-col items-center gap-6">
          <Skeleton className="h-12 w-3/4 max-w-lg rounded-lg" />
          <Skeleton className="h-6 w-1/2 max-w-md rounded-lg" />
          <Skeleton className="h-12 w-32 rounded-full mt-4" />
        </div>

        {/* Quick Info Grid Skeleton */}
        <div className="w-full max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>

        {/* List Skeleton */}
        <div className="w-full max-w-2xl mx-auto space-y-4">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>

      </div>
    </div>
  );
}
