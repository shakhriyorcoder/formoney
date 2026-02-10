
import { Marketplace, Product } from '../types';
import { geminiService, StructuredProduct } from './geminiService';

export const marketplaceService = {
  /**
   * AI yordamida Google-dan real vaqtda ma'lumotlarni yig'ish
   */
  async searchProducts(query: string): Promise<{ products: Product[], rawText: string, sources: any[] }> {
    const rawResults = await geminiService.findProductsViaSearch(query);
    
    // AI-dan kelgan natijalarni bizning Product formatiga o'tkazamiz
    const products: Product[] = rawResults.map((item: StructuredProduct, index: number) => ({
      id: `ai-${index}-${Date.now()}`,
      title: item.title,
      price: item.price,
      currency: item.currency || "so'm",
      imageUrl: item.imageUrl || `https://picsum.photos/seed/${index}/400/400`,
      marketplace: item.marketplace as Marketplace || Marketplace.UZUM,
      link: item.link,
      isCheapest: false // Keyinchalik hisoblaymiz
    }));

    // Eng arzonini belgilash
    if (products.length > 0) {
      const validPrices = products.filter(p => p.price > 0);
      if (validPrices.length > 0) {
        const minPrice = Math.min(...validPrices.map(p => p.price));
        const cheapest = products.find(p => p.price === minPrice);
        if (cheapest) cheapest.isCheapest = true;
      }
    }

    return { 
      products, 
      rawText: "", // Matnli tahlil endi kerakmas
      sources: [] 
    };
  }
};
