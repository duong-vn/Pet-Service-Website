export enum ServiceType {
  BATH = "BATH",
  HOTEL = "HOTEL",
  GROOMING = "GROOMING",
  OTHER = "OTHER",
}

export enum PetType {
  DOG = "DOG",
  CAT = "CAT",
  OTHER = "OTHER",
}

export enum Variant {
  STANDARD = "STANDARD",
  PRO = "PRO",
  PROMAX = "PROMAX",
}

export interface IService {
  id: string;
  name: string;
  description: string[];
  duration: number; // in minutes
  priceStart: number;
  priceEnd: number;
  picture: string;
  pet: PetType;
  type: ServiceType;
  public_id: string;
  variant: Variant;
}
