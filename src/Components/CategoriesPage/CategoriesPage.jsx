import { useState, useEffect } from 'react';
import { fetchCategories } from '../../api';
import './CategoriesPage.css';

const CategoriesPage = ({ onSelectCategory }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories().then(data => setCategories(Array.isArray(data) ? data : []));
    }, []);

    return (
        <div className="categories-page">
            <h1 className="categories-heading">Всі категорії</h1>
            <div className="categories-grid">
                {categories.map(cat => (
                    <div
                        key={cat.id}
                        className="cat-card"
                        style={{ background: cat.theme }}
                        onClick={() => onSelectCategory(cat.id)}
                    >
                        <span className="cat-icon">{cat.icon}</span>
                        <p className="cat-name">{cat.name}</p>
                        <p className="cat-count">{cat.products_count} товарів</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoriesPage;
