import React, { useState } from 'react';

export interface IndustryPartner {
  id: string;
  name: string;
  category: string;
  driveId: string;
  imageUrl: string;
  fallbackText: string;
}

export const INDUSTRY_PARTNERS: IndustryPartner[] = [
  {
    id: 'amaia',
    name: 'AMAIA',
    category: 'Residential Development',
    driveId: '1FpSHoVzesN97Q9Tk5tXNHyfiQyme2Gc8',
    imageUrl: 'https://lh3.googleusercontent.com/d/1FpSHoVzesN97Q9Tk5tXNHyfiQyme2Gc8',
    fallbackText: 'AMAIA',
  },
  {
    id: 'camella',
    name: 'CAMELLA',
    category: 'Housing & Communities',
    driveId: '1V1Sct64IlBB-F7vV-rx2rf2wARzwjkk0',
    imageUrl: 'https://lh3.googleusercontent.com/d/1V1Sct64IlBB-F7vV-rx2rf2wARzwjkk0',
    fallbackText: 'CAMELLA',
  },
  {
    id: 'cod',
    name: 'CITY OF DREAMS',
    category: 'Commercial & Hospitality',
    driveId: '1aWWCAXu3LuvP6pqlW5_QlAA54xuo14nK',
    imageUrl: 'https://lh3.googleusercontent.com/d/1aWWCAXu3LuvP6pqlW5_QlAA54xuo14nK',
    fallbackText: 'CITY OF DREAMS',
  },
  {
    id: 'delasalle',
    name: 'DE LA SALLE',
    category: 'Institutional & Campus',
    driveId: '1b-OAQh-yH9yYA8yrInng0qT8bm7hT43p',
    imageUrl: 'https://lh3.googleusercontent.com/d/1b-OAQh-yH9yYA8yrInng0qT8bm7hT43p',
    fallbackText: 'DE LA SALLE',
  },
  {
    id: 'idesia',
    name: 'IDESIA',
    category: 'Masterplanned Estates',
    driveId: '1S5HpXJ_k-cPyGPIQrH9WIzuQeAlS1tNQ',
    imageUrl: 'https://lh3.googleusercontent.com/d/1S5HpXJ_k-cPyGPIQrH9WIzuQeAlS1tNQ',
    fallbackText: 'IDESIA',
  },
  {
    id: 'ptc',
    name: 'PTC',
    category: 'Industrial & Technology',
    driveId: '1_Vml0yKsL_oDeQDFu_Wgj9YnWb0_jggT',
    imageUrl: 'https://lh3.googleusercontent.com/d/1_Vml0yKsL_oDeQDFu_Wgj9YnWb0_jggT',
    fallbackText: 'PTC',
  },
  {
    id: 'ridgecrest',
    name: 'RIDGE CREST',
    category: 'Townhomes & Communities',
    driveId: '1RbehfiIh3MNz4UU34FsU4fBm99IfY_fB',
    imageUrl: 'https://lh3.googleusercontent.com/d/1RbehfiIh3MNz4UU34FsU4fBm99IfY_fB',
    fallbackText: 'RIDGE CREST',
  },
  {
    id: 'sm',
    name: 'SM',
    category: 'Retail & Commercial',
    driveId: '1OBFOtuad0V8z_1WDMfWbW60M6pMkCu1j',
    imageUrl: 'https://lh3.googleusercontent.com/d/1OBFOtuad0V8z_1WDMfWbW60M6pMkCu1j',
    fallbackText: 'SM',
  },
  {
    id: 'smd',
    name: 'SMDC',
    category: 'Urban Residences',
    driveId: '1DPqHHo54Q36cmba16Yj9NDRt-djOnAAa',
    imageUrl: 'https://lh3.googleusercontent.com/d/1DPqHHo54Q36cmba16Yj9NDRt-djOnAAa',
    fallbackText: 'SMDC',
  },
  {
    id: 'vistaland',
    name: 'VISTA LAND',
    category: 'Integrated Developments',
    driveId: '19XGMt7HH4Z8AOUP5IWSfsQzIFoY8kWmF',
    imageUrl: 'https://lh3.googleusercontent.com/d/19XGMt7HH4Z8AOUP5IWSfsQzIFoY8kWmF',
    fallbackText: 'VISTA LAND',
  },
];

const PartnerLogoItem: React.FC<{ partner: IndustryPartner }> = ({ partner }) => {
  const [imgSrc, setImgSrc] = useState<string>(partner.imageUrl);
  const [hasError, setHasError] = useState<boolean>(false);

  const handleError = () => {
    if (imgSrc.includes('lh3.googleusercontent.com')) {
      // Try high-resolution thumbnail format
      setImgSrc(`https://drive.google.com/thumbnail?id=${partner.driveId}&sz=w1000`);
    } else if (imgSrc.includes('thumbnail')) {
      // Try direct UC view
      setImgSrc(`https://drive.google.com/uc?export=view&id=${partner.driveId}`);
    } else {
      setHasError(true);
    }
  };

  return (
    <div
      className="shrink-0 flex items-center justify-center opacity-90 hover:opacity-100 transition-all duration-300 cursor-pointer h-18 sm:h-[92px] lg:h-[102px] px-3 sm:px-5"
      title={`${partner.name} - ${partner.category}`}
    >
      {!hasError ? (
        <img
          src={imgSrc}
          alt={partner.name}
          className="h-[55px] sm:h-[74px] lg:h-[92px] max-w-[207px] sm:max-w-[276px] lg:max-w-[333px] w-auto object-contain mix-blend-multiply filter contrast-125"
          referrerPolicy="no-referrer"
          onError={handleError}
        />
      ) : (
        <span className="font-display font-black text-xl sm:text-2xl lg:text-[1.75rem] text-zinc-800 tracking-wider uppercase">
          {partner.fallbackText}
        </span>
      )}
    </div>
  );
};

export const PartnerLogosCarousel: React.FC = () => {
  // Duplicating array for continuous, smooth infinite looping across wide viewports
  const duplicatedPartners = [...INDUSTRY_PARTNERS, ...INDUSTRY_PARTNERS, ...INDUSTRY_PARTNERS];

  return (
    <section className="bg-[#F4F4F6] border-y border-zinc-200/90 py-7 sm:py-10 relative overflow-hidden select-none w-full">
      {/* Centered Uppercase Subtitle */}
      <div className="text-center mb-5 sm:mb-7 px-4">
        <p className="font-mono text-[11px] sm:text-xs font-bold text-zinc-500 uppercase tracking-[0.25em]">
          TOP INDUSTRY PARTNERS
        </p>
      </div>

      {/* Full Bleed Edge-to-Edge Marquee Wrapper */}
      <div className="relative w-full overflow-hidden flex items-center">
        
        {/* Left/Right Subtle Gradient Vignettes */}
        <div className="absolute left-0 top-0 bottom-0 w-9 sm:w-18 bg-gradient-to-r from-[#F4F4F6] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-9 sm:w-18 bg-gradient-to-l from-[#F4F4F6] to-transparent z-10 pointer-events-none" />

        {/* Continuous Automatic Right-to-Left Marquee Track (Full Width) */}
        <div className="flex items-center gap-9 sm:gap-13 lg:gap-16 w-max shrink-0 animate-marquee-scroll">
          {duplicatedPartners.map((partner, index) => (
            <PartnerLogoItem key={`${partner.id}-${index}`} partner={partner} />
          ))}
        </div>

      </div>
    </section>
  );
};
