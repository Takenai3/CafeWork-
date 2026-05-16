import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  const navigate = useNavigate();
  
  // 1. Lấy token và thông tin user từ localStorage
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  let user = null;
  
  try {
    if (userStr) {
      user = JSON.parse(userStr);
    }
  } catch (error) {
    console.error('Error parsing user data:', error);
  }

  // 4. Hàm xử lý Đăng xuất
  const handleLogout = () => {
    if (window.confirm("ログアウトしますか？")) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('fullName');
      
      navigate('/');
      window.location.reload(); // Reload để cập nhật lại trạng thái giao diện toàn trang
    }
  };

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

      {/* Right Section: Conditional Rendering based on Auth State */}
      <div className={styles.rightSection}>
        {!token ? (
          /* Case 2: Guest (Not logged in) */
          <>
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
          </>
        ) : (
          /* Case 3: Logged-in User */
          <div className={styles.profileSection}>
            <div className={styles.avatar}>
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <span className={styles.userName}>
              {user?.fullName || 'ユーザー'}
            </span>
            <button 
              onClick={handleLogout}
              className={styles.logoutButton}
            >
              ログアウト
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
