import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { api, formatPrice } from '../../lib/api';

const orderDetailStyles = {
    pageWrapper: {
        background: '#FBF5DD',
        minHeight: 'calc(100vh - 200px)',
    },
    container: {
        maxWidth: '720px',
        margin: '0 auto',
        padding: '2rem 1.5rem 4rem',
    },
    pageHeader: {
        textAlign: 'center',
        marginBottom: '2rem',
    },
    pageTitle: {
        fontSize: '1.75rem',
        fontWeight: 700,
        color: '#0D530E',
        marginBottom: '0.5rem',
    },
    card: {
        background: '#ffffff',
        borderRadius: '20px',
        padding: '1.5rem',
        marginBottom: '1rem',
        border: '1px solid #E7E1B1',
        boxShadow: '0 4px 12px rgba(48, 109, 41, 0.08)',
    },
    cardTitle: {
        fontSize: '1.125rem',
        fontWeight: 600,
        color: '#0D530E',
        marginTop: 0,
        marginBottom: '1rem',
        paddingBottom: '0.5rem',
        borderBottom: '2px solid #E7E1B1',
    },
    infoRow: {
        marginBottom: '0.5rem',
        color: '#306D29',
    },
    infoLabel: {
        fontWeight: 600,
        color: '#0D530E',
    },
    itemRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '0.5rem',
        padding: '0.5rem 0',
        color: '#306D29',
        borderBottom: '1px solid #E7E1B1',
    },
    divider: {
        border: 'none',
        borderTop: '1px solid #E7E1B1',
        margin: '1rem 0',
    },
    priceRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '0.5rem',
        color: '#306D29',
    },
    priceTotal: {
        display: 'flex',
        justifyContent: 'space-between',
        fontWeight: 700,
        marginTop: '0.75rem',
        paddingTop: '0.75rem',
        borderTop: '2px solid #E7E1B1',
        color: '#0D530E',
        fontSize: '1.125rem',
    },
    addressText: {
        margin: 0,
        color: '#306D29',
        lineHeight: 1.6,
    },
    backLink: {
        display: 'inline-block',
        marginTop: '1.5rem',
        color: '#306D29',
        textDecoration: 'none',
        fontWeight: 500,
        transition: 'color 0.2s ease',
    },
    alert: {
        padding: '0.75rem 1rem',
        borderRadius: '12px',
        fontSize: '0.875rem',
        marginBottom: '1rem',
    },
    alertSuccess: {
        background: '#dcfce7',
        border: '1px solid #bbf7d0',
        color: '#166534',
    },
    emptyState: {
        textAlign: 'center',
        padding: '4rem',
        background: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #E7E1B1',
    },
    emptyStateText: {
        color: '#306D29',
        marginBottom: '1rem',
    },
    spinnerContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
    },
    spinner: {
        width: '50px',
        height: '50px',
        border: '3px solid #E7E1B1',
        borderTopColor: '#306D29',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
    },
    statusBadge: {
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: 600,
    },
    statusDelivered: {
        background: '#dcfce7',
        color: '#166534',
    },
    statusProcessing: {
        background: '#fef3c7',
        color: '#92400e',
    },
    statusShipped: {
        background: '#dbeafe',
        color: '#1e40af',
    },
    statusPending: {
        background: '#fed7aa',
        color: '#9a3412',
    },
};

// Add animations and hover styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .order-back-link:hover {
      color: #0D530E !important;
      text-decoration: underline !important;
    }
    
    @media (max-width: 640px) {
      .order-container {
        padding: 1rem 1rem 3rem !important;
      }
      .order-title {
        font-size: 1.5rem !important;
      }
      .order-card {
        padding: 1rem !important;
      }
    }
  `;
    document.head.appendChild(styleSheet);
}

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

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
                return orderDetailStyles.statusDelivered;
            case 'shipped':
                return orderDetailStyles.statusShipped;
            case 'processing':
                return orderDetailStyles.statusProcessing;
            default:
                return orderDetailStyles.statusPending;
        }
    };

    if (authLoading || !user || loading) {
        return (
            <div style={orderDetailStyles.pageWrapper}>
                <div style={orderDetailStyles.spinnerContainer}>
                    <div style={orderDetailStyles.spinner} />
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div style={orderDetailStyles.pageWrapper}>
                <div style={orderDetailStyles.container}>
                    <div style={orderDetailStyles.emptyState}>
                        <p style={orderDetailStyles.emptyStateText}>Order not found.</p>
                        <Link href="/orders" style={orderDetailStyles.backLink}>
                            ← Back to orders
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const pb = order.pricingBreakdown || {};

    return (
        <div style={orderDetailStyles.pageWrapper}>
            <div className="order-container" style={orderDetailStyles.container}>
                <header style={orderDetailStyles.pageHeader}>
                    <h1 className="order-title" style={orderDetailStyles.pageTitle}>
                        Order #{order._id.slice(-8).toUpperCase()}
                    </h1>
                    {success && (
                        <div style={{ ...orderDetailStyles.alert, ...orderDetailStyles.alertSuccess }}>
                            ✓ Thank you! Your order has been placed successfully.
                        </div>
                    )}
                </header>

                {/* Order Status Card */}
                <div className="order-card" style={orderDetailStyles.card}>
                    <p style={orderDetailStyles.infoRow}>
                        <span style={orderDetailStyles.infoLabel}>Status:</span>{' '}
                        <span style={{ ...orderDetailStyles.statusBadge, ...getStatusStyle(order.deliveryStatus) }}>
                            {order.deliveryStatus}
                        </span>
                    </p>
                    <p style={orderDetailStyles.infoRow}>
                        <span style={orderDetailStyles.infoLabel}>Payment:</span>{' '}
                        {order.isPaid ? '✓ Paid' : 'Pending'} · {order.paymentMethod}
                    </p>
                    <p style={orderDetailStyles.infoRow}>
                        <span style={orderDetailStyles.infoLabel}>Placed:</span>{' '}
                        {new Date(order.createdAt).toLocaleString()}
                    </p>
                </div>

                {/* Order Items Card */}
                <div className="order-card" style={orderDetailStyles.card}>
                    <h3 style={orderDetailStyles.cardTitle}>Order Items</h3>
                    {order.orderItems.map((item, i) => (
                        <div key={i} style={orderDetailStyles.itemRow}>
                            <span>{item.name} × {item.qty}</span>
                            <span style={{ fontWeight: 500 }}>{formatPrice(item.price * item.qty)}</span>
                        </div>
                    ))}
                    <hr style={orderDetailStyles.divider} />
                    <div style={orderDetailStyles.priceRow}>
                        <span>Subtotal</span>
                        <span>{formatPrice(pb.itemsPrice)}</span>
                    </div>
                    <div style={orderDetailStyles.priceRow}>
                        <span>Tax (18% GST)</span>
                        <span>{formatPrice(pb.taxPrice)}</span>
                    </div>
                    <div style={orderDetailStyles.priceRow}>
                        <span>Shipping</span>
                        <span>{formatPrice(pb.shippingPrice)}</span>
                    </div>
                    {pb.couponDiscount > 0 && (
                        <div style={orderDetailStyles.priceRow}>
                            <span>Discount</span>
                            <span style={{ color: '#306D29' }}>−{formatPrice(pb.couponDiscount)}</span>
                        </div>
                    )}
                    <div style={orderDetailStyles.priceTotal}>
                        <span>Total Amount</span>
                        <span>{formatPrice(pb.totalPrice)}</span>
                    </div>
                </div>

                {/* Shipping Address Card */}
                <div className="order-card" style={orderDetailStyles.card}>
                    <h3 style={orderDetailStyles.cardTitle}>Shipping Address</h3>
                    <p style={orderDetailStyles.addressText}>
                        {order.shippingAddress.street}, {order.shippingAddress.city},<br />
                        {order.shippingAddress.state} {order.shippingAddress.postalCode},<br />
                        {order.shippingAddress.country}
                    </p>
                </div>

                <Link
                    href="/orders"
                    className="order-back-link"
                    style={orderDetailStyles.backLink}
                >
                    ← All orders
                </Link>
            </div>
        </div>
    );
}