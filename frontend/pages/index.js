import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../lib/api';
import ProductCard from '../components/ProductCard';

const styles = {
    // Layout
    container: {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 2rem',
    },

    // Hero Section
    hero: {
        background: '#FBF5DD',
        padding: '6rem 0 4rem 0',
        position: 'relative',
        overflow: 'hidden',
    },
    heroGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '3rem',
        alignItems: 'center',
    },
    heroContent: {
        maxWidth: '100%',
    },
    badge: {
        display: 'inline-block',
        background: '#306D29',
        color: '#FBF5DD',
        padding: '0.35rem 1rem',
        borderRadius: '50px',
        fontSize: '0.75rem',
        fontWeight: 600,
        marginBottom: '1.5rem',
        letterSpacing: '1px',
        textTransform: 'uppercase',
    },
    title: {
        fontSize: '3.8rem',
        fontWeight: 800,
        lineHeight: 1.2,
        marginBottom: '1.5rem',
        color: '#0D530E',
    },
    highlight: {
        color: '#306D29',
        position: 'relative',
        display: 'inline-block',
    },
    subtitle: {
        fontSize: '1.125rem',
        lineHeight: 1.7,
        color: '#306D29',
        marginBottom: '2rem',
        maxWidth: '90%',
    },
    buttonGroup: {
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
    },
    btnPrimary: {
        background: '#306D29',
        color: '#FBF5DD',
        padding: '1rem 2rem',
        borderRadius: '12px',
        fontWeight: 600,
        textDecoration: 'none',
        display: 'inline-block',
        transition: 'all 0.3s ease',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1rem',
        boxShadow: '0 4px 12px rgba(48, 109, 41, 0.25)',
    },
    btnSecondary: {
        background: 'transparent',
        color: '#306D29',
        padding: '1rem 2rem',
        borderRadius: '12px',
        fontWeight: 600,
        textDecoration: 'none',
        display: 'inline-block',
        border: '2px solid #306D29',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        fontSize: '1rem',
    },
    bannerWrapper: {
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(48, 109, 41, 0.15)',
    },
    bannerImage: {
        width: '100%',
        height: 'auto',
        display: 'block',
        objectFit: 'cover',
    },

    // Trust Badges
    trustBar: {
        background: '#E7E1B1',
        padding: '1rem 0',
        borderBottom: '1px solid #306D29',
    },
    trustGrid: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
    },
    trustItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        color: '#0D530E',
        fontSize: '0.875rem',
        fontWeight: 500,
    },
    trustIcon: {
        fontSize: '1.25rem',
    },

    // Features Section
    features: {
        padding: '5rem 0',
        background: '#FBF5DD',
    },
    sectionHeader: {
        textAlign: 'center',
        marginBottom: '3rem',
    },
    sectionTitle: {
        fontSize: '2.5rem',
        fontWeight: 700,
        color: '#0D530E',
        marginBottom: '1rem',
    },
    sectionSubtitle: {
        fontSize: '1.125rem',
        color: '#306D29',
        maxWidth: '600px',
        margin: '0 auto',
    },
    featureGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginTop: '2rem',
    },
    featureCard: {
        textAlign: 'center',
        padding: '2.5rem 2rem',
        background: '#ffffff',
        borderRadius: '20px',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 8px rgba(48, 109, 41, 0.08)',
        border: '1px solid #E7E1B1',
    },
    featureIcon: {
        width: '80px',
        height: '80px',
        background: 'rgba(48, 109, 41, 0.1)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.5rem',
        fontSize: '2.2rem',
        color: '#306D29',
    },
    featureTitle: {
        fontSize: '1.35rem',
        fontWeight: 600,
        color: '#0D530E',
        marginBottom: '0.75rem',
    },
    featureDescription: {
        color: '#306D29',
        lineHeight: 1.6,
    },

    // Featured Products Section
    products: {
        padding: '5rem 0',
        background: '#E7E1B1',
    },
    productsHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2.5rem',
        flexWrap: 'wrap',
        gap: '1rem',
    },
    productsTitle: {
        fontSize: '2rem',
        fontWeight: 700,
        color: '#0D530E',
    },
    viewAllLink: {
        color: '#306D29',
        textDecoration: 'none',
        fontWeight: 600,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        transition: 'all 0.3s ease',
        padding: '0.5rem 1rem',
        borderRadius: '8px',
    },
    gridProducts: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '2rem',
    },

    // Loading State
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

    // Empty State
    emptyState: {
        textAlign: 'center',
        padding: '4rem',
        background: '#FBF5DD',
        borderRadius: '20px',
        border: '1px solid #E7E1B1',
    },
    emptyStateText: {
        color: '#306D29',
        marginBottom: '1.5rem',
        fontSize: '1.125rem',
    },

    // CTA Section
    ctaSection: {
        background: '#0D530E',
        padding: '4rem 0',
        textAlign: 'center',
        color: '#FBF5DD',
    },
    ctaTitle: {
        fontSize: '2rem',
        fontWeight: 700,
        marginBottom: '1rem',
    },
    ctaSubtitle: {
        fontSize: '1rem',
        marginBottom: '2rem',
        opacity: 0.9,
        maxWidth: '500px',
        margin: '0 auto 2rem',
        color: '#E7E1B1',
    },
    ctaButton: {
        background: '#306D29',
        color: '#FBF5DD',
        padding: '1rem 2.5rem',
        borderRadius: '50px',
        textDecoration: 'none',
        fontWeight: 600,
        display: 'inline-block',
        transition: 'all 0.3s ease',
        border: '1px solid #E7E1B1',
    },
};

// Add animations
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .feature-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 30px -12px rgba(48, 109, 41, 0.15);
      border-color: #306D29;
    }
    
    .btn-primary:hover {
      background: #0D530E;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(48, 109, 41, 0.3);
    }
    
    .btn-secondary:hover {
      background: rgba(48, 109, 41, 0.1);
      transform: translateY(-2px);
      border-color: #0D530E;
      color: #0D530E;
    }
    
    .view-all-link:hover {
      gap: 0.75rem;
      background: rgba(48, 109, 41, 0.1);
      color: #0D530E;
    }
    
    .cta-button:hover {
      background: #0D530E;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
      border-color: #FBF5DD;
    }
    
    @media (max-width: 968px) {
      .hero-grid {
        grid-template-columns: 1fr !important;
        text-align: center !important;
      }
      .hero-content {
        text-align: center !important;
      }
      .subtitle {
        margin-left: auto !important;
        margin-right: auto !important;
      }
      .button-group {
        justify-content: center !important;
      }
      .hero-title {
        font-size: 2.5rem !important;
      }
      .section-title {
        font-size: 2rem !important;
      }
      .trust-grid {
        justify-content: center !important;
      }
      .container {
        padding: 0 1rem !important;
      }
    }
  `;
    document.head.appendChild(styleSheet);
}

export default function Home() {
    const [featured, setFeatured] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getProducts({ featured: 'true', limit: 4 })
            .then((data) => setFeatured(data.products || []))
            .catch(() => setFeatured([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <section style={styles.hero}>
                <div style={styles.container}>
                    <div style={styles.heroGrid}>
                        <div style={styles.heroContent}>
                            <span style={styles.badge}>Since 2015</span>
                            <h1 style={styles.title}>
                                Discover the Power of{' '}
                                <span style={styles.highlight}>Authentic Crystals</span>
                            </h1>
                            <p style={styles.subtitle}>
                                Curated healing stones and crystal collections from Zamzam Crystal World —
                                crafted for wellness, meditation, and positive energy.
                            </p>
                            <div style={styles.buttonGroup}>
                                <Link href="/shop" style={styles.btnPrimary} className="btn-primary">
                                    Shop Now →
                                </Link>
                                <Link href="/about" style={styles.btnSecondary} className="btn-secondary">
                                    Learn More
                                </Link>
                            </div>
                        </div>
                        <div style={styles.bannerWrapper}>
                            <img
                                style={styles.bannerImage}
                                src="/images/banner1.jpeg"
                                alt="Zamzam Crystal World banner"
                                width="600"
                                height="500"
                                loading="eager"
                                decoding="async"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Bar */}
            <div style={styles.trustBar}>
                <div style={styles.container}>
                    <div style={styles.trustGrid}>
                        <div style={styles.trustItem}>
                            <span style={styles.trustIcon}>⭐</span>
                            <span>4.9/5 Customer Rating</span>
                        </div>
                        <div style={styles.trustItem}>
                            <span style={styles.trustIcon}>🚚</span>
                            <span>Free Shipping on ₹999+</span>
                        </div>
                        <div style={styles.trustItem}>
                            <span style={styles.trustIcon}>💎</span>
                            <span>100% Authentic Crystals</span>
                        </div>
                        <div style={styles.trustItem}>
                            <span style={styles.trustIcon}>🔄</span>
                            <span>7-Day Easy Returns</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section style={styles.features}>
                <div style={styles.container}>
                    <div style={styles.sectionHeader}>
                        <h2 style={styles.sectionTitle}>Why Choose Us?</h2>
                        <p style={styles.sectionSubtitle}>
                            Experience the difference with our premium quality crystals
                        </p>
                    </div>
                    <div style={styles.featureGrid}>
                        <div className="feature-card" style={styles.featureCard}>
                            <div style={styles.featureIcon}>🔍</div>
                            <h3 style={styles.featureTitle}>Authentic Quality</h3>
                            <p style={styles.featureDescription}>
                                Hand-selected natural crystals sourced with care from trusted mines worldwide.
                            </p>
                        </div>
                        <div className="feature-card" style={styles.featureCard}>
                            <div style={styles.featureIcon}>💳</div>
                            <h3 style={styles.featureTitle}>Secure Checkout</h3>
                            <p style={styles.featureDescription}>
                                Safe payments with encryption and reliable delivery across India with tracking.
                            </p>
                        </div>
                        <div className="feature-card" style={styles.featureCard}>
                            <div style={styles.featureIcon}>🎓</div>
                            <h3 style={styles.featureTitle}>Expert Guidance</h3>
                            <p style={styles.featureDescription}>
                                Detailed descriptions and expert advice to help you choose the perfect crystal.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section style={styles.products}>
                <div style={styles.container}>
                    <div style={styles.productsHeader}>
                        <h2 style={styles.productsTitle}>✨ Featured Crystals</h2>
                        <Link href="/shop" style={styles.viewAllLink} className="view-all-link">
                            View All Collection →
                        </Link>
                    </div>

                    {loading ? (
                        <div style={styles.spinnerContainer}>
                            <div style={styles.spinner} />
                        </div>
                    ) : featured.length > 0 ? (
                        <div style={styles.gridProducts}>
                            {featured.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div style={styles.emptyState}>
                            <p style={styles.emptyStateText}>🌟 New crystals arriving soon. Stay tuned!</p>
                            <Link href="/shop" style={styles.btnPrimary} className="btn-primary">
                                Browse All Crystals
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section style={styles.ctaSection}>
                <div style={styles.container}>
                    <h2 style={styles.ctaTitle}>Ready to Begin Your Crystal Journey?</h2>
                    <p style={styles.ctaSubtitle}>
                        Join thousands of happy customers who found balance and energy with our authentic crystals.
                    </p>
                    <Link href="/shop" style={styles.ctaButton} className="cta-button">
                        Explore Collection →
                    </Link>
                </div>
            </section>
        </div>
    );
}