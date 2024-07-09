import PostForm from "@/components/forms/PostForm"
import { useGetPostById } from "@/lib/react-query/queriesandmutations";
import { Loader } from "lucide-react";
import { useParams } from "react-router-dom"

const RePost = () => {
  const { id } = useParams(); 
  const { data: post , isPending } = useGetPostById(id || "");

  if (isPending) return <Loader />

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="justify-start w-full max-w-5xl flex-start gap-3 ">
          <img src="/assets/icons/add-post.svg" alt="logo" width={35} height={35} />
          <h2 className="h3-bold md:h2-bold text-left w-full">Repost</h2>
        </div>

        <PostForm action="Repost" post={post}/>

      </div>
    </div>
  )
}

export default RePost