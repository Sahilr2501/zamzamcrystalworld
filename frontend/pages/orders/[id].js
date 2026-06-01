import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { api, formatPrice } from '../../lib/api';

export default function OrderDetail() {
    const router = useRouter();
    const { id, success } = router.query;
    const { user, loading: authLoading } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) router.replace(`/login?redirect=/orders/${id}`);
    }, [user, authLoading, router, id]);

    useEffect(() => {
        if (!id || !user) return;
        api.getOrder(id)
            .then(setOrder)
            .catch(() => setOrder(null))
            .finally(() => setLoading(false));
    }, [id, user]);

    if (authLoading || !user || loading) return <div className="spinner" />;
    if (!order) {
        return (
            <div className="container empty-state">
                <p>Order not found.</p>
                <Link href="/orders">Back to orders</Link>
            </div>
        );
    }

    const pb = order.pricingBreakdown || {};

    return (
        <div className="container" style={{ maxWidth: 720, paddingBottom: '4rem' }}>
            <header className="page-header">
                <h1>Order #{order._id.slice(-8).toUpperCase()}</h1>
                {success && <div className="alert alert-success">Thank you! Your order has been placed.</div>}
            </header>

            <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                <p><strong>Status:</strong> {order.deliveryStatus}</p>
                <p><strong>Payment:</strong> {order.isPaid ? 'Paid' : 'Pending'} · {order.paymentMethod}</p>
                <p><strong>Placed:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            </div>

            <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                <h3 style={{ marginTop: 0 }}>Items</h3>
                {order.orderItems.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>{item.name} × {item.qty}</span>
                        <span>{formatPrice(item.price * item.qty)}</span>
                    </div>
                ))}
                <hr style={{ borderColor: 'var(--border)', margin: '1rem 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>{formatPrice(pb.itemsPrice)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tax</span><span>{formatPrice(pb.taxPrice)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Shipping</span><span>{formatPrice(pb.shippingPrice)}</span></div>
                {pb.couponDiscount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Discount</span><span>−{formatPrice(pb.couponDiscount)}</span></div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, marginTop: '0.5rem', color: 'var(--accent)' }}>
                    <span>Total</span>
                    <span>{formatPrice(pb.totalPrice)}</span>
                </div>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ marginTop: 0 }}>Shipping Address</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                    {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </p>
            </div>

            <Link href="/orders" style={{ display: 'inline-block', marginTop: '1.5rem' }}>← All orders</Link>
        </div>
    );
}
