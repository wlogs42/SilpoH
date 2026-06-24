import { useState, useEffect } from "react";
import { fetchCategories } from "../../api";
import "./AllProductsView.css";

const AllProductsView = ({ onSubcategoryClick }) => {
    const [categories, setCategories]       = useState([]);
    const [activeCategoryId, setActiveCategoryId] = useState(null);
    const [loading, setLoading]             = useState(true);

    useEffect(() => {
        fetchCategories().then(data => {
            const cats = Array.isArray(data) ? data : [];
            setCategories(cats);
            if (cats.length) setActiveCategoryId(cats[0].id);
            setLoading(false);
        });
    }, []);

    const activeCategory = categories.find(c => c.id === activeCategoryId);

    if (loading) return (
        <div className="apv-wrapper" style={{ alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: '#aaa', fontSize: 15 }}>Завантаження...</p>
        </div>
    );

    if (!categories.length) return (
        <div className="apv-wrapper" style={{ alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: '#aaa', fontSize: 15 }}>
                Категорій немає — додайте їх через адмін панель.
            </p>
        </div>
    );

    return (
        <div className="apv-wrapper">
            {/* Sidebar */}
            <aside className="apv-sidebar">
                {categories.map(cat => (
                    <div
                        key={cat.id}
                        className={`apv-cat-item ${cat.id === activeCategoryId ? "apv-cat-item--active" : ""}`}
                        onClick={() => setActiveCategoryId(cat.id)}
                    >
                        <span className="apv-cat-icon">{cat.icon}</span>
                        <span className="apv-cat-name">{cat.name}</span>
                        {cat.is_new && <span className="badge-new">НОВЕ</span>}
                    </div>
                ))}
            </aside>

            {/* Content */}
            <main className="apv-content">
                <h1 className="apv-title">{activeCategory?.name}</h1>
                <div className="apv-grid">
                    {/* Одна велика картка "Переглянути всі товари" */}
                    <div
                        className="apv-subcat-card apv-open-all"
                        style={{ background: activeCategory?.theme || '#f0f0f0' }}
                        onClick={() => onSubcategoryClick && onSubcategoryClick(activeCategoryId)}
                    >
                        <span className="apv-subcat-name">Переглянути всі товари</span>
                        <span className="apv-subcat-emoji">{activeCategory?.icon}</span>
                    </div>

                    {activeCategory?.products_count === 0 && (
                        <p className="apv-empty">У цій категорії поки немає товарів</p>
                    )}
                </div>

                {activeCategory?.products_count > 0 && (
                    <p className="apv-count">{activeCategory.products_count} товарів у категорії</p>
                )}
            </main>
        </div>
    );
};

export default AllProductsView;
