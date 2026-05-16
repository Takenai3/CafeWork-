import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      {/* Left: Language Selection */}
      <div className={styles.leftSection}>
        <div className={styles.languageDropdown}>
          <span className={styles.flag}>🇯🇵</span>
          <span>JP 日本語 1</span>
          <svg className={styles.arrowIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Middle: Logo */}
      <div className={styles.centerSection}>
        <Link to="/" className={styles.logo}>
          カフェワーク
        </Link>
      </div>

      {/* Right: Auth Buttons */}
      <div className={styles.rightSection}>
        <button 
          onClick={() => navigate('/login')}
          className={styles.loginButton}
        >
          ログイン
        </button>
        <button 
          onClick={() => navigate('/signup')}
          className={styles.registerButton}
        >
          登録
        </button>
      </div>
    </header>
  );
};

export default Header;
