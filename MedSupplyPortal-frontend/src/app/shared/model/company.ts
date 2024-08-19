import { Address } from "./address";
import { Equipment } from "./equipment";
import { User } from "./user";
import { Appointment } from "./appointment";

export interface Company {
    id: number,
    name: string, 
    description: string,
    address: Address,
    averageRating: number ,
    start: string,
    end: string,
    appointments: Appointment[] | null,
    companyAdmins: User[] | null,
    equipmentList: Equipment[] | null
}