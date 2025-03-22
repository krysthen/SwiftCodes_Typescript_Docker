import { MongoClient } from "mongodb";

const uri = process.env.DB_URI || "mongodb://localhost:27017";
const dbName = "swifts";

let cachedClient: MongoClient | null = null;
import { Db } from "mongodb";

let cachedDb: Db | null = null;

export async function connectDB() {
    if (cachedClient && cachedDb) {
        return { client: cachedClient, db: cachedDb };
    }

    const client = new MongoClient(uri);
    await client.connect();
    //console.log("Connected to MongoDB");
    const db = client.db(dbName);
    cachedClient = client;
    cachedDb = db;

    //const collections = await db.listCollections().toArray();
    //collections.forEach(collection => console.log(collection.name));
    //Get first collection from swiftsCollections

    

    return { client, db };
}