import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

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

    if (loading || !user) return <div className="spinner" />;

    const save = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            await api.updateProfile({ name });
            await reload();
            setMessage('Profile updated');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: 520, paddingBottom: '4rem' }}>
            <header className="page-header">
                <h1>My Account</h1>
                <p>{user.email}</p>
            </header>

            <form onSubmit={save} className="card" style={{ padding: '1.5rem' }}>
                <div className="form-group">
                    <label className="label">Display Name</label>
                    <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                {user.isAdmin && <p className="badge" style={{ marginBottom: '1rem' }}>Administrator</p>}
                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-error">{error}</div>}
                <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}
