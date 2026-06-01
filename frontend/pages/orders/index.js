import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { api, formatPrice } from '../../lib/api';

export default function Orders() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) router.replace('/login?redirect=/orders');
    }, [user, authLoading, router]);

    useEffect(() => {
        if (!user) return;
        api.getMyOrders()
            .then(setOrders)
            .catch(() => setOrders([]))
            .finally(() => setLoading(false));
    }, [user]);

    if (authLoading || !user) return <div className="spinner" />;

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <header className="page-header">
                <h1>My Orders</h1>
            </header>

            {loading ? (
                <div className="spinner" />
            ) : orders.length > 0 ? (
                <div className="card" style={{ overflow: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((o) => (
                                <tr key={o._id}>
                                    <td>{o._id.slice(-8).toUpperCase()}</td>
                                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                                    <td>{formatPrice(o.pricingBreakdown?.totalPrice)}</td>
                                    <td>
                                        <span className={`badge ${o.isPaid ? 'badge-success' : 'badge-muted'}`}>
                                            {o.deliveryStatus}
                                        </span>
                                    </td>
                                    <td>
                                        <Link href={`/orders/${o._id}`}>View</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="empty-state">
                    <p>No orders yet.</p>
                    <Link href="/shop" className="btn btn-primary" style={{ marginTop: '1rem' }}>Start Shopping</Link>
                </div>
            )}
        </div>
    );
}
