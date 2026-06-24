import { useState, useEffect, useRef } from 'react';
import { fetchCategories, fetchProducts, fetchProduct } from '../../api';
import ProductModal from '../ProductModal/ProductModal';
import './ProductsSection.css';

/* ── Картка товару ── */
const ProductCard = ({ product, onClick }) => {
    const imgUrl = product.images?.[0]?.image_url;
    const hasDiscount = product.discount > 0;

    return (
        <div className="pc" onClick={onClick}>
            <div className="pc-img-wrap">
                {imgUrl
                    ? <img src={imgUrl} alt={product.name} className="pc-img" />
                    : <span className="pc-emoji">{product.emoji || '📦'}</span>
                }
                {hasDiscount && (
                    <span className="pc-disc-badge">%</span>
                )}
                <button className="pc-add" onClick={e => e.stopPropagation()}>+</button>
            </div>
            <div className="pc-body">
                <div className="pc-price-row">
                    <span className="pc-price">{Number(product.price).toFixed(2)} ₴</span>
                    {hasDiscount && (
                        <span className="pc-disc-label">-{product.discount}%</span>
                    )}
                </div>
                {product.old_price && (
                    <p className="pc-old-price">{Number(product.old_price).toFixed(2)} ₴</p>
                )}
                <p className="pc-name">{product.name}</p>
                {product.reviews_count > 0 && (
                    <p className="pc-rating">★ {product.reviews_count}</p>
                )}
            </div>
        </div>
    );
};

/* ── Секція однієї категорії ── */
const CategorySection = ({ category, onProductOpen, onViewAll }) => {
    const [products, setProducts] = useState([]);
    const rowRef = useRef(null);

    useEffect(() => {
        fetchProducts({ category: category.id }).then(data => {
            setProducts(Array.isArray(data) ? data : []);
        });
    }, [category.id]);

    if (!products.length) return null;

    const scroll = (dir) => {
        rowRef.current?.scrollBy({ left: dir * 220, behavior: 'smooth' });
    };

    return (
        <section className="ps-section">
            <div className="ps-header">
                <div className="ps-title-block">
                    <span className="ps-cat-icon">{category.icon}</span>
                    <h2 className="ps-title">{category.name}</h2>
                </div>
                <div className="ps-nav">
                    <span className="ps-view-all" onClick={onViewAll}>Дивитись всі</span>
                    <button className="ps-nav-btn" onClick={() => scroll(-1)}>
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                        </svg>
                    </button>
                    <button className="ps-nav-btn" onClick={() => scroll(1)}>
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div className="ps-row" ref={rowRef}>
                {products.map(p => (
                    <ProductCard key={p.id} product={p} onClick={() => onProductOpen(p)} />
                ))}
            </div>
        </section>
    );
};

/* ── Головний компонент ── */
const ProductsSection = ({ onCategoryClick }) => {
    const [categories, setCategories] = useState([]);
    const [selected, setSelected]     = useState(null);

    useEffect(() => {
        fetchCategories().then(data => setCategories(Array.isArray(data) ? data : []));
    }, []);

    const openProduct = async (product) => {
        const full = await fetchProduct(product.id);
        setSelected(full);
    };

    if (!categories.length) return null;

    return (
        <div className="ps-wrapper">
            {categories.map(cat => (
                <CategorySection
                    key={cat.id}
                    category={cat}
                    onProductOpen={openProduct}
                    onViewAll={() => onCategoryClick?.(cat.id)}
                />
            ))}
            {selected && (
                <ProductModal product={selected} onClose={() => setSelected(null)} />
            )}
        </div>
    );
};

export default ProductsSection;
