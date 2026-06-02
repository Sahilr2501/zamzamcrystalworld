import Link from 'next/link';
import { formatPrice, productMinPrice, productImage } from '../lib/api';

const productCardStyles = {
    card: {
        display: 'block',
        background: '#ffffff',
        border: '1px solid #E7E1B1',
        borderRadius: '16px',
        overflow: 'hidden',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
    },
    imageWrap: {
        position: 'relative',
        aspectRatio: '1',
        background: '#FBF5DD',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.4s ease',
    },
    featured: {
        position: 'absolute',
        top: '0.75rem',
        left: '0.75rem',
        padding: '0.25rem 0.75rem',
        fontSize: '0.7rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        background: '#306D29',
        color: '#FBF5DD',
        borderRadius: '20px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    body: {
        padding: '1rem 1.25rem 1.25rem',
    },
    category: {
        margin: '0 0 0.25rem',
        fontSize: '0.7rem',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: '#306D29',
        fontWeight: 500,
    },
    name: {
        fontFamily: 'Playfair Display, Georgia, serif',
        fontSize: '1.1rem',
        fontWeight: 600,
        margin: '0 0 0.25rem',
        color: '#0D530E',
        lineHeight: 1.3,
    },
    brand: {
        margin: '0 0 0.5rem',
        fontSize: '0.8rem',
        color: '#306D29',
    },
    price: {
        margin: 0,
        fontWeight: 700,
        color: '#306D29',
        fontSize: '1.1rem',
    },
    from: {
        fontWeight: 400,
        fontSize: '0.7rem',
        color: '#306D29',
        marginLeft: '0.25rem',
        opacity: 0.8,
    },
};

// Add hover animations and global styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
    .product-card {
      transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    }
    
    .product-card:hover {
      transform: translateY(-4px);
      border-color: #306D29;
      box-shadow: 0 12px 24px -8px rgba(48, 109, 41, 0.15);
    }
    
    .product-card:hover .product-image {
      transform: scale(1.05);
    }
    
    .product-image {
      transition: transform 0.4s ease;
    }
    
    @media (max-width: 640px) {
      .product-body {
        padding: 0.75rem 1rem 1rem !important;
      }
      .product-name {
        font-size: 1rem !important;
      }
      .product-price {
        font-size: 1rem !important;
      }
      .featured-badge {
        top: 0.5rem !important;
        left: 0.5rem !important;
        padding: 0.2rem 0.6rem !important;
        font-size: 0.65rem !important;
      }
    }
    
    @media (prefers-reduced-motion: reduce) {
      .product-card:hover {
        transform: none !important;
      }
      .product-card:hover .product-image {
        transform: none !important;
      }
      .product-image {
        transition: none !important;
      }
    }
  `;
    document.head.appendChild(styleSheet);
}

export default function ProductCard({ product }) {
    const price = productMinPrice(product);

    return (
        <Link
            href={`/product/${product._id}`}
            className="product-card"
            style={productCardStyles.card}
        >
            <div className="product-image-wrap" style={productCardStyles.imageWrap}>
                <img
                    src={productImage(product)}
                    alt={product.name}
                    className="product-image"
                    style={productCardStyles.image}
                />
                {product.isFeatured && (
                    <span className="featured-badge" style={productCardStyles.featured}>
                        Featured
                    </span>
                )}
            </div>
            <div className="product-body" style={productCardStyles.body}>
                <p className="product-category" style={productCardStyles.category}>
                    {product.category}
                </p>
                <h3 className="product-name" style={productCardStyles.name}>
                    {product.name}
                </h3>
                <p className="product-brand" style={productCardStyles.brand}>
                    {product.brand}
                </p>
                <p className="product-price" style={productCardStyles.price}>
                    {formatPrice(price)}
                    {product.variants?.length > 1 && (
                        <span style={productCardStyles.from}> onwards</span>
                    )}
                </p>
            </div>
        </Link>
    );
}