import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { api, formatPrice, productImage } from '../../lib/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/ProductDetail.module.css';

export default function ProductDetail() {
    const router = useRouter();
    const { id } = router.query;
    const { addItem } = useCart();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [variantIdx, setVariantIdx] = useState(0);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [review, setReview] = useState({ rating: 5, comment: '' });

    useEffect(() => {
        if (!id) return;
        api.getProduct(id)
            .then(setProduct)
            .catch(() => setProduct(null))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="spinner" />;
    if (!product) {
        return (
            <div className="container empty-state">
                <p>Product not found.</p>
                <Link href="/shop" className="btn btn-primary">Back to shop</Link>
            </div>
        );
    }

    const variant = product.variants[variantIdx] || product.variants[0];

    const handleAdd = () => {
        if (!variant) return;
        addItem(product, variant, qty);
        setMessage('Added to cart');
        setTimeout(() => setMessage(''), 2000);
    };

    const submitReview = async (e) => {
        e.preventDefault();
        if (!user) {
            router.push(`/login?redirect=/product/${id}`);
            return;
        }
        try {
            await api.addReview(id, review);
            const updated = await api.getProduct(id);
            setProduct(updated);
            setReview({ rating: 5, comment: '' });
            setMessage('Review submitted');
        } catch (err) {
            setMessage(err.message);
        }
    };

    return (
        <div className={`container ${styles.page}`}>
            <div className={styles.grid}>
                <div className={styles.gallery}>
                    <img src={productImage(product)} alt={product.name} className={styles.mainImage} />
                </div>
                <div className={styles.info}>
                    <p className={styles.category}>{product.category} · {product.brand}</p>
                    <h1>{product.name}</h1>
                    {product.rating > 0 && (
                        <p className={styles.rating}>★ {product.rating.toFixed(1)} ({product.numReviews} reviews)</p>
                    )}
                    <p className={styles.price}>{formatPrice(variant?.price)}</p>
                    {variant && variant.mrp > variant.price && (
                        <p className={styles.mrp}>MRP {formatPrice(variant.mrp)}</p>
                    )}
                    <p className={styles.desc}>{product.description}</p>

                    {product.variants.length > 1 && (
                        <div className="form-group">
                            <label className="label">Variant</label>
                            <select
                                className="select"
                                value={variantIdx}
                                onChange={(e) => setVariantIdx(Number(e.target.value))}
                            >
                                {product.variants.map((v, i) => (
                                    <option key={v.sku} value={i}>
                                        {[v.attributes?.size, v.attributes?.color].filter(Boolean).join(' · ') || v.sku}
                                        {' — '}{formatPrice(v.price)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className={styles.actions}>
                        <input
                            type="number"
                            className="input"
                            style={{ width: 72 }}
                            min={1}
                            max={variant?.countInStock || 1}
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                        />
                        <button type="button" className="btn btn-primary" onClick={handleAdd} disabled={!variant?.countInStock}>
                            {variant?.countInStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                        <Link href="/cart" className="btn btn-secondary">View Cart</Link>
                    </div>
                    {message && <p className={styles.flash}>{message}</p>}
                    <p className={styles.stock}>{variant?.countInStock || 0} in stock</p>
                </div>
            </div>

            <section className={styles.reviews}>
                <h2>Customer Reviews</h2>
                {product.reviews?.length > 0 ? (
                    <ul className={styles.reviewList}>
                        {product.reviews.map((r) => (
                            <li key={r._id} className="card" style={{ padding: '1rem', marginBottom: '0.75rem' }}>
                                <strong>{r.name}</strong> · ★ {r.rating}
                                <p style={{ margin: '0.5rem 0 0', color: 'var(--text-muted)' }}>{r.comment}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={{ color: 'var(--text-muted)' }}>No reviews yet.</p>
                )}

                {user && (
                    <form onSubmit={submitReview} className={styles.reviewForm}>
                        <h3>Write a review</h3>
                        <div className="form-group">
                            <label className="label">Rating</label>
                            <select className="select" style={{ width: 120 }} value={review.rating} onChange={(e) => setReview({ ...review, rating: e.target.value })}>
                                {[5, 4, 3, 2, 1].map((n) => (
                                    <option key={n} value={n}>{n} stars</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="label">Comment</label>
                            <textarea className="textarea" rows={3} required value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} />
                        </div>
                        <button type="submit" className="btn btn-primary btn-sm">Submit Review</button>
                    </form>
                )}
            </section>
        </div>
    );
}
