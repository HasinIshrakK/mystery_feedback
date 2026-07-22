import z from "zod";

export const userNameValidation = z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(24, "Username cannot be be more that 24 charaters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username cannot have special characters")

export const signUpSchema = z.object(
    {
        username: userNameValidation,
        email: z.string().email({ message: "Please enter a valid email" }),
        password: z.string().min(8, { message: "Password must contain 8 characters at least" })
    }
)