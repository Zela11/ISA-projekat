export interface Appointment {
    companyId: number,
    administratorId: number, 
    userId: number | null,
    duration: number,
    slot: Date,
    status: number,
    equipmentId: number | null,
    equipmentAmount: number | null,
    uniqueReservationId: string | null,
    totalPrice: number | null
}