import { useState, useMemo } from "react";
import Icon from "@/components/ui/icon";

// ─── данные ───────────────────────────────────────────────────
type CurtainType = { id: string; label: string; filmColor: string; frameColor: string; mesh?: boolean };

const CURTAIN_TYPES: CurtainType[] = [
  { id: "transparent", label: "Прозрачная", filmColor: "#b8e4f0", frameColor: "#6b3a2a" },
  { id: "combined", label: "Комбинированная", filmColor: "#d4c4a0", frameColor: "#6b3a2a" },
  { id: "solid", label: "Однотонная", filmColor: "#8b7355", frameColor: "#6b3a2a" },
  { id: "mosquito", label: "Москитная", filmColor: "#c8c8c8", frameColor: "#6b3a2a", mesh: true },
];

const FILM_OPTIONS: Record<string, { label: string; price: number; rollWidth: number; productWidth: number }[]> = {
  transparent: [
    { label: "Пленка ПВХ прозрачная, 500 мк.", price: 600, rollWidth: 1.4, productWidth: 1.35 },
    { label: "Пленка ПВХ прозрачная, 700 мк.", price: 800, rollWidth: 1.4, productWidth: 1.35 },
    { label: "Пленка ПВХ прозрачная, 1000 мк.", price: 950, rollWidth: 1.4, productWidth: 1.35 },
    { label: "Пленка полиуретановая, 500 мк.", price: 1500, rollWidth: 1.5, productWidth: 1.45 },
    { label: "Пленка полиуретановая, 700 мк.", price: 1700, rollWidth: 1.5, productWidth: 1.45 },
    { label: "Производства Япония «Achilles», 500 мк.", price: 1900, rollWidth: 1.4, productWidth: 1.35 },
  ],
  combined: [
    { label: "ПВХ прозрачная + тентовая, 500 мк.", price: 750, rollWidth: 1.5, productWidth: 1.45 },
    { label: "ПВХ прозрачная + тентовая, 700 мк.", price: 950, rollWidth: 1.5, productWidth: 1.45 },
    { label: "ПВХ прозрачная + Oxford, 500 мк.", price: 850, rollWidth: 1.5, productWidth: 1.45 },
    { label: "ПВХ прозрачная + Oxford, 700 мк.", price: 1050, rollWidth: 1.5, productWidth: 1.45 },
  ],
  solid: [
    { label: "Тентовая ПВХ однотонная, 650 г/м²", price: 480, rollWidth: 1.6, productWidth: 1.55 },
    { label: "Тентовая ПВХ однотонная, 900 г/м²", price: 620, rollWidth: 1.6, productWidth: 1.55 },
    { label: "Oxford 600D водоотталкивающая", price: 390, rollWidth: 1.6, productWidth: 1.55 },
    { label: "Oxford 900D усиленная", price: 520, rollWidth: 1.6, productWidth: 1.55 },
  ],
  mosquito: [
    { label: "Сетка москитная стандарт, 1×1 мм", price: 280, rollWidth: 1.5, productWidth: 1.45 },
    { label: "Сетка москитная мелкая, 0.6×0.6 мм", price: 340, rollWidth: 1.5, productWidth: 1.45 },
    { label: "Сетка антимошка, 0.4×0.4 мм", price: 420, rollWidth: 1.5, productWidth: 1.45 },
    { label: "Сетка усиленная нержавеющая", price: 680, rollWidth: 1.5, productWidth: 1.45 },
  ],
};

const FRAME_COLORS = [
  { id: "brown", label: "Коричневый", hex: "#6b3a2a" },
  { id: "white", label: "Белый", hex: "#f0f0f0" },
  { id: "grey", label: "Серый", hex: "#7a7a7a" },
  { id: "beige", label: "Бежевый", hex: "#c8b89a" },
  { id: "green", label: "Зелёный", hex: "#3a6b3a" },
];

const MOUNT_OPTIONS = [
  { id: "--", label: "--" },
  { id: "skoba_lyuvers", label: "Скоба+люверс с рем." },
  { id: "round_lyuvers", label: "Круглые люверсы" },
  { id: "skoba_large", label: "Скоба большая поворотная" },
  { id: "skoba_small", label: "Скоба малая поворотная" },
];

const PRICES = {
  strap: 180,
  zipper: 350,
  mounting: 290,
  delivery_base: 500,
  delivery_per_km: 35,
};

// ─── компонент превью окна ─────────────────────────────────────
function WindowPreview({ type, width, height }: { type: typeof CURTAIN_TYPES[0]; width: number; height: number }) {
  const maxW = 240, maxH = 180;
  const ratio = Math.min(maxW / Math.max(width, 1), maxH / Math.max(height, 1), 1);
  const pw = Math.round(width * ratio);
  const ph = Math.round(height * ratio);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex items-center justify-center" style={{ width: maxW + 80, height: maxH + 50 }}>
        {/* стрелка высоты */}
        <div className="absolute right-0 flex flex-col items-center gap-0.5" style={{ height: ph + 28 }}>
          <div className="w-px flex-1 bg-[#1a6baa]" />
          <span className="text-[9px] text-[#1a6baa] font-semibold whitespace-nowrap">{height} мм</span>
          <div className="w-px flex-1 bg-[#1a6baa]" />
        </div>
        {/* рамка */}
        <div
          className="relative flex items-center justify-center rounded"
          style={{ width: pw + 28, height: ph + 28, backgroundColor: type.frameColor }}
        >
          {/* пленка */}
          <div
            className="rounded-sm"
            style={{
              width: pw,
              height: ph,
              backgroundColor: type.filmColor,
              backgroundImage: type.mesh
                ? "repeating-linear-gradient(0deg,transparent,transparent 4px,rgba(0,0,0,.18) 4px,rgba(0,0,0,.18) 5px),repeating-linear-gradient(90deg,transparent,transparent 4px,rgba(0,0,0,.18) 4px,rgba(0,0,0,.18) 5px)"
                : undefined,
            }}
          />
        </div>
        {/* стрелка ширины */}
        <div className="absolute bottom-0 flex flex-row items-center gap-0.5" style={{ width: pw + 28 }}>
          <div className="h-px flex-1 bg-[#1a6baa]" />
          <span className="text-[9px] text-[#1a6baa] font-semibold whitespace-nowrap">{width} мм</span>
          <div className="h-px flex-1 bg-[#1a6baa]" />
        </div>
      </div>
    </div>
  );
}

// ─── тоггл ────────────────────────────────────────────────────
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${value ? "bg-[#1a6baa]" : "bg-gray-300"}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${value ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}

// ─── главный компонент ─────────────────────────────────────────
export default function Index() {
  const [curtainType, setCurtainType] = useState("transparent");
  const [filmIdx, setFilmIdx] = useState(0);
  const [frameColor, setFrameColor] = useState("brown");
  const [width, setWidth] = useState(1000);
  const [height, setHeight] = useState(1000);
  const [qty, setQty] = useState(1);
  const [strap, setStrap] = useState(false);
  const [zipperLeft, setZipperLeft] = useState(false);
  const [zipperRight, setZipperRight] = useState(false);
  const [mounting, setMounting] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [mountTop, setMountTop] = useState("--");
  const [mountBottom, setMountBottom] = useState("--");
  const [mountLeft, setMountLeft] = useState("--");
  const [mountRight, setMountRight] = useState("--");
  const [deliveryKm, setDeliveryKm] = useState(0);
  const [items, setItems] = useState<Array<{ label: string; price: number }>>([]);

  const selectedType = CURTAIN_TYPES.find((t) => t.id === curtainType)!;
  const films = FILM_OPTIONS[curtainType];
  const film = films[Math.min(filmIdx, films.length - 1)];

  const unitPrice = useMemo(() => {
    const area = (width / 1000) * (height / 1000);
    let price = film.price * area;
    if (strap) price += PRICES.strap;
    if (zipperLeft) price += PRICES.zipper;
    if (zipperRight) price += PRICES.zipper;
    if (mounting) price += PRICES.mounting;
    price = price * (1 - discount / 100);
    return Math.round(price);
  }, [width, height, film, strap, zipperLeft, zipperRight, mounting, discount]);

  const deliveryCost = deliveryKm > 0 ? PRICES.delivery_base + deliveryKm * PRICES.delivery_per_km : 0;
  const totalItems = items.reduce((s, i) => s + i.price, 0);
  const grandTotal = totalItems + deliveryCost;

  function handleAdd() {
    const extras = [
      strap && "ремешок",
      zipperLeft && "молния слева",
      zipperRight && "молния справа",
      mounting && "монтаж",
    ].filter(Boolean).join(", ");
    const label = `${selectedType.label} ${width}×${height} мм · ${film.label}${extras ? " · " + extras : ""} · ${qty} шт.`;
    const price = unitPrice * qty;
    setItems((prev) => [...prev, { label, price }]);
  }

  const inputCls = "w-full border border-[#d0dde8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6baa]/30 bg-white";
  const labelCls = "block text-xs font-semibold text-gray-500 mb-1";

  return (
    <div className="min-h-screen bg-[#f4f8fb] font-golos">
      {/* шапка */}
      <div className="bg-white border-b border-[#d0dde8] shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1a6baa] flex items-center justify-center shadow">
            <Icon name="Wind" size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800 leading-tight">Калькулятор мягких окон</h1>
            <p className="text-xs text-gray-400">Точный расчёт стоимости ПВХ-штор</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-7 space-y-5">

        {/* блок: тип шторы */}
        <div className="bg-white rounded-2xl border border-[#d0dde8] shadow-sm p-5">
          <h2 className="text-center text-base font-bold text-gray-700 mb-4">Тип шторы</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CURTAIN_TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => { setCurtainType(t.id); setFilmIdx(0); }}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all ${
                  curtainType === t.id
                    ? "border-[#1a6baa] shadow-md bg-blue-50"
                    : "border-[#d0dde8] bg-white hover:border-[#1a6baa]/40 hover:shadow-sm"
                }`}
              >
                <div
                  className="w-full rounded flex items-center justify-center"
                  style={{ height: 52, backgroundColor: t.frameColor }}
                >
                  <div
                    className="rounded-sm"
                    style={{
                      width: "65%", height: 34,
                      backgroundColor: t.filmColor,
                      backgroundImage: t.mesh
                        ? "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.2) 3px,rgba(0,0,0,.2) 4px),repeating-linear-gradient(90deg,transparent,transparent 3px,rgba(0,0,0,.2) 3px,rgba(0,0,0,.2) 4px)"
                        : undefined,
                    }}
                  />
                </div>
                <span className={`text-sm font-medium ${curtainType === t.id ? "text-[#1a6baa]" : "text-gray-600"}`}>
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* блок: параметры */}
        <div className="bg-white rounded-2xl border border-[#d0dde8] shadow-sm p-5">
          <h2 className="text-center text-base font-bold text-[#1a6baa] mb-5">{selectedType.label} штора</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* превью */}
            <div className="flex flex-col items-center justify-start gap-4 pt-2">
              <WindowPreview type={selectedType} width={width} height={height} />
              <p className="text-xs text-gray-400 text-center max-w-xs leading-relaxed">
                Введите ширину, высоту и параметры, нажмите «Добавить к расчёту».{" "}
                <b className="text-gray-500">ВАЖНО:</b> добавляйте 70 мм с каждой стороны к световому проёму.
              </p>
            </div>

            {/* правая колонка */}
            <div className="space-y-4">
              {/* размеры */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Ширина, мм</label>
                  <input type="number" min={100} max={5000} value={width}
                    onChange={(e) => setWidth(Number(e.target.value))} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Высота, мм</label>
                  <input type="number" min={100} max={5000} value={height}
                    onChange={(e) => setHeight(Number(e.target.value))} className={inputCls} />
                </div>
              </div>

              {/* пленка */}
              <div>
                <label className={labelCls}>Выбор пленки</label>
                <select value={filmIdx} onChange={(e) => setFilmIdx(Number(e.target.value))} className={inputCls}>
                  {films.map((f, i) => (
                    <option key={i} value={i}>{f.label} — {f.price} руб./м²</option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  Ширина рулона: <b>{film.rollWidth}</b> &nbsp;·&nbsp; В изделии: <b>{film.productWidth}</b>
                  &nbsp;·&nbsp; Цена: <b className="text-[#1a6baa]">{film.price} руб./м²</b>
                </p>
              </div>

              {/* кол-во + скидка */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Кол-во штор, шт.</label>
                  <input type="number" min={1} max={100} value={qty}
                    onChange={(e) => setQty(Number(e.target.value))} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Ваша скидка, %</label>
                  <input type="number" min={0} max={99} value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))} className={inputCls} />
                </div>
              </div>

              {/* цвет окантовки */}
              <div>
                <label className={labelCls}>Цвет окантовки ПВХ</label>
                <div className="flex gap-2 flex-wrap">
                  {FRAME_COLORS.map((c) => (
                    <button key={c.id} title={c.label} onClick={() => setFrameColor(c.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                        frameColor === c.id
                          ? "border-[#1a6baa] bg-blue-50 text-[#1a6baa]"
                          : "border-[#d0dde8] text-gray-600 hover:border-[#1a6baa]/40"
                      }`}>
                      <span className="w-3 h-3 rounded-full border border-gray-200 shrink-0" style={{ backgroundColor: c.hex }} />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* доп. параметры */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2.5">
                  <span className="text-xs font-medium text-gray-600">Ремешок</span>
                  <Toggle value={strap} onChange={setStrap} />
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2.5">
                  <span className="text-xs font-medium text-gray-600">Монтаж</span>
                  <Toggle value={mounting} onChange={setMounting} />
                </div>
              </div>

              {/* молнии */}
              <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                <span className="text-xs font-semibold text-gray-500 block mb-2">Молнии:</span>
                <div className="flex gap-5">
                  {[
                    { label: "Слева", val: zipperLeft, set: setZipperLeft },
                    { label: "Справа", val: zipperRight, set: setZipperRight },
                  ].map(({ label, val, set }) => (
                    <label key={label} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={val} onChange={(e) => set(e.target.checked)}
                        className="w-4 h-4 accent-[#1a6baa]" />
                      <span className="text-sm text-gray-600">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* цена */}
              <div className="bg-blue-50 border border-[#1a6baa]/20 rounded-xl px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-600">Стоимость 1 шт.:</span>
                <span className="text-xl font-black text-[#1a6baa]">{unitPrice.toLocaleString("ru-RU")} ₽</span>
              </div>
            </div>
          </div>

          {/* тип крепления */}
          <div className="mt-6 pt-5 border-t border-[#d0dde8]">
            <p className="text-sm font-semibold text-gray-700 text-center">Тип крепления шторы:</p>
            <p className="text-xs text-gray-400 text-center mb-4">(рекомендуемые значения уже выбраны)</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Верх", value: mountTop, set: setMountTop },
                { label: "Низ", value: mountBottom, set: setMountBottom },
                { label: "Слева", value: mountLeft, set: setMountLeft },
                { label: "Справа", value: mountRight, set: setMountRight },
              ].map(({ label, value, set }) => (
                <div key={label}>
                  <label className="block text-xs text-gray-500 text-center mb-1">{label}</label>
                  <select value={value} onChange={(e) => set(e.target.value)}
                    className="w-full border border-[#d0dde8] rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#1a6baa]/30 bg-white">
                    {MOUNT_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* кнопка */}
          <div className="mt-5 flex justify-center">
            <button onClick={handleAdd}
              className="flex items-center gap-2 bg-[#1a6baa] hover:bg-[#155a92] text-white font-bold px-8 py-3 rounded-xl shadow-md transition-all hover:shadow-lg active:scale-95">
              <Icon name="Plus" size={18} />
              Добавить к расчёту
            </button>
          </div>
        </div>

        {/* список позиций */}
        {items.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#d0dde8] shadow-sm p-5">
            <h2 className="text-base font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Icon name="ShoppingCart" size={18} className="text-[#1a6baa]" />
              Позиции расчёта
            </h2>

            <div className="space-y-2 mb-4">
              {items.map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-3 bg-gray-50 rounded-lg px-4 py-2.5">
                  <span className="text-sm text-gray-700 flex-1 leading-snug">{item.label}</span>
                  <span className="text-sm font-bold text-[#1a6baa] whitespace-nowrap">{item.price.toLocaleString("ru-RU")} ₽</span>
                  <button onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}
                    className="text-gray-300 hover:text-red-400 transition-colors">
                    <Icon name="X" size={15} />
                  </button>
                </div>
              ))}
            </div>

            {/* доставка */}
            <div className="border-t border-[#d0dde8] pt-4 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Icon name="Truck" size={15} className="text-gray-400" />
                  <span className="text-sm font-semibold text-gray-600">Доставка:</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="number" min={0} value={deliveryKm}
                    onChange={(e) => setDeliveryKm(Number(e.target.value))} placeholder="0"
                    className="w-20 border border-[#d0dde8] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6baa]/30" />
                  <span className="text-sm text-gray-500">км от мастерской</span>
                </div>
                {deliveryKm > 0 && (
                  <span className="text-sm font-bold text-[#1a6baa] ml-auto">{deliveryCost.toLocaleString("ru-RU")} ₽</span>
                )}
              </div>
              {deliveryKm > 0 && (
                <p className="text-xs text-gray-400 pl-1">
                  База {PRICES.delivery_base} ₽ + {PRICES.delivery_per_km} ₽/км × {deliveryKm} км
                </p>
              )}

              {/* итог */}
              <div className="bg-gradient-to-r from-[#1a6baa] to-[#2585d0] rounded-xl px-5 py-4 flex items-center justify-between shadow-md">
                <div>
                  <p className="text-white/70 text-xs">Итого к оплате</p>
                  <p className="text-white font-black text-2xl">{grandTotal.toLocaleString("ru-RU")} ₽</p>
                </div>
                <div className="text-right text-white/80 text-xs space-y-0.5">
                  <p>Товары: {totalItems.toLocaleString("ru-RU")} ₽</p>
                  {deliveryCost > 0 && <p>Доставка: {deliveryCost.toLocaleString("ru-RU")} ₽</p>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}