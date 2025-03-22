import { connectDB } from "../../../src/app/dbCon";
import { GET } from "../../../src/app/v1/swift-codes/[swiftcode]/route";

describe("Integration Test: GET /v1/swift-codes/[swiftcode]", () => {
    let db: any;

    beforeAll(async () => {
        const connection = await connectDB();
        db = connection.db;

        // Insert the test SWIFT code
        await db.collection("swiftsCollections").insertOne({
            address: "Test Address 2",
            bankName: "Test Bank 2",
            countryISO2: "PL",
            countryName: "Poland",
            isHeadquarter: false,
            swiftCode: "12345678901".toUpperCase(),
        });
    });

    afterAll(async () => {
        // Clean up the test data
        await db.collection("swiftsCollections").deleteMany({});
    });

    it("SWIFT code details", async () => {
        const request = {};
        const params = { swiftcode: "12345678901" };
        const response = await GET(request as any, { params: Promise.resolve(params) });

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({
            address: "Test Address 2",
            bankName: "Test Bank 2",
            countryISO2: "PL",
            countryName: "Poland",
            isHeadquarter: false,
            swiftCode: "12345678901",
        });
    });
});