import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { ProductItem, WHATSAPP_NUMBERS } from '../data/products';

interface RackShowcaseProps {
  products: ProductItem[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  onInspectProduct: () => void;
  onQuickWhatsApp: (product: ProductItem) => void;
}

export const RackShowcase: React.FC<RackShowcaseProps> = ({
  products,
  selectedIndex,
  onSelectIndex,
  onInspectProduct,
  onQuickWhatsApp,
}) => {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const activeProduct = products[selectedIndex] ?? products[0];

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

      {/* Arara Metálica de Estúdio Contínua */}
      <div className="relative w-full overflow-hidden">
        {/* Barra de aço escovado minimalista */}
        <div
          aria-hidden="true"
          className="absolute left-0 right-0 top-[20px] md:top-[26px] h-[4px] z-10 bg-[#D4D4D0]"
        />

        {/* Peças penduradas na arara */}
        <div className="w-full px-4 sm:px-6 md:px-10">
          <div
            role="listbox"
            aria-label="Peças da Coleção Djurtus"
            className="flex items-start justify-start md:justify-center gap-3 sm:gap-6 overflow-x-auto no-scrollbar pt-[16px] md:pt-[20px] pb-6 snap-x snap-mandatory"
          >
            {products.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const hasFailed = Boolean(failedImages[item.id]);

              return (
                <button
                  key={item.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => onSelectIndex(idx)}
                  className={`group relative shrink-0 snap-center focus:outline-none transition-all duration-300 ${
                    isSelected
                      ? 'w-[210px] sm:w-[240px] md:w-[260px] z-20 opacity-100'
                      : 'w-[140px] sm:w-[165px] md:w-[185px] z-10 opacity-70 hover:opacity-100'
                  }`}
                >
                  {/* Gancho metálico minimalista */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-[0px] w-[5px] h-[14px] rounded-full bg-[#888880] z-30"
                  />

                  {/* Moldura de estúdio limpa com fundo uniforme */}
                  <div
                    className={`relative p-3 rounded-xl transition-all duration-300 bg-[#EFEFEF] ${
                      isSelected
                        ? 'shadow-md scale-100'
                        : 'scale-95 group-hover:scale-98'
                    }`}
                  >
                    {/* Imagem do produto em estúdio */}
                    <div className="aspect-[3/4] w-full flex items-center justify-center overflow-hidden rounded-lg bg-[#EFEFEF]">
                      {!hasFailed ? (
                        <img
                          src={item.frontImage}
                          alt={`${item.name} — ${item.colorway}`}
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setFailedImages((prev) => ({ ...prev, [item.id]: true }))
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

        {/* Botões de Ação: Ver Detalhes e Encomendar por WhatsApp */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onInspectProduct}
            className="px-6 py-2.5 rounded-full bg-[#111110] text-white hover:bg-[#222220] text-xs font-bold transition-all whitespace-nowrap cursor-pointer shadow-xs"
          >
            Ver Detalhes &amp; Tamanhos
          </button>

          <button
            type="button"
            onClick={() => onQuickWhatsApp(activeProduct)}
            className="px-6 py-2.5 rounded-full bg-[#25D366] text-white hover:bg-[#20ba59] text-xs font-bold inline-flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Encomendar no WhatsApp</span>
          </button>
        </div>

        <p className="mt-3 text-[11px] text-[#666660] font-medium">
          Marrocos: {WHATSAPP_NUMBERS[0].number} / {WHATSAPP_NUMBERS[1].number}
        </p>
      </div>
    </section>
  );
};
