import React, { useState } from 'react';
import { CheckCircle2, MessageCircle, Minus, Plus, Trash2, X, AlertCircle } from 'lucide-react';
import { ProductItem, WHATSAPP_NUMBERS } from '../data/products';
import { AdminProductStock } from './AdminPanel';

export interface BagLineItem {
  product: ProductItem;
  size: string;
  quantity: number;
}

interface BagDrawerProps {
  isOpen: boolean;
  items: BagLineItem[];
  stockData: Record<string, AdminProductStock>;
  onClose: () => void;
  onUpdateQty: (productId: string, size: string, delta: number) => void;
  onRemoveItem: (productId: string, size: string) => void;
  onClearBag: () => void;
}

export const BagDrawer: React.FC<BagDrawerProps> = ({
  isOpen,
  items,
  stockData,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onClearBag,
}) => {
  const [fullName, setFullName] = useState('');
  const [selectedCity, setSelectedCity] = useState('Casablanca');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent: number; freeShipping: boolean } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [selectedWhatsAppLine, setSelectedWhatsAppLine] = useState(WHATSAPP_NUMBERS[0].clean);

  if (!isOpen) return null;

  const MOROCCO_CITIES = [
    { name: 'Casablanca', time: '24h', fee: 0 },
    { name: 'Rabat', time: '24h - 48h', fee: 0 },
    { name: 'Marrakech', time: '24h - 48h', fee: 20 },
    { name: 'Fès', time: '48h', fee: 20 },
    { name: 'Tanger', time: '24h - 48h', fee: 20 },
    { name: 'Agadir', time: '48h', fee: 30 },
    { name: 'Kenitra', time: '24h - 48h', fee: 20 },
    { name: 'Oujda', time: '48h - 72h', fee: 30 },
    { name: 'Meknès', time: '48h', fee: 20 },
  ];

  const currentCityObj = MOROCCO_CITIES.find((c) => c.name === selectedCity) ?? MOROCCO_CITIES[0];

  const subtotalMAD = items.reduce((acc, item) => acc + item.product.priceMAD * item.quantity, 0);
  const discountPercent = appliedPromo?.discountPercent ?? 0;
  const discountAmountMAD = Math.round((subtotalMAD * discountPercent) / 100);

  const baseShippingFee = subtotalMAD >= 400 || appliedPromo?.freeShipping ? 0 : currentCityObj.fee;
  const finalTotalMAD = Math.max(0, subtotalMAD - discountAmountMAD + baseShippingFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const cleanCode = promoCodeInput.trim().toUpperCase();

    if (cleanCode === 'DJURTUS10' || cleanCode === 'DJURTUS') {
      setAppliedPromo({ code: cleanCode, discountPercent: 10, freeShipping: false });
      setPromoCodeInput('');
    } else if (cleanCode === 'FRETEGRATIS' || cleanCode === 'MARROCOS') {
      setAppliedPromo({ code: cleanCode, discountPercent: 0, freeShipping: true });
      setPromoCodeInput('');
    } else if (cleanCode === 'VIP20') {
      setAppliedPromo({ code: cleanCode, discountPercent: 20, freeShipping: true });
      setPromoCodeInput('');
    } else {
      setPromoError('Cupão inválido. Tente DJURTUS10 ou FRETEGRATIS');
    }
  };

  const handleSendWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const itemsSummary = items
      .map(
        (it, idx) =>
          `${idx + 1}. ${it.product.name} (Tam: ${it.size}) x${it.quantity} = ${
            it.product.priceMAD * it.quantity
          } MAD`
      )
      .join('\n');

    const messageText = `*NOVA ENCOMENDA — DJURTUS.STUDIO MARROCOS*\n\n` +
      `*Cliente:* ${fullName || 'Não informado'}\n` +
      `*Telefone:* ${phoneNumber || 'Não informado'}\n` +
      `*Cidade em Marrocos:* ${selectedCity} (Entrega estimada: ${currentCityObj.time})\n` +
      (appliedPromo ? `*Cupão Aplicado:* ${appliedPromo.code} (${appliedPromo.discountPercent}% OFF)\n` : '') +
      (notes ? `*Observações:* ${notes}\n\n` : '\n') +
      `*Itens da Encomenda:*\n${itemsSummary}\n\n` +
      `*Subtotal:* ${subtotalMAD} MAD\n` +
      (discountAmountMAD > 0 ? `*Desconto (${appliedPromo?.code}):* -${discountAmountMAD} MAD\n` : '') +
      `*Envio (${selectedCity}):* ${baseShippingFee === 0 ? 'GRÁTIS' : `${baseShippingFee} MAD`}\n` +
      `*TOTAL FINAL:* ${finalTotalMAD} MAD\n` +
      `*Pagamento:* Sem cartão (A combinar no WhatsApp / Na entrega em Marrocos)\n\n` +
      `Por favor confirmem a disponibilidade e o prazo de entrega. Obrigado! 🇬🇼🇲🇦`;

    const encoded = encodeURIComponent(messageText);
    const waUrl = `https://wa.me/${selectedWhatsAppLine}?text=${encoded}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sacola de Encomendas WhatsApp"
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] h-full bg-[#f8f8f8] flex flex-col justify-between shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho da Gaveta */}
        <div className="px-6 py-5 flex items-center justify-between bg-white border-b border-black/5">
          <div>
            <div className="flex items-center gap-1.5 text-[#25D366] font-bold text-xs uppercase tracking-wider">
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Encomenda Direta WhatsApp</span>
            </div>
            <h2 className="text-base font-bold text-[#111110] mt-0.5">
              DJURTUS.STUDIO
            </h2>
            <p className="text-xs text-[#666660] mt-0.5">
              Sem cartão de crédito · Atendimento oficial em Marrocos
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar sacola"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#666660] hover:text-[#111110] hover:bg-black/5 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conteúdo da Gaveta */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="w-12 h-12 rounded-full bg-[#25D366]/15 text-[#25D366] flex items-center justify-center mb-3">
                <MessageCircle className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-[#111110]">A sua sacola está vazia</p>
              <p className="text-xs text-[#666660] mt-1.5 max-w-[28ch]">
                Selecione as suas camisolas ou fato de treino na vitrine e adicione os tamanhos desejados.
              </p>
            </div>
          ) : (
            <>
              {/* Lista de Peças */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#111110]">
                    Peças Selecionadas ({items.reduce((s, i) => s + i.quantity, 0)})
                  </span>
                  <button
                    type="button"
                    onClick={onClearBag}
                    className="text-[11px] text-[#A2141E] hover:underline cursor-pointer"
                  >
                    Esvaziar lista
                  </button>
                </div>

                <ul className="bg-white rounded-2xl p-3 space-y-3">
                  {items.map(({ product, size, quantity }) => {
                    const prodStock = stockData[product.id];
                    const maxStockForSize = prodStock?.stockPerSize[size] ?? 0;
                    const isAtMaxStock = quantity >= maxStockForSize;

                    return (
                      <li key={`${product.id}-${size}`} className="flex flex-col gap-2 pb-2 border-b border-black/5 last:border-0 last:pb-0">
                        <div className="flex gap-3">
                          <div className="w-16 h-20 bg-[#EFEFEF] rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-1">
                            <img
                              src={product.frontImage}
                              alt={product.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-contain mix-blend-multiply"
                            />
                          </div>

                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="text-xs font-bold text-[#111110] truncate">
                                  {product.name}
                                </h3>
                                <span className="text-xs font-mono tabular-nums font-bold text-[#111110] shrink-0">
                                  {product.priceMAD * quantity} MAD
                                </span>
                              </div>
                              <p className="text-[11px] text-[#666660]">
                                Tamanho {size} · {product.priceMAD} MAD cada
                              </p>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                              <div className="inline-flex items-center rounded-lg bg-[#EFEFEF]">
                                <button
                                  type="button"
                                  onClick={() => onUpdateQty(product.id, size, -1)}
                                  aria-label="Diminuir"
                                  className="w-6 h-6 flex items-center justify-center text-[#555550] hover:text-[#111110] cursor-pointer"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-2 text-xs font-mono tabular-nums font-bold text-[#111110]">
                                  {quantity}
                                </span>
                                <button
                                  type="button"
                                  disabled={isAtMaxStock}
                                  onClick={() => onUpdateQty(product.id, size, 1)}
                                  aria-label="Aumentar"
                                  title={isAtMaxStock ? `Limite de estoque atingido (${maxStockForSize} disponíveis)` : 'Adicionar mais um'}
                                  className={`w-6 h-6 flex items-center justify-center ${
                                    isAtMaxStock
                                      ? 'text-gray-300 opacity-40 cursor-not-allowed'
                                      : 'text-[#555550] hover:text-[#111110] cursor-pointer'
                                  }`}
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => onRemoveItem(product.id, size)}
                                aria-label={`Remover ${product.name}`}
                                className="text-[#888880] hover:text-[#A2141E] transition-colors p-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Aviso discreto quando limite de estoque for atingido */}
                        {isAtMaxStock && (
                          <div className="flex items-center gap-1.5 text-[10px] text-[#A2141E] font-bold bg-[#A2141E]/10 px-2 py-1 rounded-md">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            <span>
                              Limite de estoque atingido (Apenas {maxStockForSize} {maxStockForSize === 1 ? 'disponível' : 'disponíveis'})
                            </span>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Módulo de Cupão de Desconto */}
              <div className="bg-white rounded-2xl p-3.5 space-y-2">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#111110]">
                  Cupão de Desconto
                </span>

                {appliedPromo ? (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#25D366]/10 text-xs font-bold text-[#188B46]">
                    <span>Cupão {appliedPromo.code} Ativo!</span>
                    <button
                      type="button"
                      onClick={() => setAppliedPromo(null)}
                      className="text-[10px] text-[#A2141E] underline cursor-pointer"
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                      placeholder="Ex: DJURTUS10"
                      className="flex-1 px-3 py-1.5 text-xs bg-[#f8f8f8] rounded-lg text-[#111110] focus:outline-none focus:ring-1 focus:ring-[#111110] uppercase"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-[#111110] text-white text-xs font-bold hover:bg-[#222220] cursor-pointer whitespace-nowrap"
                    >
                      Aplicar
                    </button>
                  </form>
                )}
                {promoError && (
                  <p className="text-[10px] text-[#A2141E] font-bold mt-1">{promoError}</p>
                )}
              </div>

              {/* Formulário Rápido para Envio no WhatsApp */}
              <form id="whatsapp-order-form" onSubmit={handleSendWhatsAppOrder} className="space-y-3 pt-1">
                <p className="text-xs font-bold text-[#111110] uppercase tracking-wider">
                  Dados de Entrega em Marrocos
                </p>

                <div>
                  <label className="block text-[11px] font-semibold text-[#111110] mb-1">
                    O seu Nome
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex: Carlos Vieira"
                    className="w-full px-3 py-2 text-xs bg-white rounded-lg text-[#111110] focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#111110] mb-1">
                    Cidade de Entrega em Marrocos
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white rounded-lg text-[#111110] font-semibold focus:outline-none focus:ring-2 focus:ring-[#25D366] cursor-pointer"
                  >
                    {MOROCCO_CITIES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name} ({c.time} · {c.fee === 0 || subtotalMAD >= 400 ? 'Portes Grátis' : `${c.fee} MAD`})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#111110] mb-1">
                    Contacto WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+212 ..."
                    className="w-full px-3 py-2 text-xs bg-white rounded-lg text-[#111110] focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                  />
                </div>

                {/* Seleção do número oficial de WhatsApp para atendimento */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#111110] mb-1">
                    Atendimento WhatsApp:
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {WHATSAPP_NUMBERS.map((wa) => (
                      <button
                        key={wa.clean}
                        type="button"
                        onClick={() => setSelectedWhatsAppLine(wa.clean)}
                        className={`p-2 rounded-lg text-left cursor-pointer transition-colors ${
                          selectedWhatsAppLine === wa.clean
                            ? 'bg-[#25D366]/15 text-[#111110] font-bold'
                            : 'bg-white text-[#555550]'
                        }`}
                      >
                        <p className="text-[10px] text-[#666660]">{wa.label}</p>
                        <p className="font-mono tabular-nums text-xs font-semibold">{wa.number}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aviso claro sobre pagamento sem cartão */}
                <div className="p-3 rounded-xl bg-white text-[11px] text-[#444440] space-y-1">
                  <p className="font-bold text-[#188B46] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Sem pagamento com cartão online</span>
                  </p>
                  <p>
                    A encomenda envia uma mensagem pré-formatada para o WhatsApp em Marrocos. Pagamento combinado diretamente na entrega.
                  </p>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Rodapé da Gaveta com Resumo e Botão de Ação WhatsApp */}
        {items.length > 0 && (
          <div className="px-6 py-4 bg-white border-t border-black/5 space-y-3">
            <div className="space-y-1.5 text-xs text-[#555550]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums font-bold text-[#111110]">{subtotalMAD} MAD</span>
              </div>

              {discountAmountMAD > 0 && (
                <div className="flex justify-between text-[#188B46] font-bold">
                  <span>Desconto ({appliedPromo?.code})</span>
                  <span className="font-mono tabular-nums">-{discountAmountMAD} MAD</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Envio ({selectedCity})</span>
                <span className="font-mono tabular-nums font-bold text-[#111110]">
                  {baseShippingFee === 0 ? 'GRÁTIS' : `${baseShippingFee} MAD`}
                </span>
              </div>

              <div className="pt-2 border-t border-black/10 flex justify-between items-center text-sm font-bold text-[#111110]">
                <span>Total a Pagar</span>
                <span className="font-mono tabular-nums text-xl text-[#111110]">{finalTotalMAD} MAD</span>
              </div>
            </div>

            <button
              type="submit"
              form="whatsapp-order-form"
              className="w-full py-3.5 rounded-xl text-xs font-bold bg-[#25D366] text-white hover:bg-[#20ba59] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Finalizar Encomenda no WhatsApp</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
