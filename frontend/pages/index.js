import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../lib/api';
import ProductCard from '../components/ProductCard';
import styles from '../styles/Home.module.css';

export default function Home() {
    const [featured, setFeatured] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getProducts({ featured: 'true', limit: 4 })
            .then((data) => setFeatured(data.products || []))
            .catch(() => setFeatured([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <section className={styles.hero}>
                <div className="container">
                    <p className={styles.eyebrow}>Healing · Energy · Balance</p>
                    <h1 className={styles.title}>Discover the Power of Authentic Crystals</h1>
                    <p className={styles.subtitle}>
                        Curated healing stones and crystal collections from Zamzam Crystal World —
                        crafted for wellness, meditation, and positive energy.
                    </p>
                    <div className={styles.actions}>
                        <Link href="/shop" className="btn btn-primary">
                            Explore Collection
                        </Link>
                        <Link href="/shop?featured=true" className="btn btn-secondary">
                            Featured Items
                        </Link>
                    </div>
                </div>
            </section>

            <section className={styles.features}>
                <div className="container">
                    <div className={styles.featureGrid}>
                        <div className={styles.feature}>
                            <span className={styles.featureIcon}>◇</span>
                            <h3>Authentic Quality</h3>
                            <p>Hand-selected natural crystals sourced with care.</p>
                        </div>
                        <div className={styles.feature}>
                            <span className={styles.featureIcon}>◇</span>
                            <h3>Secure Checkout</h3>
                            <p>Safe payments and reliable delivery across India.</p>
                        </div>
                        <div className={styles.feature}>
                            <span className={styles.featureIcon}>◇</span>
                            <h3>Expert Guidance</h3>
                            <p>Detailed descriptions to help you choose wisely.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.collection}>
                <div className="container">
                    <div className={styles.sectionHead}>
                        <h2>Featured Crystals</h2>
                        <Link href="/shop">View all →</Link>
                    </div>
                    {loading ? (
                        <div className="spinner" />
                    ) : featured.length > 0 ? (
                        <div className="grid-products">
                            {featured.map((p) => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>New crystals arriving soon.</p>
                            <Link href="/shop" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                                Browse Shop
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
