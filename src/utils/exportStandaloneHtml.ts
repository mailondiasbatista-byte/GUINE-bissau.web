import { EDITORIAL_CAMPAIGN_IMAGE, PRODUCTS, WHATSAPP_NUMBERS } from '../data/products';

const FLAG_BG_IMAGE = '/assets/aistudio/image_e0fa2f06.png';

async function assetUrlToDataUri(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return url;
  }
}

export async function downloadStandaloneHtml(): Promise<void> {
  const embeddedProducts = await Promise.all(
    PRODUCTS.map(async (item) => ({
      ...item,
      frontImage: await assetUrlToDataUri(item.frontImage),
      backImage: await assetUrlToDataUri(item.backImage),
    }))
  );
  const embeddedEditorial = await assetUrlToDataUri(EDITORIAL_CAMPAIGN_IMAGE);
  const embeddedFlag = await assetUrlToDataUri(FLAG_BG_IMAGE);

  const htmlContent = `<!doctype html>
<html lang="pt" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LOJA DJURTUS MARROCOS — Camisolas Oficiais da Guiné-Bissau</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet" />
  <style>
    body { font-family: 'DM Sans', sans-serif; background: #F4F4F2; color: #171717; }
    h1, h2, h3, .font-display { font-family: 'Plus Jakarta Sans', sans-serif; }
    .font-mono-num { font-family: 'JetBrains Mono', monospace; font-variant-numeric: tabular-nums; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  </style>
</head>
<body class="bg-[#F4F4F2] text-[#171717] antialiased relative overflow-x-hidden">
  <!-- Fundo Oficial com a Bandeira da Guiné-Bissau -->
  <div class="fixed inset-0 pointer-events-none z-0">
    <img src="${embeddedFlag}" alt="Bandeira da Guiné-Bissau" class="w-full h-full object-cover opacity-40 filter saturate-110" />
    <div class="absolute inset-0 bg-gradient-to-b from-[#F4F4F2]/80 via-[#F4F4F2]/70 to-[#F4F4F2]/90 backdrop-blur-[1px]"></div>
  </div>

  <!-- Barra de Contacto Oficial WhatsApp -->
  <div class="relative z-40 bg-[#18392B] text-white py-1.5 px-4 text-center text-xs font-medium flex items-center justify-center gap-3">
    <span class="font-bold text-[#DDAA28]">🇲🇦 LOJA DJURTUS MARROCOS 🇬🇼</span>
    <span class="hidden sm:inline">|</span>
    <span>WhatsApp: <a href="https://wa.me/212690701620" target="_blank" class="underline font-bold text-white">+212-690701620</a> ou <a href="https://wa.me/212603530015" target="_blank" class="underline font-bold text-white">+212 603-530015</a></span>
  </div>

  <header class="sticky top-0 z-40 bg-[#F4F4F2]/92 backdrop-blur-md border-b border-black/8">
    <div class="max-w-[1320px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
      <a href="#top" class="font-display text-sm font-extrabold tracking-tight whitespace-nowrap text-[#171717]">
        <span class="text-[#8C2227]">LOJA DJURTUS</span> <span class="bg-[#171717] text-white px-2 py-0.5 rounded-full text-xs">MARROCOS</span>
      </a>
      <nav class="flex items-center gap-7 text-xs font-semibold text-[#40403C]">
        <a href="#top" class="hover:text-[#171717] transition-colors">Início</a>
        <a href="#catalog" class="hover:text-[#171717] transition-colors">Camisolas</a>
        <a href="#contact" class="hover:text-[#171717] transition-colors">WhatsApp</a>
      </nav>
      <a href="https://wa.me/212690701620?text=Ol%C3%A1%20Loja%20Djurtus!%20Gostaria%20de%20encomendar%20uma%20camisola." target="_blank" class="px-4 py-2 rounded-full bg-[#25D366] text-white text-xs font-bold hover:bg-[#1EBE5D] transition-colors whitespace-nowrap shadow-xs">
        Pedir no WhatsApp
      </a>
    </div>
  </header>

  <main id="top" class="relative z-10">
    <section class="pt-8 pb-12">
      <p class="text-center text-xs tracking-widest text-[#171717] font-bold uppercase mb-8">
        OFICIAIS: 250 MAD <span class="mx-2 text-[#8C2227]">★</span> SIMPLES: 230 MAD <span class="mx-2 text-[#8C2227]">★</span> FATOS &amp; CACHECÓIS
      </p>
      <div class="relative w-full overflow-hidden">
        <div class="absolute left-0 right-0 top-[28px] h-[6px] z-10 bg-gradient-to-b from-[#E4E4E1] via-[#A3A39E] to-[#6F6F6A] shadow"></div>
        <div id="rack-list" class="max-w-[1380px] mx-auto px-6 flex items-start justify-start md:justify-center gap-4 overflow-x-auto no-scrollbar pt-[20px] pb-6"></div>
      </div>
      <div class="max-w-xl mx-auto px-6 mt-6 text-center">
        <h1 id="rack-title" class="text-xl font-bold"></h1>
        <p id="rack-price" class="text-sm font-bold text-[#8C2227] mt-1 font-mono-num"></p>
        <div class="mt-5 flex justify-center gap-3">
          <a href="#detail" class="px-6 py-2.5 rounded-full border border-black/20 bg-white font-semibold text-xs hover:bg-[#171717] hover:text-white transition-colors">Ver Detalhes</a>
          <button id="btn-quick-wa" class="px-6 py-2.5 rounded-full bg-[#25D366] text-white font-bold text-xs hover:bg-[#1EBE5D] transition-colors shadow-xs">Pedir no WhatsApp</button>
        </div>
      </div>
    </section>

    <section id="detail" class="py-14 border-t border-black/10 max-w-[920px] mx-auto px-6 text-center">
      <div id="detail-media" class="max-w-[420px] mx-auto aspect-[3/4] flex items-center justify-center bg-white/50 rounded-xl p-2 shadow-xs border border-black/5"></div>
      <p id="detail-index" class="mt-4 text-xs font-mono-num text-[#7A7A75] font-semibold"></p>
      <h2 id="detail-title" class="mt-1 text-2xl font-bold"></h2>
      <p id="detail-sub" class="mt-1 text-sm font-semibold text-[#545450]"></p>
      <div class="mt-4 inline-flex gap-6">
        <button id="btn-front" class="pb-1.5 text-xs font-bold border-b-2 border-[#18392B]">Frente</button>
        <button id="btn-back" class="pb-1.5 text-xs font-bold text-[#8A8A84] border-b-2 border-transparent">Costas</button>
      </div>
      <div class="max-w-[540px] mx-auto mt-6 pt-6 border-t border-black/10">
        <p id="detail-story" class="text-xs text-[#3E3E3A] leading-relaxed"></p>
        <p id="detail-price-big" class="text-2xl font-extrabold text-[#8C2227] font-mono-num mt-3"></p>
        <button id="detail-wa-btn" class="mt-5 px-8 py-3.5 rounded-xl bg-[#25D366] text-white text-sm font-bold hover:bg-[#1EBE5D] transition-colors shadow-md">
          Encomendar no WhatsApp Oficial
        </button>
      </div>
    </section>

    <footer id="contact" class="border-t border-black/10 py-12 px-6 text-center text-xs text-[#52524E] bg-white/80 backdrop-blur-md">
      <p class="font-display font-bold text-base text-[#171717]">LOJA DJURTUS MARROCOS</p>
      <p class="mt-1 font-semibold text-[#18392B]">Djurtus Sempre Juntos! · Camisolas Oficiais Disponíveis em Marrocos</p>
      <p class="mt-2 text-xs">WhatsApp: +212-690701620 | +212 603-530015</p>
    </footer>
  </main>

  <script>
    const PRODUCTS = ${JSON.stringify(embeddedProducts)};
    let activeIdx = 0;
    let view = 'front';

    function render() {
      const p = PRODUCTS[activeIdx];
      const rack = document.getElementById('rack-list');
      rack.innerHTML = PRODUCTS.map((item, i) => {
        const selected = i === activeIdx;
        const badge = item.rackBadge ? \`<span class="absolute left-1/2 -translate-x-1/2 top-[56px] z-20 px-2 py-0.5 text-[9px] font-bold tracking-wider -rotate-2 \${item.rackBadge.tone === 'DARK' ? 'bg-[#8C2227] text-white' : 'bg-[#DDAA28] text-black'}">\${item.rackBadge.label}</span>\` : '';
        return \`<button onclick="selectItem(\${i})" class="relative shrink-0 transition-all duration-200 \${selected ? 'w-[240px] opacity-100' : 'w-[168px] opacity-85 hover:opacity-100'}">
          <div class="pt-2 pb-3 px-2 rounded-xs \${selected ? 'border-2 border-[#18392B] bg-white/70 shadow-sm scale-100' : 'scale-x-[0.78] scale-y-[0.94]'}">
            \${badge}
            <div class="aspect-[3/4] flex items-center justify-center">
              <img src="\${item.frontImage}" alt="\${item.name}" class="w-full h-full object-contain mix-blend-multiply drop-shadow-xs" />
            </div>
          </div>
        </button>\`;
      }).join('');

      document.getElementById('rack-title').textContent = p.name;
      document.getElementById('rack-price').textContent = p.colorway + ' · ' + p.priceMAD + ' MAD';
      document.getElementById('detail-index').textContent = p.indexLabel;
      document.getElementById('detail-title').textContent = p.name;
      document.getElementById('detail-sub').textContent = p.subtitle;
      document.getElementById('detail-story').textContent = p.heritageStory;
      document.getElementById('detail-price-big').textContent = p.priceMAD + ' MAD';

      const media = document.getElementById('detail-media');
      if (view === 'front') {
        media.innerHTML = \`<img src="\${p.frontImage}" alt="\${p.name}" class="w-full h-full object-contain mix-blend-multiply drop-shadow-xs" />\`;
      } else {
        media.innerHTML = \`<div class="w-full h-full flex flex-col items-center justify-center rounded-xl p-8" style="background:\${p.backSpec.baseHex};color:#EAE6DA">
          <p class="text-[10px] tracking-[0.25em] opacity-80 font-bold">\${p.backSpec.napeMark}</p>
          <p class="mt-4 text-xl font-extrabold tracking-[0.2em]">\${p.backSpec.dorsalHeadline}</p>
          \${p.backSpec.dorsalNumber ? \`<p class="text-6xl font-black mt-2">\${p.backSpec.dorsalNumber}</p>\` : ''}
          <p class="mt-4 text-[10px] tracking-[0.18em] opacity-80">\${p.backSpec.dorsalSubtext}</p>
        </div>\`;
      }

      document.getElementById('btn-front').className = view === 'front' ? 'pb-1.5 text-xs font-bold border-b-2 border-[#18392B]' : 'pb-1.5 text-xs font-bold text-[#8A8A84] border-b-2 border-transparent';
      document.getElementById('btn-back').className = view === 'back' ? 'pb-1.5 text-xs font-bold border-b-2 border-[#18392B]' : 'pb-1.5 text-xs font-bold text-[#8A8A84] border-b-2 border-transparent';

      const waMsg = encodeURIComponent('Olá Loja Djurtus Marrocos! Gostaria de encomendar a ' + p.name + ' (' + p.priceMAD + ' MAD). Por favor confirmem disponibilidade para entrega em Marrocos.');
      document.getElementById('btn-quick-wa').onclick = function() {
        window.open('https://wa.me/212690701620?text=' + waMsg, '_blank');
      };
      document.getElementById('detail-wa-btn').onclick = function() {
        window.open('https://wa.me/212690701620?text=' + waMsg, '_blank');
      };
    }

    window.selectItem = function(i) { activeIdx = i; render(); };
    document.getElementById('btn-front').onclick = function() { view = 'front'; render(); };
    document.getElementById('btn-back').onclick = function() { view = 'back'; render(); };

    render();
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'index.html';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
