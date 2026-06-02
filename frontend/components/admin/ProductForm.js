import { useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '../../lib/api';
import ProductImageUpload from './ProductImageUpload';

const emptyVariant = { sku: '', price: '', mrp: '', countInStock: '', attributes: { size: '', color: '' } };

const formStyles = {
    form: {
        padding: '1rem',
        maxWidth: '720px',
        margin: '0 auto',
        background: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #E7E1B1',
        boxShadow: '0 4px 12px rgba(48, 109, 41, 0.08)',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
    },
    formGroup: {
        marginBottom: '1rem',
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
    textarea: {
        width: '100%',
        padding: '0.75rem 1rem',
        background: '#FBF5DD',
        border: '1px solid #E7E1B1',
        borderRadius: '12px',
        fontSize: '0.875rem',
        color: '#0D530E',
        transition: 'all 0.2s ease',
        outline: 'none',
        resize: 'vertical',
    },
    checkbox: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        cursor: 'pointer',
        flexWrap: 'wrap',
    },
    checkboxInput: {
        width: '18px',
        height: '18px',
        cursor: 'pointer',
        accentColor: '#306D29',
    },
    checkboxLabel: {
        color: '#0D530E',
        fontSize: '0.875rem',
    },
    variantsTitle: {
        fontSize: '1.125rem',
        fontWeight: 600,
        color: '#0D530E',
        marginBottom: '1rem',
        paddingBottom: '0.5rem',
        borderBottom: '2px solid #E7E1B1',
    },
    variantCard: {
        padding: '1rem',
        marginBottom: '1rem',
        background: '#FBF5DD',
        borderRadius: '16px',
        border: '1px solid #E7E1B1',
    },
    variantGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.75rem',
    },
    btnSecondary: {
        background: 'transparent',
        color: '#306D29',
        padding: '0.5rem 1rem',
        borderRadius: '10px',
        fontWeight: 500,
        border: '1px solid #306D29',
        cursor: 'pointer',
        fontSize: '0.875rem',
        transition: 'all 0.2s ease',
        marginBottom: '1.5rem',
        width: 'auto',
    },
    btnPrimary: {
        background: '#306D29',
        color: '#FBF5DD',
        padding: '0.75rem 1.5rem',
        borderRadius: '12px',
        fontWeight: 600,
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.875rem',
        transition: 'all 0.2s ease',
        flex: 1,
    },
    btnDanger: {
        background: 'transparent',
        color: '#dc2626',
        padding: '0.5rem 1rem',
        borderRadius: '10px',
        fontWeight: 500,
        border: '1px solid #dc2626',
        cursor: 'pointer',
        fontSize: '0.75rem',
        transition: 'all 0.2s ease',
        marginTop: '0.5rem',
        width: '100%',
    },
    buttonGroup: {
        display: 'flex',
        gap: '0.75rem',
        marginTop: '1rem',
        flexWrap: 'wrap',
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
};

// Add responsive styles and focus effects
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
    .product-input:focus, .product-textarea:focus {
      border-color: #306D29 !important;
      box-shadow: 0 0 0 3px rgba(48, 109, 41, 0.1) !important;
      background: #ffffff !important;
    }
    
    .product-btn-primary:hover:not(:disabled) {
      background: #0D530E !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(48, 109, 41, 0.3);
    }
    
    .product-btn-secondary:hover {
      background: rgba(48, 109, 41, 0.1);
      transform: translateY(-1px);
      border-color: #0D530E;
      color: #0D530E;
    }
    
    .product-btn-danger:hover {
      background: rgba(220, 38, 38, 0.1);
      transform: translateY(-1px);
    }
    
    /* Mobile Responsive Styles */
    @media (max-width: 768px) {
      .product-form {
        margin: 0 1rem !important;
        padding: 1rem !important;
      }
      
      .form-grid {
        grid-template-columns: 1fr !important;
        gap: 0 !important;
      }
      
      .variant-grid {
        grid-template-columns: 1fr !important;
        gap: 0.5rem !important;
      }
      
      .button-group {
        flex-direction: column;
      }
      
      .button-group button {
        width: 100%;
      }
      
      .variant-card {
        padding: 0.75rem !important;
      }
      
      .product-btn-secondary {
        width: 100%;
      }
    }
    
    @media (max-width: 480px) {
      .product-form {
        margin: 0 0.5rem !important;
        padding: 0.75rem !important;
      }
      
      .checkbox {
        margin-bottom: 1rem !important;
      }
      
      .variants-title {
        font-size: 1rem !important;
      }
    }
  `;
    document.head.appendChild(styleSheet);
}

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

    const removeVariant = (idx) => {
        if (form.variants.length === 1) {
            setError('Product must have at least one variant');
            return;
        }
        setForm((f) => ({
            ...f,
            variants: f.variants.filter((_, i) => i !== idx),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.images.length) {
            setError('Please upload at least one product image');
            return;
        }

        for (const variant of form.variants) {
            if (!variant.sku) {
                setError('All variants must have a SKU');
                return;
            }
            if (!variant.price || variant.price <= 0) {
                setError('All variants must have a valid price');
                return;
            }
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
        <form onSubmit={handleSubmit} className="product-form" style={formStyles.form}>
            <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Product Name</label>
                <input
                    className="product-input"
                    style={formStyles.input}
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter product name"
                />
            </div>

            <div className="form-grid" style={formStyles.grid}>
                <div style={formStyles.formGroup}>
                    <label style={formStyles.label}>Brand</label>
                    <input
                        className="product-input"
                        style={formStyles.input}
                        required
                        value={form.brand}
                        onChange={(e) => setForm({ ...form, brand: e.target.value })}
                        placeholder="Brand name"
                    />
                </div>
                <div style={formStyles.formGroup}>
                    <label style={formStyles.label}>Category</label>
                    <input
                        className="product-input"
                        style={formStyles.input}
                        required
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        placeholder="Category"
                    />
                </div>
            </div>

            <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Description</label>
                <textarea
                    className="product-textarea"
                    style={formStyles.textarea}
                    rows={4}
                    required
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Product description"
                />
            </div>

            <ProductImageUpload
                images={form.images}
                onChange={(images) => setForm({ ...form, images })}
            />

            <label className="checkbox" style={formStyles.checkbox}>
                <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    style={formStyles.checkboxInput}
                />
                <span style={formStyles.checkboxLabel}>Featured product (shows on homepage)</span>
            </label>

            <h3 className="variants-title" style={formStyles.variantsTitle}>Product Variants</h3>

            {form.variants.map((v, idx) => (
                <div key={idx} className="variant-card" style={formStyles.variantCard}>
                    <div style={formStyles.formGroup}>
                        <label style={formStyles.label}>SKU {idx + 1}</label>
                        <input
                            className="product-input"
                            style={formStyles.input}
                            required
                            value={v.sku}
                            onChange={(e) => updateVariant(idx, 'sku', e.target.value)}
                            placeholder="Unique SKU"
                        />
                    </div>

                    <div className="variant-grid" style={formStyles.variantGrid}>
                        <div style={formStyles.formGroup}>
                            <label style={formStyles.label}>Price (₹)</label>
                            <input
                                className="product-input"
                                style={formStyles.input}
                                type="number"
                                required
                                min={0}
                                step="0.01"
                                value={v.price}
                                onChange={(e) => updateVariant(idx, 'price', e.target.value)}
                                placeholder="Selling price"
                            />
                        </div>
                        <div style={formStyles.formGroup}>
                            <label style={formStyles.label}>MRP (₹)</label>
                            <input
                                className="product-input"
                                style={formStyles.input}
                                type="number"
                                required
                                min={0}
                                step="0.01"
                                value={v.mrp}
                                onChange={(e) => updateVariant(idx, 'mrp', e.target.value)}
                                placeholder="Original MRP"
                            />
                        </div>
                        <div style={formStyles.formGroup}>
                            <label style={formStyles.label}>Stock Quantity</label>
                            <input
                                className="product-input"
                                style={formStyles.input}
                                type="number"
                                required
                                min={0}
                                value={v.countInStock}
                                onChange={(e) => updateVariant(idx, 'countInStock', e.target.value)}
                                placeholder="Available stock"
                            />
                        </div>
                    </div>

                    {form.variants.length > 1 && (
                        <button
                            type="button"
                            className="product-btn-danger"
                            style={formStyles.btnDanger}
                            onClick={() => removeVariant(idx)}
                        >
                            Remove Variant
                        </button>
                    )}
                </div>
            ))}

            <button
                type="button"
                className="product-btn-secondary"
                style={formStyles.btnSecondary}
                onClick={addVariant}
            >
                + Add Another Variant
            </button>

            {error && (
                <div style={{ ...formStyles.alert, ...formStyles.alertError }}>
                    {error}
                </div>
            )}

            <div className="button-group" style={formStyles.buttonGroup}>
                <button
                    type="submit"
                    className="product-btn-primary"
                    style={formStyles.btnPrimary}
                    disabled={saving}
                >
                    {saving ? 'Saving...' : initial?._id ? 'Update Product' : 'Create Product'}
                </button>
                <button
                    type="button"
                    className="product-btn-secondary"
                    style={{ ...formStyles.btnSecondary, marginBottom: 0 }}
                    onClick={() => router.back()}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}