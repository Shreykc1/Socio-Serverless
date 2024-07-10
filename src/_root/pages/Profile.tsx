import EditButton from "@/components/shared/EditButton";
import FollowButton from "@/components/shared/FollowButton";
import GridPostsList from "@/components/shared/GridPostsList";
import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/context/AuthContext";
import {  useGetUserById, useGetUserPosts } from "@/lib/react-query/queriesandmutations";
import { useParams } from "react-router-dom";


const Profile = () => {
  const { user } = useUserContext();
  const { id } = useParams();
  const { data: post, isPending: isPostLoading } = useGetUserPosts(id);
  const { data: currentUser, isPending: isLoading } = useGetUserById(id || "");
  return (
    <>{!isLoading ? (
    <div className="profile-container">
      
        <div className="profile-inner_container">
          <div className="flex-center lg:h-40 lg:w-40 h-0 w-0 ">
            <img
              src={
                currentUser?.$id !== user.id
                  ? currentUser?.imageURL
                  : user.imageURL
              }
              alt="logo"
              className="h-40 w-40 rounded-full hidden lg:block"
            />
          </div>

          <div className="mt-5">
            <div className="flex flex-row gap-20">
              <h3 className="h2-bold">
                {currentUser?.$id !== user.id ? currentUser?.name : user.name}
              </h3>
              {currentUser?.$id === user.id ? <EditButton /> : <FollowButton />}
            </div>
            <p className="base-regular mt-3 text-light-3">
              @
              {currentUser?.$id !== user.id
                ? currentUser?.username
                : user.username}
            </p>

            <div className="base-medium mt-10 text-light-2">
              {currentUser?.$id !== user.id ? currentUser?.bio : user.bio}
            </div>

            

          </div>
         
        </div>

        <div className="w-full ">
          {!isPostLoading ? 
                <GridPostsList posts={post?.documents} />
                :
                <Loader />
          }
        </div>
    </div>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Profile;
