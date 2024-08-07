export interface Address {
    city: string;
    country: string;
    street: string;
    latitude?: number; // Optional if it can be null
    longitude?: number; // Optional if it can be null
}