export interface Testimonial {
  id: number;
  name: string;
  age: number;
  location: string;
  text: string;
  rating: number;
}

export interface ProductPackage {
  id: string;
  name: string;
  containers: number;
  price: number;
  originalPrice?: number;
  description: string;
  subtitle?: string;
  savings?: number;
  savingsText?: string;
  badge?: string;
  recommendedFor?: string;
  deliveryText?: string;
  usageNote?: string;
}

export interface QuizQuestion {
  id: number;
  text: string;
  options: { text: string; score: number }[];
}

export enum QuizSeverity {
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE'
}

export interface CartItem {
  packageId: string;
  quantity: number;
}

export interface QuizResult {
  score: number;
  severity: QuizSeverity;
  answers: Record<number, number>; // questionId -> score
}