import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import Layout from '../components/layout/Layout';
import { useRouter } from 'next/router';

// Global styles injection for consistent theming
if (typeof document !== 'undefined') {
    const globalStyles = document.createElement('style');
    globalStyles.textContent = `
    :root {
      --color-bg-primary: #FBF5DD;
      --color-bg-secondary: #ffffff;
      --color-text-primary: #0D530E;
      --color-text-secondary: #306D29;
      --color-border: #E7E1B1;
      --color-accent: #306D29;
      --color-accent-dark: #0D530E;
      --color-success: #166534;
      --color-success-bg: #dcfce7;
      --color-error: #dc2626;
      --color-error-bg: #fee2e2;
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      --radius-sm: 0.375rem;
      --radius-md: 0.5rem;
      --radius-lg: 0.75rem;
      --radius-xl: 1rem;
      --radius-2xl: 1.5rem;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background: #FBF5DD;
      color: #306D29;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.5;
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    /* Page Header */
    .page-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .page-header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #0D530E;
      margin-bottom: 0.5rem;
    }

    .page-header p {
      color: #306D29;
    }

    /* Cards */
    .card {
      background: #ffffff;
      border-radius: 20px;
      border: 1px solid #E7E1B1;
      box-shadow: 0 4px 12px rgba(48, 109, 41, 0.08);
    }

    /* Buttons */
    .btn {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.875rem;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    .btn-primary {
      background: #306D29;
      color: #FBF5DD;
    }

    .btn-primary:hover:not(:disabled) {
      background: #0D530E;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(48, 109, 41, 0.3);
    }

    .btn-secondary {
      background: transparent;
      color: #306D29;
      border: 2px solid #306D29;
    }

    .btn-secondary:hover:not(:disabled) {
      background: rgba(48, 109, 41, 0.1);
      transform: translateY(-2px);
      border-color: #0D530E;
      color: #0D530E;
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.75rem;
    }

    .btn-ghost {
      background: transparent;
      border: none;
      cursor: pointer;
      color: #306D29;
      transition: all 0.2s ease;
    }

    .btn-ghost:hover {
      color: #0D530E;
      transform: scale(1.1);
    }

    /* Form Elements */
    .form-group {
      margin-bottom: 1rem;
    }

    .label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: #0D530E;
      margin-bottom: 0.5rem;
    }

    .input, .select, .textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      background: #FBF5DD;
      border: 1px solid #E7E1B1;
      border-radius: 12px;
      font-size: 0.875rem;
      color: #0D530E;
      transition: all 0.2s ease;
      outline: none;
    }

    .input:focus, .select:focus, .textarea:focus {
      border-color: #306D29;
      box-shadow: 0 0 0 3px rgba(48, 109, 41, 0.1);
      background: #ffffff;
    }

    .textarea {
      resize: vertical;
    }

    /* Alerts */
    .alert {
      padding: 0.75rem 1rem;
      border-radius: 12px;
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }

    .alert-success {
      background: #dcfce7;
      border: 1px solid #bbf7d0;
      color: #166534;
    }

    .alert-error {
      background: #fee2e2;
      border: 1px solid #fecaca;
      color: #dc2626;
    }

    /* Badges */
    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .badge-success {
      background: #dcfce7;
      color: #166534;
    }

    .badge-muted {
      background: #fed7aa;
      color: #9a3412;
    }

    /* Spinner */
    .spinner {
      width: 50px;
      height: 50px;
      border: 3px solid #E7E1B1;
      border-top-color: #306D29;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 2rem auto;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 4rem;
      background: #ffffff;
      border-radius: 20px;
      border: 1px solid #E7E1B1;
    }

    .empty-state p {
      color: #306D29;
      margin-bottom: 1rem;
    }

    /* Product Grid */
    .grid-products {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    /* Data Table */
    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th {
      background: #FBF5DD;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: #0D530E;
      border-bottom: 2px solid #E7E1B1;
    }

    .data-table td {
      padding: 1rem;
      border-bottom: 1px solid #E7E1B1;
      color: #306D29;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .container {
        padding: 0 1rem;
      }
      
      .page-header h1 {
        font-size: 1.75rem;
      }
      
      .grid-products {
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 1rem;
      }
    }

    @media (max-width: 480px) {
      .grid-products {
        grid-template-columns: 1fr;
      }
    }
  `;
    document.head.appendChild(globalStyles);
}

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