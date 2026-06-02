import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { formatPrice, resolveImageUrl } from '../lib/api';

const cartStyles = {
    pageWrapper: {
        background: '#FBF5DD',
        minHeight: 'calc(100vh - 200px)',
    },
    page: {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '2rem 1.5rem 4rem',
    },
    layout: {
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: '2rem',
    },
    list: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    },
    item: {
        display: 'grid',
        gridTemplateColumns: '100px 1fr auto 120px 40px',
        alignItems: 'center',
        gap: '1rem',
        background: '#ffffff',
        padding: '1rem',
        borderRadius: '16px',
        marginBottom: '1rem',
        border: '1px solid #E7E1B1',
        transition: 'all 0.2s ease',
    },
    thumb: {
        width: '80px',
        height: '80px',
        objectFit: 'cover',
        borderRadius: '12px',
        border: '1px solid #E7E1B1',
    },
    details: {
        flex: 1,
    },
    detailsLink: {
        color: '#0D530E',
        textDecoration: 'none',
        fontWeight: 600,
        fontSize: '1rem',
        transition: 'color 0.2s ease',
    },
    meta: {
        color: '#306D29',
        fontSize: '0.75rem',
        margin: '0.25rem 0',
    },
    price: {
        color: '#306D29',
        fontWeight: 600,
        fontSize: '0.875rem',
    },
    qty: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: '#FBF5DD',
        padding: '0.25rem',
        borderRadius: '12px',
        border: '1px solid #E7E1B1',
    },
    qtyButton: {
        background: 'transparent',
        border: 'none',
        fontSize: '1.25rem',
        cursor: 'pointer',
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        transition: 'all 0.2s ease',
        color: '#306D29',
    },
    qtyValue: {
        minWidth: '32px',
        textAlign: 'center',
        fontWeight: 500,
        color: '#0D530E',
    },
    lineTotal: {
        fontWeight: 700,
        color: '#0D530E',
        fontSize: '1rem',
    },
    removeBtn: {
        background: 'transparent',
        border: 'none',
        fontSize: '1.5rem',
        cursor: 'pointer',
        color: '#dc2626',
        transition: 'all 0.2s ease',
        width: '32px',
        height: '32px',
        borderRadius: '8px',
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
        padding: '0.75rem 0',
        fontSize: '1rem',
        color: '#306D29',
    },
    note: {
        fontSize: '0.75rem',
        color: '#306D29',
        marginTop: '0.5rem',
        paddingTop: '0.5rem',
        borderTop: '1px solid #E7E1B1',
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
        textDecoration: 'none',
        display: 'inline-block',
        textAlign: 'center',
    },
    btnSecondary: {
        width: '100%',
        background: 'transparent',
        color: '#306D29',
        padding: '0.875rem 1.5rem',
        borderRadius: '12px',
        fontWeight: 600,
        border: '2px solid #306D29',
        cursor: 'pointer',
        fontSize: '0.875rem',
        transition: 'all 0.2s ease',
        textDecoration: 'none',
        display: 'inline-block',
        textAlign: 'center',
        marginTop: '0.5rem',
    },
    emptyState: {
        textAlign: 'center',
        padding: '4rem',
        background: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #E7E1B1',
    },
    emptyStateTitle: {
        fontSize: '1.5rem',
        fontWeight: 700,
        color: '#0D530E',
        marginBottom: '0.5rem',
    },
    emptyStateText: {
        color: '#306D29',
        marginBottom: '1rem',
    },
};

// Add hover styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
    .cart-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(48, 109, 41, 0.1);
    }
    
    .cart-details-link:hover {
      color: #306D29 !important;
      text-decoration: underline !important;
    }
    
    .cart-qty-btn:hover {
      background: #E7E1B1;
    }
    
    .cart-remove-btn:hover {
      background: #fee2e2;
      transform: scale(1.1);
    }
    
    .cart-btn-primary:hover {
      background: #0D530E !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(48, 109, 41, 0.3);
    }
    
    .cart-btn-secondary:hover {
      background: rgba(48, 109, 41, 0.1);
      transform: translateY(-2px);
      border-color: #0D530E;
      color: #0D530E;
    }
    
    @media (max-width: 768px) {
      .cart-layout {
        grid-template-columns: 1fr !important;
      }
      .cart-item {
        grid-template-columns: 80px 1fr !important;
        gap: 0.75rem !important;
      }
      .cart-qty {
        grid-column: 2 / 3 !important;
        justify-self: start !important;
      }
      .cart-line-total {
        grid-column: 2 / 3 !important;
      }
      .cart-remove-btn {
        position: absolute !important;
        top: 0.5rem !important;
        right: 0.5rem !important;
      }
      .cart-item {
        position: relative !important;
      }
    }
    
    @media (max-width: 480px) {
      .cart-item {
        grid-template-columns: 70px 1fr !important;
      }
      .cart-thumb {
        width: 60px !important;
        height: 60px !important;
      }
    }
  `;
    document.head.appendChild(styleSheet);
}

export default function Cart() {
    const { items, updateQty, removeItem, subtotal, itemsCount } = useCart();

    if (!itemsCount) {
        return (
            <div style={cartStyles.pageWrapper}>
                <div style={cartStyles.page}>
                    <div style={cartStyles.emptyState}>
                        <h1 style={cartStyles.emptyStateTitle}>Your cart is empty</h1>
                        <p style={cartStyles.emptyStateText}>Discover beautiful crystals in our shop.</p>
                        <Link href="/shop" className="cart-btn-primary" style={cartStyles.btnPrimary}>
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={cartStyles.pageWrapper}>
            <div style={cartStyles.page}>
                <header className="page-header">
                    <h1 style={{ color: '#0D530E' }}>Shopping Cart</h1>
                    <p style={{ color: '#306D29' }}>{itemsCount} item{itemsCount !== 1 ? 's' : ''}</p>
                </header>

                <div className="cart-layout" style={cartStyles.layout}>
                    <ul style={cartStyles.list}>
                        {items.map((item) => (
                            <li key={item.key} className="cart-item" style={cartStyles.item}>
                                <img
                                    src={resolveImageUrl(item.image)}
                                    alt={item.name}
                                    className="cart-thumb"
                                    style={cartStyles.thumb}
                                />
                                <div style={cartStyles.details}>
                                    <Link
                                        href={`/product/${item.product}`}
                                        className="cart-details-link"
                                        style={cartStyles.detailsLink}
                                    >
                                        {item.name}
                                    </Link>
                                    <p style={cartStyles.meta}>SKU: {item.sku}</p>
                                    <p style={cartStyles.price}>{formatPrice(item.price)}</p>
                                </div>
                                <div className="cart-qty" style={cartStyles.qty}>
                                    <button
                                        type="button"
                                        className="cart-qty-btn"
                                        style={cartStyles.qtyButton}
                                        onClick={() => updateQty(item.key, item.qty - 1)}
                                    >
                                        −
                                    </button>
                                    <span style={cartStyles.qtyValue}>{item.qty}</span>
                                    <button
                                        type="button"
                                        className="cart-qty-btn"
                                        style={cartStyles.qtyButton}
                                        onClick={() => updateQty(item.key, item.qty + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                                <p className="cart-line-total" style={cartStyles.lineTotal}>
                                    {formatPrice(item.price * item.qty)}
                                </p>
                                <button
                                    type="button"
                                    className="cart-remove-btn"
                                    style={cartStyles.removeBtn}
                                    onClick={() => removeItem(item.key)}
                                    aria-label="Remove"
                                >
                                    ×
                                </button>
                            </li>
                        ))}
                    </ul>

                    <aside className="cart-summary" style={cartStyles.summary}>
                        <h2 style={cartStyles.summaryTitle}>Order Summary</h2>
                        <div style={cartStyles.row}>
                            <span>Subtotal</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>
                        <p style={cartStyles.note}>Tax & shipping calculated at checkout</p>
                        <Link href="/checkout" className="cart-btn-primary" style={cartStyles.btnPrimary}>
                            Proceed to Checkout
                        </Link>
                        <Link href="/shop" className="cart-btn-secondary" style={cartStyles.btnSecondary}>
                            Continue Shopping
                        </Link>
                    </aside>
                </div>
            </div>
        </div>
    );
}