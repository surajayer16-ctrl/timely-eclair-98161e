import { jsPDF } from 'jspdf';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { DownloadableTelecomNote } from '../types';
import { 
  saveFileToIndexedDb, 
  getFileFromIndexedDb, 
  getAllFilesFromIndexedDb, 
  deleteFileFromIndexedDb 
} from './fileStorageDb';

const STORAGE_KEY = 'nitvt_downloadable_notes';
const FIRESTORE_COLLECTION = 'telecom_downloadable_notes';

// In-memory cache for resolved file URLs to avoid re-generating or re-fetching
const inMemoryFileCache = new Map<string, string>();

/**
 * Safe wrapper for LocalStorage setItem with QuotaExceeded error recovery
 * Never throws an uncaught exception.
 */
export function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err: any) {
    console.warn(`[SafeStorage] LocalStorage quota exceeded on key "${key}". Cleaning up:`, err);
    try {
      // Clear non-critical caches to free space
      const nonCriticalKeys = [
        'nitvt_temp_logs',
        'nitvt_cached_ai',
        'nitvt_quiz_history'
      ];
      nonCriticalKeys.forEach((k) => {
        try { localStorage.removeItem(k); } catch (_) {}
      });
      localStorage.setItem(key, value);
      return true;
    } catch (retryErr) {
      console.warn(`[SafeStorage] Cannot save "${key}" even after cleanup:`, retryErr);
      return false;
    }
  }
}

// Auto-cleanup legacy bloated data from previous runs to immediately restore quota
(function cleanupBloatedStorage() {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing && existing.length > 50000) {
      // Contains heavy raw base64 data URIs from previous version - remove to free quota!
      console.info('[SafeStorage] Migrating and trimming oversized downloadable notes from LocalStorage');
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (_) {
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
  }
})();

// Background hydration of files from IndexedDB
if (typeof window !== 'undefined') {
  getAllFilesFromIndexedDb().then((filesMap) => {
    let updated = false;
    for (const [id, url] of Object.entries(filesMap)) {
      if (url && !inMemoryFileCache.has(id)) {
        inMemoryFileCache.set(id, url);
        updated = true;
      }
    }
    if (updated) {
      window.dispatchEvent(new Event('nitvt_downloadable_notes_updated'));
    }
  }).catch(() => {});
}

// Helper to generate a valid PDF Data URL for instant download & viewing
export function generateValidPdfDataUri(title: string, subtitle: string, sections: { heading: string; points: string[] }[]): string {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Brand Header
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 38, 'F');

    doc.setTextColor(245, 158, 11); // amber-500
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('NATIONAL INSTITUTE OF TECHNICAL & VOCATIONAL TRAINING (NITVT)', 105, 14, { align: 'center' });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Surendra Air | CTEVT & NSTB Accredited Telecom & Electrical Training Center', 105, 22, { align: 'center' });
    doc.text('Phone: +977-9848805119 | Kumaripati, Lalitpur, Nepal | Estd. 2064 BS', 105, 28, { align: 'center' });

    // Document Title Banner
    doc.setFillColor(30, 41, 59); // slate-800
    doc.rect(14, 44, 182, 22, 'F');
    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(0.8);
    doc.rect(14, 44, 182, 22, 'S');

    doc.setTextColor(245, 158, 11);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 105, 53, { align: 'center' });

    doc.setTextColor(226, 232, 240);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(subtitle, 105, 61, { align: 'center' });

    let currentY = 74;

    // Iterate sections
    sections.forEach((sec, sIdx) => {
      if (currentY > 260) {
        doc.addPage();
        currentY = 20;
      }

      // Section header
      doc.setFillColor(241, 245, 249);
      doc.rect(14, currentY - 4, 182, 8, 'F');
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${sIdx + 1}. ${sec.heading}`, 17, currentY + 1.5);
      currentY += 10;

      // Points
      sec.points.forEach((pt) => {
        if (currentY > 270) {
          doc.addPage();
          currentY = 20;
        }
        doc.setTextColor(51, 65, 85);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        
        // Split long lines
        const lines = doc.splitTextToSize(`• ${pt}`, 175);
        doc.text(lines, 18, currentY);
        currentY += lines.length * 5.2;
      });

      currentY += 4;
    });

    // Footer
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.5);
    doc.line(14, 282, 196, 282);

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.text('Confidential Official Technical Handout - NITVT Surendra Air Telecom Training Portal', 105, 287, { align: 'center' });
    doc.text(`Generated: ${new Date().toLocaleDateString('ne-NP')} | Authorized For Training Use Only`, 105, 291, { align: 'center' });

    return doc.output('datauristring');
  } catch (err) {
    console.error('Error generating PDF data URI:', err);
    return 'data:application/pdf;base64,JVBERi0xLjQKJcTl8uXr...';
  }
}

// Generate high-resolution SVG/JPG Data URL for technical schematics
export function generateSampleJpgDataUri(title: string, subtitle: string, badgeText: string): string {
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#090d16" />
        <stop offset="50%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#1e1b4b" />
      </linearGradient>
      <linearGradient id="grid" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.1" />
        <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.1" />
      </linearGradient>
    </defs>
    
    <!-- Background -->
    <rect width="1200" height="800" fill="url(#bg)" />
    
    <!-- Grid pattern -->
    <g stroke="#334155" stroke-width="1" stroke-opacity="0.25">
      ${Array.from({ length: 24 }).map((_, i) => `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="800" />`).join('')}
      ${Array.from({ length: 16 }).map((_, i) => `<line x1="0" y1="${i * 50}" x2="1200" y2="${i * 50}" />`).join('')}
    </g>

    <!-- Header Frame -->
    <rect x="50" y="40" width="1100" height="110" rx="16" fill="#0f172a" stroke="#f59e0b" stroke-width="2" />
    <text x="600" y="82" fill="#f59e0b" font-size="24" font-weight="bold" font-family="Arial, sans-serif" text-anchor="middle">NITVT SURENDRA AIR TELECOM &amp; OPTICAL FIBER TRAINING</text>
    <text x="600" y="112" fill="#e2e8f0" font-size="16" font-family="Arial, sans-serif" text-anchor="middle">${title}</text>
    <text x="600" y="134" fill="#94a3b8" font-size="13" font-family="Arial, sans-serif" text-anchor="middle">${subtitle}</text>

    <!-- Badge -->
    <rect x="940" y="55" width="180" height="32" rx="8" fill="#f59e0b" />
    <text x="1030" y="77" fill="#0f172a" font-size="13" font-weight="bold" font-family="Arial, sans-serif" text-anchor="middle">${badgeText}</text>

    <!-- Schematic Box 1: Exchange to Cabinet -->
    <rect x="80" y="200" width="280" height="480" rx="16" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
    <rect x="80" y="200" width="280" height="46" rx="16" fill="#0284c7" />
    <text x="220" y="230" fill="#ffffff" font-size="16" font-weight="bold" font-family="Arial, sans-serif" text-anchor="middle">EXCHANGE / OLT / MDF</text>
    <text x="100" y="280" fill="#94a3b8" font-size="13" font-family="Arial, sans-serif">• 10G PON Core Optical Switch</text>
    <text x="100" y="320" fill="#94a3b8" font-size="13" font-family="Arial, sans-serif">• Primary Feeder Cable (96-144F)</text>
    <text x="100" y="360" fill="#94a3b8" font-size="13" font-family="Arial, sans-serif">• Duct Route with Heavy Manholes</text>
    <text x="100" y="400" fill="#94a3b8" font-size="13" font-family="Arial, sans-serif">• Main Grounding &lt; 5 Ohms</text>
    <text x="100" y="440" fill="#38bdf8" font-size="13" font-weight="bold" font-family="Arial, sans-serif">• Tx Power: +3 to +7 dBm</text>
    <circle cx="220" cy="540" r="45" fill="#0f172a" stroke="#38bdf8" stroke-width="3" />
    <text x="220" y="546" fill="#38bdf8" font-size="14" font-weight="bold" font-family="Arial, sans-serif" text-anchor="middle">MDF 100%</text>

    <!-- Connector Arrow 1 -->
    <line x1="360" y1="440" x2="460" y2="440" stroke="#f59e0b" stroke-width="4" stroke-dasharray="8 4" />
    <polygon points="460,432 476,440 460,448" fill="#f59e0b" />
    <text x="415" y="425" fill="#f59e0b" font-size="12" font-weight="bold" font-family="Arial, sans-serif" text-anchor="middle">Feeder OSP</text>

    <!-- Schematic Box 2: Distribution / FDT / Cabinet -->
    <rect x="470" y="200" width="280" height="480" rx="16" fill="#1e293b" stroke="#f59e0b" stroke-width="2" />
    <rect x="470" y="200" width="280" height="46" rx="16" fill="#d97706" />
    <text x="610" y="230" fill="#ffffff" font-size="16" font-weight="bold" font-family="Arial, sans-serif" text-anchor="middle">CABINET / FDT (1:8 Split)</text>
    <text x="490" y="280" fill="#94a3b8" font-size="13" font-family="Arial, sans-serif">• Cross Connect Optical Cabinet</text>
    <text x="490" y="320" fill="#94a3b8" font-size="13" font-family="Arial, sans-serif">• PLC 1:8 First Stage Splitter</text>
    <text x="490" y="360" fill="#94a3b8" font-size="13" font-family="Arial, sans-serif">• Insertion Loss: ~10.5 dB</text>
    <text x="490" y="400" fill="#94a3b8" font-size="13" font-family="Arial, sans-serif">• Aerial Pole &amp; Wall Distribution</text>
    <text x="490" y="440" fill="#f59e0b" font-size="13" font-weight="bold" font-family="Arial, sans-serif">• 12-Core Standard Color Code</text>
    <circle cx="610" cy="540" r="45" fill="#0f172a" stroke="#f59e0b" stroke-width="3" />
    <text x="610" y="546" fill="#f59e0b" font-size="14" font-weight="bold" font-family="Arial, sans-serif" text-anchor="middle">FDT OK</text>

    <!-- Connector Arrow 2 -->
    <line x1="750" y1="440" x2="850" y2="440" stroke="#10b981" stroke-width="4" stroke-dasharray="8 4" />
    <polygon points="850,432 866,440 850,448" fill="#10b981" />
    <text x="805" y="425" fill="#10b981" font-size="12" font-weight="bold" font-family="Arial, sans-serif" text-anchor="middle">Drop Cable</text>

    <!-- Schematic Box 3: FAT & Customer ONT -->
    <rect x="860" y="200" width="280" height="480" rx="16" fill="#1e293b" stroke="#10b981" stroke-width="2" />
    <rect x="860" y="200" width="280" height="46" rx="16" fill="#059669" />
    <text x="1000" y="230" fill="#ffffff" font-size="16" font-weight="bold" font-family="Arial, sans-serif" text-anchor="middle">FAT / CUSTOMER ONT</text>
    <text x="880" y="280" fill="#94a3b8" font-size="13" font-family="Arial, sans-serif">• FAT (Fiber Access Terminal 1:8)</text>
    <text x="880" y="320" fill="#94a3b8" font-size="13" font-family="Arial, sans-serif">• G.657A2 Bow-Type Drop Cable</text>
    <text x="880" y="360" fill="#94a3b8" font-size="13" font-family="Arial, sans-serif">• SC/APC Green Angle Connector</text>
    <text x="880" y="400" fill="#94a3b8" font-size="13" font-family="Arial, sans-serif">• Optical Rx Level: -18 to -24 dBm</text>
    <text x="880" y="440" fill="#10b981" font-size="13" font-weight="bold" font-family="Arial, sans-serif">• High Speed Gigabit Broadband</text>
    <circle cx="1000" cy="540" r="45" fill="#0f172a" stroke="#10b981" stroke-width="3" />
    <text x="1000" y="546" fill="#10b981" font-size="14" font-weight="bold" font-family="Arial, sans-serif" text-anchor="middle">ONLINE</text>

    <!-- Footer Banner -->
    <rect x="50" y="710" width="1100" height="50" rx="12" fill="#0f172a" stroke="#334155" stroke-width="1" />
    <text x="600" y="742" fill="#94a3b8" font-size="13" font-family="Arial, sans-serif" text-anchor="middle">NITVT Technical Documentation • Phone: 9848805119 | Designed for CTEVT &amp; NSTB Level 1 &amp; Level 2 Technicians</text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
}

// Built-in generators mapped by note id for lazy on-demand generation
const BUILTIN_FILE_GENERATORS: Record<string, () => string> = {
  'note-level1-handout': () => generateValidPdfDataUri(
    'JUNIOR TELECOM TECHNICIAN (LEVEL-1) COMPLETE NOTE',
    'CTEVT & NSTB Curriculum Guidelines - Comprehensive Practical & Theoretical Handout',
    [
      {
        heading: 'Optical Fiber Fundamentals & Construction',
        points: [
          'Core (8-10 um Single Mode, 50-62.5 um Multi-Mode) made of pure silica glass (SiO2).',
          'Cladding (125 um) with lower refractive index for Total Internal Reflection (TIR).',
          'Primary coating (250 um) and buffer jacket (900 um / 2.0-3.0 mm) for physical protection.',
          'Light transmission wavelengths: 1310 nm, 1490 nm, 1550 nm (lowest attenuation at 1550 nm ~0.2 dB/km).'
        ]
      },
      {
        heading: '12-Core Standard Optical Fiber Color Code',
        points: [
          '1. Blue (नीलो) | 2. Orange (सुन्तला) | 3. Green (हरियो) | 4. Brown (खैरो)',
          '5. Slate/Grey (खरानी) | 6. White (सेतो) | 7. Red (रातो) | 8. Black (कालो)',
          '9. Yellow (पहेँलो) | 10. Violet/Purple (बैजनी) | 11. Rose/Pink (गुलाबी) | 12. Aqua/Cyan (आकाशी नीलो)',
          'Rule: 24-core cable uses 2 tubes (Tube 1 Blue, Tube 2 Orange), each having 12 color cores.'
        ]
      },
      {
        heading: 'Fusion Splicing Standard Operating Procedure (SOP)',
        points: [
          '1. Slide protection sleeve (40mm or 60mm) onto one fiber core before stripping.',
          '2. Strip outer jacket and 250 um coating using Miller Tri-Hole Stripper (leave ~30-40mm bare fiber).',
          '3. Clean bare glass fiber thoroughly with 99% pure Isopropyl Alcohol (IPA) and lint-free wipes.',
          '4. Cleave accurately using precision fiber cleaver (cleave angle strictly below 0.5 degrees).',
          '5. Place cleaved fiber carefully into splicer V-grooves without touching electrode tips.',
          '6. Initiate auto-arc fusion; confirm splice loss is below 0.03 dB.',
          '7. Center protection sleeve over bare splice point and apply heat shrink cycle in heater oven (20-30 sec).'
        ]
      },
      {
        heading: 'Safety Rules & Precautions (सुरक्षा मापदण्ड)',
        points: [
          'Never look directly into fiber core or laser port (invisible infrared laser causes permanent retinal burn).',
          'Always dispose of fiber glass shards into dedicated sharps disposal container.',
          'Wear safety helmet, harness, safety glasses, and high-visibility vest during pole climbing and road work.'
        ]
      }
    ]
  ),
  'note-level2-handout': () => generateValidPdfDataUri(
    'TELECOM TECHNICIAN (LEVEL-2) ADVANCED TECHNICAL GUIDE',
    'OTDR Trace Analysis, GPON Architecture, Optical Power Budgeting & Fault Resolution',
    [
      {
        heading: 'OTDR (Optical Time Domain Reflectometer) Testing & Trace Reading',
        points: [
          'Reflective events: Mechanical joints, PC/UPC/APC connectors, open ends, fiber breaks (Fresnel reflection spike).',
          'Non-reflective events: Fusion splices, micro-bends, macro-bends (abrupt downward step in trace).',
          'Pulse width selection: Short pulse (5ns-20ns) for high resolution short links; Long pulse (100ns-10us) for long haul.',
          'Ghost reflections: Artifacts caused by strong reflective connectors; recognized by having twice the distance without step loss.'
        ]
      },
      {
        heading: 'FTTH GPON Network Architecture & Optical Power Budget',
        points: [
          'OLT (Optical Line Terminal): Downstream 1490nm / Upstream 1310nm; downstream speed 2.488 Gbps / upstream 1.244 Gbps.',
          'Splitter Loss Calculation: 1:2 Splitter (~3.5 dB), 1:4 Splitter (~7.2 dB), 1:8 Splitter (~10.5 dB), 1:16 Splitter (~13.8 dB).',
          'Target ONT Received Power: -15 dBm to -24 dBm (Overload warning if > -8 dBm, Signal Loss if < -27 dBm).',
          'APC (Angled Physical Contact - Green) return loss > 60 dB; UPC (Blue) return loss > 50 dB.'
        ]
      },
      {
        heading: 'Network Fault Troubleshooting Matrix',
        points: [
          'Red LOS light blinking on ONT: Physical fiber break or optical power below -27 dBm. Trace with VFL and OTDR.',
          'High attenuation on 1550nm vs 1310nm: Indicates macro-bend in distribution box or cassette tray (1550nm is more sensitive to bending).',
          'PON light flashing: SFP transceiver registration issue, wrong LOID/password, or OLT port mismatch.'
        ]
      }
    ]
  ),
  'note-osp-schematic-jpg': () => generateSampleJpgDataUri(
    'TELECOM OUTSIDE PLANT (OSP) NETWORK ARCHITECTURE',
    'Exchange / MDF -> Cabinet / FDT -> Distribution Pole -> DP / FAT -> Subscriber Premises',
    'OFFICIAL CTEVT SCHEMATIC'
  ),
  'note-optical-colorcode-jpg': () => generateSampleJpgDataUri(
    '12-CORE OPTICAL FIBER COLOR CODE & SPLICING MATRIX',
    'Standard EIA/TIA-598 Color Order: Blue, Orange, Green, Brown, Slate, White, Red, Black, Yellow, Violet, Rose, Aqua',
    'HIGH RESOLUTION CHART'
  ),
  'note-electrician-symbols-pdf': () => generateValidPdfDataUri(
    'BUILDING ELECTRICIAN 64 ELECTRICAL SYMBOLS & WIRING CIRCUITS',
    'CTEVT Accredited Electrician Training Program - Practical Wiring SOP & Reference Guide',
    [
      {
        heading: 'Core Electrical Symbols & Architectural Representation',
        points: [
          'Light Points: Ceiling Rose, Bracket Light, Fluorescent Tube, Chandeliers.',
          'Switch Outlets: 1-Way Switch, 2-Way (Staircase) Switch, Intermediate Switch, Bell Push.',
          'Power Sockets: 2-Pin 5A, 3-Pin 15A/16A Power Socket with Earth Pin.',
          'Protection Devices: MCB (Miniature Circuit Breaker), RCCB/ELCB (Residual Current Breaker), MCCB, Cutout Fuse.'
        ]
      },
      {
        heading: '11 Practical Residential & Commercial Wiring Circuits',
        points: [
          'Circuit 1: Controlling one lamp with one single-pole switch in PVC conduit.',
          'Circuit 2: Staircase wiring (one lamp controlled from two different places using two 2-way switches).',
          'Circuit 3: Corridor / Hospital wiring (controlling lamps in sequence with intermediate switches).',
          'Circuit 4: Godown wiring (sequential lighting where turning next lamp switches off previous lamp).',
          'Circuit 5: Distribution Board (DB) wiring with Main MCB + RCCB + Individual Circuit Breakers.'
        ]
      },
      {
        heading: 'Ohm’s Law & Power Calculations (हिसाब सूत्रहरू)',
        points: [
          'Voltage V = I * R | Current I = V / R | Resistance R = V / I',
          'Electrical Power P = V * I = I^2 * R = V^2 / R (Watts)',
          'Single-phase AC Power P = V * I * cos(phi) (where cos phi is Power Factor, typical 0.8-0.9).',
          'Earth Resistance Standard: Domestic installation < 5 Ohms; Substation/Tower < 1 Ohm.'
        ]
      }
    ]
  )
};

/**
 * Converts a base64 or encoded Data URI into a standard Blob
 * Works for PDFs, PNGs, JPEGs, and SVGs.
 */
export function dataUriToBlob(dataUri: string): Blob {
  if (!dataUri) {
    return new Blob([], { type: 'application/octet-stream' });
  }

  try {
    if (dataUri.startsWith('data:')) {
      const commaIdx = dataUri.indexOf(',');
      if (commaIdx !== -1) {
        const header = dataUri.slice(0, commaIdx);
        const data = dataUri.slice(commaIdx + 1);
        const mimeMatch = header.match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : (header.includes('pdf') ? 'application/pdf' : 'image/jpeg');

        if (header.includes(';base64')) {
          const binary = atob(data);
          const len = binary.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binary.charCodeAt(i);
          }
          return new Blob([bytes], { type: mime });
        } else {
          // Decoded text/svg
          const decoded = decodeURIComponent(data);
          return new Blob([decoded], { type: mime });
        }
      }
    }
  } catch (err) {
    console.warn('Failed to parse dataUri into Blob:', err);
  }

  return new Blob([dataUri], { type: 'application/octet-stream' });
}

/**
 * Creates a browser-native Blob URL from any Data URI or HTTP URL
 */
export function getBlobUrlForData(dataUri: string): string {
  if (!dataUri) return '';
  if (dataUri.startsWith('blob:') || dataUri.startsWith('http://') || dataUri.startsWith('https://')) {
    return dataUri;
  }
  try {
    const blob = dataUriToBlob(dataUri);
    return URL.createObjectURL(blob);
  } catch (e) {
    console.warn('Could not create object URL for data:', e);
    return dataUri;
  }
}

/**
 * Resolves a note's file URL on demand (synchronous check)
 * Checks in-memory cache -> built-in generator -> current URL
 */
export function getNoteFileUrl(noteId: string, currentUrl?: string): string {
  if (currentUrl && currentUrl.length > 50 && !currentUrl.startsWith('builtin://')) {
    inMemoryFileCache.set(noteId, currentUrl);
    return currentUrl;
  }
  if (inMemoryFileCache.has(noteId)) {
    return inMemoryFileCache.get(noteId)!;
  }
  if (BUILTIN_FILE_GENERATORS[noteId]) {
    try {
      const generated = BUILTIN_FILE_GENERATORS[noteId]();
      inMemoryFileCache.set(noteId, generated);
      return generated;
    } catch (err) {
      console.error('Failed to generate built-in file for', noteId, err);
    }
  }

  // Trigger background fetch from IndexedDB if available
  if (typeof window !== 'undefined') {
    getFileFromIndexedDb(noteId).then((fromIdb) => {
      if (fromIdb && fromIdb.length > 20 && !inMemoryFileCache.has(noteId)) {
        inMemoryFileCache.set(noteId, fromIdb);
        window.dispatchEvent(new Event('nitvt_downloadable_notes_updated'));
      }
    }).catch(() => {});
  }

  return currentUrl || '';
}

/**
 * Asynchronously resolves a note's file URL from Memory, IndexedDB, or Built-in
 * Guarantees that uploaded PDFs and JPGs are retrieved even if not yet in memory.
 */
export async function getNoteFileUrlAsync(noteId: string, currentUrl?: string): Promise<string> {
  const syncResult = getNoteFileUrl(noteId, currentUrl);
  if (syncResult && syncResult.length > 50) {
    return syncResult;
  }

  // Retrieve from IndexedDB (offline database)
  try {
    const fromIdb = await getFileFromIndexedDb(noteId);
    if (fromIdb && fromIdb.length > 20) {
      inMemoryFileCache.set(noteId, fromIdb);
      return fromIdb;
    }
  } catch (err) {
    console.warn('Error reading file from IndexedDB:', noteId, err);
  }

  return currentUrl || '';
}

// Initial Sample Preloaded Downloadable Notes (Metadata only - zero heavy base64 strings!)
export const INITIAL_DOWNLOADABLE_NOTES: DownloadableTelecomNote[] = [
  {
    id: 'note-level1-handout',
    titleNepali: 'जुनियर टेलिकम टेक्निसियन तह-१ आधिकारिक नोट तथा म्यानुअल',
    titleEnglish: 'Junior Telecom Technician Level-1 Official Course Note & Handout',
    category: 'level1',
    fileType: 'pdf',
    fileName: 'NITVT_Telecom_Level1_Full_Manual.pdf',
    fileSize: '1.4 MB',
    fileUrl: '', // Lazily generated on demand
    uploadedAt: '2026-09-01',
    descriptionNepali: 'आधारभूत अप्टिकल फाइबर स्प्लाइसिङ, १२-कोर कलर कोड, ड्रप केबल जडान र सुरक्षा मापदण्ड सहितको पूर्ण आधिकारिक PDF नोट।',
    descriptionEnglish: 'Complete Level 1 handbook covering optical fiber splicing, 12-core color codes, drop cable installation and safety precautions.',
    downloadsCount: 142,
    featured: true
  },
  {
    id: 'note-level2-handout',
    titleNepali: 'टेलिकम टेक्निसियन तह-२ OTDR, GPON र नेटवर्क ट्रबलशुटिङ गाइड',
    titleEnglish: 'Telecom Technician Level-2 OTDR, GPON & Network Troubleshooting Guide',
    category: 'level2',
    fileType: 'pdf',
    fileName: 'NITVT_Telecom_Level2_Technical_Guide.pdf',
    fileSize: '1.8 MB',
    fileUrl: '', // Lazily generated on demand
    uploadedAt: '2026-09-02',
    descriptionNepali: 'उन्नत OTDR ट्रेस विश्लेषण, वेभफर्म रिडिङ, GPON स्प्लिटर लस क्याल्कुलेसन र फिल्ड ट्रबलशुटिङ गाइड।',
    descriptionEnglish: 'Comprehensive guide to OTDR analysis, optical power budgets, GPON splitters, and fiber optic troubleshooting.',
    downloadsCount: 118,
    featured: true
  },
  {
    id: 'note-osp-schematic-jpg',
    titleNepali: 'CTEVT OSP टेलिकम आउटसाइड नेटवर्क आर्किटेक्चर रेखाचित्र',
    titleEnglish: 'CTEVT OSP Telecom Outside Plant Network Architecture Schematic Diagram',
    category: 'osp-telecom',
    fileType: 'jpg',
    fileName: 'NITVT_OSP_Network_Architecture_Diagram.jpg',
    fileSize: '840 KB',
    fileUrl: '', // Lazily generated on demand
    uploadedAt: '2026-09-03',
    descriptionNepali: 'टेलिकम एक्सचेन्ज, क्याबिनेट, एफडीटी, पोल, डी.पी. र ग्राहक परिसर सम्मको सम्पूर्ण ओएसपी संरचना रेखाचित्र (JPG)।',
    descriptionEnglish: 'High-resolution engineering schematic of Outside Plant network from Exchange/MDF to subscriber premises.',
    downloadsCount: 96,
    featured: true
  },
  {
    id: 'note-optical-colorcode-jpg',
    titleNepali: '१२-कोर अप्टिकल फाइबर कलर कोडिङ र स्प्लाइसिङ चार्ट',
    titleEnglish: '12-Core Optical Fiber Color Coding & Fusion Splicing Chart',
    category: 'optical-fiber',
    fileType: 'jpg',
    fileName: 'NITVT_Fiber_12Core_Color_Code_Chart.jpg',
    fileSize: '720 KB',
    fileUrl: '', // Lazily generated on demand
    uploadedAt: '2026-09-03',
    descriptionNepali: 'अन्तर्राष्ट्रिय तथा नेपाल टेलिकम मानक १२-कोर कलर कोडिङ र स्प्लाइसिङ सिक्वेन्स चार्ट (JPG रेखाचित्र)।',
    descriptionEnglish: 'Color coding chart and sequence guide for single-mode optical fiber according to international standards.',
    downloadsCount: 88,
    featured: false
  },
  {
    id: 'note-electrician-symbols-pdf',
    titleNepali: 'बिल्डिङ इलेक्ट्रिसियन ६४ विद्युतिय चिन्ह तथा प्रयोगात्मक रेखाचित्र नोट',
    titleEnglish: 'Building Electrician 64 Electrical Symbols & Practical Wiring Diagrams',
    category: 'electrician',
    fileType: 'pdf',
    fileName: 'NITVT_Building_Electrician_Symbols_Wiring.pdf',
    fileSize: '1.2 MB',
    fileUrl: '', // Lazily generated on demand
    uploadedAt: '2026-09-04',
    descriptionNepali: '६४ वटा विद्युतिय चिन्हहरू, ११ वटा व्यावहारिक वाइरिङ सर्किटहरू, ओहमको नियम र अर्थिङ निर्देशिका सहितको पूर्ण PDF।',
    descriptionEnglish: 'Complete documentation of 64 electrical symbols, 11 practical wiring diagrams, Ohm law formulas and earthing rules.',
    downloadsCount: 104,
    featured: true
  }
];

/**
 * Saves notes metadata to LocalStorage safely.
 * Strips huge base64 data URIs so LocalStorage stays under 3KB!
 */
function saveNotesMetadataToLocal(notes: DownloadableTelecomNote[]): void {
  try {
    const sanitized = notes.map((n) => ({
      ...n,
      // Strip any huge base64 string (>1000 chars) from LocalStorage
      fileUrl: (n.fileUrl && n.fileUrl.length < 1000 && !n.fileUrl.startsWith('data:')) ? n.fileUrl : ''
    }));
    safeSetItem(STORAGE_KEY, JSON.stringify(sanitized));
  } catch (err) {
    console.warn('[SafeStorage] Could not write metadata to LocalStorage:', err);
  }
}

// Read from LocalStorage synchronously with safe in-memory file resolution
export function getStoredDownloadableNotes(): DownloadableTelecomNote[] {
  let notes: DownloadableTelecomNote[] = [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        notes = parsed;
      }
    }
  } catch (err) {
    console.error('Failed to parse downloadable notes from localStorage:', err);
  }

  if (notes.length === 0) {
    notes = INITIAL_DOWNLOADABLE_NOTES.map((n) => ({ ...n }));
    saveNotesMetadataToLocal(notes);
  }

  // Ensure every note in memory has its fileUrl properly resolved
  return notes.map((n) => ({
    ...n,
    fileUrl: getNoteFileUrl(n.id, n.fileUrl)
  }));
}

// Fetch from Firestore and synchronize with LocalStorage
export async function fetchDownloadableNotesFromCloud(): Promise<DownloadableTelecomNote[]> {
  try {
    const colRef = collection(db, FIRESTORE_COLLECTION);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const cloudNotes: DownloadableTelecomNote[] = [];
      snap.forEach((d) => {
        cloudNotes.push(d.data() as DownloadableTelecomNote);
      });

      // Sort by uploadedAt or featured
      cloudNotes.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

      // Cache cloud fileUrls in memory
      cloudNotes.forEach((n) => {
        if (n.fileUrl && n.fileUrl.length > 50) {
          inMemoryFileCache.set(n.id, n.fileUrl);
        }
      });

      // Save metadata locally
      saveNotesMetadataToLocal(cloudNotes);
      window.dispatchEvent(new Event('nitvt_downloadable_notes_updated'));

      return cloudNotes.map((n) => ({
        ...n,
        fileUrl: getNoteFileUrl(n.id, n.fileUrl)
      }));
    }
  } catch (err) {
    console.warn('Firestore fetch telecom notes failed or empty, using local storage:', err);
  }

  return getStoredDownloadableNotes();
}

// Save or Update a Downloadable Note
export async function saveDownloadableNote(note: DownloadableTelecomNote): Promise<void> {
  const current = getStoredDownloadableNotes();
  const existingIdx = current.findIndex((n) => n.id === note.id);
  let updated: DownloadableTelecomNote[];

  // Cache file URL in memory
  if (note.fileUrl) {
    inMemoryFileCache.set(note.id, note.fileUrl);
    // Store in IndexedDB for persistent offline storage (unlimited size)
    await saveFileToIndexedDb(note.id, note.fileUrl);
  }

  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = note;
  } else {
    updated = [note, ...current];
  }

  // Save metadata to LocalStorage (safely stripped of huge data URIs)
  saveNotesMetadataToLocal(updated);
  window.dispatchEvent(new Event('nitvt_downloadable_notes_updated'));

  // Sync to Firestore
  try {
    const docRef = doc(db, FIRESTORE_COLLECTION, note.id);
    // If fileUrl is too large (>700KB), keep metadata in Firestore and file in IndexedDB
    const firestorePayload = {
      ...note,
      fileUrl: (note.fileUrl && note.fileUrl.length < 750000) ? note.fileUrl : ''
    };
    await setDoc(docRef, firestorePayload);
  } catch (err) {
    console.warn('Could not sync note to Firestore (saved locally in IndexedDB):', err);
  }
}

// Delete a Downloadable Note
export async function deleteDownloadableNote(id: string): Promise<boolean> {
  try {
    // 1. Remove from in-memory cache
    inMemoryFileCache.delete(id);

    // 2. Remove from IndexedDB
    try {
      await deleteFileFromIndexedDb(id);
    } catch (e) {
      console.warn('IndexedDB delete error:', e);
    }

    // 3. Remove from LocalStorage
    const current = getStoredDownloadableNotes();
    const updated = current.filter((n) => n.id !== id);
    saveNotesMetadataToLocal(updated);

    // 4. Remove from Firestore
    try {
      const docRef = doc(db, FIRESTORE_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('Could not delete note from Firestore:', err);
    }

    // 5. Broadcast update event so all components refresh
    window.dispatchEvent(new Event('nitvt_downloadable_notes_updated'));
    return true;
  } catch (err) {
    console.error('Failed to delete downloadable note:', err);
    return false;
  }
}

// Increment download count
export function incrementDownloadCount(id: string): void {
  try {
    const current = getStoredDownloadableNotes();
    const item = current.find((n) => n.id === id);
    if (item) {
      item.downloadsCount = (item.downloadsCount || 0) + 1;
      saveNotesMetadataToLocal(current);
      window.dispatchEvent(new Event('nitvt_downloadable_notes_updated'));
      
      // Update Firestore async in background
      try {
        const docRef = doc(db, FIRESTORE_COLLECTION, id);
        setDoc(docRef, { downloadsCount: item.downloadsCount }, { merge: true }).catch(() => {});
      } catch (_) {}
    }
  } catch (_) {}
}

// Toggle whether a note is allowed to be downloaded or is view-only (admin control)
export async function toggleNoteDownloadPermission(id: string, allowDownload: boolean): Promise<boolean> {
  try {
    const current = getStoredDownloadableNotes();
    const target = current.find((n) => n.id === id);
    if (!target) return false;

    target.allowDownload = allowDownload;
    saveNotesMetadataToLocal(current);
    window.dispatchEvent(new Event('nitvt_downloadable_notes_updated'));

    // Sync to Firestore
    try {
      const docRef = doc(db, FIRESTORE_COLLECTION, id);
      await setDoc(docRef, { allowDownload }, { merge: true });
    } catch (err) {
      console.warn('Could not sync download permission to Firestore:', err);
    }

    return true;
  } catch (err) {
    console.error('Error toggling download permission:', err);
    return false;
  }
}

// Trigger browser download of file (PDF, JPG, PNG)
export async function triggerFileDownload(note: DownloadableTelecomNote): Promise<boolean> {
  // Check if admin has disabled downloads for this note
  if (note.allowDownload === false) {
    console.warn('Download is restricted for this note by Administrator:', note.titleEnglish);
    return false;
  }

  incrementDownloadCount(note.id);
  
  try {
    const resolvedUrl = await getNoteFileUrlAsync(note.id, note.fileUrl);
    if (!resolvedUrl) {
      console.warn('File URL could not be resolved for download:', note.titleEnglish);
      return false;
    }

    const safeTitle = (note.titleEnglish || note.titleNepali || 'telecom_note')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 50);
    const ext = note.fileType === 'pdf' ? 'pdf' : (note.fileType === 'png' ? 'png' : 'jpg');
    const filename = note.fileName || `NITVT_${safeTitle}.${ext}`;

    const blob = dataUriToBlob(resolvedUrl);
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke object URL after delay
    setTimeout(() => {
      try {
        URL.revokeObjectURL(blobUrl);
      } catch (_) {}
    }, 25000);

    return true;
  } catch (err) {
    console.error('Error in triggerFileDownload:', err);
    // Direct fallback
    try {
      const fallbackUrl = getNoteFileUrl(note.id, note.fileUrl);
      const link = document.createElement('a');
      link.href = fallbackUrl;
      link.download = note.fileName || `NITVT_Note.${note.fileType}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    } catch (fallbackErr) {
      console.error('Fallback download failed:', fallbackErr);
      return false;
    }
  }
}

// Open note directly in a new tab for native fullscreen viewing
export async function openNoteInNewTab(note: DownloadableTelecomNote): Promise<boolean> {
  try {
    const resolvedUrl = await getNoteFileUrlAsync(note.id, note.fileUrl);
    if (!resolvedUrl) {
      console.warn('Cannot open note, no resolved URL');
      return false;
    }

    const titleClean = (note.titleNepali || note.titleEnglish || 'Document').replace(/"/g, '&quot;');
    const fileNameClean = (note.fileName || `NITVT_${note.id}.${note.fileType}`).replace(/"/g, '&quot;');
    const canDownload = note.allowDownload !== false;

    // For Images (SVG, JPG, PNG)
    if (note.fileType !== 'pdf') {
      const win = window.open('', '_blank');
      if (win) {
        win.document.write(`
          <!DOCTYPE html>
          <html lang="ne">
            <head>
              <meta charset="utf-8" />
              <title>${titleClean} - NITVT</title>
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <style>
                * { box-sizing: border-box; }
                body { margin: 0; background: #090d16; color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; display: flex; flex-direction: column; min-height: 100vh; }
                header { background: #0f172a; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #1e293b; position: sticky; top: 0; z-index: 50; }
                .title-wrap { display: flex; flex-direction: column; }
                h1 { margin: 0; font-size: 15px; font-weight: 700; color: #f8fafc; }
                p { margin: 2px 0 0 0; font-size: 11px; color: #94a3b8; }
                .btn { background: #f59e0b; color: #020617; border: none; padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }
                .btn:hover { background: #fbbf24; }
                .badge-locked { background: #1e293b; color: #f59e0b; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 600; border: 1px solid #334155; }
                .content { flex: 1; display: flex; align-items: center; justify-content: center; padding: 24px; }
                img { max-width: 100%; max-height: 85vh; border-radius: 12px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8); border: 1px solid #334155; }
              </style>
            </head>
            <body>
              <header>
                <div class="title-wrap">
                  <h1>${titleClean}</h1>
                  <p>NITVT Surendra Air | Technical Training</p>
                </div>
                ${canDownload 
                  ? `<a href="${resolvedUrl}" download="${fileNameClean}" class="btn">फाइल डाउनलोड</a>`
                  : `<span class="badge-locked">🔒 केवल अनलाइन हेर्न मिल्ने (डाउनलोड निषेध)</span>`
                }
              </header>
              <div class="content">
                <img src="${resolvedUrl}" alt="${titleClean}" />
              </div>
            </body>
          </html>
        `);
        win.document.close();
        return true;
      }
    }

    // For PDF documents: Render via standalone HTML canvas viewer to prevent "This page has been blocked by Chrome"
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`
        <!DOCTYPE html>
        <html lang="ne">
          <head>
            <meta charset="utf-8" />
            <title>${titleClean} - NITVT PDF Viewer</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
            <style>
              * { box-sizing: border-box; }
              body { margin: 0; background: #090d16; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
              header { background: #0f172a; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #1e293b; z-index: 20; shrink: 0; }
              .header-left { display: flex; flex-direction: column; min-width: 0; max-width: 60%; }
              h1 { margin: 0; font-size: 14px; font-weight: 700; color: #f8fafc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
              .subtitle { font-size: 11px; color: #94a3b8; font-family: monospace; }
              .actions { display: flex; align-items: center; gap: 8px; }
              .btn { background: #1e293b; color: #e2e8f0; border: 1px solid #334155; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }
              .btn:hover { background: #334155; color: #fff; }
              .btn-primary { background: #f59e0b; color: #020617; border-color: #f59e0b; font-weight: 700; }
              .btn-primary:hover { background: #fbbf24; }
              #viewer-container { flex: 1; overflow-y: auto; display: flex; flex-direction: column; align-items: center; padding: 20px; gap: 24px; background: #090d16; }
              .page-container { display: flex; flex-direction: column; align-items: center; gap: 8px; }
              canvas { max-width: 100%; border-radius: 6px; box-shadow: 0 15px 35px rgba(0,0,0,0.8); background: #ffffff; }
              .page-tag { font-size: 11px; color: #64748b; font-family: monospace; background: #0f172a; padding: 2px 8px; border-radius: 12px; border: 1px solid #1e293b; }
              #loading-indicator { color: #f59e0b; font-size: 14px; font-weight: 600; margin-top: 50px; text-align: center; }
            </style>
          </head>
          <body>
            <header>
              <div class="header-left">
                <h1>${titleClean}</h1>
                <span class="subtitle">${fileNameClean}</span>
              </div>
              <div class="actions">
                <button onclick="window.print()" class="btn">प्रिन्ट (Print)</button>
                ${canDownload 
                  ? `<a id="download-btn" href="${resolvedUrl}" download="${fileNameClean}" class="btn btn-primary">PDF डाउनलोड</a>`
                  : `<span class="badge-locked">🔒 केवल अनलाइन हेर्न मिल्ने (डाउनलोड बन्द)</span>`
                }
              </div>
            </header>
            <div id="viewer-container">
              <div id="loading-indicator">PDF म्यानुअल सिधै लोड हुँदैछ, कृपया एकछिन पर्खनुहोस्...</div>
            </div>

            <script>
              const pdfDataUri = ${JSON.stringify(resolvedUrl)};
              pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

              function base64ToUint8(base64Str) {
                const pure = base64Str.includes(',') ? base64Str.split(',')[1] : base64Str;
                const binary = atob(pure.trim());
                const len = binary.length;
                const bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                  bytes[i] = binary.charCodeAt(i);
                }
                return bytes;
              }

              async function renderPdf() {
                try {
                  const bytes = base64ToUint8(pdfDataUri);
                  const loadingTask = pdfjsLib.getDocument({ data: bytes });
                  const pdf = await loadingTask.promise;
                  
                  const container = document.getElementById('viewer-container');
                  container.innerHTML = '';

                  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    const page = await pdf.getPage(pageNum);
                    const viewport = page.getViewport({ scale: 1.4 });
                    
                    const wrapper = document.createElement('div');
                    wrapper.className = 'page-container';

                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    const renderContext = {
                      canvasContext: ctx,
                      viewport: viewport
                    };
                    await page.render(renderContext).promise;

                    const label = document.createElement('div');
                    label.className = 'page-tag';
                    label.textContent = 'पाना ' + pageNum + ' / ' + pdf.numPages;

                    wrapper.appendChild(canvas);
                    wrapper.appendChild(label);
                    container.appendChild(wrapper);
                  }
                } catch (err) {
                  console.error('PDF Render Error:', err);
                  const container = document.getElementById('viewer-container');
                  container.innerHTML = '<div style="color: #ef4444; margin-top: 40px; text-align: center;">PDF लोड गर्न सकिएन। कृपया माथि दिइएको डाउनलोड बटन थिचेर फाइल हेर्नुहोस्।</div>';
                }
              }

              renderPdf();
            </script>
          </body>
        </html>
      `);
      win.document.close();
      return true;
    }

    // Fallback: trigger standard download if popups completely blocked
    await triggerFileDownload(note);
    return true;
  } catch (err) {
    console.warn('Error opening note in new tab:', err);
    return false;
  }
}
