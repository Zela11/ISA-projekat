export interface Appointment {
    companyId: number,
    administratorId: number, 
    duration: number,
    slot: Date,
    status: number,
    equipmentId: number | null,
    equipmentAmount: number | null
}