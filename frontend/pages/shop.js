import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '../lib/api';
import ProductCard from '../components/ProductCard';

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
        api.getCategories().then(setCategories).catch(() => {});
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
        <div className="container" style={{ paddingBottom: '3rem' }}>
            <header className="page-header">
                <h1>Crystal Shop</h1>
                <p>Browse our collection of healing stones and crystal products.</p>
            </header>

            <form onSubmit={applyFilters} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem' }}>
                <input
                    className="input"
                    style={{ flex: '1 1 200px', maxWidth: 320 }}
                    placeholder="Search crystals..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <select className="select" style={{ width: 'auto', minWidth: 160 }} value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">All categories</option>
                    {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
                <button type="submit" className="btn btn-primary btn-sm">Search</button>
            </form>

            {loading ? (
                <div className="spinner" />
            ) : products.length > 0 ? (
                <>
                    <div className="grid-products">
                        {products.map((p) => (
                            <ProductCard key={p._id} product={p} />
                        ))}
                    </div>
                    {pages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                            <button type="button" className="btn btn-secondary btn-sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                                Previous
                            </button>
                            <span style={{ alignSelf: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                Page {page} of {pages}
                            </span>
                            <button type="button" className="btn btn-secondary btn-sm" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
                                Next
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="empty-state">
                    <p>No products found. Try a different search or check back later.</p>
                </div>
            )}
        </div>
    );
}
