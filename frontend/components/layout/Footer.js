import Link from 'next/link';
import { useState } from 'react';

const footerStyles = {
    // Main Footer Container
    footer: {
        marginTop: 'auto',
        background: '#ffffff',
        color: '#334155',
        position: 'relative',
        borderTop: '1px solid #eef2ff',
    },
    container: {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '3rem 2rem 1.5rem',
    },
    mainContent: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '3rem',
        marginBottom: '3rem',
        paddingBottom: '2rem',
        borderBottom: '1px solid #e2e8f0',
    },

    // Brand Section
    brandSection: {
        maxWidth: '320px',
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1rem',
    },
    logoIcon: {
        fontSize: '2rem',
        animation: 'float 3s ease-in-out infinite',
    },
    brand: {
        fontFamily: 'Georgia, serif',
        fontSize: '1.5rem',
        fontWeight: 600,
        margin: 0,
        background: 'linear-gradient(135deg, #b87333 0%, #8B5E3C 100%)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
    },
    tagline: {
        margin: '0.5rem 0 1.5rem',
        color: '#64748b',
        fontSize: '0.9rem',
        lineHeight: 1.5,
    },
    socialLinks: {
        display: 'flex',
        gap: '1rem',
    },
    socialIcon: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        background: '#f8fafc',
        borderRadius: '50%',
        fontSize: '1.25rem',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        color: '#b87333',
        border: '1px solid #e2e8f0',
    },

    // Links Section
    linksSection: {
        minWidth: '200px',
    },
    sectionTitle: {
        fontSize: '1.125rem',
        fontWeight: 600,
        margin: '0 0 1.25rem',
        color: '#1e293b',
        position: 'relative',
        display: 'inline-block',
    },
    sectionTitleUnderline: {
        position: 'absolute',
        bottom: '-6px',
        left: 0,
        width: '40px',
        height: '2px',
        background: 'linear-gradient(90deg, #b87333, #d49454)',
        borderRadius: '2px',
    },
    linkGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '0.75rem',
    },
    link: {
        color: '#64748b',
        textDecoration: 'none',
        fontSize: '0.875rem',
        transition: 'all 0.2s ease',
        display: 'inline-block',
    },

    // Newsletter Section
    newsletterSection: {
        minWidth: '280px',
    },
    newsletterText: {
        color: '#64748b',
        fontSize: '0.875rem',
        margin: '0 0 1rem',
        lineHeight: 1.5,
    },
    newsletterForm: {
        margin: '1rem 0',
    },
    inputGroup: {
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap',
    },
    emailInput: {
        flex: 1,
        padding: '0.75rem 1rem',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        color: '#1e293b',
        fontSize: '0.875rem',
        transition: 'all 0.2s ease',
        outline: 'none',
    },
    subscribeBtn: {
        padding: '0.75rem 1.5rem',
        background: 'linear-gradient(135deg, #b87333 0%, #9a5a1f 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '0.875rem',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    successMessage: {
        marginTop: '0.75rem',
        padding: '0.5rem 1rem',
        background: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: '8px',
        color: '#166534',
        fontSize: '0.875rem',
        animation: 'slideIn 0.3s ease-out',
    },

    // Footer Bottom
    footerBottom: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        fontSize: '0.8rem',
        color: '#94a3b8',
    },
    paymentMethods: {
        display: 'flex',
        gap: '1rem',
    },
    paymentItem: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        fontSize: '0.75rem',
        color: '#64748b',
    },
    copy: {
        margin: 0,
        textAlign: 'center',
        color: '#94a3b8',
    },
    legalLinks: {
        display: 'flex',
        gap: '1.5rem',
    },
    legalLink: {
        color: '#94a3b8',
        textDecoration: 'none',
        transition: 'color 0.2s ease',
    },
};

// Add animations and hover effects
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
    
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    /* Hover Effects */
    .footer-link:hover {
      color: #b87333 !important;
      transform: translateX(4px);
    }
    
    .social-icon:hover {
      background: #b87333;
      color: white !important;
      transform: translateY(-3px);
      border-color: #b87333;
    }
    
    .subscribe-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(184, 115, 51, 0.3);
      background: linear-gradient(135deg, #9a5a1f 0%, #7a4515 100%);
    }
    
    .email-input:focus {
      border-color: #b87333;
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(184, 115, 51, 0.1);
    }
    
    .legal-link:hover {
      color: #b87333;
    }
    
    /* Responsive Styles */
    @media (max-width: 768px) {
      .brand-section {
        max-width: 100%;
        text-align: center;
      }
      .logo {
        justify-content: center;
      }
      .social-links {
        justify-content: center;
      }
      .section-title {
        text-align: center;
        display: block;
      }
      .section-title-underline {
        left: 50%;
        transform: translateX(-50%);
      }
      .link-grid {
        text-align: center;
      }
      .newsletter-section {
        text-align: center;
      }
      .footer-bottom {
        flex-direction: column;
        text-align: center;
      }
      .payment-methods {
        justify-content: center;
      }
      .legal-links {
        justify-content: center;
        flex-wrap: wrap;
      }
      .main-content {
        gap: 2rem;
        margin-bottom: 2rem;
      }
      .container {
        padding: 2rem 1.5rem 1rem;
      }
    }
    
    @media (max-width: 480px) {
      .input-group {
        flex-direction: column;
      }
      .subscribe-btn {
        width: 100%;
      }
      .link-grid {
        grid-template-columns: 1fr;
      }
    }
  `;
    document.head.appendChild(styleSheet);
}

export default function Footer() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            console.log('Subscribed:', email);
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    return (
        <footer style={footerStyles.footer}>
            <div style={footerStyles.container} className="container">
                {/* Main Footer Content */}
                <div style={footerStyles.mainContent} className="main-content">
                    {/* Brand Section */}
                    <div style={footerStyles.brandSection} className="brand-section">
                        <div style={footerStyles.logo} className="logo">
                            <span style={footerStyles.logoIcon}>✨</span>
                            <span style={footerStyles.brand}>Zamzam Crystal World</span>
                        </div>
                        <p style={footerStyles.tagline}>
                            Authentic crystals & healing stones for your journey of wellness and positive energy.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div style={footerStyles.linksSection}>
                        <h3 style={footerStyles.sectionTitle} className="section-title">
                            Quick Links
                            <span style={footerStyles.sectionTitleUnderline} className="section-title-underline" />
                        </h3>
                        <div style={footerStyles.linkGrid} className="link-grid">
                            <Link href="/shop" style={footerStyles.link} className="footer-link">Shop All</Link>
                            <Link href="/new-arrivals" style={footerStyles.link} className="footer-link">New Arrivals</Link>
                            <Link href="/best-sellers" style={footerStyles.link} className="footer-link">Best Sellers</Link>
                            <Link href="/about" style={footerStyles.link} className="footer-link">About Us</Link>
                            <Link href="/account" style={footerStyles.link} className="footer-link">My Account</Link>
                            <Link href="/cart" style={footerStyles.link} className="footer-link">Shopping Cart</Link>
                            <Link href="/wishlist" style={footerStyles.link} className="footer-link">Wishlist</Link>
                            <Link href="/contact" style={footerStyles.link} className="footer-link">Contact Us</Link>
                        </div>
                    </div>

                    {/* Newsletter Section */}
                    <div style={footerStyles.newsletterSection} className="newsletter-section">
                        <h3 style={footerStyles.sectionTitle} className="section-title">
                            Newsletter
                            <span style={footerStyles.sectionTitleUnderline} className="section-title-underline" />
                        </h3>
                        <p style={footerStyles.newsletterText}>
                            Subscribe to receive updates, access to exclusive deals, and crystal healing tips.
                        </p>
                        <form onSubmit={handleSubscribe} style={footerStyles.newsletterForm}>
                            <div style={footerStyles.inputGroup} className="input-group">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={footerStyles.emailInput}
                                    className="email-input"
                                />
                                <button type="submit" style={footerStyles.subscribeBtn} className="subscribe-btn">
                                    Subscribe
                                </button>
                            </div>
                        </form>
                        {subscribed && (
                            <div style={footerStyles.successMessage}>
                                ✓ Thanks for subscribing! Check your inbox for special offers.
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Bottom */}
                <div style={footerStyles.footerBottom} className="footer-bottom">
                    <div style={footerStyles.paymentMethods} className="payment-methods">
                        <span style={footerStyles.paymentItem}>💳 Visa</span>
                        <span style={footerStyles.paymentItem}>💳 PayPal</span>
                        <span style={footerStyles.paymentItem}>💳 Google Pay</span>
                    </div>
                    <p style={footerStyles.copy}>
                        © {new Date().getFullYear()} Zamzam Crystal World. All rights reserved.
                    </p>
                    <div style={footerStyles.legalLinks} className="legal-links">
                        <Link href="/privacy" style={footerStyles.legalLink} className="legal-link">Privacy Policy</Link>
                        <Link href="/terms" style={footerStyles.legalLink} className="legal-link">Terms of Service</Link>
                        <Link href="/shipping" style={footerStyles.legalLink} className="legal-link">Shipping Info</Link>
                        <Link href="/returns" style={footerStyles.legalLink} className="legal-link">Returns</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}