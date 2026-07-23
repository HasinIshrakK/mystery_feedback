import dbConnection from "@/lib/dbConnect";
import User from "@/model/User";
import bcrypt from "bcryptjs";
import sendVerificationEmail from "@/helpers/sendVerificationEmail";
import UserModel from "@/model/User";

export async function POST(req: Request) {
    await dbConnection();

    try {
        const { email, username, password } = await req.json();
        const existingUserVerifiedByUserName = await UserModel.findOne({
            username,
            isVerified: true,
        })

        if (existingUserVerifiedByUserName) {
            return Response.json(
                {
                    success: false,
                    message: "Username has already been taken, please choose another one."
                },
                {
                    status: 400
                }
            )
        };

        const existingUserByEmail = await UserModel.findOne({ email });

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit verification code       

        if (existingUserByEmail) {

            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exists with this email."
                }, { status: 400 })
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 600000);

                await existingUserByEmail.save();
            }

        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setMinutes(expiryDate.getMinutes() + 10); // Set expiry date to 10 minutes from now

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save();
        }

        // Send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 })
        }

        return Response.json({
            success: true,
            message: "User is registered successfully. Please verify your email."
        }, { status: 500 })

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