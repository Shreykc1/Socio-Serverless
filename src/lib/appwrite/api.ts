import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { ID, Query } from 'appwrite';
import { account, appwriteConfig, avatars, databases,storage } from "./config";


// Function to fetch the current user's ID
async function getCurrentUserId(): Promise<string> {
    try {
        const currentUser = await account.get(); // Get the current user's information
        return currentUser.$id; // Return the user's ID
    } catch (error) {
        console.error("Failed to get current user's ID:", error);
        throw error;
    }
}

// Main function to delete the current user's session
export async function deleteAllActiveSessions() {
    try {
        // Fetch the current user's ID
        const userId = await getCurrentUserId();

        // Correctly list sessions for the current user
        const sessionsResponse = await account.listSessions();
        const sessions = sessionsResponse.sessions;

        // Assuming the current session is the latest one, or you have another criterion to identify it
        const currentSessionId = sessions[sessions.length - 1].$id; // Get the last session ID

        // Delete the identified session
        await account.deleteSession(currentSessionId);

        console.log("Current user's session deleted successfully.");
    } catch (error) {
        console.error("Failed to delete current user's session:", error);
    }
}



export async function createUserAccount(user: INewUser) {
    try {
      const newAccount = await account.create(
        ID.unique(),
        user.email,
        user.password,
        user.name
      );
  
      if (!newAccount) throw Error;
  
      const avatarUrl = avatars.getInitials(user.name);
  
      const newUser = await saveUserToDB({
        accountID: newAccount.$id,
        name: newAccount.name,
        email: newAccount.email,
        username: user.username,
        imageURL: avatarUrl,
      });
  
      return newUser;
    } catch (error) {
      console.log(error);
      return error;
    }
  }


export async function saveUserToDB(user:{
    accountID: string,
    email: string,
    name:string,
    imageURL: URL,
    username?: string,
}) {
    try{
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            user,
        )
        return newUser
    } catch(e){
        console.log(e)
    }
}


export async function signInAccount(user: {email: string; password: string }) {
    try {
        
        const session = await account.createEmailPasswordSession(user.email, user.password);
        return session;
    } catch (e) {
        console.error(e);
        return null; // Handle error appropriately
    }
}


export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current")
    return session
  } catch (error) {
    console.log(error)
  }
}




export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
      console.log(error);
    }
  }



export async function getCurrentUser() {
    try {
      const currentAccount = await getAccount();
  
      if (!currentAccount) throw Error;
  
      const currentUser = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal("accountID", currentAccount.$id)]
      );
  
      if (!currentUser) throw Error;
  
      return currentUser.documents[0];
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  

  export async function createPost(post: INewPost) {
    try {
      // Upload file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
  
      if (!uploadedFile) throw Error;
  
      // Get file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
  
      // Convert tags into array
      const tags = post.tags?.replace(/ /g, "").split(",") || [];
  
      // Create post
      const newPost = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postsCollectionId,
        ID.unique(),
        {
          creator: post.userID,
          caption: post.caption,
          imageURL: fileUrl,
          imageID: uploadedFile.$id,
          location: post.location,
          tags: tags,
        }
      );
  
      if (!newPost) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
  
      return newPost;
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== UPLOAD FILE
  export async function uploadFile(file: File) {
    try {
      const uploadedFile = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        file
      );
  
      return uploadedFile;
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== GET FILE URL
  export function getFilePreview(fileId: string) {
    try {
      const fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        // "top",
        // 100
      );
  
      if (!fileUrl) throw Error;
  
      return fileUrl;
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== DELETE FILE
  export async function deleteFile(fileId: string) {
    try {
      await storage.deleteFile(appwriteConfig.storageId, fileId);
  
      return { status: "ok" };
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== GET POSTS
  export async function searchPosts(searchTerm: string) {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postsCollectionId,
        [Query.search("caption", searchTerm)]
      );
  
      if (!posts) throw Error;
  
      return posts;
    } catch (error) {
      console.log(error);
    }
  }
  
  export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
    const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];
  
    if (pageParam) {
      queries.push(Query.cursorAfter(pageParam.toString()));
    }
  
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postsCollectionId,
        queries
      );
  
      if (!posts) throw Error;
  
      return posts;
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== GET POST BY ID
  export async function getPostById(postID?: string) {
    if (!postID) throw Error;
  
    try {
      const post = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postsCollectionId,
        postID
      );
  
      if (!post) throw Error;
  
      return post;
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== UPDATE POST
  export async function updatePost(post: IUpdatePost) {
    const hasFileToUpdate = post.file.length > 0;
  
    try {
      let image = {
        imageURL: post.imageURL,
        imageID: post.imageID,
      };
  
      if (hasFileToUpdate) {
        // Upload new file to appwrite storage
        const uploadedFile = await uploadFile(post.file[0]);
        if (!uploadedFile) throw Error;
  
        // Get new file url
        const fileUrl = getFilePreview(uploadedFile.$id);
        if (!fileUrl) {
          await deleteFile(uploadedFile.$id);
          throw Error;
        }
  
        image = { ...image, imageURL: fileUrl, imageID: uploadedFile.$id };
      }
  
      // Convert tags into array
      const tags = post.tags?.replace(/ /g, "").split(",") || [];
  
      //  Update post
      const updatedPost = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postsCollectionId,
        post.postID,
        {
          caption: post.caption,
          imageURL: image.imageURL,
          imageID: image.imageID,
          location: post.location,
          tags: tags,
        }
      );
  
      // Failed to update
      if (!updatedPost) {
        // Delete new file that has been recently uploaded
        if (hasFileToUpdate) {
          await deleteFile(image.imageID);
        }
  
        // If no new file uploaded, just throw error
        throw Error;
      }
  
      // Safely delete old file after successful update
      if (hasFileToUpdate) {
        await deleteFile(post.imageID);
      }
  
      return updatedPost;
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== DELETE POST
  export async function deletePost(postId?: string, imageID?: string) {
    if (!postId || !imageID) return;
  
    try {
      const statusCode = await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postsCollectionId,
        postId
      );
  
      if (!statusCode) throw Error;
  
      await deleteFile(imageID);
  
      return { status: "Ok" };
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== LIKE / UNLIKE POST
  export async function likePost(postID: string, likesArray: string[]) {
    try {
      const updatedPost = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postsCollectionId,
        postID,
        {
          likes: likesArray,
        }
      );
  
      if (!updatedPost) throw Error;
  
      return updatedPost;
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== SAVE POST
  export async function savePost(userID: string, postID: string) {
    try {
      const updatedPost = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.savesCollectionId,
        ID.unique(),
        {
          user: userID,
          post: postID,
        }
      );
  
      if (!updatedPost) throw Error;
  
      return updatedPost;
    } catch (error) {
      console.log(error);
    }
  }



// ======================================== get saved posts//




export async function getSavedPosts(userID: string) {
  if (!userID) return;
  try {
    const getPost = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      [
        Query.equal('user', userID)
      ]
    );

    if (!getPost.documents || getPost.documents.length === 0) {
      throw new Error('No posts found');
    }

    console.log('Fetched posts:', getPost.documents); // Log the fetched posts

    // Extract user and post fields manually
    const posts = getPost.documents.map(doc => ({
      user: doc.user,
      post: doc.post,
    }));

    return posts;
  } catch (error) {
    console.error('Error fetching saved posts:', error);
    throw error; // Re-throw the error to handle it in the hook
  }
}




  // ============================== DELETE SAVED POST
  export async function deleteSavedPost(savedRecordId: string) {
    try {
      const statusCode = await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.savesCollectionId,
        savedRecordId
      );
  
      if (!statusCode) throw Error;
  
      return { status: "Ok" };
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== GET USER'S POST
  export async function getUserPosts(userID?: string) {
    if (!userID) return;
  
    try {
      const post = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postsCollectionId,
        [Query.equal("creator", userID), Query.orderDesc("$createdAt")]
      );
  
      if (!post) throw Error;
  
      return post;
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== GET POPULAR POSTS (BY HIGHEST LIKE COUNT)
  export async function getRecentPosts() {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postsCollectionId,
        [Query.orderDesc("$createdAt"), Query.limit(20)]
      );
  
      if (!posts) throw Error;
  
      return posts;
    } catch (error) {
      console.log(error);
    }
  }





  
  // ============================================================
  // USER
  // ============================================================
  
  // ============================== GET USERS
  export async function getUsers(limit?: number) {
    const queries: any[] = [Query.orderDesc("$createdAt")];
  
    if (limit) {
      queries.push(Query.limit(limit));
    }
  
    try {
      const users = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        queries
      );
  
      if (!users) throw Error;
  
      return users;
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== GET USER BY ID
  export async function getUserById(userId: string) {
    try {
      const user = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        userId
      );
  
      if (!user) throw Error;
  
      return user;
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== UPDATE USER
  export async function updateUser(user: IUpdateUser) {
    const hasFileToUpdate = user.file.length > 0;
    try {
      let image = {
        imageURL: user.imageURL,
        imageID: user.imageID,
      };
  
      if (hasFileToUpdate) {
        // Upload new file to appwrite storage
        const uploadedFile = await uploadFile(user.file[0]);
        if (!uploadedFile) throw Error;
  
        // Get new file url
        const fileUrl = getFilePreview(uploadedFile.$id);
        if (!fileUrl) {
          await deleteFile(uploadedFile.$id);
          throw Error;
        }
  
        image = { ...image, imageURL: fileUrl, imageID: uploadedFile.$id };
      }
  
      //  Update user
      const updatedUser = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        user.userID,
        {
          name: user.name,
          bio: user.bio,
          imageURL: image.imageURL,
          imageId: image.imageID,
        }
      );
  
      // Failed to update
      if (!updatedUser) {
        // Delete new file that has been recently uploaded
        if (hasFileToUpdate) {
          await deleteFile(image.imageID);
        }
        // If no new file uploaded, just throw error
        throw Error;
      }
  
      // Safely delete old file after successful update
      if (user.imageID && hasFileToUpdate) {
        await deleteFile(user.imageID);
      }
  
      return updatedUser;
    } catch (error) {
      console.log(error);
    }
  }