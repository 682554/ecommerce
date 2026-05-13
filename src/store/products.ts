import { create } from "zustand";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  createdAt: Date;
}

interface ProductsState {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useProductsStore = create<ProductsState>((set) => ({
  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
