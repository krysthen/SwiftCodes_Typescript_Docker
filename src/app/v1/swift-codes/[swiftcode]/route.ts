import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../dbCon.mjs";

// Interfaces for the response format
interface swiftCodeDetails {
    address: string;
    bankName: string;
    countryISO2: string;
    countryName: string;
    isHeadquarter: boolean;
    swiftCode: string;
    branches?: Branch[];
}
interface Branch {
    address: string;
    bankName: string;
    countryISO2: string;
    countryName: string;
    isHeadquarter: boolean;
    swiftCode: string;
}

// GET request handler for the SWIFT code details
// This function fetches the details of a SWIFT code from the database
export async function GET(
    request: NextRequest, { params }: { params: { swiftcode: string } }
) {

    let swiftCode = params.swiftcode;
    //console.log("SWIFT code:", swiftCode);

    // Check if the SWIFT code is provided
    if (!swiftCode) {
        return NextResponse.json({ message: "SWIFT code not provided" }, { status: 400 });
    }
    // Check if the SWIFT code is 11 characters long
    if (swiftCode.length !== 11) {
        return NextResponse.json({
            message: "Swift code must be 11 characters long."
        }, { status: 200 });
    }

    // Connect to the database and fetch the SWIFT code details
    try {
        const { db } = await connectDB();
        let swiftCodeDetails;

        swiftCode = swiftCode.toUpperCase();

        // Check if the SWIFT code is a headquarter code
        if (swiftCode.endsWith("XXX")) {
            const branchPrefix = swiftCode.slice(0, -3);

            swiftCodeDetails = await db.collection("swiftsCollections").findOne({ swiftCode });

            if (swiftCodeDetails) {
                const branches = await db.collection("swiftsCollections").find({
                    $and: [
                        { swiftCode: { $regex: `^${branchPrefix}` } },
                        { swiftCode: { $ne: swiftCodeDetails.swiftCode } }
                    ]
                }).toArray();

                swiftCodeDetails.branches = branches.map((branch: any) => ({
                    address: branch.address,
                    bankName: branch.bankName,
                    countryISO2: branch.countryISO2,
                    isHeadquarter: false,
                    swiftCode: branch.swiftCode
                }));
            }
        } else {
            // Fetch the SWIFT code details
            swiftCodeDetails = await db.collection("swiftsCollections").findOne({ swiftCode });
        }

        // Check if the SWIFT code details are found
        if (!swiftCodeDetails) {
            return NextResponse.json({ message: "SWIFT code not found" }, { status: 404 });
        }

        // Format the response data
        const formattedResponse = {
            address: swiftCodeDetails.address,
            bankName: swiftCodeDetails.bankName,
            countryISO2: swiftCodeDetails.countryISO2,
            countryName: swiftCodeDetails.countryName,
            isHeadquarter: swiftCode.endsWith("XXX"),
            swiftCode: swiftCodeDetails.swiftCode,
            ...(swiftCode.endsWith("XXX") && { branches: swiftCodeDetails.branches || [] })
        };

        // Return the response with the SWIFT code details
        return NextResponse.json(formattedResponse);
    } catch (error) {
        //console.error("Error fetching SWIFT code details:", error);
        return NextResponse.json({ message: "Error fetching SWIFT code details" }, { status: 500 });
    }
}


// DELETE request handler for the SWIFT code
// This function deletes a SWIFT code from the database
export async function DELETE(
    request: NextRequest, { params }: { params: { swiftcode: string } }
) {
    let swiftCode = params.swiftcode;

    // Check if the SWIFT code is provided
    if (!swiftCode) {
        return NextResponse.json({ message: "SWIFT code not provided" }, { status: 400 });
    }
    // Check if the SWIFT code is 11 characters long
    if (swiftCode.length < 11) {
        return NextResponse.json({
            message: "Code must be  11 letters length"
        }, { status: 400 });
    }

    try {
        const { db } = await connectDB();

        swiftCode = swiftCode.toUpperCase();
        console.log("SWIFT code to delete:", swiftCode);

        const existingCode = await db.collection("swiftsCollections").findOne({ swiftCode });

        if (!existingCode) {
            return NextResponse.json({
                message: "SWIFT code not found: " + swiftCode
            }, { status: 404 });
        }

        // Delete the SWIFT code from the database
        await db.collection("swiftsCollections").deleteOne({ swiftCode });

        // Return the response with the deleted SWIFT code
        return NextResponse.json({
            // Return a success message
            message: "SWIFT code has been deleted (" + swiftCode + ")."
        });

    } catch (error) {
        //console.error("Error deleting SWIFT code:", error);
        // Return an error response
        return NextResponse.json({ message: "Error deleting SWIFT code, try again." }, { status: 500 });
    }

};