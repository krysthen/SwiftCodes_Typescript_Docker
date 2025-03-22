import { MongoClient } from "mongodb";
import { Db } from "mongodb";

// Uri change when using docker or local
//const uri = process.env.DB_URI || "mongodb://localhost:27017";
const uri = process.env.DB_URI || "mongodb://mongodb:27017";
const dbName = "swifts";

let cachedClient: MongoClient | null = null;
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