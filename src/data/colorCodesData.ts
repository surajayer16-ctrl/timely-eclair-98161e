import { ColorCodeItem, CopperPairItem } from '../types';

export const nepalTelecom12CoreOFC: ColorCodeItem[] = [
  { number: 1, nepaliName: 'निलो', englishName: 'Blue', hexColor: '#2563eb', textColor: '#ffffff', internationalColor: 'Blue', internationalNepali: 'नीलो', internationalHex: '#2563eb' },
  { number: 2, nepaliName: 'सेतो', englishName: 'White', hexColor: '#f8fafc', textColor: '#0f172a', internationalColor: 'Orange', internationalNepali: 'सुन्तला', internationalHex: '#ea580c' },
  { number: 3, nepaliName: 'पहेंलो', englishName: 'Yellow', hexColor: '#eab308', textColor: '#0f172a', internationalColor: 'Green', internationalNepali: 'हरियो', internationalHex: '#16a34a' },
  { number: 4, nepaliName: 'हरियो', englishName: 'Green', hexColor: '#16a34a', textColor: '#ffffff', internationalColor: 'Brown', internationalNepali: 'खैरो', internationalHex: '#78350f' },
  { number: 5, nepaliName: 'खरानी', englishName: 'Slate / Grey', hexColor: '#64748b', textColor: '#ffffff', internationalColor: 'Slate (Gray)', internationalNepali: 'खरानी (Gray)', internationalHex: '#64748b' },
  { number: 6, nepaliName: 'रातो', englishName: 'Red', hexColor: '#dc2626', textColor: '#ffffff', internationalColor: 'White', internationalNepali: 'सेतो', internationalHex: '#f8fafc' },
  { number: 7, nepaliName: 'सुन्तला', englishName: 'Orange', hexColor: '#ea580c', textColor: '#ffffff', internationalColor: 'Red', internationalNepali: 'रातो', internationalHex: '#dc2626' },
  { number: 8, nepaliName: 'कालो', englishName: 'Black', hexColor: '#0f172a', textColor: '#ffffff', internationalColor: 'Black', internationalNepali: 'कालो', internationalHex: '#0f172a' },
  { number: 9, nepaliName: 'गुलाबी', englishName: 'Pink', hexColor: '#ec4899', textColor: '#ffffff', internationalColor: 'Yellow', internationalNepali: 'पहेंलो', internationalHex: '#eab308' },
  { number: 10, nepaliName: 'बैजनी', englishName: 'Violet / Purple', hexColor: '#7c3aed', textColor: '#ffffff', internationalColor: 'Violet (Purple)', internationalNepali: 'बैजनी (Purple)', internationalHex: '#7c3aed' },
  { number: 11, nepaliName: 'खैरो', englishName: 'Brown', hexColor: '#78350f', textColor: '#ffffff', internationalColor: 'Rose (Pink)', internationalNepali: 'गुलाबी (Pink)', internationalHex: '#ec4899' },
  { number: 12, nepaliName: 'आकाशी निलो', englishName: 'Aqua / Turquoise', hexColor: '#06b6d4', textColor: '#0f172a', internationalColor: 'Aqua (Cyan)', internationalNepali: 'आकाशी नीलो (Cyan)', internationalHex: '#06b6d4' }
];

export const looseTubeColorCodeNepal: { tubeNo: number; colorNepali: string; colorEnglish: string; hex: string }[] = [
  { tubeNo: 1, colorNepali: 'रातो (Red)', colorEnglish: 'Red', hex: '#dc2626' },
  { tubeNo: 2, colorNepali: 'हरियो (Green)', colorEnglish: 'Green', hex: '#16a34a' },
  { tubeNo: 3, colorNepali: 'नीलो (Blue)', colorEnglish: 'Blue', hex: '#2563eb' },
  { tubeNo: 4, colorNepali: 'सेतो (White)', colorEnglish: 'White', hex: '#f8fafc' },
  { tubeNo: 5, colorNepali: 'बैजनी (Violet)', colorEnglish: 'Violet', hex: '#7c3aed' },
  { tubeNo: 6, colorNepali: 'सुन्तला (Orange)', colorEnglish: 'Orange', hex: '#ea580c' },
  { tubeNo: 7, colorNepali: 'खरानी (Grey)', colorEnglish: 'Grey', hex: '#64748b' },
  { tubeNo: 8, colorNepali: 'पहेंलो (Yellow)', colorEnglish: 'Yellow', hex: '#eab308' },
  { tubeNo: 9, colorNepali: 'खैरो (Brown)', colorEnglish: 'Brown', hex: '#78350f' },
  { tubeNo: 10, colorNepali: 'गुलाबी (Pink)', colorEnglish: 'Pink', hex: '#ec4899' },
  { tubeNo: 11, colorNepali: 'कालो (Black)', colorEnglish: 'Black', hex: '#0f172a' },
  { tubeNo: 12, colorNepali: 'आकाशी नीलो (Aqua)', colorEnglish: 'Aqua', hex: '#06b6d4' }
];

export const copper25PairTable: CopperPairItem[] = [
  { pairNo: 1, tipWire: 'White (सेतो)', ringWire: 'Blue (नीलो)', primaryColorHex: '#f8fafc', secondaryColorHex: '#2563eb', binderGroup: 'Group 1' },
  { pairNo: 2, tipWire: 'White (सेतो)', ringWire: 'Orange (सुन्तला)', primaryColorHex: '#f8fafc', secondaryColorHex: '#ea580c', binderGroup: 'Group 1' },
  { pairNo: 3, tipWire: 'White (सेतो)', ringWire: 'Green (हरियो)', primaryColorHex: '#f8fafc', secondaryColorHex: '#16a34a', binderGroup: 'Group 1' },
  { pairNo: 4, tipWire: 'White (सेतो)', ringWire: 'Brown (खैरो)', primaryColorHex: '#f8fafc', secondaryColorHex: '#78350f', binderGroup: 'Group 1' },
  { pairNo: 5, tipWire: 'White (सेतो)', ringWire: 'Grey / Slate (खरानी)', primaryColorHex: '#f8fafc', secondaryColorHex: '#64748b', binderGroup: 'Group 1' },
  { pairNo: 6, tipWire: 'Red (रातो)', ringWire: 'Blue (नीलो)', primaryColorHex: '#dc2626', secondaryColorHex: '#2563eb', binderGroup: 'Group 1' },
  { pairNo: 7, tipWire: 'Red (रातो)', ringWire: 'Orange (सुन्तला)', primaryColorHex: '#dc2626', secondaryColorHex: '#ea580c', binderGroup: 'Group 1' },
  { pairNo: 8, tipWire: 'Red (रातो)', ringWire: 'Green (हरियो)', primaryColorHex: '#dc2626', secondaryColorHex: '#16a34a', binderGroup: 'Group 1' },
  { pairNo: 9, tipWire: 'Red (रातो)', ringWire: 'Brown (खैरो)', primaryColorHex: '#dc2626', secondaryColorHex: '#78350f', binderGroup: 'Group 1' },
  { pairNo: 10, tipWire: 'Red (रातो)', ringWire: 'Grey / Slate (खरानी)', primaryColorHex: '#dc2626', secondaryColorHex: '#64748b', binderGroup: 'Group 1' },
  { pairNo: 11, tipWire: 'Black (कालो)', ringWire: 'Blue (नीलो)', primaryColorHex: '#0f172a', secondaryColorHex: '#2563eb', binderGroup: 'Group 2' },
  { pairNo: 12, tipWire: 'Black (कालो)', ringWire: 'Orange (सुन्तला)', primaryColorHex: '#0f172a', secondaryColorHex: '#ea580c', binderGroup: 'Group 2' },
  { pairNo: 13, tipWire: 'Black (कालो)', ringWire: 'Green (हरियो)', primaryColorHex: '#0f172a', secondaryColorHex: '#16a34a', binderGroup: 'Group 2' },
  { pairNo: 14, tipWire: 'Black (कालो)', ringWire: 'Brown (खैरो)', primaryColorHex: '#0f172a', secondaryColorHex: '#78350f', binderGroup: 'Group 2' },
  { pairNo: 15, tipWire: 'Black (कालो)', ringWire: 'Grey / Slate (खरानी)', primaryColorHex: '#0f172a', secondaryColorHex: '#64748b', binderGroup: 'Group 2' },
  { pairNo: 16, tipWire: 'Yellow (पहेंलो)', ringWire: 'Blue (नीलो)', primaryColorHex: '#eab308', secondaryColorHex: '#2563eb', binderGroup: 'Group 2' },
  { pairNo: 17, tipWire: 'Yellow (पहेंलो)', ringWire: 'Orange (सुन्तला)', primaryColorHex: '#eab308', secondaryColorHex: '#ea580c', binderGroup: 'Group 2' },
  { pairNo: 18, tipWire: 'Yellow (पहेंलो)', ringWire: 'Green (हरियो)', primaryColorHex: '#eab308', secondaryColorHex: '#16a34a', binderGroup: 'Group 2' },
  { pairNo: 19, tipWire: 'Yellow (पहेंलो)', ringWire: 'Brown (खैरो)', primaryColorHex: '#eab308', secondaryColorHex: '#78350f', binderGroup: 'Group 2' },
  { pairNo: 20, tipWire: 'Yellow (पहेंलो)', ringWire: 'Grey / Slate (खरानी)', primaryColorHex: '#eab308', secondaryColorHex: '#64748b', binderGroup: 'Group 2' },
  { pairNo: 21, tipWire: 'Violet (बैजनी)', ringWire: 'Blue (नीलो)', primaryColorHex: '#7c3aed', secondaryColorHex: '#2563eb', binderGroup: 'Group 3' },
  { pairNo: 22, tipWire: 'Violet (बैजनी)', ringWire: 'Orange (सुन्तला)', primaryColorHex: '#7c3aed', secondaryColorHex: '#ea580c', binderGroup: 'Group 3' },
  { pairNo: 23, tipWire: 'Violet (बैजनी)', ringWire: 'Green (हरियो)', primaryColorHex: '#7c3aed', secondaryColorHex: '#16a34a', binderGroup: 'Group 3' },
  { pairNo: 24, tipWire: 'Violet (बैजनी)', ringWire: 'Brown (खैरो)', primaryColorHex: '#7c3aed', secondaryColorHex: '#78350f', binderGroup: 'Group 3' },
  { pairNo: 25, tipWire: 'Violet (बैजनी)', ringWire: 'Grey / Slate (खरानी)', primaryColorHex: '#7c3aed', secondaryColorHex: '#64748b', binderGroup: 'Group 3' },
];

export const binderRibbonColorCode: { pairRange: string; colorNepali: string; hex: string }[] = [
  { pairRange: '१ – १० पेयर', colorNepali: 'नीलो (Blue)', hex: '#2563eb' },
  { pairRange: '११ – २० पेयर', colorNepali: 'सुन्तला (Orange)', hex: '#ea580c' },
  { pairRange: '२१ – ३० पेयर', colorNepali: 'हरियो (Green)', hex: '#16a34a' },
  { pairRange: '३१ – ४० पेयर', colorNepali: 'खैरो (Brown)', hex: '#78350f' },
  { pairRange: '४१ – ५० पेयर', colorNepali: 'खरानी (Grey)', hex: '#64748b' },
  { pairRange: '५१ – ६० पेयर', colorNepali: 'नीलो + रातो (Blue + Red)', hex: '#2563eb' },
  { pairRange: '६१ – ७० पेयर', colorNepali: 'सुन्तला + रातो (Orange + Red)', hex: '#ea580c' },
  { pairRange: '७१ – ८० पेयर', colorNepali: 'हरियो + रातो (Green + Red)', hex: '#16a34a' },
  { pairRange: '८१ – ९० पेयर', colorNepali: 'खैरो + रातो (Brown + Red)', hex: '#78350f' },
  { pairRange: '९१ – १०० पेयर', colorNepali: 'खरानी + रातो (Grey + Red)', hex: '#64748b' },
];

// NTC Official 10-Pair Cable Splice Color Code
export const copper10PairColorCode = [
  { pairNo: 1, colorEnglish: 'Blue + White', colorNepali: 'निलो + सेतो', primaryHex: '#2563eb', secondaryHex: '#f8fafc' },
  { pairNo: 2, colorEnglish: 'Orange + White', colorNepali: 'सुन्तला + सेतो', primaryHex: '#ea580c', secondaryHex: '#f8fafc' },
  { pairNo: 3, colorEnglish: 'Green + White', colorNepali: 'हरियो + सेतो', primaryHex: '#16a34a', secondaryHex: '#f8fafc' },
  { pairNo: 4, colorEnglish: 'Brown + White', colorNepali: 'खैरो + सेतो', primaryHex: '#78350f', secondaryHex: '#f8fafc' },
  { pairNo: 5, colorEnglish: 'Slate + White', colorNepali: 'खरानी + सेतो', primaryHex: '#64748b', secondaryHex: '#f8fafc' },
  { pairNo: 6, colorEnglish: 'Blue + Red', colorNepali: 'निलो + रातो', primaryHex: '#2563eb', secondaryHex: '#dc2626' },
  { pairNo: 7, colorEnglish: 'Orange + Red', colorNepali: 'सुन्तला + रातो', primaryHex: '#ea580c', secondaryHex: '#dc2626' },
  { pairNo: 8, colorEnglish: 'Green + Red', colorNepali: 'हरियो + रातो', primaryHex: '#16a34a', secondaryHex: '#dc2626' },
  { pairNo: 9, colorEnglish: 'Brown + Red', colorNepali: 'खैरो + रातो', primaryHex: '#78350f', secondaryHex: '#dc2626' },
  { pairNo: 10, colorEnglish: 'Slate + Red', colorNepali: 'खरानी + रातो', primaryHex: '#64748b', secondaryHex: '#dc2626' },
];

export const superUnitGroups150Pair: { groupNo: number; groupBinderColor: string; pairRange: string }[] = [
  { groupNo: 1, groupBinderColor: 'नीलो (Blue)', pairRange: '१ देखि ५० पेयर (1 - 50)' },
  { groupNo: 2, groupBinderColor: 'सुन्तला (Orange)', pairRange: '५१ देखि १०० पेयर (51 - 100)' },
  { groupNo: 3, groupBinderColor: 'हरियो (Green)', pairRange: '१०१ देखि १५० पेयर (101 - 150)' }
];

// NTC Official 300 Pair Cable Group Binder
export const groupBinder300Pair = [
  { groupNo: 1, groupColor: 'निलो (Blue)', pairRange: '१ देखि ५० सम्म (1-50 Pairs)' },
  { groupNo: 2, groupColor: 'सुन्तला (Orange)', pairRange: '५१ देखि १०० सम्म (51-100 Pairs)' },
  { groupNo: 3, groupColor: 'हरियो (Green)', pairRange: '१०१ देखि १५० सम्म (101-150 Pairs)' },
  { groupNo: 4, groupColor: 'खैरो (Brown)', pairRange: '१५१ देखि २०० सम्म (151-200 Pairs)' },
  { groupNo: 5, groupColor: 'खरानी (Slate)', pairRange: '२०१ देखि २५० सम्म (201-250 Pairs)' },
  { groupNo: 6, groupColor: 'निलो रातो (Blue + Red)', pairRange: '२५१ देखि ३०० सम्म (251-300 Pairs)' },
];

// NTC Official 600 Pair Cable Group Binder
export const groupBinder600Pair = [
  { groupNo: 1, groupColor: 'निलो (Blue)', pairRange: '१ देखि १०० सम्म (1-100 Pairs)' },
  { groupNo: 2, groupColor: 'सुन्तला (Orange)', pairRange: '१०१ देखि २०० सम्म (101-200 Pairs)' },
  { groupNo: 3, groupColor: 'हरियो (Green)', pairRange: '२०१ देखि ३०० सम्म (201-300 Pairs)' },
  { groupNo: 4, groupColor: 'खैरो (Brown)', pairRange: '३०१ देखि ४०० सम्म (301-400 Pairs)' },
  { groupNo: 5, groupColor: 'खरानी (Slate)', pairRange: '४०१ देखि ५०० सम्म (401-500 Pairs)' },
  { groupNo: 6, groupColor: 'निलो रातो (Blue + Red)', pairRange: '५०१ देखि ६०० सम्म (501-600 Pairs)' },
];

// NTC Underground Cable Color Code (1800 Pairs Standard)
export const underground1800PairGroupBinders = [
  { sn: 1, groupBinder: 'निलो (Blue)', unitNumber: '१ देखि १०', pairNumber: '१ देखि १०० (1-100 Pairs)' },
  { sn: 2, groupBinder: 'सुन्तला (Orange)', unitNumber: '११ देखि २०', pairNumber: '१०१ देखि २०० (101-200 Pairs)' },
  { sn: 3, groupBinder: 'हरियो (Green)', unitNumber: '२१ देखि ३०', pairNumber: '२०१ देखि ३०० (201-300 Pairs)' },
  { sn: 4, groupBinder: 'खैरो (Brown)', unitNumber: '३१ देखि ४०', pairNumber: '३०१ देखि ४०० (301-400 Pairs)' },
  { sn: 5, groupBinder: 'खरानी (Slate)', unitNumber: '४१ देखि ५०', pairNumber: '४०१ देखि ५०० (401-500 Pairs)' },
  { sn: 6, groupBinder: 'रातो निलो (Red + Blue)', unitNumber: '५१ देखि ६०', pairNumber: '५०१ देखि ६०० (501-600 Pairs)' },
  { sn: 7, groupBinder: 'रातो सुन्तला (Red + Orange)', unitNumber: '६१ देखि ७०', pairNumber: '६०१ देखि ७०० (601-700 Pairs)' },
  { sn: 8, groupBinder: 'रातो हरियो (Red + Green)', unitNumber: '७१ देखि ८०', pairNumber: '७०१ देखि ८०० (701-800 Pairs)' },
  { sn: 9, groupBinder: 'रातो खैरो (Red + Brown)', unitNumber: '८१ देखि ९०', pairNumber: '८०१ देखि ९०० (801-900 Pairs)' },
  { sn: 10, groupBinder: 'रातो खरानी (Red + Slate)', unitNumber: '९१ देखि १००', pairNumber: '९०१ देखि १००० (901-1000 Pairs)' },
  { sn: 11, groupBinder: 'सेतो निलो (White + Blue)', unitNumber: '१०१ देखि ११०', pairNumber: '१००१ देखि ११०० (1001-1100 Pairs)' },
  { sn: 12, groupBinder: 'सेतो सुन्तला (White + Orange)', unitNumber: '१११ देखि १२०', pairNumber: '११०१ देखि १२०० (1101-1200 Pairs)' },
  { sn: 13, groupBinder: 'सेतो हरियो (White + Green)', unitNumber: '१२१ देखि १३०', pairNumber: '१२०१ देखि १३०० (1201-1300 Pairs)' },
  { sn: 14, groupBinder: 'सेतो खैरो (White + Brown)', unitNumber: '१३१ देखि १४०', pairNumber: '१३०१ देखि १४०० (1301-1400 Pairs)' },
  { sn: 15, groupBinder: 'सेतो खरानी (White + Slate)', unitNumber: '१४१ देखि १५०', pairNumber: '१४०१ देखि १५०० (1401-1500 Pairs)' },
  { sn: 16, groupBinder: 'कालो निलो (Black + Blue)', unitNumber: '१५१ देखि १६०', pairNumber: '१५०१ देखि १६०० (1501-1600 Pairs)' },
  { sn: 17, groupBinder: 'कालो सुन्तला (Black + Orange)', unitNumber: '१६१ देखि १७०', pairNumber: '१६०१ देखि १७०० (1601-1700 Pairs)' },
  { sn: 18, groupBinder: 'कालो हरियो (Black + Green)', unitNumber: '१७१ देखि १८०', pairNumber: '१७०१ देखि १८०० (1800 Pairs)' },
];

// Cable Sheath Stripping Length Standard (केबलको शिथ निकाल्ने नाप)
export const cableSheathStrippingLengths = [
  { pairRange: '१०, २०, ३० पेयर केबल', strippingLength: '३० से.मी. (30 cm)' },
  { pairRange: '५०, ७०, १००, १५० पेयर केबल', strippingLength: '४३ से.मी. (43 cm)' },
  { pairRange: '१५० देखि ९०० पेयर सम्म केबल', strippingLength: '४७ से.मी. (47 cm)' },
  { pairRange: '१२०० देखि १८०० पेयर केबल', strippingLength: '५० से.मी. (50 cm)' },
];

export const copperSpliceRulesNotice = 'केबल स्प्लाईस गर्दा कलर कोड अनुसार स्प्लाईस गर्नु पर्ने छ। कलर कोड अनुसार स्प्लाईस नगरेमा क्रस टक (Cross Talk) मानिनेछ।';

