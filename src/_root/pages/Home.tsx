import PostCard from "@/components/shared/PostCard";
import RightSidebar from "@/components/shared/RightSidebar"; 
import PostSkeleton from "@/components/skeletons/PostSkeleton";
import { useGetRecentPosts } from "@/lib/react-query/queriesandmutations";
import { Models } from "appwrite";


const Home = () => {
  const { data: posts, isPending: isPostLoading, isError: isErrorPosts } = useGetRecentPosts();
  if (isErrorPosts){
    return <div className="h-full w-full flex-center">Post's loading...</div>
  }
  return (
    <div className="flex flex-1">
        <div className="home-container">
          <div className="home-posts">
              <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
              {isPostLoading && !posts ? (
                  <PostSkeleton/>
              ) : (
                <ul className="flex flex-col flex-1 gap-10 w-full">
                  {posts?.documents.map((posts: Models.Document) => (
                    <PostCard post={posts}  key={posts.$id}/>
                  ))}
                </ul>
              )}
          </div>
        </div>

              <RightSidebar />

    </div>
  )
}

export default Home