import { useState } from 'react';
import { register, login, fetchMe } from '../../api';
import './AuthPage.css';

const AuthPage = ({ onSuccess }) => {
    const [mode, setMode]     = useState('login'); // 'login' | 'register'
    const [form, setForm]     = useState({ username: '', email: '', password: '', password2: '' });
    const [error, setError]   = useState('');
    const [loading, setLoading] = useState(false);

    const change = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const submit = async e => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = mode === 'register'
                ? await register(form)
                : await login({ username: form.username, password: form.password });

            if (data.token) {
                localStorage.setItem('token', data.token);
                const me = await fetchMe();
                if (me) {
                    localStorage.setItem('user', JSON.stringify(me));
                    onSuccess(me);
                } else {
                    onSuccess({ username: data.username });
                }
            } else {
                const msg = Object.values(data).flat().join(' ');
                setError(msg);
            }
        } catch {
            setError('Помилка з\'єднання з сервером');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-overlay" onClick={onSuccess.bind(null, null)}>
            <div className="auth-card" onClick={e => e.stopPropagation()}>
                <div className="auth-tabs">
                    <button
                        className={`auth-tab ${mode === 'login' ? 'auth-tab--active' : ''}`}
                        onClick={() => setMode('login')}
                    >Вхід</button>
                    <button
                        className={`auth-tab ${mode === 'register' ? 'auth-tab--active' : ''}`}
                        onClick={() => setMode('register')}
                    >Реєстрація</button>
                </div>

                <form className="auth-form" onSubmit={submit}>
                    <label className="auth-label">
                        {mode === 'login' ? 'Логін або email' : 'Логін'}
                        <input
                            name="username" value={form.username} onChange={change}
                            className="auth-input" placeholder={mode === 'login' ? 'username або email' : 'username'} required
                        />
                    </label>

                    {mode === 'register' && (
                        <label className="auth-label">
                            Email
                            <input
                                name="email" type="email" value={form.email} onChange={change}
                                className="auth-input" placeholder="email@example.com"
                            />
                        </label>
                    )}

                    <label className="auth-label">
                        Пароль
                        <input
                            name="password" type="password" value={form.password} onChange={change}
                            className="auth-input" placeholder="••••••" required
                        />
                    </label>

                    {mode === 'register' && (
                        <label className="auth-label">
                            Повторіть пароль
                            <input
                                name="password2" type="password" value={form.password2} onChange={change}
                                className="auth-input" placeholder="••••••" required
                            />
                        </label>
                    )}

                    {error && <p className="auth-error">{error}</p>}

                    <button className="auth-submit" type="submit" disabled={loading}>
                        {loading ? 'Зачекайте...' : mode === 'login' ? 'Увійти' : 'Зареєструватися'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;
