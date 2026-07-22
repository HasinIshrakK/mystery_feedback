import z from "zod";

export const messageSchema = z.object({
    content: z
    .string()
    .min(10, {message: "Message must be of at least 10 characters"})
    .min(500, {message: "Message cannot be have more that 500 characters"}),
});