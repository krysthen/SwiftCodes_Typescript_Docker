import { MongoClient } from "mongodb";

const uri = process.env.DB_URI || "mongodb://localhost:27017";
const dbName = "swifts";

let cachedClient = null;
let cachedDb = null;

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

    return { client, db };
}
//export async function closeDB() {
//    await cachedClient.close();
//    console.log("Closed MongoDB connection");
//}