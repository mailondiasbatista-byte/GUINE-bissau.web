import React, { useState } from 'react';
import { CheckCircle2, MessageCircle, Minus, Plus, Trash2, X } from 'lucide-react';
import { ProductItem, WHATSAPP_NUMBERS } from '../data/products';

export interface BagLineItem {
  product: ProductItem;
  size: string;
  quantity: number;
}

interface BagDrawerProps {
  isOpen: boolean;
  items: BagLineItem[];
  onClose: () => void;
  onUpdateQty: (productId: string, size: string, delta: number) => void;
  onRemoveItem: (productId: string, size: string) => void;
  onClearBag: () => void;
}

export const BagDrawer: React.FC<BagDrawerProps> = ({
  isOpen,
  items,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onClearBag,
}) => {
  const [fullName, setFullName] = useState('');
  const [cityCountry, setCityCountry] = useState('Casablanca, Marrocos');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedWhatsAppLine, setSelectedWhatsAppLine] = useState(WHATSAPP_NUMBERS[0].clean);

  if (!isOpen) return null;

  const totalMAD = items.reduce((acc, item) => acc + item.product.priceMAD * item.quantity, 0);

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
      `*Cidade/Local de entrega:* ${cityCountry}\n` +
      (notes ? `*Observações:* ${notes}\n\n` : '\n') +
      `*Itens da Encomenda:*\n${itemsSummary}\n\n` +
      `*TOTAL:* ${totalMAD} MAD\n` +
      `*Pagamento:* Sem cartão (A combinar no WhatsApp / Na entrega em Marrocos)\n\n` +
      `Por favor confirmem a disponibilidade e prazo de entrega. Obrigado! 🇬🇼🇲🇦`;

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
        <div className="px-6 py-5 flex items-center justify-between bg-white">
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
                  {items.map(({ product, size, quantity }) => (
                    <li key={`${product.id}-${size}`} className="flex gap-3">
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
                              onClick={() => onUpdateQty(product.id, size, 1)}
                              aria-label="Aumentar"
                              className="w-6 h-6 flex items-center justify-center text-[#555550] hover:text-[#111110] cursor-pointer"
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
                    </li>
                  ))}
                </ul>
              </div>

              {/* Formulário Rápido para Envio no WhatsApp */}
              <form id="whatsapp-order-form" onSubmit={handleSendWhatsAppOrder} className="space-y-3 pt-2">
                <p className="text-xs font-bold text-[#111110] uppercase tracking-wider">
                  Dados para Entrega em Marrocos
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
                    Cidade / Bairro em Marrocos
                  </label>
                  <input
                    type="text"
                    required
                    value={cityCountry}
                    onChange={(e) => setCityCountry(e.target.value)}
                    placeholder="Ex: Casablanca, Marrakech, Rabat, Tanger..."
                    className="w-full px-3 py-2 text-xs bg-white rounded-lg text-[#111110] focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                  />
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
                    Enviar para qual contacto oficial:
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
                    A encomenda envia uma mensagem direta pré-formatada para o nosso WhatsApp em Marrocos. Pagamento e entrega combinados diretamente connosco.
                  </p>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Rodapé da Gaveta com Botão de Ação WhatsApp */}
        {items.length > 0 && (
          <div className="px-6 py-4 bg-white space-y-3">
            <div className="flex justify-between items-center text-sm font-bold text-[#111110]">
              <span>Total da Encomenda</span>
              <span className="font-mono tabular-nums text-lg text-[#111110]">{totalMAD} MAD</span>
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
