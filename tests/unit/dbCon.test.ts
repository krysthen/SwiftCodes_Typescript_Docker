import { connectDB } from "../../src/app/dbCon";

describe("Database Connection", () => {
    it("should connect to the database successfully", async () => {
        const { db, client } = await connectDB();
        expect(db).toBeDefined();
        expect(client).toBeDefined();
        await client.close();
    });

    it("should return the same cached connection on subsequent calls", async () => {
        const firstConnection = await connectDB();
        const secondConnection = await connectDB();
        expect(firstConnection.db).toBe(secondConnection.db);
        expect(firstConnection.client).toBe(secondConnection.client);
    });
});