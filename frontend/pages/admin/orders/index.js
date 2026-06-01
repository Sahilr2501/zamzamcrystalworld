import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '../../../components/layout/AdminLayout';
import { api, formatPrice } from '../../../lib/api';

const STATUSES = ['Ordered', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered'];

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = () => {
        api.getAllOrders()
            .then(setOrders)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        load();
    }, []);

    const updateStatus = async (id, deliveryStatus) => {
        await api.deliverOrder(id, { deliveryStatus });
        load();
    };

    return (
        <AdminLayout title="Orders">
            {loading ? (
                <div className="spinner" />
            ) : (
                <div className="card" style={{ overflow: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Paid</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((o) => (
                                <tr key={o._id}>
                                    <td>{o._id.slice(-8).toUpperCase()}</td>
                                    <td>{o.user?.name || o.user?.email || '—'}</td>
                                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                                    <td>{formatPrice(o.pricingBreakdown?.totalPrice)}</td>
                                    <td>{o.isPaid ? <span className="badge badge-success">Yes</span> : <span className="badge badge-muted">No</span>}</td>
                                    <td>{o.deliveryStatus}</td>
                                    <td>
                                        <select
                                            className="select"
                                            style={{ width: 'auto', fontSize: '0.8rem', padding: '0.4rem' }}
                                            value={o.deliveryStatus}
                                            onChange={(e) => updateStatus(o._id, e.target.value)}
                                        >
                                            {STATUSES.map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                        <Link href={`/admin/orders/${o._id}`} style={{ marginLeft: '0.5rem', fontSize: '0.85rem' }}>View</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!orders.length && <p className="empty-state">No orders yet.</p>}
                </div>
            )}
        </AdminLayout>
    );
}
