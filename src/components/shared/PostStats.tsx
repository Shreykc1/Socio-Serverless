
import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queriesandmutations"
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite"
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";



type PostStatsProps = {
    post: Models.Document,
    userID: string,
}

const PostStats = ({ post, userID }: PostStatsProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const likesList = post.likes.map((user: Models.Document) => user.$id);
  
    const [likes, setLikes] = useState<string[]>(likesList);
    const [isSaved, setIsSaved] = useState(false);
  
    const { mutate: likePost } = useLikePost();
    const { mutate: savePost } = useSavePost();
    const { mutate: deleteSavePost } = useDeleteSavedPost();
  
    const { data: currentUser , isPending: isUserLoading} = useGetCurrentUser();
  
    const savedPostRecord = currentUser?.save.find(
      (record: Models.Document) => record.post.$id === post.$id
    );
  
    useEffect(() => {
      setIsSaved(!!savedPostRecord);
    }, [currentUser]);

  //   useEffect(() => {
  //     if (savedPostRecord) {
  //         setIsSaved(!!savedPostRecord);
  //     }
  // }, [currentUser]);
  
    const handleLikePost = (
      e: React.MouseEvent<HTMLImageElement, MouseEvent>
    ) => {
      e.stopPropagation();
  
      let likesArray = [...likes];
  
      if (likesArray.includes(userID)) {
        likesArray = likesArray.filter((Id) => Id !== userID);
      } else {
        likesArray.push(userID);
      }
  
      setLikes(likesArray);
      likePost({ postID: post.$id, likesArray });
    };
  
    const handleSavePost = (
      e: React.MouseEvent<HTMLImageElement, MouseEvent>
    ) => {
      e.stopPropagation();
  
      if (savedPostRecord) {
        setIsSaved(false);
        return deleteSavePost(savedPostRecord.$id);
      }
  
      savePost({ userID: userID, postID: post.$id });
      setIsSaved(true);
    };


    const handleRepost = () => {
      navigate(`/repost/${post.$id}`)
    }
  
    const containerStyles = location.pathname.startsWith("/profile")
      ? "w-full"
      : "";

      const savedStyle = location.pathname.startsWith("/saved")
      ? "hidden"
      : "block"

      const spaceStyle = location.pathname.startsWith("/profile")
      ? "justify-end"
      : "justify-between"
  
    return (
      <div
        className={`flex ${spaceStyle} items-center z-20 ${containerStyles}`}>
        <div className="flex gap-2 mr-5">
          <img
            src={`${
              checkIsLiked(likes, userID)
                ? "/assets/icons/liked.svg"
                : "/assets/icons/like.svg"
            }`}
            alt="like"
            width={20}
            height={20}
            onClick={(e) => handleLikePost(e)}
            className="cursor-pointer"
          />
          <p className="small-medium lg:base-medium">{likes.length}</p>
        </div>
  
        <div className={`flex gap-2 ${savedStyle}`}>
          <img
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt="share"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={(e) => handleSavePost(e)}
          />
        </div>


        <div className="flex gap-2">
          <img
            src='/assets/icons/share.svg'
            alt="share"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={() => handleRepost()}
          />
        </div>
      </div>
    );
  };
  
  export default PostStats;