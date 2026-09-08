import React, { useState } from 'react';
import surendraAirOriginalLogo from '../assets/images/surendra_air_logo_1786618430078.jpg';

interface NitvtLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom';
  className?: string;
  showText?: boolean;
  textColor?: string;
  variant?: 'circle' | 'rounded' | 'badge' | 'flat';
}

export const NitvtLogo: React.FC<NitvtLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
  textColor = 'text-white',
  variant = 'rounded',
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    xs: 'w-8 h-8 text-xs',
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-xl',
    '2xl': 'w-32 h-32 text-2xl',
    custom: '',
  };

  const shapeClass =
    variant === 'circle'
      ? 'rounded-full aspect-square'
      : variant === 'badge'
      ? 'rounded-2xl shadow-lg ring-2 ring-red-500/40'
      : variant === 'flat'
      ? 'rounded-lg'
      : 'rounded-xl shadow-md ring-1.5 ring-red-500/30';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <div
        className={`relative ${sizeClasses[size]} shrink-0 ${shapeClass} overflow-hidden bg-white p-0.5 transition-transform duration-300 group-hover:scale-105 flex items-center justify-center`}
      >
        {!imgError ? (
          <img
            src={surendraAirOriginalLogo}
            alt="सुरेन्द्र ऐर (Surendra Air) Official Emblem"
            className="w-full h-full object-contain rounded-lg p-0.5"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="text-xs font-bold text-slate-400">NITVT</div>
        )}
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-black text-base tracking-tight ${textColor}`}>Surendra Air</span>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-800/60">
              Estd. 2064
            </span>
          </div>
          <span className="text-[11px] text-slate-300 font-medium line-clamp-1">
            Nepal Institute of Technical & Vocational Training (NITVT) Pvt. Ltd.
          </span>
          <span className="text-[9px] text-amber-400 font-semibold">ललितपुर, नेपाल</span>
        </div>
      )}
    </div>
  );
};

