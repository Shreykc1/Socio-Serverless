import { INewUser } from "@/types";
import { ID, Query } from 'appwrite';
import { account, appwriteConfig, avatars, databases } from "./config";



export async function createUserAccount(user: INewUser) {

    try{
        const newAccount = await account.create(
            ID.unique(), // will always give a unique id for user
            user.email,
            user.password,
            user.name,          
        );

        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountID: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageURL: avatarUrl
        });

        return newAccount;
    } catch(e){
        console.log(e);
        return e;
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


export async function signInAccount(user: {email:string; password: string }){
    try{
        const session = await account.createEmailPasswordSession(user.email,user.password);
        return session;
    } catch(e){
        console.log(e)
    }
};

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [
                Query.equal('accountID',currentAccount.$id)
            ]
        );
        if(!currentUser) throw Error;
        return currentUser.documents[0];

    } catch (error) {
        console.log(error)
    }
}