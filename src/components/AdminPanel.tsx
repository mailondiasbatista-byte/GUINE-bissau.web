import React, { useState } from 'react';
import {
  Plus,
  Minus,
  RotateCcw,
  CheckCircle2,
  XCircle,
  PlusCircle,
  PackageCheck,
  X,
  Lock,
  Layers,
  ShoppingBag,
} from 'lucide-react';
import { GarmentCategory, GarmentSilhouette, ProductItem } from '../data/products';

export interface AdminProductStock {
  id: string;
  name: string;
  subtitle: string;
  priceMAD: number;
  category: GarmentCategory;
  frontImage: string;
  backImage: string;
  isActive: boolean;
  stockPerSize: Record<string, number>;
}

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductItem[];
  stockData: Record<string, AdminProductStock>;
  onUpdateStock: (updatedStockData: Record<string, AdminProductStock>) => void;
  onAddProduct: (newProduct: ProductItem, initialStock: Record<string, number>) => void;
  onResetStock: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  products,
  stockData,
  onUpdateStock,
  onAddProduct,
  onResetStock,
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  // Form para Adicionar Novo Produto
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('Edição Especial Djurtus');
  const [newPriceMAD, setNewPriceMAD] = useState<number>(250);
  const [newCategory, setNewCategory] = useState<GarmentCategory>(GarmentCategory.EQUIPAMENTOS);
  const [newFrontImage, setNewFrontImage] = useState('');
  const [newStockP, setNewStockP] = useState(5);
  const [newStockM, setNewStockM] = useState(5);
  const [newStockG, setNewStockG] = useState(5);
  const [newStockGG, setNewStockGG] = useState(5);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'djurtus2026') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Senha incorreta! Utilize: djurtus2026');
    }
  };

  const handleDeltaStock = (productId: string, size: string, delta: number) => {
    const currentProd = stockData[productId];
    if (!currentProd) return;

    const currentQty = currentProd.stockPerSize[size] ?? 0;
    const newQty = Math.max(0, currentQty + delta);

    const updated = {
      ...stockData,
      [productId]: {
        ...currentProd,
        stockPerSize: {
          ...currentProd.stockPerSize,
          [size]: newQty,
        },
      },
    };

    onUpdateStock(updated);
  };

  const handleToggleActive = (productId: string) => {
    const currentProd = stockData[productId];
    if (!currentProd) return;

    const updated = {
      ...stockData,
      [productId]: {
        ...currentProd,
        isActive: !currentProd.isActive,
      },
    };

    onUpdateStock(updated);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const id = `prod-custom-${Date.now()}`;
    const newProdItem: ProductItem = {
      id,
      indexLabel: `0${products.length + 1} / 0${products.length + 1}`,
      name: newName,
      subtitle: newSubtitle,
      fitLabel: 'Corte Oficial Djurtus',
      colorway: 'Cores Nacionais da Guiné-Bissau',
      priceMAD: Number(newPriceMAD),
      priceEUR: Math.round(Number(newPriceMAD) / 10),
      category: newCategory,
      silhouette: GarmentSilhouette.POLO_JERSEY,
      frontImage: newFrontImage || products[0].frontImage,
      backImage: products[0].backImage,
      fabricSpec: 'Tecido Técnico Respirável Guisport',
      originNote: 'Entrega Imediata em Marrocos',
      heritageStory: 'Nova edição especial adicionada pelo Painel de Gestão de Estoque.',
      sizes: ['P', 'M', 'G', 'GG'],
    };

    const initialStockMap = {
      P: Number(newStockP),
      M: Number(newStockM),
      G: Number(newStockG),
      GG: Number(newStockGG),
    };

    onAddProduct(newProdItem, initialStockMap);

    // Reset form
    setNewName('');
    setNewFrontImage('');
    setIsAddFormOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Painel de Administração de Estoque"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-white rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do Admin */}
        <div className="flex items-center justify-between pb-6 border-b border-black/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#111110] text-white flex items-center justify-center font-bold">
              <PackageCheck className="w-5 h-5 text-[#25D366]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-[#111110] font-display">
                  PAINEL ADMIN DE ESTOQUE
                </h2>
                <span className="text-[10px] bg-[#25D366]/15 text-[#188B46] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  DJURTUS.STUDIO
                </span>
              </div>
              <p className="text-xs text-[#666660]">
                Gestão de estoque em tempo real com persistência no navegador
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#EFEFEF] hover:bg-black/10 text-[#111110] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal de Autenticação se não autenticado */}
        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="py-12 max-w-md mx-auto text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#111110] text-white flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6 text-[#25D366]" />
            </div>
            <h3 className="text-lg font-bold text-[#111110]">Acesso Restrito ao Painel Admin</h3>
            <p className="text-xs text-[#666660]">
              Insira a senha de administrador para gerir o estoque da loja.
            </p>

            <div className="space-y-2">
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Senha de Acesso (djurtus2026)"
                className="w-full px-4 py-3 text-sm bg-[#EFEFEF] rounded-xl text-[#111110] text-center font-mono focus:outline-none focus:ring-2 focus:ring-[#111110]"
              />
              {authError && <p className="text-xs text-[#A2141E] font-bold">{authError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#111110] text-white text-xs font-bold hover:bg-[#222220] transition-colors cursor-pointer"
            >
              Entrar no Painel
            </button>
          </form>
        ) : (
          /* Conteúdo do Painel Admin */
          <div className="mt-6 space-y-6 max-h-[75vh] overflow-y-auto no-scrollbar pr-1">
            {/* Barra de Ações do Admin */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-[#f8f8f8] p-4 rounded-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#111110]">Total de Artigos:</span>
                <span className="text-xs font-mono font-bold bg-white px-2.5 py-1 rounded-lg text-[#111110] shadow-2xs">
                  {products.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddFormOpen(!isAddFormOpen)}
                  className="px-4 py-2 rounded-xl bg-[#25D366] text-white hover:bg-[#20ba59] text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isAddFormOpen ? 'Fechar Formulário' : 'Adicionar Nova Camisola'}</span>
                </button>

                <button
                  type="button"
                  onClick={onResetStock}
                  title="Restaurar valores padrão do catálogo"
                  className="px-4 py-2 rounded-xl bg-[#EFEFEF] hover:bg-black/10 text-[#111110] text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-[#A2141E]" />
                  <span>Restaurar Padrão</span>
                </button>
              </div>
            </div>

            {/* Formulário de Novo Produto */}
            {isAddFormOpen && (
              <form onSubmit={handleCreateProduct} className="bg-[#EFEFEF] p-6 rounded-2xl space-y-4">
                <h4 className="text-sm font-bold text-[#111110] uppercase tracking-wider">
                  Adicionar Nova Camisola ou Variação
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold mb-1 text-[#111110]">Nome do Produto</label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Ex: Camisola Edição Comemorativa 2026"
                      className="w-full px-3 py-2 bg-white rounded-lg text-[#111110] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-[#111110]">Subtítulo / Descrição</label>
                    <input
                      type="text"
                      value={newSubtitle}
                      onChange={(e) => setNewSubtitle(e.target.value)}
                      placeholder="Ex: Equipamento Oficial Guisport"
                      className="w-full px-3 py-2 bg-white rounded-lg text-[#111110] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-[#111110]">Preço em Dirhams (MAD)</label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={newPriceMAD}
                      onChange={(e) => setNewPriceMAD(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white rounded-lg text-[#111110] font-mono focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-[#111110]">Categoria</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as GarmentCategory)}
                      className="w-full px-3 py-2 bg-white rounded-lg text-[#111110] focus:outline-none cursor-pointer"
                    >
                      <option value={GarmentCategory.EQUIPAMENTOS}>Equipamentos</option>
                      <option value={GarmentCategory.FATOS}>Fatos de Treino</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-semibold mb-1 text-[#111110]">
                      URL da Imagem de Frente (opcional)
                    </label>
                    <input
                      type="text"
                      value={newFrontImage}
                      onChange={(e) => setNewFrontImage(e.target.value)}
                      placeholder="https://... ou caminho de imagem"
                      className="w-full px-3 py-2 bg-white rounded-lg text-[#111110] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Estoque inicial por tamanho */}
                <div className="pt-2 border-t border-black/10">
                  <p className="text-xs font-bold mb-2 text-[#111110]">Estoque Inicial por Tamanho:</p>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="font-bold block">P (S)</span>
                      <input
                        type="number"
                        min={0}
                        value={newStockP}
                        onChange={(e) => setNewStockP(Number(e.target.value))}
                        className="w-full px-2 py-1 bg-white rounded text-center font-mono"
                      />
                    </div>
                    <div>
                      <span className="font-bold block">M</span>
                      <input
                        type="number"
                        min={0}
                        value={newStockM}
                        onChange={(e) => setNewStockM(Number(e.target.value))}
                        className="w-full px-2 py-1 bg-white rounded text-center font-mono"
                      />
                    </div>
                    <div>
                      <span className="font-bold block">G (L)</span>
                      <input
                        type="number"
                        min={0}
                        value={newStockG}
                        onChange={(e) => setNewStockG(Number(e.target.value))}
                        className="w-full px-2 py-1 bg-white rounded text-center font-mono"
                      />
                    </div>
                    <div>
                      <span className="font-bold block">GG (XL)</span>
                      <input
                        type="number"
                        min={0}
                        value={newStockGG}
                        onChange={(e) => setNewStockGG(Number(e.target.value))}
                        className="w-full px-2 py-1 bg-white rounded text-center font-mono"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#111110] text-white text-xs font-bold hover:bg-[#222220] transition-colors cursor-pointer"
                >
                  Salvar Nova Camisola no Catálogo
                </button>
              </form>
            )}

            {/* Lista de Produtos & Controlo de Estoque */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111110]">
                Gestão de Estoque por Tamanho em Tempo Real
              </h3>

              <div className="divide-y divide-black/10 bg-white rounded-2xl border border-black/5 overflow-hidden">
                {products.map((prod) => {
                  const stockInfo = stockData[prod.id] ?? {
                    id: prod.id,
                    name: prod.name,
                    subtitle: prod.subtitle,
                    priceMAD: prod.priceMAD,
                    category: prod.category,
                    frontImage: prod.frontImage,
                    backImage: prod.backImage,
                    isActive: true,
                    stockPerSize: { P: 5, M: 5, G: 5, GG: 5 },
                  };

                  const totalStock = Object.values(stockInfo.stockPerSize).reduce((a, b) => a + b, 0);

                  return (
                    <div key={prod.id} className="p-4 flex flex-col md:flex-row items-center gap-4 justify-between">
                      {/* Detalhe do Produto */}
                      <div className="flex items-center gap-3 min-w-[240px]">
                        <div className="w-14 h-16 bg-[#EFEFEF] rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-1">
                          <img
                            src={prod.frontImage}
                            alt={prod.name}
                            className="w-full h-full object-contain mix-blend-multiply"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-[#111110]">{prod.name}</h4>
                          </div>
                          <p className="text-[11px] font-mono tabular-nums text-[#666660] mt-0.5">
                            Preço: <span className="font-bold text-[#111110]">{prod.priceMAD} MAD</span> · Total em Estoque: <span className="font-bold text-[#111110]">{totalStock}</span>
                          </p>
                        </div>
                      </div>

                      {/* Controlos de Estoque por Tamanho (P, M, G, GG) */}
                      <div className="flex flex-wrap items-center gap-3">
                        {prod.sizes.map((sz) => {
                          const qty = stockInfo.stockPerSize[sz] ?? 0;
                          return (
                            <div key={sz} className="flex flex-col items-center bg-[#f8f8f8] px-2.5 py-1.5 rounded-xl">
                              <span className="text-[10px] font-bold text-[#666660] uppercase mb-1">
                                Tam {sz}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleDeltaStock(prod.id, sz, -1)}
                                  className="w-6 h-6 rounded-md bg-white border border-black/10 flex items-center justify-center text-[#111110] hover:bg-black/5 cursor-pointer"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className={`px-2 text-xs font-mono font-black ${qty === 0 ? 'text-[#A2141E]' : 'text-[#111110]'}`}>
                                  {qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleDeltaStock(prod.id, sz, 1)}
                                  className="w-6 h-6 rounded-md bg-white border border-black/10 flex items-center justify-center text-[#111110] hover:bg-black/5 cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Toggle Ativo / Esgotado */}
                      <div className="shrink-0 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(prod.id)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                            stockInfo.isActive && totalStock > 0
                              ? 'bg-[#25D366]/15 text-[#188B46]'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {stockInfo.isActive && totalStock > 0 ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Ativo</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Esgotado</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
