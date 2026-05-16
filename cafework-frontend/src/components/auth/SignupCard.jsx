import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import styles from './SignupCard.module.css';
import api from '../../api/axiosConfig';

const SignupCard = ({ onSwitchToLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'お名前を入力してください。';
    if (!formData.email) {
      newErrors.email = 'メールアドレスを入力してください。';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください。';
    }
    if (!formData.password) {
      newErrors.password = 'パスワードを入力してください。';
    } else if (formData.password.length < 8) {
      newErrors.password = 'パスワードは8文字以上である必要があります。';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'パスワードが一致しません。';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/auth/signup/direct', {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: formData.role
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
      const errorMsg = err.response?.data || '登録に失敗しました。';
      toast.error(typeof errorMsg === 'string' ? errorMsg : '登録に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>アカウント登録</h2>

      {/* Role Selection Tabs */}
      <div className={styles.roleToggle}>
        <button
          type="button"
          className={`${styles.roleButton} ${formData.role === 'USER' ? styles.roleButtonActive : ''}`}
          onClick={() => setFormData({ ...formData, role: 'USER' })}
        >
          一般ユーザー
        </button>
        <button
          type="button"
          className={`${styles.roleButton} ${formData.role === 'OWNER' ? styles.roleButtonActive : ''}`}
          onClick={() => setFormData({ ...formData, role: 'OWNER' })}
        >
          カフェオーナー
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>お名前</label>
          <input
            type="text"
            className={`${styles.input} ${errors.fullName ? styles.inputError : ''}`}
            placeholder="山田 太郎"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
          {errors.fullName && <p className={styles.errorMessage}>{errors.fullName}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>メールアドレス</label>
          <input
            type="email"
            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
            placeholder="example@mail.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {errors.email && <p className={styles.errorMessage}>{errors.email}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>パスワード</label>
          <input
            type="password"
            className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
            placeholder="********"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          {errors.password && <p className={styles.errorMessage}>{errors.password}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>パスワード（確認）</label>
          <input
            type="password"
            className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
            placeholder="********"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
          {errors.confirmPassword && <p className={styles.errorMessage}>{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? '処理中...' : '登録'}
        </button>
      </form>

      <div className={styles.footer}>
        <button 
          type="button"
          onClick={onSwitchToLogin}
          className={styles.link}
        >
          既にアカウントをお持ちですか？ ログインへ
        </button>
      </div>
    </div>
  );
};

export default SignupCard;
