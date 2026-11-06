import React, { useState } from 'react';
import { ShieldCheck, Sparkles, Droplets, Flame, Award, CheckCircle2, FileText, ChevronRight, X } from 'lucide-react';

export const FabricSpecsSection: React.FC = () => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  return (
    <section id="tecnologia" aria-label="Tecnologia e Qualidade do Tecido" className="py-16 md:py-24 bg-white w-full border-y border-black/5">
      <div className="w-full px-4 sm:px-6 md:px-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black font-display text-[#111110] tracking-tight">
            O que torna as nossas camisolas únicas?
          </h2>
          <p className="text-sm md:text-base text-[#555550] mt-3 leading-relaxed">
            Mais do que uma camisola desportiva — uma peça de engenharia têxtil de alta performance com acabamentos de nível internacional para os adeptos da Seleção Nacional.
          </p>
        </div>

        {/* Grelha de 4 Pilares de Qualidade */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {/* Pilar 1: Tecido */}
          <div className="bg-[#f8f8f8] p-6 md:p-8 rounded-3xl border border-black/5 hover:border-black/20 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-[#111110] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-[#25D366]" />
            </div>
            <h3 className="text-lg font-bold font-display text-[#111110]">
              Poliéster Micro-Mesh &amp; Algodão Tecnológico
            </h3>
            <p className="text-xs text-[#555550] leading-relaxed">
              Tecido híbrido ultra-leve de 180g/m² com toque suave idêntico ao algodão premium, combinado com a respirabilidade do poliéster de competição.
            </p>
            <ul className="text-[11px] font-semibold text-[#111110] space-y-1.5 pt-2">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Toque ultra-suave na pele</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Microperfurações de ventilação 3D</span>
              </li>
            </ul>
          </div>

          {/* Pilar 2: Secagem Rápida */}
          <div className="bg-[#f8f8f8] p-6 md:p-8 rounded-3xl border border-black/5 hover:border-black/20 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-[#111110] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
              <Droplets className="w-6 h-6 text-[#25D366]" />
            </div>
            <h3 className="text-lg font-bold font-display text-[#111110]">
              Controlo Anti-Transpiração (Dri-Dry)
            </h3>
            <p className="text-xs text-[#555550] leading-relaxed">
              Canais de absorção ativa que expulsa a humidade para a camada exterior do tecido, garantindo secagem instantânea mesmo em dias quentes em Marrocos.
            </p>
            <ul className="text-[11px] font-semibold text-[#111110] space-y-1.5 pt-2">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Evaporação ultra-rápida do suor</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Sensação de frescura contínua</span>
              </li>
            </ul>
          </div>

          {/* Pilar 3: Emblema Bordado */}
          <div className="bg-[#f8f8f8] p-6 md:p-8 rounded-3xl border border-black/5 hover:border-black/20 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-[#111110] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6 text-[#25D366]" />
            </div>
            <h3 className="text-lg font-bold font-display text-[#111110]">
              Escudo Oficial Bordado em Alto Relevo
            </h3>
            <p className="text-xs text-[#555550] leading-relaxed">
              O emblema oficial da Federação de Futebol da Guiné-Bissau é aplicados em bordado de alta densidade acetinado com resistência garantida a lavagens.
            </p>
            <ul className="text-[11px] font-semibold text-[#111110] space-y-1.5 pt-2">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Bordado HD de alta precisão</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Não desbota e não descola</span>
              </li>
            </ul>
          </div>

          {/* Pilar 4: Durabilidade */}
          <div className="bg-[#f8f8f8] p-6 md:p-8 rounded-3xl border border-black/5 hover:border-black/20 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-[#111110] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6 text-[#25D366]" />
            </div>
            <h3 className="text-lg font-bold font-display text-[#111110]">
              Costura Dupla &amp; Proteção UV+50
            </h3>
            <p className="text-xs text-[#555550] leading-relaxed">
              Costuras planas ergonómicas que evitam fricção com a pele, associadas a um tratamento especial do tecido que bloqueia raios solares nocivos.
            </p>
            <ul className="text-[11px] font-semibold text-[#111110] space-y-1.5 pt-2">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Costuras reforçadas anti-rasgo</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Proteção solar UV incorporada</span>
              </li>
            </ul>
          </div>
        </div>


      </div>

      {/* Modal Completo de Ficha Técnica */}
      {isDetailModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="tech-specs-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setIsDetailModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-black/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#188B46] bg-[#25D366]/10 px-2 py-0.5 rounded">
                  Especificação Oficial Guisport 2026
                </span>
                <h3 id="tech-specs-title" className="text-xl font-extrabold text-[#111110] mt-1 font-display">
                  Ficha Técnica &amp; Composição dos Equipamentos
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#666660] hover:text-[#111110] hover:bg-black/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#333330]">
              <div className="bg-[#f8f8f8] p-4 rounded-2xl space-y-2">
                <span className="font-bold text-[#111110] uppercase tracking-wider text-[11px] block">
                  Composição do Tecido
                </span>
                <p>• 88% Poliéster Reciclado High-Density</p>
                <p>• 12% Microfibra de Algodão Tecnológico</p>
                <p>• Gramagem: 180 g/m² (Média-Leve)</p>
                <p>• Trama em Micro-Mesh Respirável</p>
              </div>

              <div className="bg-[#f8f8f8] p-4 rounded-2xl space-y-2">
                <span className="font-bold text-[#111110] uppercase tracking-wider text-[11px] block">
                  Acabamentos e Estampagem
                </span>
                <p>• Escudo: Bordado HD Acetinado em Alto Relevo</p>
                <p>• Logótipo Guisport: Vinil Técnico Termocolado</p>
                <p>• Pormenores Culturais: Sublimação Digital de Alta Definição</p>
                <p>• Gola e Punhos: Rib de Alta Elasticidade</p>
              </div>
            </div>

            <div className="bg-[#f8f8f8] p-4 rounded-2xl space-y-2 text-xs">
              <span className="font-bold text-[#111110] uppercase tracking-wider text-[11px] block">
                Instruções de Lavagem e Manutenção
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-1 font-semibold text-[#555550]">
                <div className="bg-white p-2 rounded-xl">Lavar máq. máx 30ºC</div>
                <div className="bg-white p-2 rounded-xl">Não usar lixívia</div>
                <div className="bg-white p-2 rounded-xl">Passar a ferro do avesso</div>
                <div className="bg-white p-2 rounded-xl">Não limpar a seco</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#25D366]/10 text-xs text-[#188B46] font-medium flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <span>Garantia de Autenticidade Guisport Oficial · Seleção Nacional da Guiné-Bissau</span>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#111110] text-white font-bold cursor-pointer hover:bg-[#222220]"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
