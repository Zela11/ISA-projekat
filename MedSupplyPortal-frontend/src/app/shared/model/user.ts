import { Address } from "./address"

export interface User {
    id: number, 
    firstname: string,
    lastname: string, 
    email: string,
    password: string,
    phoneNumber: string,
    occupation: string,
    userType: number, 
    penaltyPoints: number,
    address: Address, // Include address
    companyId?: number,
}