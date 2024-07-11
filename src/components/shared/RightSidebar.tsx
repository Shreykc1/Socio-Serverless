import { useState } from "react";
import { Input } from "../ui/input";
import { useGetUsers } from "@/lib/react-query/queriesandmutations";

const RightSidebar = () => {
  const [searchValue, setSearchValue] = useState("");
  const {
    data: creators,
    isLoading: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers();
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
            <li className="bg-slate-900 h-48 rounded-lg"> </li>
            <li className="bg-slate-900 h-48 rounded-lg"> </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
