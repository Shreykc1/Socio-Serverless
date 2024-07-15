import { Models } from 'appwrite';
import Loader from './Loader';
import GridPostsList from './GridPostsList';

type SearchProps = {
  isSearchFetching:boolean;
  searchedUsers: Models.Document[];
}

const SearchUsers = ({ isSearchFetching,searchedUsers }: SearchProps) => {

  if (isSearchFetching) return <Loader />
  if(searchedUsers && searchedUsers.length > 0 ) {return (
  <GridPostsList posts={searchedUsers} />
)}

  return (
    <p className='text-light-4 mt-10 text-center w-full'>No results found</p>
  )
}

export default SearchUsers