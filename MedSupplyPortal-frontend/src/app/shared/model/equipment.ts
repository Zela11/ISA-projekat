export interface Equipment {
    id: number,
    name: string, 
    description: string,
    isAvailable: boolean,
    companyId: number,
    amount: number,
    reservedAmount: number,
    type: number, 
    price: number,
    discountedPrice?: number
}