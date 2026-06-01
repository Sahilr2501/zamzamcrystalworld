import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '../../components/layout/AdminLayout';
import { api, formatPrice } from '../../lib/api';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });

    useEffect(() => {
        Promise.all([api.getProducts({ limit: 1 }), api.getAllOrders()])
            .then(([productsRes, orders]) => {
                const revenue = (orders || []).reduce(
                    (acc, o) => acc + (o.pricingBreakdown?.totalPrice || 0),
                    0
                );
                setStats({
                    products: productsRes.total || 0,
                    orders: orders?.length || 0,
                    revenue,
                });
            })
            .catch(() => {});
    }, []);

    return (
        <AdminLayout title="Dashboard">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div className="card" style={{ padding: '1.25rem' }}>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Products</p>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '2rem', fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>{stats.products}</p>
                </div>
                <div className="card" style={{ padding: '1.25rem' }}>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Orders</p>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '2rem', fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>{stats.orders}</p>
                </div>
                <div className="card" style={{ padding: '1.25rem' }}>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Revenue</p>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '1.5rem', fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>{formatPrice(stats.revenue)}</p>
                </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                <Link href="/admin/products/new" className="btn btn-primary">Add Product</Link>
                <Link href="/admin/products" className="btn btn-secondary">Manage Products</Link>
                <Link href="/admin/orders" className="btn btn-secondary">View Orders</Link>
                <Link href="/admin/coupons" className="btn btn-secondary">Manage Coupons</Link>
            </div>
        </AdminLayout>
    );
}
