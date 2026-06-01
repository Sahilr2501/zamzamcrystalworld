import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '../../../components/layout/AdminLayout';
import { api, formatPrice, productMinPrice } from '../../../lib/api';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = () => {
        api.getProducts({ limit: 100 })
            .then((d) => setProducts(d.products || []))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        load();
    }, []);

    const remove = async (id) => {
        if (!confirm('Delete this product?')) return;
        await api.deleteProduct(id);
        load();
    };

    return (
        <AdminLayout title="Products">
            <div style={{ marginBottom: '1rem' }}>
                <Link href="/admin/products/new" className="btn btn-primary btn-sm">+ New Product</Link>
            </div>

            {loading ? (
                <div className="spinner" />
            ) : (
                <div className="card" style={{ overflow: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Featured</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr key={p._id}>
                                    <td>{p.name}</td>
                                    <td>{p.category}</td>
                                    <td>{formatPrice(productMinPrice(p))}</td>
                                    <td>{p.isFeatured ? <span className="badge">Yes</span> : '—'}</td>
                                    <td style={{ whiteSpace: 'nowrap' }}>
                                        <Link href={`/admin/products/${p._id}`} style={{ marginRight: '0.75rem' }}>Edit</Link>
                                        <button type="button" className="btn-ghost" style={{ color: 'var(--danger)' }} onClick={() => remove(p._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!products.length && <p className="empty-state">No products yet.</p>}
                </div>
            )}
        </AdminLayout>
    );
}
