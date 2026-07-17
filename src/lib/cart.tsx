"use client";

/**
 * Cart + behavioral-signal store, in one client context.
 *
 * - Cart lines persist to localStorage so a refresh (or a shared link) keeps
 *   the bag intact.
 * - We also record lightweight interaction *signals* (product views, add-to-
 *   cart, category affinity). Those power the on-device personalized
 *   recommendation engine — no accounts, no tracking cookies, no server.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";

export type CartLine = {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  emoji: string;
  accent: string;
  hue: number;
  qty: number;
};

export type Signals = {
  /** slug -> times viewed */
  views: Record<string, number>;
  /** category -> affinity weight */
  categories: Record<string, number>;
  /** tag -> affinity weight */
  tags: Record<string, number>;
};

type CartState = { lines: CartLine[] };

type Action =
  | { type: "add"; line: Omit<CartLine, "qty">; qty?: number }
  | { type: "remove"; id: string }
  | { type: "setQty"; id: string; qty: number }
  | { type: "clear" }
  | { type: "hydrate"; lines: CartLine[] };

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "hydrate":
      return { lines: action.lines };
    case "add": {
      const existing = state.lines.find((l) => l.id === action.line.id);
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.id === action.line.id ? { ...l, qty: l.qty + (action.qty ?? 1) } : l
          ),
        };
      }
      return { lines: [...state.lines, { ...action.line, qty: action.qty ?? 1 }] };
    }
    case "remove":
      return { lines: state.lines.filter((l) => l.id !== action.id) };
    case "setQty":
      return {
        lines: state.lines
          .map((l) => (l.id === action.id ? { ...l, qty: Math.max(0, action.qty) } : l))
          .filter((l) => l.qty > 0),
      };
    case "clear":
      return { lines: [] };
    default:
      return state;
  }
}

const LINES_KEY = "lume.cart.v1";
const SIGNALS_KEY = "lume.signals.v1";

const emptySignals: Signals = { views: {}, categories: {}, tags: {} };

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotalCents: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (line: Omit<CartLine, "qty">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  signals: Signals;
  recordView: (slug: string, category: string, tags: string[]) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [] });
  const [open, setOpen] = useState(false);
  const [signals, setSignals] = useState<Signals>(emptySignals);
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage once.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LINES_KEY);
      if (raw) dispatch({ type: "hydrate", lines: JSON.parse(raw) });
      const sig = localStorage.getItem(SIGNALS_KEY);
      if (sig) setSignals({ ...emptySignals, ...JSON.parse(sig) });
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  // Persist cart.
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(LINES_KEY, JSON.stringify(state.lines));
    } catch {
      /* ignore */
    }
  }, [state.lines, ready]);

  // Persist signals.
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(SIGNALS_KEY, JSON.stringify(signals));
    } catch {
      /* ignore */
    }
  }, [signals, ready]);

  const add = useCallback((line: Omit<CartLine, "qty">, qty = 1) => {
    dispatch({ type: "add", line, qty });
    setSignals((s) => ({
      ...s,
      categories: s.categories,
    }));
    setOpen(true);
  }, []);

  const remove = useCallback((id: string) => dispatch({ type: "remove", id }), []);
  const setQty = useCallback((id: string, qty: number) => dispatch({ type: "setQty", id, qty }), []);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);

  const recordView = useCallback((slug: string, category: string, tags: string[]) => {
    setSignals((s) => {
      const views = { ...s.views, [slug]: (s.views[slug] ?? 0) + 1 };
      const categories = { ...s.categories, [category]: (s.categories[category] ?? 0) + 1 };
      const tagW = { ...s.tags };
      for (const t of tags) tagW[t] = (tagW[t] ?? 0) + 1;
      return { views, categories, tags: tagW };
    });
  }, []);

  const count = useMemo(() => state.lines.reduce((n, l) => n + l.qty, 0), [state.lines]);
  const subtotalCents = useMemo(
    () => state.lines.reduce((n, l) => n + l.qty * l.priceCents, 0),
    [state.lines]
  );

  const value: CartContextValue = {
    lines: state.lines,
    count,
    subtotalCents,
    open,
    setOpen,
    add,
    remove,
    setQty,
    clear,
    signals,
    recordView,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
