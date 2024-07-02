import { 
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery,
    QueryClient,
} from '@tanstack/react-query'
import { createUserAccount, deleteAllActiveSessions, signInAccount, signOutAccount, createPost, getRecentPosts, likePost, savePost, deleteSavedPost, getCurrentUser, getPostById, updatePost, deletePost } from '../appwrite/api'
import { INewPost, INewUser, IUpdatePost } from '@/types'
import { QUERY_KEYS } from './queryKeys'


export const useCreateUserAccount = () =>{
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    })
} 


export const useDeleteSessions = () => {
    return useMutation({
        mutationFn:() => deleteAllActiveSessions()
    })
}


export const useSignInAccount = () =>{
    return useMutation({
        mutationFn: (user: {
            email: string;
            password: string
        }) => signInAccount(user)
    })
} 

export const useSignOutAccount = () =>{
    return useMutation({
        mutationFn: signOutAccount
    })
} 

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (post: INewPost) => createPost(post),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
      },
    });
  };


export const useGetRecentPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts,
    })
}


export const useLikePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({
        postID,
        likesArray,
      }: {
        postID: string;
        likesArray: string[];
      }) => likePost(postID, likesArray),
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        });
      },
    });
  };
  
  export const useSavePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ userID, postID }: { userID: string; postID: string }) =>
        savePost(userID, postID),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        });
      },
    });
  };
  
  export const useDeleteSavedPost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        });
      },
    });
  };


  export const useGetPostById = (postID: string) =>{
    return useQuery({
      queryKey: [QUERY_KEYS.GET_POST_BY_ID, postID],
      queryFn: () => getPostById(postID),
      enabled: !!postID
    })
  }


  export const useUpdatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (post: IUpdatePost) => updatePost(post),
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.id]
        })
      }
    })
  }

  export const useDeletePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ postID, imageID } : { postID: string, imageID: string }) => deletePost(postID,imageID),
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POST_BY_ID]
        })
      }
    })
  }
  
  // ============================================================
  // USER QUERIES
  // ============================================================
  
  export const useGetCurrentUser = () => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      queryFn: getCurrentUser,
    });
  };
  
//   export const useGetUsers = (limit?: number) => {
//     return useQuery({
//       queryKey: [QUERY_KEYS.GET_USERS],
//       queryFn: () => getUsers(limit),
//     });
//   };
  
//   export const useGetUserById = (userId: string) => {
//     return useQuery({
//       queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
//       queryFn: () => getUserById(userId),
//       enabled: !!userId,
//     });
//   };
  
//   export const useUpdateUser = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//       mutationFn: (user: IUpdateUser) => updateUser(user),
//       onSuccess: (data) => {
//         queryClient.invalidateQueries({
//           queryKey: [QUERY_KEYS.GET_CURRENT_USER],
//         });
//         queryClient.invalidateQueries({
//           queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
//         });
//       },
//     });
//   };