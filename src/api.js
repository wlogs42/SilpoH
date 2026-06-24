const BASE = 'http://localhost:8000/api';

const authHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Token ${token}` } : {};
};

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function register(data) {
    const res = await fetch(`${BASE}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function login(data) {
    const res = await fetch(`${BASE}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function logout() {
    await fetch(`${BASE}/auth/logout/`, { method: 'POST', headers: { ...authHeaders() } });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

export async function fetchMe() {
    const res = await fetch(`${BASE}/auth/me/`, { headers: { ...authHeaders() } });
    if (!res.ok) return null;
    return res.json();
}

// ── Categories ────────────────────────────────────────────────────────────────

export async function fetchCategories() {
    const res = await fetch(`${BASE}/categories/`);
    return res.json();
}

export async function createCategory(data) {
    const res = await fetch(`${BASE}/categories/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function updateCategory(id, data) {
    const res = await fetch(`${BASE}/categories/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function deleteCategory(id) {
    await fetch(`${BASE}/categories/${id}/`, {
        method: 'DELETE',
        headers: { ...authHeaders() },
    });
}

// ── Products ──────────────────────────────────────────────────────────────────

export async function fetchProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE}/products/${query ? '?' + query : ''}`);
    return res.json();
}

export async function fetchProduct(id) {
    const res = await fetch(`${BASE}/products/${id}/`);
    return res.json();
}

export async function createProduct(data) {
    const res = await fetch(`${BASE}/products/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function updateProduct(id, data) {
    const res = await fetch(`${BASE}/products/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function deleteProduct(id) {
    await fetch(`${BASE}/products/${id}/`, {
        method: 'DELETE',
        headers: { ...authHeaders() },
    });
}

export async function uploadProductImage(productId, file, order = 0) {
    const form = new FormData();
    form.append('image', file);
    form.append('order', order);
    const res = await fetch(`${BASE}/products/${productId}/images/`, {
        method: 'POST',
        headers: { ...authHeaders() },
        body: form,
    });
    return res.json();
}

export async function deleteProductImage(imageId) {
    await fetch(`${BASE}/images/${imageId}/`, {
        method: 'DELETE',
        headers: { ...authHeaders() },
    });
}

// ── Profile ───────────────────────────────────────────────────────────────────

export async function fetchProfile() {
    const res = await fetch(`${BASE}/auth/profile/`, { headers: { ...authHeaders() } });
    if (!res.ok) return null;
    return res.json();
}

export async function updateProfile(data) {
    const res = await fetch(`${BASE}/auth/profile/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function uploadAvatar(file) {
    const form = new FormData();
    form.append('avatar', file);
    const res = await fetch(`${BASE}/auth/avatar/`, {
        method: 'POST',
        headers: { ...authHeaders() },
        body: form,
    });
    return res.json();
}

export async function deleteAvatar() {
    await fetch(`${BASE}/auth/avatar/`, {
        method: 'DELETE',
        headers: { ...authHeaders() },
    });
}

export async function changeEmail(data) {
    const res = await fetch(`${BASE}/auth/change-email/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function changePassword(data) {
    const res = await fetch(`${BASE}/auth/change-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function postReview(productId, data) {
    const res = await fetch(`${BASE}/products/${productId}/reviews/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
    });
    return res.json();
}
