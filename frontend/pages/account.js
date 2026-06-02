import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

const accountStyles = {
    pageWrapper: {
        background: '#FBF5DD',
        minHeight: 'calc(100vh - 200px)',
    },
    container: {
        maxWidth: '520px',
        margin: '0 auto',
        padding: '2rem 1.5rem 4rem',
    },
    pageHeader: {
        textAlign: 'center',
        marginBottom: '2rem',
    },
    pageTitle: {
        fontSize: '2rem',
        fontWeight: 700,
        color: '#0D530E',
        marginBottom: '0.5rem',
    },
    pageSubtitle: {
        color: '#306D29',
        fontSize: '0.875rem',
    },
    card: {
        background: '#ffffff',
        borderRadius: '20px',
        padding: '1.5rem',
        border: '1px solid #E7E1B1',
        boxShadow: '0 4px 12px rgba(48, 109, 41, 0.08)',
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
    badge: {
        display: 'inline-block',
        background: '#306D29',
        color: '#FBF5DD',
        padding: '0.25rem 0.75rem',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: 500,
        marginBottom: '1rem',
    },
    alert: {
        padding: '0.75rem 1rem',
        borderRadius: '12px',
        fontSize: '0.875rem',
        marginBottom: '1rem',
    },
    alertSuccess: {
        background: '#dcfce7',
        border: '1px solid #bbf7d0',
        color: '#166534',
    },
    alertError: {
        background: '#fee2e2',
        border: '1px solid #fecaca',
        color: '#dc2626',
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
    },
    btnDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
    },
    spinnerContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
    },
    spinner: {
        width: '50px',
        height: '50px',
        border: '3px solid #E7E1B1',
        borderTopColor: '#306D29',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
    },
};

// Add animations and focus styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .account-input:focus {
      border-color: #306D29 !important;
      box-shadow: 0 0 0 3px rgba(48, 109, 41, 0.1) !important;
      background: #ffffff !important;
    }
    
    .account-btn:hover:not(:disabled) {
      background: #0D530E !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(48, 109, 41, 0.3);
    }
  `;
    document.head.appendChild(styleSheet);
}

export default function Account() {
    const router = useRouter();
    const { user, loading, reload } = useAuth();
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!loading && !user) router.replace('/login?redirect=/account');
        if (user) setName(user.name);
    }, [user, loading, router]);

    if (loading) {
        return (
            <div style={accountStyles.pageWrapper}>
                <div style={accountStyles.spinnerContainer}>
                    <div style={accountStyles.spinner} />
                </div>
            </div>
        );
    }

    if (!user) return null;

    const save = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setMessage('');
        try {
            await api.updateProfile({ name });
            await reload();
            setMessage('Profile updated successfully');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={accountStyles.pageWrapper}>
            <div style={accountStyles.container}>
                <header style={accountStyles.pageHeader}>
                    <h1 style={accountStyles.pageTitle}>My Account</h1>
                    <p style={accountStyles.pageSubtitle}>{user.email}</p>
                </header>

                <form onSubmit={save} style={accountStyles.card}>
                    <div style={accountStyles.formGroup}>
                        <label style={accountStyles.label}>Display Name</label>
                        <input
                            className="account-input"
                            style={accountStyles.input}
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Enter your display name"
                        />
                    </div>

                    {user.isAdmin && (
                        <div style={accountStyles.badge}>
                            Administrator
                        </div>
                    )}

                    {message && (
                        <div style={{ ...accountStyles.alert, ...accountStyles.alertSuccess }}>
                            {message}
                        </div>
                    )}

                    {error && (
                        <div style={{ ...accountStyles.alert, ...accountStyles.alertError }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="account-btn"
                        style={{
                            ...accountStyles.btnPrimary,
                            ...(saving ? accountStyles.btnDisabled : {}),
                        }}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
}