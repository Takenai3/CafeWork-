import TopNavTabs from '../components/layout/TopNavTabs';
import { getSearchHistory } from '../utils/userLocalStore';
import styles from './profile/ProfilePage.module.css';

const formatTime = (iso) => {
    try {
        return new Date(iso).toLocaleString();
    } catch {
        return '';
    }
};

const SearchHistoryPage = () => {
    const items = getSearchHistory();

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)', backgroundColor: '#fdf8f5' }}>
            <TopNavTabs />

            <div className={styles.page}>
                <div className={styles.container} style={{ display: 'block' }}>
                    <div className={`${styles.card} ${styles.mainCard}`}>
                        <h1 className={styles.pageTitle}>検索履歴</h1>

                        {items.length === 0 ? (
                            <p className={styles.subText}>検索履歴がありません。</p>
                        ) : (
                            <div style={{ display: 'grid', gap: 10 }}>
                                {items.map((item) => (
                                    <div
                                        key={`${item.keyword}-${item.at}`}
                                        className={styles.card}
                                        style={{ padding: 14, borderRadius: 12, boxShadow: 'none' }}
                                    >
                                        <div style={{ fontWeight: 700, color: '#333' }}>{item.keyword}</div>
                                        <div style={{ fontSize: 12, color: '#757575', marginTop: 6 }}>
                                            {formatTime(item.at)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchHistoryPage;
