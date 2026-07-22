import dbConnection from "@/lib/dbConnect";
import User from "@/model/User";
import bcrypt from "bcryptjs";
import sendverificationEmail from "@/helpers/sendVerificationEmail";

export async function POST(req: Request) {
    await dbConnection();

    try {
        const { email, username, password } = await req.json();

    } catch (error) {
        console.error("Error registering user:", error);
        return new Response(JSON.stringify(
            { message: "Error registering user" }
        ),
            {
                status: 500
            });
    }
}