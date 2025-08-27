'use client'; // Marca este como um Client Component para permitir interatividade

import { useState, useMemo, useEffect, JSX } from 'react';
import type { ProductResponse, ProductImageResponse } from '@/lib/types';
import styles from './ProductPage.module.css';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useModal } from '@/context/ModalContext'; // ✨ Importe o hook
import { SizeGuide } from '@/components/SizeGuide/SizeGuide'; // ✨ Importe o conteúdo

interface ProductDetailsProps {
  product: ProductResponse;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  // --- ESTADO DO COMPONENTE ---
  const { openModal } = useModal();
  
  // Guarda a cor e o tamanho que o usuário selecionou.
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.variants[0]?.colorName || null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

   // ✨ NOVO ESTADO: Guarda as imagens que devem ser exibidas na galeria (thumbnails)
  const [displayImages, setDisplayImages] = useState<ProductImageResponse[]>([]);
  
  // ✨ NOVO ESTADO: Guarda a imagem que está atualmente em destaque (principal)
  const [currentImage, setCurrentImage] = useState<ProductImageResponse | null>(null);

  // Define todos os tamanhos possíveis que sua loja oferece
  const ALL_SIZES = ['PP', 'P', 'M', 'G', 'GG'];

  // --- EFEITOS ---

  // Este efeito é executado sempre que a cor selecionada muda.
  // Ele filtra a lista de imagens completa para mostrar apenas as da cor correta.
  useEffect(() => {
    if (selectedColor) {
      const imagesForSelectedColor = product.images.filter(
        (img) => img.colorName === selectedColor
      );
      setDisplayImages(imagesForSelectedColor);
      
      // Define a imagem principal como a primária da nova cor, ou a primeira da lista
      const primaryImage = imagesForSelectedColor.find(img => img.isPrimary) ?? imagesForSelectedColor[0];
      setCurrentImage(primaryImage || null);
    }
  }, [selectedColor, product.images]);

  const handleNextImage = () => {
    if (!currentImage || displayImages.length <= 1) return;
    const currentIndex = displayImages.findIndex(img => img.id === currentImage.id);
    const nextIndex = (currentIndex + 1) % displayImages.length; // Volta para o início se chegar ao fim
    setCurrentImage(displayImages[nextIndex]);
  };

  const handlePrevImage = () => {
    if (!currentImage || displayImages.length <= 1) return;
    const currentIndex = displayImages.findIndex(img => img.id === currentImage.id);
    const prevIndex = (currentIndex - 1 + displayImages.length) % displayImages.length; // Volta para o fim se estiver no início
    setCurrentImage(displayImages[prevIndex]);
  };

  // Cria uma lista de cores únicas disponíveis para este produto
  const colors = useMemo(
    () => [...new Map(product.variants.map((v) => [v.colorName, v])).values()],
    [product.variants]
  );

  // Encontra a variação exata (SKU) com base na cor e tamanho selecionados
  const selectedVariant = product.variants.find(
    (v) => v.colorName === selectedColor && v.size === selectedSize
  );
  
  // Verifica se o produto está em promoção
  const isOnSale =
    product.promotionalPrice && product.promotionalPrice < product.price;

  // Encontra a imagem principal para a cor selecionada
  const primaryImage = displayImages.find(img => img.isPrimary) ?? displayImages[0];

  // --- RENDERIZAÇÃO DO COMPONENTE ---
  return (
    <div className={styles.pageWrapper}>
    <div className={styles.mainContainer}>
      {/* Coluna da Esquerda: Galeria de Imagens */}
      {/* Coluna da Esquerda: Galeria de Imagens Dinâmica */}
      <div className={styles.imageGallery}>
        <div className={styles.thumbnailList}>
          {displayImages.map((img) => (
            <div
              key={img.id}
              // ✨ LÓGICA DE CLASSE ATUALIZADA PARA O EFEITO DE COR ✨
              className={`${styles.thumbnailItem} ${
                currentImage?.id === img.id ? styles.thumbnailActive : styles.thumbnailInactive
              }`}
              onClick={() => setCurrentImage(img)}
            >
              <Image
                src={img.imageUrl}
                alt={img.altText || product.name}
                fill
                sizes="(max-width: 768px) 10vw, 5vw"
                className={styles.thumbnailImage}
              />
              
            </div>
          ))}
        </div>
        <div className={styles.mainImageWrapper}>
          {currentImage && (
            <Image
              key={currentImage.id}
              src={currentImage.imageUrl}
              alt={currentImage.altText || product.name}
              fill
              sizes="(max-width: 768px) 80vw, 50vw"
              className={styles.mainImage}
              priority
            />
            
          )}
          {/* ✨ BOTÕES DE NAVEGAÇÃO ADICIONADOS ✨ */}
          {displayImages.length > 1 && (
            <>
              <button className={`${styles.navArrow} ${styles.prevArrow}`} onClick={handlePrevImage} aria-label="Imagem anterior">
                <FiChevronLeft />
              </button>
              <button className={`${styles.navArrow} ${styles.nextArrow}`} onClick={handleNextImage} aria-label="Próxima imagem">
                <FiChevronRight />
              </button>
            </>
          )}
        </div>
      </div>


      {/* Coluna da Direita: Detalhes e Ações */}
      <div className={styles.detailsWrapper}>
        <h1 className={styles.productName}>{product.name}</h1>
        
        {/* Renderização condicional do preço */}
        {isOnSale ? (
          <div className={styles.priceContainer}>
            <span className={styles.originalPrice}>
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
            <span className={styles.promotionalPrice}>
              R$ {product.promotionalPrice!.toFixed(2).replace('.', ',')}
            </span>
          </div>
        ) : (
          <p className={styles.regularPrice}>
            R$ {product.price.toFixed(2).replace('.', ',')}
          </p>
        )}

        <div className={styles.divider}></div>

        {/* Seletor de Cor */}
        <div className={styles.selectorContainer}>
          <p className={styles.selectorLabel}>{selectedColor} | {selectedVariant?.sku ?? product.sku}</p>
          <div className={styles.swatchGroup}>
            {colors.map((variant) => (
              <button
                key={variant.colorHex}
                onClick={() => {
                  setSelectedColor(variant.colorName);
                  setSelectedSize(null);
                }}
                className={`${styles.colorSwatch} ${
                  selectedColor === variant.colorName ? styles.selectedSwatch : ''
                }`}
                style={{ backgroundColor: variant.colorHex }}
                title={variant.colorName}
              />
            ))}
          </div>
        </div>

        {/* Seletor de Tamanho */}
        <div className={styles.selectorContainer}>
          <div className={styles.sizeHeader}>
          </div>
          <div className={styles.sizeGroup}>
            {ALL_SIZES.map((size) => {
              const variantForThisSize = product.variants.find(
                (v) => v.size === size && v.colorName === selectedColor
              );
              const isAvailable = variantForThisSize && variantForThisSize.quantityInStock > 0;

              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  disabled={!isAvailable}
                  className={`${styles.sizeButton} ${
                    selectedSize === size ? styles.selectedSize : ''
                  }`}
                >
                  {size}
                </button>
              );
            })}
            {/* ✨ BOTÃO ADICIONADO ✨ */}
          <button 
            onClick={() => openModal(<SizeGuide />)} 
            className={styles.sizeGuideLink}
          >
            Guia de tamanhos
          </button>
          </div>
        </div>
        
        {/* Botão de Adicionar ao Carrinho */}
        <button
          className={styles.addToCartButton}
          disabled={!selectedVariant || selectedVariant.quantityInStock === 0}
          onClick={() => alert(`Adicionando SKU: ${selectedVariant?.sku} ao carrinho!`)}
        >
          {selectedVariant?.quantityInStock === 0
            ? 'Esgotado'
            : selectedVariant
            ? 'ADICIONAR'
            : 'SELECIONE UM TAMANHO'}
        </button>

        {/* Descrição e detalhes do produto */}
        <div className={styles.detailsSection}>
          <p>{product.description}</p>
        </div>
        <div className={styles.detailsSection}>
          <p>{product.description}</p>
        </div><div className={styles.detailsSection}>
          <p>{product.description}</p>
        </div><div className={styles.detailsSection}>
          <p>{product.description}</p>
        </div><div className={styles.detailsSection}>
          <p>{product.description}</p>
        </div><div className={styles.detailsSection}>
          <p>{product.description}</p>
        </div>
      </div>
    </div>
    </div>
  );
}