import React, { useState, useRef, useMemo } from "react";
import {
  ProductHoverShowcase,
  DEFAULT_PRODUCTS,
  type ProductItem,
  type PerspectiveMode,
} from "@/components/ui/product-hover-showcase";
import { RandomLetterSwapNav } from "@/components/ui/m-random-letter-swap-1";
import { RandomLetterSwap } from "@/components/ui/random-letter-swap";
import { LiquidCheckout } from "@/components/ui/liquid-glass-checkout";
import {
  Sparkles,
  Play,
  Pause,
  Sun,
  Moon,
  RotateCcw,
  Layers,
  Activity,
  Check,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Wind,
  Gauge,
  X,
  Flame,
  ArrowUpRight,
  SlidersHorizontal,
  Volume2,
  VolumeX,
  Compass,
  Palette,
  Timer,
  Award,
  ChevronRight,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";

interface CartItem {
  product: ProductItem;
  size: string;
  colorway: string;
  quantity: number;
}

const COLORWAYS = [
  { name: "Titanium Cyan", hex: "#06b6d4" },
  { name: "Volt Nitro", hex: "#84cc16" },
  { name: "Crimson Surge", hex: "#ef4444" },
  { name: "Solar Blaze", hex: "#f97316" },
  { name: "Midnight Void", hex: "#2563eb" },
  { name: "Neon Fuchsia", hex: "#ec4899" },
];

export default function App() {
  const [products] = useState<ProductItem[]>(DEFAULT_PRODUCTS);
  const [selectedIndex, setSelectedIndex] = useState<number>(4); // Default to newly added Phantom Cyberdrive!
  const [autoplay, setAutoplay] = useState<boolean>(false);
  const [enableReflection, setEnableReflection] = useState<boolean>(true);
  const [enableGlow, setEnableGlow] = useState<boolean>(true);
  const [enableFloatingMotion, setEnableFloatingMotion] = useState<boolean>(true);
  const [activeNav, setActiveNav] = useState<string>("Home");
  const [selectedSize, setSelectedSize] = useState<string>("US 10.5");
  const [selectedColorway, setSelectedColorway] = useState<string>("#06b6d4");
  const [perspective, setPerspective] = useState<PerspectiveMode>("profile");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: DEFAULT_PRODUCTS[4],
      size: "US 10.5",
      colorway: "#06b6d4",
      quantity: 1,
    },
  ]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);

  // Checkout modal
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [checkoutProduct, setCheckoutProduct] = useState<ProductItem>(
    DEFAULT_PRODUCTS[4]
  );

  // Dark mode
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return true;
  });

  const [notification, setNotification] = useState<string | null>(null);

  // Telemetry Wind-tunnel simulation state (New Feature 1)
  const [cadence, setCadence] = useState<number>(182); // spm
  const [runnerWeight, setRunnerWeight] = useState<number>(68); // kg
  const [strikePattern, setStrikePattern] = useState<"forefoot" | "midfoot" | "heel">("forefoot");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Web Audio Synth Sound FX
  const playSound = (freq1 = 440, freq2 = 880, duration = 0.08) => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = (audioCtxRef.current ||= new AC());
      if (ctx.state === "suspended") ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(freq1, now);
      osc.frequency.exponentialRampToValueAtTime(freq2, now + duration);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch {}
  };

  const activeProduct = products[selectedIndex] ?? products[0];

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    playSound(nextDark ? 580 : 380, nextDark ? 880 : 520);
    if (typeof document !== "undefined") {
      if (nextDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Cart operations
  const addToCart = (product: ProductItem) => {
    playSound(520, 1040);
    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.product.id === product.id &&
          item.size === selectedSize &&
          item.colorway === selectedColorway
      );
      if (existing) {
        return prev.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          product,
          size: selectedSize,
          colorway: selectedColorway,
          quantity: 1,
        },
      ];
    });
    showNotification(`Added ${product.name} (${selectedSize}) to cart`);
  };

  const updateCartQty = (idx: number, delta: number) => {
    playSound(400, 600);
    setCart((prev) =>
      prev
        .map((item, i) =>
          i === idx ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeCartItem = (idx: number) => {
    playSound(350, 200);
    setCart((prev) => prev.filter((_, i) => i !== idx));
    showNotification("Removed item from cart");
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => {
    const numPrice =
      typeof item.product.price === "number"
        ? item.product.price
        : parseFloat(String(item.product.price).replace(/[^0-9.]/g, "")) || 0;
    return acc + numPrice * item.quantity;
  }, 0);

  const handleBuy = (product: ProductItem) => {
    playSound(600, 1200);
    setCheckoutProduct(product);
    setIsCartDrawerOpen(false);
    setIsCheckoutOpen(true);
    showNotification(`Proceeding to checkout for ${product.name}`);
  };

  const handleNavClick = (link: string) => {
    setActiveNav(link);
    playSound(480, 720);
    const elementMap: Record<string, string> = {
      Home: "hero-showcase",
      Drops: "hero-showcase",
      Collection: "collection-section",
      Innovation: "dyno-simulator",
      Contact: "footer-section",
    };
    const targetId = elementMap[link];
    if (targetId) {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Telemetry Calculations
  const telemetry = useMemo(() => {
    const strikeBonus =
      strikePattern === "forefoot" ? 4.5 : strikePattern === "midfoot" ? 2.8 : 1.2;
    const energyReturn = (87.2 + (cadence - 150) * 0.11 + strikeBonus).toFixed(1);
    const wattsSaved = ((cadence / 180) * 12.4 + (runnerWeight / 70) * 2.8).toFixed(1);
    const gForceAttenuation = (strikePattern === "forefoot" ? 64 : 58) + (runnerWeight > 80 ? 4 : 2);
    return { energyReturn, wattsSaved, gForceAttenuation };
  }, [cadence, runnerWeight, strikePattern]);

  const runSimulation = () => {
    playSound(300, 900, 0.2);
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      playSound(700, 1400, 0.15);
      showNotification("Wind-tunnel telemetry benchmark completed!");
    }, 1200);
  };

  const availableSizes = [
    "US 7.5",
    "US 8.0",
    "US 8.5",
    "US 9.0",
    "US 9.5",
    "US 10.0",
    "US 10.5",
    "US 11.0",
    "US 11.5",
    "US 12.0",
  ];

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-[#08080a] text-neutral-900 dark:text-neutral-100 transition-colors duration-300 font-sans selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Top Promotional Bar */}
      <div className="w-full bg-neutral-900 text-neutral-300 dark:bg-neutral-950 dark:text-neutral-400 py-2 px-4 text-[11px] font-medium tracking-widest uppercase border-b border-neutral-800 flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>DOOMS WEAR · AERODYNAMICS LAB 2026 EDITION</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-[10px] tracking-wider">
          <span>NEW: PHANTOM CYBERDRIVE ADDED</span>
          <span className="text-neutral-600 dark:text-neutral-500">•</span>
          <span>FREE EXPRESS GLOBAL COURIER</span>
          <span className="text-neutral-600 dark:text-neutral-500">•</span>
          <span>CARBON NEUTRAL PROPULSION</span>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-neutral-950/80 border-b border-neutral-200/80 dark:border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo & Tag */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-black text-base shadow-lg shadow-neutral-900/10">
              DW
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tighter uppercase">
                  DOOMS WEAR
                </span>
                <span className="rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 px-2 py-0.5 text-[9px] font-extrabold tracking-wider uppercase">
                  LAB 2026
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium tracking-tight">
                High Performance Aerodynamic Footwear
              </p>
            </div>
          </div>

          {/* Random Letter Swap Navigation Links */}
          <div className="hidden md:flex">
            <RandomLetterSwapNav
              links={["Home", "Drops", "Collection", "Innovation", "Contact"]}
              activeLink={activeNav}
              onSelect={handleNavClick}
            />
          </div>

          {/* Right Action Icons & Theme Toggle */}
          <div className="flex items-center gap-2.5">
            {notification && (
              <span className="hidden lg:inline-flex items-center gap-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 px-3 py-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 animate-in fade-in">
                <Check className="h-3.5 w-3.5" />
                {notification}
              </span>
            )}

            {/* Sound FX Toggle (Feature 4) */}
            <button
              type="button"
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playSound(500, 800);
                showNotification(
                  !soundEnabled ? "Acoustic synth audio enabled" : "Acoustic audio muted"
                );
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer"
              title={soundEnabled ? "Mute Sound FX" : "Enable Sound FX"}
              aria-label="Toggle Sound Effects"
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4 text-cyan-500" />
              ) : (
                <VolumeX className="h-4 w-4 text-neutral-400" />
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              type="button"
              onClick={() => {
                playSound(450, 750);
                setIsCartDrawerOpen(true);
              }}
              className="relative inline-flex h-10 items-center gap-2 px-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer"
              aria-label="Open cart drawer"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="text-xs font-bold tracking-tight">Cart</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-[10px] font-black">
                {totalCartCount}
              </span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer"
              aria-label="Toggle color mode"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Promotional Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
        {/* Showcase Intro Banner matching Photo 1 */}
        <section id="hero-showcase" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-widest text-cyan-500 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-md">
                  <Flame className="h-3 w-3" /> Titanium Propulsion Release
                </span>
                <span className="text-xs text-neutral-400 font-medium">
                  Featuring Phantom Cyberdrive
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white uppercase">
                AERODYNAMICS LAB <span className="text-neutral-400 font-light">· 2026</span>
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xl mt-1">
                Interactive sneaker showcase with live 3D perspective switching, ambient dynamic glow,
                floor reflection, and liquid physical checkout.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                type="button"
                onClick={() => handleBuy(activeProduct)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-md cursor-pointer"
              >
                <span>Instant Checkout</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* The Reusable Showcase Component */}
          <div className="w-full">
            <ProductHoverShowcase
              products={products}
              selectedIndex={selectedIndex}
              onSelect={(idx) => {
                setSelectedIndex(idx);
                playSound(420 + idx * 40, 680 + idx * 50);
              }}
              autoplay={autoplay}
              autoplayInterval={3500}
              enableReflection={enableReflection}
              enableGlow={enableGlow}
              enableFloatingMotion={enableFloatingMotion}
              perspective={perspective}
              onPerspectiveChange={(mode) => {
                setPerspective(mode);
                playSound(500, 750);
              }}
              customAccentColor={selectedColorway}
              onBuyClick={handleBuy}
              buyButtonText="BUY NOW"
            />
          </div>

          {/* Interactive Controls Bar & Quick Switcher */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-sm space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                <Activity className="h-4 w-4 text-cyan-500" />
                <span>Lab Interactive Controls</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAutoplay(!autoplay);
                    playSound(400, 600);
                  }}
                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold border transition-all cursor-pointer ${
                    autoplay
                      ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900 shadow-sm"
                      : "border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100"
                  }`}
                >
                  {autoplay ? (
                    <>
                      <Pause className="h-3.5 w-3.5" />
                      <span>Autoplay Active</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 text-neutral-400" />
                      <span>Enable Autoplay</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEnableReflection(!enableReflection);
                    playSound(480, 560);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold border transition-all cursor-pointer ${
                    enableReflection
                      ? "border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm"
                      : "border-neutral-200 dark:border-neutral-800 text-neutral-400 line-through bg-neutral-100/50 dark:bg-neutral-900/50"
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>Floor Reflection</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEnableGlow(!enableGlow);
                    playSound(520, 600);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold border transition-all cursor-pointer ${
                    enableGlow
                      ? "border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm"
                      : "border-neutral-200 dark:border-neutral-800 text-neutral-400 line-through bg-neutral-100/50 dark:bg-neutral-900/50"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Ambient Glow</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEnableFloatingMotion(!enableFloatingMotion);
                    playSound(440, 520);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold border transition-all cursor-pointer ${
                    enableFloatingMotion
                      ? "border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm"
                      : "border-neutral-200 dark:border-neutral-800 text-neutral-400 line-through bg-neutral-100/50 dark:bg-neutral-900/50"
                  }`}
                >
                  <Wind className="h-3.5 w-3.5" />
                  <span>Floating Motion</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playSound(400, 300);
                    setAutoplay(false);
                    setEnableReflection(true);
                    setEnableGlow(true);
                    setEnableFloatingMotion(true);
                    setPerspective("profile");
                    setSelectedColorway("#06b6d4");
                    setSelectedIndex(4);
                    showNotification("Reset showcase to default specifications");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 px-3.5 py-2 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Direct Model Switcher */}
            <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                  Select Model
                </span>
                <span className="text-[11px] text-neutral-400">
                  Active: <span className="font-bold text-foreground">{activeProduct.name}</span>
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {products.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedIndex(idx);
                      playSound(400 + idx * 50, 700 + idx * 50);
                    }}
                    className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all cursor-pointer ${
                      selectedIndex === idx
                        ? "border-neutral-900 dark:border-white bg-neutral-900/5 dark:bg-white/10 shadow-sm"
                        : "border-neutral-200 dark:border-neutral-800/80 bg-neutral-50/70 dark:bg-neutral-800/40 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <span className="text-[11px] font-black uppercase tracking-tight text-neutral-900 dark:text-white truncate w-full">
                      {p.name}
                    </span>
                    <div className="flex items-center justify-between w-full mt-1">
                      <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-semibold tabular-nums">
                        {p.price}
                      </span>
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: p.accentColor }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Selected Sneaker Customization & Specifications */}
        <section
          id="collection-section"
          className="rounded-3xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-6 sm:p-10 shadow-xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-500">
                  {activeProduct.tagline || "RACE READY"}
                </span>
                <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-900 dark:text-white mt-1">
                  {activeProduct.name}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mt-2">
                  {activeProduct.description}
                </p>
              </div>

              {/* Colorway Customizer Studio (Feature 2) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                    <Palette className="h-3.5 w-3.5 text-cyan-500" />
                    Accent Colorway Preset
                  </span>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    {COLORWAYS.find((c) => c.hex === selectedColorway)?.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {COLORWAYS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => {
                        setSelectedColorway(c.hex);
                        playSound(550, 750);
                      }}
                      className={`h-8 w-8 rounded-full border-2 transition-transform cursor-pointer ${
                        selectedColorway === c.hex
                          ? "scale-125 border-neutral-900 dark:border-white shadow-md"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                      aria-label={`Select ${c.name}`}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                    Select Size
                  </span>
                  <span className="text-[11px] text-neutral-400 underline cursor-pointer hover:text-neutral-600">
                    Size Guide
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        setSelectedSize(size);
                        playSound(500, 650);
                      }}
                      className={`py-2 px-1 text-center rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        selectedSize === size
                          ? "border-neutral-900 dark:border-white bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm"
                          : "border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400"
                      }`}
                    >
                      {size.replace("US ", "")}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-neutral-400">
                  Selected: <span className="font-bold text-foreground">{selectedSize}</span> · True to race fit
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleBuy(activeProduct)}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold text-sm uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-lg cursor-pointer"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Order Now · {activeProduct.price}</span>
                </button>
                <button
                  type="button"
                  onClick={() => addToCart(activeProduct)}
                  className="inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-white font-bold text-sm uppercase tracking-wider hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add To Cart</span>
                </button>
              </div>
            </div>

            {/* Visual Specs / Shoe Anatomy */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-2">
                <div className="h-9 w-9 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
                  <Zap className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold uppercase tracking-tight text-neutral-900 dark:text-white">
                  Titanium Waveguide
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Dual-layer carbon-infused propulsion plate designed for rapid energy deflection
                  and zero energy dissipation on hard tarmac.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-2">
                <div className="h-9 w-9 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
                  <Wind className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold uppercase tracking-tight text-neutral-900 dark:text-white">
                  AeroMatrix™ 3D Knit
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Single-thread engineered monofilament knit with micro-perforations designed
                  to channel headwind airflow across the instep.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-2">
                <div className="h-9 w-9 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
                  <Gauge className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold uppercase tracking-tight text-neutral-900 dark:text-white">
                  Fluid Dynamic Sole
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Bio-engineered hydro-grip geometry provides relentless wet and dry cornering
                  traction at high-speed marathon paces.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-2">
                <div className="h-9 w-9 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold uppercase tracking-tight text-neutral-900 dark:text-white">
                  Featherlight 194g
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Sculpted geometry eliminates non-structural weight while maintaining rigid lateral
                  stability during tight 400m curve sprints.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature 1: Interactive Biometric & Aerodynamic Telemetry Simulator (Lab Dyno) */}
        <section
          id="dyno-simulator"
          className="rounded-3xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-6 sm:p-10 shadow-xl space-y-8"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-500 flex items-center gap-1.5">
                <Activity className="h-4 w-4" /> Lab Dyno Benchmarking
              </span>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900 dark:text-white mt-1">
                Real-Time Biometric & Aero Telemetry Simulator
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-2xl mt-1">
                Adjust cadence, runner mass, and strike pattern to simulate aerodynamic efficiency and
                calculated kinetic propulsion gains.
              </p>
            </div>

            <button
              type="button"
              onClick={runSimulation}
              disabled={isSimulating}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-cyan-400 transition-colors shadow-md cursor-pointer disabled:opacity-50"
            >
              <Timer className="h-4 w-4" />
              <span>{isSimulating ? "Simulating Aerodynamics..." : "Run Telemetry Sweep"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Control Sliders */}
            <div className="lg:col-span-6 space-y-5 p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800">
              {/* Cadence */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold uppercase">
                  <span>Stride Cadence</span>
                  <span className="text-cyan-500 font-mono">{cadence} SPM</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="215"
                  value={cadence}
                  onChange={(e) => {
                    setCadence(Number(e.target.value));
                    playSound(400 + Number(e.target.value), 450);
                  }}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-400">
                  <span>150 SPM (Jogging)</span>
                  <span>180 SPM (Marathon)</span>
                  <span>215 SPM (Sprint)</span>
                </div>
              </div>

              {/* Runner Weight */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold uppercase">
                  <span>Runner Mass</span>
                  <span className="text-cyan-500 font-mono">{runnerWeight} KG</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={runnerWeight}
                  onChange={(e) => {
                    setRunnerWeight(Number(e.target.value));
                    playSound(350 + Number(e.target.value) * 2, 400);
                  }}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-400">
                  <span>50 kg</span>
                  <span>75 kg</span>
                  <span>100 kg</span>
                </div>
              </div>

              {/* Footstrike Pattern */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider">Footstrike Angle</span>
                <div className="grid grid-cols-3 gap-2">
                  {(["forefoot", "midfoot", "heel"] as const).map((strike) => (
                    <button
                      key={strike}
                      type="button"
                      onClick={() => {
                        setStrikePattern(strike);
                        playSound(500, 700);
                      }}
                      className={`py-2 px-2 text-xs font-bold uppercase rounded-lg border transition-all cursor-pointer ${
                        strikePattern === strike
                          ? "border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shadow-sm"
                          : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400"
                      }`}
                    >
                      {strike}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculated Output Telemetry Gauges */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-neutral-900 text-white flex flex-col justify-between border border-neutral-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Kinetic Energy Return
                </span>
                <div className="my-2">
                  <p className="text-3xl sm:text-4xl font-black text-cyan-400 tabular-nums">
                    {telemetry.energyReturn}%
                  </p>
                  <p className="text-[10px] text-neutral-400 mt-1">Supercritical foam rebound</p>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-cyan-400 h-full transition-all duration-300"
                    style={{ width: `${telemetry.energyReturn}%` }}
                  />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-900 text-white flex flex-col justify-between border border-neutral-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Forward Power Saved
                </span>
                <div className="my-2">
                  <p className="text-3xl sm:text-4xl font-black text-emerald-400 tabular-nums">
                    {telemetry.wattsSaved}W
                  </p>
                  <p className="text-[10px] text-neutral-400 mt-1">Energy preserved per km</p>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Number(telemetry.wattsSaved) * 5)}%` }}
                  />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-900 text-white flex flex-col justify-between border border-neutral-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  G-Force Attenuation
                </span>
                <div className="my-2">
                  <p className="text-3xl sm:text-4xl font-black text-amber-400 tabular-nums">
                    {telemetry.gForceAttenuation}%
                  </p>
                  <p className="text-[10px] text-neutral-400 mt-1">Impact stress dissipated</p>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-amber-400 h-full transition-all duration-300"
                    style={{ width: `${telemetry.gForceAttenuation}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Innovation & Philosophy Section */}
        <section
          id="innovation-section"
          className="relative overflow-hidden rounded-3xl bg-neutral-900 text-white p-8 sm:p-14"
        >
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              DOOMS WEAR PHILOSOPHY
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-[0.95]">
              ENGINEERED FOR THE UNRELENTING PACE.
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
              At DOOMS WEAR, we combine computational fluid dynamics with bio-mechanical running
              data. Every contour, outsole lug angle, and woven fiber is tested inside our
              wind tunnel lab in Zurich to give runners an unfair speed advantage.
            </p>
            <div className="pt-2 flex flex-wrap gap-6 items-center">
              <div>
                <p className="text-3xl sm:text-4xl font-black text-white tabular-nums">+14.2%</p>
                <p className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">
                  Energy Return
                </p>
              </div>
              <div className="h-10 w-px bg-neutral-800" />
              <div>
                <p className="text-3xl sm:text-4xl font-black text-white tabular-nums">-18%</p>
                <p className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">
                  Wind Drag
                </p>
              </div>
              <div className="h-10 w-px bg-neutral-800" />
              <div>
                <p className="text-3xl sm:text-4xl font-black text-white tabular-nums">194g</p>
                <p className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">
                  Race Weight
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Feature 3: Slide-Over Cart Drawer */}
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 h-full p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Cart Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-cyan-500" />
                  <h3 className="text-lg font-black uppercase tracking-tight">Your Cart</h3>
                  <span className="text-xs text-neutral-500 font-semibold">
                    ({totalCartCount} items)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 cursor-pointer"
                  aria-label="Close cart drawer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Free Shipping Ticker */}
              <div className="my-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-600 dark:text-cyan-400 font-medium">
                Free Express Worldwide Shipping Unlocked!
              </div>

              {/* Items List */}
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                {cart.length === 0 ? (
                  <p className="text-sm text-neutral-400 text-center py-8">Your cart is empty.</p>
                ) : (
                  cart.map((item, idx) => (
                    <div
                      key={item.product.id + item.size + item.colorway}
                      className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800"
                    >
                      <img
                        src={item.product.thumbnail}
                        alt={item.product.name}
                        className="h-16 w-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold uppercase truncate">{item.product.name}</p>
                        <p className="text-[11px] text-neutral-400">
                          Size: {item.size} · Price: {item.product.price}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => updateCartQty(idx, -1)}
                            className="p-1 rounded bg-neutral-200 dark:bg-neutral-700 hover:opacity-80"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-mono font-bold">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateCartQty(idx, 1)}
                            className="p-1 rounded bg-neutral-200 dark:bg-neutral-700 hover:opacity-80"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCartItem(idx)}
                        className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Cart Footer */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-500 font-medium">Subtotal</span>
                <span className="font-bold text-lg tabular-nums">${cartSubtotal.toFixed(2)}</span>
              </div>
              <button
                type="button"
                disabled={cart.length === 0}
                onClick={() => {
                  if (cart.length > 0) {
                    handleBuy(cart[0].product);
                  }
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold text-sm uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-lg cursor-pointer disabled:opacity-50"
              >
                <span>Proceed To Liquid Checkout</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Nimbus Liquid Glass Checkout Modal (Photo 3 feature!) */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-3xl rounded-3xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors z-20 cursor-pointer"
              aria-label="Close checkout modal"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-6 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-500 bg-cyan-500/10 px-2.5 py-0.5 rounded-full">
                DOOMS WEAR 3D LIQUID CHECKOUT
              </span>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900 dark:text-white">
                Secure Order · {checkoutProduct.name}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Interactive WebGL water physics card with real-time tilt, slosh, and instant verification.
              </p>
            </div>

            {/* The Nimbus Liquid Glass Checkout Component */}
            <div className="w-full flex justify-center py-2">
              <LiquidCheckout
                amount={
                  typeof checkoutProduct.price === "number"
                    ? checkoutProduct.price
                    : parseFloat(String(checkoutProduct.price).replace(/[^0-9.]/g, "")) || 295
                }
                currency="USD"
                merchant={`DOOMS WEAR · ${checkoutProduct.name}`}
                tone={isDark ? "dark" : "light"}
                sound={soundEnabled}
                note="Encrypted 256-bit SSL · Worldwide Express Shipping"
                onPay={async (details) => {
                  playSound(600, 1400);
                  await new Promise((r) => setTimeout(r, 1600));
                  playSound(800, 1600);
                  showNotification(`Payment successful for ${checkoutProduct.name}!`);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer
        id="footer-section"
        className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 mt-20 py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-black text-sm">
              DW
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-wider">DOOMS WEAR</p>
              <p className="text-xs text-neutral-400 font-mono">
                © 2026 DOOMS WEAR LAB. ALL RIGHTS RESERVED.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-neutral-500 font-semibold uppercase tracking-wider">
            <RandomLetterSwap label="PRIVACY" className="cursor-pointer hover:text-foreground" />
            <RandomLetterSwap label="TERMS" className="cursor-pointer hover:text-foreground" />
            <RandomLetterSwap label="WARRANTY" className="cursor-pointer hover:text-foreground" />
            <RandomLetterSwap label="CONTACT" className="cursor-pointer hover:text-foreground" />
          </div>
        </div>
      </footer>
    </div>
  );
}
