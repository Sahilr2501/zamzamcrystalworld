import AdminLayout from '../../../components/layout/AdminLayout';
import ProductForm from '../../../components/admin/ProductForm';

export default function NewProduct() {
    return (
        <AdminLayout title="Add Product">
            <ProductForm />
        </AdminLayout>
    );
}
