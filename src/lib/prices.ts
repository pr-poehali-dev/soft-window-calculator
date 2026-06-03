// ─── дефолтные цены ───────────────────────────────────────────
export type FilmOption = { label: string; price: number; rollWidth: number; productWidth: number };

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

export function resetAll() {
  localStorage.removeItem(PRICES_KEY);
  localStorage.removeItem(FILMS_KEY);
}