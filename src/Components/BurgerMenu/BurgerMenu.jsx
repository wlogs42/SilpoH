import "./BurgerMenu.css";

const menu = {
    top: [
        {
            title: "Для Гостей",
            items: [
                { label: "Допомога ЗСУ" },
                { label: "Донат на АЗОВ.ONE" },
                { label: "Про Власний Рахунок" },
                { label: "Запитання та відповіді" },
                { label: "«Сільпо» для Бізнесу" },
                { label: "Курячий цирк Брагаря" },
                { label: "Супермаркети" },
                { label: "Новини" },
                { label: "Події" },
                { label: "Контакти" },
            ],
        },
        {
            title: "Акції та пропозиції",
            items: [
                { label: "Всі Акції" },
                { label: "Цінотижики" },
                { label: "Знижковики" },
                { label: "Все про Японію" },
                { label: "Акції Власного імпорту" },
                { label: "Категорійний каталог «Сільпо»" },
                { label: "Інші акції" },
            ],
        },
        {
            title: "Цікавинки",
            items: [
                { label: "Дизайнерські супермаркети" },
                { label: "Фудхолі «Сільпо Resto»" },
                { label: "Простір Фестирудзи" },
                { label: "Жуїстика Сільпо" },
                { label: "Екодружність" },
                { label: "«Лавка Традицій»" },
                { label: "«Власна кондитерська»", blue: true },
                { label: "Кур'єри-партнери" },
                { label: "більше Цікавинок" },
            ],
        },
    ],
    bottom: [
        {
            title: "Робота в «Сільпо»",
            items: [
                { label: "Вакансії" },
                { label: "Програма стажування" },
                { label: "Щоденник надихаючих історій" },
            ],
        },
        { title: "Подарункові сертифікати", items: [] },
        { title: "Підписка Власний Рахунок Плюхс", items: [] },
    ],
    brands: ["Власний Імпорт", "Власна Кондитерська", "Лавка Традицій", "КРАФТЯР", "ПРЕМІЯ"],
};

const BurgerMenu = ({ onClose }) => (
    <>
        <div className="bm-backdrop" onClick={onClose} />

        <div className="bm-panel">
            <div className="bm-body">

                {/* Top section – 3 columns + promo card */}
                <div className="bm-top">
                    {menu.top.map(col => (
                        <div key={col.title} className="bm-col">
                            <h3 className="bm-col-title">{col.title}</h3>
                            {col.items.map(item => (
                                <a key={item.label} className={`bm-link ${item.blue ? "bm-link--blue" : ""}`}>
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    ))}

                    <div className="bm-promo-card">
                        <p className="bm-promo-text">
                            У доставку «Сільпо» та LOKO запрошуються кур'єри та кур'єрки
                        </p>
                        <div className="bm-promo-people">👥</div>
                    </div>
                </div>

                <hr className="bm-divider" />

                {/* Bottom section – 3 columns */}
                <div className="bm-bottom">
                    {menu.bottom.map(col => (
                        <div key={col.title} className="bm-col">
                            <h3 className="bm-col-title">{col.title}</h3>
                            {col.items.map(item => (
                                <a key={item.label} className="bm-link">{item.label}</a>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="bm-footer">
                <div className="bm-footer-nav">
                    <a className="bm-footer-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5v-5h3v5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354z"/>
                        </svg>
                        Головна
                    </a>
                    <a className="bm-footer-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#F47B20" viewBox="0 0 16 16">
                            <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                            <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                        </svg>
                        Мобільний застосунок
                    </a>
                </div>

                <div className="bm-footer-brands">
                    {menu.brands.map(b => (
                        <span key={b} className="bm-brand">{b}</span>
                    ))}
                </div>

                <div className="bm-footer-phone">
                    <span className="bm-hotline-label">Гаряча лінія</span>
                    <a className="bm-hotline-num">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{marginRight: 5}}>
                            <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58z"/>
                        </svg>
                        0 800 301 707
                    </a>
                </div>
            </div>
        </div>
    </>
);

export default BurgerMenu;
