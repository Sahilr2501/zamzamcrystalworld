import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '../lib/api';
import ProductCard from '../components/ProductCard';

const shopStyles = {
    pageWrapper: {
        background: '#f8fafc',
        minHeight: '100vh',
    },
    container: {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '2rem 1.5rem 4rem',
    },
    pageHeader: {
        textAlign: 'center',
        marginBottom: '2rem',
    },
    pageTitle: {
        fontSize: '2.5rem',
        fontWeight: 700,
        color: '#1e293b',
        marginBottom: '0.5rem',
    },
    pageSubtitle: {
        fontSize: '1rem',
        color: '#64748b',
    },
    filterForm: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '2rem',
        background: '#ffffff',
        padding: '1.25rem',
        borderRadius: '16px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        border: '1px solid #eef2ff',
    },
    input: {
        flex: '1 1 200px',
        maxWidth: '320px',
        padding: '0.75rem 1rem',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        fontSize: '0.875rem',
        color: '#1e293b',
        outline: 'none',
        transition: 'all 0.2s ease',
    },
    select: {
        width: 'auto',
        minWidth: '160px',
        padding: '0.75rem 1rem',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        fontSize: '0.875rem',
        color: '#1e293b',
        cursor: 'pointer',
        outline: 'none',
    },
    btnPrimary: {
        background: 'linear-gradient(135deg, #b87333 0%, #9a5a1f 100%)',
        color: '#ffffff',
        padding: '0.75rem 1.5rem',
        borderRadius: '12px',
        fontWeight: 500,
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.875rem',
        transition: 'all 0.2s ease',
    },
    btnSecondary: {
        background: '#ffffff',
        color: '#b87333',
        padding: '0.5rem 1rem',
        borderRadius: '10px',
        fontWeight: 500,
        border: '1px solid #b87333',
        cursor: 'pointer',
        fontSize: '0.875rem',
        transition: 'all 0.2s ease',
    },
    btnDisabled: {
        opacity: 0.5,
        cursor: 'not-allowed',
        background: '#f1f5f9',
        color: '#94a3b8',
        borderColor: '#e2e8f0',
    },
    gridProducts: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem',
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
        marginTop: '2.5rem',
        paddingTop: '1rem',
        borderTop: '1px solid #eef2ff',
    },
    pageInfo: {
        alignSelf: 'center',
        color: '#64748b',
        fontSize: '0.875rem',
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
        border: '3px solid #eef2ff',
        borderTopColor: '#b87333',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
    },
    emptyState: {
        textAlign: 'center',
        padding: '4rem',
        background: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #eef2ff',
    },
    emptyStateText: {
        color: '#64748b',
    },
};

// Add animations
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .shop-input:focus {
      border-color: #b87333;
      box-shadow: 0 0 0 3px rgba(184, 115, 51, 0.1);
      background: #ffffff;
    }
    
    .shop-select:focus {
      border-color: #b87333;
      box-shadow: 0 0 0 3px rgba(184, 115, 51, 0.1);
    }
    
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(184, 115, 51, 0.3);
    }
    
    .btn-secondary:hover:not(:disabled) {
      background: rgba(184, 115, 51, 0.1);
      transform: translateY(-1px);
    }
    
    @media (max-width: 768px) {
      .shop-container {
        padding: 1rem 1rem 3rem !important;
      }
      .shop-title {
        font-size: 2rem !important;
      }
      .filter-form {
        flex-direction: column;
      }
      .shop-input {
        max-width: 100% !important;
        flex: 1 !important;
      }
      .shop-select {
        width: 100% !important;
      }
      .btn-primary {
        width: 100%;
      }
      .grid-products {
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)) !important;
        gap: 1rem !important;
      }
    }
    
    @media (max-width: 480px) {
      .grid-products {
        grid-template-columns: 1fr !important;
      }
      .pagination {
        flex-wrap: wrap;
      }
    }
  `;
    document.head.appendChild(styleSheet);
}

export default function Shop() {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    useEffect(() => {
        api.getCategories().then(setCategories).catch(() => { });
    }, []);

    useEffect(() => {
        if (!router.isReady) return;
        const q = router.query;
        setKeyword(q.keyword || '');
        setCategory(q.category || '');
        setPage(Number(q.page) || 1);
    }, [router.isReady, router.query]);

    useEffect(() => {
        if (!router.isReady) return;
        setLoading(true);
        const params = { page, limit: 12 };
        if (keyword) params.keyword = keyword;
        if (category) params.category = category;
        if (router.query.featured === 'true') params.featured = 'true';

        api.getProducts(params)
            .then((data) => {
                setProducts(data.products || []);
                setPages(data.pages || 1);
            })
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));
    }, [router.isReady, keyword, category, page, router.query.featured]);

    const applyFilters = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (keyword) params.set('keyword', keyword);
        if (category) params.set('category', category);
        router.push(`/shop?${params.toString()}`);
        setPage(1);
    };

    return (
        <div style={shopStyles.pageWrapper}>
            <div className="shop-container" style={shopStyles.container}>
                <header style={shopStyles.pageHeader}>
                    <h1 className="shop-title" style={shopStyles.pageTitle}>Crystal Shop</h1>
                    <p style={shopStyles.pageSubtitle}>Browse our collection of healing stones and crystal products.</p>
                </header>

                <form className="filter-form" onSubmit={applyFilters} style={shopStyles.filterForm}>
                    <input
                        className="shop-input"
                        style={shopStyles.input}
                        placeholder="Search crystals..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <select
                        className="shop-select"
                        style={shopStyles.select}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">All categories</option>
                        {categories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    <button type="submit" className="btn-primary" style={shopStyles.btnPrimary}>
                        Search
                    </button>
                </form>

                {loading ? (
                    <div style={shopStyles.spinnerContainer}>
                        <div style={shopStyles.spinner} />
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <div className="grid-products" style={shopStyles.gridProducts}>
                            {products.map((p) => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                        {pages > 1 && (
                            <div style={shopStyles.pagination}>
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    style={{
                                        ...shopStyles.btnSecondary,
                                        ...(page <= 1 ? shopStyles.btnDisabled : {})
                                    }}
                                    disabled={page <= 1}
                                    onClick={() => setPage((p) => p - 1)}
                                >
                                    Previous
                                </button>
                                <span style={shopStyles.pageInfo}>
                                    Page {page} of {pages}
                                </span>
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    style={{
                                        ...shopStyles.btnSecondary,
                                        ...(page >= pages ? shopStyles.btnDisabled : {})
                                    }}
                                    disabled={page >= pages}
                                    onClick={() => setPage((p) => p + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div style={shopStyles.emptyState}>
                        <p style={shopStyles.emptyStateText}>No products found. Try a different search or check back later.</p>
                    </div>
                )}
            </div>
        </div>
    );
}