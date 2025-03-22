import { connectDB } from "../../../../src/app/dbCon";
import { GET } from "../../../../src/app/v1/swift-codes/country/[countryISO2]/route";

interface SwiftCode {
    address: string;
    bankName: string;
    countryISO2: string;
    countryName: string;
    isHeadquarter: boolean;
    swiftCode: string;
}

describe("Integration Test: GET /v1/swift-codes/country/[countryISO2]", () => {
    let db: any;

    beforeAll(async () => {
        const connection = await connectDB();
        db = connection.db;

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
        ]);
    });

    afterAll(async () => {
        // Clean up the test data
        await db.collection("swiftsCollections").deleteMany({});
    });

    it("should return 200 with all SWIFT codes for the given country", async () => {
        const request = {};
        const params = { countryISO2: "PL" };
        const response = await GET(request as any, { params: Promise.resolve(params) });

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({
            countryISO2: "PL",
            countryName: "Poland",
            swiftCodes: [
                {
                    address: "Test Address 1",
                    bankName: "Test Bank 1",
                    countryISO2: "PL",
                    countryName: "Poland",
                    isHeadquarter: true,
                    swiftCode: "12345678905",
                },
            ],
        });
    });

    it("should return 404 if no SWIFT codes are found for the given country", async () => {
        const request = {};
        const params = { countryISO2: "DE" };
        const response = await GET(request as any, { params: Promise.resolve(params) });

        expect(response.status).toBe(404);
        expect(await response.json()).toEqual({ message: "No data found for the given country ISO2 code" });
    });
});