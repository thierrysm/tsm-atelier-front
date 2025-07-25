'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';
import { FiSearch, FiUser, FiShoppingCart, FiChevronDown, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useModal } from "@/context/ModalContext";
import { usePathname } from 'next/navigation';
import { LoginDrawer } from '@/components/auth/LoginDrawer'; // ✨ Importe o novo componente


export default function Header() {
  const { openModal } = useModal();
  const { data: session, status } = useSession();
  
  const pathname = usePathname();
  
  // Estados para os menus dropdown
  const [isShopMenuOpen, setShopMenuOpen] = useState(false);
  const [isCollectionsMenuOpen, setCollectionsMenuOpen] = useState(false);

  // Estados para controlar a aparência e visibilidade
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Estados para o menu móvel
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileShopOpen, setIsMobileShopOpen] = useState(false);
  const [isMobileCollectionsOpen, setIsMobileCollectionsOpen] = useState(false);

  // Verifica se a página atual é uma página de produto
  const isProductPage = pathname.startsWith('/produto');

  // Função para fechar o menu móvel
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileShopOpen(false);
    setIsMobileCollectionsOpen(false);
  };

  // Controla o scroll quando o menu móvel está aberto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('body-no-scroll');
    } else {
      document.body.classList.remove('body-no-scroll');
    }

    return () => {
      document.body.classList.remove('body-no-scroll');
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    // Se não for a página de produto, não faz nada (header fica estático)
    if (!isProductPage) {
      setIsVisible(true); // Garante que esteja sempre visível
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // Rolando para baixo
      } else {
        setIsVisible(true);  // Rolando para cima
      }
      
      setLastScrollY(currentScrollY <= 0 ? 0 : currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname, lastScrollY, isProductPage]); // Depende da rota

  return (
    <header
      className={`
        ${styles.header}
        ${isProductPage ? styles.productPageHeader : styles.defaultHeader}
        ${!isVisible ? styles.hidden : ''}
      `}
    >
      <div className={styles.headerInner}>
        {/* Navegação desktop */}
        <nav className={styles.left}>
          {/* Menu Shop */}
          <div
            className={styles.menuContainer}
            onMouseEnter={() => setShopMenuOpen(true)}
            onMouseLeave={() => setShopMenuOpen(false)}
          >
            <Link href="/shop" className={styles.navLink}>Shop <FiChevronDown className={`${styles.arrow} ${isShopMenuOpen ? styles.open : ''}`} /></Link>
            <div className={`${styles.shopDropdown} ${isShopMenuOpen ? styles.open : ''}`}>
              <div className={styles.shopColumnLinks}>
                <ul>
                  <li><Link href="/shop/ver-tudo" className={styles.navLink}>VER TUDO</Link></li>
                  <li><Link href="/shop/novidades" className={styles.navLink}>NOVIDADES</Link></li>
                  <li><Link href="/shop/festa" className={styles.navLink}>FESTA</Link></li>
                  <li><Link href="/shop/blusas" className={styles.navLink}>BLUSAS</Link></li>
                  <li><Link href="/shop/calcas" className={styles.navLink}>CALÇAS</Link></li>
                  <li><Link href="/shop/blazers" className={styles.navLink}>BLAZERS</Link></li>
                  <li><Link href="/shop/saias" className={styles.navLink}>SAIAS</Link></li>
                  <li><Link href="/shop/vestidos" className={styles.navLink}>VESTIDOS</Link></li>
                </ul>
              </div>
              <div className={styles.imageBlock}>
                <Link href="/shop/novidades" className={styles.navLink}>
                  <div className={styles.imageWrapper}>
                    <Image src="/images/novidades.jpg" alt="Novidades" fill style={{objectFit: 'cover'}}/>
                  </div>
                  <p>NOVIDADES</p>
                </Link>
              </div>
              <div className={styles.imageBlock}>
                <Link href="/shop/best-sellers" className={styles.navLink}>
                  <div className={styles.imageWrapper}>
                    <Image src="/images/mais-vendidos.jpg" alt="Best Sellers" fill style={{objectFit: 'cover'}}/>
                  </div>
                  <p>BEST SELLERS</p>
                </Link>
              </div>
            </div>
          </div>

          {/* Link "Sale" na nova posição */}
          <Link href="/sale" className={styles.navLink}>Sale</Link>

          {/* Menu Coleções */}
          <div
            className={styles.menuContainer}
            onMouseEnter={() => setCollectionsMenuOpen(true)}
            onMouseLeave={() => setCollectionsMenuOpen(false)}
          >
            <Link href="/collections" className={styles.navLink}>Coleções <FiChevronDown className={`${styles.arrow} ${isCollectionsMenuOpen ? styles.open : ''}`} /></Link>
            <div className={`${styles.collectionsDropdown} ${isCollectionsMenuOpen ? styles.open : ''}`}>
              <ul>
                <li><Link href="/colecao/colecao-verao-2025" className={styles.navLink}>Verão Celeste</Link></li>
                <li><Link href="/colecao/classicos-atemporais" className={styles.navLink}>Essência Urbana</Link></li>
                <li><Link href="/colecao/festa-&-gala" className={styles.navLink}>Noites de Gala</Link></li>
                <li><Link href="/colecao/atemporal" className={styles.navLink}>Atemporal</Link></li>
              </ul>
            </div>
          </div>

          <Link href="/sobre" className={styles.navLink}>Sobre</Link>
        </nav>

        {/* Botão hambúrguer para mobile */}
        <button 
          className={styles.mobileMenuButton}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menu"
        >
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>

        <div className={styles.logo}>
          <Link href="/">
            <Image 
              src="/images/logo-tsm-oficial.png" 
              alt="TSM Atelier" 
              width={140} 
              height={50} 
              priority
            />
          </Link>
        </div>

        <div className={styles.right}>
          <button aria-label="Pesquisar"><FiSearch /></button>
          
        {/* RENDERIZAÇÃO CONDICIONAL DO BOTÃO DE LOGIN/LOGOUT */}
          {status === 'authenticated' ? (
            // Se o usuário está autenticado, mostra o botão de Logout
            <button 
              aria-label="Sair" 
              onClick={() => signOut({ callbackUrl: '/' })} // Chama signOut e redireciona para a home
            >
              <FiLogOut />
            </button>
          ) : (
            // Se não, mostra o botão de Login
            <button aria-label="Login" onClick={() => openModal(<LoginDrawer />)}>
              <FiUser />
            </button>
          )}
          <button aria-label="Carrinho"><FiShoppingCart /></button>
        </div>
      </div>

      {/* Menu móvel */}
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
        <div className={styles.mobileMenuContent}>


          <nav className={styles.mobileNav}>
            {/* Menu Shop Mobile */}
            <div className={styles.mobileMenuItem}>
              <button 
                className={`${styles.mobileMenuButton} ${isMobileShopOpen ? styles.open : ''}`}
                onClick={() => setIsMobileShopOpen(!isMobileShopOpen)}
              >
                Shop <FiChevronDown className={`${styles.mobileArrow} ${isMobileShopOpen ? styles.open : ''}`} />
              </button>
              <div className={`${styles.mobileSubmenu} ${isMobileShopOpen ? styles.open : ''}`}>
                <Link href="/shop/ver-tudo" onClick={closeMobileMenu}>VER TUDO</Link>
                <Link href="/shop/novidades" onClick={closeMobileMenu}>NOVIDADES</Link>
                <Link href="/shop/festa" onClick={closeMobileMenu}>FESTA</Link>
                <Link href="/shop/blusas" onClick={closeMobileMenu}>BLUSAS</Link>
                <Link href="/shop/calcas" onClick={closeMobileMenu}>CALÇAS</Link>
                <Link href="/shop/blazers" onClick={closeMobileMenu}>BLAZERS</Link>
                <Link href="/shop/saias" onClick={closeMobileMenu}>SAIAS</Link>
                <Link href="/shop/vestidos" onClick={closeMobileMenu}>VESTIDOS</Link>
              </div>
            </div>

            {/* Link Sale */}
            <Link href="/sale" onClick={closeMobileMenu} className={styles.mobileNavLink}>
              Sale
            </Link>

            {/* Menu Coleções Mobile */}
            <div className={styles.mobileMenuItem}>
              <button 
                className={`${styles.mobileMenuButton} ${isMobileCollectionsOpen ? styles.open : ''}`}
                onClick={() => setIsMobileCollectionsOpen(!isMobileCollectionsOpen)}
              >
                Coleções <FiChevronDown className={`${styles.mobileArrow} ${isMobileCollectionsOpen ? styles.open : ''}`} />
              </button>
              <div className={`${styles.mobileSubmenu} ${isMobileCollectionsOpen ? styles.open : ''}`}>
                <Link href="/colecao/colecao-verao-2025" onClick={closeMobileMenu}>Verão Celeste</Link>
                <Link href="/colecao/classicos-atemporais" onClick={closeMobileMenu}>Essência Urbana</Link>
                <Link href="/colecao/festa-&-gala" onClick={closeMobileMenu}>Noites de Gala</Link>
                <Link href="/colecao/atemporal" onClick={closeMobileMenu}>Atemporal</Link>
              </div>
            </div>

            {/* Link Sobre */}
            <Link href="/sobre" onClick={closeMobileMenu} className={styles.mobileNavLink}>
              Sobre
            </Link>
          </nav>

          {/* Seção de contato */}
          <div className={styles.mobileContactSection}>
            <div className={styles.mobileContactDivider}></div>
            <div className={styles.mobileContactInfo}>
              <p className={styles.mobileContactTitle}>Precisa de ajuda?</p>
              <a href="tel:+551130605099" className={styles.mobileContactPhone}>
                +55 (11) 3060-5099
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}