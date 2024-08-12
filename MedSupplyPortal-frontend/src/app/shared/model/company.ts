import { Address } from "./address";
import { Equipment } from "./equipment";
import { User } from "./user";

export interface Company {
    id: number,
    name: string, 
    description: string,
    address: Address,
    averageRating: number 
    companyAdmins: User[] | null,
    equipmentList: Equipment[] | null
}