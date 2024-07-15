import { useState } from "react";
import { Input } from "../ui/input";
import {
  useGetUsers,
  useSearchUsers,
} from "@/lib/react-query/queriesandmutations";
import { Link } from "react-router-dom";
import useDebounce from "@/hooks/useDebouncer";
import SearchUsers from "./SearchUsers";
import GridPostsList from "./GridPostsList";

const RightSidebar = () => {
  const [searchValue, setSearchValue] = useState("");
  const debouncedValue = useDebounce(searchValue, 500);
  const { data: searchedUsers, isFetching: isSearchFetching } =
    useSearchUsers(debouncedValue);
  const {
    data: creators,
    isLoading: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers();

  const showSearchResults = searchValue !== "";
  const showUsers =
    !showSearchResults &&
    creators?.documents.every((item) => item?.length === 0);
  return (
    <section className="w-[465px] hidden md:block lg:block">
      <div className="flex flex-col mx-7">
        <div className="flex gap-1 px-4 mt-10 justify-center rounded-lg bg-dark-4">
          <img src="/assets/icons/search.svg" alt="" />
          <Input
            className="explore-search"
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        <div className="flex justify-start">
          <h3 className="h2-bold my-14">Top Creators</h3>
        </div>

        <div>
          <ul className="flex flex-col gap-8">
            {creators?.documents.map((user, index) => {
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
                        className=" rounded-full h-8"
                        alt=""
                      />

                      <p className="small-regular h-6">{user.username}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-9 w-full max-w-5xl">
                    {showSearchResults ? (
                      <SearchUsers
                        isSearchFetching={isSearchFetching}
                        searchedUsers={searchedUsers}
                      />
                    ) : showUsers ? (
                      <p className="text-light-4 mt-10 text-center w-full">
                        End of Posts
                      </p>
                    ) : (

                         <ul className="flex flex-col gap-8">
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
                        className=" rounded-full h-8"
                        alt=""
                      />

                      <p className="small-regular h-6">{user.username}</p>
                    </div>
                  </div>
                  </li>
                         </ul>
                        )
                      
                    }
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
