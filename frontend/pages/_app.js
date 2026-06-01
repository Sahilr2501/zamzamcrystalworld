import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import Layout from '../components/layout/Layout';
import { useRouter } from 'next/router';

function AppShell({ Component, pageProps }) {
    const router = useRouter();
    const isAdmin = router.pathname.startsWith('/admin');

    if (isAdmin) {
        return <Component {...pageProps} />;
    }

    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}

export default function MyApp({ Component, pageProps }) {
    return (
        <AuthProvider>
            <CartProvider>
                <AppShell Component={Component} pageProps={pageProps} />
            </CartProvider>
        </AuthProvider>
    );
}
