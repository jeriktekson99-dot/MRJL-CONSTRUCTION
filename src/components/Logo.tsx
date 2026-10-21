import React, { useState, useEffect } from 'react';
import { convertDriveUrlToDirectImage, convertDriveUrlToFallbackImage } from '../utils/driveUtils';

export const DEFAULT_NAV_LOGO = 'https://cdn.phototourl.com/member/2026-10-21-8789a8b4-f948-48af-9b7f-f8d183cea43b.png';
export const DEFAULT_FOOTER_LOGO = 'https://cdn.phototourl.com/member/2026-10-21-8789a8b4-f948-48af-9b7f-f8d183cea43b.png';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
  showSubtitle?: boolean;
  customLogoUrl?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  variant = 'light', 
  className = '', 
  showSubtitle = true,
  customLogoUrl 
}) => {
  const isDarkBg = variant === 'dark';
  const rawUrl = customLogoUrl || (isDarkBg ? DEFAULT_FOOTER_LOGO : DEFAULT_NAV_LOGO);

  const primaryDirectUrl = convertDriveUrlToDirectImage(rawUrl);
  const fallbackDirectUrl = convertDriveUrlToFallbackImage(rawUrl);

  const [imgSrc, setImgSrc] = useState<string>(primaryDirectUrl);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const direct = convertDriveUrlToDirectImage(rawUrl);
    setImgSrc(direct);
    setHasError(false);
  }, [rawUrl]);

  const handleError = () => {
    if (imgSrc !== fallbackDirectUrl && fallbackDirectUrl) {
      setImgSrc(fallbackDirectUrl);
    } else {
      setHasError(true);
    }
  };

  return (
    <div className={`flex items-center gap-3.5 group cursor-pointer ${className}`}>
      {/* Raw image displayed directly without any surrounding background/bordered container */}
      {!hasError ? (
        <img 
          src={imgSrc} 
          alt="MRJL Construction Corporation Logo" 
          onError={handleError}
          className="h-10 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105 shrink-0"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="text-[#003399] font-black text-2xl font-display shrink-0">M</div>
      )}

      {/* Brand Text Titles */}
      <div className="flex flex-col leading-tight">
        <span className={`font-display text-lg sm:text-xl font-extrabold tracking-tight uppercase ${isDarkBg ? 'text-white' : 'text-zinc-900'}`}>
          MRJL
        </span>
        {showSubtitle && (
          <span className={`text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase ${isDarkBg ? 'text-zinc-400' : 'text-zinc-500'}`}>
            Construction Corp
          </span>
        )}
      </div>
    </div>
  );
};

