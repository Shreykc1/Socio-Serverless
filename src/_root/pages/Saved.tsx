import PostStats from "@/components/shared/PostStats";
import { useUserContext } from "@/context/AuthContext";
import { useGetSavedPosts } from "@/lib/react-query/queriesandmutations";
import { Link } from "react-router-dom";

type SavedProps = {
  showUser?: boolean;
  showStats?: boolean;
}

const Saved = ({showUser = true, showStats = true}: SavedProps) => {
  const { user } = useUserContext();
  const userID = user.id;
  const { data, error, isLoading } = useGetSavedPosts(userID);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="p-14">
      {data && data.length > 0 ? (
        <ul className="grid-container">
          {data.map(post => (
            <li key={post.post.$id} className='relative min-w-80 h-80'>
            <Link to={`/posts/${post.post.$id}`} className='grid-post_link'>
                <img src={post.post.imageURL} alt="" className='h-full w-full object-cover'/>
            </Link>
  
          <div className='grid-post_user'>
            {
              showUser && (
                <div className='flex items-center justify-start gap-2 flex-1'>
                    <img src={post.post.creator.imageURL} className='h-8 w-8 rounded-full' alt="" />
                    <p className='line-clamp-1'>{post.post.creator.name}</p>
                </div>
              )
            }
  
            {
              showStats && (
                <PostStats post={post.post} userID={user.id} />
              )
            }
          </div>
  
          </li>
          ))}
        </ul>
      ) : (
        <div>No saved posts found.</div>
      )}
    </div>
  );
};

export default Saved;
