import { CategoryScale } from "./categoryScale";

export interface LoyaltyProgram {
    pointsPerPickup: number,
    categoryScales: CategoryScale[] | null
}