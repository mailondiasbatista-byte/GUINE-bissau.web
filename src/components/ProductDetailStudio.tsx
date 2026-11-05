import React, { useState } from 'react';
import { Check, MessageCircle, Ruler, ShoppingBag, X } from 'lucide-react';
import { ProductItem, WHATSAPP_NUMBERS } from '../data/products';
import { GarmentBackView } from './GarmentBackView';

interface ProductDetailStudioProps {
  product: ProductItem;
  onAddToBag: (product: ProductItem, size: string) => void;
  onPrevProduct: () => void;
  onNextProduct: () => void;
}

export const ProductDetailStudio: React.FC<ProductDetailStudioProps> = ({
  product,
  onAddToBag,
  onPrevProduct,
  onNextProduct,
}) => {
  const [viewSide, setViewSide] = useState<'front' | 'back'>('front');
  const [selectedSize, setSelectedSize] = useState<string>('G');
  const [justAdded, setJustAdded] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const handleAdd = () => {
    onAddToBag(product, selectedSize);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  const handleDirectWhatsAppOrder = () => {
    const message = encodeURIComponent(
      `Olá Loja Djurtus Marrocos! Gostaria de encomendar:\n\n• Peça: ${product.name}\n• Tamanho: ${selectedSize}\n• Preço: ${product.priceMAD} MAD\n• Cor: ${product.colorway}\n\nPor favor, confirmem a disponibilidade para entrega em Marrocos. Obrigado!`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBERS[0].clean}?text=${message}`, '_blank');
  };

  return (
    <section
      id="product-studio-detail"
      aria-label="Detalhe do Produto em Estúdio"
      className="py-12 md:py-16 bg-[#f2f2f2]"
    >
      <div className="max-w-[1020px] mx-auto px-6">
        {/* Moldura centralizada de produto em alta definição */}
        <div className="relative mx-auto max-w-[440px] aspect-[3/4] flex items-center justify-center bg-[#EFEFEF] rounded-2xl p-4 shadow-sm">
          {viewSide === 'front' ? (
            !imgFailed ? (
              <img
                key={`${product.id}-front`}
                src={product.frontImage}
                alt={`${product.name} — Vista Frontal`}
                referrerPolicy="no-referrer"
                onError={() => setImgFailed(true)}
                className="w-full h-full object-contain mix-blend-multiply transition-opacity duration-200 select-none"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                <p className="text-sm font-bold text-[#111110]">{product.name}</p>
                <p className="text-xs text-[#666660] mt-1">{product.subtitle}</p>
              </div>
            )
          ) : product.backImage ? (
            <img
              key={`${product.id}-back`}
              src={product.backImage}
              alt={`${product.name} — Vista de Costas`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain mix-blend-multiply transition-opacity duration-200 select-none"
            />
          ) : (
            <GarmentBackView key={`${product.id}-back`} product={product} />
          )}
        </div>

        {/* Pilha de especificações editoriais centralizada */}
        <div className="max-w-[560px] mx-auto mt-6 text-center">
          {/* Indicador de índice com botões discretos Anterior / Próximo */}
          <div className="inline-flex items-center gap-4 text-xs font-mono tabular-nums text-[#666660]">
            <button
              type="button"
              onClick={() => {
                setImgFailed(false);
                onPrevProduct();
              }}
              className="hover:text-[#111110] transition-colors px-2 py-0.5 cursor-pointer whitespace-nowrap"
              aria-label="Peça anterior"
            >
              Anterior
            </button>
            <span className="font-semibold">{product.indexLabel}</span>
            <button
              type="button"
              onClick={() => {
                setImgFailed(false);
                onNextProduct();
              }}
              className="hover:text-[#111110] transition-colors px-2 py-0.5 cursor-pointer whitespace-nowrap"
              aria-label="Próxima peça"
            >
              Próxima
            </button>
          </div>

          {/* Título e Subtítulo */}
          <h2 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight text-[#111110]">
            {product.name}
          </h2>
          <p className="mt-1 text-xs font-semibold text-[#555550]">{product.subtitle}</p>

          {/* Seletor Frente / Costas com Miniaturas Interativas */}
          <div
            role="tablist"
            aria-label="Ângulo de visualização da peça"
            className="mt-4 inline-flex items-center gap-2 bg-white/90 p-1.5 rounded-xl shadow-xs"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewSide === 'front'}
              onClick={() => setViewSide('front')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewSide === 'front'
                  ? 'bg-[#111110] text-white'
                  : 'text-[#555550] hover:text-[#111110] hover:bg-black/5'
              }`}
            >
              <img
                src={product.frontImage}
                alt=""
                className="w-5 h-5 rounded object-contain bg-[#EFEFEF]"
              />
              <span>Frente</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewSide === 'back'}
              onClick={() => setViewSide('back')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewSide === 'back'
                  ? 'bg-[#111110] text-white'
                  : 'text-[#555550] hover:text-[#111110] hover:bg-black/5'
              }`}
            >
              <img
                src={product.backImage}
                alt=""
                className="w-5 h-5 rounded object-contain bg-[#EFEFEF]"
              />
              <span>Costas</span>
            </button>
          </div>
        </div>

        {/* Divisor suave e módulo de encomenda */}
        <div className="max-w-[600px] mx-auto mt-6 pt-6">
          <p className="text-xs text-[#444440] leading-relaxed text-center font-normal">
            {product.heritageStory}
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-[11px] text-[#666660] font-medium">
            <span>{product.fabricSpec}</span>
            <span aria-hidden="true">·</span>
            <span>{product.originNote}</span>
          </div>

          {/* Seletor de Tamanhos e Encomenda WhatsApp */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#111110] whitespace-nowrap">Tamanho</span>
              <div className="inline-flex items-center gap-1.5" role="radiogroup" aria-label="Selecionar tamanho">
                {product.sizes.map((size) => {
                  const active = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setSelectedSize(size)}
                      className={`w-9 h-9 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        active
                          ? 'bg-[#111110] text-white'
                          : 'bg-[#F2F2F0] text-[#333330] hover:bg-black/10'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(true)}
                className="ml-1 inline-flex items-center gap-1 text-[11px] text-[#666660] hover:text-[#111110] underline underline-offset-4 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Medidas</span>
              </button>
            </div>

            {/* Preço em MAD e Botões de Ação */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-left sm:text-right">
                <span className="text-lg font-mono tabular-nums font-black text-[#111110]">
                  {product.priceMAD} MAD
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAdd}
                  title="Adicionar à sacola"
                  className={`p-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    justAdded ? 'bg-[#111110] text-white' : 'bg-[#EFEFEF] text-[#111110] hover:bg-[#111110] hover:text-white'
                  }`}
                >
                  {justAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={handleDirectWhatsAppOrder}
                  className="px-5 py-2.5 rounded-lg text-xs font-bold bg-[#25D366] text-white hover:bg-[#20ba59] inline-flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Pedir no WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Minimalista de Guia de Medidas */}
      {isSizeGuideOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="size-guide-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
          onClick={() => setIsSizeGuideOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4">
              <div>
                <h3 id="size-guide-title" className="text-base font-bold text-[#111110]">
                  Tabela de Tamanhos Oficiais
                </h3>
                <p className="text-xs text-[#666660] mt-0.5">
                  Camisolas &amp; Fatos · Medidas no corpo (cm)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(false)}
                aria-label="Fechar guia de medidas"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#666660] hover:text-[#111110] hover:bg-black/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <table className="w-full mt-4 text-xs text-left border-collapse">
              <thead>
                <tr className="text-[#666660]">
                  <th className="py-2 font-semibold">Tamanho</th>
                  <th className="py-2 font-semibold">Tórax (cm)</th>
                  <th className="py-2 font-semibold">Comprimento</th>
                  <th className="py-2 font-semibold">Altura Recomendada</th>
                </tr>
              </thead>
              <tbody className="font-mono tabular-nums text-[#111110]">
                <tr>
                  <td className="py-2.5 font-sans font-bold">P (S)</td>
                  <td className="py-2.5">92 - 96 cm</td>
                  <td className="py-2.5">70 cm</td>
                  <td className="py-2.5">165 - 172 cm</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-bold">M</td>
                  <td className="py-2.5">98 - 104 cm</td>
                  <td className="py-2.5">72 cm</td>
                  <td className="py-2.5">170 - 178 cm</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-bold">G (L)</td>
                  <td className="py-2.5">106 - 112 cm</td>
                  <td className="py-2.5">75 cm</td>
                  <td className="py-2.5">176 - 185 cm</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-bold">GG (XL)</td>
                  <td className="py-2.5">114 - 120 cm</td>
                  <td className="py-2.5">78 cm</td>
                  <td className="py-2.5">182 - 192 cm</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-4 p-3 rounded-xl bg-[#25D366]/10 text-xs text-[#188B46] flex items-center gap-2 font-medium">
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>Dúvida no tamanho? Fale connosco pelo WhatsApp para conselho imediato.</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
