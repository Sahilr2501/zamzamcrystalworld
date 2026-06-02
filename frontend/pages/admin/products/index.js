import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '../../../components/layout/AdminLayout';
import { api, formatPrice, productMinPrice } from '../../../lib/api';

const styles = {
    header: {
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
    },
    btnPrimary: {
        background: '#306D29',
        color: '#FBF5DD',
        padding: '0.75rem 1.5rem',
        borderRadius: '12px',
        fontWeight: 600,
        textDecoration: 'none',
        display: 'inline-block',
        transition: 'all 0.2s ease',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.875rem',
    },
    btnDanger: {
        background: 'transparent',
        color: '#dc2626',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.875rem',
        padding: '0.25rem 0.5rem',
        borderRadius: '6px',
        transition: 'all 0.2s ease',
    },
    editLink: {
        color: '#306D29',
        textDecoration: 'none',
        marginRight: '0.75rem',
        fontSize: '0.875rem',
        transition: 'color 0.2s ease',
    },
    tableWrapper: {
        overflowX: 'auto',
        background: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #E7E1B1',
        boxShadow: '0 2px 8px rgba(48, 109, 41, 0.05)',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '600px',
    },
    th: {
        padding: '1rem',
        textAlign: 'left',
        color: '#0D530E',
        fontWeight: 600,
        fontSize: '0.875rem',
        borderBottom: '2px solid #E7E1B1',
        background: '#FBF5DD',
    },
    td: {
        padding: '1rem',
        color: '#306D29',
        fontSize: '0.875rem',
        borderBottom: '1px solid #E7E1B1',
    },
    badge: {
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        background: '#306D29',
        color: '#FBF5DD',
        borderRadius: '20px',
        fontSize: '0.7rem',
        fontWeight: 600,
    },
    emptyState: {
        textAlign: 'center',
        padding: '3rem',
        color: '#306D29',
    },
    loadingContainer: {
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
    totalCount: {
        fontSize: '0.875rem',
        color: '#306D29',
    },
};

if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .admin-products-btn-primary:hover {
      background: #0D530E !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(48, 109, 41, 0.3);
    }
    
    .admin-products-edit-link:hover {
      color: #0D530E !important;
      text-decoration: underline !important;
    }
    
    .admin-products-delete-btn:hover {
      background: rgba(220, 38, 38, 0.1);
      transform: scale(1.05);
    }
    
    @media (max-width: 768px) {
      .admin-products-header {
        flex-direction: column;
        align-items: stretch;
      }
      .admin-products-btn-primary {
        text-align: center;
      }
      .admin-products-table th, 
      .admin-products-table td {
        padding: 0.75rem !important;
      }
    }
  `;
    document.head.appendChild(styleSheet);
}

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);

    const load = () => {
        setLoading(true);
        api.getProducts({ limit: 100 })
            .then((d) => setProducts(d.products || []))
            .catch((error) => {
                console.error('Error loading products:', error);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        load();
    }, []);

    const remove = async (id) => {
        if (!confirm('⚠️ Are you sure you want to delete this product? This action cannot be undone.')) return;

        setDeleting(id);
        try {
            await api.deleteProduct(id);
            load();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product. Please try again.');
        } finally {
            setDeleting(null);
        }
    };

    if (loading) {
        return (
            <AdminLayout title="Products">
                <div style={styles.loadingContainer}>
                    <div style={styles.spinner} />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Products">
            <div className="admin-products-header" style={styles.header}>
                <Link
                    href="/admin/products/new"
                    className="admin-products-btn-primary"
                    style={styles.btnPrimary}
                >
                    + Add New Product
                </Link>

                <div style={styles.totalCount}>
                    Total: {products.length} product{products.length !== 1 ? 's' : ''}
                </div>
            </div>

            <div style={styles.tableWrapper}>
                <table className="admin-products-table" style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Product Name</th>
                            <th style={styles.th}>Category</th>
                            <th style={styles.th}>Price</th>
                            <th style={styles.th}>Featured</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p._id}>
                                <td style={styles.td}>
                                    <strong style={{ color: '#0D530E' }}>{p.name}</strong>
                                </td>
                                <td style={styles.td}>{p.category}</td>
                                <td style={styles.td}>
                                    <span style={{ fontWeight: 600, color: '#0D530E' }}>
                                        {formatPrice(productMinPrice(p))}
                                    </span>
                                    {p.variants?.length > 1 && (
                                        <span style={{ fontSize: '0.7rem', color: '#306D29', marginLeft: '0.25rem' }}>
                                            +
                                        </span>
                                    )}
                                </td>
                                <td style={styles.td}>
                                    {p.isFeatured ? (
                                        <span style={styles.badge}>⭐ Featured</span>
                                    ) : (
                                        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>—</span>
                                    )}
                                </td>
                                <td style={{ ...styles.td, whiteSpace: 'nowrap' }}>
                                    <Link
                                        href={`/admin/products/${p._id}`}
                                        className="admin-products-edit-link"
                                        style={styles.editLink}
                                    >
                                        ✏️ Edit
                                    </Link>
                                    <button
                                        type="button"
                                        className="admin-products-delete-btn"
                                        style={styles.btnDanger}
                                        onClick={() => remove(p._id)}
                                        disabled={deleting === p._id}
                                    >
                                        {deleting === p._id ? '...' : '🗑️ Delete'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {!products.length && (
                    <div style={styles.emptyState}>
                        <p>📦 No products yet.</p>
                        <Link
                            href="/admin/products/new"
                            style={{ ...styles.btnPrimary, marginTop: '1rem', display: 'inline-block' }}
                        >
                            Create your first product
                        </Link>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}