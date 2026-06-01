import { useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '../../lib/api';
import ProductImageUpload from './ProductImageUpload';

const emptyVariant = { sku: '', price: '', mrp: '', countInStock: '', attributes: { size: '', color: '' } };

export default function ProductForm({ initial }) {
    const router = useRouter();
    const [form, setForm] = useState({
        name: initial?.name || '',
        brand: initial?.brand || 'Zamzam',
        category: initial?.category || 'Healing Stones',
        description: initial?.description || '',
        images: initial?.images?.length ? [...initial.images] : [],
        isFeatured: initial?.isFeatured || false,
        variants: initial?.variants?.length
            ? initial.variants.map((v) => ({
                  sku: v.sku,
                  price: v.price,
                  mrp: v.mrp,
                  countInStock: v.countInStock,
                  attributes: { size: v.attributes?.size || '', color: v.attributes?.color || '' },
              }))
            : [{ ...emptyVariant }],
    });
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    const updateVariant = (idx, field, value) => {
        setForm((f) => {
            const variants = [...f.variants];
            if (field.startsWith('attr.')) {
                const attr = field.split('.')[1];
                variants[idx] = { ...variants[idx], attributes: { ...variants[idx].attributes, [attr]: value } };
            } else {
                variants[idx] = { ...variants[idx], [field]: value };
            }
            return { ...f, variants };
        });
    };

    const addVariant = () => setForm((f) => ({ ...f, variants: [...f.variants, { ...emptyVariant }] }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.images.length) {
            setError('Please upload at least one product image');
            return;
        }

        setSaving(true);

        const payload = {
            name: form.name,
            brand: form.brand,
            category: form.category,
            description: form.description,
            images: form.images,
            isFeatured: form.isFeatured,
            variants: form.variants.map((v) => ({
                sku: v.sku,
                price: Number(v.price),
                mrp: Number(v.mrp),
                countInStock: Number(v.countInStock),
                attributes: v.attributes,
            })),
        };

        try {
            if (initial?._id) {
                await api.updateProduct(initial._id, payload);
            } else {
                await api.createProduct(payload);
            }
            router.push('/admin/products');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card" style={{ padding: '1.5rem', maxWidth: 720 }}>
            <div className="form-group">
                <label className="label">Product Name</label>
                <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                    <label className="label">Brand</label>
                    <input className="input" required value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
                </div>
                <div className="form-group">
                    <label className="label">Category</label>
                    <input className="input" required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                </div>
            </div>
            <div className="form-group">
                <label className="label">Description</label>
                <textarea className="textarea" rows={4} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>

            <ProductImageUpload
                images={form.images}
                onChange={(images) => setForm({ ...form, images })}
            />

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
                <span>Featured product</span>
            </label>

            <h3 style={{ marginBottom: '1rem' }}>Variants</h3>
            {form.variants.map((v, idx) => (
                <div key={idx} style={{ padding: '1rem', marginBottom: '1rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius)' }}>
                    <div className="form-group">
                        <label className="label">SKU</label>
                        <input className="input" required value={v.sku} onChange={(e) => updateVariant(idx, 'sku', e.target.value)} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                        <div className="form-group">
                            <label className="label">Price (₹)</label>
                            <input className="input" type="number" required min={0} value={v.price} onChange={(e) => updateVariant(idx, 'price', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="label">MRP (₹)</label>
                            <input className="input" type="number" required min={0} value={v.mrp} onChange={(e) => updateVariant(idx, 'mrp', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="label">Stock</label>
                            <input className="input" type="number" required min={0} value={v.countInStock} onChange={(e) => updateVariant(idx, 'countInStock', e.target.value)} />
                        </div>
                    </div>
                </div>
            ))}
            <button type="button" className="btn btn-secondary btn-sm" onClick={addVariant} style={{ marginBottom: '1.5rem' }}>
                + Add variant
            </button>

            {error && <div className="alert alert-error">{error}</div>}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : initial?._id ? 'Update Product' : 'Create Product'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => router.back()}>Cancel</button>
            </div>
        </form>
    );
}
