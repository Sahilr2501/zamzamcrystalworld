import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/layout/AdminLayout';
import ProductForm from '../../../components/admin/ProductForm';
import { api } from '../../../lib/api';

export default function EditProduct() {
    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState(null);

    useEffect(() => {
        if (!id) return;
        api.getProduct(id).then(setProduct).catch(() => setProduct(null));
    }, [id]);

    if (!product) return (
        <AdminLayout title="Edit Product">
            <div className="spinner" />
        </AdminLayout>
    );

    return (
        <AdminLayout title="Edit Product">
            <ProductForm initial={product} />
        </AdminLayout>
    );
}
