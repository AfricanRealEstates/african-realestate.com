import parsePhoneNumberFromString from 'libphonenumber-js';
import { z } from "zod"

const nonEmptyString = z.string().trim().min(3, { message: "Value must be at least 3 characters" })

const ImageSchema = z.union([
    z.string().url("Invalid URL"), // to validate image URLs
    z.custom<File | undefined>()
        .refine(
            (file) => !file || (file instanceof File && file.type.startsWith("image/")),
            "Only Images Allowed"
        )
        .refine((file) => !file || file.size < 1024 * 1024 * 5, "File must be less than 5MB")
]);

export const profileFormSchema = z.object({
    name: z.string().min(1, "Full Name is required"),
    email: z.string().email("Invalid email address"),
    whatsappNumber: nonEmptyString.transform((arg, ctx) => {
        const phone = parsePhoneNumberFromString(arg, {

            defaultCountry: 'KE',


            extract: false,
        });


        if (phone && phone.isValid()) {
            return phone.number;
        }

        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Invalid phone number',
        });
        return z.NEVER;
    }),
    phoneNumber: nonEmptyString.transform((arg, ctx) => {
        const phone = parsePhoneNumberFromString(arg, {

            defaultCountry: 'KE',


            extract: false,
        });


        if (phone && phone.isValid()) {
            return phone.number;
        }

        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Invalid phone number',
        });
        return z.NEVER;
    }),
    tiktokLink: z.string().optional(),
    xLink: z.string().optional(),
    facebookLink: z.string().optional(),
    linkedinLink: z.string().optional(),
    instagramLink: z.string().optional(),
    bio: z.string().min(2, "Bio is required").max(1000, "Must be at most 1000 characters"),
});

export type profileFormValues = z.infer<typeof profileFormSchema>

// Phone number validation
const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);
// Dashboard profile update
export const updateUserSchema = z.object({
    agentName: nonEmptyString,
    agentEmail: nonEmptyString.email(),
    officeLine: nonEmptyString.transform((arg, ctx) => {
        const phone = parsePhoneNumberFromString(arg, {

            defaultCountry: 'KE',

            extract: false,
        });

        if (phone && phone.isValid()) {
            return phone.number;
        }

        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Invalid phone number',
        });
        return z.NEVER;
    }),
    whatsappNumber: nonEmptyString.transform((arg, ctx) => {
        const phone = parsePhoneNumberFromString(arg, {

            defaultCountry: 'KE',


            extract: false,
        });


        if (phone && phone.isValid()) {
            return phone.number;
        }

        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Invalid phone number',
        });
        return z.NEVER;
    }),
    address: nonEmptyString,
    postalCode: nonEmptyString,
    bio: nonEmptyString,
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




export const LikeSchema = z.object({
    propertyId: z.string()
})

export const BookmarkSchema = z.object({
    propertyId: z.string()
})

export const CommentSchema = z.object({
    id: z.string(),
    body: z.string(),
    propertyId: z.string(),
});

export const CreateComment = CommentSchema.omit({ id: true });
export const UpdateComment = CommentSchema;
export const DeleteComment = CommentSchema.pick({ id: true });