// Fotografias Originais da Seleção Nacional da Guiné-Bissau (Guisport Oficial)
import guisportVermelhaFrente from '../assets/images/guinea-bissau-2022-home.jpg';
import guisportVermelhaCostas from '../assets/images/guisport_vermelha_costas_limpa_1793808397068.jpg';
import guisportVerdeFrente from '../assets/images/guinea-bissau-2022-away.jpg';
import guisportVerdeCostas from '../assets/images/guisport_verde_costas_limpa_1793808411785.jpg';
import guisportBrancaFrente from '../assets/images/camisola_branca_guisport_oficial.png';
import guisportBrancaCostas from '../assets/images/camisola_branca_guisport_costas_limpa_1793811096153.jpg';
import guisportAmarelaFrente from '../assets/images/guinea-bissau-2022-third.jpg';
import guisportAmarelaCostas from '../assets/images/guisport_amarela_costas_limpa_1793808427083.jpg';
import fatoDesportivoFrente from '../assets/images/fato_desportivo_frente_1793806367425.jpg';
import fatoDesportivoCostas from '../assets/images/fato_desportivo_costas_limpa_1793808460721.jpg';
import editorialCampaignImg from '../assets/images/djurtus_editorial_campaign_1793802587916.jpg';

export enum GarmentCategory {
  ALL = 'Todos os Artigos',
  EQUIPAMENTOS = 'Equipamentos',
  FATOS = 'Fatos de Treino',
}

export enum GarmentSilhouette {
  HOODIE = 'HOODIE',
  TEE = 'TEE',
  JACKET = 'JACKET',
  POLO_JERSEY = 'POLO_JERSEY',
}

export interface ProductItem {
  id: string;
  indexLabel: string;
  name: string;
  subtitle: string;
  fitLabel: string;
  colorway: string;
  priceMAD: number; // Preço oficial em Dirhams Marroquinos (MAD)
  priceEUR: number; // Equivalência
  category: GarmentCategory;
  silhouette: GarmentSilhouette;
  frontImage: string;
  backImage: string;
  fabricSpec: string;
  originNote: string;
  heritageStory: string;
  sizes: string[];
}

export const EDITORIAL_CAMPAIGN_IMAGE = editorialCampaignImg;

export const WHATSAPP_NUMBERS = [
  { label: 'Linha Principal', number: '+212-690701620', clean: '212690701620' },
  { label: 'Linha de Apoio', number: '+212 603-530015', clean: '212603530015' },
];

export const PRODUCTS: ProductItem[] = [
  {
    id: 'camisola-oficial-vermelha',
    indexLabel: '01 / 05',
    name: 'Camisola Oficial Vermelha Guiné-Bissau',
    subtitle: 'Equipamento Principal Titular · Guisport Oficial',
    fitLabel: 'Corte Atlético Oficial',
    colorway: 'Vermelho Nacional & Grafismo Panu di Pinti',
    priceMAD: 250,
    priceEUR: 25,
    category: GarmentCategory.EQUIPAMENTOS,
    silhouette: GarmentSilhouette.POLO_JERSEY,
    frontImage: guisportVermelhaFrente,
    backImage: guisportVermelhaCostas,
    fabricSpec: 'Poliéster Técnico Guisport Respirável de Alta Performance',
    originNote: 'Emblema oficial FFGB e logótipo Guisport termocolado',
    heritageStory:
      'A autêntica camisola titular da Seleção Nacional da Guiné-Bissau produzida pela Guisport. Padrão lateral étnico Panu di Pinti nas cores da bandeira nacional e gola V branca. Costas totalmente limpas e originais sem estampagem.',
    sizes: ['P', 'M', 'G', 'GG'],
  },
  {
    id: 'camisola-oficial-verde',
    indexLabel: '02 / 05',
    name: 'Camisola Oficial Verde Guiné-Bissau',
    subtitle: 'Equipamento Alternativo Polo · Guisport Oficial',
    fitLabel: 'Corte Polo Atlético',
    colorway: 'Verde Floresta & Damier Panu di Pinti',
    priceMAD: 250,
    priceEUR: 25,
    category: GarmentCategory.EQUIPAMENTOS,
    silhouette: GarmentSilhouette.POLO_JERSEY,
    frontImage: guisportVerdeFrente,
    backImage: guisportVerdeCostas,
    fabricSpec: 'Tecido Técnico Microperfurado com Gola Polo e Botões',
    originNote: 'Disponível para entrega imediata em Marrocos',
    heritageStory:
      'A elegante camisola alternativa verde da Guisport para a Seleção Nacional da Guiné-Bissau. Apresenta gola polo desportiva e padrão em xadrez geométrico tradicional na base. Costas completamente limpas e originais sem nomes nem números.',
    sizes: ['P', 'M', 'G', 'GG'],
  },
  {
    id: 'camisola-oficial-branca',
    indexLabel: '03 / 05',
    name: 'Camisola Oficial Branca Guiné-Bissau',
    subtitle: 'Quarto Equipamento com Faixa Étnica · Guisport Oficial',
    fitLabel: 'Corte Regular Confortável',
    colorway: 'Branco Puro & Frisos Horizontais Panu di Pinti',
    priceMAD: 250,
    priceEUR: 25,
    category: GarmentCategory.EQUIPAMENTOS,
    silhouette: GarmentSilhouette.POLO_JERSEY,
    frontImage: guisportBrancaFrente,
    backImage: guisportBrancaCostas,
    fabricSpec: 'Malha Piqué Suave Antitranspirante 210 GSM',
    originNote: 'Modelo oficial dos jogadores dos Djurtus',
    heritageStory:
      'Camisola oficial branca da Guisport com faixa estilizada horizontal no peito em padrões geométricos Panu di Pinti. Modelo usado pela seleção nos jogos da CAN. Costas lisas e autênticas sem número nem nome.',
    sizes: ['P', 'M', 'G', 'GG'],
  },
  {
    id: 'camisola-simples-amarela',
    indexLabel: '04 / 05',
    name: 'Camisola Oficial Amarela Guiné-Bissau',
    subtitle: 'Terceiro Equipamento Listrado · Guisport Oficial',
    fitLabel: 'Corte Desportivo Conforto',
    colorway: 'Amarelo Ouro com Riscas Vermelhas & Panu di Pinti',
    priceMAD: 230,
    priceEUR: 23,
    category: GarmentCategory.EQUIPAMENTOS,
    silhouette: GarmentSilhouette.TEE,
    frontImage: guisportAmarelaFrente,
    backImage: guisportAmarelaCostas,
    fabricSpec: 'Malha Leve 100% Respirável com Fina Risca de Giz Vermelha',
    originNote: 'Faixas étnicas verticais no abdómen e emblema FFGB',
    heritageStory:
      'O marcante terceiro equipamento amarelo da Guiné-Bissau pela Guisport, com finas riscas vermelhas e três colunas verticais de losangos tradicionais Panu di Pinti. Costas com riscas originais e limpas sem estampagem.',
    sizes: ['P', 'M', 'G', 'GG'],
  },
  {
    id: 'fato-disportivo-track-jacket',
    indexLabel: '05 / 05',
    name: 'Fato Disportivo Oficial da Seleção da Guiné-Bissau',
    subtitle: 'Jaqueta Oficial de Treino Djurtus & Calça de Apresentação',
    fitLabel: 'Corte Desportivo Oficial Pré-Jogo',
    colorway: 'Verde Garrafa, Vermelho & Frisos Amarelos',
    priceMAD: 380,
    priceEUR: 38,
    category: GarmentCategory.FATOS,
    silhouette: GarmentSilhouette.JACKET,
    frontImage: fatoDesportivoFrente,
    backImage: fatoDesportivoCostas,
    fabricSpec: 'Tecido Técnico Corta-Vento & Térmico Premium 260 GSM',
    originNote: 'Emblema bordado de alta definição FFGB e fecho integral',
    heritageStory:
      'O fato de treino oficial que os jogadores e equipa técnica dos Djurtus usam nas viagens e aquecimentos em Marrocos. Inclui casaco com fecho e calça desportiva combinada. Costas limpas com o recorte chevron original em vermelho e amarelo.',
    sizes: ['P', 'M', 'G', 'GG'],
  },
];

export const DEFAULT_PRODUCT_INDEX = 0;
