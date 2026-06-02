import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api, formatPrice } from '../lib/api';

const checkoutStyles = {
    pageWrapper: {
        background: '#FBF5DD',
        minHeight: 'calc(100vh - 200px)',
    },
    page: {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '2rem 1.5rem 4rem',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: '2rem',
    },
    sectionTitle: {
        fontSize: '1.25rem',
        fontWeight: 600,
        color: '#0D530E',
        marginBottom: '1rem',
        marginTop: '1.5rem',
        paddingBottom: '0.5rem',
        borderBottom: '2px solid #E7E1B1',
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
        background: '#ffffff',
        border: '1px solid #E7E1B1',
        borderRadius: '12px',
        fontSize: '0.875rem',
        color: '#0D530E',
        transition: 'all 0.2s ease',
        outline: 'none',
    },
    select: {
        width: '100%',
        padding: '0.75rem 1rem',
        background: '#ffffff',
        border: '1px solid #E7E1B1',
        borderRadius: '12px',
        fontSize: '0.875rem',
        color: '#0D530E',
        cursor: 'pointer',
        outline: 'none',
    },
    couponGroup: {
        display: 'flex',
        gap: '0.5rem',
    },
    summary: {
        position: 'sticky',
        top: '100px',
        background: '#ffffff',
        borderRadius: '20px',
        padding: '1.5rem',
        border: '1px solid #E7E1B1',
        boxShadow: '0 4px 12px rgba(48, 109, 41, 0.08)',
    },
    summaryTitle: {
        fontSize: '1.25rem',
        fontWeight: 700,
        color: '#0D530E',
        marginBottom: '1rem',
        paddingBottom: '0.5rem',
        borderBottom: '2px solid #E7E1B1',
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.5rem 0',
        fontSize: '0.875rem',
        color: '#306D29',
    },
    divider: {
        margin: '0.75rem 0',
        border: 'none',
        borderTop: '1px solid #E7E1B1',
    },
    total: {
        fontSize: '1.125rem',
        fontWeight: 700,
        color: '#0D530E',
        paddingTop: '0.75rem',
        marginTop: '0.5rem',
        borderTop: '2px solid #E7E1B1',
    },
    btnPrimary: {
        width: '100%',
        background: '#306D29',
        color: '#FBF5DD',
        padding: '0.875rem 1.5rem',
        borderRadius: '12px',
        fontWeight: 600,
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.875rem',
        transition: 'all 0.2s ease',
        marginTop: '1rem',
    },
    btnSecondary: {
        background: 'transparent',
        color: '#306D29',
        padding: '0.75rem 1.25rem',
        borderRadius: '10px',
        fontWeight: 500,
        border: '1px solid #306D29',
        cursor: 'pointer',
        fontSize: '0.875rem',
        transition: 'all 0.2s ease',
    },
    alert: {
        padding: '0.75rem 1rem',
        borderRadius: '12px',
        fontSize: '0.875rem',
        marginTop: '1rem',
    },
    alertError: {
        background: '#fee2e2',
        border: '1px solid #fecaca',
        color: '#dc2626',
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
        marginBottom: '1.5rem',
        fontSize: '1.125rem',
    },
};

// Add focus styles and animations
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
    .checkout-input:focus, .checkout-select:focus {
      border-color: #306D29 !important;
      box-shadow: 0 0 0 3px rgba(48, 109, 41, 0.1) !important;
      background: #ffffff !important;
    }
    
    .checkout-btn-primary:hover:not(:disabled) {
      background: #0D530E !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(48, 109, 41, 0.3);
    }
    
    .checkout-btn-secondary:hover {
      background: rgba(48, 109, 41, 0.1);
      transform: translateY(-1px);
    }
    
    @media (max-width: 768px) {
      .checkout-grid {
        grid-template-columns: 1fr !important;
      }
      .checkout-summary {
        position: static !important;
      }
    }
  `;
    document.head.appendChild(styleSheet);
}

const emptyAddress = { street: '', city: '', state: '', postalCode: '', country: 'India' };

export default function Checkout() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { items, subtotal, clearCart, itemsCount } = useCart();
    const [address, setAddress] = useState(emptyAddress);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const tax = Number((subtotal * 0.18).toFixed(2));
    const shipping = subtotal > 999 ? 0 : 99;
    const total = subtotal + tax + shipping - discount;

    useEffect(() => {
        if (!authLoading && !user) router.replace('/login?redirect=/checkout');
    }, [authLoading, user, router]);

    if (authLoading || !user) return <div className="spinner" />;

    if (!itemsCount) {
        return (
            <div style={checkoutStyles.pageWrapper}>
                <div style={checkoutStyles.page}>
                    <div style={checkoutStyles.emptyState}>
                        <p style={checkoutStyles.emptyStateText}>Your cart is empty.</p>
                        <Link href="/shop" className="checkout-btn-primary" style={checkoutStyles.btnPrimary}>
                            Go to Shop
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const applyCoupon = async () => {
        try {
            const result = await api.validateCoupon({ code: couponCode, orderTotal: subtotal });
            setDiscount(result.discount);
            setError('');
        } catch (err) {
            setDiscount(0);
            setError(err.message);
        }
    };

    const placeOrder = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            const orderItems = items.map((i) => ({
                name: i.name,
                qty: i.qty,
                image: i.image,
                price: i.price,
                product: i.product,
                sku: i.sku,
            }));

            const order = await api.createOrder({
                orderItems,
                shippingAddress: address,
                paymentMethod,
                couponCode: discount > 0 ? couponCode : undefined,
            });

            if (paymentMethod === 'COD') {
                await api.payOrder(order._id, { paymentResult: { status: 'COD confirmed' } });
            }

            clearCart();
            router.push(`/orders/${order._id}?success=1`);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={checkoutStyles.pageWrapper}>
            <div style={checkoutStyles.page}>
                <header className="page-header">
                    <h1 style={{ color: '#0D530E' }}>Checkout</h1>
                </header>

                <form onSubmit={placeOrder} className="checkout-grid" style={checkoutStyles.grid}>
                    <div>
                        <h2 style={checkoutStyles.sectionTitle}>Shipping Address</h2>
                        {['street', 'city', 'state', 'postalCode', 'country'].map((field) => (
                            <div key={field} style={checkoutStyles.formGroup}>
                                <label style={checkoutStyles.label}>
                                    {field === 'postalCode' ? 'Postal Code' : field.charAt(0).toUpperCase() + field.slice(1)}
                                </label>
                                <input
                                    className="checkout-input"
                                    style={checkoutStyles.input}
                                    type="text"
                                    required
                                    value={address[field]}
                                    onChange={(e) => setAddress({ ...address, [field]: e.target.value })}
                                />
                            </div>
                        ))}

                        <h2 style={checkoutStyles.sectionTitle}>Payment Method</h2>
                        <select
                            className="checkout-select"
                            style={checkoutStyles.select}
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <option value="COD">Cash on Delivery</option>
                            <option value="Razorpay">Online (Razorpay)</option>
                        </select>

                        <h2 style={checkoutStyles.sectionTitle}>Apply Coupon</h2>
                        <div style={checkoutStyles.couponGroup}>
                            <input
                                className="checkout-input"
                                style={checkoutStyles.input}
                                placeholder="Enter coupon code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                            />
                            <button
                                type="button"
                                className="checkout-btn-secondary"
                                style={checkoutStyles.btnSecondary}
                                onClick={applyCoupon}
                            >
                                Apply
                            </button>
                        </div>
                    </div>

                    <aside className="checkout-summary" style={checkoutStyles.summary}>
                        <h2 style={checkoutStyles.summaryTitle}>Order Summary</h2>
                        {items.map((i) => (
                            <div key={i.key} style={checkoutStyles.row}>
                                <span>{i.name} × {i.qty}</span>
                                <span>{formatPrice(i.price * i.qty)}</span>
                            </div>
                        ))}
                        <hr style={checkoutStyles.divider} />
                        <div style={checkoutStyles.row}>
                            <span>Subtotal</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>
                        <div style={checkoutStyles.row}>
                            <span>Tax (18% GST)</span>
                            <span>{formatPrice(tax)}</span>
                        </div>
                        <div style={checkoutStyles.row}>
                            <span>Shipping</span>
                            <span>{shipping ? formatPrice(shipping) : 'Free'}</span>
                        </div>
                        {discount > 0 && (
                            <div style={checkoutStyles.row}>
                                <span>Discount</span>
                                <span style={{ color: '#306D29' }}>−{formatPrice(discount)}</span>
                            </div>
                        )}
                        <div style={checkoutStyles.total}>
                            <span>Total Amount</span>
                            <span>{formatPrice(total)}</span>
                        </div>
                        {error && (
                            <div style={{ ...checkoutStyles.alert, ...checkoutStyles.alertError }}>
                                {error}
                            </div>
                        )}
                        <button
                            type="submit"
                            className="checkout-btn-primary"
                            style={checkoutStyles.btnPrimary}
                            disabled={submitting}
                        >
                            {submitting ? 'Placing order...' : 'Place Order'}
                        </button>
                    </aside>
                </form>
            </div>
        </div>
    );
}