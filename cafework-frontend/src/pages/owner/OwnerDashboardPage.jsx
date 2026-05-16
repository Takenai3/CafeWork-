import React from 'react';

const OwnerDashboardPage = () => {
  return (
    <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
      <h1 style={{ color: '#3e2723', marginBottom: '16px' }}>オーナーダッシュボード</h1>
      <p style={{ color: '#666' }}>CafeWorkへようこそ！左のメニューからカフェ情報の管理や統計の確認ができます。</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '32px' }}>
        <div style={{ padding: '24px', backgroundColor: '#fdf8f5', borderRadius: '8px', border: '1px solid #f3ede5' }}>
          <h3 style={{ fontSize: '14px', color: '#8d6e63', marginBottom: '8px' }}>本日の訪問者</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#3e2723' }}>128</p>
        </div>
        <div style={{ padding: '24px', backgroundColor: '#fdf8f5', borderRadius: '8px', border: '1px solid #f3ede5' }}>
          <h3 style={{ fontSize: '14px', color: '#8d6e63', marginBottom: '8px' }}>新規レビュー</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#3e2723' }}>5</p>
        </div>
        <div style={{ padding: '24px', backgroundColor: '#fdf8f5', borderRadius: '8px', border: '1px solid #f3ede5' }}>
          <h3 style={{ fontSize: '14px', color: '#8d6e63', marginBottom: '8px' }}>平均評価</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#3e2723' }}>4.8</p>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboardPage;
