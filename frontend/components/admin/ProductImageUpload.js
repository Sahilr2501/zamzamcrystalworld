import { useState } from 'react';
import { api, resolveImageUrl } from '../../lib/api';
import styles from './ProductImageUpload.module.css';

export default function ProductImageUpload({ images, onChange }) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFiles = async (e) => {
        const files = Array.from(e.target.files || []);
        e.target.value = '';
        if (!files.length) return;

        setError('');
        setUploading(true);
        try {
            const { urls } = await api.uploadProductImages(files);
            onChange([...images, ...urls]);
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const remove = (url) => {
        onChange(images.filter((img) => img !== url));
    };

    return (
        <div className="form-group">
            <label className="label">Product Images</label>
            <p className={styles.hint}>Upload JPEG, PNG, GIF, or WebP (max 5MB each, up to 8 images)</p>

            {images.length > 0 && (
                <ul className={styles.previewList}>
                    {images.map((url) => (
                        <li key={url} className={styles.previewItem}>
                            <img src={resolveImageUrl(url)} alt="" />
                            <button type="button" className={styles.removeBtn} onClick={() => remove(url)} aria-label="Remove">
                                ×
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <label className={styles.dropzone}>
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    multiple
                    onChange={handleFiles}
                    disabled={uploading || images.length >= 8}
                    className={styles.fileInput}
                />
                <span>{uploading ? 'Uploading...' : '+ Choose images to upload'}</span>
            </label>

            {images.length === 0 && <p className={styles.required}>At least one image is required</p>}
            {error && <div className="alert alert-error" style={{ marginTop: '0.5rem' }}>{error}</div>}
        </div>
    );
}
