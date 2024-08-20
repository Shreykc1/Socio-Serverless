
import {
  useGetUsers,
  
} from "@/lib/react-query/queriesandmutations";
import { Link } from "react-router-dom";

import RightBarSkeleton from "../skeletons/RightBarSkeleton";



const RightSidebar = () => {
 

 
  const {
    data: creators,
    isLoading: isUserLoading,
    
  } = useGetUsers(0,true);

  
  return (
    
    <section className="w-[465px] hidden lg:block overflow-y-scroll custom-scrollbar ">
      <div className="flex flex-col mx-7 mb-5">
        <div className="flex justify-start">
          <h3 className="h2-bold my-14">Top Creators</h3>
        </div>

        <div>
            {isUserLoading ? <RightBarSkeleton/> : 
          <ul className="flex flex-col gap-8">
          {creators?.documents.filter(user => user.posts[0]?.imageURL).map((user) => {
  return (
    <li key={user.$id} className="h-48 overflow-hidden relative">
      <Link to={`/profile/${user.$id}`} className="top_link">
        <img
          src={user.posts[0].imageURL}
          alt=""
          className="h-full w-full object-cover"
        />
      </Link>
      <div className="top_user">
        <div className="flex items-center justify-start gap-2 flex-1">
          <img
            src={user.imageURL}
            className="rounded-full h-8"
            alt=""
          />

          <p className="small-regular h-6">{user.username}</p>
          <img
              src={user.isVerified ? "assets/icons/verified.svg" : ""}
              alt="logo"
              className={`${user.isVerified ? "block" : "hidden"} w-5 mb-1`}
            />
        </div>
      </div>

    </li>
  );
}

)}

          </ul>
}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;