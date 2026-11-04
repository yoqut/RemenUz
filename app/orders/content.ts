// "My orders" copy and demo data, extracted from design/GlassOrders.dc.html

export type OrderStatus = "accepted" | "confirmed" | "invoice" | "shipping" | "done";

export const O = {
  ru: {
    eyebrow: "ЛИЧНЫЙ КАБИНЕТ", title: "Мои заказы", authTitle: "Вход по номеру телефона", authText: "Укажите номер, на который оформляли заказ, — покажем все ваши заказы и их статус.",
    phoneL: "Телефон", codeL: "Код из SMS", codeHint: "Отправили код на ваш номер. Демо: введите любые 4 цифры.", sendBtn: "Получить код", loginBtn: "Показать заказы", changeL: "Изменить номер",
    errPhone: "Введите номер телефона — минимум 9 цифр.", errCode: "Введите 4 цифры из SMS.",
    whyTitle: "Что можно сделать",
    why: [
      { n: "01", t: "Посмотреть статус заказа и этап доставки" },
      { n: "02", t: "Узнать трек-номер Fargo для доставки в регионы" },
      { n: "03", t: "Повторить прошлый заказ в один клик" },
    ],
    tgL: "Или спросите статус в Telegram-боте",
    logoutL: "Выйти", filterL: "Фильтр заказов", fAll: "Все", fActive: "Активные", fDone: "Завершённые", sum: "сум", open: "Подробнее", close: "Свернуть", repeatL: "Повторить заказ", askL: "Вопрос по заказу", statusL: "Статус",
    emptyL: "Здесь пока пусто.", demoNote: "Пример данных для дизайна. На сайте заказы подтянутся из системы учёта по номеру телефона.", pos: "поз.",
    st: { accepted: "Принят", confirmed: "Подтверждён", invoice: "Ожидает оплату", shipping: "В пути", done: "Доставлен" } as Record<OrderStatus, string>,
    tl: ["Заказ принят", "Подтверждён менеджером", "Собран на складе", "Передан в доставку", "Доставлен"],
  },
  uz: {
    eyebrow: "SHAXSIY KABINET", title: "Buyurtmalarim", authTitle: "Telefon raqam orqali kirish", authText: "Buyurtma bergan raqamingizni kiriting — barcha buyurtmalaringiz va holatini koʻrsatamiz.",
    phoneL: "Telefon", codeL: "SMS kod", codeHint: "Raqamingizga kod yubordik. Demo: istalgan 4 ta raqamni kiriting.", sendBtn: "Kod olish", loginBtn: "Buyurtmalarni koʻrsatish", changeL: "Raqamni oʻzgartirish",
    errPhone: "Telefon raqamini kiriting — kamida 9 ta raqam.", errCode: "SMS dagi 4 ta raqamni kiriting.",
    whyTitle: "Nimalar qilish mumkin",
    why: [
      { n: "01", t: "Buyurtma holati va yetkazish bosqichini koʻrish" },
      { n: "02", t: "Viloyatlarga yetkazish uchun Fargo trek-raqamini bilish" },
      { n: "03", t: "Oldingi buyurtmani bir bosishda takrorlash" },
    ],
    tgL: "Yoki holatni Telegram-botdan soʻrang",
    logoutL: "Chiqish", filterL: "Buyurtmalar filtri", fAll: "Barchasi", fActive: "Faol", fDone: "Yakunlangan", sum: "soʻm", open: "Batafsil", close: "Yopish", repeatL: "Buyurtmani takrorlash", askL: "Buyurtma boʻyicha savol", statusL: "Holat",
    emptyL: "Bu yerda hozircha boʻsh.", demoNote: "Dizayn uchun namunaviy maʼlumotlar. Saytda buyurtmalar telefon raqami boʻyicha hisob tizimidan olinadi.", pos: "ta",
    st: { accepted: "Qabul qilindi", confirmed: "Tasdiqlandi", invoice: "Toʻlov kutilmoqda", shipping: "Yoʻlda", done: "Yetkazildi" } as Record<OrderStatus, string>,
    tl: ["Buyurtma qabul qilindi", "Menejer tasdiqladi", "Omborda yigʻildi", "Yetkazishga topshirildi", "Yetkazildi"],
  },
};

export type Order = {
  no: string;
  date: string;
  st: OrderStatus;
  stage: number;
  track?: string;
  items: { t: string; q: string; p: number }[];
};

/** Demo orders (same in both languages, as in the design). */
export const ORD: Order[] = [
  { no: "RM-227364", date: "04.11.2026", st: "shipping", stage: 3, track: "FG [ТРЕК-НОМЕР]", items: [{ t: "T5 1645 25 NFT A", q: "1 шт", p: 3068800 }, { t: "8 PJ 1059 MEGADYNE PV BELT", q: "2 шт", p: 277760 }, { t: "Ø 6 мм, круглого сечения", q: "10 м", p: 380800 }] },
  { no: "RM-215880", date: "21.10.2026", st: "invoice", stage: 1, items: [{ t: "25 AT5 3215 NOVOBELT PERFORMANCE", q: "1 шт", p: 900480 }] },
  { no: "RM-201447", date: "02.10.2026", st: "done", stage: 4, items: [{ t: "10 T10 530 MEGADYNE MEGAPOWER2", q: "2 шт", p: 396480 }, { t: "8 mm 875 Li BANDO", q: "4 шт", p: 71680 }] },
];

export const BADGE: Record<OrderStatus, [string, string]> = {
  shipping: ["rgba(47,107,255,.28)", "rgba(140,175,255,.7)"],
  invoice: ["rgba(255,170,60,.25)", "rgba(255,200,120,.7)"],
  done: ["rgba(18,181,166,.28)", "rgba(124,242,201,.7)"],
  accepted: ["rgba(255,255,255,.12)", "rgba(255,255,255,.4)"],
  confirmed: ["rgba(255,255,255,.12)", "rgba(255,255,255,.4)"],
};
