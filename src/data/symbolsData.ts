import { TelecomSymbol } from '../types';

export const telecomSymbolsList: TelecomSymbol[] = [
  {
    id: 1,
    nameNepali: 'पोल (Pole)',
    nameEnglish: 'Pole',
    category: 'outside-plant',
    description: 'केबल वा तार बोक्ने खम्बा (स्टिल, कंक्रीट वा काठ)।',
    symbolAsciiOrSvg: '○',
    statusVariants: {
      existing: '○ (कालो गोलो)',
      toInstall: '◌ (डटेड गोलो)',
      dismantled: '⦸ (क्रस गरिएको गोलो)'
    }
  },
  {
    id: 2,
    nameNepali: 'डिस्ट्रिब्युसन प्वाइन्ट (DP)',
    nameEnglish: 'Distribution Point (DP)',
    category: 'outside-plant',
    description: 'ग्राहकतर्फ लाइन वितरण गर्ने टर्मिनल बक्स।',
    symbolAsciiOrSvg: '⊡',
    statusVariants: {
      existing: '⊡ (बक्सभित्र डट)',
      toInstall: '⬚ (डटेड बक्स)',
      dismantled: '⌧ (क्रस बक्स)'
    }
  },
  {
    id: 3,
    nameNepali: 'क्याबिनेट (Cabinet)',
    nameEnglish: 'Distribution Cabinet (CCC / FDC)',
    category: 'outside-plant',
    description: 'मुख्य वितरण क्याबिनेट जहाँ प्राथमिक र सेकेन्डरी नेटवर्क जोडिन्छ।',
    symbolAsciiOrSvg: '⌂',
    statusVariants: {
      existing: '⌂ (अर्धगोलो छाना सहितको क्याबिनेट)',
      toInstall: '⌂ (डटेड क्याबिनेट)',
      dismantled: '⌂̸ (क्रस क्याबिनेट)'
    }
  },
  {
    id: 4,
    nameNepali: 'ज्वाइन्ट / स्प्लाइस (Joint / Splice)',
    nameEnglish: 'Cable Joint / Splice Closure',
    category: 'outside-plant',
    description: 'केबल जोड्ने स्थान जहाँ स्प्लाइसिङ गरिन्छ।',
    symbolAsciiOrSvg: '△',
    statusVariants: {
      existing: '△ (कालो त्रिकोण)',
      toInstall: '▵ (डटेड त्रिकोण)',
      dismantled: '▲̸ (क्रस त्रिकोण)'
    }
  },
  {
    id: 5,
    nameNepali: 'म्यानहोल (Manhole)',
    nameEnglish: 'Underground Manhole Chamber',
    category: 'outside-plant',
    description: 'भूमिगत केबल निरीक्षण, पुलिङ र जोइन्टका लागि ठूलो कोठा।',
    symbolAsciiOrSvg: '⬒',
    statusVariants: {
      existing: '▭ (ठोस आयत)',
      toInstall: '⬚ (डटेड आयत)',
      dismantled: '☒ (क्रस आयत)'
    }
  },
  {
    id: 6,
    nameNepali: 'ह्यान्डहोल (Handhole)',
    nameEnglish: 'Underground Handhole',
    category: 'outside-plant',
    description: 'म्यानहोल भन्दा सानो भूमिगत बक्स जहाँ हातले केबल तानिन्छ।',
    symbolAsciiOrSvg: '▫',
    statusVariants: {
      existing: '▫ (सानो ठोस वर्ग)',
      toInstall: '⬚ (सानो डटेड वर्ग)',
      dismantled: '☒ (क्रस सानो वर्ग)'
    }
  },
  {
    id: 7,
    nameNepali: 'कपर केबल (Copper Cable)',
    nameEnglish: 'Copper Multi-Pair Cable',
    category: 'outside-plant',
    description: 'साधारण टेलिफोन कपर केबल लाइन।',
    symbolAsciiOrSvg: '──────',
    statusVariants: {
      existing: '────── (सीधा ठोस रेखा)',
      toInstall: '- - - - (ड्यास रेखा)',
      dismantled: '──//── (दोहोरो क्रस रेखा)'
    }
  },
  {
    id: 8,
    nameNepali: 'अप्टिकल फाइबर केबल (Optical Fiber Cable)',
    nameEnglish: 'Optical Fiber Cable (OFC)',
    category: 'outside-plant',
    description: 'उच्च गतिको अप्टिकल फाइबर नेटवर्क लाइन।',
    symbolAsciiOrSvg: '══════',
    statusVariants: {
      existing: '══════ (दोहोरो ठोस रेखा)',
      toInstall: '= = = = (दोहोरो ड्यास रेखा)',
      dismantled: '══//══ (क्रस दोहोरो रेखा)'
    }
  },
  {
    id: 9,
    nameNepali: 'टेलिफोन एक्सचेन्ज (Telephone Exchange)',
    nameEnglish: 'Central Office Exchange',
    category: 'outside-plant',
    description: 'टेलिफोन तथा इन्टरनेट सेवा नियन्त्रण गर्ने मुख्य केन्द्र।',
    symbolAsciiOrSvg: '☎',
  },
  {
    id: 10,
    nameNepali: 'अर्थिङ (Ground / Earthing)',
    nameEnglish: 'Earth Ground Connection',
    category: 'electrical-schematic',
    description: 'सर्किट वा उपकरणको सुरक्षात्मक जमिन जडान।',
    symbolAsciiOrSvg: '⏚',
  },
  {
    id: 11,
    nameNepali: 'लाइटनिङ एरेस्टर (Lightning Arrester)',
    nameEnglish: 'Surge Protection Arrester',
    category: 'electrical-schematic',
    description: 'चट्याङ र हाइ भोल्टेज सर्जलाई जमिनमा डिस्चार्ज गर्ने पुर्जा।',
    symbolAsciiOrSvg: '⚡',
  },
  {
    id: 12,
    nameNepali: 'स्प्लिटर (Optical Splitter)',
    nameEnglish: 'PLC Optical Splitter (1:8 / 1:16)',
    category: 'outside-plant',
    description: 'एउटा मुख्य फाइबर कोरको सिग्नल ८ वा १६ ग्राहकमा बाँड्ने उपकरण।',
    symbolAsciiOrSvg: '⬢',
  },
  {
    id: 13,
    nameNepali: 'ओएनयु / मोडेम (ONU / ONT / Modem)',
    nameEnglish: 'Optical Network Unit / Customer Modem',
    category: 'outside-plant',
    description: 'ग्राहकको घरमा रहने अन्तिम उपकरण (ONT/Router)।',
    symbolAsciiOrSvg: '▣',
  },
  {
    id: 14,
    nameNepali: 'रेजिस्टर्स (Resistor)',
    nameEnglish: 'Fixed Resistor',
    category: 'electrical-schematic',
    description: 'करेन्ट प्रवाह नियन्त्रण गर्ने पुर्जा।',
    symbolAsciiOrSvg: '──/\\/\\/\\──',
  },
  {
    id: 15,
    nameNepali: 'क्यापासिटर (Capacitor)',
    nameEnglish: 'Capacitor',
    category: 'electrical-schematic',
    description: 'विद्युतीय चार्ज सञ्चय गर्ने पुर्जा।',
    symbolAsciiOrSvg: '──| |──',
  },
  {
    id: 16,
    nameNepali: 'इन्डक्टर (Inductor)',
    nameEnglish: 'Inductor Coil',
    category: 'electrical-schematic',
    description: 'म्याग्नेटिक फिल्डमा ऊर्जा सञ्चय गर्ने कोइल।',
    symbolAsciiOrSvg: '──((((((──',
  },
  {
    id: 17,
    nameNepali: 'डायोड (Diode)',
    nameEnglish: 'PN Junction Diode',
    category: 'electrical-schematic',
    description: 'करेन्टलाई एकतर्फ मात्र प्रवाह हुन दिने पुर्जा।',
    symbolAsciiOrSvg: '──|>|──',
  },
  {
    id: 18,
    nameNepali: 'ट्रान्सफर्मर (Transformer)',
    nameEnglish: 'AC Step-up / Step-down Transformer',
    category: 'electrical-schematic',
    description: 'AC भोल्टेजको स्तर बढाउने वा घटाउने स्थिर मेसिन।',
    symbolAsciiOrSvg: '──(( ))──(( ))──',
  }
];
