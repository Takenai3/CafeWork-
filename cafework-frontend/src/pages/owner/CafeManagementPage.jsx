import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import styles from './CafeManagementPage.module.css';
import axiosClient from '../../api/axiosClient';

const CafeManagementPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    email: '',
    phone: '',
    openHours: '',
    address: '',
    latitude: '',
    longitude: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchMyCafe = async () => {
      try {
        const response = await axiosClient.get('/cafes/my-cafe');
        if (response.data) {
          setFormData(response.data);
        }
      } catch (error) {
        console.error('Error fetching cafe data:', error);
        toast.error('カフェ情報の取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchMyCafe();
  }, []);

  const validate = () => {
    if (!formData.name?.trim()) return 'カフェ名を入力してください。';
    if (!formData.ownerName?.trim()) return '店主名を入力してください。';
    if (!formData.address?.trim()) return '住所を入力してください。';
    
    // Email regex
    if (!formData.email?.trim()) return 'メールアドレスを入力してください。';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return '有効なメールアドレスを入力してください。';

    // Phone regex (only numbers)
    if (!formData.phone?.trim()) return '電話番号を入力してください。';
    if (!/^\d+$/.test(formData.phone)) return '電話番号は数字のみで入力してください。';

    // Open hours regex (HH:MM)
    if (formData.openHours && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.openHours)) {
      return '営業時間は HH:MM の形式で入力してください。';
    }

    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    setSubmitting(true);
    try {
      await axiosClient.put('/cafes/my-cafe', formData);
      toast.success('更新に成功しました');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error updating cafe:', error);
      const errorMsg = error.response?.data || '情報の更新に失敗しました。';
      toast.error(typeof errorMsg === 'string' ? errorMsg : '更新エラー');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '20px', color: '#8d6e63' }}>読み込み中...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>カフェ情報の管理</h1>
      
      <form onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>カフェ名</label>
            <input
              type="text"
              name="name"
              className={styles.input}
              value={formData.name || ''}
              onChange={handleChange}
              placeholder="例: Cafe Sakura"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>店主名</label>
            <input
              type="text"
              name="ownerName"
              className={styles.input}
              value={formData.ownerName || ''}
              onChange={handleChange}
              placeholder="例: 山田 太郎"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>メールアドレス</label>
            <input
              type="email"
              name="email"
              className={styles.input}
              value={formData.email || ''}
              onChange={handleChange}
              placeholder="example@mail.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>電話番号</label>
            <input
              type="text"
              name="phone"
              className={styles.input}
              value={formData.phone || ''}
              onChange={handleChange}
              placeholder="09012345678"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>営業時間 (HH:MM)</label>
            <input
              type="text"
              name="openHours"
              className={styles.input}
              value={formData.openHours || ''}
              onChange={handleChange}
              placeholder="09:00"
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>住所</label>
            <input
              type="text"
              name="address"
              className={styles.input}
              value={formData.address || ''}
              onChange={handleChange}
              placeholder="東京都渋谷区..."
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>緯度 (Latitude)</label>
            <input
              type="number"
              step="any"
              name="latitude"
              className={styles.input}
              value={formData.latitude || ''}
              onChange={handleChange}
              placeholder="35.6895"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>経度 (Longitude)</label>
            <input
              type="number"
              step="any"
              name="longitude"
              className={styles.input}
              value={formData.longitude || ''}
              onChange={handleChange}
              placeholder="139.6917"
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>説明</label>
            <textarea
              name="description"
              className={styles.textarea}
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="お店の特徴について教えてください..."
            />
          </div>
        </div>

        <button
          type="submit"
          className={styles.saveButton}
          disabled={submitting}
        >
          {submitting ? '保存中...' : '更新'}
        </button>
      </form>
    </div>
  );
};

export default CafeManagementPage;
