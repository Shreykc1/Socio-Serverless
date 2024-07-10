import Loader from "@/components/shared/Loader";
import { useGetUsers } from "@/lib/react-query/queriesandmutations";
import { Models } from "appwrite";
import { Link } from "react-router-dom";

const AllUsers = () => {
  const {
    data: users,
    isPending: isPostLoading,
    isError: isErrorPosts,
  } = useGetUsers();
  return (
    <>
      {!isPostLoading ? (
        <ul className="user-container m-6">

          <li className="user-grid">
            {users?.documents.map((user: Models.Document) => (
          <Link to={`/profile/${user.$id}`} key={user.$id}>
              <div key={user.$id} className="post_details-info">
                <img
                  src={user.imageURL}
                  className="rounded-full w-48"
                  alt="logo"
                />
                <p className="h3-bold">{user.name}</p>
                <div className="flex flex-col gap-2">
                  <p className="small-regular text-light-3">@{user.username}</p>
                  <p className="small-regular text-light-2">{user.bio}</p>
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
    </>
  );
};

export default AllUsers;
