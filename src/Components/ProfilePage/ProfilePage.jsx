import { useState, useRef, useEffect } from 'react';
import {
    fetchProfile, updateProfile,
    uploadAvatar, deleteAvatar,
    changeEmail, changePassword,
} from '../../api';
import './ProfilePage.css';

const ProfilePage = ({ user, onClose, onUserUpdate }) => {
    const [profile, setProfile] = useState(null);
    const [tab, setTab] = useState('info');

    // form states
    const [username, setUsername] = useState('');
    const [emailForm, setEmailForm] = useState({ email: '', password: '' });
    const [pwForm, setPwForm]       = useState({ old_password: '', new_password: '', new_password2: '' });

    const [msg, setMsg]     = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const avatarInputRef = useRef(null);

    useEffect(() => {
        fetchProfile().then(p => {
            if (p) {
                setProfile(p);
                setUsername(p.username);
            }
        });
    }, []);

    const flash = (ok, text) => {
        setError(ok ? null : text);
        setMsg(ok ? text : null);
        setTimeout(() => { setMsg(null); setError(null); }, 3500);
    };

    // ── Avatar ──────────────────────────────────────────────────────────────

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setLoading(true);
        const res = await uploadAvatar(file);
        setLoading(false);
        if (res.avatar_url) {
            setProfile(p => ({ ...p, avatar_url: res.avatar_url }));
            onUserUpdate({ avatar_url: res.avatar_url });
            flash(true, 'Аватар оновлено');
        } else {
            flash(false, 'Помилка завантаження');
        }
    };

    const handleDeleteAvatar = async () => {
        setLoading(true);
        await deleteAvatar();
        setLoading(false);
        setProfile(p => ({ ...p, avatar_url: null }));
        onUserUpdate({ avatar_url: null });
        flash(true, 'Аватар видалено');
    };

    // ── Username ─────────────────────────────────────────────────────────────

    const handleSaveName = async (e) => {
        e.preventDefault();
        if (!username.trim()) return;
        setLoading(true);
        const res = await updateProfile({ username: username.trim() });
        setLoading(false);
        if (res.username) {
            setProfile(p => ({ ...p, username: res.username }));
            onUserUpdate({ username: res.username });
            flash(true, "Ім'я збережено");
        } else {
            const msg = res.username?.[0] || 'Помилка збереження';
            flash(false, msg);
        }
    };

    // ── Email ─────────────────────────────────────────────────────────────────

    const handleChangeEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await changeEmail(emailForm);
        setLoading(false);
        if (res.email) {
            setProfile(p => ({ ...p, email: res.email }));
            onUserUpdate({ email: res.email });
            setEmailForm({ email: '', password: '' });
            flash(true, 'Email змінено');
        } else {
            const errMsg = res.email?.[0] || res.password?.[0] || 'Помилка зміни email';
            flash(false, errMsg);
        }
    };

    // ── Password ──────────────────────────────────────────────────────────────

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (pwForm.new_password !== pwForm.new_password2) {
            flash(false, 'Нові паролі не співпадають');
            return;
        }
        setLoading(true);
        const res = await changePassword({
            old_password: pwForm.old_password,
            new_password: pwForm.new_password,
        });
        setLoading(false);
        if (res.token) {
            localStorage.setItem('token', res.token);
            setPwForm({ old_password: '', new_password: '', new_password2: '' });
            flash(true, 'Пароль змінено');
        } else {
            const errMsg = res.old_password?.[0] || res.new_password?.[0] || 'Помилка зміни пароля';
            flash(false, errMsg);
        }
    };

    const initials = (profile?.username || user?.username || '?').slice(0, 2).toUpperCase();

    return (
        <div className="pp-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="pp-modal">
                <button className="pp-close" onClick={onClose}>✕</button>

                {/* Avatar */}
                <div className="pp-avatar-section">
                    <div
                        className="pp-avatar"
                        onClick={() => avatarInputRef.current?.click()}
                        title="Змінити аватар"
                    >
                        {profile?.avatar_url
                            ? <img src={profile.avatar_url} alt="avatar" />
                            : <span>{initials}</span>
                        }
                        <div className="pp-avatar-overlay">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                                <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 0 3.172 4zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0"/>
                            </svg>
                        </div>
                    </div>
                    <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleAvatarChange}
                    />
                    <p className="pp-uname">{profile?.username || user?.username}</p>
                    <p className="pp-email">{profile?.email || user?.email}</p>
                    {profile?.avatar_url && (
                        <button className="pp-del-avatar" onClick={handleDeleteAvatar}>
                            Видалити фото
                        </button>
                    )}
                </div>

                {/* Tabs */}
                <div className="pp-tabs">
                    <button className={`pp-tab ${tab === 'info'     ? 'active' : ''}`} onClick={() => setTab('info')}>Профіль</button>
                    <button className={`pp-tab ${tab === 'email'    ? 'active' : ''}`} onClick={() => setTab('email')}>Email</button>
                    <button className={`pp-tab ${tab === 'password' ? 'active' : ''}`} onClick={() => setTab('password')}>Пароль</button>
                </div>

                {/* Flash */}
                {msg   && <div className="pp-flash pp-flash--ok">{msg}</div>}
                {error && <div className="pp-flash pp-flash--err">{error}</div>}

                {/* Tab: info */}
                {tab === 'info' && (
                    <form className="pp-form" onSubmit={handleSaveName}>
                        <label>Ім'я користувача</label>
                        <input
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="username"
                            required
                        />
                        <button type="submit" className="pp-btn" disabled={loading}>
                            {loading ? 'Збереження...' : 'Зберегти'}
                        </button>
                    </form>
                )}

                {/* Tab: email */}
                {tab === 'email' && (
                    <form className="pp-form" onSubmit={handleChangeEmail}>
                        <label>Новий email</label>
                        <input
                            type="email"
                            value={emailForm.email}
                            onChange={e => setEmailForm(f => ({ ...f, email: e.target.value }))}
                            placeholder="new@email.com"
                            required
                        />
                        <label>Підтвердіть пароль</label>
                        <input
                            type="password"
                            value={emailForm.password}
                            onChange={e => setEmailForm(f => ({ ...f, password: e.target.value }))}
                            placeholder="Ваш поточний пароль"
                            required
                        />
                        <button type="submit" className="pp-btn" disabled={loading}>
                            {loading ? 'Збереження...' : 'Змінити email'}
                        </button>
                    </form>
                )}

                {/* Tab: password */}
                {tab === 'password' && (
                    <form className="pp-form" onSubmit={handleChangePassword}>
                        <label>Поточний пароль</label>
                        <input
                            type="password"
                            value={pwForm.old_password}
                            onChange={e => setPwForm(f => ({ ...f, old_password: e.target.value }))}
                            placeholder="Поточний пароль"
                            required
                        />
                        <label>Новий пароль</label>
                        <input
                            type="password"
                            value={pwForm.new_password}
                            onChange={e => setPwForm(f => ({ ...f, new_password: e.target.value }))}
                            placeholder="Мінімум 6 символів"
                            minLength={6}
                            required
                        />
                        <label>Повторіть новий пароль</label>
                        <input
                            type="password"
                            value={pwForm.new_password2}
                            onChange={e => setPwForm(f => ({ ...f, new_password2: e.target.value }))}
                            placeholder="Повторіть новий пароль"
                            required
                        />
                        <button type="submit" className="pp-btn" disabled={loading}>
                            {loading ? 'Збереження...' : 'Змінити пароль'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
