import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/layout/AdminLayout';
import ProductForm from '../../../components/admin/ProductForm';
import { api } from '../../../lib/api';

const styles = {
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
    notFound: {
        textAlign: 'center',
        padding: '3rem',
        background: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #E7E1B1',
    },
    notFoundText: {
        color: '#306D29',
        marginBottom: '1rem',
    },
    backLink: {
        color: '#306D29',
        textDecoration: 'none',
        display: 'inline-block',
        marginTop: '1rem',
    },
};

if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
    document.head.appendChild(styleSheet);
}

export default function EditProduct() {
    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        api.getProduct(id)
            .then((data) => {
                setProduct(data);
                setError(false);
            })
            .catch(() => {
                setError(true);
                setProduct(null);
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <AdminLayout title="Edit Product">
                <div style={styles.loadingContainer}>
                    <div style={styles.spinner} />
                </div>
            </AdminLayout>
        );
    }

    if (error || !product) {
        return (
            <AdminLayout title="Edit Product">
                <div style={styles.notFound}>
                    <p style={styles.notFoundText}>⚠️ Product not found</p>
                    <Link href="/admin/products" style={styles.backLink}>
                        ← Back to Products
                    </Link>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title={`Edit: ${product.name}`}>
            <ProductForm initial={product} />
        </AdminLayout>
    );
}