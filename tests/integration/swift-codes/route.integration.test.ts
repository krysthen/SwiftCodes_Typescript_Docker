import { connectDB } from "../../../src/app/dbCon";
import { GET } from "../../../src/app/v1/swift-codes/[swiftcode]/route";

describe("Integration Test: GET /v1/swift-codes/[swiftcode]", () => {
    let db: any;

    beforeAll(async () => {
        const connection = await connectDB();
        db = connection.db;

        // Clean up the collection before inserting test data
        await db.collection("swiftsCollections").deleteMany({});

        // Insert the correct test data
        await db.collection("swiftsCollections").insertMany([
            {
                address: "Test Address 1",
                bankName: "Test Bank 1",
                countryISO2: "PL",
                countryName: "Poland",
                isHeadquarter: true,
                swiftCode: "12345678905",
            },
            {
                address: "Test Address 2",
                bankName: "Test Bank 2",
                countryISO2: "PL",
                countryName: "Poland",
                isHeadquarter: false,
                swiftCode: "12345678901",
            },
        ]);
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