
export enum Marketplace {
  UZUM = 'Uzum',
  WILDBERRIES = 'Wildberries',
  YANDEX = 'Yandex Market'
}

export enum Language {
  EN = 'en',
  UZ = 'uz',
  RU = 'ru'
}

export interface Product {
  id: string;
  title: string;
  price: number;
  currency: string;
  imageUrl: string;
  marketplace: Marketplace;
  link: string;
  rating?: number;
  isCheapest?: boolean;
}

export enum PlanType {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PRO = 'PRO'
}

export interface UserSubscription {
  plan: PlanType;
  imageSearchesUsed: number;
  imageSearchLimit: number;
  expiresAt?: string;
}

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
}
