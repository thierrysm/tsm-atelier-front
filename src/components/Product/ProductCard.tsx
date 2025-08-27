import Image from 'next/image';
import Link from 'next/link';
import type { ProductResponse } from '@/lib/types';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: ProductResponse;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images.find((img) => img.isPrimary)?.imageUrl;
  const price = product.promotionalPrice ?? product.price;

  // --- LÓGICA DE PROMOÇÃO ---
  // Um produto está em promoção se o preço promocional existir e for menor que o preço original.
  const isOnSale = product.promotionalPrice && product.promotionalPrice < product.price;

  // --- LÓGICA DE CORES ATUALIZADA ---
  
  // 1. Cria uma lista de objetos de cor únicos (nome e hex)
  // Usamos um Map para garantir a unicidade baseada no nome da cor.
  const distinctColors = [
    ...new Map(product.variants.map((v) => [v.colorName, v])).values(),
  ];

  // 2. Pega a primeira cor para exibir o swatch
  const firstColor = distinctColors.length > 0 ? distinctColors[0] : null;

  // 3. Calcula o número de cores ADICIONAIS
  const additionalColorsCount = distinctColors.length - 1;

   return (
    <Link href={`/produto/${product.sku}`} className={styles.card}>
      <div className={styles.imageContainer}>
        {primaryImage && (
          <Image
            src={primaryImage}
            alt={product.name}
            width={400}
            height={500}
            className={styles.productImage}
          />
        )}
      </div>

      <div className={styles.detailsContainer}>
        <h3 className={styles.productName}>{product.name}</h3>
        {/* A lógica condicional continua a mesma (só mostra se tiver mais de uma cor) */}
        {distinctColors.length > 1 && firstColor && (
          <div className={styles.colorInfo}>
            <div
              className={styles.colorSwatch}
              // ✨ USA O CAMPO 'colorHex' PARA O CSS ✨
              style={{ backgroundColor: firstColor.colorHex }}
              // ✨ USA O CAMPO 'colorName' PARA ACESSIBILIDADE ✨
              title={firstColor.colorName}
            ></div>
            {additionalColorsCount > 0 && (
              <span className={styles.additionalColors}>
                +{additionalColorsCount}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ✨ RENDERIZAÇÃO CONDICIONAL DO PREÇO ✨ */}
      {isOnSale ? (
        // Se estiver em promoção, mostra os dois preços
        <div className={styles.priceContainer}>
          <span className={styles.originalPrice}>
            R$ {product.price.toFixed(2).replace('.', ',')}
          </span>
          <span className={styles.promotionalPrice}>
            R$ {product.promotionalPrice!.toFixed(2).replace('.', ',')}
          </span>
        </div>
      ) : (
        // Se NÃO estiver em promoção, mostra apenas o preço normal
        <p className={styles.regularPrice}>
          R$ {product.price.toFixed(2).replace('.', ',')}
        </p>
      )}
    </Link>
  );
}