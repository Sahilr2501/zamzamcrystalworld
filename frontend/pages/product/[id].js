import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { api, formatPrice, productImage } from '../../lib/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const productDetailStyles = {
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
        gridTemplateColumns: '1fr 1fr',
        gap: '3rem',
        marginBottom: '3rem',
    },
    gallery: {
        background: '#ffffff',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid #E7E1B1',
        boxShadow: '0 4px 12px rgba(48, 109, 41, 0.08)',
    },
    mainImage: {
        width: '100%',
        height: 'auto',
        display: 'block',
    },
    info: {
        background: '#ffffff',
        borderRadius: '20px',
        padding: '1.5rem',
        border: '1px solid #E7E1B1',
        boxShadow: '0 4px 12px rgba(48, 109, 41, 0.08)',
    },
    category: {
        color: '#306D29',
        fontSize: '0.875rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '0.5rem',
    },
    productName: {
        fontSize: '2rem',
        fontWeight: 700,
        color: '#0D530E',
        marginBottom: '0.5rem',
    },
    rating: {
        color: '#306D29',
        fontSize: '0.875rem',
        marginBottom: '1rem',
    },
    price: {
        fontSize: '1.75rem',
        fontWeight: 700,
        color: '#306D29',
        marginBottom: '0.5rem',
    },
    mrp: {
        color: '#94a3b8',
        fontSize: '0.875rem',
        textDecoration: 'line-through',
        marginBottom: '1rem',
    },
    desc: {
        color: '#306D29',
        lineHeight: 1.6,
        marginBottom: '1.5rem',
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
    select: {
        width: '100%',
        padding: '0.75rem 1rem',
        background: '#FBF5DD',
        border: '1px solid #E7E1B1',
        borderRadius: '12px',
        fontSize: '0.875rem',
        color: '#0D530E',
        cursor: 'pointer',
        outline: 'none',
    },
    actions: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginTop: '1.5rem',
        marginBottom: '1rem',
    },
    qtyInput: {
        width: '80px',
        padding: '0.75rem',
        background: '#FBF5DD',
        border: '1px solid #E7E1B1',
        borderRadius: '12px',
        fontSize: '0.875rem',
        color: '#0D530E',
        textAlign: 'center',
        outline: 'none',
    },
    btnPrimary: {
        background: '#306D29',
        color: '#FBF5DD',
        padding: '0.75rem 1.5rem',
        borderRadius: '12px',
        fontWeight: 600,
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.875rem',
        transition: 'all 0.2s ease',
    },
    btnSecondary: {
        background: 'transparent',
        color: '#306D29',
        padding: '0.75rem 1.5rem',
        borderRadius: '12px',
        fontWeight: 600,
        border: '2px solid #306D29',
        cursor: 'pointer',
        fontSize: '0.875rem',
        transition: 'all 0.2s ease',
        textDecoration: 'none',
        display: 'inline-block',
    },
    btnDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
    },
    flash: {
        padding: '0.5rem 1rem',
        background: '#dcfce7',
        border: '1px solid #bbf7d0',
        borderRadius: '12px',
        color: '#166534',
        fontSize: '0.875rem',
        marginBottom: '0.5rem',
    },
    stock: {
        color: '#306D29',
        fontSize: '0.875rem',
    },
    reviews: {
        background: '#ffffff',
        borderRadius: '20px',
        padding: '1.5rem',
        border: '1px solid #E7E1B1',
        marginTop: '2rem',
    },
    reviewsTitle: {
        fontSize: '1.5rem',
        fontWeight: 700,
        color: '#0D530E',
        marginBottom: '1rem',
        paddingBottom: '0.5rem',
        borderBottom: '2px solid #E7E1B1',
    },
    reviewList: {
        listStyle: 'none',
        padding: 0,
        marginBottom: '2rem',
    },
    reviewItem: {
        background: '#FBF5DD',
        padding: '1rem',
        borderRadius: '12px',
        marginBottom: '0.75rem',
        border: '1px solid #E7E1B1',
    },
    reviewName: {
        fontWeight: 600,
        color: '#0D530E',
    },
    reviewRating: {
        color: '#306D29',
        fontSize: '0.875rem',
    },
    reviewComment: {
        margin: '0.5rem 0 0',
        color: '#306D29',
    },
    reviewForm: {
        marginTop: '1.5rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid #E7E1B1',
    },
    reviewFormTitle: {
        fontSize: '1.125rem',
        fontWeight: 600,
        color: '#0D530E',
        marginBottom: '1rem',
    },
    textarea: {
        width: '100%',
        padding: '0.75rem 1rem',
        background: '#FBF5DD',
        border: '1px solid #E7E1B1',
        borderRadius: '12px',
        fontSize: '0.875rem',
        color: '#0D530E',
        outline: 'none',
        resize: 'vertical',
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
};

// Add animations and hover styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .product-select:focus, .product-input:focus, .product-textarea:focus {
      border-color: #306D29 !important;
      box-shadow: 0 0 0 3px rgba(48, 109, 41, 0.1) !important;
      background: #ffffff !important;
    }
    
    .product-btn-primary:hover:not(:disabled) {
      background: #0D530E !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(48, 109, 41, 0.3);
    }
    
    .product-btn-secondary:hover {
      background: rgba(48, 109, 41, 0.1);
      transform: translateY(-2px);
      border-color: #0D530E;
      color: #0D530E;
    }
    
    @media (max-width: 768px) {
      .product-grid {
        grid-template-columns: 1fr !important;
        gap: 1.5rem !important;
      }
      .product-name {
        font-size: 1.5rem !important;
      }
      .product-price {
        font-size: 1.5rem !important;
      }
    }
  `;
    document.head.appendChild(styleSheet);
}

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

    if (loading) {
        return (
            <div style={productDetailStyles.pageWrapper}>
                <div style={productDetailStyles.spinnerContainer}>
                    <div style={productDetailStyles.spinner} />
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div style={productDetailStyles.pageWrapper}>
                <div style={productDetailStyles.page}>
                    <div style={productDetailStyles.emptyState}>
                        <p style={productDetailStyles.emptyStateText}>Product not found.</p>
                        <Link href="/shop" className="product-btn-primary" style={productDetailStyles.btnPrimary}>
                            Back to Shop
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const variant = product.variants[variantIdx] || product.variants[0];

    const handleAdd = () => {
        if (!variant) return;
        addItem(product, variant, qty);
        setMessage('✓ Added to cart');
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
            setMessage('✓ Review submitted');
            setTimeout(() => setMessage(''), 2000);
        } catch (err) {
            setMessage(err.message);
        }
    };

    return (
        <div style={productDetailStyles.pageWrapper}>
            <div className="product-page" style={productDetailStyles.page}>
                <div className="product-grid" style={productDetailStyles.grid}>
                    <div style={productDetailStyles.gallery}>
                        <img
                            src={productImage(product)}
                            alt={product.name}
                            style={productDetailStyles.mainImage}
                        />
                    </div>

                    <div style={productDetailStyles.info}>
                        <p style={productDetailStyles.category}>
                            {product.category} · {product.brand}
                        </p>
                        <h1 className="product-name" style={productDetailStyles.productName}>
                            {product.name}
                        </h1>
                        {product.rating > 0 && (
                            <p style={productDetailStyles.rating}>
                                ★ {product.rating.toFixed(1)} ({product.numReviews} reviews)
                            </p>
                        )}
                        <p className="product-price" style={productDetailStyles.price}>
                            {formatPrice(variant?.price)}
                        </p>
                        {variant && variant.mrp > variant.price && (
                            <p style={productDetailStyles.mrp}>
                                MRP {formatPrice(variant.mrp)}
                            </p>
                        )}
                        <p style={productDetailStyles.desc}>{product.description}</p>

                        {product.variants.length > 1 && (
                            <div style={productDetailStyles.formGroup}>
                                <label style={productDetailStyles.label}>Select Variant</label>
                                <select
                                    className="product-select"
                                    style={productDetailStyles.select}
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

                        <div style={productDetailStyles.actions}>
                            <input
                                type="number"
                                className="product-input"
                                style={productDetailStyles.qtyInput}
                                min={1}
                                max={variant?.countInStock || 1}
                                value={qty}
                                onChange={(e) => setQty(Number(e.target.value))}
                            />
                            <button
                                type="button"
                                className="product-btn-primary"
                                style={{
                                    ...productDetailStyles.btnPrimary,
                                    ...(!variant?.countInStock ? productDetailStyles.btnDisabled : {})
                                }}
                                onClick={handleAdd}
                                disabled={!variant?.countInStock}
                            >
                                {variant?.countInStock ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                            <Link href="/cart" className="product-btn-secondary" style={productDetailStyles.btnSecondary}>
                                View Cart
                            </Link>
                        </div>

                        {message && <div style={productDetailStyles.flash}>{message}</div>}

                        <p style={productDetailStyles.stock}>
                            {variant?.countInStock || 0} in stock
                        </p>
                    </div>
                </div>

                <section style={productDetailStyles.reviews}>
                    <h2 style={productDetailStyles.reviewsTitle}>Customer Reviews</h2>

                    {product.reviews?.length > 0 ? (
                        <ul style={productDetailStyles.reviewList}>
                            {product.reviews.map((r) => (
                                <li key={r._id} style={productDetailStyles.reviewItem}>
                                    <strong style={productDetailStyles.reviewName}>{r.name}</strong>
                                    <span style={productDetailStyles.reviewRating}> · ★ {r.rating}</span>
                                    <p style={productDetailStyles.reviewComment}>{r.comment}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ color: '#306D29' }}>No reviews yet. Be the first to review!</p>
                    )}

                    {user && (
                        <form onSubmit={submitReview} style={productDetailStyles.reviewForm}>
                            <h3 style={productDetailStyles.reviewFormTitle}>Write a Review</h3>
                            <div style={productDetailStyles.formGroup}>
                                <label style={productDetailStyles.label}>Rating</label>
                                <select
                                    className="product-select"
                                    style={{ ...productDetailStyles.select, width: '120px' }}
                                    value={review.rating}
                                    onChange={(e) => setReview({ ...review, rating: e.target.value })}
                                >
                                    {[5, 4, 3, 2, 1].map((n) => (
                                        <option key={n} value={n}>{n} stars</option>
                                    ))}
                                </select>
                            </div>
                            <div style={productDetailStyles.formGroup}>
                                <label style={productDetailStyles.label}>Comment</label>
                                <textarea
                                    className="product-textarea"
                                    style={productDetailStyles.textarea}
                                    rows={3}
                                    required
                                    value={review.comment}
                                    onChange={(e) => setReview({ ...review, comment: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="product-btn-primary" style={productDetailStyles.btnPrimary}>
                                Submit Review
                            </button>
                        </form>
                    )}
                </section>
            </div>
        </div>
    );
}