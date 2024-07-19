import express from 'express';
import { Client, Account, Avatars, Databases, ID, Query } from 'appwrite';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';


// Configuration object
const appwriteConfig = {
  url: 'https://cloud.appwrite.io/v1',
  projectId: '667c7b0f00312f83d8cb',
  databaseId: '667c8d750019bbe1a46e',
  storageId: '667c8d23002acab49636',
  usersCollectionId: '667c8dfe0031cfa581a9',
  postsCollectionId: '667c8dbe0037c0e01c19',
  savesCollectionId: '667c8e1e002943b1b232',
  messageCollectionId: '66941c5a00327255a686'
};


const app = express();
app.use(bodyParser.json());
app.use(cors());

const client = new Client();

client.setProject(appwriteConfig.projectId).setEndpoint(appwriteConfig.url);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = client.storage;


app.post('/deleteAllActiveSessions', async (req, res) => {
    try {
        const currentUser = await account.get();
        const sessionsResponse = await account.listSessions();
        const sessions = sessionsResponse.sessions;
        const currentSessionId = sessions[sessions.length - 1].$id;
        await account.deleteSession(currentSessionId);
        res.status(200).send("Current user's session deleted successfully.");
    } catch (error) {
        res.status(500).send("Failed to delete current user's session: " + error.message);
    }
});

app.post('/createUserAccount', async (req, res) => {
    const user = req.body;
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        );

        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountID: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageURL: avatarUrl,
        });

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

async function saveUserToDB(user) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            user,
        );
        return newUser;
    } catch (e) {
        throw new Error(e.message);
    }
}

app.post('/signInAccount', async (req, res) => {
    const user = req.body;
    try {
        const session = await account.createEmailSession(user.email, user.password);
        res.status(200).json(session);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/signOutAccount', async (req, res) => {
    try {
        const session = await account.deleteSession("current");
        res.status(200).json(session);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/getCurrentUser', async (req, res) => {
    try {
        const currentAccount = await account.get();
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.equal("accountID", currentAccount.$id)]
        );
        res.status(200).json(currentUser.documents[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/createPost', async (req, res) => {
    const post = req.body;
    try {
        const uploadedFile = await uploadFile(post.file[0]);

        const fileUrl = getFilePreview(uploadedFile.$id);

        const tags = post.tags?.replace(/ /g, "").split(",") || [];

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

        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.put('/updateProfile', async (req, res) => {
    const { values, user } = req.body;
    try {
        const uploadedFile = await uploadFile(values.file[0]);
        const fileUrl = getFilePreview(uploadedFile.$id);

        const updateDB = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            user.id,
            {
                bio: values.bio,
                imageURL: fileUrl,
            }
        );

        res.status(200).json(updateDB);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

async function uploadFile(file) {
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        );

        return uploadedFile;
    } catch (error) {
        throw new Error(error.message);
    }
}

function getFilePreview(fileId) {
    try {
        const fileUrl = storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000,
            2000
        );

        return fileUrl;
    } catch (error) {
        throw new Error(error.message);
    }
}

app.get('/getPost/:id', async (req, res) => {
  const postId = req.params.id;
  try {
      const post = await databases.getDocument(
          appwriteConfig.databaseId,
          appwriteConfig.postsCollectionId,
          postId
      );

      res.status(200).json(post);
  } catch (error) {
      res.status(500).send(error.message);
  }
});

app.get('/getAllPosts', async (req, res) => {
  try {
      const allPosts = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.postsCollectionId
      );
      const posts = res.status(200).json(allPosts.documents)
      
  } catch (error) {
      res.status(500).send(error.message);
  }
});


app.get('/getUsers', async (req, res) => {
  try {
    const { limit, verified } = req.query;

    // Parse limit as number
    const parsedLimit = limit ? parseInt(limit) : undefined;
    // Parse verified as boolean
    const parsedVerified = verified ? (verified === 'true') : undefined;

    const queries = [];
  
    if (parsedLimit) {
      queries.push(Query.limit(parsedLimit));
    }
    if (parsedVerified !== undefined) {
      queries.push(Query.orderDesc("isVerified"));
    }

    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      queries
    );

    if (!users) throw new Error('No users found'); // Throw an actual error object
    res.json(users);
    
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send(error.message);
  }
});


app.get('/', (req,res) =>{
  res.send = "Hello, welcome to my Backend!..."
})


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
