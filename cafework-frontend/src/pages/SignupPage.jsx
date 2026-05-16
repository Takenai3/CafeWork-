import React from 'react';
import { useNavigate } from 'react-router-dom';
import SignupCard from '../components/auth/SignupCard';
import styles from './SignupPage.module.css';

const SignupPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.signupContainer}>
      {/* Main Content */}
      <main className={styles.mainContent}>
        <SignupCard onSwitchToLogin={() => navigate('/login')} />
      </main>
    </div>
  );
};

export default SignupPage;
