import { useState } from 'react';
import { api, resolveImageUrl } from '../../lib/api';

const uploadStyles = {
    formGroup: {
        marginBottom: '1rem',
    },
    label: {
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: 500,
        color: '#0D530E',
        marginBottom: '0.5rem',
    },
    hint: {
        margin: '0 0 0.75rem',
        fontSize: '0.75rem',
        color: '#306D29',
    },
    previewList: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        listStyle: 'none',
        padding: 0,
        margin: '0 0 1rem',
    },
    previewItem: {
        position: 'relative',
        width: '80px',
        height: '80px',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #E7E1B1',
        background: '#FBF5DD',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    removeBtn: {
        position: 'absolute',
        top: '4px',
        right: '4px',
        width: '24px',
        height: '24px',
        padding: 0,
        border: 'none',
        borderRadius: '50%',
        background: 'rgba(0, 0, 0, 0.7)',
        color: '#ffffff',
        fontSize: '1rem',
        lineHeight: 1,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dropzone: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100px',
        padding: '1.5rem',
        border: '2px dashed #E7E1B1',
        borderRadius: '16px',
        color: '#306D29',
        fontSize: '0.875rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        background: '#FBF5DD',
        textAlign: 'center',
    },
    fileInput: {
        display: 'none',
    },
    required: {
        margin: '0.5rem 0 0',
        fontSize: '0.75rem',
        color: '#306D29',
    },
    alert: {
        padding: '0.75rem 1rem',
        borderRadius: '12px',
        fontSize: '0.875rem',
        marginTop: '0.5rem',
    },
    alertError: {
        background: '#fee2e2',
        border: '1px solid #fecaca',
        color: '#dc2626',
    },
    uploadingText: {
        opacity: 0.7,
    },
};

// Add hover styles and responsive CSS
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
    .remove-btn:hover {
      background: #dc2626 !important;
      transform: scale(1.1);
    }
    
    .dropzone:hover {
      border-color: #306D29 !important;
      background: rgba(48, 109, 41, 0.05) !important;
      color: #0D530E !important;
    }
    
    /* Mobile Responsive */
    @media (max-width: 640px) {
      .preview-item {
        width: 70px !important;
        height: 70px !important;
      }
      
      .dropzone {
        min-height: 80px !important;
        padding: 1rem !important;
        font-size: 0.8rem !important;
      }
      
      .preview-list {
        gap: 0.5rem !important;
      }
    }
    
    @media (max-width: 480px) {
      .preview-item {
        width: 60px !important;
        height: 60px !important;
      }
      
      .remove-btn {
        width: 20px !important;
        height: 20px !important;
        font-size: 0.875rem !important;
        top: 2px !important;
        right: 2px !important;
      }
    }
  `;
    document.head.appendChild(styleSheet);
}

export default function ProductImageUpload({ images, onChange }) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFiles = async (e) => {
        const files = Array.from(e.target.files || []);
        e.target.value = '';
        if (!files.length) return;

        // Validate file sizes (max 5MB each)
        const maxSize = 5 * 1024 * 1024;
        const oversizedFiles = files.filter(f => f.size > maxSize);
        if (oversizedFiles.length > 0) {
            setError(`Some files exceed 5MB limit. Please compress and try again.`);
            return;
        }

        // Check if adding these would exceed 8 images
        if (images.length + files.length > 8) {
            setError(`Maximum 8 images allowed. You can upload ${8 - images.length} more.`);
            return;
        }

        setError('');
        setUploading(true);
        try {
            const { urls } = await api.uploadProductImages(files);
            onChange([...images, ...urls]);
        } catch (err) {
            setError(err.message || 'Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const remove = (url) => {
        onChange(images.filter((img) => img !== url));
    };

    return (
        <div style={uploadStyles.formGroup}>
            <label style={uploadStyles.label}>Product Images</label>
            <p style={uploadStyles.hint}>
                Upload JPEG, PNG, GIF, or WebP (max 5MB each, up to 8 images)
            </p>

            {images.length > 0 && (
                <ul className="preview-list" style={uploadStyles.previewList}>
                    {images.map((url, index) => (
                        <li key={`${url}-${index}`} className="preview-item" style={uploadStyles.previewItem}>
                            <img
                                src={resolveImageUrl(url)}
                                alt={`Product image ${index + 1}`}
                                style={uploadStyles.previewImage}
                            />
                            <button
                                type="button"
                                className="remove-btn"
                                style={uploadStyles.removeBtn}
                                onClick={() => remove(url)}
                                aria-label="Remove image"
                            >
                                ×
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <label className="dropzone" style={uploadStyles.dropzone}>
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    multiple
                    onChange={handleFiles}
                    disabled={uploading || images.length >= 8}
                    style={uploadStyles.fileInput}
                />
                <span style={uploading ? uploadStyles.uploadingText : {}}>
                    {uploading ? '⏳ Uploading...' : images.length >= 8 ? '✓ Maximum images reached' : '+ Choose images to upload'}
                </span>
            </label>

            {images.length === 0 && (
                <p style={uploadStyles.required}>
                    ⚠️ At least one product image is required
                </p>
            )}

            {error && (
                <div style={{ ...uploadStyles.alert, ...uploadStyles.alertError }}>
                    {error}
                </div>
            )}
        </div>
    );
}