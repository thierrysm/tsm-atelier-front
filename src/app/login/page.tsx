import styles from './Login.module.css';
import { FiShoppingBag, FiUser, FiMail, FiHeart } from 'react-icons/fi';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

// ✨ 1. Adicione 'async' na definição da função ✨
export default async function LoginPage({ searchParams }: { searchParams: { view?: string } }) {
  // ✨ 2. Use 'await' para resolver os searchParams ✨
  const awaitedSearchParams = await searchParams;
  const currentView = awaitedSearchParams.view || 'login';

  const renderForm = () => {
    switch (currentView) {
      case 'register':
        return <RegisterForm />;
      case 'forgot-password':
        return <ForgotPasswordForm />;
      default:
        return <LoginForm />;
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Coluna da Esquerda: Formulário Dinâmico */}
      <div className={styles.formColumn}>
        {renderForm()}
      </div>

      {/* Coluna da Direita: Benefícios (sempre a mesma) */}
      <div className={styles.benefitsColumn}>
        <div className={styles.benefitsBox}>
          <h2 className={styles.title}>Em sua conta, você poderá:</h2>
          <ul className={styles.benefitsList}>
            <li className={styles.benefitItem}>
              <FiShoppingBag />
              <span>Acessar seu histórico de pedidos</span>
            </li>
            <li className={styles.benefitItem}>
              <FiUser />
              <span>Gerenciar suas informações pessoais</span>
            </li>
            <li className={styles.benefitItem}>
              <FiMail />
              <span>Receber a Comunicação Digital do Atelier</span>
            </li>
            <li className={styles.benefitItem}>
              <FiHeart />
              <span>Salvar sua Lista de Desejos</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}