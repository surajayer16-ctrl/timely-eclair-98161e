import React from 'react';

interface SymbolSvgProps {
  svgKey: string;
  variant: 'existing' | 'toInstall' | 'dismantled';
  className?: string;
  isLight?: boolean;
}

export const OutsideNetworkSymbolSvg: React.FC<SymbolSvgProps> = ({
  svgKey,
  variant,
  className = 'w-24 h-16',
  isLight = false,
}) => {
  const isDashed = variant === 'toInstall';
  const isDismantled = variant === 'dismantled';
  const strokeColor = isLight ? '#0f172a' : '#f8fafc';
  const textColor = isLight ? '#0f172a' : '#f8fafc';
  const slashColor = isLight ? '#0f172a' : '#f8fafc';
  const dashArray = isDashed ? '4,3' : undefined;

  // Render double parallel diagonal slashes for dismantled variant
  const renderDismantledSlashes = (
    x1: number = 24,
    y1: number = 42,
    x2: number = 44,
    y2: number = 6,
    gap: number = 6
  ) => {
    if (!isDismantled) return null;
    return (
      <g stroke={slashColor} strokeWidth="1.8" strokeLinecap="round">
        <line x1={x1 - gap / 2} y1={y1} x2={x2 - gap / 2} y2={y2} />
        <line x1={x1 + gap / 2} y1={y1} x2={x2 + gap / 2} y2={y2} />
      </g>
    );
  };

  const renderContent = () => {
    switch (svgKey) {
      case 'manual-exchange':
        return (
          <>
            <rect
              x="14"
              y="14"
              width="44"
              height="20"
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            {renderDismantledSlashes(28, 40, 44, 8, 7)}
          </>
        );

      case 'automatic-exchange':
        return (
          <>
            <rect
              x="14"
              y="14"
              width="44"
              height="20"
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            <line
              x1="14"
              y1="14"
              x2="58"
              y2="34"
              stroke={strokeColor}
              strokeWidth="1.6"
              strokeDasharray={dashArray}
            />
            <line
              x1="14"
              y1="34"
              x2="58"
              y2="14"
              stroke={strokeColor}
              strokeWidth="1.6"
              strokeDasharray={dashArray}
            />
            {renderDismantledSlashes(28, 40, 44, 8, 7)}
          </>
        );

      case 'private-branch-exchange':
        return (
          <>
            <rect
              x="12"
              y="13"
              width="48"
              height="22"
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            {/* Inner centered rectangle with X */}
            <rect
              x="22"
              y="17"
              width="28"
              height="14"
              fill="none"
              stroke={strokeColor}
              strokeWidth="1.5"
              strokeDasharray={dashArray}
            />
            <line
              x1="22"
              y1="17"
              x2="50"
              y2="31"
              stroke={strokeColor}
              strokeWidth="1.3"
              strokeDasharray={dashArray}
            />
            <line
              x1="22"
              y1="31"
              x2="50"
              y2="17"
              stroke={strokeColor}
              strokeWidth="1.3"
              strokeDasharray={dashArray}
            />
            {renderDismantledSlashes(28, 40, 44, 8, 7)}
          </>
        );

      case 'cabinet':
        return (
          <>
            {/* Umbrella dome canopy with flat base and post */}
            <path
              d="M 18,25 A 18,12 0 0,1 54,25 Z"
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            <line
              x1="36"
              y1="25"
              x2="36"
              y2="36"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            {renderDismantledSlashes(30, 40, 42, 10, 6)}
          </>
        );

      case 'dp':
        return (
          <>
            <circle
              cx="36"
              cy="24"
              r="12"
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            {renderDismantledSlashes(30, 40, 42, 8, 6)}
          </>
        );

      case 'pole':
        return (
          <>
            {/* Small circle / pole marker */}
            <circle
              cx="36"
              cy="24"
              r="5.5"
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            {isDismantled ? (
              <>
                <line
                  x1="18"
                  y1="40"
                  x2="54"
                  y2="8"
                  stroke={strokeColor}
                  strokeWidth="1.5"
                />
                {renderDismantledSlashes(30, 36, 42, 12, 5)}
              </>
            ) : null}
          </>
        );

      case 'cable-branch-joint':
        return (
          <>
            {/* Line branching into two */}
            <path
              d="M 8,24 L 28,24 L 38,14 L 64,14 M 28,24 L 38,34 L 64,34"
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            {renderDismantledSlashes(28, 40, 40, 8, 6)}
          </>
        );

      case 'straight-joint':
        return (
          <>
            <line
              x1="8"
              y1="24"
              x2="64"
              y2="24"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            <circle cx="36" cy="24" r="5" fill={strokeColor} />
            {renderDismantledSlashes(30, 40, 42, 8, 6)}
          </>
        );

      case 'man-hole':
        return (
          <>
            <rect
              x="16"
              y="14"
              width="40"
              height="20"
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            {renderDismantledSlashes(30, 40, 42, 8, 7)}
          </>
        );

      case 'hand-hole':
        return (
          <>
            <rect
              x="25"
              y="13"
              width="22"
              height="22"
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            {renderDismantledSlashes(30, 40, 42, 8, 6)}
          </>
        );

      case 'wall-dp':
        return (
          <>
            <circle
              cx="30"
              cy="24"
              r="10.5"
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            <text
              x="44"
              y="20"
              fill={textColor}
              fontSize="12"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              W
            </text>
            {renderDismantledSlashes(25, 38, 37, 10, 5)}
          </>
        );

      case 'internal-dp':
        return (
          <>
            <circle
              cx="30"
              cy="24"
              r="10.5"
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            <text
              x="45"
              y="20"
              fill={textColor}
              fontSize="12"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              I
            </text>
            {renderDismantledSlashes(25, 38, 37, 10, 5)}
          </>
        );

      case 'underground-dp':
        return (
          <>
            <circle
              cx="30"
              cy="24"
              r="10.5"
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            <text
              x="44"
              y="20"
              fill={textColor}
              fontSize="12"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              U
            </text>
            {renderDismantledSlashes(25, 38, 37, 10, 5)}
          </>
        );

      case 'pole-with-stay':
        return (
          <>
            <circle
              cx="20"
              cy="24"
              r="6.5"
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            <line
              x1="26.5"
              y1="24"
              x2="50"
              y2="24"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            <polygon
              points="53,24 46,20 46,28"
              fill={strokeColor}
            />
            {renderDismantledSlashes(30, 40, 42, 8, 6)}
          </>
        );

      case 'pole-with-strut':
        return (
          <>
            <circle
              cx="20"
              cy="24"
              r="6.5"
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            <line
              x1="26.5"
              y1="24"
              x2="48"
              y2="24"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            <line
              x1="48"
              y1="16"
              x2="48"
              y2="32"
              stroke={strokeColor}
              strokeWidth="2.5"
              strokeDasharray={dashArray}
            />
            {renderDismantledSlashes(28, 40, 40, 8, 6)}
          </>
        );

      case 'pole-with-flying-stay':
        return (
          <>
            <circle
              cx="20"
              cy="24"
              r="6.5"
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            <line
              x1="26.5"
              y1="24"
              x2="44"
              y2="24"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            {/* T-bracket */}
            <line
              x1="44"
              y1="16"
              x2="44"
              y2="32"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            <line
              x1="44"
              y1="24"
              x2="54"
              y2="24"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            {renderDismantledSlashes(28, 40, 40, 8, 6)}
          </>
        );

      case 'exchange-area-boundary':
        return (
          <>
            <line
              x1="6"
              y1="24"
              x2="26"
              y2="24"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            {/* 3 dots */}
            <circle cx="31" cy="24" r="2.2" fill={strokeColor} />
            <circle cx="36" cy="24" r="2.2" fill={strokeColor} />
            <circle cx="41" cy="24" r="2.2" fill={strokeColor} />
            <line
              x1="46"
              y1="24"
              x2="66"
              y2="24"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            {renderDismantledSlashes(30, 40, 42, 8, 6)}
          </>
        );

      case 'cabinet-area-boundary':
        return (
          <>
            <line
              x1="6"
              y1="24"
              x2="28"
              y2="24"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            {/* 2 dots */}
            <circle cx="33" cy="24" r="2.4" fill={strokeColor} />
            <circle cx="39" cy="24" r="2.4" fill={strokeColor} />
            <line
              x1="44"
              y1="24"
              x2="66"
              y2="24"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            {renderDismantledSlashes(30, 40, 42, 8, 6)}
          </>
        );

      case 'cabinet-with-numbers':
        return (
          <>
            <path
              d="M 14,26 A 15,11 0 0,1 42,26 Z"
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            <line
              x1="28"
              y1="26"
              x2="28"
              y2="36"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            {/* Numbers 41 / 05 */}
            <text
              x="46"
              y="20"
              fill={textColor}
              fontSize="11"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              41
            </text>
            <text
              x="46"
              y="32"
              fill={textColor}
              fontSize="11"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              05
            </text>
            {renderDismantledSlashes(24, 40, 36, 10, 6)}
          </>
        );

      case 'pole-75m':
        return (
          <>
            <circle
              cx="26"
              cy="25"
              r="6.5"
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            <text
              x="36"
              y="18"
              fill={textColor}
              fontSize="11"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              7.5
            </text>
            {renderDismantledSlashes(22, 38, 34, 10, 5)}
          </>
        );

      case 'pole-type-dp':
        return (
          <>
            <text
              x="10"
              y="19"
              fill={textColor}
              fontSize="11"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              05
            </text>
            <text
              x="10"
              y="32"
              fill={textColor}
              fontSize="11"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              06
            </text>
            <circle
              cx="38"
              cy="24"
              r="10.5"
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            {renderDismantledSlashes(32, 40, 44, 8, 6)}
          </>
        );

      case 'wall-dp-numbered':
        return (
          <>
            <text
              x="8"
              y="19"
              fill={textColor}
              fontSize="11"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              05
            </text>
            <text
              x="8"
              y="32"
              fill={textColor}
              fontSize="11"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              06
            </text>
            <circle
              cx="34"
              cy="24"
              r="10.5"
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            <text
              x="47"
              y="20"
              fill={textColor}
              fontSize="11"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              W
            </text>
            {renderDismantledSlashes(28, 40, 40, 8, 6)}
          </>
        );

      case 'internal-dp-numbered':
        return (
          <>
            <text
              x="8"
              y="19"
              fill={textColor}
              fontSize="11"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              05
            </text>
            <text
              x="8"
              y="32"
              fill={textColor}
              fontSize="11"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              06
            </text>
            <circle
              cx="34"
              cy="24"
              r="10.5"
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            <text
              x="48"
              y="20"
              fill={textColor}
              fontSize="11"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              I
            </text>
            {renderDismantledSlashes(28, 40, 40, 8, 6)}
          </>
        );

      case 'underground-dp-numbered':
        return (
          <>
            <text
              x="8"
              y="19"
              fill={textColor}
              fontSize="11"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              05
            </text>
            <text
              x="8"
              y="32"
              fill={textColor}
              fontSize="11"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              06
            </text>
            <circle
              cx="34"
              cy="24"
              r="10.5"
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            <text
              x="47"
              y="20"
              fill={textColor}
              fontSize="11"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              U
            </text>
            {renderDismantledSlashes(28, 40, 40, 8, 6)}
          </>
        );

      case 'dp-with-protective-device':
        return (
          <>
            <text
              x="8"
              y="20"
              fill={textColor}
              fontSize="11"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              05
            </text>
            <text
              x="8"
              y="33"
              fill={textColor}
              fontSize="11"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              06
            </text>
            {/* Circle */}
            <circle
              cx="34"
              cy="26"
              r="9.5"
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            {/* Top antenna / fork horns */}
            <line
              x1="34"
              y1="16.5"
              x2="34"
              y2="12"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            <line
              x1="34"
              y1="12"
              x2="28"
              y2="6"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            <line
              x1="34"
              y1="12"
              x2="40"
              y2="6"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={dashArray}
            />
            {renderDismantledSlashes(28, 40, 40, 8, 6)}
          </>
        );

      case 'duct-route-with-manhole':
        return (
          <>
            {/* Manhole 003 */}
            <text
              x="13"
              y="11"
              fill={textColor}
              fontSize="9"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              003
            </text>
            <rect
              x="10"
              y="14"
              width="18"
              height="15"
              fill="none"
              stroke={strokeColor}
              strokeWidth="1.8"
              strokeDasharray={dashArray}
            />

            {/* Duct Route Lines with 220 and 4 (82) */}
            <line
              x1="28"
              y1="18"
              x2="47"
              y2="18"
              stroke={strokeColor}
              strokeWidth="1.6"
              strokeDasharray={dashArray}
            />
            <line
              x1="28"
              y1="25"
              x2="47"
              y2="25"
              stroke={strokeColor}
              strokeWidth="1.6"
              strokeDasharray={dashArray}
            />
            <text
              x="37.5"
              y="15"
              fill={textColor}
              fontSize="9"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              220
            </text>
            <text
              x="37.5"
              y="37"
              fill={textColor}
              fontSize="8"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              4 (82)
            </text>

            {/* Manhole 004 */}
            <text
              x="50"
              y="11"
              fill={textColor}
              fontSize="9"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              004
            </text>
            <rect
              x="47"
              y="14"
              width="18"
              height="15"
              fill="none"
              stroke={strokeColor}
              strokeWidth="1.8"
              strokeDasharray={dashArray}
            />

            {renderDismantledSlashes(22, 40, 48, 8, 7)}
          </>
        );

      default:
        return (
          <text
            x="36"
            y="26"
            fill={textColor}
            fontSize="12"
            textAnchor="middle"
          >
            {svgKey}
          </text>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 72 48"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      {renderContent()}
    </svg>
  );
};
