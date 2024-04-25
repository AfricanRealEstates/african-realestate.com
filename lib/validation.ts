import { z } from "zod"

// export const updateProfileSchema = z.object({
//     name: z.string().trim().min(1, "Cannot be empty"),
// })

// export type UpdateProfileValues = z.infer<typeof updateProfileSchema>

// Dashboard profile update
export const updateUserSchema = z.object({
    name: z.string({ required_error: "Full Name is required" }).min(1, "Full Name is required"),
})
export type UpdateUserInput = z.infer<typeof updateUserSchema>

// Create User Schema

export const createUserSchema = z.object({
    name: z.string({ required_error: "Full Name is required" }).min(1, "Full Name is required"),
    email: z.string({ required_error: "Email is required" }).min(1, "Email is required").email("Invalid email"),
    image: z.string().optional(),
    password: z.string({ required_error: "Password is required" }).min(1, 'Password is required').min(6, "Password must be more than 6 characters").max(32, "Password must be less than 32 characters"),
    passwordConfirm: z.string({
        required_error: "Please confirm your password",
    }).min(1, "Please confirm your password"),
}).refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: "Passwords do not match"
})

export type CreateUserInput = z.infer<typeof createUserSchema>
// Create Login Schema

export const loginUserSchema = z.object({
    email: z.string({ required_error: "Email is required" }).min(1, "Email is required").email("Invalid email or password"),
    password: z.string({ required_error: "Password is required" }).min(1, 'Password is required')
})


export type LoginUserInput = z.infer<typeof loginUserSchema>








