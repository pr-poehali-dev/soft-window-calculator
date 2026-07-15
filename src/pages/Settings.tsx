import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import {
  loadPrices, savePrices, loadFilmOptions, saveFilmOptions,
  loadExtraLists, saveExtraLists, loadWorks, saveWorks, resetAll,
  DEFAULT_PRICES, DEFAULT_FILM_OPTIONS, DEFAULT_EXTRA_LISTS, DEFAULT_WORKS,
  type PricesConfig, type FilmOptionsConfig, type ExtraLists,
  type HardwareItem, type ServiceItem, type CustomItem, type WorkItem,
} from "@/lib/prices";

const CURTAIN_TYPE_LABELS: Record<string, string> = {
  transparent: "Прозрачная",
  combined: "Комбинированная",
  solid: "Однотонная",
  mosquito: "Москитная",
};

type Tab = "works" | "films" | "hardware" | "services" | "custom";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "works",    label: "Работы",    icon: "Wrench" },
  { id: "films",    label: "Плёнки",   icon: "Layers" },
  { id: "hardware", label: "Фурнитура",icon: "Package" },
  { id: "services", label: "Услуги",   icon: "Sparkles" },
  { id: "custom",   label: "Своё",     icon: "LayoutList" },
];

function newId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

export default function Settings() {
  const [prices, setPrices] = useState<PricesConfig>(() => loadPrices());
  const [films, setFilms] = useState<FilmOptionsConfig>(() => loadFilmOptions());
  const [extra, setExtra] = useState<ExtraLists>(() => loadExtraLists());
  const [works, setWorks] = useState<WorkItem[]>(() => loadWorks());
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("works");

  function handleSave() {
    savePrices(prices);
    saveFilmOptions(films);
    saveExtraLists(extra);
    saveWorks(works);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleReset() {
    if (!confirm("Сбросить всё к значениям по умолчанию?")) return;
    resetAll();
    setPrices({ ...DEFAULT_PRICES });
    setFilms(JSON.parse(JSON.stringify(DEFAULT_FILM_OPTIONS)));
    setExtra(JSON.parse(JSON.stringify(DEFAULT_EXTRA_LISTS)));
    setWorks(JSON.parse(JSON.stringify(DEFAULT_WORKS)));
  }

  // ─── работы ───
  function addWork() {
    setWorks(prev => [...prev, { id: newId(), label: "", price: 0, unit: "шт." }]);
  }
  function updateWork(id: string, field: keyof WorkItem, val: string | number) {
    setWorks(prev => prev.map(w => w.id === id ? { ...w, [field]: val } : w));
  }
  function removeWork(id: string) {
    setWorks(prev => prev.filter(w => w.id !== id));
  }

  // ─── плёнки ───
  function addFilm(type: string) {
    setFilms(prev => ({
      ...prev,
      [type]: [...prev[type], { id: newId(), label: "", price: 0, rollWidth: 1.4, productWidth: 1.35 }],
    }));
  }
  function updateFilm(type: string, idx: number, field: string, val: string | number) {
    setFilms(prev => ({ ...prev, [type]: prev[type].map((f, i) => i === idx ? { ...f, [field]: val } : f) }));
  }
  function removeFilm(type: string, idx: number) {
    setFilms(prev => ({ ...prev, [type]: prev[type].filter((_, i) => i !== idx) }));
  }
  function addFilmGroup() {
    const name = prompt("Название новой группы плёнок:");
    if (!name?.trim()) return;
    setFilms(prev => ({ ...prev, [name.trim()]: [] }));
  }

  // ─── фурнитура ───
  function addHardware() {
    setExtra(prev => ({ ...prev, hardware: [...prev.hardware, { id: newId(), label: "", price: 0, unit: "шт." }] }));
  }
  function updateHardware(id: string, field: keyof HardwareItem, val: string | number) {
    setExtra(prev => ({ ...prev, hardware: prev.hardware.map(h => h.id === id ? { ...h, [field]: val } : h) }));
  }
  function removeHardware(id: string) {
    setExtra(prev => ({ ...prev, hardware: prev.hardware.filter(h => h.id !== id) }));
  }

  // ─── услуги ───
  function addService() {
    setExtra(prev => ({ ...prev, services: [...prev.services, { id: newId(), label: "", price: 0, isPercent: false }] }));
  }
  function updateService(id: string, field: keyof ServiceItem, val: string | number | boolean) {
    setExtra(prev => ({ ...prev, services: prev.services.map(s => s.id === id ? { ...s, [field]: val } : s) }));
  }
  function removeService(id: string) {
    setExtra(prev => ({ ...prev, services: prev.services.filter(s => s.id !== id) }));
  }

  // ─── своё ───
  function addCustom() {
    setExtra(prev => ({ ...prev, custom: [...prev.custom, { id: newId(), label: "", price: 0, unit: "шт." }] }));
  }
  function updateCustom(id: string, field: keyof CustomItem, val: string | number) {
    setExtra(prev => ({ ...prev, custom: prev.custom.map(c => c.id === id ? { ...c, [field]: val } : c) }));
  }
  function removeCustom(id: string) {
    setExtra(prev => ({ ...prev, custom: prev.custom.filter(c => c.id !== id) }));
  }

  const inputCls = "border border-[#d0dde8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6baa]/30 bg-white";
  const numInputCls = inputCls + " w-24 text-right";

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
          <button onClick={handleReset}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-red-50">
            <Icon name="RotateCcw" size={13} />
            Сбросить
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {/* вкладки */}
        <div className="flex gap-1 bg-white rounded-xl border border-[#d0dde8] p-1 shadow-sm overflow-x-auto">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-max flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${activeTab === tab.id ? "bg-[#1a6baa] text-white shadow" : "text-gray-500 hover:text-gray-700"}`}>
              <Icon name={tab.icon} size={13} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── работы ── */}
        {activeTab === "works" && (
          <div className="bg-white rounded-2xl border border-[#d0dde8] shadow-sm p-5 space-y-3">
            <h2 className="text-sm font-bold text-gray-700">Работы и услуги</h2>
            <p className="text-xs text-gray-400">Редактируй названия, цены и единицы измерения. Можно добавить свои строки.</p>
            {works.map((w) => (
              <div key={w.id} className="flex items-center gap-2">
                <input value={w.label} placeholder="Название"
                  onChange={(e) => updateWork(w.id, "label", e.target.value)}
                  className={inputCls + " flex-1 min-w-0"} />
                <input type="number" min={0} value={w.price}
                  onChange={(e) => updateWork(w.id, "price", Number(e.target.value))}
                  className={numInputCls} />
                <input value={w.unit} placeholder="ед."
                  onChange={(e) => updateWork(w.id, "unit", e.target.value)}
                  className={inputCls + " w-16 shrink-0"} />
                <span className="text-xs text-gray-400 shrink-0">₽</span>
                <button onClick={() => removeWork(w.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors shrink-0">
                  <Icon name="Trash2" size={16} />
                </button>
              </div>
            ))}
            <button onClick={addWork}
              className="flex items-center gap-1.5 text-sm text-[#1a6baa] hover:text-[#155a92] font-semibold mt-1">
              <Icon name="Plus" size={15} /> Добавить строку
            </button>
          </div>
        )}

        {/* ── плёнки ── */}
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
                    <div key={idx} className="flex items-center gap-2">
                      <input value={film.label} placeholder="Название плёнки"
                        onChange={(e) => updateFilm(type, idx, "label", e.target.value)}
                        className={inputCls + " flex-1 min-w-0"} />
                      <input type="number" min={0} step={10} value={film.price}
                        onChange={(e) => updateFilm(type, idx, "price", Number(e.target.value))}
                        className={numInputCls} />
                      <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">₽/м²</span>
                      <button onClick={() => removeFilm(type, idx)}
                        className="text-gray-300 hover:text-red-400 transition-colors shrink-0">
                        <Icon name="Trash2" size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={() => addFilm(type)}
                  className="flex items-center gap-1.5 text-sm text-[#1a6baa] hover:text-[#155a92] font-semibold mt-3">
                  <Icon name="Plus" size={15} /> Добавить плёнку
                </button>
              </div>
            ))}
            <button onClick={addFilmGroup}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1a6baa] font-semibold border border-dashed border-[#d0dde8] rounded-xl px-4 py-3 w-full justify-center hover:border-[#1a6baa] transition-colors">
              <Icon name="FolderPlus" size={15} /> Добавить новую группу
            </button>
          </div>
        )}

        {/* ── фурнитура ── */}
        {activeTab === "hardware" && (
          <div className="bg-white rounded-2xl border border-[#d0dde8] shadow-sm p-5 space-y-3">
            <h2 className="text-sm font-bold text-gray-700">Фурнитура</h2>
            <p className="text-xs text-gray-400">Позиции выбираются при добавлении шторы в расчёт</p>
            {extra.hardware.map((h) => (
              <div key={h.id} className="flex items-center gap-2">
                <input value={h.label} placeholder="Название"
                  onChange={(e) => updateHardware(h.id, "label", e.target.value)}
                  className={inputCls + " flex-1 min-w-0"} />
                <input type="number" min={0} value={h.price}
                  onChange={(e) => updateHardware(h.id, "price", Number(e.target.value))}
                  className={numInputCls} />
                <span className="text-xs text-gray-400 shrink-0">₽/шт.</span>
                <button onClick={() => removeHardware(h.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors shrink-0">
                  <Icon name="Trash2" size={16} />
                </button>
              </div>
            ))}
            <button onClick={addHardware}
              className="flex items-center gap-1.5 text-sm text-[#1a6baa] hover:text-[#155a92] font-semibold mt-1">
              <Icon name="Plus" size={15} /> Добавить позицию
            </button>
          </div>
        )}

        {/* ── услуги ── */}
        {activeTab === "services" && (
          <div className="bg-white rounded-2xl border border-[#d0dde8] shadow-sm p-5 space-y-3">
            <h2 className="text-sm font-bold text-gray-700">Дополнительные услуги</h2>
            <p className="text-xs text-gray-400">Фиксированная сумма или процент от суммы позиций</p>
            {extra.services.map((s) => (
              <div key={s.id} className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <input value={s.label} placeholder="Название услуги"
                  onChange={(e) => updateService(s.id, "label", e.target.value)}
                  className={inputCls + " flex-1 min-w-0"} />
                <input type="number" min={0} value={s.price}
                  onChange={(e) => updateService(s.id, "price", Number(e.target.value))}
                  className={numInputCls} />
                <select value={s.isPercent ? "pct" : "fix"}
                  onChange={(e) => updateService(s.id, "isPercent", e.target.value === "pct")}
                  className={inputCls + " w-20 shrink-0"}>
                  <option value="fix">₽</option>
                  <option value="pct">%</option>
                </select>
                <button onClick={() => removeService(s.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors shrink-0">
                  <Icon name="Trash2" size={16} />
                </button>
              </div>
            ))}
            <button onClick={addService}
              className="flex items-center gap-1.5 text-sm text-[#1a6baa] hover:text-[#155a92] font-semibold mt-1">
              <Icon name="Plus" size={15} /> Добавить услугу
            </button>
          </div>
        )}

        {/* ── своё ── */}
        {activeTab === "custom" && (
          <div className="bg-white rounded-2xl border border-[#d0dde8] shadow-sm p-5 space-y-3">
            <h2 className="text-sm font-bold text-gray-700">Свои позиции</h2>
            <p className="text-xs text-gray-400">Произвольные материалы или работы, которых нет в других разделах</p>
            {extra.custom.length === 0 && (
              <p className="text-sm text-gray-400 py-2 text-center">Пока пусто — добавь первую позицию</p>
            )}
            {extra.custom.map((c) => (
              <div key={c.id} className="flex items-center gap-2">
                <input value={c.label} placeholder="Название"
                  onChange={(e) => updateCustom(c.id, "label", e.target.value)}
                  className={inputCls + " flex-1 min-w-0"} />
                <input type="number" min={0} value={c.price}
                  onChange={(e) => updateCustom(c.id, "price", Number(e.target.value))}
                  className={numInputCls} />
                <input value={c.unit} placeholder="ед."
                  onChange={(e) => updateCustom(c.id, "unit", e.target.value)}
                  className={inputCls + " w-16 shrink-0"} />
                <span className="text-xs text-gray-400 shrink-0">₽</span>
                <button onClick={() => removeCustom(c.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors shrink-0">
                  <Icon name="Trash2" size={16} />
                </button>
              </div>
            ))}
            <button onClick={addCustom}
              className="flex items-center gap-1.5 text-sm text-[#1a6baa] hover:text-[#155a92] font-semibold mt-1">
              <Icon name="Plus" size={15} /> Добавить позицию
            </button>
          </div>
        )}

        {/* кнопка сохранить */}
        <div className="sticky bottom-4 flex justify-center pb-2">
          <button onClick={handleSave}
            className={`flex items-center gap-2 font-bold px-8 py-3 rounded-xl shadow-lg transition-all ${saved ? "bg-green-500 text-white" : "bg-[#1a6baa] hover:bg-[#155a92] text-white"}`}>
            <Icon name={saved ? "Check" : "Save"} size={17} />
            {saved ? "Сохранено!" : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  );
}
