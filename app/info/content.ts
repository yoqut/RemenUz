// Info-page dictionaries (from design/GlassInfo.dc.html, `IP`).

export const SLUGS = ["about", "contacts", "news", "brands", "offer", "howto", "delivery", "payment", "returns", "inst"] as const;
export type Slug = (typeof SLUGS)[number];

export const COMPANY: Slug[] = ["about", "contacts", "news", "brands", "offer"];
export const BUYERS: Slug[] = ["howto", "delivery", "payment", "returns", "inst"];

export const isSlug = (s: string): s is Slug => (SLUGS as readonly string[]).includes(s);

export type InfoCard = { n: string; h: string; d: string; href?: string; cta?: string };
export type InfoPage = { g: "company" | "buyers"; label: string; title: string; lead: string; cards: InfoCard[]; note: string };
export type InfoDict = {
  navLabel: string;
  helpT: string;
  helpD: string;
  groups: { company: string; buyers: string; info: string };
  pages: Record<Slug, InfoPage>;
  infoLinks: { label: string }[];
};

export const IP: { ru: InfoDict; uz: InfoDict } = {
  ru: {
    navLabel: "Разделы", helpT: "Остались вопросы?", helpD: "Поддержка 24/7 — ответим в Telegram, WhatsApp или по телефону.",
    groups: { company: "КОМПАНИЯ", buyers: "ПОКУПАТЕЛЯМ", info: "ИНФОРМАЦИЯ" },
    pages: {
      about: { g: "company", label: "О нас", title: "О компании", lead: "Remen.uz — интернет-магазин приводных ремней и конвейерных лент в Ташкенте. Помогаем предприятиям быстро найти замену ремню — по артикулу, размерам или образцу.",
        cards: [
          { n: "01", h: "Ассортимент", d: "Зубчатые, поликлиновые, клиновые и круглые ремни, конвейерные ленты, инструменты для монтажа." },
          { n: "02", h: "Бренды", d: "Megadyne, Bando, PIX, Novobelt." },
          { n: "03", h: "Подбор", d: "Определим ремень по маркировке, замерам или фото старого образца.", href: "/guide", cta: "Как измерить ремень" },
          { n: "04", h: "Где купить", d: "На сайте, в Telegram-боте и в магазинах Remen.uz на маркетплейсах." },
        ], note: "[ИСТОРИЯ КОМПАНИИ · ЦИФРЫ · ФОТО СКЛАДА]" },
      contacts: { g: "company", label: "Контакты", title: "Контакты", lead: "Поддержка 24/7: ответим в Telegram, WhatsApp или по телефону.",
        cards: [
          { n: "TEL", h: "+998 78 777 11 88", d: "Телефон отдела продаж", href: "tel:+998787771188", cta: "Позвонить" },
          { n: "WA", h: "+998 93 550 95 90", d: "WhatsApp", href: "https://wa.me/998935509590", cta: "Написать" },
          { n: "BOT", h: "@Remenuz_bot", d: "Telegram-бот: заказ, подбор по фото, статус", href: "https://t.me/Remenuz_bot", cta: "Открыть бота" },
          { n: "TG", h: "@remen_uz_store", d: "Telegram-канал: новинки и акции", href: "https://t.me/remen_uz_store", cta: "Подписаться" },
          { n: "IG", h: "@remen_uz_store", d: "Instagram", href: "https://instagram.com/remen_uz_store", cta: "Открыть" },
          { n: "ADR", h: "ул. Чинабад 1, Юнус-Абад", d: "Ташкент, 100039, Узбекистан" },
        ], note: "[КАРТА] · [ЧАСЫ РАБОТЫ СКЛАДА]" },
      news: { g: "company", label: "Новости", title: "Новости", lead: "Новинки каталога, акции и полезные материалы.",
        cards: [
          { n: "28 окт.", h: "Приводные ремни для промышленного оборудования", d: "[КРАТКОЕ ОПИСАНИЕ СТАТЬИ]", href: "#", cta: "Читать" },
          { n: "[ДАТА]", h: "[ЗАГОЛОВОК НОВОСТИ]", d: "[КРАТКИЙ ТЕКСТ]" },
          { n: "[ДАТА]", h: "[ЗАГОЛОВОК НОВОСТИ]", d: "[КРАТКИЙ ТЕКСТ]" },
        ], note: "" },
      brands: { g: "company", label: "Бренды", title: "Бренды", lead: "Производители приводной техники в нашем каталоге.",
        cards: [
          { n: "MEGADYNE", h: "Megadyne", d: "Зубчатые MEGAPOWER2 и MEGASYNC SILVER3, поликлиновые PV BELT." },
          { n: "BANDO", h: "Bando", d: "Клиновые ремни классических профилей." },
          { n: "PIX", h: "PIX", d: "[ЛИНЕЙКИ PIX В КАТАЛОГЕ]" },
          { n: "NOVOBELT", h: "Novobelt", d: "Зубчатые ремни AT5 и T10, в том числе с профилями." },
        ], note: "[ЛОГОТИПЫ БРЕНДОВ · СТРАНА ПРОИЗВОДИТЕЛЯ]" },
      offer: { g: "company", label: "Оферта", title: "Публичная оферта", lead: "Условия продажи товаров через сайт Remen.uz.",
        cards: [
          { n: "1", h: "Общие положения", d: "[ТЕКСТ]" }, { n: "2", h: "Предмет договора", d: "[ТЕКСТ]" },
          { n: "3", h: "Оформление и оплата", d: "[ТЕКСТ]" }, { n: "4", h: "Доставка", d: "[ТЕКСТ]" },
          { n: "5", h: "Возврат", d: "[ТЕКСТ]" }, { n: "6", h: "Реквизиты продавца", d: "[РЕКВИЗИТЫ REMEN.UZ]" },
        ], note: "Юридический текст оферты нужно получить у юриста компании." },
      howto: { g: "buyers", label: "Как оформить заказ", title: "Как оформить заказ", lead: "Пять шагов от подбора до получения.",
        cards: [
          { n: "01", h: "Найдите ремень", d: "Через каталог, поиск по артикулу или подбор по чертежу.", href: "/guide", cta: "Подбор по чертежу" },
          { n: "02", h: "Добавьте в корзину", d: "Укажите количество — штуки или метры для круглых ремней." },
          { n: "03", h: "Укажите данные", d: "Имя и телефон; для юрлиц — организацию и ИНН." },
          { n: "04", h: "Доставка и оплата", d: "Yandex Go по Ташкенту или Fargo в регионы; наличные, карта, перечисление или рассрочка." },
          { n: "05", h: "Подтверждение", d: "Менеджер свяжется, проверит наличие и сроки.", href: "/cart", cta: "Открыть корзину" },
        ], note: "" },
      delivery: { g: "buyers", label: "Доставка", title: "Доставка", lead: "По Ташкенту — Yandex Go, в регионы — службой Fargo.",
        cards: [
          { n: "TAS", h: "Ташкент — Yandex Go", d: "Бесплатно при заказе от 3 000 000 сум. До этой суммы — по тарифу Yandex Go." },
          { n: "FARGO", h: "Регионы Узбекистана", d: "Курьерская служба Fargo. Тариф и срок — [ТАРИФ FARGO]. Трек-номер пришлём в Telegram или SMS." },
          { n: "SKLAD", h: "Самовывоз", d: "[УСЛОВИЯ САМОВЫВОЗА] · ул. Чинабад 1, Юнус-Абад." },
          { n: "TIME", h: "Сроки", d: "[СРОКИ ОТГРУЗКИ И ДОСТАВКИ]" },
        ], note: "" },
      payment: { g: "buyers", label: "Оплата", title: "Оплата", lead: "Принимаем наличный и безналичный расчёт, банковские карты, онлайн-платёж.",
        cards: [
          { n: "CASH", h: "Наличными", d: "При получении заказа." },
          { n: "CARD", h: "Банковской картой", d: "Онлайн при оформлении — [ПЛАТЁЖНЫЙ СЕРВИС]." },
          { n: "BANK", h: "Перечислением", d: "Для юридических лиц: счёт и договор." },
          { n: "INST", h: "Рассрочка", d: "Условия уточнит менеджер." },
        ], note: "" },
      returns: { g: "buyers", label: "Возврат", title: "Возврат", lead: "Если ремень не подошёл — свяжитесь с нами, решим вопрос.",
        cards: [
          { n: "01", h: "Свяжитесь с нами", d: "Напишите в Telegram или позвоните, укажите номер заказа." },
          { n: "02", h: "Условия возврата", d: "[СРОК И УСЛОВИЯ ВОЗВРАТА]" },
          { n: "03", h: "Возврат средств", d: "[СПОСОБ И СРОК ВОЗВРАТА ДЕНЕГ]" },
        ], note: "" },
      inst: { g: "buyers", label: "Рассрочка", title: "Рассрочка", lead: "Покупайте ремни для производства с оплатой частями.",
        cards: [
          { n: "01", h: "Условия", d: "[ПАРТНЁР · СРОК · ПЕРВЫЙ ВЗНОС]" },
          { n: "02", h: "Как оформить", d: "Выберите «Рассрочка» при оформлении заказа — менеджер уточнит условия.", href: "/cart", cta: "В корзину" },
        ], note: "" },
    },
    infoLinks: [{ label: "Корпоративным клиентам" }, { label: "Партнёрам" }],
  },
  uz: {
    navLabel: "Boʻlimlar", helpT: "Savollaringiz bormi?", helpD: "Qoʻllab-quvvatlash 24/7 — Telegram, WhatsApp yoki telefon orqali javob beramiz.",
    groups: { company: "KOMPANIYA", buyers: "XARIDORLAR UCHUN", info: "MAʼLUMOT" },
    pages: {
      about: { g: "company", label: "Biz haqimizda", title: "Kompaniya haqida", lead: "Remen.uz — Toshkentdagi uzatma tasmalari va konveyer lentalari internet-doʻkoni. Korxonalarga tasma oʻrnini tez topishga yordam beramiz — artikul, oʻlcham yoki namuna boʻyicha.",
        cards: [
          { n: "01", h: "Assortiment", d: "Tishli tasmalar, V-tip chiziqli va V-tip kamarlar, dumaloq tasmalar, konveyer lentalari, oʻrnatish asboblari." },
          { n: "02", h: "Brendlar", d: "Megadyne, Bando, PIX, Novobelt." },
          { n: "03", h: "Tanlash", d: "Tasmani markirovka, oʻlchamlar yoki eski namuna rasmi boʻyicha aniqlaymiz.", href: "/guide", cta: "Tasmani qanday oʻlchash" },
          { n: "04", h: "Qayerdan xarid qilish", d: "Saytda, Telegram-botda va marketpleyslardagi Remen.uz doʻkonlarida." },
        ], note: "[KOMPANIYA TARIXI · RAQAMLAR · OMBOR RASMLARI]" },
      contacts: { g: "company", label: "Kontaktlar", title: "Kontaktlar", lead: "Qoʻllab-quvvatlash 24/7: Telegram, WhatsApp yoki telefon orqali javob beramiz.",
        cards: [
          { n: "TEL", h: "+998 78 777 11 88", d: "Sotuv boʻlimi telefoni", href: "tel:+998787771188", cta: "Qoʻngʻiroq qilish" },
          { n: "WA", h: "+998 93 550 95 90", d: "WhatsApp", href: "https://wa.me/998935509590", cta: "Yozish" },
          { n: "BOT", h: "@Remenuz_bot", d: "Telegram-bot: buyurtma, rasm boʻyicha tanlash, holat", href: "https://t.me/Remenuz_bot", cta: "Botni ochish" },
          { n: "TG", h: "@remen_uz_store", d: "Telegram-kanal: yangiliklar va aksiyalar", href: "https://t.me/remen_uz_store", cta: "Obuna boʻlish" },
          { n: "IG", h: "@remen_uz_store", d: "Instagram", href: "https://instagram.com/remen_uz_store", cta: "Ochish" },
          { n: "ADR", h: "Chinobod koʻchasi, 1, Yunusobod", d: "Toshkent, 100039, Oʻzbekiston" },
        ], note: "[XARITA] · [OMBOR ISH VAQTI]" },
      news: { g: "company", label: "Yangiliklar", title: "Yangiliklar", lead: "Katalog yangiliklari, aksiyalar va foydali materiallar.",
        cards: [
          { n: "28 okt.", h: "Sanoat uskunalari uchun uzatma tasmalari", d: "[MAQOLA QISQACHA MAZMUNI]", href: "#", cta: "Oʻqish" },
          { n: "[SANA]", h: "[YANGILIK SARLAVHASI]", d: "[QISQA MATN]" },
          { n: "[SANA]", h: "[YANGILIK SARLAVHASI]", d: "[QISQA MATN]" },
        ], note: "" },
      brands: { g: "company", label: "Brendlar", title: "Brendlar", lead: "Katalogimizdagi uzatma texnikasi ishlab chiqaruvchilari.",
        cards: [
          { n: "MEGADYNE", h: "Megadyne", d: "MEGAPOWER2 va MEGASYNC SILVER3 tishli, PV BELT V-tip chiziqli kamarlar." },
          { n: "BANDO", h: "Bando", d: "Klassik profilli V-tip kamarlar." },
          { n: "PIX", h: "PIX", d: "[KATALOGDAGI PIX MAHSULOTLARI]" },
          { n: "NOVOBELT", h: "Novobelt", d: "AT5 va T10 tishli tasmalar, shu jumladan profilli." },
        ], note: "[BRENDLAR LOGOTIPLARI · ISHLAB CHIQARUVCHI DAVLAT]" },
      offer: { g: "company", label: "Oferta", title: "Ommaviy oferta", lead: "Remen.uz sayti orqali tovarlarni sotish shartlari.",
        cards: [
          { n: "1", h: "Umumiy qoidalar", d: "[MATN]" }, { n: "2", h: "Shartnoma predmeti", d: "[MATN]" },
          { n: "3", h: "Buyurtma va toʻlov", d: "[MATN]" }, { n: "4", h: "Yetkazib berish", d: "[MATN]" },
          { n: "5", h: "Qaytarish", d: "[MATN]" }, { n: "6", h: "Sotuvchi rekvizitlari", d: "[REMEN.UZ REKVIZITLARI]" },
        ], note: "Ofertaning yuridik matnini kompaniya yuristidan olish kerak." },
      howto: { g: "buyers", label: "Buyurtma qanday beriladi", title: "Buyurtma qanday beriladi", lead: "Tanlashdan olishgacha besh qadam.",
        cards: [
          { n: "01", h: "Tasmani toping", d: "Katalog, artikul boʻyicha qidiruv yoki chizma boʻyicha tanlash orqali.", href: "/guide", cta: "Chizma boʻyicha tanlash" },
          { n: "02", h: "Savatga qoʻshing", d: "Miqdorni kiriting — dona yoki dumaloq tasmalar uchun metr." },
          { n: "03", h: "Maʼlumotlarni kiriting", d: "Ism va telefon; yuridik shaxslar uchun — tashkilot va INN." },
          { n: "04", h: "Yetkazish va toʻlov", d: "Toshkent boʻylab Yandex Go yoki viloyatlarga Fargo; naqd, karta, pul oʻtkazish yoki boʻlib toʻlash." },
          { n: "05", h: "Tasdiqlash", d: "Menejer bogʻlanib, mavjudlik va muddatlarni tekshiradi.", href: "/cart", cta: "Savatni ochish" },
        ], note: "" },
      delivery: { g: "buyers", label: "Yetkazib berish", title: "Yetkazib berish", lead: "Toshkent boʻylab — Yandex Go, viloyatlarga — Fargo xizmati.",
        cards: [
          { n: "TAS", h: "Toshkent — Yandex Go", d: "3 000 000 soʻmdan ortiq buyurtmada bepul. Undan kam boʻlsa — Yandex Go tarifi boʻyicha." },
          { n: "FARGO", h: "Oʻzbekiston viloyatlari", d: "Fargo kuryerlik xizmati. Tarif va muddat — [FARGO TARIFI]. Trek-raqamni Telegram yoki SMS orqali yuboramiz." },
          { n: "SKLAD", h: "Olib ketish", d: "[OLIB KETISH SHARTLARI] · Chinobod koʻchasi, 1, Yunusobod." },
          { n: "TIME", h: "Muddatlar", d: "[JOʻNATISH VA YETKAZISH MUDDATLARI]" },
        ], note: "" },
      payment: { g: "buyers", label: "Toʻlov", title: "Toʻlov", lead: "Naqd va naqdsiz hisob-kitob, bank kartalari, onlayn toʻlov qabul qilamiz.",
        cards: [
          { n: "CASH", h: "Naqd pul", d: "Buyurtmani olishda." },
          { n: "CARD", h: "Bank kartasi", d: "Buyurtma berishda onlayn — [TOʻLOV XIZMATI]." },
          { n: "BANK", h: "Pul oʻtkazish", d: "Yuridik shaxslar uchun: hisob-faktura va shartnoma." },
          { n: "INST", h: "Boʻlib toʻlash", d: "Shartlarni menejer aniqlab beradi." },
        ], note: "" },
      returns: { g: "buyers", label: "Qaytarish", title: "Qaytarish", lead: "Tasma mos kelmasa — biz bilan bogʻlaning, masalani hal qilamiz.",
        cards: [
          { n: "01", h: "Biz bilan bogʻlaning", d: "Telegramga yozing yoki qoʻngʻiroq qiling, buyurtma raqamini ayting." },
          { n: "02", h: "Qaytarish shartlari", d: "[QAYTARISH MUDDATI VA SHARTLARI]" },
          { n: "03", h: "Pulni qaytarish", d: "[PULNI QAYTARISH USULI VA MUDDATI]" },
        ], note: "" },
      inst: { g: "buyers", label: "Boʻlib toʻlash", title: "Boʻlib toʻlash", lead: "Ishlab chiqarish uchun tasmalarni boʻlib toʻlash bilan xarid qiling.",
        cards: [
          { n: "01", h: "Shartlar", d: "[HAMKOR · MUDDAT · BOSHLANGʻICH TOʻLOV]" },
          { n: "02", h: "Qanday rasmiylashtirish", d: "Buyurtma berishda «Boʻlib toʻlash»ni tanlang — menejer shartlarni aniqlaydi.", href: "/cart", cta: "Savatga" },
        ], note: "" },
    },
    infoLinks: [{ label: "Korporativ mijozlarga" }, { label: "Hamkorlarga" }],
  },
};
