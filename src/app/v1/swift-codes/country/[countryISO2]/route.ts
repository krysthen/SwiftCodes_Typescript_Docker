import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../dbCon";

// Interfaces for the response format
interface SwiftCode {
    address: string;
    bankName: string;
    countryISO2: string;
    countryName: string;
    isHeadquarter: boolean;
    swiftCode: string;
}
interface ResponseFormat {
    countryISO2: string;
    countryName: string;
    swiftCodes: SwiftCode[];
}
// GET request handler for the SWIFT code details for a country ISO2 code
// This function fetches the details of a SWIFT code from the database for a given country ISO2 code
export async function GET(request: NextRequest, { params }: { params: Promise<{ countryISO2: string }> }) {

    let countryISO2 = await (await params).countryISO2;

    //console.log("Country ISO2 code:", countryISO2);
    // Check if the country ISO2 code is provided
    if (!countryISO2) {
        return NextResponse.json({ message: "Country ISO2 code not provided" }, { status: 400 });
    }
    // Check if the country ISO2 code is 2 characters long
    if (countryISO2.length !== 2) {
        return NextResponse.json({ message: "Invalid country ISO2 code" }, { status: 400 });
    }

    try {
        const { db } = await connectDB();
        // Fetch the SWIFT codes for the given country ISO2 code
        const swiftCodes: SwiftCode[] = (await db.collection("swiftsCollections")
            .find({ countryISO2 })
            .toArray()).map(doc => ({
                address: doc.address,
                bankName: doc.bankName,
                countryISO2: doc.countryISO2,
                countryName: doc.countryName,
                isHeadquarter: doc.isHeadquarter,
                swiftCode: doc.swiftCode,
            }));
        // Check if the SWIFT codes are available for the given country ISO2 code
        if (!swiftCodes || swiftCodes.length === 0) {
            return NextResponse.json({ message: "No data found for the given country ISO2 code" }, { status: 404 });
        }
        // Format the response
        const response: ResponseFormat = {
            countryISO2: swiftCodes[0].countryISO2,
            countryName: swiftCodes[0].countryName,
            swiftCodes: swiftCodes.map(({ address, bankName, countryISO2, countryName, isHeadquarter, swiftCode }) => ({
                address,
                bankName,
                countryISO2,
                countryName,
                isHeadquarter,
                swiftCode,
            })),
        };

        //console.log("Country ISO2 code details:", response);
        // Return the response
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        //console.error("Error fetching countryISO2 code details:", error);
        // Return an error response
        return NextResponse.json({ message: "Error fetching SWIFT code details" }, { status: 500 });
    }
};
