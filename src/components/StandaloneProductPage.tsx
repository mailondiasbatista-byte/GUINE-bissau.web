import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShoppingBag,
  MessageCircle,
  Check,
  XCircle,
  Ruler,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  ChevronRight,
  Info,
  Layers,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { ProductItem, PRODUCTS, WHATSAPP_NUMBERS } from '../data/products';
import { AdminProductStock } from './AdminPanel';
import { GarmentBackView } from './GarmentBackView';

interface StandaloneProductPageProps {
  product: ProductItem;
  stockData: Record<string, AdminProductStock>;
  onBackToHome: () => void;
  onSelectProduct: (product: ProductItem) => void;
  onAddToBag: (product: ProductItem, size: string) => void;
  onOpenBag: () => void;
}

export const StandaloneProductPage: React.FC<StandaloneProductPageProps> = ({
  product,
  stockData,
  onBackToHome,
  onSelectProduct,
  onAddToBag,
  onOpenBag,
}) => {
  const [viewSide, setViewSide] = useState<'front' | 'back'>('front');
  const [selectedSize, setSelectedSize] = useState<string>('G');
  const [justAdded, setJustAdded] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customNumber, setCustomNumber] = useState('');
  const [isFitFinderOpen, setIsFitFinderOpen] = useState(false);
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(72);
  const [imgFailed, setImgFailed] = useState(false);
  const [activeTab, setActiveTab] = useState<'descricao' | 'especificacoes' | 'lavagem'>('descricao');
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedRelatedId, setAddedRelatedId] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setViewSide('front');
    setCustomName('');
    setCustomNumber('');
    setImgFailed(false);
  }, [product.id]);

  const prodStock = stockData[product.id] ?? {
    id: product.id,
    name: product.name,
    subtitle: product.subtitle,
    priceMAD: product.priceMAD,
    category: product.category,
    frontImage: product.frontImage,
    backImage: product.backImage,
    isActive: true,
    stockPerSize: { P: 5, M: 5, G: 5, GG: 5 },
  };

  const hasAnyStock =
    prodStock.isActive &&
    Object.values(prodStock.stockPerSize).some((q) => q > 0);

  const selectedSizeStock = prodStock.stockPerSize[selectedSize] ?? 0;
  const isSizeAvailable = prodStock.isActive && selectedSizeStock > 0;

  const calcRecommendedSize = () => {
    if (heightCm < 170 || weightKg < 65) return 'P';
    if (heightCm < 178 && weightKg < 76) return 'M';
    if (heightCm < 186 && weightKg < 88) return 'G';
    return 'GG';
  };
  const recommendedSize = calcRecommendedSize();

  const handleAdd = () => {
    if (!isSizeAvailable) return;
    onAddToBag(product, selectedSize);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1500);
  };

  const handleWhatsAppOrder = () => {
    if (!isSizeAvailable) return;
    const customText =
      customName || customNumber
        ? `\n• Personalização: ${customName || 'Sem Nome'} #${customNumber || 'S/N'}`
        : '';
    const message = encodeURIComponent(
      `*ENCOMENDA DE PEÇA — DJURTUS.STUDIO MARROCOS*\n\n` +
        `Olá! Gostaria de encomendar na página oficial do produto:\n` +
        `• *Artigo:* ${product.name}\n` +
        `• *Tamanho:* ${selectedSize}${customText}\n` +
        `• *Preço Oficial:* ${product.priceMAD} MAD\n` +
        `• *Cor:* ${product.colorway}\n` +
        `• *Entrega:* Marrocos\n\n` +
        `Por favor confirmem a disponibilidade para entrega. Obrigado!`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBERS[0].clean}?text=${message}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#f8f8f8] text-[#111110] w-full flex flex-col font-sans animate-fadeIn">
      {/* ======================================================== */}
      {/* BARRA SUPERIOR DE NAVEGAÇÃO DA PÁGINA DO PRODUTO         */}
      {/* ======================================================== */}
      <div className="sticky top-16 z-30 bg-[#f8f8f8]/95 backdrop-blur-md border-b border-black/5 py-3 w-full">
        <div className="w-full px-4 sm:px-6 md:px-10 flex items-center justify-between gap-4 text-xs font-semibold">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-[#111110] hover:text-[#188B46] transition-colors cursor-pointer font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar à Loja Principal</span>
          </button>

          {/* Breadcrumbs de Navegação */}
          <div className="hidden sm:flex items-center gap-2 text-[#666660]">
            <span
              onClick={onBackToHome}
              className="hover:underline cursor-pointer"
            >
              Início
            </span>
            <ChevronRight className="w-3 h-3" />
            <span>{product.category}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#111110] font-bold line-clamp-1 max-w-[200px]">
              {product.name}
            </span>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-[#111110] hover:bg-black/5 transition-colors cursor-pointer border border-black/5"
          >
            <Share2 className="w-3.5 h-3.5 text-[#188B46]" />
            <span>{copiedLink ? 'Link Copiado!' : 'Partilhar'}</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ÁREA PRINCIPAL DA PÁGINA DEDICADA DO PRODUTO             */}
      {/* ======================================================== */}
      <main className="flex-1 w-full py-8 md:py-12">
        <div className="w-full px-4 sm:px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* LADO ESQUERDO (7 COLUNAS): GALERIA HD E ALTERNADOR FRENTE/COSTAS */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-black/5 shadow-2xs relative flex flex-col items-center justify-center min-h-[460px] md:min-h-[540px]">
                {!hasAnyStock && (
                  <span className="absolute top-6 left-6 z-20 bg-[#A0A09C] text-white text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-xs">
                    Artigo Esgotado
                  </span>
                )}

                {/* Badge Oficial */}
                <span className="absolute top-6 right-6 z-20 bg-[#188B46]/10 text-[#188B46] text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  Original Guisport 2026
                </span>

                {/* Contentor da Imagem Principal HD */}
                <div className="relative w-full aspect-[3/4] max-w-md flex items-center justify-center my-auto overflow-hidden">
                  {viewSide === 'front' ? (
                    !imgFailed ? (
                      <img
                        src={product.frontImage}
                        alt={`${product.name} — Vista Frontal`}
                        referrerPolicy="no-referrer"
                        onError={() => setImgFailed(true)}
                        className={`w-full h-full object-contain mix-blend-multiply transition-opacity duration-300 select-none ${
                          !hasAnyStock ? 'opacity-50' : 'opacity-100'
                        }`}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                        <p className="text-base font-bold text-[#111110]">{product.name}</p>
                        <p className="text-xs text-[#666660] mt-1">{product.colorway}</p>
                      </div>
                    )
                  ) : product.backImage ? (
                    <img
                      src={product.backImage}
                      alt={`${product.name} — Vista de Costas`}
                      referrerPolicy="no-referrer"
                      className={`w-full h-full object-contain mix-blend-multiply transition-opacity duration-300 select-none ${
                        !hasAnyStock ? 'opacity-50' : 'opacity-100'
                      }`}
                    />
                  ) : (
                    <GarmentBackView product={product} />
                  )}

                  {/* Prévia em tempo real de Nome e Número nas costas */}
                  {viewSide === 'back' && (customName || customNumber) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-4">
                      {customName && (
                        <span className="font-display font-black text-sm sm:text-base tracking-widest text-[#111110] uppercase bg-white/90 px-3 py-1 rounded shadow-xs">
                          {customName}
                        </span>
                      )}
                      {customNumber && (
                        <span className="font-mono font-black text-4xl sm:text-6xl text-[#111110] leading-none mt-1 drop-shadow-xs">
                          {customNumber}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Seletores de Miniatura e Angulo (Frente / Costas) */}
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-black/5">
                  <button
                    type="button"
                    onClick={() => setViewSide('front')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      viewSide === 'front'
                        ? 'bg-[#111110] text-white shadow-xs'
                        : 'bg-[#f8f8f8] text-[#555550] hover:bg-black/5'
                    }`}
                  >
                    <span>Vista Frontal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewSide('back')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      viewSide === 'back'
                        ? 'bg-[#111110] text-white shadow-xs'
                        : 'bg-[#f8f8f8] text-[#555550] hover:bg-black/5'
                    }`}
                  >
                    <span>Vista Traseira</span>
                  </button>
                </div>
              </div>
            </div>

            {/* LADO DIREITO (5 COLUNAS): PREÇO, SELEÇÃO DE TAMANHO, PERSONALIZAÇÃO E COMPRA */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-2xs space-y-6">
                {/* Título & Preço */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#666660]">
                    {product.category} · {product.colorway}
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111110] font-display tracking-tight mt-1.5 leading-tight">
                    {product.name}
                  </h1>
                  <p className="text-xs text-[#666660] mt-1 font-medium">
                    {product.subtitle}
                  </p>

                  <div className="mt-4 flex items-baseline gap-4 pt-3 border-t border-black/5">
                    <span className="text-3xl font-mono font-black text-[#111110] tabular-nums">
                      {product.priceMAD} <span className="text-base font-bold text-[#666660]">MAD</span>
                    </span>
                    <span className="text-xs font-bold text-[#188B46] bg-[#25D366]/10 px-3 py-1 rounded-full">
                      Entrega Direta em Marrocos
                    </span>
                  </div>
                </div>

                {/* Seleção de Tamanho */}
                <div className="space-y-3 pt-4 border-t border-black/5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#111110] uppercase tracking-wider">
                      Selecione o Tamanho:
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsFitFinderOpen(true)}
                      className="text-xs font-bold text-[#188B46] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>Provador Virtual (Guias &amp; Medidas)</span>
                    </button>
                  </div>

                  <div className="flex gap-2.5 flex-wrap" role="radiogroup" aria-label="Tamanhos disponíveis">
                    {product.sizes.map((sz) => {
                      const szQty = prodStock.stockPerSize[sz] ?? 0;
                      const active = selectedSize === sz;
                      const isAvailableSz = prodStock.isActive && szQty > 0;

                      return (
                        <button
                          key={sz}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          disabled={!isAvailableSz}
                          onClick={() => setSelectedSize(sz)}
                          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                            !isAvailableSz
                              ? 'bg-gray-200 text-gray-400 line-through cursor-not-allowed opacity-50'
                              : active
                              ? 'bg-[#111110] text-white shadow-xs scale-105'
                              : 'bg-[#EFEFEF] text-[#111110] hover:bg-black/10 cursor-pointer'
                          }`}
                        >
                          {sz} {!isAvailableSz ? '(Esgotado)' : ''}
                        </button>
                      );
                    })}
                  </div>

                  <div className="text-xs text-[#666660] pt-1">
                    {hasAnyStock ? (
                      <span>
                        Estoque no tamanho <strong className="text-[#111110]">{selectedSize}</strong>:{' '}
                        <span className="font-mono font-bold text-[#111110]">
                          {selectedSizeStock > 0 ? `${selectedSizeStock} unidades disponíveis` : 'Esgotado'}
                        </span>
                      </span>
                    ) : (
                      <span className="text-red-600 font-bold">Produto esgotado em todos os tamanhos</span>
                    )}
                  </div>
                </div>

                {/* Personalização Oficial em Tempo Real */}
                <div className="space-y-3 pt-4 border-t border-black/5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#111110] uppercase tracking-wider">
                      Personalização Oficial nas Costas:
                    </span>
                    <span className="text-[10px] font-bold text-[#188B46] bg-[#25D366]/10 px-2.5 py-0.5 rounded">
                      Oferta Grátis
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      maxLength={14}
                      value={customName}
                      onChange={(e) => {
                        setCustomName(e.target.value);
                        setViewSide('back');
                      }}
                      placeholder="Nome (ex: BALDÉ)"
                      className="px-3.5 py-2.5 text-xs bg-[#f8f8f8] rounded-xl text-[#111110] uppercase font-bold focus:outline-none focus:ring-1 focus:ring-[#111110]"
                    />
                    <input
                      type="text"
                      maxLength={3}
                      value={customNumber}
                      onChange={(e) => {
                        setCustomNumber(e.target.value.replace(/\D/g, ''));
                        setViewSide('back');
                      }}
                      placeholder="Número (ex: 10)"
                      className="px-3.5 py-2.5 text-xs bg-[#f8f8f8] rounded-xl text-[#111110] font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#111110]"
                    />
                  </div>
                </div>

                {/* Botões de Ação da Página */}
                <div className="pt-4 space-y-3 border-t border-black/5">
                  {hasAnyStock && isSizeAvailable ? (
                    <div className="flex flex-col gap-3">
                      <button
                        type="button"
                        onClick={handleAdd}
                        className={`w-full py-4 px-6 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                          justAdded
                            ? 'bg-[#111110] text-white'
                            : 'bg-[#111110] hover:bg-[#222220] text-white'
                        }`}
                      >
                        {justAdded ? (
                          <>
                            <Check className="w-4 h-4 text-[#25D366]" />
                            <span>Adicionado à Sacola de Encomendas!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4 text-[#25D366]" />
                            <span>Adicionar à Sacola ({product.priceMAD} MAD)</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleWhatsAppOrder}
                        className="w-full py-4 px-6 rounded-2xl text-xs font-bold bg-[#25D366] text-white hover:bg-[#20ba59] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Encomendar Diretamente pelo WhatsApp</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full py-4 px-6 rounded-2xl text-xs font-bold bg-[#A0A09C] text-white flex items-center justify-center gap-2 cursor-not-allowed shadow-xs"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Indisponível no Tamanho {selectedSize}</span>
                    </button>
                  )}
                </div>

                {/* Vantagens & Garantias */}
                <div className="bg-[#f8f8f8] p-4 rounded-2xl space-y-2 text-xs text-[#555550]">
                  <div className="flex items-center gap-2 font-semibold text-[#111110]">
                    <Truck className="w-4 h-4 text-[#188B46]" />
                    <span>Entrega rápida em 24h a 48h para todas as cidades de Marrocos</span>
                  </div>
                  <div className="flex items-center gap-2 font-semibold text-[#111110]">
                    <ShieldCheck className="w-4 h-4 text-[#188B46]" />
                    <span>Pagamento seguro no momento da entrega sem cartão de crédito</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTOR DE ABAS E INFORMAÇÕES TÉCNICAS COMPLETAS           */}
          {/* ======================================================== */}
          <div className="mt-12 bg-white rounded-3xl p-6 sm:p-10 border border-black/5 shadow-2xs">
            {/* Navegador de Abas */}
            <div className="flex items-center gap-4 border-b border-black/10 pb-4 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveTab('descricao')}
                className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'descricao'
                    ? 'bg-[#111110] text-white shadow-xs'
                    : 'text-[#666660] hover:text-[#111110]'
                }`}
              >
                História &amp; Descrição
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('especificacoes')}
                className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'especificacoes'
                    ? 'bg-[#111110] text-white shadow-xs'
                    : 'text-[#666660] hover:text-[#111110]'
                }`}
              >
                Ficha Técnica &amp; Tecido
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('lavagem')}
                className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'lavagem'
                    ? 'bg-[#111110] text-white shadow-xs'
                    : 'text-[#666660] hover:text-[#111110]'
                }`}
              >
                Cuidados de Lavagem
              </button>
            </div>

            {/* Conteúdo das Abas */}
            <div className="pt-6">
              {activeTab === 'descricao' && (
                <div className="space-y-4 text-xs sm:text-sm text-[#444440] leading-relaxed max-w-4xl">
                  <p>{product.heritageStory}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="bg-[#f8f8f8] p-4 rounded-2xl">
                      <span className="font-bold text-[#111110] block mb-1">Corte &amp; Ajuste:</span>
                      <p className="text-xs text-[#666660]">{product.fitLabel}</p>
                    </div>
                    <div className="bg-[#f8f8f8] p-4 rounded-2xl">
                      <span className="font-bold text-[#111110] block mb-1">Nota de Origem:</span>
                      <p className="text-xs text-[#666660]">{product.originNote}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'especificacoes' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#444440]">
                  <div className="bg-[#f8f8f8] p-5 rounded-2xl space-y-2">
                    <span className="font-bold text-[#111110] text-xs uppercase tracking-wider block">
                      Especificação do Tecido
                    </span>
                    <p>• {product.fabricSpec}</p>
                    <p>• Gramagem: 180 g/m² em Micro-Mesh Respirável</p>
                    <p>• Tecnologia de Evaporação Dri-Dry</p>
                  </div>
                  <div className="bg-[#f8f8f8] p-5 rounded-2xl space-y-2">
                    <span className="font-bold text-[#111110] text-xs uppercase tracking-wider block">
                      Autenticidade Oficial
                    </span>
                    <p>• Emblema Oficial FFGB Bordado</p>
                    <p>• Logótipo Oficial Guisport</p>
                    <p>• Etiqueta de Autenticidade Guisport 2026</p>
                  </div>
                </div>
              )}

              {activeTab === 'lavagem' && (
                <div className="space-y-3 text-xs text-[#444440]">
                  <p className="font-bold text-[#111110]">Recomendações de Manutenção Guisport:</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <li className="flex items-center gap-2 bg-[#f8f8f8] p-3 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-[#188B46]" />
                      <span>Lavar à máquina a no máximo 30ºC</span>
                    </li>
                    <li className="flex items-center gap-2 bg-[#f8f8f8] p-3 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-[#188B46]" />
                      <span>Passar a ferro sempre do avesso (evitando o vinil)</span>
                    </li>
                    <li className="flex items-center gap-2 bg-[#f8f8f8] p-3 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-[#188B46]" />
                      <span>Não usar lixívia nem produtos abrasivos</span>
                    </li>
                    <li className="flex items-center gap-2 bg-[#f8f8f8] p-3 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-[#188B46]" />
                      <span>Secar à sombra sem centrifugação forte</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECÇÃO DE PRODUTOS RELACIONADOS DOS DJURTUS             */}
          {/* ======================================================== */}
          <div className="mt-12 space-y-6">
            <h3 className="text-xl font-extrabold font-display text-[#111110]">
              Outras Peças Oficiais da Seleção da Guiné-Bissau
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProd) => (
                <div
                  key={relProd.id}
                  onClick={() => onSelectProduct(relProd)}
                  className="bg-white rounded-3xl p-4 border border-black/5 hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-full aspect-[4/5] bg-[#EFEFEF] rounded-2xl p-3 flex items-center justify-center overflow-hidden mb-3">
                      <img
                        src={relProd.frontImage}
                        alt={relProd.name}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="font-display font-bold text-sm text-[#111110] line-clamp-1 group-hover:text-[#188B46] transition-colors">
                      {relProd.name}
                    </h4>
                    <p className="text-xs text-[#666660] font-mono mt-1 font-bold">
                      {relProd.priceMAD} MAD
                    </p>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToBag(relProd, 'G');
                        setAddedRelatedId(relProd.id);
                        setTimeout(() => setAddedRelatedId(null), 1400);
                      }}
                      className="py-2 px-1 rounded-xl bg-[#111110] text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1 hover:bg-[#222220] cursor-pointer shadow-2xs"
                    >
                      {addedRelatedId === relProd.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#25D366]" />
                          <span>Adicionado!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5 text-[#25D366]" />
                          <span>Adicionar</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectProduct(relProd)}
                      className="py-2 px-1 rounded-xl bg-[#f8f8f8] hover:bg-black/10 text-[#111110] text-xs font-bold transition-all text-center cursor-pointer"
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Modal do Provador Virtual */}
      {isFitFinderOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="fit-finder-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          onClick={() => setIsFitFinderOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-black/10">
              <div>
                <h3 id="fit-finder-title" className="text-base font-bold text-[#111110]">
                  Provador Virtual Djurtus
                </h3>
                <p className="text-xs text-[#666660] mt-0.5">
                  Cálculo de tamanho com base nas suas medidas
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFitFinderOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#666660] hover:text-[#111110] hover:bg-black/5 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 pt-1">
              <div>
                <div className="flex justify-between text-xs font-bold text-[#111110] mb-1">
                  <span>Altura:</span>
                  <span className="font-mono">{heightCm} cm</span>
                </div>
                <input
                  type="range"
                  min={150}
                  max={210}
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full accent-[#111110] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-[#111110] mb-1">
                  <span>Peso:</span>
                  <span className="font-mono">{weightKg} kg</span>
                </div>
                <input
                  type="range"
                  min={45}
                  max={120}
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full accent-[#111110] cursor-pointer"
                />
              </div>

              <div className="bg-[#f8f8f8] rounded-2xl p-4 text-center border border-black/5 space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#666660]">
                  Recomendação
                </span>
                <div className="text-3xl font-black font-display text-[#111110]">
                  Tamanho {recommendedSize}
                </div>
                <p className="text-xs text-[#555550]">
                  Ajuste perfeito para {heightCm} cm e {weightKg} kg.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedSize(recommendedSize);
                  setIsFitFinderOpen(false);
                }}
                className="w-full py-3 rounded-xl bg-[#111110] text-white text-xs font-bold hover:bg-[#222220] cursor-pointer transition-colors"
              >
                Aplicar Tamanho {recommendedSize}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
