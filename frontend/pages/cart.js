import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { formatPrice, resolveImageUrl } from '../lib/api';
import styles from '../styles/Cart.module.css';

export default function Cart() {
    const { items, updateQty, removeItem, subtotal, itemsCount } = useCart();

    if (!itemsCount) {
        return (
            <div className="container empty-state" style={{ padding: '4rem 0' }}>
                <h1>Your cart is empty</h1>
                <p>Discover beautiful crystals in our shop.</p>
                <Link href="/shop" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className={`container ${styles.page}`}>
            <header className="page-header">
                <h1>Shopping Cart</h1>
                <p>{itemsCount} item{itemsCount !== 1 ? 's' : ''}</p>
            </header>

            <div className={styles.layout}>
                <ul className={styles.list}>
                    {items.map((item) => (
                        <li key={item.key} className={styles.item}>
                            <img src={resolveImageUrl(item.image)} alt="" className={styles.thumb} />
                            <div className={styles.details}>
                                <Link href={`/product/${item.product}`}>{item.name}</Link>
                                <p className={styles.meta}>SKU: {item.sku}</p>
                                <p className={styles.price}>{formatPrice(item.price)}</p>
                            </div>
                            <div className={styles.qty}>
                                <button type="button" className="btn-ghost" onClick={() => updateQty(item.key, item.qty - 1)}>−</button>
                                <span>{item.qty}</span>
                                <button type="button" className="btn-ghost" onClick={() => updateQty(item.key, item.qty + 1)}>+</button>
                            </div>
                            <p className={styles.lineTotal}>{formatPrice(item.price * item.qty)}</p>
                            <button type="button" className="btn btn-ghost" onClick={() => removeItem(item.key)} aria-label="Remove">×</button>
                        </li>
                    ))}
                </ul>

                <aside className={`card ${styles.summary}`}>
                    <h2>Order Summary</h2>
                    <div className={styles.row}>
                        <span>Subtotal</span>
                        <span>{formatPrice(subtotal)}</span>
                    </div>
                    <p className={styles.note}>Tax & shipping calculated at checkout</p>
                    <Link href="/checkout" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        Proceed to Checkout
                    </Link>
                    <Link href="/shop" className="btn btn-secondary" style={{ width: '100%', marginTop: '0.5rem' }}>
                        Continue Shopping
                    </Link>
                </aside>
            </div>
        </div>
    );
}
