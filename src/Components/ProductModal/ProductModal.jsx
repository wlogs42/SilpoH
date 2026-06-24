import { useState } from 'react';
import './ProductModal.css';

const Stars = ({ rating }) => (
    <span className="pm-stars">
        {[1,2,3,4,5].map(i => (
            <span key={i} style={{ color: i <= rating ? '#F47B20' : '#ddd' }}>★</span>
        ))}
    </span>
);

const ProductModal = ({ product, onClose }) => {
    const images = product.images || [];
    const [imgIdx, setImgIdx] = useState(0);

    const prev = () => setImgIdx(i => (i - 1 + images.length) % images.length);
    const next = () => setImgIdx(i => (i + 1) % images.length);

    return (
        <div className="pm-overlay" onClick={onClose}>
            <div className="pm-card" onClick={e => e.stopPropagation()}>
                <button className="pm-close" onClick={onClose}>✕</button>

                {/* ── Зображення / Карусель ── */}
                <div className="pm-img" style={{ background: product.bg || '#f5f5f5' }}>
                    {images.length > 0 ? (
                        <>
                            <img
                                src={images[imgIdx].image_url}
                                alt={product.name}
                                className="pm-img-photo"
                            />
                            {images.length > 1 && (
                                <>
                                    <button className="pm-arr pm-arr--prev" onClick={e => { e.stopPropagation(); prev(); }}>‹</button>
                                    <button className="pm-arr pm-arr--next" onClick={e => { e.stopPropagation(); next(); }}>›</button>
                                    <div className="pm-dots">
                                        {images.map((_, i) => (
                                            <span
                                                key={i}
                                                className={`pm-dot ${i === imgIdx ? 'pm-dot--active' : ''}`}
                                                onClick={e => { e.stopPropagation(); setImgIdx(i); }}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <span className="pm-emoji">{product.emoji || '📦'}</span>
                    )}
                </div>

                {/* ── Міні-галерея ── */}
                {images.length > 1 && (
                    <div className="pm-gallery">
                        {images.map((img, i) => (
                            <div
                                key={img.id}
                                className={`pm-gallery-thumb ${i === imgIdx ? 'pm-gallery-thumb--active' : ''}`}
                                onClick={() => setImgIdx(i)}
                            >
                                <img src={img.image_url} alt="" />
                            </div>
                        ))}
                    </div>
                )}

                <div className="pm-body">
                    {product.discount > 0 && (
                        <span className="pm-badge">-{product.discount}%</span>
                    )}
                    <h2 className="pm-name">{product.name}</h2>
                    {product.description && (
                        <p className="pm-desc">{product.description}</p>
                    )}

                    <div className="pm-prices">
                        <span className="pm-price">{Number(product.price).toFixed(2)} ₴</span>
                        {product.old_price && (
                            <span className="pm-old-price">{Number(product.old_price).toFixed(2)} ₴</span>
                        )}
                    </div>

                    <button className="pm-add-btn">Додати до кошика</button>

                    <div className="pm-reviews">
                        <h3 className="pm-reviews-title">
                            Відгуки
                            <span className="pm-reviews-count">({product.reviews?.length ?? 0})</span>
                        </h3>
                        {!product.reviews?.length ? (
                            <p className="pm-no-reviews">Відгуків поки немає.</p>
                        ) : (
                            product.reviews.map(r => (
                                <div key={r.id} className="pm-review">
                                    <div className="pm-review-header">
                                        <span className="pm-review-author">{r.author}</span>
                                        <Stars rating={r.rating} />
                                    </div>
                                    <p className="pm-review-text">{r.text}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
