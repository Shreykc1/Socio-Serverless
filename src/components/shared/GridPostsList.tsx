import { useUserContext } from '@/context/AuthContext'
import { Models } from 'appwrite'
import { Link } from 'react-router-dom'
import PostStats from './PostStats';
import { useLocation } from 'react-router-dom';

type GridProps = {
  posts: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
}

const GridPostsList = ({posts, showUser = true, showStats = true}: GridProps) => {
  const { user } = useUserContext();
  const location = useLocation();

  const lineClamp = location.pathname.startsWith("/profile")
      ? ""
      : "line-clamp-1"

  return (
    <ul className='grid-container'>
      {posts.map((post) => (
        <li key={post.$id} className='relative min-w-80 h-80'>
          <Link to={`/posts/${post.$id}`} className='grid-post_link'>
              <img src={post.imageURL} alt="" className='h-full w-full object-cover'/>
          </Link>

        <div className='grid-post_user'>
          {
            showUser && (
              <div className='flex items-center justify-start gap-2 flex-1'>
                  <img src={post.creator.imageURL} className='h-8 w-8 rounded-full' alt="" />
                  <p className={`${lineClamp}`}>{post.creator.name}</p>
                  <img
              src={post.creator.isVerified ? "/assets/icons/verified.svg" : ""}
              alt="logo"
              className={`${post.creator.isVerified ? "block" : "hidden"} w-5 mb-0 `}
            />
              </div>
            )
          }

          {
            showStats && (
              <PostStats post={post} userID={user.id} />
            )
          }
        </div>

        </li>
      ))}
    </ul>
  )
}

export default GridPostsList