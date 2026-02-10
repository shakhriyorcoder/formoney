
import { PlanType } from './types';

export const APP_NAME = "Qayerda Arzoni?";

export const PRICING_PLANS = [
  {
    type: PlanType.FREE,
    name: "Bepul",
    price: "0",
    features: [
      "Faqat matnli qidiruv",
      "Cheksiz matnli qidiruv",
      "Barcha marketpleyslar"
    ],
    limit: 0,
    cta: "Hozir boshlash",
    highlight: false
  },
  {
    type: PlanType.BASIC,
    name: "Basic",
    price: "45 000",
    features: [
      "Rasm orqali qidirish",
      "Oyiga 20 ta rasm qidiruvi",
      "Barcha marketpleyslar",
      "Reklamasiz"
    ],
    limit: 20,
    cta: "Sotib olish",
    highlight: true,
    tag: "ENG OMMABOP"
  },
  {
    type: PlanType.PRO,
    name: "Pro",
    price: "69 000",
    features: [
      "Rasm orqali qidirish",
      "Oyiga 100 ta rasm qidiruvi",
      "Tezkor qidiruv",
      "Narx tushishi haqida xabar",
      "Qidiruv tarixi"
    ],
    limit: 100,
    cta: "Pro-ga o'tish",
    highlight: false,
    tag: "ENG FOYDALI"
  }
];

export const MARKETPLACES = [
  { name: 'Uzum', active: true },
  { name: 'Wildberries', active: true },
  { name: 'Yandex Market', active: true }
];
