import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import styles from './OwnerLayout.module.css';

const OwnerLayout = () => {
  return (
    <div className={styles.container}>
      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <NavLink 
          to="/owner/dashboard" 
          className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.activeMenuItem}` : styles.menuItem}
        >
          <span style={{ fontSize: '18px' }}>📊</span>
          <span style={{ marginLeft: '12px' }}>ダッシュボード</span>
        </NavLink>
        <NavLink 
          to="/owner/cafe-management" 
          className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.activeMenuItem}` : styles.menuItem}
        >
          <span style={{ fontSize: '18px' }}>☕</span>
          <span style={{ marginLeft: '12px' }}>カフェ管理</span>
        </NavLink>
      </aside>

      {/* Main Content Area */}
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};

export default OwnerLayout;
