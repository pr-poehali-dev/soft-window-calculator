// ─── дефолтные цены ───────────────────────────────────────────
export type FilmOption = { id?: string; label: string; price: number; rollWidth: number; productWidth: number };

// Работы и услуги (редактируемый список)
export type WorkItem = { id: string; label: string; price: number; unit: string };

export const DEFAULT_WORKS: WorkItem[] = [
  { id: "strap",       label: "Ремешок подвязочный",      price: 180, unit: "шт." },
  { id: "zipper",      label: "Молния",                   price: 350, unit: "шт." },
  { id: "mounting",    label: "Монтаж (выезд)",           price: 290, unit: "выезд" },
  { id: "framing",     label: "Окантовка ПВХ",            price: 80,  unit: "п.м." },
  { id: "mount_unit",  label: "Крепление (скоба/люверс)", price: 120, unit: "шт." },
  { id: "delivery_base", label: "Доставка: базовая ставка", price: 500, unit: "₽" },
  { id: "delivery_km", label: "Доставка: за км",          price: 35,  unit: "км" },
];

const WORKS_KEY = "curtain_works";

export function loadWorks(): WorkItem[] {
  try {
    const raw = localStorage.getItem(WORKS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { console.warn(e); }
  return JSON.parse(JSON.stringify(DEFAULT_WORKS));
}

export function saveWorks(w: WorkItem[]) {
  localStorage.setItem(WORKS_KEY, JSON.stringify(w));
}

// Типы крепления шторы (люверсы, скобы и т.п.)
export type MountOption = { id: string; label: string; desc?: string };

export const DEFAULT_MOUNT_OPTIONS: MountOption[] = [
  { id: "--", label: "--" },
  { id: "round_lyuvers", label: "Люверсы", desc: "Металлические кольца-люверсы, вшитые в верхний край полотна" },
  { id: "skoba_lyuvers", label: "Скоба+люверс с рем.", desc: "Скоба с ремешком и люверсом для надёжной фиксации" },
  { id: "skoba_large", label: "Скоба большая поворотная", desc: "Крупная поворотная скоба для тяжёлых полотен" },
  { id: "skoba_small", label: "Скоба малая поворотная", desc: "Компактная поворотная скоба для лёгких штор" },
];

const MOUNT_OPTIONS_KEY = "curtain_mount_options";

export function loadMountOptions(): MountOption[] {
  try {
    const raw = localStorage.getItem(MOUNT_OPTIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { console.warn(e); }
  return JSON.parse(JSON.stringify(DEFAULT_MOUNT_OPTIONS));
}

export function saveMountOptions(m: MountOption[]) {
  localStorage.setItem(MOUNT_OPTIONS_KEY, JSON.stringify(m));
}

// Фурнитура: цена за штуку
export type HardwareItem = { id: string; label: string; price: number; unit: string };
// Доп. услуги: фиксированная цена или %
export type ServiceItem = { id: string; label: string; price: number; isPercent: boolean };
// Произвольные позиции
export type CustomItem = { id: string; label: string; price: number; unit: string };

export type ExtraLists = {
  hardware: HardwareItem[];
  services: ServiceItem[];
  custom: CustomItem[];
};

export const DEFAULT_EXTRA_LISTS: ExtraLists = {
  hardware: [
    { id: "hw1", label: "Петля навесная", price: 45, unit: "шт." },
    { id: "hw2", label: "Болт М8×30", price: 12, unit: "шт." },
    { id: "hw3", label: "Крючок крепёжный", price: 25, unit: "шт." },
  ],
  services: [
    { id: "sv1", label: "Выезд на замер", price: 500, isPercent: false },
    { id: "sv2", label: "Срочное изготовление", price: 20, isPercent: true },
    { id: "sv3", label: "Упаковка", price: 150, isPercent: false },
  ],
  custom: [],
};

export type PricesConfig = {
  strap: number;
  zipper: number;
  mounting: number;
  framing_per_m: number;
  mount_per_unit: number;
  delivery_base: number;
  delivery_per_km: number;
};

export type FilmOptionsConfig = Record<string, FilmOption[]>;

export const DEFAULT_PRICES: PricesConfig = {
  strap: 180,
  zipper: 350,
  mounting: 290,
  framing_per_m: 80,
  mount_per_unit: 120,
  delivery_base: 500,
  delivery_per_km: 35,
};

export const DEFAULT_FILM_OPTIONS: FilmOptionsConfig = {
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

const PRICES_KEY = "curtain_prices";
const FILMS_KEY = "curtain_films";

export function loadPrices(): PricesConfig {
  try {
    const raw = localStorage.getItem(PRICES_KEY);
    if (raw) return { ...DEFAULT_PRICES, ...JSON.parse(raw) };
  } catch (e) { console.warn(e); }
  return { ...DEFAULT_PRICES };
}

export function savePrices(p: PricesConfig) {
  localStorage.setItem(PRICES_KEY, JSON.stringify(p));
}

export function loadFilmOptions(): FilmOptionsConfig {
  try {
    const raw = localStorage.getItem(FILMS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { console.warn(e); }
  return JSON.parse(JSON.stringify(DEFAULT_FILM_OPTIONS));
}

export function saveFilmOptions(f: FilmOptionsConfig) {
  localStorage.setItem(FILMS_KEY, JSON.stringify(f));
}

const EXTRA_KEY = "curtain_extra";

export function loadExtraLists(): ExtraLists {
  try {
    const raw = localStorage.getItem(EXTRA_KEY);
    if (raw) return { ...DEFAULT_EXTRA_LISTS, ...JSON.parse(raw) };
  } catch (e) { console.warn(e); }
  return JSON.parse(JSON.stringify(DEFAULT_EXTRA_LISTS));
}

export function saveExtraLists(e: ExtraLists) {
  localStorage.setItem(EXTRA_KEY, JSON.stringify(e));
}

export function resetAll() {
  localStorage.removeItem(PRICES_KEY);
  localStorage.removeItem(FILMS_KEY);
  localStorage.removeItem(EXTRA_KEY);
  localStorage.removeItem(WORKS_KEY);
  localStorage.removeItem(MOUNT_OPTIONS_KEY);
}