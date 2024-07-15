
import Loader from "@/components/shared/Loader";

import { useUserContext } from "@/context/AuthContext";
import { useGetUsers } from "@/lib/react-query/queriesandmutations";
import { Models } from "appwrite";

import { Link } from "react-router-dom";


const Chats = () => {
  const {
    data: users,
    isPending: isPostLoading,
  } = useGetUsers();

  const { user: currentUser } = useUserContext();
 



  return (
    <div className="flex w-full">
      {!isPostLoading ? (
        <ul className="chats-container">
          <li className=" mx-10">
            {users?.documents
              .filter((user: Models.Document) => user.$id !== currentUser.id)
              .map((user: Models.Document) => (
                <Link to={`/messages/${user.$id}`} key={user.$id}>
                  <div key={user.$id} className="bg-dark-3 rounded-lg w-[400px] sm:w-[600px] max-xs:w-[350px] h-20 flex flex-row gap-4 p-3">
                    <img
                      src={user.imageURL}
                      className="rounded-full w-14 h-14"
                      alt="logo"
                    />
                    <div className="flex flex-col">
                      <p className="h3-bold">{user.name}</p>
                      <p className="small-regular text-light-3">@{user.username}</p>
                    </div>
                  </div>
                </Link>
              ))}
          </li>
        </ul>
      ) : (
        <div className="flex-center w-full">
          <Loader />
        </div>
      )}

    </div>
  );
};

export default Chats;
