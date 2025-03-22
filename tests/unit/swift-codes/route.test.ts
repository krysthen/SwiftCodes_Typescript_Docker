import { GET } from "../../../src/app/v1/swift-codes/[swiftcode]/route";
import { connectDB } from "../../../src/app/dbCon";

jest.mock("../../../src/app/dbCon.ts");

describe("GET /v1/swift-codes/[swiftcode]", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("SWIFT code is not provided", async () => {
        const request = {};
        const params = { swiftcode: "" };
        const response = await GET(request as any, { params: Promise.resolve(params) });
        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({ message: "SWIFT code not provided" });
    });

    it("SWIFT code is not found", async () => {
        (connectDB as jest.Mock).mockResolvedValue({
            db: {
                collection: () => ({
                    findOne: jest.fn().mockResolvedValue(null),
                }),
            },
        });

        const request = {};
        const params = { swiftcode: "INVALIDCODE" };
        const response = await GET(request as any, { params: Promise.resolve(params) });
        expect(response.status).toBe(404);
        expect(await response.json()).toEqual({ message: "SWIFT code not found" });
    });
});