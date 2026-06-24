import { useState, useEffect, useRef } from 'react';
import {
    fetchCategories, createCategory, updateCategory, deleteCategory,
    fetchProducts, updateProduct, deleteProduct,
    uploadProductImage, deleteProductImage,
} from '../../api';
import ProductAddPage from '../ProductAddPage/ProductAddPage';
import './AdminPage.css';

const EMPTY_CAT = { name: '', icon: '📦', theme: '#f5f5f5', order: 0 };

/* ── Модалка категорії (додати / редагувати) ── */
const CategoryModal = ({ initial, onSave, onClose, saving }) => {
    const [form, setForm] = useState(initial);
    const f = key => e => setForm(p => ({ ...p, [key]: e.target.value }));

    return (
        <div className="cat-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="cat-modal">
                <div className="cat-modal-header">
                    <h3>{initial.id ? 'Редагування категорії' : 'Нова категорія'}</h3>
                    <button className="adm-close" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={e => { e.preventDefault(); onSave(form); }}>
                    <div className="cat-modal-field">
                        <label>Назва категорії</label>
                        <input className="adm-input" placeholder="Наприклад: М'ясо" required value={form.name} onChange={f('name')} />
                    </div>

                    <div className="cat-modal-field">
                        <label>Emoji-іконка</label>
                        <input className="adm-input" placeholder="🥩" value={form.icon} onChange={f('icon')} />
                    </div>

                    <div className="cat-modal-field">
                        <label>Колір фону картки</label>
                        <div className="cat-color-row">
                            <div className="cat-color-preview" style={{ background: form.theme }} />
                            <input type="color" className="cat-color-input" value={form.theme} onChange={f('theme')} />
                            <span className="cat-color-hex">{form.theme}</span>
                        </div>
                    </div>

                    <div className="cat-modal-field">
                        <label>
                            Порядок відображення
                            <span className="cat-order-hint">— чим менше число, тим вище у списку</span>
                        </label>
                        <input className="adm-input" type="number" min="0" value={form.order} onChange={f('order')} />
                    </div>

                    <div className="cat-modal-preview">
                        <span>Попередній вигляд:</span>
                        <div className="cat-preview-card" style={{ background: form.theme }}>
                            <span className="cat-preview-icon">{form.icon}</span>
                            <span className="cat-preview-name">{form.name || 'Назва'}</span>
                        </div>
                    </div>

                    <div className="cat-modal-actions">
                        <button type="button" className="adm-btn adm-btn--cancel" onClick={onClose}>Скасувати</button>
                        <button type="submit" className="adm-btn adm-btn--add" disabled={saving}>
                            {saving ? 'Збереження...' : (initial.id ? '💾 Зберегти' : '+ Додати')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ── мала картка фото ── */
const ImageThumb = ({ img, onDelete }) => (
    <div className="adm-thumb">
        <img src={img.image_url} alt="" className="adm-thumb-img" />
        <button className="adm-thumb-del" onClick={() => onDelete(img.id)} title="Видалити">✕</button>
    </div>
);

/* ── рядок товару у списку ── */
const ProductRow = ({ p, onEdit, onDelete }) => (
    <div className="adm-item">
        <span className="adm-item-icon">{p.emoji}</span>
        <span className="adm-item-name">{p.name}</span>
        <span className="adm-item-meta">{Number(p.price).toFixed(2)} ₴</span>
        {p.discount > 0 && <span className="adm-badge">-{p.discount}%</span>}
        <span className="adm-item-meta adm-item-imgs">🖼 {p.images?.length ?? 0}/7</span>
        <button className="adm-btn adm-btn--edit" onClick={() => onEdit(p)}>✏️</button>
        <button className="adm-btn adm-btn--del"  onClick={() => onDelete(p.id)}>✕</button>
    </div>
);

/* ════════════════════════════════ AdminPage ════════════════════════════════ */
const AdminPage = ({ onClose }) => {
    const [tab,        setTab]        = useState('categories');
    const [categories, setCategories] = useState([]);
    const [products,   setProducts]   = useState([]);
    const [catModal,   setCatModal]   = useState(null); // null | EMPTY_CAT | {id,...}
    const [editProd,   setEditProd]   = useState(null);
    const [showAddProd, setShowAddProd] = useState(false);
    const [saving,     setSaving]     = useState(false);
    const [error,      setError]      = useState('');
    const fileRef = useRef(null);

    useEffect(() => { loadAll(); }, []);

    const loadAll = async () => {
        const [cats, prods] = await Promise.all([fetchCategories(), fetchProducts()]);
        setCategories(Array.isArray(cats)  ? cats  : []);
        setProducts  (Array.isArray(prods) ? prods : []);
    };

    /* ── Categories ── */
    const handleSaveCat = async (form) => {
        setSaving(true); setError('');
        const res = form.id
            ? await updateCategory(form.id, form)
            : await createCategory(form);
        setSaving(false);
        if (res.id) { setCatModal(null); loadAll(); }
        else setError(JSON.stringify(res));
    };

    const handleDeleteCat = async (id) => {
        if (!confirm('Видалити категорію? Всі товари в ній теж видаляться.')) return;
        await deleteCategory(id); loadAll();
    };

    /* ── Products: edit save ── */
    const handleSaveEdit = async (e) => {
        e.preventDefault(); setSaving(true); setError('');
        const payload = {
            ...editProd,
            price:     Number(editProd.price),
            old_price: editProd.old_price ? Number(editProd.old_price) : null,
            discount:  Number(editProd.discount),
        };
        const res = await updateProduct(editProd.id, payload);
        setSaving(false);
        if (res.id) {
            setEditProd(null); loadAll();
        } else setError(JSON.stringify(res));
    };

    const handleDeleteProd = async (id) => {
        if (!confirm('Видалити товар?')) return;
        await deleteProduct(id);
        if (editProd?.id === id) setEditProd(null);
        loadAll();
    };

    /* ── Images ── */
    const handleUploadImage = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !editProd) return;
        if ((editProd.images?.length ?? 0) >= 7) {
            setError('Максимум 7 зображень'); return;
        }
        setSaving(true);
        const res = await uploadProductImage(editProd.id, file);
        setSaving(false);
        if (res.id) {
            setEditProd(prev => ({ ...prev, images: [...(prev.images || []), res] }));
            loadAll();
        } else setError(JSON.stringify(res));
        e.target.value = '';
    };

    const handleDeleteImage = async (imgId) => {
        await deleteProductImage(imgId);
        setEditProd(prev => ({ ...prev, images: prev.images.filter(i => i.id !== imgId) }));
        loadAll();
    };

    /* ════════════ render ════════════ */
    return (
        <>
        {catModal && (
            <CategoryModal
                initial={catModal}
                onSave={handleSaveCat}
                onClose={() => setCatModal(null)}
                saving={saving}
            />
        )}
        {showAddProd && (
            <ProductAddPage
                categories={categories}
                onClose={() => setShowAddProd(false)}
                onSuccess={() => { setShowAddProd(false); loadAll(); }}
            />
        )}
        <div className="adm-overlay" onClick={onClose}>
            <div className="adm-panel" onClick={e => e.stopPropagation()}>
                <div className="adm-header">
                    <h2 className="adm-title">Адмін панель</h2>
                    <button className="adm-close" onClick={onClose}>✕</button>
                </div>

                <div className="adm-tabs">
                    <button className={`adm-tab ${tab === 'categories' ? 'adm-tab--active' : ''}`} onClick={() => setTab('categories')}>
                        Категорії ({categories.length})
                    </button>
                    <button className={`adm-tab ${tab === 'products' ? 'adm-tab--active' : ''}`} onClick={() => setTab('products')}>
                        Товари ({products.length})
                    </button>
                </div>

                {error && <p className="adm-error">{error}</p>}

                {/* ══ КАТЕГОРІЇ ══ */}
                {tab === 'categories' && (
                    <div className="adm-content">
                        <div className="adm-add-btn-wrap">
                            <button className="adm-btn adm-btn--add-product" onClick={() => setCatModal(EMPTY_CAT)}>
                                + Додати категорію
                            </button>
                        </div>
                        <div className="adm-list">
                            {categories.map(c => (
                                <div key={c.id} className="adm-item">
                                    <span className="adm-item-icon">{c.icon}</span>
                                    <span className="adm-item-name">{c.name}</span>
                                    <span className="adm-item-meta">{c.products_count} товарів</span>
                                    <div className="adm-item-color" style={{ background: c.theme }} />
                                    <span className="adm-item-meta">#{c.order}</span>
                                    <button className="adm-btn adm-btn--edit" onClick={() => setCatModal(c)}>✏️</button>
                                    <button className="adm-btn adm-btn--del" onClick={() => handleDeleteCat(c.id)}>✕</button>
                                </div>
                            ))}
                            {!categories.length && <p className="adm-empty">Категорій немає</p>}
                        </div>
                    </div>
                )}

                {/* ══ ТОВАРИ ══ */}
                {tab === 'products' && (
                    <div className="adm-content">
                        {!editProd ? (
                            <div className="adm-add-btn-wrap">
                                <button className="adm-btn adm-btn--add-product" onClick={() => setShowAddProd(true)}>
                                    + Додати товар
                                </button>
                            </div>
                        ) : (
                            /* ── РЕДАГУВАННЯ ── */
                            <form className="adm-form adm-form--edit" onSubmit={handleSaveEdit}>
                                <div className="adm-edit-header">
                                    <h3 className="adm-form-title">Редагування: {editProd.name}</h3>
                                    <button type="button" className="adm-btn adm-btn--cancel" onClick={() => { setEditProd(null); setError(''); }}>Скасувати</button>
                                </div>
                                <div className="adm-col">
                                    <div className="adm-row">
                                        <select className="adm-input" value={editProd.category} onChange={e => setEditProd(p => ({ ...p, category: e.target.value }))}>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                                        </select>
                                        <input className="adm-input adm-input--sm" placeholder="Emoji" value={editProd.emoji} onChange={e => setEditProd(p => ({ ...p, emoji: e.target.value }))} />
                                        <input className="adm-input adm-input--sm" type="color" title="Фон" value={editProd.bg} onChange={e => setEditProd(p => ({ ...p, bg: e.target.value }))} />
                                    </div>
                                    <input className="adm-input adm-input--full" placeholder="Назва" required value={editProd.name} onChange={e => setEditProd(p => ({ ...p, name: e.target.value }))} />
                                    <textarea className="adm-input adm-input--full adm-textarea" placeholder="Опис" value={editProd.description} onChange={e => setEditProd(p => ({ ...p, description: e.target.value }))} />
                                    <div className="adm-row">
                                        <input className="adm-input" type="number" step="0.01" placeholder="Ціна ₴" required value={editProd.price} onChange={e => setEditProd(p => ({ ...p, price: e.target.value }))} />
                                        <input className="adm-input" type="number" step="0.01" placeholder="Стара ціна ₴" value={editProd.old_price ?? ''} onChange={e => setEditProd(p => ({ ...p, old_price: e.target.value }))} />
                                        <input className="adm-input adm-input--xs" type="number" placeholder="%" value={editProd.discount} onChange={e => setEditProd(p => ({ ...p, discount: e.target.value }))} />
                                        <button className="adm-btn adm-btn--add" type="submit" disabled={saving}>💾 Зберегти</button>
                                    </div>

                                    {/* Фотографії */}
                                    <div className="adm-images-section">
                                        <p className="adm-images-label">
                                            Фотографії ({editProd.images?.length ?? 0}/7)
                                        </p>
                                        <div className="adm-thumbs">
                                            {(editProd.images || []).map(img => (
                                                <ImageThumb key={img.id} img={img} onDelete={handleDeleteImage} />
                                            ))}
                                            {(editProd.images?.length ?? 0) < 7 && (
                                                <button type="button" className="adm-thumb-add" onClick={() => fileRef.current?.click()} disabled={saving}>
                                                    +<br/><span>фото</span>
                                                </button>
                                            )}
                                        </div>
                                        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUploadImage} />
                                    </div>
                                </div>
                            </form>
                        )}

                        <div className="adm-list">
                            {products.map(p => (
                                <ProductRow
                                    key={p.id}
                                    p={p}
                                    onEdit={(prod) => { setEditProd(prod); setError(''); }}
                                    onDelete={handleDeleteProd}
                                />
                            ))}
                            {!products.length && <p className="adm-empty">Товарів немає</p>}
                        </div>
                    </div>
                )}
            </div>
        </div>
        </>
    );
};

export default AdminPage;
