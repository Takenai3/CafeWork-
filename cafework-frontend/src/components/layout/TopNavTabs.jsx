import { useLocation, useNavigate } from 'react-router-dom';
import { getLang } from '../../utils/userLocalStore';
import styles from './TopNavTabs.module.css';

const labels = {
    JP: { home: 'ホーム', myList: 'マイリスト', history: '検索履歴' },
    VI: { home: 'Trang chủ', myList: 'Đã lưu', history: 'Lịch sử tìm kiếm' },
};

const TopNavTabs = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const lang = getLang();
    const t = labels[lang] || labels.JP;

    const active =
        location.pathname === '/'
            ? 'home'
            : location.pathname.startsWith('/my-list')
                ? 'myList'
                : location.pathname.startsWith('/search-history')
                    ? 'history'
                    : null;

    return (
        <nav className={styles.navBar} aria-label="Primary">
            <button
                type="button"
                className={active === 'home' ? styles.navTabActive : styles.navTab}
                onClick={() => navigate('/')}
            >
                🏠 {t.home}
            </button>
            <button
                type="button"
                className={active === 'myList' ? styles.navTabActive : styles.navTab}
                onClick={() => navigate('/my-list')}
            >
                ♥ {t.myList}
            </button>
            <button
                type="button"
                className={active === 'history' ? styles.navTabActive : styles.navTab}
                onClick={() => navigate('/search-history')}
            >
                🕘 {t.history}
            </button>
        </nav>
    );
};

export default TopNavTabs;
