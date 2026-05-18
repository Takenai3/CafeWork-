import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { profileService } from '../../api/profileService';
import TopNavTabs from '../../components/layout/TopNavTabs';
import { getPhoneLocal, setPhoneLocal } from '../../utils/userLocalStore';
import styles from './ProfilePage.module.css';

const getInitial = (text) => {
    const value = (text || '').trim();
    return value ? value.charAt(0).toUpperCase() : 'U';
};

const getErrorMessage = (error) => {
    const data = error?.response?.data;
    if (typeof data === 'string' && data.trim()) return data;
    return error?.message || 'エラーが発生しました。';
};

const ProfilePage = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [loading, setLoading] = useState(Boolean(token));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({
        fullName: '',
        cafeName: '',
        phone: '',
        openHours: '',
        address: '',
    });

    const isOwner = useMemo(() => {
        const role = profile?.role || localStorage.getItem('role');
        return role === 'OWNER';
    }, [profile?.role]);

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        let cancelled = false;
        (async () => {
            setLoading(true);
            setError('');
            try {
                const data = await profileService.getMyProfile();
                if (cancelled) return;
                setProfile(data);
                setForm({
                    fullName: data?.fullName || '',
                    cafeName: data?.cafeName || '',
                    phone: data?.phone || getPhoneLocal() || '',
                    openHours: data?.openHours || '',
                    address: data?.address || '',
                });
            } catch (err) {
                if (cancelled) return;
                setError(getErrorMessage(err));
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [token]);

    const handleLogout = () => {
        if (!window.confirm('ログアウトしますか？')) return;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        localStorage.removeItem('fullName');
        navigate('/');
        window.location.reload();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            toast.error('ログインが必要です。');
            navigate('/login');
            return;
        }

        setSaving(true);
        setError('');
        try {
            await profileService.updateMyProfile({
                fullName: form.fullName,
                cafeName: isOwner ? form.cafeName : null,
                phone: isOwner ? form.phone : null,
                openHours: isOwner ? form.openHours : null,
                address: isOwner ? form.address : null,
            });

            if (!isOwner) {
                setPhoneLocal(form.phone);
            }

            // Cập nhật localStorage để Header hiển thị tên mới ngay lập tức
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    localStorage.setItem('user', JSON.stringify({ ...user, fullName: form.fullName }));
                } catch {
                    // ignore
                }
            }
            localStorage.setItem('fullName', form.fullName);

            setProfile((prev) => (prev ? { ...prev, fullName: form.fullName } : prev));
            toast.success('プロフィールを更新しました。');
        } catch (err) {
            const msg = getErrorMessage(err);
            setError(msg);
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    if (!token) {
        return (
            <div className={styles.centerWrap}>
                <div className={`${styles.card} ${styles.messageCard}`}>
                    <h1 className={styles.pageTitle}>プロフィール</h1>
                    <p className={styles.subText}>
                        Hồ sơ chỉ hiển thị sau khi bạn đăng nhập.
                    </p>
                    <div className={styles.actions}>
                        <button
                            type="button"
                            className={styles.primaryButton}
                            onClick={() => navigate('/login')}
                        >
                            ログインへ
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className={styles.centerWrap}>
                <div className={`${styles.card} ${styles.messageCard}`}>
                    <h1 className={styles.pageTitle}>読み込み中...</h1>
                </div>
            </div>
        );
    }

    return (
        <div>
            <TopNavTabs />
            <div className={styles.page}>
                <div className={styles.container}>
                    <aside className={styles.sidebar}>
                        <div className={`${styles.card} ${styles.profileCard}`}>
                            <div className={styles.avatar}>
                                {getInitial(profile?.fullName || profile?.email)}
                            </div>
                            <h2 className={styles.name}>{profile?.fullName || 'ユーザー'}</h2>
                            <p className={styles.subText}>{profile?.email}</p>
                            <span className={styles.roleBadge}>
                                {profile?.role === 'OWNER' ? 'OWNER / オーナー' : 'USER / ユーザー'}
                            </span>
                        </div>

                        <div className={`${styles.card} ${styles.menuCard}`}>
                            <button
                                type="button"
                                className={`${styles.menuButton} ${styles.menuButtonActive}`}
                            >
                                プロフィール編集
                            </button>
                            <button
                                type="button"
                                className={`${styles.menuButton} ${styles.menuButtonDisabled}`}
                                disabled
                                title="準備中"
                            >
                                パスワード変更（準備中）
                            </button>
                            <button
                                type="button"
                                className={`${styles.menuButton} ${styles.menuButtonDanger}`}
                                onClick={handleLogout}
                            >
                                ログアウト
                            </button>
                        </div>
                    </aside>

                    <main className={styles.main}>
                        <div className={`${styles.card} ${styles.mainCard}`}>
                            <h1 className={styles.pageTitle}>基本情報</h1>

                            {error && (
                                <p className={styles.errorText}>{error}</p>
                            )}

                            <form className={styles.form} onSubmit={handleSubmit}>
                                <div className={styles.formRow}>
                                    <div className={styles.labelRow}>
                                        <label className={styles.label} htmlFor="fullName">
                                            お名前
                                        </label>
                                        <span className={styles.required}>*</span>
                                    </div>
                                    <input
                                        id="fullName"
                                        className={styles.input}
                                        value={form.fullName}
                                        onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                                        placeholder="山田 太郎"
                                        required
                                    />
                                </div>

                                <div className={styles.formRow}>
                                    <label className={styles.label} htmlFor="email">
                                        メールアドレス
                                    </label>
                                    <input
                                        id="email"
                                        className={`${styles.input} ${styles.inputDisabled}`}
                                        value={profile?.email || ''}
                                        disabled
                                        readOnly
                                    />
                                </div>

                                <div className={styles.formRow}>
                                    <label className={styles.label} htmlFor="phone">
                                        電話番号
                                    </label>
                                    <input
                                        id="phone"
                                        className={styles.input}
                                        value={form.phone}
                                        onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                                        placeholder="090..."
                                    />
                                </div>

                                {isOwner && (
                                    <>
                                        <h2 className={styles.sectionTitle}>カフェ情報（オーナー）</h2>

                                        <div className={styles.formRow}>
                                            <label className={styles.label} htmlFor="cafeName">
                                                店名
                                            </label>
                                            <input
                                                id="cafeName"
                                                className={styles.input}
                                                value={form.cafeName}
                                                onChange={(e) => setForm((p) => ({ ...p, cafeName: e.target.value }))}
                                                placeholder="Cafe Work"
                                            />
                                        </div>

                                        <div className={styles.formRow}>
                                            <label className={styles.label} htmlFor="openHours">
                                                営業時間
                                            </label>
                                            <input
                                                id="openHours"
                                                className={styles.input}
                                                value={form.openHours}
                                                onChange={(e) => setForm((p) => ({ ...p, openHours: e.target.value }))}
                                                placeholder="08:00 - 22:00"
                                            />
                                        </div>

                                        <div className={styles.formRow}>
                                            <label className={styles.label} htmlFor="address">
                                                住所
                                            </label>
                                            <textarea
                                                id="address"
                                                className={`${styles.input} ${styles.textarea}`}
                                                value={form.address}
                                                onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                                                placeholder="..."
                                            />
                                        </div>
                                    </>
                                )}

                                <div className={styles.actions}>
                                    <button
                                        type="button"
                                        className={styles.secondaryButton}
                                        onClick={() => navigate('/')}
                                        disabled={saving}
                                    >
                                        戻る
                                    </button>
                                    <button
                                        type="submit"
                                        className={styles.primaryButton}
                                        disabled={saving}
                                    >
                                        {saving ? '更新中...' : '更新する'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;