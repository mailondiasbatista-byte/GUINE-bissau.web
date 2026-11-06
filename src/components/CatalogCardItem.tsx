import React, { useState } from 'react';
import { MessageCircle, RotateCcw, ShoppingBag, XCircle, Check } from 'lucide-react';
import { ProductItem } from '../data/products';
import { AdminProductStock } from './AdminPanel';

interface CatalogCardItemProps {
  prod: ProductItem;
  prodStock: AdminProductStock;
  isSelected: boolean;
  isImgFailed: boolean;
  currentSide: 'front' | 'back';
  onToggleSide: (productId: string) => void;
  onSelectStudio: (productId: string) => void;
  onOpenModal: (product: ProductItem) => void;
  onDirectWhatsApp: (product: ProductItem, size: string) => void;
  onAddToBag: (product: ProductItem, size: string) => void;
  onImgError: (productId: string) => void;
}

export const CatalogCardItem: React.FC<CatalogCardItemProps> = ({
  prod,
  prodStock,
  isSelected,
  isImgFailed,
  currentSide,
  onToggleSide,
  onSelectStudio,
  onOpenModal,
  onDirectWhatsApp,
  onAddToBag,
  onImgError,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('G');
  const [justAdded, setJustAdded] = useState(false);

  const displayedImg = currentSide === 'front' ? prod.frontImage : prod.backImage;
  const totalStock = Object.values(prodStock.stockPerSize).reduce((a, b) => a + b, 0);
  const isAvailable = prodStock.isActive && totalStock > 0;
  const selectedSizeQty = prodStock.stockPerSize[selectedSize] ?? 0;
  const isSizeAvailable = prodStock.isActive && selectedSizeQty > 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSizeAvailable) return;
    onAddToBag(prod, selectedSize);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 shadow-xs hover:shadow-md ${
        isSelected ? 'ring-2 ring-[#111110]' : ''
      }`}
    >
      <div>
        {/* Imagem do Produto com Alternador Frente/Costas & Clique para Ver Detalhes */}
        <div
          onClick={() => onOpenModal(prod)}
          className="relative w-full aspect-[4/5] bg-[#EFEFEF] rounded-xl flex items-center justify-center p-3 mb-3 overflow-hidden cursor-pointer group/img"
          title="Clique para abrir a página detalhada do produto"
        >
          {!isAvailable && (
            <span className="absolute top-2 left-2 z-20 bg-[#A0A09C] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
              Esgotado
            </span>
          )}

          {!isImgFailed ? (
            <img
              src={displayedImg}
              alt={`${prod.name} — ${currentSide === 'front' ? 'Frente' : 'Costas'}`}
              loading="lazy"
              onError={() => onImgError(prod.id)}
              className={`w-full h-full object-contain mix-blend-multiply group-hover/img:scale-108 transition-transform duration-300 ${
                !isAvailable ? 'opacity-50' : 'opacity-100'
              }`}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
              <p className="text-xs font-bold text-[#111110]">{prod.name}</p>
              <p className="text-[11px] text-[#666660] mt-1">{prod.colorway}</p>
            </div>
          )}

          {/* Overlay hover sutil 'Ver Detalhes' */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="bg-white/95 text-[#111110] text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-md">
              Ver em Detalhe
            </span>
          </div>

          {/* Botão de Alternar Frente/Costas */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSide(prod.id);
            }}
            className="absolute bottom-2 right-2 bg-white/95 hover:bg-white text-[#111110] text-[10px] font-bold px-2 py-1 rounded-md shadow-xs flex items-center gap-1 transition-all cursor-pointer z-20"
            title="Alternar entre Frente e Costas"
          >
            <RotateCcw className="w-3 h-3 text-[#111110]" />
            <span>{currentSide === 'front' ? 'Costas' : 'Frente'}</span>
          </button>
        </div>

        {/* Nome e Preço */}
        <div className="flex items-start justify-between gap-2">
          <h3
            onClick={() => onOpenModal(prod)}
            className="font-display text-sm font-bold text-[#111110] leading-snug line-clamp-2 cursor-pointer hover:underline"
          >
            {prod.name}
          </h3>
          <span className="text-sm font-mono tabular-nums font-black text-[#111110] shrink-0">
            {prod.priceMAD} MAD
          </span>
        </div>

        {/* Seletor Rápido de Tamanho */}
        <div className="mt-3 pt-2 border-t border-black/5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#666660]">Tamanho:</span>
            <span className="text-[10px] font-mono text-[#111110]">
              {selectedSizeQty > 0 ? `${selectedSizeQty} un.` : 'Esgotado'}
            </span>
          </div>
          <div className="flex gap-1 flex-wrap" role="radiogroup" aria-label="Tamanhos">
            {prod.sizes.map((sz) => {
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(sz);
                  }}
                  className={`px-2 py-1 rounded text-[11px] font-bold transition-all shrink-0 ${
                    !isAvailableSz
                      ? 'bg-gray-200 text-gray-400 line-through cursor-not-allowed opacity-50'
                      : active
                      ? 'bg-[#111110] text-white shadow-xs'
                      : 'bg-[#EFEFEF] text-[#111110] hover:bg-black/10 cursor-pointer'
                  }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Botões de Ação na Card do Catálogo */}
      <div className="mt-3 pt-2 border-t border-black/5 flex flex-col gap-1.5">
        <div className="grid grid-cols-2 gap-1.5">
          {/* Botão de Adicionar à Sacola */}
          <button
            type="button"
            disabled={!isSizeAvailable}
            onClick={handleAdd}
            className={`py-2 px-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 shadow-2xs ${
              !isSizeAvailable
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : justAdded
                ? 'bg-[#111110] text-white'
                : 'bg-[#111110] hover:bg-[#222220] text-white cursor-pointer'
            }`}
          >
            {justAdded ? (
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

          {/* Botão de Encomenda Direta WhatsApp */}
          {isAvailable && isSizeAvailable ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDirectWhatsApp(prod, selectedSize);
              }}
              className="py-2 px-2 text-xs font-bold rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white transition-colors flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Pedir</span>
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="py-2 px-2 text-xs font-bold rounded-lg bg-[#A0A09C] text-white transition-colors flex items-center justify-center gap-1 cursor-not-allowed opacity-90"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Esgotado</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => onSelectStudio(prod.id)}
          className="w-full py-1 text-[11px] font-bold text-[#666660] hover:text-[#111110] text-center cursor-pointer transition-colors"
        >
          Personalizar no Estúdio Principal →
        </button>
      </div>
    </div>
  );
};
