'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './SizeGuide.module.css';

// ✨ Adicionamos as posições 'top' para cada medida
const sizeData = {
    'EP': { busto: '82 cm', cintura: '62 cm', quadril: '90 cm', bustoTop: '35%', cinturaTop: '48%', quadrilTop: '61%' },
    'P': { busto: '86 cm', cintura: '66 cm', quadril: '94 cm', bustoTop: '35%', cinturaTop: '48%', quadrilTop: '61%' },
    'M': { busto: '92 cm', cintura: '72 cm', quadril: '100 cm', bustoTop: '35%', cinturaTop: '48%', quadrilTop: '61%' },
    'G': { busto: '98 cm', cintura: '78 cm', quadril: '106 cm', bustoTop: '35%', cinturaTop: '48%', quadrilTop: '61%' },
};

export function SizeGuide() {
  const [selectedSize, setSelectedSize] = useState<'EP' | 'P' | 'M' | 'G'>('P');

  const currentMeasurements = sizeData[selectedSize];

  return (
    <div className={styles.container}>
      <h2>Guia de Tamanhos</h2>
      
      {/* O container da imagem agora contém a imagem E as etiquetas */}
      <div className={styles.imageWrapper}>
        <Image src="/images/size-guide-image.png" alt="Guia de medidas" width={400} height={500} style={{width: '100%', height: 'auto'}} />

        {/* ✨ ETIQUETAS DE MEDIDA POSICIONADAS ABSOLUTAMENTE ✨ */}
        <div 
          className={styles.measurementLabel} 
          style={{ top: currentMeasurements.bustoTop }}
        >
          {currentMeasurements.busto}
        </div>
        <div 
          className={styles.measurementLabel} 
          style={{ top: currentMeasurements.cinturaTop }}
        >
          {currentMeasurements.cintura}
        </div>
        <div 
          className={styles.measurementLabel} 
          style={{ top: currentMeasurements.quadrilTop }}
        >
          {currentMeasurements.quadril}
        </div>
      </div>
      
      <div className={styles.selector}>
        {(Object.keys(sizeData) as Array<keyof typeof sizeData>).map((size) => (
          <button 
            key={size} 
            className={`${styles.sizeButton} ${selectedSize === size ? styles.selected : ''}`}
            onClick={() => setSelectedSize(size)}
          >
            {size}
          </button>
        ))}
      </div>

      {/* A lista de equivalências foi removida daqui */}
    </div>
  );
}