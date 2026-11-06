import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, MessageCircle, XCircle, ShoppingBag, Check } from 'lucide-react';
import { ProductItem, WHATSAPP_NUMBERS } from '../data/products';

interface RackShowcaseProps {
  products: ProductItem[];
  selectedIndex: number;
  stockData: Record<string, { isActive: boolean; stockPerSize: Record<string, number> }>;
  onSelectIndex: (index: number) => void;
  onInspectProduct: () => void;
  onQuickWhatsApp: (product: ProductItem) => void;
  onAddToBag: (product: ProductItem, size: string) => void;
}

export const RackShowcase: React.FC<RackShowcaseProps> = ({
  products,
  selectedIndex,
  stockData,
  onSelectIndex,
  onInspectProduct,
  onQuickWhatsApp,
  onAddToBag,
}) => {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [justAddedRack, setJustAddedRack] = useState(false);
  const [addedItemKey, setAddedItemKey] = useState<string | null>(null);
  const activeProduct = products[selectedIndex] ?? products[0];

  const prodStock = stockData[activeProduct.id] ?? {
    isActive: true,
    stockPerSize: { P: 5, M: 5, G: 5, GG: 5 },
  };

  const [activeClickedKey, setActiveClickedKey] = useState<string | null>(null);

  const totalStock = Object.values(prodStock.stockPerSize).reduce((a, b) => a + b, 0);
  const isAvailable = prodStock.isActive && totalStock > 0;

  // O destaque temporário expira após 3 segundos e o item retorna ao tamanho uniforme original
  useEffect(() => {
    if (!activeClickedKey) return;
    const timer = window.setTimeout(() => {
      setActiveClickedKey(null);
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [activeClickedKey]);

  const handlePrev = () => {
    onSelectIndex(selectedIndex === 0 ? products.length - 1 : selectedIndex - 1);
  };

  const handleNext = () => {
    onSelectIndex(selectedIndex === products.length - 1 ? 0 : selectedIndex + 1);
  };

  return (
    <section aria-label="Vitrine de Camisolas" className="py-10 md:py-16 w-full">
      {/* Subtítulo discreto */}
      <div className="w-full px-4 sm:px-6 md:px-10 text-center mb-8">
        <p className="text-xs uppercase tracking-[0.2em] font-bold text-[#666660]">
          Seleção Nacional da Guiné-Bissau em Marrocos
        </p>
      </div>

      {/* Arara Metálica de Estúdio Contínua com Marquee Scroll */}
      <div className="relative w-full overflow-hidden">
        {/* Máscara de degradê nas pontas para suavizar entrada e saída */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-20 z-20 bg-gradient-to-r from-[#f8f8f8] to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-20 z-20 bg-gradient-to-l from-[#f8f8f8] to-transparent"
        />

        {/* Barra de aço escovado minimalista */}
        <div
          aria-hidden="true"
          className="absolute left-0 right-0 top-[20px] md:top-[26px] h-[4px] z-10 bg-[#D4D4D0]"
        />

        {/* Peças penduradas na arara com Marquee Scroll */}
        <div className="w-full overflow-hidden">
          <div
            role="listbox"
            aria-label="Peças da Coleção Djurtus em Marquee Scroll"
            className="flex items-start gap-4 sm:gap-6 pt-[16px] md:pt-[20px] pb-6 animate-marquee cursor-pointer select-none"
          >
            {[...products, ...products, ...products, ...products].map((item, idx) => {
              const realIndex = idx % products.length;
              const itemKey = `${item.id}-marquee-${idx}`;
              const isClickedHighlighted = itemKey === activeClickedKey;
              const hasFailed = Boolean(failedImages[itemKey] || failedImages[item.id]);

              const itemStockInfo = stockData[item.id] ?? {
                isActive: true,
                stockPerSize: { P: 5, M: 5, G: 5, GG: 5 },
              };
              const itemTotalStock = Object.values(itemStockInfo.stockPerSize).reduce((a, b) => a + b, 0);
              const itemIsAvailable = itemStockInfo.isActive && itemTotalStock > 0;

              return (
                <button
                  key={itemKey}
                  type="button"
                  role="option"
                  aria-selected={realIndex === selectedIndex}
                  onClick={() => {
                    onSelectIndex(realIndex);
                    setActiveClickedKey(itemKey);
                  }}
                  className={`group relative shrink-0 focus:outline-none transition-all duration-300 w-[140px] sm:w-[165px] md:w-[185px] ${
                    isClickedHighlighted
                      ? 'z-20 opacity-100 scale-105'
                      : 'z-10 opacity-85 hover:opacity-100'
                  }`}
                >
                  {/* Gancho metálico minimalista */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-[0px] w-[5px] h-[14px] rounded-full bg-[#888880] z-30"
                  />

                  {/* Tag de Esgotado se sem estoque */}
                  {!itemIsAvailable && (
                    <span className="absolute top-3 right-3 z-30 bg-[#A0A09C] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                      Esgotado
                    </span>
                  )}

                  {/* Moldura de estúdio limpa com fundo uniforme */}
                  <div
                    className={`relative p-3 rounded-xl transition-all duration-300 ${
                      !itemIsAvailable ? 'bg-[#E5E5E3] opacity-60' : 'bg-[#EFEFEF]'
                    } ${
                      isClickedHighlighted
                        ? 'shadow-md scale-100 ring-2 ring-[#111110]'
                        : 'scale-95 group-hover:scale-98'
                    }`}
                  >
                    {/* Imagem do produto em estúdio */}
                    <div className="aspect-[3/4] w-full flex items-center justify-center overflow-hidden rounded-lg">
                      {!hasFailed ? (
                        <img
                          src={item.frontImage}
                          alt={`${item.name} — ${item.colorway}`}
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setFailedImages((prev) => ({ ...prev, [itemKey]: true }))
                          }
                          className="w-full h-full object-contain mix-blend-multiply select-none pointer-events-none transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#EFEFEF] flex flex-col items-center justify-center p-4 text-center">
                          <span className="text-xs font-semibold text-[#111110]">{item.name}</span>
                          <span className="text-[11px] text-[#666660] mt-1">{item.colorway}</span>
                        </div>
                      )}
                    </div>

                    {/* Botão rápido Adicionar à Sacola em cada produto da arara */}
                    {itemIsAvailable && (
                      <div className="mt-2 pt-1 border-t border-black/5 flex items-center justify-center">
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToBag(item, 'G');
                            setAddedItemKey(itemKey);
                            setTimeout(() => setAddedItemKey(null), 1400);
                          }}
                          className={`w-full py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
                            addedItemKey === itemKey
                              ? 'bg-[#111110] text-white'
                              : 'bg-white hover:bg-[#111110] hover:text-white text-[#111110]'
                          }`}
                        >
                          {addedItemKey === itemKey ? (
                            <>
                              <Check className="w-3 h-3 text-[#25D366]" />
                              <span>Adicionado!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3 h-3 text-[#25D366]" />
                              <span>Adicionar à Sacola</span>
                            </>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Título da peça selecionada e botões de ação abaixo da arara */}
      <div className="max-w-xl mx-auto px-6 mt-6 flex flex-col items-center text-center">
        <div className="flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Peça anterior"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#555550] hover:text-[#111110] hover:bg-black/5 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-base md:text-lg font-bold tracking-tight text-[#111110]">
              {activeProduct.name}
            </h1>
            <p className="text-xs text-[#555550] mt-1 flex items-center justify-center gap-2">
              <span>{activeProduct.colorway}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums font-bold text-sm text-[#111110]">
                {activeProduct.priceMAD} MAD
              </span>
              {!isAvailable && (
                <span className="text-[11px] font-bold text-[#A0A09C] uppercase tracking-wider">
                  (Esgotado)
                </span>
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Próxima peça"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#555550] hover:text-[#111110] hover:bg-black/5 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Botões de Ação: Adicionar à Sacola, Ver Detalhes e Encomendar por WhatsApp */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {isAvailable && (
            <button
              type="button"
              onClick={() => {
                onAddToBag(activeProduct, 'G');
                setJustAddedRack(true);
                setTimeout(() => setJustAddedRack(false), 1500);
              }}
              className="px-6 py-2.5 rounded-full bg-[#111110] hover:bg-[#222220] text-white text-xs font-bold inline-flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer shadow-xs"
            >
              {justAddedRack ? (
                <>
                  <Check className="w-4 h-4 text-[#25D366]" />
                  <span>Adicionado à Sacola!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-[#25D366]" />
                  <span>Adicionar à Sacola ({activeProduct.priceMAD} MAD)</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={onInspectProduct}
            className="px-6 py-2.5 rounded-full bg-white border border-black/10 hover:border-black/30 text-[#111110] text-xs font-bold transition-all whitespace-nowrap cursor-pointer shadow-2xs"
          >
            Ver Detalhes &amp; Tamanhos
          </button>

          {isAvailable ? (
            <button
              type="button"
              onClick={() => onQuickWhatsApp(activeProduct)}
              className="px-6 py-2.5 rounded-full bg-[#25D366] text-white hover:bg-[#20ba59] text-xs font-bold inline-flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Pedir no WhatsApp</span>
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="px-6 py-2.5 rounded-full bg-[#A0A09C] text-white text-xs font-bold inline-flex items-center gap-2 cursor-not-allowed whitespace-nowrap shadow-xs opacity-90"
            >
              <XCircle className="w-4 h-4" />
              <span>Esgotado</span>
            </button>
          )}
        </div>

        <p className="mt-3 text-[11px] text-[#666660] font-medium">
          Marrocos: {WHATSAPP_NUMBERS[0].number} / {WHATSAPP_NUMBERS[1].number}
        </p>
      </div>
    </section>
  );
};
