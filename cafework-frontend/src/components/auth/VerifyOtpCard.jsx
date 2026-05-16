import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import styles from './VerifyOtpCard.module.css';
import api from '../../api/axiosClient';

const VerifyOtpCard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      toast.error('6桁の認証コードを入力してください。');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/signup/verify', {
        email,
        otpCode,
      });

      if (response.status === 200) {
        const data = response.data;
        toast.success('アカウント登録が完了しました！');
        
        // Save token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('fullName', data.fullName);
        localStorage.setItem('user', JSON.stringify(data));
        
        // Redirect to Home
        navigate('/');
      }
    } catch (err) {
      const errorMsg = err.response?.data || '認証に失敗しました。';
      toast.error(typeof errorMsg === 'string' ? errorMsg : '認証に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>認証コード入力</h2>
      <p className={styles.subtitle}>
        <span className={styles.emailHighlight}>{email}</span> 宛に送信された6桁 của 認証コードを入力してください。
      </p>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>認証コード</label>
          <input
            type="text"
            maxLength="6"
            className={styles.input}
            placeholder="000000"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? '処理中...' : '認証する'}
        </button>
      </form>

      <div className={styles.footer}>
        <button type="button" className={styles.resendLink} onClick={() => navigate('/signup')}>
          ← 登録画面に戻る
        </button>
      </div>
    </div>
  );
};

export default VerifyOtpCard;
