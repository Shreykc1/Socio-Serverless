import { Skeleton } from "@/components/ui/skeleton"

const RightBarSkeleton = ()=> {
  return (
    <div className="flex flex-col gap-10 mx-7">

    <div className="flex flex-col space-y-3">
      <Skeleton className="h-40 w-[350px] rounded-xl" />
      <div className="space-y-1">
        <Skeleton className="h-4 w-[100px]" />
      </div>
    </div>

    <div className="flex flex-col space-y-3">
      <Skeleton className="h-40 w-[350px] rounded-xl" />
      <div className="space-y-1">
        <Skeleton className="h-4 w-[100px]" />
      </div>
    </div>


    <div className="flex flex-col space-y-3">
      <Skeleton className="h-40 w-[350px] rounded-xl" />
      <div className="space-y-1">
        <Skeleton className="h-4 w-[100px]" />
      </div>
    </div>
    
    </div>
  )
}

export default RightBarSkeleton;