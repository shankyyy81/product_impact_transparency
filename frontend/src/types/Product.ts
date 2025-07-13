export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  carbonFootprint: number;
  recyclability: number;
  sourcing: string;
  ethicalScore: string;
  category: string;
  description: string;
  impactMeter: 'green' | 'yellow' | 'red';
  createdAt: string;
  updatedAt: string;
  store: string;
  brand: string;
  buyUrl: string;
}

export interface ProductAlternatives {
  currentProduct: {
    id: string;
    name: string;
    category: string;
  };
  alternatives: Product[];
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
} 