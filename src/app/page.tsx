import Image from 'next/image';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      {/* SEÇÃO 1: IMAGEM DE TELA CHEIA */}
      <section className={styles.heroSection}>
        <Image
          src="/images/3.jpg" // Troque pelo caminho da sua imagem principal
          alt="Modelo vestindo uma peça de alta costura"
          fill
          style={{ objectFit: 'cover' }}
          priority // Ajuda a carregar a imagem principal mais rápido
        />
        <div className={styles.heroOverlay}>
          {/* Você pode adicionar um título ou botão aqui se quiser */}
          {/* <h1>TSM Atelier</h1> */}
        </div>
      </section>

      {/* SEÇÃO 2: DUAS IMAGENS LADO A LADO */}
      <section className={styles.splitSection}>
        <div className={styles.splitImageContainer}>
          <Image
            src="/images/1.jpg" // Troque pelo caminho da sua primeira imagem
            alt="Detalhe de uma coleção"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className={styles.splitImageContainer}>
          <Image
            src="/images/2.jpg" // Troque pelo caminho da sua segunda imagem
            alt="Outro detalhe da coleção"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      </section>
    </main>
  );
}