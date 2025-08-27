// Este tipo deve espelhar o seu DTO ProductResponse do backend
export interface ProductImageResponse {
  id: string;
  imageUrl: string;
  altText: string | null;
  isPrimary: boolean;
  colorName: string;
}

/**
 * Interface para uma única variação de produto (tamanho/cor/estoque).
 * Esta é a parte que estava faltando ou incompleta.
 */
export interface ProductVariantResponse {
  id: string;
  sku: string;
  size: string;
  colorName: string;
  colorHex: string;
  quantityInStock: number;
}

/**
 * A interface principal e completa para um produto,
 * agora incluindo a lista de variações.
 */
export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  promotionalPrice: number | null;
  sku: string;
  category: string;
  isActive: boolean;
  materials: string[];
  careInstructions: string[];
  variants: ProductVariantResponse[];
  images: ProductImageResponse[];
  createdAt: string;
  updatedAt: string;
  version: number;
}

/**
 * Interface para os detalhes de uma coleção.
 */
export interface CollectionResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}
