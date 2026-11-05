import React from 'react';
import { GarmentSilhouette, ProductItem } from '../data/products';

interface GarmentBackViewProps {
  product: ProductItem;
}

export const GarmentBackView: React.FC<GarmentBackViewProps> = ({ product }) => {
  const { silhouette } = product;
  const isLightGarment = silhouette === GarmentSilhouette.JACKET;
  const inkColor = isLightGarment ? '#111110' : '#EAE6DA';
  const baseHex = isLightGarment ? '#18392B' : '#111110';
  const secondaryHex = isLightGarment ? '#11251c' : '#222220';

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none px-4 bg-[#EFEFEF]">
      <svg
        viewBox="0 0 420 520"
        className="w-full h-full max-h-[440px]"
        role="img"
        aria-label={`${product.name} — Vista de Costas`}
      >
        <defs>
          <linearGradient id={`fabric-${product.id}`} x1="0" y1="0" x2="0.2" y2="1">
            <stop offset="0%" stopColor={baseHex} />
            <stop offset="100%" stopColor={secondaryHex} />
          </linearGradient>
        </defs>

        {/* Cabide metálico */}
        <line x1="210" y1="12" x2="210" y2="78" stroke="#888880" strokeWidth="2.5" strokeLinecap="round" />
        <path
          d="M148 112 C165 92, 190 78, 210 78 C230 78, 255 92, 272 112 L262 119 C245 104, 226 95, 210 95 C194 95, 175 104, 158 119 Z"
          fill="#4A2E1B"
        />

        {/* Silhueta da peça */}
        <path
          d="M118 134 L64 258 L102 274 L128 214 L128 444 L292 444 L292 214 L318 274 L356 258 L302 134 C278 118, 246 112, 210 112 C174 112, 142 118, 118 134 Z"
          fill={`url(#fabric-${product.id})`}
        />

        <text
          x="210"
          y="204"
          textAnchor="middle"
          fill={inkColor}
          fontSize="14"
          fontWeight="700"
          letterSpacing="3.5"
        >
          GUINÉ-BISSAU
        </text>

        <text
          x="210"
          y="228"
          textAnchor="middle"
          fill={inkColor}
          fontSize="8"
          fontWeight="500"
          letterSpacing="2"
          opacity="0.8"
        >
          SELEÇÃO NACIONAL · GUISPORT
        </text>
      </svg>

      <p className="mt-1 text-[11px] text-[#666660] text-center font-medium">
        Vista de costas original e limpa
      </p>
    </div>
  );
};
