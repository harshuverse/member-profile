interface AscentLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showMotto?: boolean;
  className?: string;
}

export function AscentLogo({ size = 'md', showMotto = false, className = '' }: AscentLogoProps) {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Sleek rounded square brand mark inspired by the reference image logo */}
      <div
        className={`relative flex items-center justify-center rounded-xl p-2 bg-[#0C0D0E] border border-[#26282A] shadow-md group hover:border-[#D4A373]/60 transition-colors duration-300 ${iconSizes[size]}`}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Base structural facet */}
          <path
            d="M24 4L7 38H18L24 24L30 38H41L24 4Z"
            fill="#1E2022"
            stroke="#383C3D"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Ascending dynamic vector in brand copper gold #D4A373 */}
          <path
            d="M24 8L12 34H20L24 24L28 34H36L24 8Z"
            fill="#D4A373"
            className="transition-opacity group-hover:opacity-90"
          />
          {/* Central elevation core */}
          <path
            d="M24 16L18 29H30L24 16Z"
            fill="#000000"
            stroke="#D4A373"
            strokeWidth="1"
          />
          {/* Upward chevron beacon accent */}
          <path
            d="M24 21L21 27H27L24 21Z"
            fill="#D4A373"
          />
        </svg>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <span
            className={`font-heading font-extrabold tracking-tight text-white ${textSizes[size]}`}
          >
            Ascent
          </span>
          <span className="text-[10px] font-subheading font-medium tracking-wider px-2 py-0.5 rounded-full bg-[#141517] text-[#D4A373] border border-[#D4A373]/30">
            TECH CLUB
          </span>
        </div>
        {showMotto && (
          <p className="text-xs font-subheading text-[#8E9296] tracking-normal mt-0.5">
            Fueling ideas, shaping futures
          </p>
        )}
      </div>
    </div>
  );
}
