import { useState, useEffect } from "react";
import { categories } from "../../data/categories";
import { fetchProducts, fetchProduct } from "../../api";
import ProductModal from "../ProductModal/ProductModal";
import "./CategoryPage.css";

const CategoryPage = ({ categoryId, onBack }) => {
    const [products, setProducts]               = useState([]);
    const [loading, setLoading]                 = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const category = categories.find(c => c.id === categoryId);

    useEffect(() => {
        setLoading(true);
        fetchProducts({ category: categoryId })
            .then(data => setProducts(Array.isArray(data) ? data : []))
            .finally(() => setLoading(false));
    }, [categoryId]);

    const openProduct = async (product) => {
        const full = await fetchProduct(product.id);
        setSelectedProduct(full);
    };

    return (
        <div className="category-page">
            <div className="category-page-header">
                <button className="back-btn" onClick={onBack}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                    </svg>
                    Назад
                </button>
                <div className="category-page-title">
                    <span className="category-page-icon">{category?.icon}</span>
                    <h1>{category?.name}</h1>
                </div>
            </div>

            {loading && <p style={{padding:'40px',textAlign:'center',color:'#888'}}>Завантаження...</p>}

            {!loading && products.length === 0 && (
                <p className="empty-category">У цій категорії поки немає товарів.<br/>Додайте їх через адмінку: <a href="http://localhost:8000/admin" target="_blank" style={{color:'#1A56F0'}}>localhost:8000/admin</a></p>
            )}

            {!loading && products.length > 0 && (
                <div className="category-products-grid">
                    {products.map(product => (
                        <div key={product.id} className="cp-card" onClick={() => openProduct(product)}>
                            <div className="cp-img" style={{ background: product.bg || '#f5f5f5' }}>
                                {product.discount > 0 && <span className="cp-discount-badge">-{product.discount}%</span>}
                                {product.images?.[0]?.image_url
                                    ? <img src={product.images[0].image_url} alt={product.name} className="cp-img-photo"/>
                                    : <span className="cp-emoji">{product.emoji}</span>
                                }
                            </div>
                            <div className="cp-info">
                                <p className="cp-name">{product.name}</p>
                                <p className="cp-desc">{product.description}</p>
                                <div className="cp-bottom">
                                    <div>
                                        <p className="cp-price">{Number(product.price).toFixed(2)} ₴</p>
                                        {product.old_price && <p className="cp-old-price">{Number(product.old_price).toFixed(2)} ₴</p>}
                                    </div>
                                    <div className="cp-meta">
                                        {product.reviews_count > 0 && (
                                            <span className="cp-reviews">★ {product.reviews_count}</span>
                                        )}
                                        <button className="cp-add-btn" onClick={e => e.stopPropagation()}>+</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
};

export default CategoryPage;
