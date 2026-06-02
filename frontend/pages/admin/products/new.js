import AdminLayout from '../../../components/layout/AdminLayout';
import ProductForm from '../../../components/admin/ProductForm';

const styles = {
    container: {
        maxWidth: '720px',
        margin: '0 auto',
    },
};

export default function NewProduct() {
    return (
        <AdminLayout title="Add New Product">
            <div style={styles.container}>
                <ProductForm />
            </div>http://localhost:3000/admin/orders
        </AdminLayout>
    );
}