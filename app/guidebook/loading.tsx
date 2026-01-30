import { Loader } from "@/components/ui/loader";

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader size="xl" variant="primary" className="h-10 w-10" />
    </div>
  );
}
