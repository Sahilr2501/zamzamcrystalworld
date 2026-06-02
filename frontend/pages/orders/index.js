import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { api, formatPrice } from '../../lib/api';

const ordersStyles = {
    pageWrapper: {
        background: '#FBF5DD',
        minHeight: 'calc(100vh - 200px)',
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1.5rem 4rem',
    },
    pageHeader: {
        textAlign: 'center',
        marginBottom: '2rem',
    },
    pageTitle: {
        fontSize: '2rem',
        fontWeight: 700,
        color: '#0D530E',
        marginBottom: '0.5rem',
    },
    tableWrapper: {
        overflow: 'auto',
        borderRadius: '20px',
        border: '1px solid #E7E1B1',
        background: '#ffffff',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '600px',
    },
    tableHeader: {
        background: '#FBF5DD',
        borderBottom: '2px solid #E7E1B1',
    },
    th: {
        padding: '1rem',
        textAlign: 'left',
        fontWeight: 600,
        color: '#0D530E',
        fontSize: '0.875rem',
    },
    td: {
        padding: '1rem',
        borderBottom: '1px solid #E7E1B1',
        color: '#306D29',
        fontSize: '0.875rem',
    },
    badge: {
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: 600,
    },
    badgeDelivered: {
        background: '#dcfce7',
        color: '#166534',
    },
    badgeShipped: {
        background: '#dbeafe',
        color: '#1e40af',
    },
    badgeProcessing: {
        background: '#fef3c7',
        color: '#92400e',
    },
    badgePending: {
        background: '#fed7aa',
        color: '#9a3412',
    },
    viewLink: {
        color: '#306D29',
        textDecoration: 'none',
        fontWeight: 500,
        transition: 'color 0.2s ease',
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
        fontSize: '1rem',
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
    btnPrimary: {
        display: 'inline-block',
        background: '#306D29',
        color: '#FBF5DD',
        padding: '0.75rem 1.5rem',
        borderRadius: '12px',
        fontWeight: 600,
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        marginTop: '1rem',
    },
};

// Add animations and hover styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .orders-view-link:hover {
      color: #0D530E !important;
      text-decoration: underline !important;
    }
    
    .orders-btn-primary:hover {
      background: #0D530E !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(48, 109, 41, 0.3);
    }
    
    @media (max-width: 768px) {
      .orders-container {
        padding: 1rem 1rem 3rem !important;
      }
      .orders-title {
        font-size: 1.75rem !important;
      }
      .orders-table th, .orders-table td {
        padding: 0.75rem !important;
      }
    }
  `;
    document.head.appendChild(styleSheet);
}

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

    const getStatusBadgeStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
                return ordersStyles.badgeDelivered;
            case 'shipped':
                return ordersStyles.badgeShipped;
            case 'processing':
                return ordersStyles.badgeProcessing;
            default:
                return ordersStyles.badgePending;
        }
    };

    if (authLoading || !user) {
        return (
            <div style={ordersStyles.pageWrapper}>
                <div style={ordersStyles.spinnerContainer}>
                    <div style={ordersStyles.spinner} />
                </div>
            </div>
        );
    }

    return (
        <div style={ordersStyles.pageWrapper}>
            <div className="orders-container" style={ordersStyles.container}>
                <header style={ordersStyles.pageHeader}>
                    <h1 className="orders-title" style={ordersStyles.pageTitle}>My Orders</h1>
                </header>

                {loading ? (
                    <div style={ordersStyles.spinnerContainer}>
                        <div style={ordersStyles.spinner} />
                    </div>
                ) : orders.length > 0 ? (
                    <div style={ordersStyles.tableWrapper}>
                        <table className="orders-table" style={ordersStyles.table}>
                            <thead style={ordersStyles.tableHeader}>
                                <tr>
                                    <th style={ordersStyles.th}>Order ID</th>
                                    <th style={ordersStyles.th}>Date</th>
                                    <th style={ordersStyles.th}>Total</th>
                                    <th style={ordersStyles.th}>Status</th>
                                    <th style={ordersStyles.th}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((o) => (
                                    <tr key={o._id}>
                                        <td style={ordersStyles.td}>
                                            #{o._id.slice(-8).toUpperCase()}
                                        </td>
                                        <td style={ordersStyles.td}>
                                            {new Date(o.createdAt).toLocaleDateString()}
                                        </td>
                                        <td style={ordersStyles.td}>
                                            {formatPrice(o.pricingBreakdown?.totalPrice)}
                                        </td>
                                        <td style={ordersStyles.td}>
                                            <span style={{ ...ordersStyles.badge, ...getStatusBadgeStyle(o.deliveryStatus) }}>
                                                {o.deliveryStatus}
                                            </span>
                                        </td>
                                        <td style={ordersStyles.td}>
                                            <Link
                                                href={`/orders/${o._id}`}
                                                className="orders-view-link"
                                                style={ordersStyles.viewLink}
                                            >
                                                View Details →
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={ordersStyles.emptyState}>
                        <p style={ordersStyles.emptyStateText}>No orders yet.</p>
                        <Link href="/shop" className="orders-btn-primary" style={ordersStyles.btnPrimary}>
                            Start Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}