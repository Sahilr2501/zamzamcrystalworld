import Link from 'next/link';
import { useState } from 'react';
import styles from './Footer.module.css';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            // Add your newsletter subscription logic here
            console.log('Subscribed:', email);
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Main Footer Content */}
                <div className={styles.mainContent}>
                    {/* Brand Section */}
                    <div className={styles.brandSection}>
                        <div className={styles.logo}>
                            <span className={styles.logoIcon}>✨</span>
                            <p className={styles.brand}>Zamzam Crystal World</p>
                        </div>
                        <p className={styles.tagline}>
                            Authentic crystals & healing stones for your journey.
                        </p>

                    </div>

                    {/* Quick Links */}
                    <div className={styles.linksSection}>
                        <h3 className={styles.sectionTitle}>Quick Links</h3>
                        <div className={styles.linkGrid}>
                            <Link href="/shop">Shop All</Link>
                            <Link href="/new-arrivals">New Arrivals</Link>
                            <Link href="/best-sellers">Best Sellers</Link>
                            <Link href="/about">About Us</Link>
                            <Link href="/account">My Account</Link>
                            <Link href="/cart">Shopping Cart</Link>
                            <Link href="/wishlist">Wishlist</Link>
                            <Link href="/contact">Contact Us</Link>
                        </div>
                    </div>

                    {/* Newsletter Section */}
                    <div className={styles.newsletterSection}>
                        <h3 className={styles.sectionTitle}>Newsletter</h3>
                        <p className={styles.newsletterText}>
                            Subscribe to receive updates, access to exclusive deals, and more.
                        </p>
                        <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
                            <div className={styles.inputGroup}>
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className={styles.emailInput}
                                />
                                <button type="submit" className={styles.subscribeBtn}>
                                    Subscribe
                                </button>
                            </div>
                        </form>
                        {subscribed && (
                            <div className={styles.successMessage}>
                                ✓ Thanks for subscribing!
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className={styles.footerBottom}>
                    <div className={styles.paymentMethods}>
                        <span>💳 Visa</span>
                        <span>💳 Mastercard</span>
                        <span>💳 PayPal</span>
                        <span>💳 Apple Pay</span>
                    </div>
                    <p className={styles.copy}>
                        © {new Date().getFullYear()} Zamzam Crystal World. All rights reserved.
                    </p>
                    <div className={styles.legalLinks}>
                        <Link href="/privacy">Privacy Policy</Link>
                        <Link href="/terms">Terms of Service</Link>
                        <Link href="/shipping">Shipping Info</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}