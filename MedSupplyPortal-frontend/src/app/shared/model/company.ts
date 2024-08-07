import { Address } from "./address";

export interface Company {
    id: number,
    name: string, 
    description: string,
    address: Address,
    averageRating: number 
}