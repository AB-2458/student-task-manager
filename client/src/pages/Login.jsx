import { useState } from 'react';
import { authAPI } from '../services/api';

export default function Login({ onLogin }) {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let data;
            if (isRegister) {
                data = await authAPI.register(formData.email, formData.password, formData.name);
            } else {
                data = await authAPI.login(formData.email, formData.password);
            }

            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data));
            onLogin(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-logo">📚</div>
                    <h1 className="login-title">Student Task Manager</h1>
                    <p className="login-subtitle">
                        {isRegister ? 'Create your account' : 'Welcome back! Sign in to continue'}
                    </p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form className="login-form" onSubmit={handleSubmit}>
                    {isRegister && (
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                className="form-input"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-input"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Please wait...' : (isRegister ? 'Create Account' : 'Sign In')}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        {isRegister ? 'Already have an account? ' : "Don't have an account? "}
                        <a href="#" onClick={(e) => { e.preventDefault(); setIsRegister(!isRegister); setError(''); }}>
                            {isRegister ? 'Sign in' : 'Create one'}
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
