import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import styles from './Navbar.module.css';

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
        // Re-enable body scroll when menu closes
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
        // Prevent/enable body scroll when menu is open/closed
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

    return (
        <>
            <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
                <div className={`container ${styles.inner}`}>
                    {/* Logo */}
                    <Link href="/" className={styles.logo}>
                        <span className={styles.logoIcon}>✨</span>
                        <span className={styles.logoText}>
                            Zamzam <span className={styles.logoHighlight}>Crystal</span> World
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className={styles.nav}>
                        <Link
                            href="/shop"
                            className={router.pathname.startsWith('/shop') ? styles.active : ''}
                        >
                            Shop
                        </Link>
                        {user ? (
                            <>
                                <Link href="/account" className={router.pathname === '/account' ? styles.active : ''}>
                                    Account
                                </Link>
                                <Link href="/orders" className={router.pathname === '/orders' ? styles.active : ''}>
                                    Orders
                                </Link>
                                {isAdmin && (
                                    <Link href="/admin" className={router.pathname.startsWith('/admin') ? styles.active : ''}>
                                        Admin
                                    </Link>
                                )}
                                <button className={styles.logoutBtn} onClick={handleLogout}>
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <Link href="/login" className={styles.signInBtn}>
                                Sign in
                            </Link>
                        )}
                        <Link href="/cart" className={styles.cartLink}>
                            <span className={styles.cartIcon}>🛒</span>
                            <span className={styles.cartText}>Cart</span>
                            {itemsCount > 0 && (
                                <span className={styles.cartBadge}>
                                    {itemsCount > 99 ? '99+' : itemsCount}
                                </span>
                            )}
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className={`${styles.menuButton} ${isMenuOpen ? styles.menuOpen : ''}`}
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                        aria-expanded={isMenuOpen}
                    >
                        <span className={styles.menuIcon} />
                    </button>
                </div>
            </header>

            {/* Mobile Navigation Overlay */}
            <div className={`${styles.mobileOverlay} ${isMenuOpen ? styles.mobileOverlayOpen : ''}`}>
                <div className={styles.mobileNav}>
                    <div className={styles.mobileNavHeader}>
                        {user && (
                            <div className={styles.mobileUserInfo}>
                                <div className={styles.mobileAvatar}>
                                    {user.email?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <p className={styles.mobileUserName}>
                                        {user.email?.split('@')[0] || 'User'}
                                    </p>
                                    <p className={styles.mobileUserEmail}>{user.email}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.mobileNavLinks}>
                        <Link href="/shop" onClick={() => setIsMenuOpen(false)}>
                            <span className={styles.navIcon}>🛍️</span>
                            Shop
                        </Link>
                        {user ? (
                            <>
                                <Link href="/account" onClick={() => setIsMenuOpen(false)}>
                                    <span className={styles.navIcon}>👤</span>
                                    Account
                                </Link>
                                <Link href="/orders" onClick={() => setIsMenuOpen(false)}>
                                    <span className={styles.navIcon}>📦</span>
                                    Orders
                                </Link>
                                {isAdmin && (
                                    <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                                        <span className={styles.navIcon}>⚙️</span>
                                        Admin Dashboard
                                    </Link>
                                )}
                                <button onClick={handleLogout} className={styles.mobileLogoutBtn}>
                                    <span className={styles.navIcon}>🚪</span>
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <Link href="/login" className={styles.mobileSignInBtn} onClick={() => setIsMenuOpen(false)}>
                                <span className={styles.navIcon}>🔐</span>
                                Sign in
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Overlay backdrop for mobile */}
            {isMenuOpen && (
                <div className={styles.backdrop} onClick={toggleMenu} />
            )}
        </>
    );
}