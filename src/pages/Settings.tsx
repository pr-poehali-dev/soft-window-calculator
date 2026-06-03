import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import {
  loadPrices, savePrices, loadFilmOptions, saveFilmOptions, resetAll,
  DEFAULT_PRICES, DEFAULT_FILM_OPTIONS,
  type PricesConfig, type FilmOptionsConfig,
} from "@/lib/prices";

const CURTAIN_TYPE_LABELS: Record<string, string> = {
  transparent: "Прозрачная",
  combined: "Комбинированная",
  solid: "Однотонная",
  mosquito: "Москитная",
};

const PRICES_LABELS: Record<keyof PricesConfig, string> = {
  strap: "Ремешок подвязочный, руб./шт.",
  zipper: "Молния, руб./шт.",
  mounting: "Монтаж (выезд), руб.",
  framing_per_m: "Окантовка ПВХ, руб./п.м.",
  mount_per_unit: "Крепление (скоба/люверс), руб./шт.",
  delivery_base: "Доставка: базовая ставка, руб.",
  delivery_per_km: "Доставка: за км, руб.",
};

export default function Settings() {
  const [prices, setPrices] = useState<PricesConfig>(() => loadPrices());
  const [films, setFilms] = useState<FilmOptionsConfig>(() => loadFilmOptions());
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"prices" | "films">("prices");

  function handleSave() {
    savePrices(prices);
    saveFilmOptions(films);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleReset() {
    if (!confirm("Сбросить все цены к значениям по умолчанию?")) return;
    resetAll();
    setPrices({ ...DEFAULT_PRICES });
    setFilms(JSON.parse(JSON.stringify(DEFAULT_FILM_OPTIONS)));
  }

  function updateFilmPrice(type: string, idx: number, price: number) {
    setFilms(prev => ({
      ...prev,
      [type]: prev[type].map((f, i) => i === idx ? { ...f, price } : f),
    }));
  }

  const inputCls = "w-full border border-[#d0dde8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6baa]/30 bg-white text-right";

  return (
    <div className="min-h-screen bg-[#f4f8fb] font-golos">
      {/* шапка */}
      <div className="bg-white border-b border-[#d0dde8] shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/" className="text-gray-400 hover:text-[#1a6baa] transition-colors p-1 rounded-lg hover:bg-blue-50">
            <Icon name="ArrowLeft" size={20} />
          </Link>
          <div className="w-9 h-9 rounded-xl bg-[#1a6baa] flex items-center justify-center shadow">
            <Icon name="Settings" size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-800 leading-tight">Настройки цен</h1>
            <p className="text-xs text-gray-400">Изменения сохраняются в браузере</p>
          </div>
          <button
            onClick={handleReset}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-red-50">
            <Icon name="RotateCcw" size={13} />
            Сбросить
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {/* вкладки */}
        <div className="flex gap-2 bg-white rounded-xl border border-[#d0dde8] p-1 shadow-sm">
          {(["prices", "films"] as const).map((tab) => (
            <button key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab ? "bg-[#1a6baa] text-white shadow" : "text-gray-500 hover:text-gray-700"}`}>
              {tab === "prices" ? "Работы и услуги" : "Цены на плёнки"}
            </button>
          ))}
        </div>

        {/* работы */}
        {activeTab === "prices" && (
          <div className="bg-white rounded-2xl border border-[#d0dde8] shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-700 mb-4">Стоимость работ и услуг</h2>
            <div className="space-y-3">
              {(Object.keys(PRICES_LABELS) as (keyof PricesConfig)[]).map((key) => (
                <div key={key} className="flex items-center justify-between gap-4">
                  <label className="text-sm text-gray-600 flex-1">{PRICES_LABELS[key]}</label>
                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="number" min={0} step={1}
                      value={prices[key]}
                      onChange={(e) => setPrices(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                      className="w-24 border border-[#d0dde8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6baa]/30 bg-white text-right"
                    />
                    <span className="text-xs text-gray-400 w-5">₽</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4 pt-3 border-t border-[#d0dde8]">
              Цена по умолчанию для крепления: {DEFAULT_PRICES.mount_per_unit} ₽/шт., окантовки: {DEFAULT_PRICES.framing_per_m} ₽/п.м.
            </p>
          </div>
        )}

        {/* плёнки */}
        {activeTab === "films" && (
          <div className="space-y-4">
            {Object.entries(films).map(([type, options]) => (
              <div key={type} className="bg-white rounded-2xl border border-[#d0dde8] shadow-sm p-5">
                <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#1a6baa] inline-block" />
                  {CURTAIN_TYPE_LABELS[type] ?? type}
                </h2>
                <div className="space-y-2.5">
                  {options.map((film, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 flex-1 leading-snug">{film.label}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          type="number" min={0} step={10}
                          value={film.price}
                          onChange={(e) => updateFilmPrice(type, idx, Number(e.target.value))}
                          className={inputCls + " w-24"}
                        />
                        <span className="text-xs text-gray-400 whitespace-nowrap">₽/м²</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* кнопка сохранить */}
        <div className="sticky bottom-4 flex justify-center">
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 font-bold px-8 py-3 rounded-xl shadow-lg transition-all ${saved ? "bg-green-500 text-white" : "bg-[#1a6baa] hover:bg-[#155a92] text-white"}`}>
            <Icon name={saved ? "Check" : "Save"} size={17} />
            {saved ? "Сохранено!" : "Сохранить цены"}
          </button>
        </div>
      </div>
    </div>
  );
}
