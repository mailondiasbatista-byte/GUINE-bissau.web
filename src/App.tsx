import React, { useEffect, useState } from 'react';
import {
  MessageCircle,
  ShoppingBag,
  Phone,
  CheckCircle2,
  Truck,
  ShieldCheck,
  ArrowRight,
  MapPin,
  RotateCcw,
  Info,
  Lock,
  PackageCheck,
  XCircle,
  Star,
  Plus,
  Check,
} from 'lucide-react';
import {
  DEFAULT_PRODUCT_INDEX,
  GarmentCategory,
  PRODUCTS as INITIAL_PRODUCTS,
  ProductItem,
  WHATSAPP_NUMBERS,
} from './data/products';
import { RackShowcase } from './components/RackShowcase';
import { ProductDetailStudio } from './components/ProductDetailStudio';
import { FabricSpecsSection } from './components/FabricSpecsSection';
import { ImageDetailsGallerySection } from './components/ImageDetailsGallerySection';
import { CatalogCardItem } from './components/CatalogCardItem';
import { BagDrawer, BagLineItem } from './components/BagDrawer';
import { AdminPanel, AdminProductStock } from './components/AdminPanel';
import { ProductPageModal } from './components/ProductPageModal';
import { StandaloneProductPage } from './components/StandaloneProductPage';

const LOCAL_STORAGE_STOCK_KEY = 'djurtus_stock_data_v2';
const LOCAL_STORAGE_PRODUCTS_KEY = 'djurtus_custom_products_v2';

// Estado inicial de estoque padrão para todos os produtos
const buildDefaultStockData = (productList: ProductItem[]): Record<string, AdminProductStock> => {
  const stockMap: Record<string, AdminProductStock> = {};
  productList.forEach((prod) => {
    stockMap[prod.id] = {
      id: prod.id,
      name: prod.name,
      subtitle: prod.subtitle,
      priceMAD: prod.priceMAD,
      category: prod.category,
      frontImage: prod.frontImage,
      backImage: prod.backImage,
      isActive: true,
      stockPerSize: { P: 5, M: 5, G: 5, GG: 5 },
    };
  });
  return stockMap;
};

export default function App() {
  // Estado dos Produtos (Inicial + Customizados salvos no localStorage)
  const [productList, setProductList] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (err) {
      console.warn('Erro ao carregar produtos do localStorage:', err);
    }
    return INITIAL_PRODUCTS;
  });

  // Estado do Estoque por Produto e Tamanho
  const [stockData, setStockData] = useState<Record<string, AdminProductStock>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_STOCK_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (err) {
      console.warn('Erro ao carregar estoque do localStorage:', err);
    }
    return buildDefaultStockData(INITIAL_PRODUCTS);
  });

  const [selectedIndex, setSelectedIndex] = useState<number>(DEFAULT_PRODUCT_INDEX);
  const [activeCategory, setActiveCategory] = useState<GarmentCategory>(GarmentCategory.ALL);
  const [bagItems, setBagItems] = useState<BagLineItem[]>([]);
  const [isBagOpen, setIsBagOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [catalogFailed, setCatalogFailed] = useState<Record<string, boolean>>({});
  const [cardViewSides, setCardViewSides] = useState<Record<string, 'front' | 'back'>>({});
  const [recentlySelectedCatalogId, setRecentlySelectedCatalogId] = useState<string | null>(null);

  // Estado da Página/Modal Detalhado do Produto
  const [selectedModalProduct, setSelectedModalProduct] = useState<ProductItem | null>(null);
  const [isProductPageModalOpen, setIsProductPageModalOpen] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'store' | 'product'>('store');
  const [selectedStandaloneProduct, setSelectedStandaloneProduct] = useState<ProductItem | null>(null);

  const handleOpenProductPage = (product: ProductItem) => {
    setSelectedStandaloneProduct(product);
    setActiveView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProductModal = (product: ProductItem) => {
    setSelectedStandaloneProduct(product);
    setSelectedModalProduct(product);
    setIsProductPageModalOpen(true);
  };

  // O destaque de seleção temporário no catálogo expira em 3s
  useEffect(() => {
    if (!recentlySelectedCatalogId) return;
    const timer = window.setTimeout(() => {
      setRecentlySelectedCatalogId(null);
    }, 3000);
    return () => {
      window.clearTimeout(timer);
    };
  }, [recentlySelectedCatalogId]);

  // Detectar rota /admin na hash da URL
  useEffect(() => {
    const checkHashRoute = () => {
      if (window.location.hash === '#admin' || window.location.pathname === '/admin') {
        setIsAdminOpen(true);
      }
    };
    checkHashRoute();
    window.addEventListener('hashchange', checkHashRoute);
    return () => window.removeEventListener('hashchange', checkHashRoute);
  }, []);

  // Persistir estoque no localStorage sempre que houver alteração
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_STOCK_KEY, JSON.stringify(stockData));
    } catch (err) {
      console.warn('Erro ao salvar estoque no localStorage:', err);
    }
  }, [stockData]);

  // Persistir lista de produtos customizada no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(productList));
    } catch (err) {
      console.warn('Erro ao salvar produtos no localStorage:', err);
    }
  }, [productList]);

  // REGRA 3: ATUALIZAÇÃO DA SACOLA EM TEMPO REAL QUANDO O ESTOQUE MUDAR NO ADMIN
  useEffect(() => {
    setBagItems((prev) =>
      prev
        .map((item) => {
          const prodStock = stockData[item.product.id];
          if (!prodStock || !prodStock.isActive) return null;
          const maxAvailable = prodStock.stockPerSize[item.size] ?? 0;
          if (maxAvailable <= 0) return null;
          if (item.quantity > maxAvailable) {
            return { ...item, quantity: maxAvailable };
          }
          return item;
        })
        .filter((item): item is BagLineItem => item !== null)
    );
  }, [stockData]);

  const selectedProduct = productList[selectedIndex] ?? productList[0] ?? INITIAL_PRODUCTS[0];
  const totalBagCount = bagItems.reduce((sum, item) => sum + item.quantity, 0);

  // Navegação por teclado na arara de produtos (Seta esquerda / Seta direita)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) => (prev === 0 ? productList.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) => (prev === productList.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [productList.length]);

  const scrollToDetail = () => {
    const detailEl = document.getElementById('product-studio-detail');
    if (detailEl) {
      detailEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectFromCatalog = (productId: string) => {
    const foundIndex = productList.findIndex((p) => p.id === productId);
    if (foundIndex >= 0) {
      setSelectedIndex(foundIndex);
      setRecentlySelectedCatalogId(productId);
      scrollToDetail();
    }
  };

  // REGRA 1 & 2: VALIDAÇÃO RIGOROSA NO ADICIONAR
  const handleAddToBag = (product: ProductItem, size: string) => {
    const prodStock = stockData[product.id];
    if (!prodStock || !prodStock.isActive) return;

    const maxStock = prodStock.stockPerSize[size] ?? 0;
    const existingInBag = bagItems.find(
      (item) => item.product.id === product.id && item.size === size
    );
    const currentQtyInBag = existingInBag?.quantity ?? 0;

    // Se já atingiu o limite de estoque para esse tamanho, não adiciona mais
    if (currentQtyInBag >= maxStock) return;

    setBagItems((prev) => {
      if (existingInBag) {
        return prev.map((item) =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: Math.min(item.quantity + 1, maxStock) }
            : item
        );
      }
      return [...prev, { product, size, quantity: 1 }];
    });
  };

  // REGRA 1 & 2: VALIDAÇÃO NO INCREMENTO DA SACOLA
  const handleUpdateBagQty = (productId: string, size: string, delta: number) => {
    const prodStock = stockData[productId];
    if (!prodStock || !prodStock.isActive) return;

    const maxStock = prodStock.stockPerSize[size] ?? 0;

    setBagItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.size === size) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            if (nextQty > maxStock) return { ...item, quantity: maxStock };
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item): item is BagLineItem => item !== null)
    );
  };

  const handleRemoveBagItem = (productId: string, size: string) => {
    setBagItems((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.size === size))
    );
  };

  // Encomenda rápida no WhatsApp com mensagem formatada em português
  const handleDirectWhatsApp = (product: ProductItem, size: string = 'G') => {
    const prodStock = stockData[product.id];
    const availableQty = prodStock?.stockPerSize[size] ?? 0;
    if (!prodStock?.isActive || availableQty <= 0) return;

    const message = encodeURIComponent(
      `*NOVA ENCOMENDA — DJURTUS.STUDIO MARROCOS* 🇬🇼🇲🇦\n\n` +
      `Olá! Gostaria de encomendar:\n` +
      `• *Artigo:* ${product.name}\n` +
      `• *Tamanho:* ${size}\n` +
      `• *Preço Oficial:* ${product.priceMAD} MAD\n` +
      `• *Cor:* ${product.colorway}\n` +
      `• *Entrega:* Marrocos\n\n` +
      `Por favor confirmem a disponibilidade e o prazo de entrega. Obrigado!`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBERS[0].clean}?text=${message}`, '_blank');
  };

  const handleUpdateStockData = (updatedStockData: Record<string, AdminProductStock>) => {
    setStockData(updatedStockData);
  };

  const handleAddProduct = (
    newProduct: ProductItem,
    initialStock: Record<string, number>
  ) => {
    setProductList((prev) => [...prev, newProduct]);
    setStockData((prev) => ({
      ...prev,
      [newProduct.id]: {
        id: newProduct.id,
        name: newProduct.name,
        subtitle: newProduct.subtitle,
        priceMAD: newProduct.priceMAD,
        category: newProduct.category,
        frontImage: newProduct.frontImage,
        backImage: newProduct.backImage,
        isActive: true,
        stockPerSize: initialStock,
      },
    }));
  };

  const handleResetStockData = () => {
    setProductList(INITIAL_PRODUCTS);
    const defaults = buildDefaultStockData(INITIAL_PRODUCTS);
    setStockData(defaults);
    localStorage.removeItem(LOCAL_STORAGE_STOCK_KEY);
    localStorage.removeItem(LOCAL_STORAGE_PRODUCTS_KEY);
  };

  const toggleCardSide = (prodId: string) => {
    setCardViewSides((prev) => ({
      ...prev,
      [prodId]: prev[prodId] === 'back' ? 'front' : 'back',
    }));
  };

  const filteredCatalog =
    activeCategory === GarmentCategory.ALL
      ? productList
      : productList.filter((p) => p.category === activeCategory);

  // SE ESTIVER EM MODO DE PÁGINA EXCLUSIVA DO PRODUTO
  if (activeView === 'product' && selectedStandaloneProduct) {
    return (
      <div id="home" className="min-h-screen flex flex-col bg-[#f8f8f8] text-[#111110] w-full">
        <header className="sticky top-0 z-40 h-16 bg-[#f8f8f8]/90 backdrop-blur-md w-full border-b border-black/5">
          <div className="w-full px-4 sm:px-6 md:px-10 h-full flex items-center justify-between gap-8">
            <button
              type="button"
              onClick={() => setActiveView('store')}
              className="font-display text-lg font-black tracking-tight text-[#111110] whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
            >
              <span>DJURTUS.STUDIO</span>
            </button>

            <nav
              aria-label="Navegação da Página do Produto"
              className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-[#444440]"
            >
              <button
                type="button"
                onClick={() => setActiveView('store')}
                className="hover:text-[#111110] transition-colors whitespace-nowrap shrink-0 cursor-pointer font-bold"
              >
                ← Voltar à Loja Principal
              </button>
              <span className="text-[#188B46] font-black uppercase tracking-wider whitespace-nowrap shrink-0">
                Página Exclusiva do Produto
              </span>
            </nav>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsBagOpen(true)}
                aria-label={`Ver sacola de encomendas com ${totalBagCount} itens`}
                className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#111110] text-xs font-bold hover:bg-[#111110] hover:text-white transition-all shadow-2xs cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#A2141E]" />
                <span className="hidden sm:inline">Sacola</span>
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-[#111110] text-white text-[11px] font-bold">
                  {totalBagCount}
                </span>
              </button>
            </div>
          </div>
        </header>

        <StandaloneProductPage
          product={selectedStandaloneProduct}
          stockData={stockData}
          onBackToHome={() => setActiveView('store')}
          onSelectProduct={(prod) => setSelectedStandaloneProduct(prod)}
          onAddToBag={handleAddToBag}
          onOpenBag={() => setIsBagOpen(true)}
        />

        {/* RODAPÉ ELEGANTE */}
        <footer className="bg-[#111110] text-white py-12 w-full">
          <div className="w-full px-4 sm:px-6 md:px-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
              <div>
                <span className="font-display font-black text-xl text-white">DJURTUS.STUDIO</span>
                <p className="text-xs text-white/60 mt-1 max-w-md">
                  Página dedicada do artigo oficial da Seleção Nacional da Guiné-Bissau em Marrocos.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-xs font-bold uppercase tracking-wider text-white/70">
                <button type="button" onClick={() => setActiveView('store')} className="hover:text-white transition-colors cursor-pointer font-bold">
                  Voltar à Loja
                </button>
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
              <p>© {new Date().getFullYear()} DJURTUS.STUDIO. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>

        <BagDrawer
          isOpen={isBagOpen}
          items={bagItems}
          stockData={stockData}
          onClose={() => setIsBagOpen(false)}
          onUpdateQty={handleUpdateBagQty}
          onRemoveItem={handleRemoveBagItem}
          onClearBag={() => setBagItems([])}
        />
      </div>
    );
  }

  return (
    <div id="home" className="min-h-screen flex flex-col bg-[#f8f8f8] text-[#111110] w-full">
      {/* ======================================================== */}
      {/* CABEÇALHO ELEGANTE & LIMPO (FULL WIDTH)                 */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 h-16 bg-[#f8f8f8]/90 backdrop-blur-md w-full border-b border-black/5">
        <div className="w-full px-4 sm:px-6 md:px-10 h-full flex items-center justify-between gap-8">
          {/* Zona 1: Nome da Marca */}
          <a
            href="#home"
            className="font-display text-lg font-black tracking-tight text-[#111110] whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span>DJURTUS.STUDIO</span>
          </a>

          {/* Zona 2: Links de Navegação Comerciais Limpos */}
          <nav
            aria-label="Navegação Principal"
            className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-[#444440]"
          >
            <a
              href="#home"
              className="hover:text-[#111110] transition-colors whitespace-nowrap shrink-0"
            >
              Início
            </a>
            <a
              href="#tecnologia"
              className="hover:text-[#111110] transition-colors whitespace-nowrap shrink-0"
            >
              Tecnologia &amp; Tecido
            </a>
            <a
              href="#detalhes-fotograficos"
              className="hover:text-[#111110] transition-colors whitespace-nowrap shrink-0"
            >
              Galeria &amp; Pormenores
            </a>
            <button
              type="button"
              onClick={() => handleOpenProductPage(selectedProduct)}
              className="hover:text-[#111110] text-[#188B46] font-extrabold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Página do Produto
            </button>
          </nav>

          {/* Zona 3: Sacola de WhatsApp & Indicador Admin */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsBagOpen(true)}
              aria-label={`Ver sacola de encomendas com ${totalBagCount} itens`}
              className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#111110] text-xs font-bold hover:bg-[#111110] hover:text-white transition-all shadow-2xs cursor-pointer border border-black/5"
            >
              <ShoppingBag className="w-4 h-4 text-[#A2141E]" />
              <span className="hidden sm:inline">Sacola</span>
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-[#111110] text-white text-[11px] font-bold">
                {totalBagCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* HERO / CAMPAIGN BANNER EDITORIAL CLEAN (FULL WIDTH)      */}
      {/* ======================================================== */}
      <section className="relative z-10 pt-6 pb-6 w-full">
        <div className="w-full px-4 sm:px-6 md:px-10">
          <div
            className="relative overflow-hidden rounded-3xl p-8 md:p-12 text-white shadow-xl w-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(17, 17, 16, 0.92), rgba(17, 17, 16, 0.72)), url('/bandeira.png')`,
            }}
          >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left space-y-3">
                <p className="text-xs uppercase tracking-[0.2em] text-[#888880] font-bold">
                  Seleção Nacional da Guiné-Bissau · Marrocos
                </p>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight font-display text-white">
                  Camisolas Oficiais &amp; Fatos de Treino
                </h1>
                <p className="text-sm md:text-base text-white/80 max-w-3xl leading-relaxed">
                  Mostra o teu orgulho pelos Djurtus. Peças originais da Guisport de alta qualidade, com fotografias de estúdio frente e costas, disponíveis para entrega rápida em todas as cidades de Marrocos.
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-2 text-xs text-white/70">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
                    <span>Fotografias 100% Originais</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-white" />
                    <span>Entrega Direta em Marrocos</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#25D366]" />
                    <span>Sem Cartão · Encomenda no WhatsApp</span>
                  </span>
                </div>
              </div>

              {/* Tabela de Preços Oficiais em Destaque */}
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-3 shrink-0">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 text-center min-w-[140px]">
                  <p className="text-[11px] uppercase tracking-wider text-white/70 font-bold">Oficiais</p>
                  <p className="text-2xl md:text-3xl font-black text-white mt-1">250 <span className="text-xs font-bold text-white/70">MAD</span></p>
                  <p className="text-[10px] text-white/60 mt-0.5">Guisport Titular &amp; Alternativa</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 text-center min-w-[140px]">
                  <p className="text-[11px] uppercase tracking-wider text-white/70 font-bold">Fato de Treino</p>
                  <p className="text-2xl md:text-3xl font-black text-[#25D366] mt-1">380 <span className="text-xs font-bold text-white/70">MAD</span></p>
                  <p className="text-[10px] text-white/60 mt-0.5">Jaqueta Oficial &amp; Calça</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* VITRINE HORIZONTAL NA ARARA METÁLICA (CARROSSEL)         */}
      {/* ======================================================== */}
      <main className="flex-1 w-full">
        <RackShowcase
          products={productList}
          selectedIndex={selectedIndex}
          stockData={stockData}
          onSelectIndex={setSelectedIndex}
          onInspectProduct={() => handleOpenProductPage(selectedProduct)}
          onQuickWhatsApp={handleDirectWhatsApp}
          onAddToBag={handleAddToBag}
        />

        {/* ======================================================== */}
        {/* DETALHE DO PRODUTO EM ESTÚDIO (FRENTE / COSTAS REAIS)    */}
        {/* ======================================================== */}
        <ProductDetailStudio
          product={selectedProduct}
          stockData={stockData}
          onAddToBag={handleAddToBag}
          onPrevProduct={() =>
            setSelectedIndex((prev) => (prev === 0 ? productList.length - 1 : prev - 1))
          }
          onNextProduct={() =>
            setSelectedIndex((prev) => (prev === productList.length - 1 ? 0 : prev + 1))
          }
        />

        {/* ======================================================== */}
        {/* GALERIA DE PORMENORES & DETALHES FOTOGRÁFICOS (INTERATIVA)*/}
        {/* ======================================================== */}
        <ImageDetailsGallerySection
          onOpenProductModal={handleOpenProductPage}
          onAddToBag={handleAddToBag}
        />

        {/* ======================================================== */}
        {/* TECNOLOGIA, QUALIDADE DO TECIDO & ESPECIFICAÇÕES GUISPORT */}
        {/* ======================================================== */}
        <FabricSpecsSection />



        {/* ======================================================== */}
        {/* PROVA SOCIAL: AVALIAÇÕES DE ADEPTOS EM MARROCOS          */}
        {/* ======================================================== */}
        <section aria-label="Avaliações de Adeptos" className="py-16 md:py-20 bg-white w-full">
          <div className="w-full px-4 sm:px-6 md:px-10">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-1 text-[#25D366] mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current text-[#25D366]" />
                ))}
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold font-display text-[#111110]">
                O que dizem os adeptos dos Djurtus em Marrocos
              </h2>
              <p className="text-xs md:text-sm text-[#666660] mt-1">
                Entregas rápidas confirmadas em Casablanca, Rabat, Marrakech e Fès.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              <div className="bg-[#f8f8f8] p-6 rounded-2xl space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex text-[#25D366]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current text-[#25D366]" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#188B46] bg-[#25D366]/10 px-2 py-0.5 rounded">
                    Compra Verificada · Casablanca
                  </span>
                </div>
                <p className="text-xs text-[#333330] leading-relaxed italic">
                  "A qualidade da camisola original da Guisport é incrível! Encomendei por WhatsApp em Casablanca e entregaram em menos de 24 horas. Recomendo 100%!"
                </p>
                <p className="text-xs font-bold text-[#111110]">— Bacar S., Casablanca</p>
              </div>

              <div className="bg-[#f8f8f8] p-6 rounded-2xl space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex text-[#25D366]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current text-[#25D366]" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#188B46] bg-[#25D366]/10 px-2 py-0.5 rounded">
                    Compra Verificada · Rabat
                  </span>
                </div>
                <p className="text-xs text-[#333330] leading-relaxed italic">
                  "Personalizei o meu fato de treino com o número 10 e ficou espetacular! O atendimento no WhatsApp foi muito prestável."
                </p>
                <p className="text-xs font-bold text-[#111110]">— Lassana C., Rabat</p>
              </div>

              <div className="bg-[#f8f8f8] p-6 rounded-2xl space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex text-[#25D366]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current text-[#25D366]" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#188B46] bg-[#25D366]/10 px-2 py-0.5 rounded">
                    Compra Verificada · Marrakech
                  </span>
                </div>
                <p className="text-xs text-[#333330] leading-relaxed italic">
                  "Paguei diretamente ao estafeta no momento da entrega em Marrakech. Sem complicação com cartões. Tecido super fresco e original."
                </p>
                <p className="text-xs font-bold text-[#111110]">— Malam D., Marrakech</p>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* CONTACTOS WHATSAPP MARROCOS                              */}
        {/* ======================================================== */}
        <section id="contacto" aria-label="Contactos WhatsApp Marrocos" className="py-16 md:py-20 w-full">
          <div className="w-full px-4 sm:px-6 md:px-10">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-extrabold font-display text-[#111110] tracking-tight">
                    Contactos &amp; Encomendas em Marrocos
                  </h2>
                  <p className="text-sm text-[#555550] mt-3 leading-relaxed">
                    A nossa equipa oficial atende diretamente pelo WhatsApp para confirmar tamanhos, combinar locais de entrega e enviar a sua encomenda.
                  </p>

                  <div className="mt-6 space-y-4">
                    {/* Linha 1 */}
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBERS[0].clean}?text=${encodeURIComponent(
                        'Olá! Gostaria de encomendar um equipamento ou fato de treino dos Djurtus em Marrocos.'
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between p-5 rounded-2xl bg-[#f8f8f8] hover:bg-[#25D366]/10 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0">
                          <MessageCircle className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[11px] text-[#666660] font-bold uppercase tracking-wider">
                            Atendimento Principal
                          </p>
                          <p className="text-lg font-bold font-mono text-[#111110]">
                            {WHATSAPP_NUMBERS[0].number}
                          </p>
                        </div>
                      </div>
                      <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#25D366]">
                        <span>Conversar</span>
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </a>

                    {/* Linha 2 */}
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBERS[1].clean}?text=${encodeURIComponent(
                        'Olá! Gostaria de obter informações sobre os equipamentos dos Djurtus em Marrocos.'
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between p-5 rounded-2xl bg-[#f8f8f8] hover:bg-[#111110]/5 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#111110] text-white flex items-center justify-center shrink-0">
                          <Phone className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[11px] text-[#666660] font-bold uppercase tracking-wider">
                            Linha de Apoio
                          </p>
                          <p className="text-lg font-bold font-mono text-[#111110]">
                            {WHATSAPP_NUMBERS[1].number}
                          </p>
                        </div>
                      </div>
                      <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#111110]">
                        <span>Conversar</span>
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </a>
                  </div>
                </div>

                {/* Caixa informativa de entrega em Marrocos */}
                <div className="bg-[#f8f8f8] rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#111110]">
                    <MapPin className="w-4 h-4 text-[#A2141E]" />
                    <span>Cidades Atendidas em Marrocos:</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-semibold text-[#444440]">
                    <span className="bg-white px-3 py-2 rounded-lg text-center shadow-2xs">Casablanca</span>
                    <span className="bg-white px-3 py-2 rounded-lg text-center shadow-2xs">Rabat</span>
                    <span className="bg-white px-3 py-2 rounded-lg text-center shadow-2xs">Marrakech</span>
                    <span className="bg-white px-3 py-2 rounded-lg text-center shadow-2xs">Fès</span>
                    <span className="bg-white px-3 py-2 rounded-lg text-center shadow-2xs">Tanger</span>
                    <span className="bg-white px-3 py-2 rounded-lg text-center shadow-2xs">Agadir</span>
                    <span className="bg-white px-3 py-2 rounded-lg text-center shadow-2xs">Kenitra</span>
                    <span className="bg-white px-3 py-2 rounded-lg text-center shadow-2xs">Oujda</span>
                    <span className="bg-white px-3 py-2 rounded-lg text-center shadow-2xs">Meknès</span>
                  </div>

                  <div className="pt-3 flex items-start gap-3 text-xs text-[#666660]">
                    <Info className="w-4 h-4 text-[#111110] shrink-0 mt-0.5" />
                    <p>
                      Entregas rápidas e diretas sem necessidade de pagamento por cartão de crédito.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ======================================================== */}
      {/* RODAPÉ ELEGANTE & MINIMALISTA (COM BOTÃO ADMIN)          */}
      {/* ======================================================== */}
      <footer className="bg-[#111110] text-white py-12 w-full">
        <div className="w-full px-4 sm:px-6 md:px-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div>
              <span className="font-display font-black text-xl text-white">DJURTUS.STUDIO</span>
              <p className="text-xs text-white/60 mt-1 max-w-md">
                Equipamentos oficiais e fatos de treino da Seleção Nacional da Guiné-Bissau para adeptos em Marrocos.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-bold uppercase tracking-wider text-white/70">
              <a href="#home" className="hover:text-white transition-colors">Início</a>
              <a href="#equipamentos" className="hover:text-white transition-colors">Catálogo</a>
              <a href="#fatos-de-treino" className="hover:text-white transition-colors">Fatos de Treino</a>
              <a href="#contacto" className="hover:text-white transition-colors">Contactos</a>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
            <p>© {new Date().getFullYear()} DJURTUS.STUDIO. Todos os direitos reservados.</p>

            <div className="flex items-center gap-4">
              {/* Botão discreto para o Painel Admin */}
              <button
                type="button"
                onClick={() => setIsAdminOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors cursor-pointer bg-white/5 px-3 py-1.5 rounded-lg border border-white/10"
              >
                <Lock className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Painel Admin</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ======================================================== */}
      {/* GAVETA / MODAL DE ENCOMENDA NO WHATSAPP                 */}
      {/* ======================================================== */}
      <BagDrawer
        isOpen={isBagOpen}
        items={bagItems}
        stockData={stockData}
        onClose={() => setIsBagOpen(false)}
        onUpdateQty={handleUpdateBagQty}
        onRemoveItem={handleRemoveBagItem}
        onClearBag={() => setBagItems([])}
      />

      {/* ======================================================== */}
      {/* PAINEL DE ADMINISTRAÇÃO INTEGRADO (/admin)                */}
      {/* ======================================================== */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          if (window.location.hash === '#admin') {
            window.history.pushState('', document.title, window.location.pathname);
          }
        }}
        products={productList}
        stockData={stockData}
        onUpdateStock={handleUpdateStockData}
        onAddProduct={handleAddProduct}
        onResetStock={handleResetStockData}
      />
      {/* ======================================================== */}
      {/* PÁGINA / MODAL DEDICADO DO PRODUTO (FULL PRODUCT VIEW)   */}
      {/* ======================================================== */}
      <ProductPageModal
        product={selectedModalProduct}
        stockData={stockData}
        isOpen={isProductPageModalOpen}
        onClose={() => setIsProductPageModalOpen(false)}
        onAddToBag={handleAddToBag}
      />
    </div>
  );
}
