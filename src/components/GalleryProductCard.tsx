import React, { useEffect, useState } from 'react';
import { MessageCircle, ShoppingBag, XCircle } from 'lucide-react';
import { ProductItem } from '../data/products';
import { AdminProductStock } from './AdminPanel';

interface GalleryProductCardProps {
  product: ProductItem;
  prodStock: AdminProductStock;
  onDirectWhatsApp: (product: ProductItem, size: string) => void;
  onAddToBag: (product: ProductItem, size: string) => void;
}

export const GalleryProductCard: React.FC<GalleryProductCardProps> = ({
  product,
  prodStock,
  onDirectWhatsApp,
  onAddToBag,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('G');
  const [justAdded, setJustAdded] = useState<boolean>(false);

  const totalStock = Object.values(prodStock.stockPerSize).reduce((a, b) => a + b, 0);
  const hasAnyStock = prodStock.isActive && totalStock > 0;

  // Auto-ajustar para o primeiro tamanho disponível
  useEffect(() => {
    const qtyForSelected = prodStock.stockPerSize[selectedSize] ?? 0;
    if ((qtyForSelected <= 0 || !prodStock.isActive) && hasAnyStock) {
      const firstAvailable = product.sizes.find(
        (sz) => (prodStock.stockPerSize[sz] ?? 0) > 0
      );
      if (firstAvailable) {
        setSelectedSize(firstAvailable);
      }
    }
  }, [product.id, prodStock, selectedSize, hasAnyStock, product.sizes]);

  const selectedSizeQty = prodStock.stockPerSize[selectedSize] ?? 0;
  const isSizeAvailable = prodStock.isActive && selectedSizeQty > 0;

  const handleAdd = () => {
    if (!isSizeAvailable) return;
    onAddToBag(product, selectedSize);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs w-full">
      <div className="flex flex-col lg:flex-row items-center gap-8 w-full">
        {/* Par de Imagens: Frente e Costas */}
        <div className="grid grid-cols-2 gap-4 w-full lg:w-[50%] shrink-0">
          {/* Vista Frontal */}
          <div className="relative group bg-[#EFEFEF] rounded-2xl p-4 flex flex-col items-center">
            <div className="w-full aspect-[3/4] flex items-center justify-center overflow-hidden">
              <img
                src={product.frontImage}
                alt={`${product.name} — Frente`}
                loading="lazy"
                className={`w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300 ${
                  !hasAnyStock ? 'opacity-50' : 'opacity-100'
                }`}
              />
            </div>
          </div>

          {/* Vista de Costas */}
          <div className="relative group bg-[#EFEFEF] rounded-2xl p-4 flex flex-col items-center">
            <div className="w-full aspect-[3/4] flex items-center justify-center overflow-hidden">
              <img
                src={product.backImage}
                alt={`${product.name} — Costas`}
                loading="lazy"
                className={`w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300 ${
                  !hasAnyStock ? 'opacity-50' : 'opacity-100'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Especificações & Botão de Encomenda */}
        <div className="w-full lg:w-[50%] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h3 className="font-display text-xl md:text-2xl font-bold text-[#111110]">
                {product.name}
              </h3>
              <span className="text-2xl font-mono tabular-nums font-black text-[#111110]">
                {product.priceMAD} <span className="text-xs font-semibold text-[#666660]">MAD</span>
              </span>
            </div>
            <p className="text-xs font-bold text-[#666660] mt-1">
              {product.subtitle} · {product.colorway}
            </p>

            <p className="text-xs md:text-sm text-[#444440] leading-relaxed mt-3">
              {product.heritageStory}
            </p>

            <div className="mt-4 pt-3 space-y-3 text-xs text-[#555550]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#111110]">Tecido:</span>
                <span>{product.fabricSpec}</span>
              </div>

              {/* Seletor de Tamanhos Interativo */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-[#111110]">Tamanho:</span>
                  <div className="flex gap-1.5 flex-wrap" role="radiogroup" aria-label="Tamanhos disponíveis">
                    {product.sizes.map((sz) => {
                      const szQty = prodStock.stockPerSize[sz] ?? 0;
                      const active = selectedSize === sz;
                      const isAvailable = prodStock.isActive && szQty > 0;

                      return (
                        <button
                          key={sz}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          disabled={!isAvailable}
                          onClick={() => setSelectedSize(sz)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                            !isAvailable
                              ? 'bg-gray-200 text-gray-400 line-through cursor-not-allowed opacity-50'
                              : active
                              ? 'bg-[#111110] text-white shadow-xs'
                              : 'bg-[#EFEFEF] text-[#111110] hover:bg-black/10 cursor-pointer'
                          }`}
                          title={isAvailable ? `Estoque: ${szQty} un.` : `Tamanho ${sz} Esgotado`}
                        >
                          {sz} {!isAvailable ? '(Esgotado)' : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Exibição em tempo real do estoque do tamanho selecionado */}
                <div className="text-[11px] text-[#555550]">
                  {hasAnyStock ? (
                    <span>
                      Estoque disponível no tamanho <strong className="text-[#111110] font-bold">{selectedSize}</strong>:{' '}
                      <span className={`font-mono font-bold ${selectedSizeQty > 0 ? 'text-[#111110]' : 'text-red-600'}`}>
                        {selectedSizeQty > 0 ? `${selectedSizeQty} un.` : 'Esgotado'}
                      </span>
                    </span>
                  ) : (
                    <span className="text-red-600 font-bold">Produto Esgotado em todos os tamanhos</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Botões de Ação Direta */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            {hasAnyStock && isSizeAvailable ? (
              <>
                <button
                  type="button"
                  onClick={() => onDirectWhatsApp(product, selectedSize)}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Pedir no WhatsApp — Tam. {selectedSize} ({product.priceMAD} MAD)</span>
                </button>

                <button
                  type="button"
                  onClick={handleAdd}
                  className="py-3.5 px-4 rounded-xl bg-[#111110] hover:bg-[#222220] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4 text-[#25D366]" />
                  <span>{justAdded ? 'Adicionado!' : 'Adicionar'}</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                disabled
                className="w-full py-3.5 px-4 rounded-xl bg-[#A0A09C] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-not-allowed shadow-xs"
              >
                <XCircle className="w-4 h-4" />
                <span>{!hasAnyStock ? 'Produto Esgotado' : `Tamanho ${selectedSize} Esgotado`}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
