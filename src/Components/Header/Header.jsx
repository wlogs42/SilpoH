import { useState } from "react";
import "./Header.css";
import logo from '../../assets/silpoLogo.png';
import UserDropdown from '../UserDropdown/UserDropdown';

const Header = ({
    onLogoClick, onAllProductsClick, isMenuOpen,
    onBurgerClick, isBurgerOpen,
    user, onLoginClick, onLogout, onAdminClick, onProfileClick,
}) => {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <header className="header" style={{ position: 'relative', zIndex: 200 }}>
            <div className="burger-button" onClick={onBurgerClick}>
                {isBurgerOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                    </svg>
                )}
            </div>

            <div className="logo" onClick={onLogoClick} style={{ cursor: 'pointer' }}>
                <img className="img-main-logo-stayls" src={logo} alt="Logo" />
            </div>

            <div className="search-category">
                <div className="category" onClick={onAllProductsClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <rect x="1" y="1" width="7" height="7" rx="1.5" stroke="#F47B20" strokeWidth="2"/>
                        <rect x="12" y="1" width="7" height="7" rx="1.5" stroke="#F47B20" strokeWidth="2"/>
                        <rect x="1" y="12" width="7" height="7" rx="1.5" stroke="#F47B20" strokeWidth="2"/>
                        <rect x="12" y="12" width="7" height="7" rx="1.5" stroke="#F47B20" strokeWidth="2"/>
                    </svg>
                    <p className="category-text">Всі товари</p>
                    {isMenuOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
                        </svg>
                    )}
                </div>

                <div className="search">
                    <div className="search-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                        </svg>
                    </div>
                    <input className="search-input" type="text" placeholder="Я шукаю..." />
                </div>
            </div>

            <div className="delivery">
                <div className="delivery-icon">
                    <i className="bi bi-geo-alt-fill"></i>
                </div>
                <div className="delivery-text">
                    <p className="delivery-title">Доставка</p>
                    <p className="delivery-sub">Вкажіть адресу доставки</p>
                </div>
            </div>

            {/* Кнопка юзера — відносне позиціонування для дропдауну */}
            <div className="register-wrapper">
                {user ? (
                    <div className="register register--active" onClick={() => setShowDropdown(p => !p)}>
                        <i className="bi bi-person-check"></i>
                        <span>{user.username}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16" style={{marginLeft:2}}>
                            <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
                        </svg>
                    </div>
                ) : (
                    <div className="register" onClick={onLoginClick}>
                        <i className="bi bi-person"></i>
                        <span>Увійти</span>
                    </div>
                )}

                {showDropdown && user && (
                    <UserDropdown
                        user={user}
                        onLogout={() => { setShowDropdown(false); onLogout(); }}
                        onAdminClick={() => { setShowDropdown(false); onAdminClick(); }}
                        onProfileClick={() => { setShowDropdown(false); onProfileClick(); }}
                        onClose={() => setShowDropdown(false)}
                    />
                )}
            </div>
        </header>
    );
};

export default Header;
