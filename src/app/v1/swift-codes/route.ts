import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../dbCon.mjs";

// POST request handler for adding a new SWIFT code entry
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate the request body
        const { address, bankName, countryISO2, countryName, isHeadquarter, swiftCode } = body;
        if (!address || !bankName || !countryISO2 || !countryName || typeof isHeadquarter !== "boolean" || !swiftCode) {
            return NextResponse.json({ message: "Invalid request structure" }, { status: 400 });
        }

        if (swiftCode.length !== 11) {
            return NextResponse.json({ message: "SWIFT code must be 11 characters long" }, { status: 400 });
        }

        const { db } = await connectDB();

        // Check if the SWIFT code already exists
        const existingCode = await db.collection("swiftsCollections").findOne({ swiftCode: swiftCode.toUpperCase() });
        if (existingCode) {
            return NextResponse.json({ message: "SWIFT code already exists" }, { status: 409 });
        }

        // Insert the new SWIFT code entry into the database
        await db.collection("swiftsCollections").insertOne({
            address,
            bankName,
            countryISO2,
            countryName,
            isHeadquarter,
            swiftCode: swiftCode.toUpperCase()
        });

        // Return a success message
        return NextResponse.json({ message: "SWIFT code added successfully" }, { status: 201 });
    } catch (error) {
        // Return an error response
        return NextResponse.json({ message: "Error adding SWIFT code, try again." }, { status: 500 });
    }
}
