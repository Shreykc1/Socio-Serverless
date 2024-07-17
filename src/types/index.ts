export type INavLink = {
    imgURL: string;
    route: string;
    label: string;
  };
  
  export type IUpdateUser = {
    userID: string;
    name: string;
    bio: string;
    imageID: string;
    imageURL: URL | string;
    file: File[];
    email:string,
  };
  
  export type INewPost = {
    userID: string;
    caption: string;
    file: File[];
    location?: string;
    tags?: string;
  };
  
  export type IUpdatePost = {
    postID: string;
    caption: string;
    imageID: string;
    imageURL: URL;
    file: File[]
    location?: string;
    tags?: string;
  };

  export type IRePost = {
    postID: string;
    caption: string;
    imageID: string;
    imageURL: URL;
    file: File[]
    location?: string;
    tags?: string;
    
  };

  export type IMessage = {
    id?: string;
    body: string;
    senderID: string;
    receiverID: string;
    createdAt?: string;
  }
  
  export type IUser = {
    id: string;
    name: string;
    username: string;
    email: string;
    imageURL: string;
    imageID?:string;
    bio: string;
    isVerified?: boolean;
  };
  
  export type INewUser = {
    name: string;
    email: string;
    username: string;
    password: string;
  };


  export type IUpdateProfile = {
    bio: string;
    file: File[];
  }

  export type IContextType = {
    user: IUser,
    isLoading: boolean,
    setUser: React.Dispatch<React.SetStateAction<IUser>>;
    isAuthenticated: boolean,
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    checkAuthUser: () => Promise<boolean>;
}
