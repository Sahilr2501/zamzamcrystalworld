import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const NAV = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/products', label: 'Products', icon: '📦' },
    { href: '/admin/orders', label: 'Orders', icon: '🛍️' },
    { href: '/admin/coupons', label: 'Coupons', icon: '🏷️' },
];

const adminLayoutStyles = {
    shell: {
        display: 'flex',
        minHeight: '100vh',
        background: '#FBF5DD',
        position: 'relative',
    },
    // Sidebar Styles
    sidebar: {
        width: '280px',
        background: '#ffffff',
        boxShadow: '2px 0 12px rgba(48, 109, 41, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto',
        transition: 'transform 0.3s ease',
        zIndex: 1000,
        borderRight: '1px solid #E7E1B1',
    },
    sidebarHeader: {
        padding: '1.5rem 1.5rem 1rem',
        borderBottom: '1px solid #E7E1B1',
    },
    back: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.875rem',
        color: '#306D29',
        textDecoration: 'none',
        transition: 'color 0.2s ease',
        padding: '0.5rem 0',
    },
    adminBadge: {
        marginTop: '1rem',
    },
    badge: {
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        background: '#306D29',
        color: '#FBF5DD',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.5px',
    },
    // User Info
    userInfo: {
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        borderBottom: '1px solid #E7E1B1',
    },
    userAvatar: {
        width: '48px',
        height: '48px',
        background: '#306D29',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FBF5DD',
        fontWeight: 600,
        fontSize: '1.25rem',
        boxShadow: '0 2px 8px rgba(48, 109, 41, 0.3)',
    },
    userDetails: {
        flex: 1,
    },
    userEmail: {
        fontSize: '0.875rem',
        fontWeight: 500,
        color: '#0D530E',
        margin: '0 0 0.25rem',
    },
    userRole: {
        fontSize: '0.75rem',
        color: '#306D29',
        margin: 0,
    },
    // Navigation
    nav: {
        flex: 1,
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    navLink: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        borderRadius: '12px',
        color: '#306D29',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        fontSize: '0.875rem',
        fontWeight: 500,
    },
    navLinkActive: {
        background: 'rgba(48, 109, 41, 0.1)',
        color: '#0D530E',
        borderRight: '3px solid #306D29',
    },
    navIcon: {
        fontSize: '1.25rem',
    },
    navLabel: {
        flex: 1,
    },
    // Logout Button
    logoutButton: {
        margin: '1rem 1.5rem 1.5rem',
        padding: '0.75rem 1rem',
        background: '#dc2626',
        color: '#ffffff',
        border: 'none',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.875rem',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    // Main Content
    content: {
        flex: 1,
        marginLeft: '280px',
        minHeight: '100vh',
        background: '#FBF5DD',
    },
    contentHeader: {
        background: '#ffffff',
        padding: '1.25rem 2rem',
        borderBottom: '1px solid #E7E1B1',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    pageTitle: {
        fontSize: '1.5rem',
        fontWeight: 600,
        color: '#0D530E',
        margin: 0,
    },
    // Search Bar
    headerActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    searchBar: {
        position: 'relative',
    },
    searchIcon: {
        position: 'absolute',
        left: '0.75rem',
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: '1rem',
        opacity: 0.6,
    },
    searchInput: {
        padding: '0.5rem 0.75rem 0.5rem 2.25rem',
        border: '1px solid #E7E1B1',
        borderRadius: '10px',
        fontSize: '0.875rem',
        width: '240px',
        transition: 'all 0.2s ease',
        background: '#FBF5DD',
        color: '#0D530E',
        outline: 'none',
    },
    contentInner: {
        padding: '2rem',
    },
    // Mobile Menu Button
    menuButton: {
        display: 'none',
        position: 'fixed',
        top: '1rem',
        left: '1rem',
        zIndex: 1100,
        width: '44px',
        height: '44px',
        background: '#ffffff',
        border: '1px solid #E7E1B1',
        borderRadius: '12px',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuIcon: {
        position: 'relative',
        display: 'inline-block',
        width: '20px',
        height: '2px',
        background: '#306D29',
        transition: 'all 0.2s ease',
    },
    // Overlay
    overlay: {
        display: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 999,
    },
    // Guard/Spinner
    guard: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#FBF5DD',
    },
    spinner: {
        width: '48px',
        height: '48px',
        border: '3px solid #E7E1B1',
        borderRadius: '50%',
        borderTopColor: '#306D29',
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
    
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .admin-nav-link:hover {
      background: rgba(48, 109, 41, 0.08);
      transform: translateX(4px);
    }
    
    .admin-back:hover {
      color: #0D530E !important;
    }
    
    .admin-logout-btn:hover {
      background: #b91c1c !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
    }
    
    .admin-search-input:focus {
      border-color: #306D29;
      box-shadow: 0 0 0 3px rgba(48, 109, 41, 0.1);
      background: #ffffff;
      width: 280px;
    }
    
    .content-inner > * {
      animation: slideIn 0.4s ease-out;
    }
    
    /* Scrollbar Styling */
    .admin-sidebar::-webkit-scrollbar {
      width: 6px;
    }
    
    .admin-sidebar::-webkit-scrollbar-track {
      background: #E7E1B1;
    }
    
    .admin-sidebar::-webkit-scrollbar-thumb {
      background: #306D29;
      border-radius: 3px;
    }
    
    .admin-sidebar::-webkit-scrollbar-thumb:hover {
      background: #0D530E;
    }
    
    /* Mobile Responsive */
    @media (max-width: 768px) {
      .admin-menu-button {
        display: flex !important;
      }
      
      .admin-sidebar {
        transform: translateX(-100%);
      }
      
      .admin-sidebar-open {
        transform: translateX(0);
      }
      
      .admin-overlay {
        display: block !important;
      }
      
      .admin-content {
        margin-left: 0 !important;
        padding-top: 4rem;
      }
      
      .admin-content-header {
        flex-direction: column;
        align-items: stretch;
        padding: 1rem;
      }
      
      .admin-search-input {
        width: 100%;
      }
      
      .admin-search-input:focus {
        width: 100%;
      }
      
      .admin-content-inner {
        padding: 1rem;
      }
    }
    
    @media (max-width: 480px) {
      .admin-sidebar {
        width: 85% !important;
      }
      
      .admin-page-title {
        font-size: 1.25rem !important;
      }
    }
  `;
    document.head.appendChild(styleSheet);
}

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
            <div style={adminLayoutStyles.guard}>
                <div style={adminLayoutStyles.spinner} />
            </div>
        );
    }

    return (
        <div className="admin-shell" style={adminLayoutStyles.shell}>
            {/* Mobile Menu Button */}
            <button
                className="admin-menu-button"
                style={adminLayoutStyles.menuButton}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
            >
                <span className="admin-menu-icon" style={adminLayoutStyles.menuIcon}>
                    <span style={{ position: 'absolute', top: '-6px', left: 0, width: '20px', height: '2px', background: '#306D29' }} />
                    <span style={{ position: 'absolute', bottom: '-6px', left: 0, width: '20px', height: '2px', background: '#306D29' }} />
                </span>
            </button>

            {/* Sidebar */}
            <aside
                className={`admin-sidebar ${isMobileMenuOpen ? 'admin-sidebar-open' : ''}`}
                style={adminLayoutStyles.sidebar}
            >
                <div style={adminLayoutStyles.sidebarHeader}>
                    <Link href="/" className="admin-back" style={adminLayoutStyles.back}>
                        ← Back to Store
                    </Link>
                    <div style={adminLayoutStyles.adminBadge}>
                        <span style={adminLayoutStyles.badge}>Admin Panel</span>
                    </div>
                </div>

                <div style={adminLayoutStyles.userInfo}>
                    <div style={adminLayoutStyles.userAvatar}>
                        {user.email?.[0]?.toUpperCase() || 'A'}
                    </div>
                    <div style={adminLayoutStyles.userDetails}>
                        <p style={adminLayoutStyles.userEmail}>{user.email}</p>
                        <p style={adminLayoutStyles.userRole}>Administrator</p>
                    </div>
                </div>

                <nav style={adminLayoutStyles.nav}>
                    {NAV.map((item) => {
                        const isActive = router.pathname === item.href ||
                            (item.href !== '/admin' && router.pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="admin-nav-link"
                                style={{
                                    ...adminLayoutStyles.navLink,
                                    ...(isActive ? adminLayoutStyles.navLinkActive : {}),
                                }}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <span style={adminLayoutStyles.navIcon}>{item.icon}</span>
                                <span style={adminLayoutStyles.navLabel}>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <button
                    onClick={handleLogout}
                    className="admin-logout-btn"
                    style={adminLayoutStyles.logoutButton}
                >
                    <span>🚪</span>
                    <span>Logout</span>
                </button>
            </aside>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="admin-overlay"
                    style={adminLayoutStyles.overlay}
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="admin-content" style={adminLayoutStyles.content}>
                <div className="admin-content-header" style={adminLayoutStyles.contentHeader}>
                    {title && (
                        <div>
                            <h1 className="admin-page-title" style={adminLayoutStyles.pageTitle}>{title}</h1>
                        </div>
                    )}
                    <div style={adminLayoutStyles.headerActions}>
                        <div style={adminLayoutStyles.searchBar}>
                            <span style={adminLayoutStyles.searchIcon}>🔍</span>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="admin-search-input"
                                style={adminLayoutStyles.searchInput}
                            />
                        </div>
                    </div>
                </div>
                <div className="admin-content-inner" style={adminLayoutStyles.contentInner}>
                    {children}
                </div>
            </main>
        </div>
    );
}