import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import RightSidebar from "@/components/shared/RightSidebar";
import { useGetRecentPosts } from "@/lib/react-query/queriesandmutations";
import { Models } from "appwrite";


const Home = () => {

  const { data: posts, isPending: isPostLoading, isError: isErrorPosts } = useGetRecentPosts();

  return (
    <div className="flex flex-1">
        <div className="home-container">
          <div className="home-posts">
              <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
              {isPostLoading && !posts ? (
                  <Loader/>
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