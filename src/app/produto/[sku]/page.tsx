import { customFetch } from '@/lib/fetcher';
import type { ProductResponse } from '@/lib/types';
import { notFound } from 'next/navigation';
import { ProductDetails } from './ProductDetails';

async function getProduct(sku: string): Promise<ProductResponse> {
  try {
    const product = await customFetch(`/products/${sku}`);
    return product;
  } catch (error: any) {
    if (error.status === 404) notFound();
    throw new Error('Falha ao buscar produto');
  }
}

export default async function ProductPage({ params }: { params: Promise<{ sku: string }> }) {
  const { sku } = await params;
  const product = await getProduct(sku);

  // Apenas busca os dados e passa para o componente cliente, que cuida de todo o resto.
  return <ProductDetails product={product} />;
  
}