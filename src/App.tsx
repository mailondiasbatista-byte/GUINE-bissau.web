import React, { useEffect, useState } from 'react';
import {
  Download,
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
} from 'lucide-react';
import {
  DEFAULT_PRODUCT_INDEX,
  GarmentCategory,
  PRODUCTS,
  ProductItem,
  WHATSAPP_NUMBERS,
} from './data/products';
import { RackShowcase } from './components/RackShowcase';
import { ProductDetailStudio } from './components/ProductDetailStudio';
import { BagDrawer, BagLineItem } from './components/BagDrawer';
import { downloadStandaloneHtml } from './utils/exportStandaloneHtml';

export default function App() {
  const [selectedIndex, setSelectedIndex] = useState<number>(DEFAULT_PRODUCT_INDEX);
  const [activeCategory, setActiveCategory] = useState<GarmentCategory>(GarmentCategory.ALL);
  const [bagItems, setBagItems] = useState<BagLineItem[]>([]);
  const [isBagOpen, setIsBagOpen] = useState<boolean>(false);
  const [catalogFailed, setCatalogFailed] = useState<Record<string, boolean>>({});
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [cardViewSides, setCardViewSides] = useState<Record<string, 'front' | 'back'>>({});

  const selectedProduct = PRODUCTS[selectedIndex] ?? PRODUCTS[0];
  const totalBagCount = bagItems.reduce((sum, item) => sum + item.quantity, 0);

  // Navegação por teclado na arara de produtos (Seta esquerda / Seta direita)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) => (prev === 0 ? PRODUCTS.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) => (prev === PRODUCTS.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const scrollToDetail = () => {
    const detailEl = document.getElementById('product-studio-detail');
    if (detailEl) {
      detailEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectFromCatalog = (productId: string) => {
    const foundIndex = PRODUCTS.findIndex((p) => p.id === productId);
    if (foundIndex >= 0) {
      setSelectedIndex(foundIndex);
      scrollToDetail();
    }
  };

  const handleAddToBag = (product: ProductItem, size: string) => {
    setBagItems((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.size === size
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, size, quantity: 1 }];
    });
  };

  const handleUpdateBagQty = (productId: string, size: string, delta: number) => {
    setBagItems((prev) =>
      prev
        .map((item) =>
          item.product.id === productId && item.size === size
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveBagItem = (productId: string, size: string) => {
    setBagItems((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.size === size))
    );
  };

  // Encomenda rápida no WhatsApp com mensagem formatada em português
  const handleDirectWhatsApp = (product: ProductItem, size: string = 'G') => {
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

  const handleExportHtml = async () => {
    setIsExporting(true);
    try {
      await downloadStandaloneHtml();
    } finally {
      setIsExporting(false);
    }
  };

  const toggleCardSide = (prodId: string) => {
    setCardViewSides((prev) => ({
      ...prev,
      [prodId]: prev[prodId] === 'back' ? 'front' : 'back',
    }));
  };

  const filteredCatalog =
    activeCategory === GarmentCategory.ALL
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

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
            className="font-display text-lg font-black tracking-tight text-[#111110] whitespace-nowrap shrink-0"
          >
            DJURTUS.STUDIO
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
              href="#equipamentos"
              className="hover:text-[#111110] transition-colors whitespace-nowrap shrink-0"
            >
              Equipamentos
            </a>
            <a
              href="#fatos-de-treino"
              className="hover:text-[#111110] transition-colors whitespace-nowrap shrink-0"
            >
              Fatos de Treino
            </a>
            <a
              href="#contacto"
              className="hover:text-[#111110] transition-colors whitespace-nowrap shrink-0"
            >
              Contactos
            </a>
          </nav>

          {/* Zona 3: Sacola de WhatsApp */}
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

      {/* ======================================================== */}
      {/* HERO / CAMPAIGN BANNER EDITORIAL CLEAN (FULL WIDTH)      */}
      {/* ======================================================== */}
      <section className="relative z-10 pt-6 pb-6 w-full">
        <div className="w-full px-4 sm:px-6 md:px-10">
          <div className="bg-[#111110] rounded-3xl p-8 md:p-12 text-white shadow-xl w-full">
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
          products={PRODUCTS}
          selectedIndex={selectedIndex}
          onSelectIndex={setSelectedIndex}
          onInspectProduct={scrollToDetail}
          onQuickWhatsApp={handleDirectWhatsApp}
        />

        {/* ======================================================== */}
        {/* DETALHE DO PRODUTO EM ESTÚDIO (FRENTE / COSTAS REAIS)    */}
        {/* ======================================================== */}
        <ProductDetailStudio
          product={selectedProduct}
          onAddToBag={handleAddToBag}
          onPrevProduct={() =>
            setSelectedIndex((prev) => (prev === 0 ? PRODUCTS.length - 1 : prev - 1))
          }
          onNextProduct={() =>
            setSelectedIndex((prev) => (prev === PRODUCTS.length - 1 ? 0 : prev + 1))
          }
        />

        {/* ======================================================== */}
        {/* GALERIA EXCLUSIVA: FRENTE & COSTAS DE TODAS AS PEÇAS     */}
        {/* ======================================================== */}
        <section
          id="equipamentos"
          aria-label="Galeria Oficial de Peças Frente e Costas"
          className="py-16 md:py-20 w-full"
        >
          <div className="w-full px-4 sm:px-6 md:px-10">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl md:text-4xl font-extrabold font-display text-[#111110] tracking-tight">
                Coleção de Equipamentos &amp; Fatos
              </h2>
              <p className="text-xs md:text-sm text-[#555550] mt-2">
                Fotografias de estúdio reais com vista de frente e costas para cada modelo da Seleção Nacional da Guiné-Bissau.
              </p>
            </div>

            {/* Lista dos Modelos com Frente e Costas Lado a Lado */}
            <div className="space-y-12">
              {PRODUCTS.map((prod) => (
                <div
                  key={`gallery-${prod.id}`}
                  className="bg-white rounded-3xl p-6 md:p-8 shadow-xs w-full"
                >
                  <div className="flex flex-col lg:flex-row items-center gap-8 w-full">
                    {/* Par de Imagens: Frente e Costas */}
                    <div className="grid grid-cols-2 gap-4 w-full lg:w-[50%] shrink-0">
                      {/* Vista Frontal */}
                      <div className="relative group bg-[#EFEFEF] rounded-2xl p-4 flex flex-col items-center">
                        <div className="w-full aspect-[3/4] flex items-center justify-center overflow-hidden">
                          <img
                            src={prod.frontImage}
                            alt={`${prod.name} — Frente`}
                            loading="lazy"
                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>

                      {/* Vista de Costas */}
                      <div className="relative group bg-[#EFEFEF] rounded-2xl p-4 flex flex-col items-center">
                        <div className="w-full aspect-[3/4] flex items-center justify-center overflow-hidden">
                          <img
                            src={prod.backImage}
                            alt={`${prod.name} — Costas`}
                            loading="lazy"
                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Especificações & Botão de Encomenda */}
                    <div className="w-full lg:w-[50%] flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <h3 className="font-display text-xl md:text-2xl font-bold text-[#111110]">
                            {prod.name}
                          </h3>
                          <span className="text-2xl font-mono tabular-nums font-black text-[#111110]">
                            {prod.priceMAD} <span className="text-xs font-semibold text-[#666660]">MAD</span>
                          </span>
                        </div>
                        <p className="text-xs font-bold text-[#666660] mt-1">
                          {prod.subtitle} · {prod.colorway}
                        </p>

                        <p className="text-xs md:text-sm text-[#444440] leading-relaxed mt-3">
                          {prod.heritageStory}
                        </p>

                        <div className="mt-4 pt-3 space-y-2 text-xs text-[#555550]">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#111110]">Tecido:</span>
                            <span>{prod.fabricSpec}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#111110]">Tamanhos:</span>
                            <div className="flex gap-1.5 font-bold text-[#111110]">
                              {prod.sizes.map((sz) => (
                                <span
                                  key={sz}
                                  className="w-7 h-7 rounded-lg bg-[#EFEFEF] flex items-center justify-center text-xs"
                                >
                                  {sz}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Botões de Ação Direta */}
                      <div className="pt-2 flex flex-col sm:flex-row gap-3">
                        <button
                          type="button"
                          onClick={() => handleDirectWhatsApp(prod, 'G')}
                          className="flex-1 py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Pedir Este Modelo no WhatsApp ({prod.priceMAD} MAD)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAddToBag(prod, 'G')}
                          className="py-3.5 px-4 rounded-xl bg-[#111110] hover:bg-[#222220] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <ShoppingBag className="w-4 h-4 text-[#25D366]" />
                          <span>Adicionar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* CATÁLOGO COMPLETO COM FILTROS COMERCIAIS                  */}
        {/* ======================================================== */}
        <section id="fatos-de-treino" aria-label="Catálogo e Fatos de Treino" className="py-16 md:py-20 bg-[#f2f2f2] w-full">
          <div className="w-full px-4 sm:px-6 md:px-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold font-display text-[#111110] tracking-tight">
                  Catálogo Completo em Dirhams Marroquinos (MAD)
                </h2>
                <p className="text-xs md:text-sm text-[#555550] mt-1 max-w-xl">
                  Selecione uma categoria para filtrar ou alterne entre a vista frontal e traseira de cada produto.
                </p>
              </div>

              {/* Filtros de Categoria */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {Object.values(GarmentCategory).map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`text-xs font-bold px-4 py-2.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#111110] text-white shadow-xs'
                          : 'bg-white text-[#444440] hover:bg-[#111110] hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grelha de Produtos (Full width 5 colunas em telas grandes) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 w-full">
              {filteredCatalog.map((prod) => {
                const isSelected = selectedProduct.id === prod.id;
                const isImgFailed = catalogFailed[prod.id];
                const currentSide = cardViewSides[prod.id] ?? 'front';
                const displayedImg = currentSide === 'front' ? prod.frontImage : prod.backImage;

                return (
                  <div
                    key={prod.id}
                    className={`group relative bg-white rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 ${
                      isSelected
                        ? 'shadow-md ring-2 ring-[#111110]'
                        : 'shadow-xs hover:shadow-md'
                    }`}
                  >
                    {/* Imagem do Produto com Botão de Alternar Frente/Costas */}
                    <div>
                      <div className="relative w-full aspect-[4/5] bg-[#EFEFEF] rounded-xl flex items-center justify-center p-3 mb-3 overflow-hidden">
                        {!isImgFailed ? (
                          <img
                            src={displayedImg}
                            alt={`${prod.name} — ${currentSide === 'front' ? 'Frente' : 'Costas'}`}
                            loading="lazy"
                            onError={() =>
                              setCatalogFailed((prev) => ({ ...prev, [prod.id]: true }))
                            }
                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                            <p className="text-xs font-bold text-[#111110]">{prod.name}</p>
                            <p className="text-[11px] text-[#666660] mt-1">{prod.colorway}</p>
                          </div>
                        )}

                        {/* Botão de Alternar Frente/Costas */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCardSide(prod.id);
                          }}
                          className="absolute bottom-2 right-2 bg-white/95 hover:bg-white text-[#111110] text-[10px] font-bold px-2 py-1 rounded-md shadow-xs flex items-center gap-1 transition-all cursor-pointer"
                          title="Alternar entre Frente e Costas"
                        >
                          <RotateCcw className="w-3 h-3 text-[#111110]" />
                          <span>{currentSide === 'front' ? 'Costas' : 'Frente'}</span>
                        </button>
                      </div>

                      {/* Detalhes do Produto */}
                      <h3 className="font-display text-sm font-bold text-[#111110] leading-snug line-clamp-2">
                        {prod.name}
                      </h3>
                    </div>

                    <div className="mt-3">
                      {/* Tamanhos e Preço em MAD */}
                      <div className="pt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[11px] font-bold text-[#666660]">
                          <span>{prod.sizes.join(' · ')}</span>
                        </div>
                        <span className="text-sm font-mono tabular-nums font-black text-[#111110]">
                          {prod.priceMAD} MAD
                        </span>
                      </div>

                      {/* Botões de Ação */}
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleSelectFromCatalog(prod.id)}
                          className="py-2 px-2 text-xs font-bold rounded-lg bg-[#EFEFEF] hover:bg-[#111110] hover:text-white text-[#111110] transition-colors text-center cursor-pointer"
                        >
                          Ver Estúdio
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDirectWhatsApp(prod, 'G')}
                          className="py-2 px-2 text-xs font-bold rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white transition-colors flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Pedir</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
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
      {/* RODAPÉ ELEGANTE & MINIMALISTA (FULL WIDTH)               */}
      {/* ======================================================== */}
      <footer className="bg-[#111110] text-white py-12 w-full">
        <div className="w-full px-4 sm:px-6 md:px-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8">
            <div>
              <span className="font-display font-black text-xl text-white">DJURTUS.STUDIO</span>
              <p className="text-xs text-white/60 mt-1 max-w-md">
                Equipamentos oficiais e fatos de treino da Seleção Nacional da Guiné-Bissau para adeptos em Marrocos.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-bold uppercase tracking-wider text-white/70">
              <a href="#home" className="hover:text-white transition-colors">Início</a>
              <a href="#equipamentos" className="hover:text-white transition-colors">Equipamentos</a>
              <a href="#fatos-de-treino" className="hover:text-white transition-colors">Fatos de Treino</a>
              <a href="#contacto" className="hover:text-white transition-colors">Contactos</a>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
            <p>© {new Date().getFullYear()} DJURTUS.STUDIO. Todos os direitos reservados.</p>

            <button
              type="button"
              disabled={isExporting}
              onClick={handleExportHtml}
              className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors underline-offset-4 hover:underline cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'A descarregar...' : 'Descarregar index.html Independente'}</span>
            </button>
          </div>
        </div>
      </footer>

      {/* ======================================================== */}
      {/* GAVETA / MODAL DE ENCOMENDA NO WHATSAPP                 */}
      {/* ======================================================== */}
      <BagDrawer
        isOpen={isBagOpen}
        items={bagItems}
        onClose={() => setIsBagOpen(false)}
        onUpdateQty={handleUpdateBagQty}
        onRemoveItem={handleRemoveBagItem}
        onClearBag={() => setBagItems([])}
      />
    </div>
  );
}
