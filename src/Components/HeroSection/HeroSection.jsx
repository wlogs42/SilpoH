import { useState, useEffect } from "react";
import "./HeroSection.css";

const slides = [
    {
        gradient: "linear-gradient(135deg, #2E2A80 0%, #4A3FC8 45%, #5B6FE8 100%)",
        title: "ТІЛЬКИ\nОНЛАЙН",
        date: "11.06.2026 – 17.06.2026",
        btn: "За покупками",
    },
    {
        gradient: "linear-gradient(135deg, #1A5C2E 0%, #2E9E50 45%, #4DC878 100%)",
        title: "СВІЖІ\nПРОДУКТИ",
        date: "Щодня нові надходження",
        btn: "Обрати",
    },
    {
        gradient: "linear-gradient(135deg, #8B1A1A 0%, #C8392A 45%, #E8604A 100%)",
        title: "ГАРЯЧА\nЗНИЖКА",
        date: "Тільки сьогодні -30%",
        btn: "Скористатись",
    },
];

const HeroSection = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % slides.length);
        }, 3500);
        return () => clearInterval(timer);
    }, []);

    const prev = () => setCurrent(c => (c - 1 + slides.length) % slides.length);
    const next = () => setCurrent(c => (c + 1) % slides.length);

    const slide = slides[current];

    return (
    <section className="hero-section">
        <div className="promo-banner" style={{ background: slide.gradient }}>
            <button className="slider-btn slider-btn--left" onClick={prev}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                </svg>
            </button>
            <div className="promo-content">
                <h2 className="promo-title">{slide.title.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}</h2>
                <p className="promo-date">{slide.date}</p>
                <button className="promo-shop-btn">{slide.btn}</button>
            </div>
            <div className="slider-dots">
                {slides.map((_, i) => (
                    <button key={i} className={`dot ${i === current ? 'dot--active' : ''}`} onClick={() => setCurrent(i)} />
                ))}
            </div>
            <button className="slider-btn slider-btn--right" onClick={next}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                </svg>
            </button>
        </div>

        <div className="quick-links">
            <div className="ql-card ql-card--purple">
                <span className="ql-title">Мої пропозиції</span>
                <div className="ql-icon ql-icon--silpo">б</div>
            </div>
            <div className="ql-card">
                <span className="ql-title">Всі акції</span>
                <div className="ql-icon ql-icon--sale">%</div>
            </div>
            <div className="ql-card">
                <span className="ql-title">Цінотижики</span>
                <div className="ql-icon ql-icon--week">Ціно<br/>Тижики</div>
            </div>
            <div className="ql-card">
                <span className="ql-title">Рецепти</span>
                <div className="ql-icon ql-icon--recipe">
                    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                        <circle cx="26" cy="26" r="26" fill="#F47B20"/>
                        <path d="M16 34c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                        <circle cx="26" cy="20" r="5" stroke="white" strokeWidth="2.5"/>
                    </svg>
                </div>
            </div>
        </div>
    </section>
    );
};

export default HeroSection;
