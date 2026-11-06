import React, { useEffect, useState } from 'react';
import {
  X,
  ShoppingBag,
  MessageCircle,
  Check,
  XCircle,
  Ruler,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { ProductItem, WHATSAPP_NUMBERS } from '../data/products';
import { AdminProductStock } from './AdminPanel';
import { GarmentBackView } from './GarmentBackView';

interface ProductPageModalProps {
  product: ProductItem | null;
  stockData: Record<string, AdminProductStock>;
  isOpen: boolean;
  onClose: () => void;
  onAddToBag: (product: ProductItem, size: string) => void;
}

export const ProductPageModal: React.FC<ProductPageModalProps> = ({
  product,
  stockData,
  isOpen,
  onClose,
  onAddToBag,
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

  useEffect(() => {
    if (product) {
      setViewSide('front');
      setCustomName('');
      setCustomNumber('');
      setImgFailed(false);
    }
  }, [product]);

  if (!isOpen || !product) return null;

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
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  const handleDirectWhatsAppOrder = () => {
    if (!isSizeAvailable) return;
    const customText =
      customName || customNumber
        ? `\n• Personalização: ${customName || 'Sem Nome'} #${customNumber || 'S/N'}`
        : '';
    const message = encodeURIComponent(
      `*NOVA ENCOMENDA DE PEÇA — DJURTUS.STUDIO MARROCOS*\n\n` +
        `Olá! Gostaria de encomendar:\n` +
        `• *Artigo:* ${product.name}\n` +
        `• *Tamanho:* ${selectedSize}${customText}\n` +
        `• *Preço:* ${product.priceMAD} MAD\n` +
        `• *Cor:* ${product.colorway}\n` +
        `• *Entrega:* Marrocos\n\n` +
        `Por favor, confirmem a disponibilidade para entrega. Obrigado!`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBERS[0].clean}?text=${message}`, '_blank');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Página do Produto ${product.name}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden relative my-auto max-h-[92vh] flex flex-col lg:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão de Fechar Modal da Página */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar página do produto"
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#111110] flex items-center justify-center shadow-md transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LADO ESQUERDO: Galeria de Imagens de Alta Definição */}
        <div className="w-full lg:w-1/2 bg-[#EFEFEF] p-6 sm:p-10 flex flex-col justify-between items-center relative min-h-[380px] lg:min-h-full">
          {!hasAnyStock && (
            <span className="absolute top-6 left-6 z-20 bg-[#A0A09C] text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
              Produto Esgotado
            </span>
          )}

          {/* Imagem Principal com Prévia de Personalização */}
          <div className="relative w-full aspect-[3/4] flex items-center justify-center my-auto overflow-hidden">
            {viewSide === 'front' ? (
              !imgFailed ? (
                <img
                  src={product.frontImage}
                  alt={`${product.name} — Vista Frontal`}
                  referrerPolicy="no-referrer"
                  onError={() => setImgFailed(true)}
                  className={`w-full h-full object-contain mix-blend-multiply transition-opacity duration-200 select-none ${
                    !hasAnyStock ? 'opacity-50' : 'opacity-100'
                  }`}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-sm font-bold text-[#111110]">{product.name}</p>
                  <p className="text-xs text-[#666660] mt-1">{product.colorway}</p>
                </div>
              )
            ) : product.backImage ? (
              <img
                src={product.backImage}
                alt={`${product.name} — Vista de Costas`}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-contain mix-blend-multiply transition-opacity duration-200 select-none ${
                  !hasAnyStock ? 'opacity-50' : 'opacity-100'
                }`}
              />
            ) : (
              <GarmentBackView product={product} />
            )}

            {/* Overlay em tempo real para Nome e Número nas costas */}
            {viewSide === 'back' && (customName || customNumber) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-4">
                {customName && (
                  <span className="font-display font-black text-xs sm:text-sm tracking-widest text-[#111110] uppercase bg-white/80 px-2.5 py-0.5 rounded shadow-2xs">
                    {customName}
                  </span>
                )}
                {customNumber && (
                  <span className="font-mono font-black text-3xl sm:text-5xl text-[#111110] leading-none mt-1">
                    {customNumber}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Alternador Frente / Costas */}
          <div className="flex items-center gap-2 bg-white/90 p-1.5 rounded-xl shadow-xs shrink-0">
            <button
              type="button"
              onClick={() => setViewSide('front')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewSide === 'front'
                  ? 'bg-[#111110] text-white'
                  : 'text-[#555550] hover:text-[#111110]'
              }`}
            >
              <span>Vista Frontal</span>
            </button>
            <button
              type="button"
              onClick={() => setViewSide('back')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewSide === 'back'
                  ? 'bg-[#111110] text-white'
                  : 'text-[#555550] hover:text-[#111110]'
              }`}
            >
              <span>Vista Traseira</span>
            </button>
          </div>
        </div>

        {/* LADO DIREITO: Detalhes, Personalização e Botões de Compra */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#666660]">
                {product.category} · {product.colorway}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111110] font-display tracking-tight mt-1">
                {product.name}
              </h1>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-2xl font-mono font-black text-[#111110] tabular-nums">
                  {product.priceMAD} MAD
                </span>
                <span className="text-xs font-bold text-[#188B46] bg-[#25D366]/10 px-2.5 py-0.5 rounded-full">
                  Entrega em Marrocos
                </span>
              </div>
            </div>

            <p className="text-xs text-[#444440] leading-relaxed">
              {product.heritageStory}
            </p>

            {/* Módulo de Seleção de Tamanho */}
            <div className="space-y-2 pt-2 border-t border-black/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#111110]">Selecione o Tamanho:</span>
                <button
                  type="button"
                  onClick={() => setIsFitFinderOpen(true)}
                  className="text-[11px] font-bold text-[#188B46] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Provador Virtual &amp; Medidas</span>
                </button>
              </div>

              <div className="flex gap-2 flex-wrap" role="radiogroup" aria-label="Tamanhos disponíveis">
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
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
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

              <div className="text-[11px] text-[#666660] pt-1">
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

            {/* Módulo de Personalização Oficial */}
            <div className="space-y-2 pt-2 border-t border-black/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#111110]">
                  Personalização Oficial (Opcional):
                </span>
                <span className="text-[10px] font-bold text-[#188B46] bg-[#25D366]/10 px-2 py-0.5 rounded">
                  Oferta Grátis
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  maxLength={14}
                  value={customName}
                  onChange={(e) => {
                    setCustomName(e.target.value);
                    setViewSide('back');
                  }}
                  placeholder="Nome nas Costas"
                  className="px-3 py-2 text-xs bg-[#f8f8f8] rounded-xl text-[#111110] uppercase font-bold focus:outline-none focus:ring-1 focus:ring-[#111110]"
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
                  className="px-3 py-2 text-xs bg-[#f8f8f8] rounded-xl text-[#111110] font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#111110]"
                />
              </div>
            </div>

            {/* Especificações de Tecido Rápidas */}
            <div className="bg-[#f8f8f8] p-3.5 rounded-2xl space-y-1.5 text-[11px] text-[#555550]">
              <div className="flex items-center gap-2 font-semibold text-[#111110]">
                <Sparkles className="w-3.5 h-3.5 text-[#25D366]" />
                <span>{product.fabricSpec}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#111110]" />
                <span>Entrega rápida em 24h/48h para todas as cidades de Marrocos</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Garantia de produto 100% Oficial Guisport</span>
              </div>
            </div>
          </div>

          {/* Botões de Ação Principais: Adicionar à Sacola & WhatsApp */}
          <div className="pt-6 space-y-2 border-t border-black/5 mt-4">
            {hasAnyStock && isSizeAvailable ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleAdd}
                  className={`flex-1 py-3.5 px-6 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                    justAdded
                      ? 'bg-[#111110] text-white'
                      : 'bg-[#111110] hover:bg-[#222220] text-white'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4 text-[#25D366]" />
                      <span>Adicionado à Sacola!</span>
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
                  onClick={handleDirectWhatsAppOrder}
                  className="py-3.5 px-6 rounded-2xl text-xs font-bold bg-[#25D366] text-white hover:bg-[#20ba59] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Pedir no WhatsApp</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                disabled
                className="w-full py-3.5 px-6 rounded-2xl text-xs font-bold bg-[#A0A09C] text-white flex items-center justify-center gap-2 cursor-not-allowed shadow-xs"
              >
                <XCircle className="w-4 h-4" />
                <span>Indisponível no Tamanho {selectedSize}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal do Provador Virtual */}
      {isFitFinderOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="page-fit-finder-title"
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setIsFitFinderOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-black/10">
              <div>
                <h3 id="page-fit-finder-title" className="text-base font-bold text-[#111110]">
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
                <X className="w-4 h-4" />
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
