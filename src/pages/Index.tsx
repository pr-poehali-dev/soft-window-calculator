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

// ─── крепёж на рамке ──────────────────────────────────────────
function Fastener({ mountId }: { mountId: string }) {
  if (mountId === "--") return null;
  const isLyuvers = mountId === "round_lyuvers";
  const isSkoba = mountId === "skoba_lyuvers" || mountId === "skoba_large" || mountId === "skoba_small";
  if (!isLyuvers && !isSkoba) return null;

  if (isLyuvers) {
    return (
      <div className="w-4 h-4 rounded-full border-2 border-gray-300 bg-white shadow-sm flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
      </div>
    );
  }
  return (
    <div className="w-4 h-4 flex flex-col items-center gap-0.5">
      <div className="w-3 h-1.5 rounded-sm bg-gray-200 border border-gray-400 shadow-sm" />
      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 border border-gray-500" />
    </div>
  );
}

function MountRow({ count, mountId, direction }: { count: number; mountId: string; direction: "h" | "v" }) {
  if (mountId === "--") return null;
  return (
    <div className={`flex ${direction === "h" ? "flex-row" : "flex-col"} items-center justify-around w-full h-full`}>
      {Array.from({ length: count }).map((_, i) => <Fastener key={i} mountId={mountId} />)}
    </div>
  );
}

// ─── компонент превью окна ─────────────────────────────────────
function WindowPreview({
  type, width, height,
  mountTop, mountBottom, mountLeft, mountRight,
  zipperLeft, zipperRight, strap,
}: {
  type: CurtainType; width: number; height: number;
  mountTop: string; mountBottom: string; mountLeft: string; mountRight: string;
  zipperLeft: boolean; zipperRight: boolean;
  strap: boolean;
}) {
  const maxW = 240, maxH = 180;
  const ratio = Math.min(maxW / Math.max(width, 1), maxH / Math.max(height, 1), 1);
  const pw = Math.round(width * ratio);
  const ph = Math.round(height * ratio);

  const countH = Math.max(2, Math.min(6, Math.round(pw / 40)));
  const countV = Math.max(2, Math.min(5, Math.round(ph / 40)));

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
          {/* крепёж верх */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-around px-2" style={{ height: 14 }}>
            <MountRow count={countH} mountId={mountTop} direction="h" />
          </div>
          {/* крепёж низ */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-around px-2" style={{ height: 14 }}>
            <MountRow count={countH} mountId={mountBottom} direction="h" />
          </div>
          {/* крепёж слева */}
          <div className="absolute top-0 bottom-0 left-0 flex flex-col items-center justify-around py-2" style={{ width: 14 }}>
            <MountRow count={countV} mountId={mountLeft} direction="v" />
          </div>
          {/* крепёж справа */}
          <div className="absolute top-0 bottom-0 right-0 flex flex-col items-center justify-around py-2" style={{ width: 14 }}>
            <MountRow count={countV} mountId={mountRight} direction="v" />
          </div>
          {/* пленка */}
          <div
            className="relative rounded-sm overflow-hidden"
            style={{
              width: pw,
              height: ph,
              backgroundColor: type.filmColor,
              backgroundImage: type.mesh
                ? "repeating-linear-gradient(0deg,transparent,transparent 4px,rgba(0,0,0,.18) 4px,rgba(0,0,0,.18) 5px),repeating-linear-gradient(90deg,transparent,transparent 4px,rgba(0,0,0,.18) 4px,rgba(0,0,0,.18) 5px)"
                : undefined,
            }}
          >
            {/* молния слева */}
            {zipperLeft && (
              <div className="absolute left-0 top-0 bottom-0 flex flex-col items-center" style={{ width: 6 }}>
                <div className="w-1 h-full bg-gray-500 opacity-70 rounded-full" />
                {Array.from({ length: Math.max(3, Math.round(ph / 10)) }).map((_, i) => (
                  <div key={i} className="absolute w-2.5 h-px bg-gray-600 opacity-60"
                    style={{ top: 4 + i * (ph / Math.max(3, Math.round(ph / 10))), left: 0 }} />
                ))}
              </div>
            )}
            {/* молния справа */}
            {zipperRight && (
              <div className="absolute right-0 top-0 bottom-0 flex flex-col items-center" style={{ width: 6 }}>
                <div className="w-1 h-full bg-gray-500 opacity-70 rounded-full" />
                {Array.from({ length: Math.max(3, Math.round(ph / 10)) }).map((_, i) => (
                  <div key={i} className="absolute w-2.5 h-px bg-gray-600 opacity-60"
                    style={{ top: 4 + i * (ph / Math.max(3, Math.round(ph / 10))), right: 0 }} />
                ))}
              </div>
            )}
            {/* ремешки подвязочные — вертикальные полосы по плёнке */}
            {strap && (
              <>
                {[0.28, 0.72].map((pos) => (
                  <div
                    key={pos}
                    className="absolute top-0 bottom-0 flex flex-col items-center"
                    style={{ left: `${pos * 100}%`, transform: "translateX(-50%)", width: 6 }}
                  >
                    {/* верхний крючок */}
                    <div className="w-4 h-2 border-2 border-b-0 border-gray-500 rounded-t-full mt-0" />
                    {/* вертикальный ремешок */}
                    <div className="flex-1 w-1.5 bg-gray-400 rounded-full" style={{ minHeight: 4 }} />
                    {/* нижний крючок */}
                    <div className="w-4 h-2 border-2 border-t-0 border-gray-500 rounded-b-full mb-0" />
                  </div>
                ))}
              </>
            )}
          </div>
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

  type OrderItem = {
    id: number;
    curtainType: CurtainType;
    width: number; height: number; qty: number;
    film: { label: string; price: number; rollWidth: number; productWidth: number };
    frameColor: string;
    strap: boolean; zipperLeft: boolean; zipperRight: boolean; mounting: boolean;
    discount: number;
    mountTop: string; mountBottom: string; mountLeft: string; mountRight: string;
    unitPrice: number;
  };
  const [items, setItems] = useState<OrderItem[]>([]);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientComment, setClientComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

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
  const totalItems = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  const grandTotal = totalItems + deliveryCost;

  function handleSubmit() {
    if (!clientName.trim() || !clientPhone.trim()) return;
    setSubmitted(true);
  }

  function handleAdd() {
    setItems((prev) => [...prev, {
      id: Date.now(),
      curtainType: selectedType,
      width, height, qty,
      film,
      frameColor,
      strap, zipperLeft, zipperRight, mounting,
      discount,
      mountTop, mountBottom, mountLeft, mountRight,
      unitPrice,
    }]);
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
              <WindowPreview
                type={selectedType} width={width} height={height}
                mountTop={mountTop} mountBottom={mountBottom}
                mountLeft={mountLeft} mountRight={mountRight}
                zipperLeft={zipperLeft} zipperRight={zipperRight}
                strap={strap}
              />
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
        {items.map((item, idx) => {
          const fc = FRAME_COLORS.find(c => c.id === item.frameColor);
          const area = (item.width / 1000) * (item.height / 1000);
          const filmCost = Math.round(item.film.price * area);

          const mountSides = [
            { label: "Крепление сверху", id: item.mountTop, countH: Math.max(2, Math.min(6, Math.round(item.width / 200))) },
            { label: "Крепление снизу", id: item.mountBottom, countH: Math.max(2, Math.min(6, Math.round(item.width / 200))) },
            { label: "Крепление слева", id: item.mountLeft, countH: Math.max(2, Math.min(5, Math.round(item.height / 200))) },
            { label: "Крепление справа", id: item.mountRight, countH: Math.max(2, Math.min(5, Math.round(item.height / 200))) },
          ].filter(s => s.id !== "--");

          const MOUNT_PRICE = 120;

          const rows: { label: string; detail: string; unitInfo: string; total: number }[] = [
            {
              label: `Пленка (${fc?.label ?? ""} цвет)`,
              detail: item.film.label,
              unitInfo: `${item.film.price} руб./м² * ${area.toFixed(2)} м²`,
              total: filmCost,
            },
            ...mountSides.map(s => {
              const mo = MOUNT_OPTIONS.find(o => o.id === s.id);
              return {
                label: s.label,
                detail: mo?.label ?? s.id,
                unitInfo: `${MOUNT_PRICE} руб./шт. * ${s.countH} шт.`,
                total: MOUNT_PRICE * s.countH,
              };
            }),
            ...(item.strap ? [{ label: "Ремешок подвязочный", detail: "2 шт.", unitInfo: `${PRICES.strap} руб.`, total: PRICES.strap }] : []),
            ...(item.zipperLeft ? [{ label: "Молния слева", detail: "Молния спиральная", unitInfo: `${PRICES.zipper} руб./шт. * 1 шт.`, total: PRICES.zipper }] : []),
            ...(item.zipperRight ? [{ label: "Молния справа", detail: "Молния спиральная", unitInfo: `${PRICES.zipper} руб./шт. * 1 шт.`, total: PRICES.zipper }] : []),
            ...(item.mounting ? [{ label: "Монтаж", detail: "Выезд и установка", unitInfo: `${PRICES.mounting} руб.`, total: PRICES.mounting }] : []),
          ];

          const rowsTotal = rows.reduce((s, r) => s + r.total, 0);
          const discounted = Math.round(rowsTotal * (1 - item.discount / 100));

          return (
            <div key={item.id} className="bg-white rounded-2xl border border-[#d0dde8] shadow-sm p-5">
              {/* заголовок позиции */}
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-base font-bold text-gray-700 flex items-center gap-2">
                  <Icon name="FileText" size={18} className="text-[#1a6baa]" />
                  Позиция {idx + 1}
                </h2>
                <button onClick={() => setItems(prev => prev.filter(it => it.id !== item.id))}
                  className="text-gray-300 hover:text-red-400 transition-colors p-1">
                  <Icon name="X" size={16} />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-5">
                {/* мини-превью */}
                <div className="shrink-0 flex items-start justify-center">
                  <WindowPreview
                    type={item.curtainType}
                    width={item.width} height={item.height}
                    mountTop={item.mountTop} mountBottom={item.mountBottom}
                    mountLeft={item.mountLeft} mountRight={item.mountRight}
                    zipperLeft={item.zipperLeft} zipperRight={item.zipperRight}
                    strap={item.strap}
                  />
                </div>

                {/* детали */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 text-sm mb-1">{item.curtainType.label}</p>
                  <p className="text-xs text-gray-500 mb-3">Размер шторы (Ш×В): {item.width}×{item.height} мм</p>

                  {/* таблица */}
                  <div className="rounded-xl overflow-hidden border border-[#d0dde8] text-xs">
                    {rows.map((row, ri) => (
                      <div key={ri} className={`grid grid-cols-3 gap-2 px-3 py-2 ${ri % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                        <span className="text-gray-500">{row.label}</span>
                        <span className="text-gray-700">{row.detail}</span>
                        <div className="flex justify-between">
                          <span className="text-gray-400">{row.unitInfo}</span>
                          <span className="font-semibold text-gray-800 whitespace-nowrap">{row.total.toLocaleString("ru-RU")} ₽</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
                    <span>Количество: <b className="text-gray-700">{item.qty} шт.</b></span>
                    <span>Монтаж: <b className="text-gray-700">{item.mounting ? "Да" : "Нет"}</b></span>
                    {item.discount > 0 && <span>Скидка: <b className="text-gray-700">{item.discount}%</b></span>}
                    <span>Стоимость: <b className="text-[#1a6baa]">{(discounted * item.qty).toLocaleString("ru-RU")} ₽</b></span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* итог + доставка */}
        {items.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#d0dde8] shadow-sm p-5 space-y-4">
            {/* доставка */}
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

            {/* общая сумма */}
            <div className="text-center py-2">
              <p className="text-sm text-gray-500">Монтаж: {items.some(i => i.mounting) ? "Да" : "Нет"}</p>
              {items.some(i => i.discount > 0) && (
                <p className="text-sm text-gray-500">Скидка применена</p>
              )}
              <p className="text-xl font-black text-gray-800 mt-1">
                Общая стоимость заказа: <span className="text-[#1a6baa]">{grandTotal.toLocaleString("ru-RU")} ₽</span>
              </p>
            </div>

            {/* кнопки */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-[#1a6baa] text-[#1a6baa] hover:bg-blue-50 font-bold px-6 py-3 rounded-xl transition-all">
                <Icon name="Printer" size={17} />
                Распечатать
              </button>
              <button
                onClick={() => document.getElementById("order-form")?.scrollIntoView({ behavior: "smooth" })}
                className="flex-1 flex items-center justify-center gap-2 bg-[#1a6baa] hover:bg-[#155a92] text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all">
                <Icon name="ShoppingCart" size={17} />
                Оформить заказ
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center leading-relaxed">
              С помощью онлайн-калькулятора можно рассчитать предварительную стоимость мягких окон.
              Окончательная стоимость заказа составляется на основании замеров, после согласования всех видов материалов и работ.
            </p>
          </div>
        )}

        {/* форма заявки */}
        {items.length > 0 && (
          <div id="order-form" className="bg-white rounded-2xl border border-[#d0dde8] shadow-sm p-5">
            {submitted ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                  <Icon name="CheckCircle" size={32} className="text-green-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Заявка отправлена!</h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  Спасибо, <b>{clientName}</b>! Мы свяжемся с вами по номеру <b>{clientPhone}</b> и уточним детали заказа.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setItems([]); setClientName(""); setClientPhone(""); setClientComment(""); setDeliveryKm(0); }}
                  className="mt-2 text-sm text-[#1a6baa] underline underline-offset-2 hover:text-[#155a92]"
                >
                  Создать новый расчёт
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-base font-bold text-gray-700 mb-1 flex items-center gap-2">
                  <Icon name="Send" size={18} className="text-[#1a6baa]" />
                  Отправить расчёт
                </h2>
                <p className="text-xs text-gray-400 mb-4">Оставьте контакты — мы свяжемся и подтвердим заказ</p>

                <div className="space-y-3">
                  {/* сводка */}
                  <div className="bg-blue-50 border border-[#1a6baa]/15 rounded-xl px-4 py-3 text-sm text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Позиций в расчёте:</span>
                      <b className="text-gray-800">{items.length} шт.</b>
                    </div>
                    {deliveryCost > 0 && (
                      <div className="flex justify-between">
                        <span>Доставка:</span>
                        <b className="text-gray-800">{deliveryCost.toLocaleString("ru-RU")} ₽</b>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-[#1a6baa]/10 pt-1 mt-1">
                      <span className="font-semibold">Итого:</span>
                      <b className="text-[#1a6baa] text-base">{grandTotal.toLocaleString("ru-RU")} ₽</b>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Ваше имя *</label>
                      <input
                        type="text" placeholder="Иван Иванов" value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full border border-[#d0dde8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6baa]/30 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Телефон *</label>
                      <input
                        type="tel" placeholder="+7 (900) 000-00-00" value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full border border-[#d0dde8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6baa]/30 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Комментарий</label>
                    <textarea
                      placeholder="Адрес объекта, удобное время звонка, пожелания..."
                      value={clientComment}
                      onChange={(e) => setClientComment(e.target.value)}
                      rows={2}
                      className="w-full border border-[#d0dde8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6baa]/30 bg-white resize-none"
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={!clientName.trim() || !clientPhone.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-[#1a6baa] hover:bg-[#155a92] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-xl shadow-md transition-all hover:shadow-lg active:scale-95"
                  >
                    <Icon name="Send" size={17} />
                    Отправить расчёт
                  </button>
                  <p className="text-xs text-gray-400 text-center">Нажимая кнопку, вы соглашаетесь на обработку персональных данных</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}