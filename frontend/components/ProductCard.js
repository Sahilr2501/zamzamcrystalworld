import Link from 'next/link';
import { formatPrice, productMinPrice, productImage } from '../lib/api';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
    const price = productMinPrice(product);

    return (
        <Link href={`/product/${product._id}`} className={styles.card}>
            <div className={styles.imageWrap}>
                <img src={productImage(product)} alt={product.name} className={styles.image} />
                {product.isFeatured && <span className={styles.featured}>Featured</span>}
            </div>
            <div className={styles.body}>
                <p className={styles.category}>{product.category}</p>
                <h3 className={styles.name}>{product.name}</h3>
                <p className={styles.brand}>{product.brand}</p>
                <p className={styles.price}>
                    {formatPrice(price)}
                    {product.variants?.length > 1 && <span className={styles.from}> onwards</span>}
                </p>
            </div>
        </Link>
    );
}
