import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AdminLayout from '../../../components/layout/AdminLayout';
import { api, formatPrice } from '../../../lib/api';

export default function AdminOrderDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [order, setOrder] = useState(null);

    useEffect(() => {
        if (!id) return;
        api.getOrder(id).then(setOrder).catch(() => setOrder(null));
    }, [id]);

    if (!order) {
        return (
            <AdminLayout title="Order Detail">
                <div className="spinner" />
            </AdminLayout>
        );
    }

    const pb = order.pricingBreakdown || {};

    return (
        <AdminLayout title={`Order #${order._id.slice(-8).toUpperCase()}`}>
            <div className="card" style={{ padding: '1.5rem', maxWidth: 640 }}>
                <p><strong>Customer:</strong> {order.user?.name} ({order.user?.email})</p>
                <p><strong>Status:</strong> {order.deliveryStatus}</p>
                <p><strong>Payment:</strong> {order.isPaid ? 'Paid' : 'Pending'} — {order.paymentMethod}</p>
                <hr style={{ borderColor: 'var(--border)' }} />
                {order.orderItems.map((item, i) => (
                    <p key={i}>{item.name} × {item.qty} — {formatPrice(item.price * item.qty)}</p>
                ))}
                <p style={{ fontWeight: 600, color: 'var(--accent)' }}>Total: {formatPrice(pb.totalPrice)}</p>
            </div>
            <Link href="/admin/orders" style={{ display: 'inline-block', marginTop: '1rem' }}>← All orders</Link>
        </AdminLayout>
    );
}
