import React from 'react';

interface Props {
  svgKey: string;
  className?: string;
  isLight?: boolean;
}

export const ElectricalElectronicsSymbolSvg: React.FC<Props> = ({
  svgKey,
  className = 'w-24 h-16',
  isLight = false,
}) => {
  const strokeColor = isLight ? '#0f172a' : '#f8fafc';
  const fillColor = isLight ? '#0f172a' : '#f8fafc';
  const mutedText = isLight ? '#475569' : '#94a3b8';
  const accentColor = '#f59e0b'; // Amber 500

  const renderContent = () => {
    switch (svgKey) {
      // 1. Ground
      case 'ground':
        return (
          <g stroke={strokeColor} strokeWidth="2" strokeLinecap="round">
            <line x1="40" y1="8" x2="40" y2="28" />
            {/* 3 Decreasing horizontal lines */}
            <line x1="22" y1="28" x2="58" y2="28" strokeWidth="2.5" />
            <line x1="28" y1="36" x2="52" y2="36" strokeWidth="2.2" />
            <line x1="34" y1="44" x2="46" y2="44" strokeWidth="1.8" />
          </g>
        );

      // 2. Battery
      case 'battery':
        return (
          <g>
            <g stroke={strokeColor} strokeLinecap="round">
              <line x1="8" y1="26" x2="28" y2="26" strokeWidth="2" />
              {/* Long thin plate (+) */}
              <line x1="28" y1="10" x2="28" y2="42" strokeWidth="1.8" />
              {/* Short thicker plate (-) */}
              <line x1="36" y1="16" x2="36" y2="36" strokeWidth="4" />
              {/* Second pair */}
              <line x1="44" y1="10" x2="44" y2="42" strokeWidth="1.8" />
              <line x1="52" y1="16" x2="52" y2="36" strokeWidth="4" />
              <line x1="52" y1="26" x2="72" y2="26" strokeWidth="2" />
            </g>
            <text x="22" y="14" fill={accentColor} fontSize="9" fontWeight="bold" fontFamily="monospace">+</text>
            <text x="56" y="14" fill={mutedText} fontSize="9" fontWeight="bold" fontFamily="monospace">−</text>
            <text x="40" y="52" fill={mutedText} fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">12 V</text>
          </g>
        );

      // 3. DC Current Source
      case 'dc-current-source':
        return (
          <g>
            <g stroke={strokeColor} strokeWidth="2" strokeLinecap="round">
              <line x1="40" y1="4" x2="40" y2="14" />
              <circle cx="40" cy="28" r="14" fill="none" />
              <line x1="40" y1="42" x2="40" y2="52" />
              {/* Arrow pointing up */}
              <line x1="40" y1="36" x2="40" y2="20" strokeWidth="2.2" />
              <polygon points="40,16 36,22 44,22" fill={strokeColor} stroke="none" />
            </g>
            <text x="60" y="32" fill={mutedText} fontSize="8" fontWeight="bold" fontFamily="sans-serif">1 A</text>
          </g>
        );

      // 4. AC Voltage Source
      case 'ac-voltage-source':
        return (
          <g>
            <g stroke={strokeColor} strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="28" x2="26" y2="28" />
              <circle cx="40" cy="28" r="14" fill="none" />
              <line x1="54" y1="28" x2="68" y2="28" />
              {/* Sine Wave */}
              <path d="M 33 28 Q 36.5 22 40 28 T 47 28" fill="none" strokeWidth="2" />
            </g>
            <text x="32" y="20" fill={accentColor} fontSize="8" fontWeight="bold" fontFamily="monospace">+</text>
            <text x="45" y="39" fill={mutedText} fontSize="8" fontWeight="bold" fontFamily="monospace">−</text>
            <text x="40" y="52" fill={mutedText} fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">120 V/60 Hz/0°</text>
          </g>
        );

      // 5. AC Current Source
      case 'ac-current-source':
        return (
          <g>
            <g stroke={strokeColor} strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="28" x2="26" y2="28" />
              <circle cx="40" cy="28" r="14" fill="none" />
              <line x1="54" y1="28" x2="68" y2="28" />
              {/* Arrow with sine curve */}
              <line x1="33" y1="28" x2="47" y2="28" strokeWidth="2" />
              <polygon points="48,28 44,24 44,32" fill={strokeColor} stroke="none" />
              <path d="M 34 23 Q 37 19 40 23 T 46 23" fill="none" strokeWidth="1.5" />
            </g>
            <text x="40" y="52" fill={mutedText} fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">1 A/1 Hz/0°</text>
          </g>
        );

      // 6. Connector
      case 'connector-node':
        return (
          <g stroke={strokeColor} strokeLinecap="round">
            <line x1="10" y1="28" x2="70" y2="28" strokeWidth="2" />
            <circle cx="40" cy="28" r="5" fill={fillColor} stroke="none" />
          </g>
        );

      // 7. Resistor
      case 'resistor':
        return (
          <g>
            <path
              d="M 6 28 L 22 28 L 26 18 L 32 38 L 38 18 L 44 38 L 50 18 L 54 28 L 74 28"
              fill="none"
              stroke={strokeColor}
              strokeWidth="2.2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <text x="40" y="14" fill={mutedText} fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">1 k Ohm</text>
          </g>
        );

      // 8. Capacitor
      case 'capacitor':
        return (
          <g>
            <g stroke={strokeColor} strokeWidth="2" strokeLinecap="round">
              <line x1="8" y1="28" x2="35" y2="28" />
              <line x1="35" y1="12" x2="35" y2="44" strokeWidth="2.5" />
              <line x1="45" y1="12" x2="45" y2="44" strokeWidth="2.5" />
              <line x1="45" y1="28" x2="72" y2="28" />
            </g>
            <text x="40" y="10" fill={mutedText} fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">1 uF</text>
          </g>
        );

      // 9. Inductor
      case 'inductor':
        return (
          <g>
            <g stroke={strokeColor} strokeWidth="2" fill="none" strokeLinecap="round">
              <line x1="6" y1="32" x2="18" y2="32" />
              <path d="M 18 32 A 6 6 0 0 1 30 32" />
              <path d="M 30 32 A 6 6 0 0 1 42 32" />
              <path d="M 42 32 A 6 6 0 0 1 54 32" />
              <path d="M 54 32 A 6 6 0 0 1 66 32" />
              <line x1="66" y1="32" x2="74" y2="32" />
            </g>
            <text x="42" y="18" fill={mutedText} fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">1 mH</text>
          </g>
        );

      // 10. Transformer
      case 'transformer':
        return (
          <g>
            <g stroke={strokeColor} strokeWidth="2" fill="none" strokeLinecap="round">
              {/* Primary coil */}
              <line x1="12" y1="12" x2="26" y2="12" />
              <path d="M 26 12 A 5 5 0 0 1 26 22" />
              <path d="M 26 22 A 5 5 0 0 1 26 32" />
              <path d="M 26 32 A 5 5 0 0 1 26 42" />
              <line x1="26" y1="42" x2="12" y2="42" />

              {/* Core lines */}
              <line x1="38" y1="8" x2="38" y2="46" strokeWidth="1.8" />
              <line x1="42" y1="8" x2="42" y2="46" strokeWidth="1.8" />

              {/* Secondary coil */}
              <line x1="68" y1="12" x2="54" y2="12" />
              <path d="M 54 12 A 5 5 0 0 0 54 22" />
              <path d="M 54 22 A 5 5 0 0 0 54 32" />
              <path d="M 54 32 A 5 5 0 0 0 54 42" />
              <line x1="54" y1="42" x2="68" y2="42" />
            </g>
          </g>
        );

      // 11. Relay Switch
      case 'relay-switch':
        return (
          <g stroke={strokeColor} strokeLinecap="round">
            {/* Coil block */}
            <rect x="28" y="10" width="24" height="18" fill="none" strokeWidth="2" />
            <line x1="28" y1="28" x2="52" y2="10" strokeWidth="1.5" />
            <line x1="40" y1="4" x2="40" y2="10" strokeWidth="2" />
            <line x1="40" y1="28" x2="40" y2="34" strokeWidth="2" />

            {/* Switch Contacts */}
            <circle cx="30" cy="44" r="3" fill="none" strokeWidth="1.5" />
            <circle cx="50" cy="44" r="3" fill="none" strokeWidth="1.5" />
            <line x1="16" y1="44" x2="27" y2="44" strokeWidth="2" />
            <line x1="53" y1="44" x2="64" y2="44" strokeWidth="2" />
            <line x1="29" y1="42" x2="46" y2="36" strokeWidth="2" />
            <line x1="40" y1="34" x2="40" y2="38" strokeDasharray="2,2" strokeWidth="1.2" />
          </g>
        );

      // 12. Open Switch
      case 'open-switch':
        return (
          <g>
            {/* SPST Open Knife Switch (Top) */}
            <g stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round">
              <line x1="8" y1="18" x2="22" y2="18" />
              <circle cx="25" cy="18" r="3" fill="none" />
              <line x1="27" y1="16" x2="48" y2="8" strokeWidth="2.2" />
              <circle cx="52" cy="18" r="3" fill="none" />
              <line x1="55" y1="18" x2="72" y2="18" />
            </g>
            {/* Push button Open variant (Bottom) */}
            <g stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round">
              <line x1="14" y1="38" x2="30" y2="38" />
              <circle cx="33" cy="38" r="3" fill={fillColor} />
              {/* Raised bridge */}
              <polyline points="28,30 38,24 48,30" fill="none" strokeWidth="2" />
              <circle cx="47" cy="38" r="3" fill={fillColor} />
              <line x1="50" y1="38" x2="66" y2="38" />
            </g>
          </g>
        );

      // 13. Closed Switch
      case 'closed-switch':
        return (
          <g>
            {/* SPST Closed (Top) */}
            <g stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round">
              <line x1="10" y1="18" x2="24" y2="18" />
              <circle cx="27" cy="18" r="3" fill="none" />
              <line x1="27" y1="18" x2="51" y2="18" strokeWidth="2.4" />
              <circle cx="53" cy="18" r="3" fill="none" />
              <line x1="56" y1="18" x2="70" y2="18" />
            </g>
            {/* Push button closed (Bottom) */}
            <g stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round">
              <line x1="14" y1="38" x2="30" y2="38" />
              <circle cx="33" cy="38" r="3" fill={fillColor} />
              <polyline points="28,38 38,32 48,38" fill="none" strokeWidth="2" />
              <circle cx="47" cy="38" r="3" fill={fillColor} />
              <line x1="50" y1="38" x2="66" y2="38" />
            </g>
          </g>
        );

      // 14. Variable Resistor (Potentiometer)
      case 'variable-resistor':
        return (
          <g>
            <path
              d="M 6 28 L 22 28 L 26 20 L 32 36 L 38 20 L 44 36 L 50 20 L 54 28 L 74 28"
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Diagonal crossing arrow */}
            <line x1="22" y1="42" x2="56" y2="12" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
            <polygon points="58,10 50,13 55,18" fill={accentColor} stroke="none" />
            <text x="40" y="52" fill={mutedText} fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">[R]/1 k Ohm/50%</text>
          </g>
        );

      // 15. Polarized Capacitor
      case 'polarized-capacitor':
        return (
          <g>
            <g stroke={strokeColor} strokeWidth="2" strokeLinecap="round">
              <line x1="8" y1="28" x2="35" y2="28" />
              {/* Positive flat plate */}
              <line x1="35" y1="12" x2="35" y2="44" strokeWidth="2.5" />
              {/* Negative curved plate */}
              <path d="M 45 12 Q 41 28 45 44" fill="none" strokeWidth="2.5" />
              <line x1="43" y1="28" x2="72" y2="28" />
            </g>
            <text x="26" y="20" fill={accentColor} fontSize="10" fontWeight="bold" fontFamily="monospace">+</text>
            <text x="40" y="10" fill={mutedText} fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">1 uF</text>
          </g>
        );

      // 16. Variable Capacitor
      case 'variable-capacitor':
        return (
          <g>
            <g stroke={strokeColor} strokeWidth="2" strokeLinecap="round">
              <line x1="8" y1="28" x2="35" y2="28" />
              <line x1="35" y1="14" x2="35" y2="42" strokeWidth="2.5" />
              <line x1="45" y1="14" x2="45" y2="42" strokeWidth="2.5" />
              <line x1="45" y1="28" x2="72" y2="28" />
            </g>
            {/* Diagonal Arrow */}
            <line x1="24" y1="44" x2="56" y2="12" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
            <polygon points="58,10 50,13 55,18" fill={accentColor} stroke="none" />
            <text x="40" y="52" fill={mutedText} fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">[C]/10 uF/50%</text>
          </g>
        );

      // 17. Variable Inductor
      case 'variable-inductor':
        return (
          <g>
            <g stroke={strokeColor} strokeWidth="2" fill="none" strokeLinecap="round">
              <line x1="6" y1="32" x2="18" y2="32" />
              <path d="M 18 32 A 6 6 0 0 1 30 32" />
              <path d="M 30 32 A 6 6 0 0 1 42 32" />
              <path d="M 42 32 A 6 6 0 0 1 54 32" />
              <path d="M 54 32 A 6 6 0 0 1 66 32" />
              <line x1="66" y1="32" x2="74" y2="32" />
            </g>
            {/* Diagonal Arrow */}
            <line x1="22" y1="44" x2="58" y2="14" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
            <polygon points="60,12 52,15 57,20" fill={accentColor} stroke="none" />
            <text x="42" y="10" fill={mutedText} fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">[L]/10 mH/50%</text>
          </g>
        );

      // 18. P-N Diode
      case 'pn-diode':
        return (
          <g stroke={strokeColor} strokeLinecap="round">
            <line x1="10" y1="28" x2="30" y2="28" strokeWidth="2" />
            {/* Triangle (Anode) */}
            <polygon points="30,16 50,28 30,40" fill={fillColor} strokeWidth="1" />
            {/* Cathode bar */}
            <line x1="50" y1="14" x2="50" y2="42" strokeWidth="2.5" />
            <line x1="50" y1="28" x2="70" y2="28" strokeWidth="2" />
          </g>
        );

      // 19. Zener Diode
      case 'zener-diode':
        return (
          <g stroke={strokeColor} strokeLinecap="round">
            <line x1="10" y1="28" x2="30" y2="28" strokeWidth="2" />
            <polygon points="30,16 50,28 30,40" fill={fillColor} strokeWidth="1" />
            {/* Z-shaped Cathode bar */}
            <path d="M 45 14 L 50 14 L 50 42 L 55 42" fill="none" strokeWidth="2.5" />
            <line x1="50" y1="28" x2="70" y2="28" strokeWidth="2" />
          </g>
        );

      // 20. LED
      case 'led':
        return (
          <g stroke={strokeColor} strokeLinecap="round">
            <line x1="8" y1="28" x2="28" y2="28" strokeWidth="2" />
            <polygon points="28,16 46,28 28,40" fill={fillColor} strokeWidth="1" />
            <line x1="46" y1="14" x2="46" y2="42" strokeWidth="2.5" />
            <line x1="46" y1="28" x2="66" y2="28" strokeWidth="2" />
            {/* 2 Outward light rays */}
            <line x1="48" y1="16" x2="58" y2="8" stroke={accentColor} strokeWidth="1.8" />
            <polygon points="60,6 54,8 57,11" fill={accentColor} stroke="none" />
            <line x1="54" y1="22" x2="64" y2="14" stroke={accentColor} strokeWidth="1.8" />
            <polygon points="66,12 60,14 63,17" fill={accentColor} stroke="none" />
          </g>
        );

      // 21. Full Wave Bridge Rectifier
      case 'bridge-rectifier':
        return (
          <g stroke={strokeColor} strokeLinecap="round">
            {/* Diamond Bridge */}
            <polygon points="40,8 60,28 40,48 20,28" fill="none" strokeWidth="1.5" />
            {/* 4 Diodes on the legs */}
            {/* Top-Right leg */}
            <polygon points="48,15 54,23 44,21" fill={fillColor} />
            {/* Bottom-Right leg */}
            <polygon points="53,34 47,42 43,36" fill={fillColor} />
            {/* Bottom-Left leg */}
            <polygon points="32,41 26,33 36,35" fill={fillColor} />
            {/* Top-Left leg */}
            <polygon points="27,22 33,14 37,20" fill={fillColor} />
            {/* 4 Connection leads */}
            <line x1="40" y1="2" x2="40" y2="8" strokeWidth="2" />
            <line x1="40" y1="48" x2="40" y2="54" strokeWidth="2" />
            <line x1="14" y1="28" x2="20" y2="28" strokeWidth="2" />
            <line x1="60" y1="28" x2="66" y2="28" strokeWidth="2" />
            <text x="36" y="7" fill={accentColor} fontSize="7" fontWeight="bold" fontFamily="monospace">+</text>
            <text x="37" y="54" fill={mutedText} fontSize="7" fontWeight="bold" fontFamily="monospace">−</text>
          </g>
        );

      // 22. NPN Transistor
      case 'npn-transistor':
        return (
          <g stroke={strokeColor} strokeLinecap="round">
            {/* Circle */}
            <circle cx="40" cy="28" r="18" fill="none" strokeWidth="1.8" />
            {/* Base bar */}
            <line x1="14" y1="28" x2="32" y2="28" strokeWidth="2" />
            <line x1="32" y1="16" x2="32" y2="40" strokeWidth="3" />
            {/* Collector */}
            <line x1="32" y1="22" x2="52" y2="12" strokeWidth="2" />
            <line x1="52" y1="12" x2="52" y2="4" strokeWidth="2" />
            {/* Emitter with arrow pointing OUTWARDS */}
            <line x1="32" y1="34" x2="52" y2="44" strokeWidth="2" />
            <line x1="52" y1="44" x2="52" y2="52" strokeWidth="2" />
            <polygon points="50,43 42,37 45,44" fill={strokeColor} stroke="none" />
            <text x="24" y="24" fill={mutedText} fontSize="7" fontFamily="sans-serif">B</text>
            <text x="55" y="10" fill={mutedText} fontSize="7" fontFamily="sans-serif">C</text>
            <text x="55" y="48" fill={mutedText} fontSize="7" fontFamily="sans-serif">E</text>
          </g>
        );

      // 23. PNP Transistor
      case 'pnp-transistor':
        return (
          <g stroke={strokeColor} strokeLinecap="round">
            {/* Circle */}
            <circle cx="40" cy="28" r="18" fill="none" strokeWidth="1.8" />
            {/* Base bar */}
            <line x1="14" y1="28" x2="32" y2="28" strokeWidth="2" />
            <line x1="32" y1="16" x2="32" y2="40" strokeWidth="3" />
            {/* Collector */}
            <line x1="32" y1="22" x2="52" y2="12" strokeWidth="2" />
            <line x1="52" y1="12" x2="52" y2="4" strokeWidth="2" />
            {/* Emitter with arrow pointing INWARDS towards Base */}
            <line x1="32" y1="34" x2="52" y2="44" strokeWidth="2" />
            <line x1="52" y1="44" x2="52" y2="52" strokeWidth="2" />
            <polygon points="36,36 43,33 41,41" fill={strokeColor} stroke="none" />
            <text x="24" y="24" fill={mutedText} fontSize="7" fontFamily="sans-serif">B</text>
            <text x="55" y="10" fill={mutedText} fontSize="7" fontFamily="sans-serif">C</text>
            <text x="55" y="48" fill={mutedText} fontSize="7" fontFamily="sans-serif">E</text>
          </g>
        );

      // 24. Integrated Circuit (IC / Op-Amp)
      case 'integrated-circuit':
        return (
          <g stroke={strokeColor} strokeLinecap="round">
            {/* Op-amp triangle */}
            <polygon points="26,10 60,28 26,46" fill="none" strokeWidth="2" strokeLinejoin="round" />
            {/* Inputs */}
            <line x1="10" y1="20" x2="26" y2="20" strokeWidth="2" />
            <line x1="10" y1="36" x2="26" y2="36" strokeWidth="2" />
            {/* Output */}
            <line x1="60" y1="28" x2="74" y2="28" strokeWidth="2" />
            {/* - and + inside */}
            <text x="30" y="23" fill={mutedText} fontSize="10" fontWeight="bold" fontFamily="monospace">−</text>
            <text x="29" y="39" fill={accentColor} fontSize="9" fontWeight="bold" fontFamily="monospace">+</text>
          </g>
        );

      // 25. Crossing of two wires no connection
      case 'wire-cross-no-connection':
        return (
          <g stroke={strokeColor} strokeWidth="2" strokeLinecap="round">
            {/* Style 1: Direct perpendicular cross with no dot */}
            <g transform="translate(-14, 0)">
              <line x1="18" y1="28" x2="50" y2="28" />
              <line x1="34" y1="12" x2="34" y2="44" />
            </g>
            {/* Style 2: Bridge / Jumper hump */}
            <g transform="translate(18, 0)">
              <line x1="34" y1="12" x2="34" y2="44" />
              <line x1="18" y1="28" x2="29" y2="28" />
              <path d="M 29 28 A 5 5 0 0 1 39 28" fill="none" />
              <line x1="39" y1="28" x2="50" y2="28" />
            </g>
          </g>
        );

      // 26. Crossing of two wires with connection
      case 'wire-cross-with-connection':
        return (
          <g stroke={strokeColor} strokeWidth="2" strokeLinecap="round">
            {/* Cross with solid junction dot */}
            <g transform="translate(-14, 0)">
              <line x1="18" y1="28" x2="50" y2="28" />
              <line x1="34" y1="12" x2="34" y2="44" />
              <circle cx="34" cy="28" r="4.5" fill={fillColor} stroke="none" />
            </g>
            {/* T-junction with solid dot */}
            <g transform="translate(18, 0)">
              <line x1="20" y1="28" x2="48" y2="28" />
              <line x1="34" y1="12" x2="34" y2="44" />
              <circle cx="34" cy="28" r="4.5" fill={fillColor} stroke="none" />
            </g>
          </g>
        );

      // 27. Shielded Cable
      case 'shielded-cable':
        return (
          <g stroke={strokeColor} strokeLinecap="round">
            {/* Center conductor lines */}
            <line x1="8" y1="28" x2="72" y2="28" strokeWidth="2" />
            {/* Outer oval shield */}
            <ellipse cx="40" cy="28" rx="14" ry="18" fill="none" strokeWidth="1.8" />
            {/* Shield ground connection */}
            <line x1="40" y1="46" x2="40" y2="52" strokeWidth="1.5" />
            <circle cx="40" cy="28" r="4" fill={fillColor} stroke="none" />
          </g>
        );

      // 28. Double Pole Switch
      case 'double-pole-switch':
        return (
          <g stroke={strokeColor} strokeLinecap="round">
            {/* Pole 1 */}
            <line x1="10" y1="18" x2="26" y2="18" strokeWidth="2" />
            <circle cx="28" cy="18" r="3" fill="none" strokeWidth="1.5" />
            <line x1="30" y1="16" x2="48" y2="10" strokeWidth="2.2" />
            <circle cx="52" cy="18" r="3" fill="none" strokeWidth="1.5" />
            <line x1="55" y1="18" x2="70" y2="18" strokeWidth="2" />

            {/* Mechanical Link (Dashed line) */}
            <line x1="39" y1="13" x2="39" y2="33" stroke={accentColor} strokeWidth="1.5" strokeDasharray="3,2" />

            {/* Pole 2 */}
            <line x1="10" y1="38" x2="26" y2="38" strokeWidth="2" />
            <circle cx="28" cy="38" r="3" fill="none" strokeWidth="1.5" />
            <line x1="30" y1="36" x2="48" y2="30" strokeWidth="2.2" />
            <circle cx="52" cy="38" r="3" fill="none" strokeWidth="1.5" />
            <line x1="55" y1="38" x2="70" y2="38" strokeWidth="2" />
          </g>
        );

      // 29. Lamp
      case 'lamp':
        return (
          <g stroke={strokeColor} strokeLinecap="round">
            <line x1="8" y1="28" x2="26" y2="28" strokeWidth="2" />
            <circle cx="40" cy="28" r="14" fill="none" strokeWidth="2" />
            {/* Cross inside */}
            <line x1="30" y1="18" x2="50" y2="38" strokeWidth="2" />
            <line x1="30" y1="38" x2="50" y2="18" strokeWidth="2" />
            <line x1="54" y1="28" x2="72" y2="28" strokeWidth="2" />
          </g>
        );

      // 30. Coil with core
      case 'coil-with-core':
        return (
          <g>
            <g stroke={strokeColor} strokeWidth="2" fill="none" strokeLinecap="round">
              <line x1="6" y1="34" x2="18" y2="34" />
              <path d="M 18 34 A 6 6 0 0 1 30 34" />
              <path d="M 30 34 A 6 6 0 0 1 42 34" />
              <path d="M 42 34 A 6 6 0 0 1 54 34" />
              <path d="M 54 34 A 6 6 0 0 1 66 34" />
              <line x1="66" y1="34" x2="74" y2="34" />
              {/* Solid Iron / Ferrite Core Bar */}
              <line x1="18" y1="18" x2="66" y2="18" strokeWidth="2.8" />
            </g>
            <text x="42" y="12" fill={mutedText} fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">1 mH</text>
          </g>
        );

      // 31. Electrolytic capacitor
      case 'electrolytic-capacitor':
        return (
          <g stroke={strokeColor} strokeLinecap="round">
            <line x1="12" y1="28" x2="34" y2="28" strokeWidth="2" />
            {/* Positive hollow plate box */}
            <rect x="34" y="14" width="6" height="28" fill="none" strokeWidth="2" />
            {/* Negative solid shaded plate box */}
            <rect x="42" y="14" width="6" height="28" fill={fillColor} strokeWidth="1" />
            <line x1="48" y1="28" x2="68" y2="28" strokeWidth="2" />
            <text x="24" y="20" fill={accentColor} fontSize="9" fontWeight="bold" fontFamily="monospace">+</text>
            <text x="56" y="20" fill={mutedText} fontSize="9" fontWeight="bold" fontFamily="monospace">−</text>
          </g>
        );

      default:
        return (
          <circle cx="40" cy="28" r="12" fill="none" stroke={strokeColor} strokeWidth="2" />
        );
    }
  };

  return (
    <svg
      viewBox="0 0 80 56"
      className={`${className} overflow-visible`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {renderContent()}
    </svg>
  );
};
