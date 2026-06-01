import { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { api } from '../../lib/api';

const emptyCoupon = {
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderValue: '0',
    expiryDate: '',
};

export default function AdminCoupons() {
    const [coupons, setCoupons] = useState([]);
    const [form, setForm] = useState(emptyCoupon);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const load = () => {
        api.getCoupons()
            .then(setCoupons)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        load();
    }, []);

    const create = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.createCoupon({
                ...form,
                code: form.code.toUpperCase(),
                discountValue: Number(form.discountValue),
                minOrderValue: Number(form.minOrderValue) || 0,
            });
            setForm(emptyCoupon);
            load();
        } catch (err) {
            setError(err.message);
        }
    };

    const remove = async (id) => {
        if (!confirm('Delete coupon?')) return;
        await api.deleteCoupon(id);
        load();
    };

    return (
        <AdminLayout title="Coupons">
            <form onSubmit={create} className="card" style={{ padding: '1.5rem', maxWidth: 480, marginBottom: '2rem' }}>
                <h3 style={{ marginTop: 0 }}>Create Coupon</h3>
                <div className="form-group">
                    <label className="label">Code</label>
                    <input className="input" required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="label">Type</label>
                        <select className="select" value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
                            <option value="percentage">Percentage</option>
                            <option value="flat">Flat (₹)</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="label">Value</label>
                        <input className="input" type="number" required min={1} value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} />
                    </div>
                </div>
                <div className="form-group">
                    <label className="label">Min Order (₹)</label>
                    <input className="input" type="number" min={0} value={form.minOrderValue} onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })} />
                </div>
                <div className="form-group">
                    <label className="label">Expiry Date</label>
                    <input className="input" type="date" required value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
                </div>
                {error && <div className="alert alert-error">{error}</div>}
                <button type="submit" className="btn btn-primary btn-sm">Create Coupon</button>
            </form>

            {loading ? (
                <div className="spinner" />
            ) : (
                <div className="card" style={{ overflow: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Discount</th>
                                <th>Min Order</th>
                                <th>Expires</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.map((c) => (
                                <tr key={c._id}>
                                    <td><strong>{c.code}</strong></td>
                                    <td>{c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}</td>
                                    <td>₹{c.minOrderValue}</td>
                                    <td>{new Date(c.expiryDate).toLocaleDateString()}</td>
                                    <td>
                                        <button type="button" className="btn-ghost" style={{ color: 'var(--danger)' }} onClick={() => remove(c._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!coupons.length && <p className="empty-state">No coupons yet.</p>}
                </div>
            )}
        </AdminLayout>
    );
}
