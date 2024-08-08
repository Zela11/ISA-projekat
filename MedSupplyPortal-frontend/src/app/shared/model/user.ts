import { Address } from "./address"

export interface User {
    id: number, 
    firstName: string,
    lastName: string, 
    email: string,
    password: string,
    phoneNumber: string,
    occupation: string,
    userType: number, 
    penaltyPoints: number,
    address: Address, 
    companyId?: number,
}