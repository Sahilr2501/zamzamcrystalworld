import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

// All styles as a JavaScript object
const navbarStyles = {
    // Header Styles
    header: {
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease',
        width: '100%',
    },
    headerScrolled: {
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        background: 'rgba(255, 255, 255, 0.98)',
    },
    inner: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0 2rem',
        width: '100%',
    },

    // Logo Styles
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontFamily: 'Georgia, serif',
        fontSize: '1.35rem',
        fontWeight: 600,
        textDecoration: 'none',
        transition: 'transform 0.2s ease',
        flexShrink: 0,
    },
    logoIcon: {
        fontSize: '1.75rem',
        animation: 'float 3s ease-in-out infinite',
    },
    logoText: {
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        whiteSpace: 'nowrap',
    },
    logoHighlight: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
    },

    // Desktop Navigation
    nav: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
    },
    navLink: {
        color: '#475569',
        fontSize: '0.9rem',
        fontWeight: 500,
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        position: 'relative',
        padding: '0.5rem 0',
        whiteSpace: 'nowrap',
    },
    signInBtn: {
        padding: '0.5rem 1rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '10px',
        textDecoration: 'none',
        fontSize: '0.9rem',
        fontWeight: 500,
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
    },
    logoutBtn: {
        padding: '0.5rem 1rem',
        background: 'transparent',
        color: '#ef4444',
        border: '1px solid #ef4444',
        borderRadius: '10px',
        fontSize: '0.9rem',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
    },
    cartLink: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        background: 'white',
        whiteSpace: 'nowrap',
        textDecoration: 'none',
    },
    cartIcon: {
        fontSize: '1.1rem',
    },
    cartText: {
        color: '#475569',
    },
    cartBadge: {
        position: 'absolute',
        top: '-8px',
        right: '-8px',
        minWidth: '20px',
        height: '20px',
        padding: '0 6px',
        fontSize: '0.7rem',
        fontWeight: 700,
        lineHeight: '20px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        color: 'white',
        borderRadius: '999px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },

    // Mobile Menu Button
    menuButton: {
        display: 'none',
        width: '44px',
        height: '44px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        zIndex: 1001,
        position: 'relative',
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuIcon: {
        position: 'relative',
        display: 'inline-block',
        width: '24px',
        height: '2px',
        background: '#475569',
        transition: 'all 0.2s ease',
    },

    // Mobile Overlay
    mobileOverlay: {
        position: 'fixed',
        top: 0,
        right: '-100%',
        width: '100%',
        maxWidth: '400px',
        height: '100vh',
        background: 'white',
        boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.1)',
        transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 1002,
        overflowY: 'auto',
        visibility: 'hidden',
    },
    mobileOverlayOpen: {
        right: 0,
        visibility: 'visible',
    },
    backdrop: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1001,
    },
    mobileNav: {
        padding: '80px 1.5rem 2rem',
        minHeight: '100%',
    },
    mobileNavHeader: {
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid #e2e8f0',
    },
    mobileUserInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    mobileAvatar: {
        width: '48px',
        height: '48px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 600,
        fontSize: '1.25rem',
        flexShrink: 0,
    },
    mobileUserName: {
        margin: '0 0 0.25rem',
        fontWeight: 600,
        color: '#1e293b',
        fontSize: '1rem',
    },
    mobileUserEmail: {
        margin: 0,
        fontSize: '0.75rem',
        color: '#64748b',
        wordBreak: 'break-all',
    },
    mobileNavLinks: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    mobileNavItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.875rem 1rem',
        borderRadius: '12px',
        textDecoration: 'none',
        color: '#475569',
        fontWeight: 500,
        transition: 'all 0.2s ease',
        fontSize: '1rem',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
    },
    mobileSignInBtn: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
    },
    mobileLogoutBtn: {
        color: '#ef4444',
        marginTop: '1rem',
    },
    navIcon: {
        fontSize: '1.25rem',
        width: '28px',
    },
};

// Add animations and global styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }
    
    @keyframes bounce {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    /* Desktop hover effects */
    .nav-link {
      position: relative;
    }
    
    .nav-link::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #667eea, #764ba2);
      transition: width 0.3s ease;
    }
    
    .nav-link:hover::before,
    .nav-link-active::before {
      width: 100%;
    }
    
    .nav-link:hover {
      color: #667eea !important;
    }
    
    .sign-in-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      color: white !important;
    }
    
    .logout-btn:hover {
      background: #ef4444;
      color: white !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }
    
    .cart-link:hover {
      border-color: #667eea;
      background: linear-gradient(135deg, #667eea10 0%, #764ba210 100%);
    }
    
    .logo:hover {
      transform: scale(1.02);
    }
    
    /* Mobile hover effects */
    .mobile-nav-item:active {
      transform: scale(0.98);
    }
    
    .mobile-nav-item:hover {
      background: #f1f5f9;
      transform: translateX(4px);
    }
    
    .backdrop {
      animation: fadeIn 0.3s ease;
    }
    
    /* Mobile menu icon animation */
    .menu-icon::before,
    .menu-icon::after {
      content: '';
      position: absolute;
      width: 24px;
      height: 2px;
      background: #475569;
      transition: all 0.2s ease;
    }
    
    .menu-icon::before {
      top: -8px;
    }
    
    .menu-icon::after {
      bottom: -8px;
    }
    
    .menu-open .menu-icon {
      background: transparent;
    }
    
    .menu-open .menu-icon::before {
      transform: rotate(45deg);
      top: 0;
    }
    
    .menu-open .menu-icon::after {
      transform: rotate(-45deg);
      bottom: 0;
    }
    
    /* Cart badge animation */
    .cart-badge {
      animation: bounce 0.5s ease;
    }
    
    /* Responsive Styles */
    @media (max-width: 1024px) {
      .nav-links {
        gap: 1rem;
      }
      .inner-container {
        padding: 0 1.5rem;
      }
    }
    
    @media (max-width: 768px) {
      .inner-container {
        padding: 0 1rem;
        height: 60px;
      }
      .desktop-nav {
        display: none;
      }
      .menu-button {
        display: flex !important;
      }
      .logo-text {
        font-size: 0.9rem;
      }
      .logo-icon {
        font-size: 1.25rem;
      }
      .logo {
        gap: 0.35rem;
      }
    }
    
    @media (max-width: 480px) {
      .inner-container {
        height: 56px;
        padding: 0 0.75rem;
      }
      .logo-text {
        font-size: 0.8rem;
      }
      .logo-icon {
        font-size: 1.1rem;
      }
      .mobile-overlay {
        max-width: 100%;
      }
      .mobile-nav {
        padding: 70px 1rem 1.5rem;
      }
      .mobile-nav-item {
        padding: 0.75rem 0.875rem;
        font-size: 0.95rem;
      }
      .nav-icon {
        font-size: 1.1rem;
        width: 24px;
      }
      .mobile-avatar {
        width: 40px;
        height: 40px;
        font-size: 1rem;
      }
      .mobile-user-name {
        font-size: 0.9rem;
      }
      .mobile-user-email {
        font-size: 0.7rem;
      }
    }
    
    @media (max-width: 768px) and (orientation: landscape) {
      .mobile-overlay {
        overflow-y: auto;
      }
      .mobile-nav {
        padding: 70px 1rem 1rem;
      }
      .mobile-nav-links {
        gap: 0.25rem;
      }
      .mobile-nav-item {
        padding: 0.6rem 0.875rem;
      }
    }
    
    /* Dark Mode Support */
    @media (prefers-color-scheme: dark) {
      .header {
        background: rgba(15, 23, 42, 0.95);
        border-bottom-color: rgba(255, 255, 255, 0.08);
      }
      .header-scrolled {
        background: rgba(15, 23, 42, 0.98);
      }
      .logo-text {
        background: linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%);
        -webkit-background-clip: text;
        background-clip: text;
      }
      .nav-link {
        color: #94a3b8;
      }
      .cart-link {
        background: #1e293b;
        border-color: #334155;
      }
      .cart-text {
        color: #cbd5e1;
      }
      .mobile-overlay {
        background: #0f172a;
      }
      .mobile-user-name {
        color: #e2e8f0;
      }
      .mobile-user-email {
        color: #94a3b8;
      }
      .mobile-nav-item {
        color: #cbd5e1;
      }
      .mobile-nav-item:hover {
        background: #1e293b;
      }
      .mobile-nav-header {
        border-bottom-color: #334155;
      }
    }
    
    /* Reduced Motion Preference */
    @media (prefers-reduced-motion: reduce) {
      .logo-icon,
      .cart-badge,
      .backdrop,
      .mobile-overlay,
      .menu-icon,
      .menu-icon::before,
      .menu-icon::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
      .logo:hover,
      .sign-in-btn:hover,
      .logout-btn:hover,
      .cart-link:hover,
      .mobile-nav-item:hover {
        transform: none !important;
      }
    }
  `;
    document.head.appendChild(styleSheet);
}

export default function Navbar() {
    const { user, logout, isAdmin } = useAuth();
    const { itemsCount } = useCart();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
        document.body.style.overflow = 'unset';
    }, [router.pathname]);

    const handleLogout = async () => {
        await logout();
        router.push('/');
        setIsMenuOpen(false);
        document.body.style.overflow = 'unset';
    };

    const toggleMenu = () => {
        const newMenuState = !isMenuOpen;
        setIsMenuOpen(newMenuState);
        if (newMenuState) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const headerStyle = {
        ...navbarStyles.header,
        ...(isScrolled ? navbarStyles.headerScrolled : {}),
    };

    return (
        <>
            <header className="header" style={headerStyle}>
                <div className="inner-container" style={navbarStyles.inner}>
                    {/* Logo */}
                    <Link href="/" className="logo" style={navbarStyles.logo}>
                        <span className="logo-icon" style={navbarStyles.logoIcon}>✨</span>
                        <span className="logo-text" style={navbarStyles.logoText}>
                            Zamzam <span style={navbarStyles.logoHighlight}>Crystal</span> World
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="desktop-nav" style={navbarStyles.nav}>
                        <Link
                            href="/shop"
                            className={`nav-link ${router.pathname.startsWith('/shop') ? 'nav-link-active' : ''}`}
                            style={navbarStyles.navLink}
                        >
                            Shop
                        </Link>
                        {user ? (
                            <>
                                <Link
                                    href="/account"
                                    className={`nav-link ${router.pathname === '/account' ? 'nav-link-active' : ''}`}
                                    style={navbarStyles.navLink}
                                >
                                    Account
                                </Link>
                                <Link
                                    href="/orders"
                                    className={`nav-link ${router.pathname === '/orders' ? 'nav-link-active' : ''}`}
                                    style={navbarStyles.navLink}
                                >
                                    Orders
                                </Link>
                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        className={`nav-link ${router.pathname.startsWith('/admin') ? 'nav-link-active' : ''}`}
                                        style={navbarStyles.navLink}
                                    >
                                        Admin
                                    </Link>
                                )}
                                <button className="logout-btn" style={navbarStyles.logoutBtn} onClick={handleLogout}>
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <Link href="/login" className="sign-in-btn" style={navbarStyles.signInBtn}>
                                Sign in
                            </Link>
                        )}
                        <Link href="/cart" className="cart-link" style={navbarStyles.cartLink}>
                            <span style={navbarStyles.cartIcon}>🛒</span>
                            <span style={navbarStyles.cartText}>Cart</span>
                            {itemsCount > 0 && (
                                <span className="cart-badge" style={navbarStyles.cartBadge}>
                                    {itemsCount > 99 ? '99+' : itemsCount}
                                </span>
                            )}
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className={`menu-button ${isMenuOpen ? 'menu-open' : ''}`}
                        style={navbarStyles.menuButton}
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                        aria-expanded={isMenuOpen}
                    >
                        <span className="menu-icon" style={navbarStyles.menuIcon} />
                    </button>
                </div>
            </header>

            {/* Mobile Navigation Overlay */}
            <div
                className="mobile-overlay"
                style={{
                    ...navbarStyles.mobileOverlay,
                    ...(isMenuOpen ? navbarStyles.mobileOverlayOpen : {}),
                }}
            >
                <div style={navbarStyles.mobileNav}>
                    <div style={navbarStyles.mobileNavHeader}>
                        {user && (
                            <div style={navbarStyles.mobileUserInfo}>
                                <div style={navbarStyles.mobileAvatar}>
                                    {user.email?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <p style={navbarStyles.mobileUserName}>
                                        {user.email?.split('@')[0] || 'User'}
                                    </p>
                                    <p style={navbarStyles.mobileUserEmail}>{user.email}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={navbarStyles.mobileNavLinks}>
                        <Link
                            href="/shop"
                            className="mobile-nav-item"
                            style={navbarStyles.mobileNavItem}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <span style={navbarStyles.navIcon}>🛍️</span>
                            Shop
                        </Link>
                        {user ? (
                            <>
                                <Link
                                    href="/account"
                                    className="mobile-nav-item"
                                    style={navbarStyles.mobileNavItem}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <span style={navbarStyles.navIcon}>👤</span>
                                    Account
                                </Link>
                                <Link
                                    href="/orders"
                                    className="mobile-nav-item"
                                    style={navbarStyles.mobileNavItem}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <span style={navbarStyles.navIcon}>📦</span>
                                    Orders
                                </Link>
                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        className="mobile-nav-item"
                                        style={navbarStyles.mobileNavItem}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <span style={navbarStyles.navIcon}>⚙️</span>
                                        Admin Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="mobile-nav-item"
                                    style={{ ...navbarStyles.mobileNavItem, ...navbarStyles.mobileLogoutBtn }}
                                >
                                    <span style={navbarStyles.navIcon}>🚪</span>
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="mobile-nav-item"
                                style={{ ...navbarStyles.mobileNavItem, ...navbarStyles.mobileSignInBtn }}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <span style={navbarStyles.navIcon}>🔐</span>
                                Sign in
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Overlay backdrop for mobile */}
            {isMenuOpen && (
                <div className="backdrop" style={navbarStyles.backdrop} onClick={toggleMenu} />
            )}
        </>
    );
}