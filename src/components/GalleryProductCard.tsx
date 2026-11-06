import React, { useState } from 'react';
import { MessageCircle, ShoppingBag, ArrowUpRight, XCircle } from 'lucide-react';
import { ProductItem } from '../data/products';
import { AdminProductStock } from './AdminPanel';

interface GalleryProductCardProps {
  product: ProductItem;
  prodStock: AdminProductStock;
  onInspectProduct?: (productId: string) => void;
  onDirectWhatsApp: (product: ProductItem, size: string) => void;
  onAddToBag: (product: ProductItem, size: string) => void;
}

export const GalleryProductCard: React.FC<GalleryProductCardProps> = ({
  product,
  prodStock,
  onInspectProduct,
  onDirectWhatsApp,
  onAddToBag,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('G');
  const [justAdded, setJustAdded] = useState<boolean>(false);

  const totalStock = Object.values(prodStock.stockPerSize).reduce((a, b) => a + b, 0);
  const hasAnyStock = prodStock.isActive && totalStock > 0;
  const selectedSizeQty = prodStock.stockPerSize[selectedSize] ?? 0;
  const isSizeAvailable = prodStock.isActive && selectedSizeQty > 0;

  const handleAdd = () => {
    if (!isSizeAvailable) return;
    onAddToBag(product, selectedSize);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs w-full transition-all duration-300 hover:shadow-md">
      <div className="flex flex-col lg:flex-row items-center gap-8 w-full">
        {/* Galeria Fotográfica de Alta Definição: Frente & Costas */}
        <div className="grid grid-cols-2 gap-4 w-full lg:w-[60%] shrink-0">
          {/* Vista Frontal */}
          <div className="relative group bg-[#EFEFEF] rounded-2xl p-4 flex flex-col items-center">
            <span className="absolute top-3 left-3 bg-white/90 text-[#111110] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-2xs">
              Vista Frontal
            </span>
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
            <span className="absolute top-3 left-3 bg-white/90 text-[#111110] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-2xs">
              Vista Traseira
            </span>
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

        {/* Módulo de Seleção e Ação Limpo */}
        <div className="w-full lg:w-[40%] flex flex-col justify-between space-y-5">
          <div>
            <div className="inline-block bg-[#EFEFEF] px-2.5 py-1 rounded-md text-[11px] font-bold text-[#555550]">
              {product.colorway} · {product.fabricSpec}
            </div>

            <h3 className="font-display text-xl md:text-2xl font-extrabold text-[#111110] mt-2">
              {product.name}
            </h3>

            {/* Tamanhos Disponíveis */}
            <div className="mt-4 space-y-2">
              <span className="text-xs font-bold text-[#111110]">Escolher Tamanho:</span>
              <div className="flex gap-2 flex-wrap" role="radiogroup" aria-label="Tamanhos disponíveis">
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
                    >
                      {sz} {!isAvailable ? '(Esgotado)' : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Botões de Ação Direta */}
          <div className="space-y-2 pt-2">
            {hasAnyStock && isSizeAvailable ? (
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => onDirectWhatsApp(product, selectedSize)}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Pedir no WhatsApp (Tam. {selectedSize})</span>
                </button>

                <button
                  type="button"
                  onClick={handleAdd}
                  className="py-3 px-4 rounded-xl bg-[#111110] hover:bg-[#222220] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4 text-[#25D366]" />
                  <span>{justAdded ? 'Adicionado!' : 'Adicionar'}</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                disabled
                className="w-full py-3 px-4 rounded-xl bg-[#A0A09C] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-not-allowed shadow-xs"
              >
                <XCircle className="w-4 h-4" />
                <span>Indisponível no Tamanho {selectedSize}</span>
              </button>
            )}

            {onInspectProduct && (
              <button
                type="button"
                onClick={() => onInspectProduct(product.id)}
                className="w-full py-2 px-3 rounded-lg text-xs font-bold text-[#666660] hover:text-[#111110] flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                <span>Ver no Estúdio Principal</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
