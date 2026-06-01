import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './AdminLayout.module.css';

const NAV = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/products', label: 'Products', icon: '📦' },
    { href: '/admin/orders', label: 'Orders', icon: '🛍️' },
    { href: '/admin/coupons', label: 'Coupons', icon: '🏷️' },
];

export default function AdminLayout({ children, title }) {
    const { user, loading, isAdmin, logout } = useAuth();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!loading && (!user || !isAdmin)) {
            router.replace('/login?redirect=/admin');
        }
    }, [user, loading, isAdmin, router]);

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    if (loading || !user || !isAdmin) {
        return (
            <div className={styles.guard}>
                <div className={styles.spinner} />
            </div>
        );
    }

    return (
        <div className={styles.shell}>
            {/* Mobile Menu Button */}
            <button
                className={styles.menuButton}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
            >
                <span className={styles.menuIcon} />
            </button>

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.sidebarHeader}>
                    <Link href="/" className={styles.back}>
                        ← Back to Store
                    </Link>
                    <div className={styles.adminBadge}>
                        <span className={styles.badge}>Admin</span>
                    </div>
                </div>

                <div className={styles.userInfo}>
                    <div className={styles.userAvatar}>
                        {user.email?.[0]?.toUpperCase() || 'A'}
                    </div>
                    <div className={styles.userDetails}>
                        <p className={styles.userEmail}>{user.email}</p>
                        <p className={styles.userRole}>Administrator</p>
                    </div>
                </div>

                <nav className={styles.nav}>
                    {NAV.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={
                                router.pathname === item.href ||
                                    (item.href !== '/admin' && router.pathname.startsWith(item.href))
                                    ? styles.active
                                    : ''
                            }
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className={styles.navIcon}>{item.icon}</span>
                            <span className={styles.navLabel}>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <button onClick={handleLogout} className={styles.logoutButton}>
                    <span>🚪</span>
                    <span>Logout</span>
                </button>
            </aside>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className={styles.overlay}
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className={styles.content}>
                <div className={styles.contentHeader}>
                    {title && (
                        <div className={styles.pageTitle}>
                            <h1>{title}</h1>
                        </div>
                    )}
                    <div className={styles.headerActions}>
                        <div className={styles.searchBar}>
                            <span className={styles.searchIcon}>🔍</span>
                            <input
                                type="text"
                                placeholder="Search..."
                                className={styles.searchInput}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.contentInner}>
                    {children}
                </div>
            </main>
        </div>
    );
}