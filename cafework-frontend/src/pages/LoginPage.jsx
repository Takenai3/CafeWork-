import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginCard from '../components/auth/LoginCard';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.loginContainer}>
      {/* Main Content */}
      <main className={styles.mainContent}>
        <LoginCard onSwitchToSignup={() => navigate('/signup')} />
      </main>
    </div>
  );
};

export default LoginPage;
