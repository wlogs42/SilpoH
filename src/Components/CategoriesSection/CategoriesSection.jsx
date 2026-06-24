import { useState, useEffect } from 'react';
import { fetchCategories } from '../../api';
import './CategoriesSection.css';

const CategoriesSection = ({ onCategoryClick }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories().then(data => setCategories(Array.isArray(data) ? data : []));
    }, []);

    if (!categories.length) return null;

    return (
        <nav className="cats-pills-wrap">
            <div className="cats-pills">
                {categories.map(cat => (
                    <button key={cat.id} className="cats-pill" onClick={() => onCategoryClick(cat.id)}>
                        <span className="cats-pill-icon">{cat.icon}</span>
                        <span className="cats-pill-name">{cat.name}</span>
                        {cat.is_new && <span className="cats-pill-new">NEW</span>}
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default CategoriesSection;
