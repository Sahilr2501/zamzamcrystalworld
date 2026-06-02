import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

const loginStyles = {
    wrap: {
        minHeight: 'calc(100vh - 200px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        background: '#FBF5DD',
    },
    card: {
        maxWidth: '480px',
        width: '100%',
        background: '#ffffff',
        borderRadius: '24px',
        padding: '2.5rem',
        boxShadow: '0 20px 35px -10px rgba(48, 109, 41, 0.1)',
        border: '1px solid #E7E1B1',
    },
    title: {
        fontSize: '1.75rem',
        fontWeight: 700,
        color: '#0D530E',
        marginBottom: '0.5rem',
        textAlign: 'center',
    },
    subtitle: {
        color: '#306D29',
        fontSize: '0.875rem',
        textAlign: 'center',
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid #E7E1B1',
    },
    formGroup: {
        marginBottom: '1.25rem',
    },
    label: {
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: 500,
        color: '#0D530E',
        marginBottom: '0.5rem',
    },
    input: {
        width: '100%',
        padding: '0.75rem 1rem',
        background: '#FBF5DD',
        border: '1px solid #E7E1B1',
        borderRadius: '12px',
        fontSize: '0.875rem',
        color: '#0D530E',
        transition: 'all 0.2s ease',
        outline: 'none',
    },
    btnPrimary: {
        width: '100%',
        background: '#306D29',
        color: '#FBF5DD',
        padding: '0.875rem 1.5rem',
        borderRadius: '12px',
        fontWeight: 600,
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.875rem',
        transition: 'all 0.2s ease',
        marginTop: '0.5rem',
    },
    btnDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
    },
    alert: {
        padding: '0.75rem 1rem',
        borderRadius: '12px',
        fontSize: '0.875rem',
        marginBottom: '1rem',
    },
    alertError: {
        background: '#fee2e2',
        border: '1px solid #fecaca',
        color: '#dc2626',
    },
    footer: {
        textAlign: 'center',
        marginTop: '1.5rem',
        paddingTop: '1rem',
        borderTop: '1px solid #E7E1B1',
        fontSize: '0.875rem',
        color: '#306D29',
    },
    link: {
        color: '#306D29',
        textDecoration: 'none',
        fontWeight: 600,
    },
    forgotPassword: {
        textAlign: 'right',
        marginTop: '0.5rem',
    },
    forgotLink: {
        color: '#306D29',
        textDecoration: 'none',
        fontSize: '0.75rem',
    },
};

// Add animations and focus styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
    .login-input:focus {
      border-color: #306D29 !important;
      box-shadow: 0 0 0 3px rgba(48, 109, 41, 0.1) !important;
      background: #ffffff !important;
    }
    
    .login-btn:hover:not(:disabled) {
      background: #0D530E !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(48, 109, 41, 0.3);
    }
    
    .login-link:hover {
      color: #0D530E !important;
      text-decoration: underline !important;
    }
    
    .forgot-link:hover {
      color: #0D530E !important;
      text-decoration: underline !important;
    }
    
    @media (max-width: 640px) {
      .login-card {
        padding: 1.5rem !important;
      }
      .login-title {
        font-size: 1.5rem !important;
      }
    }
  `;
    document.head.appendChild(styleSheet);
}

export default function Login() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const redirect = router.query.redirect || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await login(email, password);
            router.push(user.isAdmin && redirect === '/admin' ? '/admin' : redirect);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={loginStyles.wrap}>
            <div style={loginStyles.card}>
                <h1 style={loginStyles.title}>Welcome back</h1>
                <p style={loginStyles.subtitle}>Sign in to your Zamzam Crystal World account</p>

                <form onSubmit={handleSubmit}>
                    <div style={loginStyles.formGroup}>
                        <label style={loginStyles.label}>Email Address</label>
                        <input
                            className="login-input"
                            style={loginStyles.input}
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                        />
                    </div>

                    <div style={loginStyles.formGroup}>
                        <label style={loginStyles.label}>Password</label>
                        <input
                            className="login-input"
                            style={loginStyles.input}
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </div>

                    <div style={loginStyles.forgotPassword}>
                        <Link href="/forgot-password" className="forgot-link" style={loginStyles.forgotLink}>
                            Forgot password?
                        </Link>
                    </div>

                    {error && (
                        <div style={{ ...loginStyles.alert, ...loginStyles.alertError }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="login-btn"
                        style={{
                            ...loginStyles.btnPrimary,
                            ...(loading ? loginStyles.btnDisabled : {}),
                        }}
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div style={loginStyles.footer}>
                    New here?{' '}
                    <Link href="/register" className="login-link" style={loginStyles.link}>
                        Create an account
                    </Link>
                </div>
            </div>
        </div>
    );
}