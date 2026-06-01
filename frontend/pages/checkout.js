import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api, formatPrice } from '../lib/api';
import styles from '../styles/Checkout.module.css';

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
            <div className="container empty-state">
                <p>Your cart is empty.</p>
                <Link href="/shop" className="btn btn-primary">Go to Shop</Link>
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
        <div className={`container ${styles.page}`}>
            <header className="page-header">
                <h1>Checkout</h1>
            </header>

            <form onSubmit={placeOrder} className={styles.grid}>
                <div>
                    <h2 className={styles.sectionTitle}>Shipping Address</h2>
                    {['street', 'city', 'state', 'postalCode', 'country'].map((field) => (
                        <div key={field} className="form-group">
                            <label className="label">{field === 'postalCode' ? 'Postal Code' : field.charAt(0).toUpperCase() + field.slice(1)}</label>
                            <input
                                className="input"
                                required
                                value={address[field]}
                                onChange={(e) => setAddress({ ...address, [field]: e.target.value })}
                            />
                        </div>
                    ))}

                    <h2 className={styles.sectionTitle}>Payment</h2>
                    <select className="select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                        <option value="COD">Cash on Delivery</option>
                        <option value="Razorpay">Online (Razorpay)</option>
                    </select>

                    <h2 className={styles.sectionTitle}>Coupon</h2>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input className="input" placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                        <button type="button" className="btn btn-secondary btn-sm" onClick={applyCoupon}>Apply</button>
                    </div>
                </div>

                <aside className={`card ${styles.summary}`}>
                    <h2>Order Summary</h2>
                    {items.map((i) => (
                        <div key={i.key} className={styles.row}>
                            <span>{i.name} × {i.qty}</span>
                            <span>{formatPrice(i.price * i.qty)}</span>
                        </div>
                    ))}
                    <hr className={styles.divider} />
                    <div className={styles.row}><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                    <div className={styles.row}><span>Tax (18%)</span><span>{formatPrice(tax)}</span></div>
                    <div className={styles.row}><span>Shipping</span><span>{shipping ? formatPrice(shipping) : 'Free'}</span></div>
                    {discount > 0 && <div className={styles.row}><span>Discount</span><span>−{formatPrice(discount)}</span></div>}
                    <div className={`${styles.row} ${styles.total}`}>
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                    </div>
                    {error && <div className="alert alert-error" style={{ marginTop: '1rem' }}>{error}</div>}
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={submitting}>
                        {submitting ? 'Placing order...' : 'Place Order'}
                    </button>
                </aside>
            </form>
        </div>
    );
}
