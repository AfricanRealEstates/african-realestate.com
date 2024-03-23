import { UserRole } from "@prisma/client";

export type RegisterInputProps = {
    fullName: string;
    role: UserRole;
    email: string;
    password: string;
}

export type LoginInputProps = {
    email: string;
    password: string
}