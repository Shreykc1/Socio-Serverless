import { Models } from 'appwrite';
import React from 'react'
import Loader from './Loader';
import GridPostsList from './GridPostsList';

type SearchProps = {
  isSearchFetching:boolean;
  searchedPosts: Models.Document[];
}

const SearchResults = ({ isSearchFetching,searchedPosts }: SearchProps) => {

  if (isSearchFetching) return <Loader />
  if(searchedPosts && searchedPosts.documents.length > 0 ) {return (
  <GridPostsList posts={searchedPosts.documents} />
)}

  return (
    <p className='text-light-4 mt-10 text-center w-full'>No results found</p>
  )
}

export default SearchResults