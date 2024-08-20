import { Skeleton } from "@/components/ui/skeleton";

const PostSkeleton = () => {
  return (
    <>
      <div className="flex flex-col ml-32 xxs:ml-2 md:ml-0 gap-10 w-[100%]">

        <div className="flex flex-col space-y-3 w-[100%]">
          <div className="flex items-center justify-start space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>

          <Skeleton className="h-96 w-[340px] sm:w-[550px] rounded-xl space-y-10" />
        </div>

        <div className="flex flex-col space-y-3">
          <div className="flex items-start justify-start space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>

          <Skeleton className="h-40 w-[350px] rounded-xl" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <div className="flex items-start justify-start space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>

          <Skeleton className="h-40 w-[350px] rounded-xl" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
      </div>
    </>
  );
};

export default PostSkeleton;