
import { useGetUsers } from '@/lib/react-query/queriesandmutations';
import { Models } from 'appwrite';


const AllUsers = () => {
  const { data: users, isPending: isPostLoading, isError: isErrorPosts } = useGetUsers();
  return (
    
      <ul className='user-container m-6'>
          <li className='user-grid'>
          {users?.documents.map((users: Models.Document) => (
                    <div className='post_details-info'>  
                      <img src={users.imageURL} className='rounded-full w-48' alt="logo" />
                      <p className='h3-bold'>{users.name}</p>
                      <div className='flex flex-col gap-2'>
                      <p className='small-regular text-light-3'>@{users.username}</p>
                      <p className='small-regular text-light-2'>{users.bio}</p>
                      
                      </div>
                    </div>
        ))
        }
          </li>
      </ul>
    
  )
}

export default AllUsers