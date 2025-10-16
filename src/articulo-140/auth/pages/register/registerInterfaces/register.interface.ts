export type role = "admin" | "student" | "supervisor"

export interface userComplete{
    name: string,
    email: string,
    password: string,
    accountNumber: number,
    identityNumber: string,
    role: role,
    degreeId: number
}