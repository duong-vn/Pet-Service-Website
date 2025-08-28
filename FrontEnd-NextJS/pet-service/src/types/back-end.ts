import { PriceRule } from "@/app/(with-navbar)/services/[_id]/PriceRuleModal";

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
  _id: string;
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
  createdAt: Date;
  updatedAt: Date;
  rules?: PriceRule[];
}

export enum IStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}

export enum MODULES {
  USERS = "USERS",
  SERVICES = "SERVICES",
  PRICERULES = "PRICE-RULES",
  ROLES = "ROLES",
  PERMISSIONS = "PERMISSIONS",
  APPOINTMENTS = "APPOINTMENTS",
}
