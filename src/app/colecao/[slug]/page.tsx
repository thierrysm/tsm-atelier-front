import { ProductCard } from '@/components/Product/ProductCard';
import { customFetch } from '@/lib/fetcher';
import type { CollectionResponse, ProductResponse } from '@/lib/types';
import { notFound } from 'next/navigation';
import styles from './CollectionPage.module.css'; // ✨ Importa os estilos da página

// ... (Suas funções getCollectionDetails e getProductsForCollection continuam as mesmas)

// Funções para buscar os dados no nosso backend
async function getCollectionDetails(slug: string): Promise<CollectionResponse> {
  try {
    const collection = await customFetch(`/collections/${slug}`);
    return collection;
  } catch (error: any) {
    if (error.status === 404) {
      notFound(); // Renderiza a página 404 do Next.js
    }
    throw new Error('Falha ao buscar detalhes da coleção');
  }
}

async function getProductsForCollection(slug: string): Promise<ProductResponse[]> {
  try {
    const products = await customFetch(`/products?collection=${slug}`);
    return products;
  } catch (error) {
    console.error('Falha ao buscar produtos da coleção:', error);
    return []; // Retorna lista vazia em caso de erro para não quebrar a página
  }
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [collection, products] = await Promise.all([
    getCollectionDetails(slug),
    getProductsForCollection(slug),
  ]);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className={styles.pageContainer}>
        <h1 className={styles.pageTitle}>
          {collection.name}
        </h1>

        {products.length > 0 ? (
          <div className={styles.productGrid}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className={styles.noProductsMessage}>
            Nenhum produto encontrado nesta coleção no momento.
          </p>
        )}
      </div>
    </div>
  );
}