import { useState, useEffect } from 'react';
import './App.css';
import TopBanner from './Components/TopBanner/TopBanner';
import Header from './Components/Header/Header';
import HeroSection from './Components/HeroSection/HeroSection';
import ProductsSection from './Components/ProductsSection/ProductsSection';
import CategoriesSection from './Components/CategoriesSection/CategoriesSection';
import AllProductsView from './Components/AllProductsView/AllProductsView';
import CategoryPage from './Components/CategoryPage/CategoryPage';
import BurgerMenu from './Components/BurgerMenu/BurgerMenu';
import AuthPage from './Components/AuthPage/AuthPage';
import AdminPage from './Components/AdminPage/AdminPage';
import ProfilePage from './Components/ProfilePage/ProfilePage';
import { logout, fetchMe } from './api';

const App = () => {
    const [showBurger,  setShowBurger]  = useState(false);
    const [showMenu,    setShowMenu]    = useState(false);
    const [showAuth,    setShowAuth]    = useState(false);
    const [showAdmin,   setShowAdmin]   = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    const [user, setUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem('user')) || null; }
        catch { return null; }
    });

    useEffect(() => {
        if (localStorage.getItem('token') && !user) {
            fetchMe().then(me => {
                if (me) {
                    localStorage.setItem('user', JSON.stringify(me));
                    setUser(me);
                }
            });
        }
    }, []);

    const goHome = () => { setShowBurger(false); setShowMenu(false); setSelectedCategoryId(null); };
    const toggleMenu   = () => { setShowMenu(p => !p); setShowBurger(false); setSelectedCategoryId(null); };
    const toggleBurger = () => { setShowBurger(p => !p); setShowMenu(false); };

    const goCategory = (id) => {
        setSelectedCategoryId(id);
        setShowMenu(false);
        setShowBurger(false);
    };

    const handleAuthSuccess = (userData) => {
        setShowAuth(false);
        if (userData) setUser(userData);
    };

    const handleLogout = async () => {
        await logout();
        setUser(null);
    };

    const handleUserUpdate = (updates) => {
        setUser(prev => {
            const updated = { ...prev, ...updates };
            localStorage.setItem('user', JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <div>
            <TopBanner />
            <Header
                onLogoClick={goHome}
                onAllProductsClick={toggleMenu}
                isMenuOpen={showMenu}
                onBurgerClick={toggleBurger}
                isBurgerOpen={showBurger}
                user={user}
                onLoginClick={() => setShowAuth(true)}
                onLogout={handleLogout}
                onAdminClick={() => setShowAdmin(true)}
                onProfileClick={() => setShowProfile(true)}
            />

            {showBurger  && <BurgerMenu onClose={() => setShowBurger(false)} />}
            {showAuth    && <AuthPage onSuccess={handleAuthSuccess} />}
            {showAdmin   && <AdminPage onClose={() => setShowAdmin(false)} />}
            {showProfile && user && (
                <ProfilePage
                    user={user}
                    onClose={() => setShowProfile(false)}
                    onUserUpdate={handleUserUpdate}
                />
            )}

            <main>
                {showMenu && <AllProductsView onSubcategoryClick={goCategory} />}
                {!showMenu && selectedCategoryId === null && (
                    <>
                        <HeroSection />
                        <CategoriesSection onCategoryClick={goCategory} />
                        <ProductsSection onCategoryClick={goCategory} />
                    </>
                )}
                {!showMenu && selectedCategoryId !== null && (
                    <CategoryPage
                        categoryId={selectedCategoryId}
                        onBack={() => { setSelectedCategoryId(null); setShowMenu(true); }}
                    />
                )}
            </main>
        </div>
    );
};

export default App;
