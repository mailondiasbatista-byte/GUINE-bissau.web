import React, { useState } from 'react';
import {
  ZoomIn,
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  Eye,
  ArrowRight,
  Maximize2,
  Tag,
  Layers,
  ShoppingBag,
  Check,
} from 'lucide-react';
import { ProductItem, PRODUCTS, WHATSAPP_NUMBERS } from '../data/products';

export interface GalleryDetailItem {
  id: string;
  title: string;
  subtitle: string;
  categoryTag: string;
  imageSrc: string;
  associatedProductId: string;
  description: string;
  bulletPoints: string[];
  techBadge: string;
}

// Lista de pormenores fotográficos em alta definição dos equipamentos e fatos de treino
export const GALLERY_DETAILS: GalleryDetailItem[] = [
  {
    id: 'emblema-ffgb-bordado',
    title: 'Emblema Oficial FFGB Bordado',
    subtitle: 'Costura de alta densidade e cores vivas da Guiné-Bissau',
    categoryTag: 'Autenticidade & Costura',
    imageSrc: PRODUCTS[0].frontImage, // Camisola Oficial Vermelha
    associatedProductId: 'camisola-oficial-vermelha',
    description:
      'O emblema oficial da Federação de Futebol da Guiné-Bissau (FFGB) é aplicado com técnicas de bordado de alta definição. Apresenta o clássico Djurtu (fénec/cão selvagem africano) sob o escudo nacional com contornos reforçados para resistir a centenas de lavagens sem perder o brilho.',
    bulletPoints: [
      'Bordado em fios de poliéster ultra-resistentes',
      'Cores originais da bandeira: Vermelho, Amarelo e Verde',
      'Termocolagem interna para não irritar a pele do atleta',
    ],
    techBadge: 'FFGB Autêntico 100%',
  },
  {
    id: 'padrao-panu-di-pinti',
    title: 'Padrão Étnico Panu di Pinti',
    subtitle: 'Grafismos geométricos inspirados na tecelagem tradicional',
    categoryTag: 'Cultura & Herança',
    imageSrc: PRODUCTS[3].frontImage, // Camisola Amarela
    associatedProductId: 'camisola-simples-amarela',
    description:
      'Cada camisola oficial incorpora o icónico grafismo Panu di Pinti — o pano tradicional guineense tecido à mão que simboliza celebração, honra e prestígio. Os losangos e linhas geométricas prestam homenagem às tradições dos tecelões da Guiné-Bissau.',
    bulletPoints: [
      'Sublimação digital de alta definição sem relevo',
      'Resistente ao desbotamento por luz solar ou suor',
      'Design exclusivo desenhado para os Djurtus na CAN',
    ],
    techBadge: 'Design Cultural Guisport',
  },
  {
    id: 'tecido-micromesh-guisport',
    title: 'Malha Micro-Mesh Respirável',
    subtitle: 'Tecnologia Dri-Dry para máxima evaporação de suor',
    categoryTag: 'Tecnologia do Tecido',
    imageSrc: PRODUCTS[2].frontImage, // Camisola Branca
    associatedProductId: 'camisola-oficial-branca',
    description:
      'Construída com microporos hexagonais que permitem a circulação contínua do ar, mantendo o corpo seco e fresco mesmo sob temperaturas elevadas em jogos ou treinos intensos em Marrocos.',
    bulletPoints: [
      'Gramagem equilibrada de 180 g/m² para leveza ideal',
      'Tratamento antibacteriano antiodor',
      'Secagem ultra-rápida após lavagem manual ou à máquina',
    ],
    techBadge: 'Tecnologia Dri-Dry 180 GSM',
  },
  {
    id: 'fato-treino-jaqueta-detalhe',
    title: 'Fato de Treino Oficial Djurtus',
    subtitle: 'Recorte chevron nas cores nacionais & tecido corta-vento',
    categoryTag: 'Fato de Treino & Apresentação',
    imageSrc: PRODUCTS[4].frontImage, // Fato de Treino
    associatedProductId: 'fato-disportivo-track-jacket',
    description:
      'Pormenor da jaqueta oficial de treino e viagem utilizada pela equipa técnica e jogadores em Marrocos. Inclui fecho eclair metálico reforçado, gola alta de proteção térmica e punhos elásticos ajustáveis.',
    bulletPoints: [
      'Jaqueta com fecho frontal integral e bolsos laterais',
      'Calça desportiva combinada com cintura elástica',
      'Corte ergonómico pré-jogo',
    ],
    techBadge: 'Conjunto Completo 380 MAD',
  },
  {
    id: 'gola-polo-alternativo-verde',
    title: 'Gola Polo & Acabamento Premium',
    subtitle: 'Elegância e conforto na camisola alternativa verde',
    categoryTag: 'Design & Acabamento',
    imageSrc: PRODUCTS[1].frontImage, // Camisola Verde
    associatedProductId: 'camisola-oficial-verde',
    description:
      'Pormenor de alfaiataria desportiva com gola polo estruturada em malha canelada e carcela de botões. Ideal tanto para o campo de jogo como para uso casual elegante.',
    bulletPoints: [
      'Gola canelada que mantém a forma original',
      'Padrão xadrez geométrico Panu di Pinti no abdómen',
      'Etiqueta de autenticidade oficial Guisport',
    ],
    techBadge: 'Polo Desportivo Oficial',
  },
  {
    id: 'estampagem-costas-personalizada',
    title: 'Estampagem de Nome & Número nas Costas',
    subtitle: 'Vinil térmico oficial de alta flexibilidade',
    categoryTag: 'Personalização de Estúdio',
    imageSrc: PRODUCTS[0].backImage, // Costas Vermelha
    associatedProductId: 'camisola-oficial-vermelha',
    description:
      'Exemplo do acabamento de personalização nas costas. O vinil de alta densidade é prensado a quente a 160°C para fusão perfeita no tecido, garantindo que o seu nome e número favorito fiquem com acabamento profissional idêntico aos jogadores.',
    bulletPoints: [
      'Fonte oficial da seleção da Guiné-Bissau',
      'Sem rachar nem descolar com o uso',
      'Personalização totalmente gratuita no seu pedido',
    ],
    techBadge: 'Personalização Grátis',
  },
];

interface ImageDetailsGallerySectionProps {
  onOpenProductModal: (product: ProductItem) => void;
  onAddToBag?: (product: ProductItem, size: string) => void;
}

export const ImageDetailsGallerySection: React.FC<ImageDetailsGallerySectionProps> = ({
  onOpenProductModal,
  onAddToBag,
}) => {
  const [selectedDetail, setSelectedDetail] = useState<GalleryDetailItem | null>(null);
  const [addedDetailId, setAddedDetailId] = useState<string | null>(null);

  const handleOpenDetail = (detail: GalleryDetailItem) => {
    setSelectedDetail(detail);
  };

  const handleCloseDetail = () => {
    setSelectedDetail(null);
  };

  const handleInspectAssociatedProduct = (productId: string) => {
    const foundProd = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];
    setSelectedDetail(null);
    onOpenProductModal(foundProd);
  };

  const handleWhatsAppDetailInquiry = (detail: GalleryDetailItem) => {
    const message = encodeURIComponent(
      `*DÚVIDA SOBRE DETALHE DO EQUIPAMENTO — DJURTUS.STUDIO MARROCOS*\n\n` +
        `Olá! Gostaria de saber mais informações sobre este detalhe:\n` +
        `• *Pormenor:* ${detail.title}\n` +
        `• *Categoria:* ${detail.categoryTag}\n` +
        `• *Especificação:* ${detail.techBadge}\n\n` +
        `Como posso encomendar este equipamento em Marrocos? Obrigado!`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBERS[0].clean}?text=${message}`, '_blank');
  };

  return (
    <section
      id="detalhes-fotograficos"
      aria-label="Galeria de Pormenores & Detalhes Fotográficos"
      className="py-16 md:py-24 bg-[#f8f8f8] w-full border-t border-black/5"
    >
      <div className="w-full px-4 sm:px-6 md:px-10">
        {/* Cabeçalho da Seção */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-extrabold font-display text-[#111110] tracking-tight">
              Galeria de Pormenores &amp; Qualidade
            </h2>
            <p className="text-xs md:text-sm text-[#555550] leading-relaxed">
              Clica em qualquer fotografia abaixo para abrir o modo de ampliação e ver os detalhes de bordado, tecido, acabamento e tecnologia das peças originais da Guisport.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-xs text-[#666660] font-semibold bg-white px-4 py-2.5 rounded-2xl shadow-2xs">
            <ZoomIn className="w-4 h-4 text-[#111110]" />
            <span>Clica na imagem para zoom e especificações completas</span>
          </div>
        </div>

        {/* Grelha de Fotografias de Detalhe (Card Grid Interactive) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {GALLERY_DETAILS.map((detail) => (
            <div
              key={detail.id}
              onClick={() => handleOpenDetail(detail)}
              className="group relative bg-white rounded-3xl p-4 shadow-2xs hover:shadow-xl transition-all duration-300 border border-black/5 cursor-pointer flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* Contentor da Imagem com Efeito Zoom ao Passar o Rato */}
                <div className="relative w-full aspect-[4/3] bg-[#EFEFEF] rounded-2xl overflow-hidden flex items-center justify-center p-4">
                  <img
                    src={detail.imageSrc}
                    alt={detail.title}
                    loading="lazy"
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Botão de Lupa Flutuante (Zoom trigger indicator) */}
                  <div className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-[#111110]/90 text-white flex items-center justify-center shadow-md group-hover:bg-[#111110] group-hover:scale-110 transition-all">
                    <Maximize2 className="w-4 h-4 text-[#25D366]" />
                  </div>

                  {/* Overlay sutil ao passar o rato */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="bg-white text-[#111110] text-xs font-black px-4 py-2 rounded-full shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-all">
                      Ver Pormenor Completo
                    </span>
                  </div>
                </div>

                {/* Conteúdo Textual da Card */}
                <div className="mt-4 space-y-1">
                  <h3 className="font-display font-extrabold text-base text-[#111110] group-hover:text-[#188B46] transition-colors">
                    {detail.title}
                  </h3>
                  <p className="text-xs text-[#666660] line-clamp-2 leading-relaxed">
                    {detail.subtitle}
                  </p>
                </div>
              </div>

              {/* Rodapé da Card com Tag Técnica e Botão Adicionar à Sacola */}
              <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono font-bold text-[#111110] bg-[#f2f2f2] px-2.5 py-1 rounded-md">
                  {detail.techBadge}
                </span>

                <div className="flex items-center gap-1.5">
                  {onAddToBag && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const p = PRODUCTS.find((prod) => prod.id === detail.associatedProductId) || PRODUCTS[0];
                        onAddToBag(p, 'G');
                        setAddedDetailId(detail.id);
                        setTimeout(() => setAddedDetailId(null), 1400);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#111110] hover:bg-[#222220] text-white text-[11px] font-bold inline-flex items-center gap-1 transition-all shadow-2xs cursor-pointer"
                    >
                      {addedDetailId === detail.id ? (
                        <>
                          <Check className="w-3 h-3 text-[#25D366]" />
                          <span>Adicionado!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3 h-3 text-[#25D366]" />
                          <span>Adicionar</span>
                        </>
                      )}
                    </button>
                  )}
                  <span className="text-xs font-bold text-[#111110] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
                    <span>Detalhes</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#25D366]" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL / LIGHTBOX DE INSPEÇÃO DETALHADA DA IMAGEM        */}
      {/* ======================================================== */}
      {selectedDetail && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Detalhes de ${selectedDetail.title}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-6 overflow-y-auto animate-fadeIn"
          onClick={handleCloseDetail}
        >
          <div
            className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden relative my-auto max-h-[92vh] flex flex-col lg:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão de Fechar Modal */}
            <button
              type="button"
              onClick={handleCloseDetail}
              aria-label="Fechar detalhes da imagem"
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#111110] flex items-center justify-center shadow-md transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* PAINEL ESQUERDO: Imagem Ampliada com Controlo de Inspeção */}
            <div className="w-full lg:w-1/2 bg-[#EFEFEF] p-6 sm:p-10 flex flex-col justify-between items-center relative min-h-[340px] lg:min-h-full">
              <span className="absolute top-4 left-4 z-20 bg-[#111110] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs">
                {selectedDetail.categoryTag}
              </span>

              {/* Imagem Ampliada */}
              <div className="relative w-full aspect-[4/5] flex items-center justify-center my-auto overflow-hidden p-2">
                <img
                  src={selectedDetail.imageSrc}
                  alt={selectedDetail.title}
                  className="w-full h-full object-contain mix-blend-multiply select-none"
                />
              </div>

              {/* Tag de Especificação */}
              <div className="bg-white/95 px-4 py-2 rounded-xl shadow-xs text-xs font-mono font-bold text-[#111110] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#25D366]" />
                <span>{selectedDetail.techBadge}</span>
              </div>
            </div>

            {/* PAINEL DIREITO: Explicação Detalhada, Bullet Points e Botões de Ação */}
            <div className="w-full lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#666660]">
                    Inspeção Fotográfica Guisport
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111110] font-display tracking-tight mt-1">
                    {selectedDetail.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#188B46] mt-1">
                    {selectedDetail.subtitle}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-[#444440] leading-relaxed">
                  {selectedDetail.description}
                </p>

                {/* Lista de Destaques Técnicos */}
                <div className="space-y-2 pt-3 border-t border-black/5">
                  <h4 className="text-xs font-bold text-[#111110] uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>Destaques de Qualidade:</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-[#333330]">
                    {selectedDetail.bulletPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
                        <span className="leading-snug">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Informação da Origem & Garantia */}
                <div className="bg-[#f8f8f8] p-4 rounded-2xl space-y-1 text-xs text-[#555550]">
                  <div className="flex items-center gap-2 font-bold text-[#111110]">
                    <ShieldCheck className="w-4 h-4 text-[#25D366]" />
                    <span>Produto 100% Autêntico da Guiné-Bissau</span>
                  </div>
                  <p className="text-[11px]">
                    Fotografia real tirada no nosso estúdio com os equipamentos oficiais Guisport.
                  </p>
                </div>
              </div>

              {/* Botões de Ação no Modal */}
              <div className="pt-6 space-y-2.5 border-t border-black/5 mt-6">
                {onAddToBag && (
                  <button
                    type="button"
                    onClick={() => {
                      const p = PRODUCTS.find((prod) => prod.id === selectedDetail.associatedProductId) || PRODUCTS[0];
                      onAddToBag(p, 'G');
                      setAddedDetailId(selectedDetail.id);
                      setTimeout(() => setAddedDetailId(null), 1400);
                    }}
                    className="w-full py-3.5 px-6 rounded-2xl text-xs font-bold bg-[#111110] hover:bg-[#222220] text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    {addedDetailId === selectedDetail.id ? (
                      <>
                        <Check className="w-4 h-4 text-[#25D366]" />
                        <span>Artigo Adicionado à Sacola!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-[#25D366]" />
                        <span>Adicionar este Artigo à Sacola</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleInspectAssociatedProduct(selectedDetail.associatedProductId)}
                  className="w-full py-3 px-6 rounded-2xl text-xs font-bold bg-white hover:bg-black/5 text-[#111110] border border-black/10 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Tag className="w-4 h-4 text-[#188B46]" />
                  <span>Ver Página do Produto Completo</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleWhatsAppDetailInquiry(selectedDetail)}
                  className="w-full py-3 px-6 rounded-2xl text-xs font-bold bg-[#25D366] hover:bg-[#20ba59] text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Tirar Dúvidas no WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
