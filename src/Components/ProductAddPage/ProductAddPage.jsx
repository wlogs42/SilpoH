import { useState, useRef } from 'react';
import { createProduct, uploadProductImage } from '../../api';
import './ProductAddPage.css';

const EMPTY = {
    name: '', description: '', price: '', old_price: '',
    discount: 0, emoji: '📦', bg: '#f5f5f5', category: '',
};

const MAX_PHOTOS = 7;

const ProductAddPage = ({ categories, onClose, onSuccess }) => {
    const [form,    setForm]    = useState(EMPTY);
    const [photos,  setPhotos]  = useState([]); // [{file, preview}]
    const [saving,  setSaving]  = useState(false);
    const [error,   setError]   = useState('');
    const [dragOver, setDragOver] = useState(null); // індекс куди перетягують

    const dragIdx = useRef(null);
    const fileRef = useRef(null);

    // ── Додавання фото ──────────────────────────────────────────────────────

    const addFiles = (files) => {
        const slots = MAX_PHOTOS - photos.length;
        if (slots <= 0) return;
        const next = Array.from(files).slice(0, slots).map(file => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setPhotos(p => [...p, ...next]);
    };

    const handleFileInput = (e) => {
        addFiles(e.target.files);
        e.target.value = '';
    };

    const handleDropZone = (e) => {
        e.preventDefault();
        addFiles(e.dataTransfer.files);
    };

    const removePhoto = (i) => {
        setPhotos(p => {
            URL.revokeObjectURL(p[i].preview);
            return p.filter((_, idx) => idx !== i);
        });
    };

    // ── Drag-and-drop сортування ─────────────────────────────────────────────

    const onDragStart = (e, i) => {
        dragIdx.current = i;
        e.dataTransfer.effectAllowed = 'move';
    };

    const onDragOver = (e, i) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOver(i);
    };

    const onDrop = (e, i) => {
        e.preventDefault();
        const from = dragIdx.current;
        if (from === null || from === i) { setDragOver(null); return; }
        setPhotos(p => {
            const arr = [...p];
            const [moved] = arr.splice(from, 1);
            arr.splice(i, 0, moved);
            return arr;
        });
        dragIdx.current = null;
        setDragOver(null);
    };

    const onDragEnd = () => {
        dragIdx.current = null;
        setDragOver(null);
    };

    // ── Сабміт ──────────────────────────────────────────────────────────────

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true); setError('');

        const payload = {
            ...form,
            price:     Number(form.price),
            old_price: form.old_price ? Number(form.old_price) : null,
            discount:  Number(form.discount),
        };

        const product = await createProduct(payload);
        if (!product.id) {
            setError(JSON.stringify(product));
            setSaving(false);
            return;
        }

        for (let i = 0; i < photos.length; i++) {
            await uploadProductImage(product.id, photos[i].file, i);
        }

        setSaving(false);
        onSuccess();
    };

    const f = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

    return (
        <div className="pap-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="pap-modal">

                <div className="pap-header">
                    <h2 className="pap-title">Новий товар</h2>
                    <button className="pap-close" onClick={onClose}>✕</button>
                </div>

                {error && <p className="pap-error">{error}</p>}

                <form className="pap-form" onSubmit={handleSubmit}>

                    {/* ── Основна інфо ── */}
                    <div className="pap-row">
                        <select className="pap-input pap-input--grow" required value={form.category} onChange={f('category')}>
                            <option value="">-- Оберіть категорію --</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                            ))}
                        </select>
                        <input className="pap-input pap-input--sm" placeholder="Emoji" value={form.emoji} onChange={f('emoji')} />
                        <label className="pap-color-label" title="Колір фону">
                            <input type="color" value={form.bg} onChange={f('bg')} />
                            <span style={{ background: form.bg }} className="pap-color-preview" />
                        </label>
                    </div>

                    <input className="pap-input" placeholder="Назва товару" required value={form.name} onChange={f('name')} />
                    <textarea className="pap-input pap-textarea" placeholder="Опис" value={form.description} onChange={f('description')} />

                    <div className="pap-row">
                        <input className="pap-input" type="number" step="0.01" placeholder="Ціна ₴" required value={form.price} onChange={f('price')} />
                        <input className="pap-input" type="number" step="0.01" placeholder="Стара ціна ₴" value={form.old_price} onChange={f('old_price')} />
                        <input className="pap-input pap-input--sm" type="number" placeholder="Знижка %" value={form.discount} onChange={f('discount')} />
                    </div>

                    {/* ── Фотографії ── */}
                    <div className="pap-photos-label">
                        Фотографії <span className="pap-photos-count">{photos.length}/{MAX_PHOTOS}</span>
                        <span className="pap-photos-hint">Перетягніть щоб змінити порядок</span>
                    </div>

                    <div
                        className={`pap-drop-zone ${photos.length === 0 ? 'pap-drop-zone--empty' : ''}`}
                        onDragOver={handleDropZone}
                        onDrop={handleDropZone}
                        onClick={() => photos.length < MAX_PHOTOS && fileRef.current?.click()}
                    >
                        {photos.length === 0 && (
                            <div className="pap-drop-placeholder">
                                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                                    <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z"/>
                                </svg>
                                <p>Натисніть або перетягніть фото сюди</p>
                                <span>До {MAX_PHOTOS} фото</span>
                            </div>
                        )}

                        {photos.length > 0 && (
                            <div className="pap-photos-grid">
                                {photos.map((ph, i) => (
                                    <div
                                        key={ph.preview}
                                        className={`pap-photo-card ${dragOver === i ? 'pap-photo-card--over' : ''} ${i === 0 ? 'pap-photo-card--main' : ''}`}
                                        draggable
                                        onDragStart={e => onDragStart(e, i)}
                                        onDragOver={e => onDragOver(e, i)}
                                        onDrop={e => onDrop(e, i)}
                                        onDragEnd={onDragEnd}
                                    >
                                        <img src={ph.preview} alt="" />
                                        {i === 0 && <span className="pap-main-badge">Головне</span>}
                                        <button
                                            type="button"
                                            className="pap-photo-remove"
                                            onClick={e => { e.stopPropagation(); removePhoto(i); }}
                                        >✕</button>
                                        <div className="pap-drag-handle" title="Перетягнути">⠿</div>
                                    </div>
                                ))}

                                {photos.length < MAX_PHOTOS && (
                                    <div className="pap-photo-add" onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}>
                                        <span>+</span>
                                        <span>Додати фото</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleFileInput} />

                    <div className="pap-actions">
                        <button type="button" className="pap-btn pap-btn--cancel" onClick={onClose}>Скасувати</button>
                        <button type="submit" className="pap-btn pap-btn--submit" disabled={saving}>
                            {saving ? 'Збереження...' : '✓ Додати товар'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductAddPage;
