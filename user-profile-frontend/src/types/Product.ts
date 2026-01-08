// Eski hali: import { Profile } from "./Profile";
import type { Profile } from "./Profile"; // Başına 'type' ekledik

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  addedBy: Profile;
  categories: Category[];
}