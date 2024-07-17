import { useUserContext } from "@/context/AuthContext";
import { formatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type PostCardProps = {
  post: Models.Document;
};

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();
  if (!post.creator) return;
  const bluetick = post.creator.isVerified ? "/assets/icons/verified.svg" : " "
  const tickStyle = post.creator.isVerified ? "block" : "hidden"
  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              src={post?.creator.imageURL || "/assets/images/profile.png"}
              alt="logo"
              className="rounded-full w-12 lg:h-12"
            />
          </Link>

          <div className="flex flex-col">
            <div className="flex gap-2">
            <p className="base-medium lg:body-bold text-light-1">
              {post.creator.name}
            </p>
            <img src={bluetick} 
          alt="logo" className={`${tickStyle} w-5 `} />
            </div>

            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {formatDateString(post.$createdAt)}
              </p>
              -
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>

        <Link
          to={`/update-post/${post.$id}`}
          className={`${user.id !== post.creator.$id && "hidden"}`}
        >
          <img src="/assets/icons/edit.svg" height={20} width={20} alt="logo" />
        </Link>
      </div>

      <Link to={`/posts/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post.tags.map((tag: string) => (
              <li key={tag} className="text-light-3">
                #{tag}
              </li>
            ))}
          </ul>
        </div>

        <img
                src={post.imageURL || "/assets/icons/profile.png"}
                className="post-card_img"
                alt="post"
                />
      </Link>

      <PostStats post={post} userID={user.id} />
    </div>
  );
};

export default PostCard;
