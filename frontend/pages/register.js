import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

const registerStyles = {
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
    passwordHint: {
        fontSize: '0.7rem',
        color: '#306D29',
        marginTop: '0.25rem',
    },
};

// Add animations and focus styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
    .register-input:focus {
      border-color: #306D29 !important;
      box-shadow: 0 0 0 3px rgba(48, 109, 41, 0.1) !important;
      background: #ffffff !important;
    }
    
    .register-btn:hover:not(:disabled) {
      background: #0D530E !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(48, 109, 41, 0.3);
    }
    
    .register-link:hover {
      color: #0D530E !important;
      text-decoration: underline !important;
    }
    
    @media (max-width: 640px) {
      .register-card {
        padding: 1.5rem !important;
      }
      .register-title {
        font-size: 1.5rem !important;
      }
    }
  `;
    document.head.appendChild(styleSheet);
}

export default function Register() {
    const router = useRouter();
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(name, email, password);
            router.push('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={registerStyles.wrap}>
            <div style={registerStyles.card}>
                <h1 style={registerStyles.title}>Create account</h1>
                <p style={registerStyles.subtitle}>Join Zamzam Crystal World</p>

                <form onSubmit={handleSubmit}>
                    <div style={registerStyles.formGroup}>
                        <label style={registerStyles.label}>Full Name</label>
                        <input
                            className="register-input"
                            style={registerStyles.input}
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div style={registerStyles.formGroup}>
                        <label style={registerStyles.label}>Email Address</label>
                        <input
                            className="register-input"
                            style={registerStyles.input}
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                        />
                    </div>

                    <div style={registerStyles.formGroup}>
                        <label style={registerStyles.label}>Password</label>
                        <input
                            className="register-input"
                            style={registerStyles.input}
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Minimum 6 characters"
                        />
                        <div style={registerStyles.passwordHint}>
                            Password must be at least 6 characters
                        </div>
                    </div>

                    {error && (
                        <div style={{ ...registerStyles.alert, ...registerStyles.alertError }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="register-btn"
                        style={{
                            ...registerStyles.btnPrimary,
                            ...(loading ? registerStyles.btnDisabled : {}),
                        }}
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Register'}
                    </button>
                </form>

                <div style={registerStyles.footer}>
                    Already have an account?{' '}
                    <Link href="/login" className="register-link" style={registerStyles.link}>
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}