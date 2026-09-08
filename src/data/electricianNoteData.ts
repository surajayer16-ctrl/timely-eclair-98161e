export interface ElectricianLesson {
  day: string;
  dayNumber: number;
  title: string;
  nepaliTitle: string;
  duration: string;
  objective: string;
  category: 'foundation' | 'tools' | 'circuits' | 'safety' | 'symbols' | 'cables' | 'practicals';
  imageUrl?: string;
  imageCaption?: string;
  images?: { url: string; caption?: string }[];
  tableRows: {
    sn: string;
    activity: string;
    method: string;
    materials: string;
    duration: string;
  }[];
  contentSections: {
    heading: string;
    text: string;
    bullets?: string[];
    imageUrl?: string;
    imageCaption?: string;
    diagramType?: 'dc-waveform' | 'ac-waveform' | 'atom-structure' | 'ohms-law-triangle' | 'circuit-types' | 'wire-joints' | 'symbols-table' | 'wire-table' | 'practical-circuit' | 'power-socket';
    practicalId?: number;
    subNotes?: string[];
  }[];
  homework: string[];
}

export interface ElectricSymbolItem {
  sn: number;
  nameNep: string;
  nameEng: string;
  layoutSymbolType: string;
  wiringSymbolType: string;
  description: string;
  imageUrl?: string;
}

export interface WireCapacityRow {
  swg: string;
  sqmm: string;
  singlePhaseCu: string;
  singlePhaseAl: string;
  threePhaseCu: string;
  threePhaseAl: string;
}

export interface PracticalCircuit {
  id: number;
  practicalNo: number;
  day: string;
  title: string;
  condition: string;
  controlBy: string;
  description: string;
  components: string[];
  materials: string[];
  fuses: string[];
  switches: string[];
  loads: string[];
  circuitLogic: string;
  imageUrl?: string;
  imageCaption?: string;
}

// 64 Electrical symbols from pages 34-36
export const electricalSymbolsList: ElectricSymbolItem[] = [
  { sn: 1, nameNep: 'वान वे स्वीच', nameEng: 'One Way Switch (Single Pole)', layoutSymbolType: '1way-switch', wiringSymbolType: '1way-wiring', description: 'एकतर्फी विद्युत प्रवाह नियन्त्रण गर्ने सामान्य १-वे स्विच' },
  { sn: 2, nameNep: 'टु वे स्वीच', nameEng: 'Two Way Switch', layoutSymbolType: '2way-switch', wiringSymbolType: '2way-wiring', description: 'दुई स्थानबाट एउटा बत्ती वा लोड नियन्त्रण गर्न मिल्ने स्विच' },
  { sn: 3, nameNep: 'डबल पोल वान वे स्वीच', nameEng: 'Double Pole One Way Switch (DPST)', layoutSymbolType: 'dp-1way', wiringSymbolType: 'dp-1way-wire', description: 'फेज र न्युट्रल दुवै एकैपटक काट्ने वा जोड्ने २-पोल स्विच' },
  { sn: 4, nameNep: 'थ्री पोल वान वे स्वीच', nameEng: 'Three Pole One Way Switch (TPST)', layoutSymbolType: 'tp-1way', wiringSymbolType: 'tp-1way-wire', description: 'थ्री-फेज लाइन नियन्त्रण गर्न प्रयोग हुने ३-पोल स्विच' },
  { sn: 5, nameNep: 'क्रस वे (ईन्टरमिडिएट) स्वीच', nameEng: 'Cross Way / Intermediate Switch', layoutSymbolType: 'intermediate-switch', wiringSymbolType: 'intermediate-wire', description: 'तीन वा सोभन्दा बढी स्थानबाट बत्ती नियन्त्रण गर्न प्रयोग गरिने ४-टर्मिनल स्विच' },
  { sn: 6, nameNep: 'बेल पुश स्वीच', nameEng: 'Bell Push Switch', layoutSymbolType: 'bell-push', wiringSymbolType: 'bell-push-wire', description: 'थिच्दा मात्र सम्पर्क हुने र छोड्दा छुट्ने स्प्रिङयुक्त कलिङ बेल स्विच' },
  { sn: 7, nameNep: 'M.C.B.', nameEng: 'Miniature Circuit Breaker (MCB)', layoutSymbolType: 'mcb', wiringSymbolType: 'mcb-wire', description: 'ओभरलोड र सर्ट सर्किटबाट सुरक्षा दिने स्वतः ट्रिप हुने सुरक्षात्मक उपकरण' },
  { sn: 8, nameNep: 'फ्युज', nameEng: 'Fuse', layoutSymbolType: 'fuse', wiringSymbolType: 'fuse-wire', description: 'अत्यधिक करेन्ट बहँदा पग्लिएर सर्किट विच्छेद गर्ने तारयुक्त सुरक्षात्मक युक्ति' },
  { sn: 9, nameNep: 'बल्ब', nameEng: 'Lamp / Bulb', layoutSymbolType: 'lamp', wiringSymbolType: 'lamp-wire', description: 'विद्युत उर्जालाई प्रकाशमा रूपान्तरण गर्ने बत्ती' },
  { sn: 10, nameNep: 'ईन्डिकेटर', nameEng: 'Indicator Lamp', layoutSymbolType: 'indicator', wiringSymbolType: 'indicator-wire', description: 'सर्किटमा भोल्टेज वा करेन्ट उपस्थित छ भनी देखाउने सानो नियन्त्रक बत्ती' },
  { sn: 11, nameNep: 'टु पिन सकेट', nameEng: 'Two Pin Socket', layoutSymbolType: '2pin-socket', wiringSymbolType: '2pin-wire', description: 'फेज र न्युट्रल मात्र जोडिने २-पिनको पोर्टेबल लोड सकेट' },
  { sn: 12, nameNep: 'थ्री पिन सकेट', nameEng: 'Three Pin Socket', layoutSymbolType: '3pin-socket', wiringSymbolType: '3pin-wire', description: 'फेज, न्युट्रल र सुरक्षात्मक अर्थिङ टर्मिनल भएको ३-पिन सकेट' },
  { sn: 13, nameNep: 'पावर सकेट', nameEng: 'Power Socket (16A)', layoutSymbolType: 'power-socket', wiringSymbolType: 'power-wire', description: 'हिटर, फ्रिज, मोटर जस्ता भारी भार (५A देखि १६A) चलाउन प्रयोग गरिने बलियो सकेट' },
  { sn: 14, nameNep: 'एम्पीयर मिटर', nameEng: 'Ammeter (Ampere Meter)', layoutSymbolType: 'ammeter', wiringSymbolType: 'ammeter-wire', description: 'सर्किटमा बहने विद्युतधारा (करेन्ट) नाप्न सिरिजमा जोडिने मिटर' },
  { sn: 15, nameNep: 'रजिस्टर', nameEng: 'Resistor', layoutSymbolType: 'resistor', wiringSymbolType: 'resistor-wire', description: 'विद्युतधाराको प्रवाहमा निश्चित रुकावट (प्रतिरोध) खडा गर्ने अङ्ग' },
  { sn: 16, nameNep: 'भोल्टमिटर', nameEng: 'Voltmeter', layoutSymbolType: 'voltmeter', wiringSymbolType: 'voltmeter-wire', description: 'दुई बिन्दुबीचको विद्युतिय चाप (Potential Difference) नाप्न समानान्तरमा जोडिने मिटर' },
  { sn: 17, nameNep: 'ए.सी. घण्टी', nameEng: 'AC Electric Bell', layoutSymbolType: 'ac-bell', wiringSymbolType: 'ac-bell-wire', description: 'AC विद्युतबाट चल्ने इलेक्ट्रोमेकानिकल ध्वनी घण्टी' },
  { sn: 18, nameNep: 'हिटर', nameEng: 'Heater Element', layoutSymbolType: 'heater', wiringSymbolType: 'heater-wire', description: 'विद्युत उर्जालाई तातोमा रूपान्तरण गर्ने नाइक्रोम कोइल हिटर' },
  { sn: 19, nameNep: 'इलेक्ट्रोलाईटिक क्यापासिटर', nameEng: 'Electrolytic Capacitor', layoutSymbolType: 'elec-cap', wiringSymbolType: 'elec-cap-wire', description: 'ध्रुवीय (+ र -) चिन्ह भएको उच्च क्षमताको डाइलेक्ट्रिक क्यापासिटर' },
  { sn: 20, nameNep: 'फेज लाईन', nameEng: 'Phase / Live Line (P)', layoutSymbolType: 'phase-line', wiringSymbolType: 'phase-wire', description: 'विद्युतिय करेन्ट ल्याउने मुख्य लाइन तार' },
  { sn: 21, nameNep: 'न्युट्रल लाईन', nameEng: 'Neutral Line (N)', layoutSymbolType: 'neutral-line', wiringSymbolType: 'neutral-wire', description: 'विद्युत करेन्टको फिर्ती बाटो (Return path, 0V Potential)' },
  { sn: 22, nameNep: 'अर्थिङ लाईन', nameEng: 'Earth Line (E)', layoutSymbolType: 'earth-line', wiringSymbolType: 'earth-wire', description: 'सर्ट वा लिकेज हुँदा जमिनमा करेन्ट पठाएर ज्यान जोगाउने सुरक्षात्मक तार' },
  { sn: 23, nameNep: 'टु वे स्वीच (वैकल्पिक)', nameEng: 'Two Way Switch (Symbol 2)', layoutSymbolType: '2way-alt', wiringSymbolType: '2way-alt-wire', description: 'टु वे स्विचको सिधा/क्रस कन्ट्याक्ट संकेत' },
  { sn: 24, nameNep: 'D.P. M.C.B.', nameEng: 'Double Pole MCB', layoutSymbolType: 'dp-mcb', wiringSymbolType: 'dp-mcb-wire', description: 'फेज र न्युट्रल दुवैलाई एकैसाथ आइसोलेट गर्ने डबल पोल एमसीबी' },
  { sn: 25, nameNep: 'पाईप वायरिङ', nameEng: 'Conduit Pipe Wiring', layoutSymbolType: 'pipe-wiring', wiringSymbolType: 'pipe-wire', description: 'कन्ड्युट पाइपभित्रबाट तार गुजारिएको संकेत' },
  { sn: 26, nameNep: 'अन्डर ग्राउण्ड', nameEng: 'Underground System', layoutSymbolType: 'ug-system', wiringSymbolType: 'ug-wire', description: 'जमिन मुनि गाडिएको कन्ड्युट वा केबल वितरण' },
  { sn: 27, nameNep: 'स्याडल', nameEng: 'Saddle Clamp', layoutSymbolType: 'saddle', wiringSymbolType: 'saddle-wire', description: 'कन्ड्युट पाइपलाई भित्तामा कसी अड्याउने अर्धवृत्ताकार क्ल्याम्प' },
  { sn: 28, nameNep: 'ट्रान्सफर्मर', nameEng: 'Transformer', layoutSymbolType: 'transformer', wiringSymbolType: 'transformer-wire', description: 'पारस्परिक प्रेरण (Mutual Induction) बाट भोल्टेज बढाउने वा घटाउने यन्त्र' },
  { sn: 29, nameNep: 'फ्रिक्वेन्सी मिटर', nameEng: 'Frequency Meter (Hz)', layoutSymbolType: 'freq-meter', wiringSymbolType: 'freq-wire', description: 'AC विद्युतको प्रति सेकेन्ड चक्र संख्या (हर्ज) नाप्ने मिटर' },
  { sn: 30, nameNep: 'वाट मिटर', nameEng: 'Wattmeter', layoutSymbolType: 'wattmeter', wiringSymbolType: 'watt-wire', description: 'उपकरणले खपत गरेको वास्तविक विद्युतिय शक्ति (Power) नाप्ने मिटर' },
  { sn: 31, nameNep: 'च्यासेज अर्थिङ', nameEng: 'Chassis Earth', layoutSymbolType: 'chassis-earth', wiringSymbolType: 'chassis-wire', description: 'उपकरणको धातुको बडी वा ढाँचालाई दिइने स्थानीय अर्थिङ' },
  { sn: 32, nameNep: 'थ्री फेज मोटर', nameEng: 'Three Phase AC Motor', layoutSymbolType: '3phase-motor', wiringSymbolType: '3p-motor-wire', description: '३-फेज ४०० भोल्टबाट चल्ने इन्डक्सन मोटर' },
  { sn: 33, nameNep: 'A.C.', nameEng: 'Alternating Current (AC)', layoutSymbolType: 'ac-symbol', wiringSymbolType: 'ac-wire', description: 'दिशा र मान समय अनुसार बदलिने प्रत्यावर्ती धारा' },
  { sn: 34, nameNep: 'D.C.', nameEng: 'Direct Current (DC)', layoutSymbolType: 'dc-symbol', wiringSymbolType: 'dc-wire', description: 'सधैं एउटै दिशामा बहने एकदिशात्मक धारा' },
  { sn: 35, nameNep: 'D.B. बक्स', nameEng: 'Distribution Board (DB Box)', layoutSymbolType: 'db-box', wiringSymbolType: 'db-wire', description: 'मुख्य सप्लाईलाई विभिन्न उप-परिपथ (Sub-circuits) मा बाँड्ने वितरण बोर्ड' },
  { sn: 36, nameNep: 'टेलिफोन सकेट', nameEng: 'Telephone RJ11 Socket', layoutSymbolType: 'tel-socket', wiringSymbolType: 'tel-wire', description: 'टेलिफोन लाइन जोड्न प्रयोग हुने RJ11 वाल आउटलेट' },
  { sn: 37, nameNep: 'T.V. सकेट', nameEng: 'Television Coaxial Socket', layoutSymbolType: 'tv-socket', wiringSymbolType: 'tv-wire', description: 'टिभी एन्टेना वा केबल जोड्ने कोएक्सियल आउटलेट' },
  { sn: 38, nameNep: 'जक्सन बक्स', nameEng: 'Junction Box', layoutSymbolType: 'junction-box', wiringSymbolType: 'junc-wire', description: 'विभिन्न दिशाबाट आउने तारहरूलाई सुरक्षित जडान र शाखा निकाल्ने बक्स' },
  { sn: 39, nameNep: 'KWH मिटर', nameEng: 'Energy Meter (KWh Meter)', layoutSymbolType: 'kwh-meter', wiringSymbolType: 'kwh-wire', description: 'घर वा उद्योगमा खपत भएको युनिट (किलोवाट घण्टा) नाप्ने विद्युत मिटर' },
  { sn: 40, nameNep: 'ब्याट्री', nameEng: 'DC Battery', layoutSymbolType: 'battery', wiringSymbolType: 'battery-wire', description: 'रासायनिक शक्तिलाई DC विद्युतमा बदल्ने सेलहरूको समूह (+ र - टर्मिनल)' },
  { sn: 41, nameNep: 'वायरिङ', nameEng: 'General Wiring Line', layoutSymbolType: 'wiring-line', wiringSymbolType: 'wiring-wire', description: 'नक्सामा तार तान्ने बाटो जनाउने गाढा कालो रेखा' },
  { sn: 42, nameNep: 'अण्डरग्राउण्ड (चिन्ह)', nameEng: 'Underground Earth Bed', layoutSymbolType: 'ug-bed', wiringSymbolType: 'ug-bed-wire', description: 'जमिन मुनिको अर्थिङ खाडल वा प्लेट' },
  { sn: 43, nameNep: 'अर्थिङ', nameEng: 'Earth Ground', layoutSymbolType: 'earth-ground', wiringSymbolType: 'earth-ground-wire', description: '३ तेर्सो घट्दो रेखाहरू भएको मानक अर्थिङ चिन्ह' },
  { sn: 44, nameNep: 'जोडिएको तार', nameEng: 'Connected Wire Junction', layoutSymbolType: 'connected-wire', wiringSymbolType: 'conn-wire', description: 'दुई वा बढी तारहरू आपसमा विद्युतीय रूपमा जोडिएको संगम बिन्दु (ठोस थोप्लो)' },
  { sn: 45, nameNep: 'नाघेको तार (क्रस तार)', nameEng: 'Crossing Wire (No Connection)', layoutSymbolType: 'cross-wire', wiringSymbolType: 'cross-wire-jump', description: 'एक अर्कालाई नाघेर गएको तर विद्युतिय सम्पर्क नभएको क्रसिङ जम्पर' },
  { sn: 46, nameNep: 'वाल फ्यान', nameEng: 'Wall Bracket Fan', layoutSymbolType: 'wall-fan', wiringSymbolType: 'wall-fan-wire', description: 'भित्तामा झुण्ड्याइने विद्युतिय पङ्खा' },
  { sn: 47, nameNep: 'मल्टि सकेट', nameEng: 'Multi Pin Universal Socket', layoutSymbolType: 'multi-socket', wiringSymbolType: 'multi-wire', description: 'विभिन्न देशका २-पिन र ३-पिन प्लगहरू मिल्ने युनिभर्सल सकेट' },
  { sn: 48, nameNep: 'स्वीच + सकेट', nameEng: 'Switch Combined with Socket', layoutSymbolType: 'switch-socket', wiringSymbolType: 'sw-sock-wire', description: 'एउटै बोर्डमा स्विच र सकेट सँगै जोडिएको युनिट' },
  { sn: 49, nameNep: 'सिलिङ फ्यान', nameEng: 'Ceiling Fan', layoutSymbolType: 'ceiling-fan', wiringSymbolType: 'ceil-wire', description: 'कोठाको छतमा झुण्ड्याइने सिलिङ पंखा' },
  { sn: 50, nameNep: 'सादा क्यापासिटर', nameEng: 'Fixed Non-Polar Capacitor', layoutSymbolType: 'fixed-cap', wiringSymbolType: 'fixed-cap-wire', description: 'कुनै ध्रुव नभएको सिरेमिक वा माइका क्यापासिटर' },
  { sn: 51, nameNep: 'डोम लाईट', nameEng: 'Dome Light (Single Lamp in Dome)', layoutSymbolType: 'dome-light', wiringSymbolType: 'dome-wire', description: 'गोलाकार सिसाको कभर भएको डोम बत्ती' },
  { sn: 52, nameNep: 'डबल लाईट', nameEng: 'Double Light Fitting', layoutSymbolType: 'double-light', wiringSymbolType: 'dbl-wire', description: 'एउटै फिक्सरमा दुईवटा बत्ती जडान भएको' },
  { sn: 53, nameNep: 'वासिङ मेसिन', nameEng: 'Washing Machine Outlet', layoutSymbolType: 'wash-machine', wiringSymbolType: 'wash-wire', description: 'लुगा धुने मेसिनको लागि निर्धारित विद्युत बिन्दु' },
  { sn: 54, nameNep: 'थ्री फेज', nameEng: 'Three Phase System (3Φ)', layoutSymbolType: '3phase-sys', wiringSymbolType: '3p-sys-wire', description: 'तीनवटा फेज तार र १ न्युट्रल भएको ४०० भोल्ट आपूर्ति' },
  { sn: 55, nameNep: 'ट्युवलाईट', nameEng: 'Single Fluorescent Tube Light', layoutSymbolType: 'tubelight', wiringSymbolType: 'tube-wire', description: 'एकल फ्लोरोसेन्ट ट्युबलाइट फिक्स्चर' },
  { sn: 56, nameNep: 'डबल ट्युवलाईट', nameEng: 'Twin Fluorescent Tube Light', layoutSymbolType: 'twin-tube', wiringSymbolType: 'twin-wire', description: 'दुईवटा ट्युबलाइट सँगै भएको ट्विन फिक्स्चर' },
  { sn: 57, nameNep: 'प्लास्टर भित्र', nameEng: 'Concealed Under Plaster', layoutSymbolType: 'plaster-wiring', wiringSymbolType: 'plaster-wire', description: 'भित्ताको प्लास्टरमुनि लुकाएर गरिएको वाइरिङ' },
  { sn: 58, nameNep: 'भेरिएबल रजिस्टर', nameEng: 'Variable Resistor / Rheostat', layoutSymbolType: 'var-resistor', wiringSymbolType: 'var-res-wire', description: 'मान परिवर्तन गर्न मिल्ने पोटेन्सियोमिटर वा रियोस्ट्याट' },
  { sn: 59, nameNep: 'डायोड', nameEng: 'Semiconductor PN Diode', layoutSymbolType: 'diode', wiringSymbolType: 'diode-wire', description: 'एनोडबाट क्याथोडतर्फ मात्र करेन्ट प्रवाह दिने अर्धचालक' },
  { sn: 60, nameNep: 'मोटर', nameEng: 'Electric Motor (General)', layoutSymbolType: 'motor', wiringSymbolType: 'motor-wire', description: 'विद्युत उर्जालाई यान्त्रिक गतिमा बदल्ने मोटर' },
  { sn: 61, nameNep: 'जेनेरेटर', nameEng: 'Electric Generator', layoutSymbolType: 'generator', wiringSymbolType: 'gen-wire', description: 'यान्त्रिक उर्जालाई विद्युत उर्जामा बदल्ने जेनेरेटर' },
  { sn: 62, nameNep: 'कोएक्सल केवल', nameEng: 'Coaxial Cable', layoutSymbolType: 'coax-cable', wiringSymbolType: 'coax-wire', description: 'भित्री कन्डक्टर र बाहिरी सिल्ड जाली भएको उच्च फ्रिक्वेन्सी केबल' },
  { sn: 63, nameNep: 'डि.सी. मोटर', nameEng: 'DC Motor', layoutSymbolType: 'dc-motor', wiringSymbolType: 'dc-motor-wire', description: 'डिसी करेन्टबाट घुम्ने मोटर' },
  { sn: 64, nameNep: 'ट्रान्जिस्टर', nameEng: 'Bipolar Junction Transistor (BJT)', layoutSymbolType: 'transistor', wiringSymbolType: 'trans-wire', description: 'एम्प्लिफायर र इलेक्ट्रोनिक स्विचको रूपमा काम गर्ने सेमीकन्डक्टर' }
];

// Current Rating in Different PVC Insulated Wire Table (Page 42)
export const wireCapacityTable: WireCapacityRow[] = [
  { swg: '1/18 (1/.044)', sqmm: '1.16', singlePhaseCu: '12', singlePhaseAl: '-----', threePhaseCu: '12', threePhaseAl: '-----' },
  { swg: '3/22 (3/.028)', sqmm: '1.25', singlePhaseCu: '14', singlePhaseAl: '11', threePhaseCu: '14', threePhaseAl: '11' },
  { swg: '3/20 (3/.036)', sqmm: '2.5', singlePhaseCu: '19', singlePhaseAl: '15', threePhaseCu: '17', threePhaseAl: '13' },
  { swg: '7/22 (7/.028)', sqmm: '2.8', singlePhaseCu: '24', singlePhaseAl: '19', threePhaseCu: '21', threePhaseAl: '16' },
  { swg: '7/20 (7/.036)', sqmm: '4.5', singlePhaseCu: '31', singlePhaseAl: '24', threePhaseCu: '28', threePhaseAl: '25' },
  { swg: '7/18 (7/.044)', sqmm: '8', singlePhaseCu: '40', singlePhaseAl: '31', threePhaseCu: '35', threePhaseAl: '27' },
  { swg: '7/16 (7/.064)', sqmm: '14', singlePhaseCu: '64', singlePhaseAl: '50', threePhaseCu: '57', threePhaseAl: '44' },
  { swg: '19/18 (19/.044)', sqmm: '----', singlePhaseCu: '73', singlePhaseAl: '57', threePhaseCu: '65', threePhaseAl: '51' },
  { swg: '19/16 (19/.064)', sqmm: '----', singlePhaseCu: '120', singlePhaseAl: '94', threePhaseCu: '112', threePhaseAl: '87' },
  { swg: '----', sqmm: '1.5', singlePhaseCu: '16', singlePhaseAl: '13', threePhaseCu: '15', threePhaseAl: '12' },
  { swg: '----', sqmm: '2.5', singlePhaseCu: '22', singlePhaseAl: '17', threePhaseCu: '20', threePhaseAl: '15' },
  { swg: '----', sqmm: '4', singlePhaseCu: '29', singlePhaseAl: '22', threePhaseCu: '26', threePhaseAl: '20' },
  { swg: '----', sqmm: '6', singlePhaseCu: '37', singlePhaseAl: '29', threePhaseCu: '33', threePhaseAl: '26' },
  { swg: '----', sqmm: '10', singlePhaseCu: '51', singlePhaseAl: '39', threePhaseCu: '45', threePhaseAl: '35' },
  { swg: '----', sqmm: '16', singlePhaseCu: '68', singlePhaseAl: '53', threePhaseCu: '61', threePhaseAl: '48' },
  { swg: '----', sqmm: '25', singlePhaseCu: '86', singlePhaseAl: '68', threePhaseCu: '78', threePhaseAl: '61' },
  { swg: '----', sqmm: '35', singlePhaseCu: '110', singlePhaseAl: '85', threePhaseCu: '100', threePhaseAl: '78' },
  { swg: '----', sqmm: '50', singlePhaseCu: '145', singlePhaseAl: '106', threePhaseCu: '135', threePhaseAl: '94' }
];

// All 11 Practical Wiring Exercises from the PDF
export const practicalCircuitsData: PracticalCircuit[] = [
  {
    id: 1,
    practicalNo: 1,
    day: 'सत्रौं र अठारौं दिन (Day 17-18)',
    title: 'एउटा वान वे स्वीचद्वारा नियन्त्रित बत्ती जडान',
    condition: 'F1 = L1',
    controlBy: 'S1 = L1',
    description: 'मेन फ्युज F1 बाट सुरु भई एउटा वान वे स्विच S1 मार्फत एउटा बत्ती L1 लाई पूर्ण रूपमा अन र अफ नियन्त्रण गर्ने आधारभूत परिपथ।',
    components: ['मेन फ्युज (F1)', 'वान वे स्वीच (S1)', 'बत्ती होल्डर (L1)', 'जक्सन बक्स'],
    materials: ['३/२२ को तार (रातो र कालो)', '१-वे स्विच', 'होल्डर', 'पीभीसी टेप', 'काठ/प्लाई बोर्ड', 'कन्ड्युट पाइप र स्याडल'],
    fuses: ['F1'],
    switches: ['S1 (1-Way)'],
    loads: ['L1 (Lamp)'],
    circuitLogic: 'फेज तार (Phase P) फ्युज F1 हुँदै स्विच S1 को तल्लो टर्मिनलमा जान्छ। स्विचको माथिल्लो टर्मिनलबाट स्विच फेज तार बत्ती L1 मा पुग्छ। न्युट्रल तार (Neutral N) सिधै बत्ती L1 को अर्को टर्मिनलमा जोडिन्छ।'
  },
  {
    id: 2,
    practicalNo: 2,
    day: 'उन्नाइसौं र बीसौं दिन (Day 19-20)',
    title: 'एउटा वान वे स्वीचद्वारा नियन्त्रित समानान्तर बत्ती जडान (Parallel Bulbs)',
    condition: 'F1 = L1, L2',
    controlBy: 'S1 = L1, L2 Bright (पूर्ण चम्किलो)',
    description: 'एउटा वान वे स्विच S1 थिच्दा दुईवटै बत्ती L1 र L2 एकैसाथ समानान्तर (Parallel) रूपमा पूर्ण भोल्टेज (२३०V) पाएर उज्यालो (Bright) बल्ने परिपथ।',
    components: ['मेन फ्युज (F1)', 'वान वे स्वीच (S1)', 'बत्ती L1', 'बत्ती L2', 'जक्सन बक्स'],
    materials: ['३/२२ तार', '१-वे स्विच', '२ वटा होल्डर', 'पीभीसी टेप', 'पाइप', 'टी सकेट'],
    fuses: ['F1'],
    switches: ['S1 (1-Way)'],
    loads: ['L1 (Lamp)', 'L2 (Lamp)'],
    circuitLogic: 'स्विच S1 बाट निस्केको स्विच फेज तार समानान्तर रूपमा L1 र L2 दुवैमा बाँडिन्छ। न्युट्रल पनि दुवै बत्तीमा पुग्छ। दुवैले समान २३०V पाउँछन् र चर्को (Bright) बल्छन्।'
  },
  {
    id: 3,
    practicalNo: 3,
    day: 'एक्काइसौं र बाईसौं दिन (Day 21-22)',
    title: 'एउटा वान वे स्वीचद्वारा नियन्त्रित श्रेणीक्रम बत्ती जडान (Series Bulbs)',
    condition: 'F1 = L1, L2',
    controlBy: 'S1 = L1, L2 Dim (मधुरो)',
    description: 'एउटै स्विचबाट दुईवटा बत्तीहरू श्रेणीक्रम (Series) मा जोडिएको परिपथ, जहाँ भोल्टेज आधा-आधा (११५V प्रत्येक) बाँडिएर बत्तीहरू मधुरो (Dim) बल्छन्।',
    components: ['मेन फ्युज (F1)', 'वान वे स्वीच (S1)', 'बत्ती L1', 'बत्ती L2'],
    materials: ['३/२२ तार', 'स्विच', '२ होल्डर', 'टेप', 'बोर्ड'],
    fuses: ['F1'],
    switches: ['S1 (1-Way)'],
    loads: ['L1 (Lamp)', 'L2 (Lamp)'],
    circuitLogic: 'फेज तार S1 हुँदै L1 को पहिलो पिनमा जान्छ, L1 को दोस्रो पिनबाट तार L2 को पहिलो पिनमा जान्छ, र L2 को दोस्रो पिनबाट बल्ल न्युट्रल N मा जोडिन्छ। एउटा बत्ती खोलेमा दुवै बत्ती निभ्छन्।'
  },
  {
    id: 4,
    practicalNo: 4,
    day: 'तेईसौं र चौबीसौं दिन (Day 23-24)',
    title: 'एउटा बेल पुश स्वीचद्वारा बेल र वान वे स्वीचद्वारा नियन्त्रित एउटा बत्ती जडान',
    condition: 'F1 = B1, L1',
    controlBy: 'S1 = B1 (Calling Bell), S2 = L1 (Lamp)',
    description: 'घरायसी ढोकाको कलिङ बेल (Bell Push Switch S1 ले Bell B1) र मुख्य कोठाको बत्ती (1-Way Switch S2 ले Lamp L1) सँगै जडान गर्ने व्यावहारिक परिपथ।',
    components: ['मेन फ्युज (F1)', 'बेल पुश स्वीच (S1)', 'विद्युतीय घण्टी (B1)', 'वान वे स्वीच (S2)', 'बत्ती (L1)'],
    materials: ['३/२२ तार', 'बेल पुश स्विच', '१-वे स्विच', 'डोर बेल', 'बत्ती होल्डर', 'जक्सन बक्स'],
    fuses: ['F1'],
    switches: ['S1 (Bell Push)', 'S2 (1-Way)'],
    loads: ['B1 (Electric Bell)', 'L1 (Lamp)'],
    circuitLogic: 'फेज तार फ्युज F1 बाट आएर स्विच बोर्डमा पुग्छ र लुपिङ मार्फत S1 र S2 दुवैको इनपुटमा जोडिन्छ। S1 थिच्दा B1 बज्छ, S2 अन गर्दा L1 बल्छ।'
  },
  {
    id: 5,
    practicalNo: 5,
    day: 'पच्चिसौं र छब्बीसौं दिन (Day 25-26)',
    title: 'तीन वान वे स्वीचद्वारा नियन्त्रित तीन बत्ती जडान (3-Gang Switchboard)',
    condition: 'F1 = Lighting (L1, L2, L3)',
    controlBy: 'S1 = L1, S2 = L2, S3 = L3',
    description: 'एउटै स्विच बोर्डमा रहेका तीनवटा छुट्टाछुट्टै वान वे स्विचहरूले तीनवटा भिन्न बत्तीहरूलाई स्वतन्त्र रूपमा अन/अफ नियन्त्रण गर्ने घरायसी ३-ग्याङ वाइरिङ।',
    components: ['मेन फ्युज (F1)', 'स्विच १ (S1)', 'स्विच २ (S2)', 'स्विच ३ (S3)', 'बत्ती ३ वटा (L1, L2, L3)'],
    materials: ['३ वटा वान वे स्विच', '३ वटा ब्याटन/पेन्डेन्ट होल्डर', '३/२२ तार', 'ग्याङ बक्स', 'पाइप'],
    fuses: ['F1'],
    switches: ['S1', 'S2', 'S3'],
    loads: ['L1', 'L2', 'L3'],
    circuitLogic: 'फेज तारलाई S1, S2 र S3 को तल्लो टर्मिनलमा साझा (Common Phase Loop) गरिन्छ। S1 बाट L1, S2 बाट L2, र S3 बाट L3 मा स्विच फेज जान्छ। न्युट्रल सबै बत्तीमा साझा रहन्छ।'
  },
  {
    id: 6,
    practicalNo: 6,
    day: 'सत्ताइसौं र अठ्ठाइसौं दिन (Day 27-28)',
    title: 'दुई वान वे स्वीचद्वारा नियन्त्रित दुई बत्ती र टुपिन सकेट जडान',
    condition: 'F1 = Lighting (L1, L2), X1',
    controlBy: 'S1 = L1, L2; S2 = X1 (2-Pin Socket)',
    description: 'पहिलो स्विच S1 ले दुईवटा बत्ती (L1 र L2) नियन्त्रण गर्ने र दोस्रो स्विच S2 ले चार्जर/पोर्टेबल उपकरण जोड्ने टुपिन सकेट X1 नियन्त्रण गर्ने परिपथ।',
    components: ['मेन फ्युज (F1)', 'स्विच १ (S1)', 'स्विच २ (S2)', 'बत्ती L1, L2', 'टु-पिन सकेट (X1)'],
    materials: ['२ वटा वान वे स्विच', '१ वटा टु-पिन सकेट', '२ वटा होल्डर', 'तार', 'बोर्ड'],
    fuses: ['F1'],
    switches: ['S1 (Controls L1, L2)', 'S2 (Controls X1)'],
    loads: ['L1 (Lamp)', 'L2 (Lamp)', 'X1 (2-Pin Socket)'],
    circuitLogic: 'S1 को आउटपुट तार दुवै बत्ती L1 र L2 मा समानान्तर जोडिन्छ। S2 को आउटपुट तार टुपिन सकेट X1 को फेज पिनमा जोडिन्छ। सकेटको अर्को पिनमा सिधै न्युट्रल जोडिन्छ।'
  },
  {
    id: 7,
    practicalNo: 7,
    day: 'उनन्तीसौँ र तीसौँ दिन (Day 29-30)',
    title: 'दुई टु वे स्वीचद्वारा नियन्त्रित एक बत्ती जडान (सिँढी वाइरिङ / Staircase Wiring)',
    condition: 'F1 = Lighting (L1)',
    controlBy: 'S1, S2 = L1 (तलबाट बाल्ने, माथिबाट निभाउने वा उल्टो)',
    description: 'घरको भर्‍याङ (Staircase) वा लामो गल्लीको लागि अति महत्वपूर्ण परिपथ, जहाँ दुईवटा टु वे स्विच S1 र S2 को सहायताले तल वा माथि जुनसुकै स्थानबाट बत्ती अन वा अफ गर्न सकिन्छ।',
    components: ['मेन फ्युज (F1)', 'टु-वे स्विच १ (S1)', 'टु-वे स्विच २ (S2)', 'बत्ती (L1)'],
    materials: ['२ वटा टु-वे स्विच (SPDT)', '१ बत्ती होल्डर', '३/२२ तार', 'पाइप र क्ल्याम्प'],
    fuses: ['F1'],
    switches: ['S1 (2-Way)', 'S2 (2-Way)'],
    loads: ['L1 (Staircase Lamp)'],
    circuitLogic: 'फ्युजबाट आएको फेज S1 को बीचको पोल (Common Terminal) मा जोडिन्छ। S1 र S2 का माथिल्ला र तल्ला टर्मिनलहरू दुईवटा स्ट्र्यापर तार (Strappers) मार्फत आपसमा जोडिन्छन्। S2 को बीचको पोलबाट तार बत्ती L1 मा जान्छ।\nअवस्था: S1 Down + S2 Down = बत्ती बल्छ (ON), S1 Up + S2 Up = बत्ती बल्छ (ON), S1 Up + S2 Down = बत्ती निभ्छ (OFF), S1 Down + S2 Up = बत्ती निभ्छ (OFF)।'
  },
  {
    id: 8,
    practicalNo: 8,
    day: 'एकतीसौं र बत्तीसौं दिन (Day 31-32)',
    title: 'दुई टु वे स्वीचद्वारा नियन्त्रित एक बत्ती, साथै ईन्डिकेटर र टुपिन सकेट जडान',
    condition: 'F1 = Lighting (L1, I1, X1)',
    controlBy: 'S1, S2 = L1; I1 = Always ON Indicator; S2/Direct = X1',
    description: 'सिँढीको टु-वे प्रणालीसँगै बोर्डमा लाइन आएको संकेत दिने ईन्डिकेटर I1 र उपकरण जोड्न टुपिन सकेट X1 समेत एकीकृत गरिएको बहुउपयोगी परिपथ।',
    components: ['मेन फ्युज (F1)', '२ वटा टु-वे स्विच (S1, S2)', 'ईन्डिकेटर (I1)', 'टुपिन सकेट (X1)', 'बत्ती (L1)'],
    materials: ['टु-वे स्विच २ थान', 'ईन्डिकेटर १ थान', 'टुपिन सकेट १ थान', 'होल्डर १ थान', 'तार'],
    fuses: ['F1'],
    switches: ['S1 (2-Way)', 'S2 (2-Way)'],
    loads: ['L1 (Lamp)', 'I1 (Indicator)', 'X1 (2-Pin Socket)'],
    circuitLogic: 'ईन्डिकेटर I1 मा स्थायी रूपमा फेज र न्युट्रल जोडिन्छ जसले लाइन चालु रहेको जनाउँछ। S1 र S2 ले बत्ती L1 लाई सिँढी प्रणालीमा चलाउँछन् भने X1 सकेटले पावर प्रदान गर्दछ।'
  },
  {
    id: 9,
    practicalNo: 9,
    day: 'तेत्तीसौं र चौँतीसौँ दिन (Day 33-34)',
    title: 'दुई टु वे स्वीचद्वारा नियन्त्रित एक बत्ती, ईन्डिकेटर, टुपिन सकेट र पावर सकेट जडान',
    condition: 'F1 = Lighting (L1, I1, X1); F2 = P1 (Power Socket 16A)',
    controlBy: 'S1, S2 = L1; I1 (Indicator); X1 (Socket); P1 (16A Power Socket)',
    description: 'लाइटिङ सर्किट (F1) र १६ एम्पियर पावर सर्किट (F2) लाई छुट्टाछुट्टै फ्युज/MCB सुरक्षा सहित ईन्डिकेटर, टुपिन सकेट र पावर सकेट एकीकृत जडान।',
    components: ['लाइटिङ फ्युज (F1)', 'पावर फ्युज (F2)', 'टु-वे स्विच २ वटा (S1, S2)', 'ईन्डिकेटर (I1)', 'टुपिन सकेट (X1)', 'पावर सकेट (P1)', 'अर्थिङ (E)', 'बत्ती (L1)'],
    materials: ['पावर सकेट १६A', '७/२२ वा ७/२० कपर तार (पावर)', '३/२२ तार (लाइटिङ)', 'अर्थिङ तार (हरियो)', 'स्विचबोर्ड'],
    fuses: ['F1 (Lighting)', 'F2 (Power)'],
    switches: ['S1 (2-Way)', 'S2 (2-Way)', 'P1 Integrated Switch'],
    loads: ['L1 (Lamp)', 'I1 (Indicator)', 'X1 (2-Pin Socket)', 'P1 (16A Heavy Load)'],
    circuitLogic: 'पावर सकेट P1 को लागि फ्युज F2 बाट छुट्टै मोटो तार (७/२२) ल्याइन्छ र त्यसमा अनिवार्य रूपमा सुरक्षात्मक अर्थिङ तार (Green Wire) माथिल्लो ठूलो पिनमा जोडिन्छ।'
  },
  {
    id: 10,
    practicalNo: 10,
    day: 'पैँतीसौं र छत्तीसौँ दिन (Day 35-36)',
    title: 'दुई टु वे स्वीच र एक ईन्टरमिडिएट स्वीचद्वारा नियन्त्रित एक बत्ती (Control from 3 Places)',
    condition: 'F1 = Lighting (L1)',
    controlBy: 'S1, S2 (Intermediate), S3 = L1 (तीन अलग ठाउँबाट अन/अफ)',
    description: 'ठूला भवन, अस्पतालको लामो करिडोर वा ३ तलाको भर्‍याङमा तीन फरक स्थानबाट एउटै बत्तीलाई स्वतन्त्र रूपमा अन/अफ गर्न २ वटा टु-वे स्विच र बीचमा १ वटा ईन्टरमिडिएट (Intermediate) स्विच जडान।',
    components: ['मेन फ्युज (F1)', 'टु-वे स्विच (S1)', 'ईन्टरमिडिएट स्विच (S2 - 4 Terminals)', 'टु-वे स्विच (S3)', 'बत्ती (L1)'],
    materials: ['२ टु-वे स्विच', '१ ईन्टरमिडिएट स्विच (वा २-ग्याङ टु-वे संयुक्त)', '१ बत्ती होल्डर', '३/२२ तार'],
    fuses: ['F1'],
    switches: ['S1 (2-Way)', 'S2 (Intermediate)', 'S3 (2-Way)'],
    loads: ['L1 (Corridor Lamp)'],
    circuitLogic: 'S1 को दुई आउटपुट S2 (ईन्टरमिडिएट) को दुई इनपुटमा जोडिन्छन्। S2 का दुई आउटपुट S3 (टु-वे) का दुई इनपुटमा जान्छन्। S3 को कमन पोलबाट बत्ती L1 मा लाइन पुग्छ।\nकुनै पनि स्विच चलाउँदा सर्किटको अवस्था परिवर्तन भई बत्ती अन वा अफ हुन्छ।'
  },
  {
    id: 11,
    practicalNo: 11,
    day: 'सैंतीसौं दिन (Day 37)',
    title: 'दुई टु वे स्वीच र दुई ईन्टरमिडिएट स्वीचद्वारा नियन्त्रित एक बत्ती (Control from 4 Places)',
    condition: 'F1 = Lighting (L1)',
    controlBy: 'S1, S2, S3, S4 = L1 (चार अलग ठाउँबाट अन/अफ)',
    description: 'चार फरक स्थान (उदा: चार तल्ले घर वा चारै कुना) बाट एउटै बत्तीलाई नियन्त्रण गर्न छेउछाउमा दुई टु-वे स्विच (S1, S4) र बीचमा दुई ईन्टरमिडिएट स्विच (S2, S3) जडान।',
    components: ['मेन फ्युज (F1)', 'टु-वे स्विच १ (S1)', 'ईन्टरमिडिएट स्विच १ (S2)', 'ईन्टरमिडिएट स्विच २ (S3)', 'टु-वे स्विच २ (S4)', 'बत्ती (L1)'],
    materials: ['२ वटा टु-वे स्विच', '२ वटा ईन्टरमिडिएट स्विच', '१ बत्ती होल्डर', '३/२२ तार', 'कन्ड्युट पाइप'],
    fuses: ['F1'],
    switches: ['S1 (2-Way)', 'S2 (Intermediate)', 'S3 (Intermediate)', 'S4 (2-Way)'],
    loads: ['L1 (Hall / Corridor Lamp)'],
    circuitLogic: 'S1 बाट निस्केका २ स्ट्र्यापर तार S2 मा, S2 बाट S3 मा, र S3 बाट S4 मा क्रमिक रूपमा जोडिन्छन्। S4 को कमन टर्मिनलबाट बत्ती L1 मा स्विच फेज पुग्छ।'
  }
];

// All Classroom Lesson Plans from Day 1 to Day 38
export const electricianLessons: ElectricianLesson[] = [
  {
    day: 'पहिलो दिन',
    dayNumber: 1,
    title: 'परिचय तथा सहभागीहरूको आशा अपेक्षा संकलन र मिलन',
    nepaliTitle: 'पाठ्यक्रम उद्देश्य, आशा-अपेक्षा संकलन र कक्षा व्यवस्थापन नियमहरू',
    duration: '५:०० घण्टा',
    objective: 'कक्षाको अन्त्यमा सहभागी प्रशिक्षार्थी तथा प्रशिक्षक एक-आपसमा नजिक हुने र खुलेर मनका कुरा राख्न सक्नेछन्।',
    category: 'foundation',
    tableRows: [
      { sn: '१', activity: 'नाम दर्ता: सहभागीहरूको नाम र ठेगाना रजिष्टारमा दर्ता गर्ने।', method: 'साक्षरले आफै र निरक्षरको सहजकर्ताद्वारा परिचय गरिने', materials: 'दर्ता रजिष्टार, कलम', duration: '३० मिनेट' },
      { sn: '२', activity: 'परिचय कार्यक्रम: परिचयको महत्वबारे जानकारी दिँदै सहभागीलाई आफ्नो परिचय दिई सहभागीको परिचय गर्न लगाउने।', method: 'कुनै एउटा रमाइलो खेल खेलाएर', materials: 'सेतो पाटी, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '३', activity: 'आशा अपेक्षा र मिलन: तालिम अवधिभर के-के सिप सिक्ने आशा राख्नुभएको छ? सहभागीबाट आएको उत्तरलाई चार्टपेपरमा टिपोट गर्ने।', method: 'प्रश्नोत्तर र छलफल', materials: 'सेतो पाटी, मार्कर, डस्टर, ब्राउन पेपर, मास्किङ टेप', duration: '१ घण्टा' },
      { sn: '४', activity: 'तालिमको उद्देश्य वाचन: तालिमको उद्देश्य र विषय वस्तुसँग मेल खाने/नखाने विश्लेषण गरी मेल नखाने आशाहरूलाई समावेश गर्न नमिल्ने जानकारी गराउने।', method: 'प्रश्नोत्तर र छलफल', materials: 'सेतो पाटी, मार्कर, डस्टर, ब्राउन पेपर, मास्किङ टेप', duration: '१:३० मिनेट' },
      { sn: '५', activity: 'तालिम व्यवस्थापन: तालिमलाई व्यवस्थित गर्न सहभागीहरू बीच छलफल गरी तालिम अवधि भरको लागि नियम बनाउने र भित्तामा टाँस्ने।', method: 'समुहमा छलफल', materials: 'सेतो पाटी, मार्कर, डस्टर, ब्राउन पेपर, मास्किङ टेप', duration: '१:३० मिनेट' }
    ],
    contentSections: [
      {
        heading: 'प्रशिक्षार्थी बिच घुलमिल तथा परिचय',
        text: 'यदि एक आपसमा परिचय भएन भने एक अर्का प्रति खुलेर कुरा गर्न अप्ठ्यारो हुने हुन्छ। परिचयले को कहाँबाट आएका र एक अर्कामा घुलमिल हुनको साथै प्रशिक्षकको कुरा बुझ्न र तालिमलाई सहजिकरण तुल्याउन सहयोग गर्दछ। तालिममा सहभागी भएकाहरूको योग्यता, हल गरी राखेका कार्य, उसको रुचि, सम्भव भए यो तालिम रोज्नुको कारण समेत खुल्ने गरी सिर्जनशिल तरिकाले परिचय गराउँदा कक्षा निकैनै प्रभावकारी हुने र तालिम लिन उत्साहित हुने हुन्छ।'
      },
      {
        heading: 'तालिमको मुख्य उद्देश्य',
        text: 'Building electrician को सिप सिक्न चाहने र आफ्नो व्यवसाय संचालन गर्ने अथवा ज्यालादारीमा काम गर्न चाहाने महिला पुरुष तथा तेस्रो लिङ्गीहरुको लागि Building electrician सम्बन्धि ज्ञान, सिप, प्रविधिबारे दक्ष बनाई रोजगार वृद्धि गर्न सहयोग पुर्याउन यस तालिमको मुख्य उद्देश्य रहेको छ।'
      },
      {
        heading: 'कक्षा व्यवस्थापन र नियमहरू',
        text: 'तालिमलाई व्यवस्थित एवं मर्यादित बनाउन सबै संग छलफल गरेर सबैलाई मान्य हुने आधारभूत नियमहरू बनाउनु पर्दछ:',
        bullets: [
          'कक्षा सुरु तथा अन्त्य हुने निश्चित समयको पालना।',
          'चिया खाजाको निश्चित समय।',
          'अनुशासन सम्बन्धि साझा प्रतिवद्धता।',
          'सिकाई प्रतिवेदन, दैनिक खेल मनोरञ्जन र सहकार्य।'
        ]
      }
    ],
    homework: ['आफ्नो व्यक्तिगत सिकाइ लक्ष्य तयार पार्नुहोस्।']
  },
  {
    day: 'दोस्रो दिन',
    dayNumber: 2,
    title: 'विद्युतको परिचय, विद्युत र विद्युत धाराको प्रकार',
    nepaliTitle: 'विद्युत सिद्धान्त: स्थिर विद्युत vs प्रवाहित विद्युत र DC vs AC',
    duration: '५:०० घण्टा',
    objective: 'विद्युत भनेको के हो? विद्युत र विद्युतधाराको बारेमा बुझ्नेछन्।',
    category: 'foundation',
    tableRows: [
      { sn: '१', activity: 'सहभागीलाई ध्यान केन्द्रित गर्नको लागि रमाइलो कुरा राख्दै कक्षा संचालन गर्ने। विद्युत भनेको के हो? यस बारे बुझाउने।', method: 'छलफल र व्याख्यान', materials: 'सेतो पाटी, मार्कर, डस्टर', duration: '१:०० घण्टा' },
      { sn: '२', activity: 'विद्युत र विद्युत धाराको प्रकार बारे छलफल गर्ने र यसको लागि के-के कुरा सिक्नुपर्ने हो यसको बारे ज्ञान दिने।', method: 'छलफल र व्याख्यान', materials: 'सेतो पाटी, मार्कर, डस्टर', duration: '२:०० घण्टा' },
      { sn: '३', activity: 'विद्युतको महत्व, विद्युत र विद्युतधाराको प्रकार बारे बयान गर्ने र गृहकार्यको लागि प्रश्नहरू दिने।', method: 'सामुहिक छलफल र व्याख्यान', materials: 'सेतो पाटी, मार्कर, डस्टर', duration: '२:०० घण्टा' }
    ],
    contentSections: [
      {
        heading: 'विद्युत (Electricity) भनेको के हो?',
        text: 'कुनै घर्षण विधि (Frictional Method), रासायनिक विधि (Chemical Method), र यान्त्रिक विधि (Mechanical Method) बाट उत्पन्न बल र चाप (Force and Pressure) लाई विद्युत (Electricity) भनिन्छ। अर्थात ईलेक्ट्रोनको गति (Electrons Motion) लाई विद्युत (Electricity) भनिन्छ।\n\nविज्ञानको नियम अनुसार विद्युत केवल इलेक्ट्रोनको वहाव (Electrons Flow) मात्र हो। यसको वहावलाई देख्न र छुन सकिँदैन तर केवल महसुस मात्र गर्न सकिन्छ। विद्युतलाई हामीले आँखाहरुले देख्न सक्दैनौँ, न उसको आवाज सुन्नसक्छौँ, न त छुन नै सक्छौँ तर यसको भौतिक प्रभाव भने देख्न तथा सुन्न सक्छौँ। जस्तै वत्ती वालेर, रेडियो क्यासेट बजाएर, टि.भी., हिटर, मोटर, पंखा आदि चलाएर। विद्युत मुलतः दुई प्रकारको हुन्छ:',
        bullets: [
          'क) स्थिर विद्युत (Static Electricity)',
          'ख) प्रवाहित विद्युत (Current Electricity)'
        ]
      },
      {
        heading: 'क) स्थिर विद्युत (Static Electricity)',
        text: 'जुन विद्युतलाई उत्पादन गरेको ठाउँबाट अर्को ठाउँ सम्म सजिलैसँग पुर्याउन तथा लैजान सकिँदैन भने त्यस प्रकारको विद्युतलाई स्थिर विद्युत (Static Electricity) भनिन्छ। यो विद्युत कुनैपनि कामको लागि उपयोगी छैन। यो विद्युत जुन ठाउँमा उत्पादन हुन्छ त्यसको गुण (बल र चाप) त्यहि ठाउँमा मात्र सिमित रहन्छ। यसलाई Non-Moveable Electrical Energy भनिन्छ। यो विद्युत दुई वस्तुहरु विच हुने घर्षण (Frictional) बाट उत्पन्न हुन्छ। घर्षण विधिबाट उत्पन्न भएको विद्युतको ईलेक्ट्रोनहरू (Electrons) स्थिर (Static) अवस्थामा रहन्छ, त्यसैले यस किसिमको विद्युतलाई Electro Statics or Frictional Electricity भन्ने गरिन्छ। यो विद्युत कुनै पनि किसिमको प्रयोगमा ल्याउन सकिँदैन।'
      },
      {
        heading: 'ख) प्रवाहित विद्युत (Current Electricity)',
        text: 'जुन विद्युतलाई उत्पादन गरेको ठाउँबाट अर्को ठाउँसम्म सजिलैसँग पुर्याउन तथा लैजान सकिन्छ भने त्यस प्रकारको विद्युतलाई प्रवाहित विद्युत (Current Electricity) भनिन्छ। अर्थात जुन विद्युतको ईलेक्ट्रोनहरू गतिशील हुन्छ, त्यसलाई प्रवाहित तथा करेन्ट विद्युत (Dynamics or Current Electricity) भनिन्छ। यसलाई Moveable Electrical Energy भनिन्छ। यस प्रकारको विद्युतबाट विजुली वत्तीहरू वाल्न सकिन्छ। यो विद्युत रासायनिक क्रिया (Chemical Action) र यान्त्रिक क्रिया (Mechanical Action) बाट उत्पन्न हुन्छ। यस किसिमको क्रियाबाट उत्पन्न भएको विद्युतको ईलेक्ट्रोनहरू (Electrons) गतिशील (Dynamic) हुन्छ। त्यसैले यस किसिमको विद्युतलाई Electro Dynamics or Current Electricity भन्ने गरिन्छ। यो विद्युत मानव विकासमा निकै नै उपयोगी सिद्ध भएको छ। प्रवाहित विद्युत –सेल (Cell), व्याट्री (Battery), डाइनामो (Dynamo), जेनेरेटर (Generator), सोलार पावर (Solar Power) इत्यादि बाट उत्पादन गर्न सकिन्छ।'
      },
      {
        heading: 'विद्युत धारा (Current) र यसका प्रकार',
        text: 'जब सुचालक तारमा रहेको इलेक्ट्रोनहरू एक छेउबाट अर्को छेउ वहन्छ भने त्यसलाई विद्युतधारा (Current) भनिन्छ। विद्युतधारा दुई प्रकारको हुन्छ:\n१. दिष्ट धारा (Direct Current / D.C.)\n२. प्रत्यावर्ती धारा (Alternating Current / A.C.)'
      },
      {
        heading: 'दिष्ट धारा (Direct Current / D.C.)',
        text: 'सिधा रूपवाट वहने खालको Current लाई Direct Current भनिन्छ। अर्थात एउटा तारमा Positive र अर्को तारमा Negative मात्र भएर वहने खालको विद्युतलाई Direct Current / D.C. भनिन्छ। D.C. विद्युतमा एउटा (+) र एउटा (-) ध्रुव (Terminal) हुन्छ।\nयो यस्तो करेन्ट हो, यसको मान जहिल्यै समान रहन्छ। यो करेन्ट सेल, ब्यट्री, डि.सी डाइनामो आदिबाट प्राप्त गर्न सकिन्छ। साथै ए.सी. बाट डि.सी.मा परिवर्तन गर्ने शुद्ध डि.सी. दिने साधन वा उपकरणबाट प्राप्त गर्न सकिन्छ। डि.सी सप्लाई रासायनिक क्रियाद्वारा उत्पादन गरिन्छ। यसबाट इलेक्ट्रोनिक्स (Electronics) का उपकरणहरु संचालन गर्न प्रयोग गरिन्छ जस्तै, रेडियो, घडी, टि.भी., टेलिफोन, क्यामेरा, मोबाइल, इत्यादि।',
        diagramType: 'dc-waveform'
      },
      {
        heading: 'प्रत्यावर्ती धारा (Alternating Current / A.C.)',
        text: 'कुनैपनि विद्युत प्रवाह हुने सर्किट वा तारमा विद्युतको ध्रुवहरु निरन्तर Negative र Positive भएर परिवर्तन भइरहन्छ भने त्यस्तो किसिमको विद्युतलाई Alternating Current भनिन्छ। अर्थात एउटै ध्रुवमा Positive र Negative भएर वहने Current लाई Alternating Current भनिन्छ। यसरी ध्रुवहरू परिवर्तन हुने भएकोले नै यस्ता खाले विद्युतलाई Alternating Current भनिएको हो।\nAlternating Current/A.C. मा फेज (Phase) र न्युट्रल (Neutral) हुन्छ। यो यस्तो करेन्ट हो, जसको मान र दिशा समय अनुसार बददलीरहन्छ। एक स्थितिमा यो करेन्टको मान अधिकतम हुन्छ र दोस्रो स्थितिमा शून्य हुन जान्छ। त्यसैगरी यो क्रम विपरित दिशामा त्यहि अनुसार चलिरहन्छ।\nयसप्रकार ए.सी. करेन्टले आफ्नो एक चक्र (One cycle) पूरा गर्दछ। यो एक सेकेण्डमा ५० पटक +ve र ५० पटक -ve दिशा तिर वहन्छ। अतः यसले एक सेकेण्डमा ५० चक्र पुरा गर्दछ, यसलाई नै फ्रिक्यून्सी (Frequency) भनिन्छ। यसलाई साइकल प्रतिसेकेण्ड (C/s) जसलाई हर्ज (Hz) पनि लेख्न सकिन्छ। Alternating Current वहने तार जसमा फ्युज र स्वीच जडान गरिन्छ, उक्त तारलाई फेज तार (Phase or Live Line) भनिन्छ। शुन्य पि.डी (Zero Potential Difference) मा राखिने तारलाई न्युट्रल तार (Neutral Wire) भनिन्छ। Phase र Neutral विच २००–२३० Volts सम्म विद्युतिय चाप (Voltage) हुन्छ।',
        diagramType: 'ac-waveform'
      }
    ],
    homework: [
      'क) विद्युतको महत्वबारे चर्चा गर्नुहोस्।',
      'ख) विद्युतका प्रकार बारे लेख्नुहोस्।',
      'ग) A.C. र D.C. को फरक लेख्नुहोस्।'
    ]
  },
  {
    day: 'तेस्रो दिन',
    dayNumber: 3,
    title: 'विद्युतको इतिहास, अणु र परमाणुको संरचना',
    nepaliTitle: 'विद्युत इतिहास, फर्पिङ/सुन्दरीजल र परमाणुको 2N² संरचना',
    duration: '५:०० घण्टा',
    objective: 'सहभागीहरूले कक्षाको अन्त्यमा विद्युतको इतिहास, अणु र आणविक संरचना वारे बुझ्नेछन्।',
    category: 'foundation',
    tableRows: [
      { sn: '१', activity: 'अघिल्लो दिनको गृहकार्य जाँच तथा पृष्ठपोषण', method: 'प्रश्नोत्तर छलफल', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '२', activity: 'सहभागीको ध्यान केन्द्रित गर्दै विद्युतको इतिहास बारे छलफल गर्ने र बोर्डमा लेख्दै जाने।', method: 'व्याख्यान र छलफल', materials: 'फ्लिप चार्ट, मार्कर, पिन बोर्ड', duration: '१:०० घण्टा' },
      { sn: '३', activity: 'विद्युतको इतिहासबारे आवश्यक थप ज्ञान दिने।', method: 'व्याख्यान र छलफल', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '१:०० घण्टा' },
      { sn: '४', activity: 'अणु र परमाणुको संरचनाबारे छलफल गर्ने र आवश्यक ज्ञान दिने', method: 'व्याख्यान र छलफल', materials: 'फ्लिप चार्ट, मार्कर, पिन बोर्ड', duration: '१:३० घण्टा' },
      { sn: '५', activity: 'विद्युतको इतिहास, अणु र परमाणुको बारेमा प्रश्नोत्तर गृहकार्य दिने।', method: 'व्याख्यान, छलफल र प्रश्नोत्तर', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '१:०० घण्टा' }
    ],
    contentSections: [
      {
        heading: 'विद्युतको इतिहास',
        text: 'आज भन्दा करिव २६०० वर्ष अगाडि यूनान देशका वैज्ञानिक डा. थेल्स एम्बरले विभिन्न वैज्ञानिक परिक्षण गर्ने क्रममा रेशमको कपडामा काँचको छडले रगड्दा त्यहाँ एक प्रकारको गुण (बल र चाप) उत्पन्न भयो, त्यस बल र चापले कागजको टुक्रालाई आफूतिर आकर्षण गर्दछ। यसरी कागजको टुक्रालाई आकर्षण गर्दा त्यहा एक प्रकारको शक्ति उत्पन्न भएको महसुस गरी यस शक्तिलाई नाम राख्ने क्रममा काँचलाई यूनान भाषामा ईलेक्ट्रोन (Electron) भनिने भएकोले सो को नाम ईलेक्ट्रोन (Electron) रहन गयो र सोहि नामबाट विद्युतलाई ईलेक्ट्रीसिटी (Electricity) भनियो। र यसलाई नेपालीमा विद्युत वा विजुली भन्ने गरिन्छ।\n\nवैज्ञानिक थेल्स एम्बरकै प्रतिपादित सिद्धान्त अनुरुप विद्युत उत्पादन गर्ने क्रममा सन् १८०० मा इटालियन वैज्ञानिक आलेसान्द्रो भोल्टाले ब्याट्रीको आविष्कार गर्नुभयो। तर ब्याट्रीबाट ठुला-ठुला पावरका उपकरणहरु चलाउन नसकिने भएकोले सन् १८३१ मा वेलायती (ब्रिटेन) वैज्ञानिक माइकल फराडे (Michael Faraday) ले चुम्बकबाट विद्युत शक्ति निकाल्ने यन्त्रको आविष्कार गर्नुभयो, जसलाई डाइनामो (Dynamo) भनियो। र यसबाट विद्युत निकालियो। केहि समय पछि सन् १८३१ मा नै जोसेफ हेनरी (Josefe Henry) ले पनि डाइनामो (Dynamo) को आविष्कार गर्नुभयो।\n\nनेपालमा भने वि.सं. १९६८ मा पहिलो पटक ब्रिटिश सरकारको सहयोगमा राणा शासक चन्द्र शम्सेरको पालामा ५०० किलो वाट को फर्पिङ जलविद्युत केन्द्र (Pharping Hydro Power Plant) को स्थापना भएको थियो। त्यसैगरी जलविद्युत विकासको क्रम संगै वि.सं. १९९२ मा ब्रिटिश सरकार कै सहयोगमा ६४० किलो वाटको सुन्दरीजल विद्युत केन्द्रको स्थापना भएको थियो।'
      },
      {
        heading: 'अणु र परमाणु (Molecules and Atom)',
        text: 'कुनैपनि पदार्थ (Matter) ठोस, तरल र ग्यास मिलेर बनेको हुन्छ। पदार्थलाई टुक्राउदै जाँदा अन्तिमको सबैभन्दा सानो टुक्रा जसमा पदार्थको सबै गुण रहेको हुन्छ त्यस्ता टुक्रालाई अणु (Molecules) भनिन्छ। अणुलाई पनि स-साना भागमा विभाजन गर्न सकिन्छ, जसलाई परमाणु (Atom) भनिन्छ। परमाणुमा पदार्थको कुनैपनि गुण रहेको हुदैन। परमाणु (Atom) ईलेक्ट्रोन (Electron), प्रोटोन (Proton) र न्युट्रन (Neutron) मिलेर बनेको हुन्छ। ईलेक्ट्रोनमा नेगेटिभ किसिमको विद्युत शक्ति हुन्छ, भने न्युट्रनमा कुनै किसिमको विद्युत शक्ति हुदैन।'
      },
      {
        heading: 'परमाणुको बनावट (Structure of Atom)',
        text: 'परमाणुको बीच भागमा न्युक्लियस (Nucleus) रहेको हुन्छ भने न्युक्लियसको विच भागमा प्रोटोन र न्युट्रन रहेको हुन्छ र न्युक्लियसको बाहिरी कक्षमा इलेक्ट्रोनहरु रहेको हुन्छ। परमाणुमा इलेक्ट्रोन सेलहरु (Electron Shells) एक वृत्ताकारमा मिलेर रहेको हुन्छ।\n\nपरमाणुको संरचनालाई सौर्यमण्डलसंग दाँजेर हेर्न सकिन्छ, जस्तै: सौर्यमण्डलमा सूर्य केन्द्रमा रहेको हुन्छ र विभिन्न ग्रहहरुले सूर्यलाई आ-आफ्नो कक्षमा रहेर परिक्रमा गरिरहेका हुन्छन्। ठिक त्यसै गरी परमाणुमा पनि न्युट्रन र प्रोटोनहरु केन्द्रमा रहेका हुन्छन् भने इलेक्ट्रोनहरुले प्रोटोनलाई केन्द्रमा राखेर परिक्रमा गरिरहेको हुन्छ। इलेक्ट्रोनहरुले परिक्रमा गर्ने बाटोलाई कक्ष (Orbit) भनिन्छ।\n\nकक्षमा इलेक्ट्रोनहरु 2N² को सुत्र अनुसार रहेको हुन्छ। यहाँ N लाई कक्षको संख्या भनेर बुझिन्छ:\n• पहिलो कक्ष (K-Shell): 2 × (1)² = २ वटा\n• दोस्रो कक्ष (L-Shell): 2 × (2)² = ८ वटा\n• तेस्रो कक्ष (M-Shell): 2 × (3)² = १८ वटा\n• चौथो कक्ष (N-Shell): 2 × (4)² = ३२ वटा इलेक्ट्रोनहरू',
        diagramType: 'atom-structure'
      },
      {
        heading: 'कणहरूको विशेषता',
        text: '१. पदार्थ (Matter): जुन वस्तुको तौल (परिमाण) हुन्छ र निश्चित ठाउ (आयतन) ओगट्न सक्दछ। ठोस (Solid), तरल (Liquid), र ग्यास (Gas)।\n२. प्रोटोन (Proton): न्युक्लियसमा रहने धनात्मक चार्ज (Positive Charge) भएको भारी कण।\n३. इलेक्ट्रोन (Electron): न्युक्लियस वरिपरि विभिन्न सेलहरूमा घुम्ने ऋणात्मक चार्ज (Negative Charge) भएको हलुका कण।\n४. न्युट्रोन (Neutron): न्युक्लियसमा प्रोटोनसँगै रहने कुनै चार्ज नभएको (Neutral) कण।'
      }
    ],
    homework: [
      'क) माइकल फराडे को थिए र डाइनामोको आविष्कार कसरी भयो?',
      'ख) परमाणुको संरचना र 2N² सुत्र बारे वर्णन गर्नुहोस्।'
    ]
  },
  {
    day: 'चौथो दिन',
    dayNumber: 4,
    title: 'ओहमको नियम, भोल्टेज, करेन्ट र अवरोधको परिचय र परिभाषा',
    nepaliTitle: 'ओहमको नियम (Ohms Law), त्रिभुज सुत्र V=IR र ४ वटा गणितीय हिसाब',
    duration: '५:०० घण्टा',
    objective: 'सहभागीहरूले कक्षाको अन्त्यमा भोल्टेज, करेन्ट र अवरोधको बारेमा बुझ्नेछन् र हिसाब गर्न सक्नेछन्।',
    category: 'foundation',
    tableRows: [
      { sn: '१', activity: 'अघिल्लो दिनको गृहकार्य जाँच तथा पृष्ठपोषण', method: 'छलफल र व्याख्यान', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '२', activity: 'सहभागीहरूको ध्यान केन्द्रित गर्दै ओहमको नियम, भोल्टेज, करेन्ट र अवरोधको बारेमा बुझाउने।', method: 'छलफल र व्याख्यान', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '१:०० घण्टा' },
      { sn: '३', activity: 'ओहमको नियम बारे छलफल गर्ने र यसको लागि के-के कुरा सिक्नु पर्ने हो ज्ञान दिने।', method: 'सामुहिक छलफल र व्याख्यान', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '१:३० घण्टा' },
      { sn: '४', activity: 'ओहमको नियम सम्बन्धि हिसाब सिकाउने।', method: 'सामुहिक छलफल र व्याख्यान', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '१:३० घण्टा' },
      { sn: '५', activity: 'ओहमको नियम सम्बन्धि प्रश्नोत्तर र गृहकार्य।', method: 'प्रश्नोत्तर', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' }
    ],
    contentSections: [
      {
        heading: 'ओहमको नियम (Ohms Law)',
        text: 'जर्मन वैज्ञानिक जर्ज साईनम ओहम (George Simon Ohm) द्वारा प्रतिपादित यस नियम १९ औँ शताब्दीको शुरुतिर आएको हो। यस नियम अनुसार कुनै निश्चित भौतिक अवस्थामा रहेको सुचालक वा धातुको दुई विन्दु बीचको भोल्टेज र करेन्ट जहिले पनि समानुपातिक हुन्छ र विद्युतधारा अवरोधसंग व्युत्क्रमानुपातिक हुन्छ। अर्थात अवरोधलाई स्थिर राखेर भोल्टेज बढाएमा करेन्ट पनि स्वतः बढ्छ।\n\nV ∝ I  वा  V = I × R\n\n• V = Voltage (Volts)\n• I = Current (Amps)\n• R = Resistance (Ohms Ω)',
        diagramType: 'ohms-law-triangle'
      },
      {
        heading: 'भोल्टेज (Voltage):',
        text: 'कुनै विद्युत परिपथमा एक विन्दु बाट अर्को विन्दु सम्म ईलेक्ट्रोनहरुको प्रवाह गराउनको लागि आवश्यक विद्युतिय चाप वा वल नै भोल्टेज (Voltage) हो। भोल्टेज विद्युत परिपथको कुनै दुई विन्दु बीचमा ईलेक्ट्रोनको फरकका कारण उत्पन्न हुन्छ। अर्थात दुई ध्रुवहरु बीचको Potential Difference (P.D.) लाई नै भोल्टेज (Voltage) भनिन्छ। भोल्टेज (Voltage) लाई Electromotive Force (E.M.F.) पनि भनिन्छ।\n\nभोल्टेजलाई छोटकरीमा V ले संकेत गरिन्छ। भोल्टेजको सानो एकाई Volt (V) हो। भोल्टेजलाई Volt Meter द्वारा नापिन्छ। हाम्रो नेपालमा घरायासी उपयोगको लागि २३० भोल्ट र औद्योगिक उपयोगको लागि ४०० भोल्टको व्यवस्था गरिएको छ।\n\nभोल्टेजका एकाईहरू:\n• 1000 Micro Volts (µV) = 1 Milli Volt (mV)\n• 1000 Milli Volts (mV) = 1 Volt (V)\n• 1000 Volts (V) = 1 Kilo Volt (KV)\n• 1000 Kilo Volts (KV) = 1 Mega Volt (MV)'
      },
      {
        heading: 'विद्युतधारा (Current):',
        text: 'प्रति एकाई समयमा वहने ईलेक्ट्रोनको संख्यालाई विद्युतधारा (Current) भनिन्छ। जब सुचालक तारमा विद्युतिय दवाव (Voltage) प्रयोग गरिन्छ, तब तारमा भएको ईलेक्ट्रोनहरु एक ठाउँबाट अर्को ठाउँ वहन थाल्दछ। त्यहि ईलेक्ट्रोनहरुको बगाईलाई नै विद्युतधारा (Current) भनिन्छ। अर्थात सुचालक तारमा भएका स्वतन्त्र ईलेक्ट्रोनको प्रवाहलाई नै विद्युतधारा भनिन्छ। अर्को शब्दमा भन्नुपर्दा ईलेक्ट्रोनको गतिलाई विद्युतधारा भनिन्छ।\n\nविद्युत चार्जको मात्रालाई कोलम्ब (Coulomb) एकाईमा नापिन्छ। १ कोलम्ब = 6 × 10^18 ईलेक्ट्रोनहरु हुन्छ, जसलाई १ युनिट पनि भनिन्छ। विद्युतधारालाई (I) अक्षरले संकेत गरिन्छ। यसको एकाई एम्पियर (Ampere - A) हो। विद्युतधारा नाप्न एम्पियर मिटर (Ampere Meter) प्रयोग गरिन्छ।\n\nकरेन्टका एकाईहरू:\n• 1000 Micro Ampere (µA) = 1 Milli Ampere (mA)\n• 1000 Milli Ampere (mA) = 1 Ampere (A)\n• 1000 Ampere (A) = 1 Kilo Ampere (KA)\n• 1000 Kilo Ampere (KA) = 1 Mega Ampere (MA)'
      },
      {
        heading: 'अवरोध (Resistance):',
        text: 'पदार्थको त्यो गुण हो जसले ईलेक्ट्रोनहरुको प्रवाहलाई रोक्न खोज्दछ। अथवा जसले विद्युत परिपथको कुनै दुई विन्दु बीचको भोल्टेज फरक पार्दछ भने त्यसलाई अवरोध (Resistance) भनिन्छ। अथवा सुचालक तारमा ईलेक्ट्रोनहरुलाई वग्न वा सर्न नदिनको लागि अवरोध खडा गर्ने गुण भएको वस्तुलाई अवरोध (Resistance) भनिन्छ। अवरोध प्रत्येक पदार्थमा भएको गुणसंग निर्भर रहन्छ।\n\nअवरोधलाई (R) ले जनाईन्छ। यसको एकाई ओहम (Ohm) हो। यसलाई (Ω) ले संकेत गरिन्छ। अवरोध नाप्न ओहम मिटर (Ohm Meter) को प्रयोग गरिन्छ।\n\nअवरोधका एकाईहरू:\n• 1000 Ohm (Ω) = 1 Kilo Ohm (KΩ)\n• 1000 Kilo Ohm (KΩ) = 1 Mega Ohm (MΩ)\n• 1000 Mega Ohm (MΩ) = 1 Kilo Mega Ohm (KMΩ)'
      },
      {
        heading: 'ओहमको नियम सम्बन्धि ४ वटा हिसाबहरू (Examples):',
        text: 'सुत्रहरू:\n१) V = I × R (V छोपिदिए IR रहन्छ)\n२) I = V / R (I छोपिदिए V/R रहन्छ)\n३) R = V / I (R छोपिदिए V/I रहन्छ)',
        bullets: [
          'उदाहरण १: कुनै 10 Volts को Supply Line मा 0.5 Ampere Current वगिरहेको छ भने Resistance (R) कति होला? \nहल: R = V / I = 10 / 0.5 = 20 Ω Ans.',
          'उदाहरण २: कुनै 10 Volts को Supply Line मा 20 Ω Resistance भए बगिरहेको Current (I) कति होला? \nहल: I = V / R = 10 / 20 = 0.5 Amps Ans.',
          'उदाहरण ३: कुनै Circuit मा 20 Ω को Resistance लगाउँदा 0.5 Ampere Current बगिरहेको छ भने Supply Voltage कति होला? \nहल: V = I × R = 0.5 × 20 = 10 Volts Ans.',
          'उदाहरण ४: कुनै Circuit मा Supply Voltage = 20 Volts, Current (I) = 2 Ampere, र Resistance = 10 Ω भए उक्त Resistance को Power (Watt) कति होला? \nहल: P = V × I = 20 × 2 = 40 Watt (वा P = I² × R = 2² × 10 = 40 Watt) Ans.'
        ]
      }
    ],
    homework: [
      '१) १५ किलो भोल्ट बराबर कति भोल्ट र कति मेगा भोल्ट हुन्छ?',
      '२) कुनै लोडको अवरोध ८० ओहम छ, त्यसमा सप्लाई भोल्टेज २०० भए बग्ने करेन्ट र पावर कति होला?'
    ]
  },
  {
    day: 'पाँचौं र छैटौं दिन',
    dayNumber: 5,
    title: 'ईलेक्ट्रीसियनले प्रयोग गर्ने औजारहरु',
    nepaliTitle: 'विद्युतीय कार्यका लागि आवश्यक २४ औजारहरू र तिनको सहि प्रयोग',
    duration: '१०:०० घण्टा',
    objective: 'ईलेक्ट्रीसियनले प्रयोग गर्ने औजारहरू जान्ने छन् र यसको प्रयोग बारे ज्ञान हासिल गर्नेछन्।',
    category: 'tools',
    tableRows: [
      { sn: '१', activity: 'अघिल्लो दिनको गृहकार्य जाँच तथा पृष्ठ पोषण', method: 'प्रश्नोत्तर र छलफल', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '२', activity: 'सहभागीहरूले जानेका औजारहरुको नाम सोध्दै जाने र प्रयोग बारे चर्चा गर्ने।', method: 'प्रश्नोत्तर र छलफल', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '३', activity: 'सहभागीहरुबाट छुटेका औजारहरुको नाम बोर्डमा लेख्दै प्रयोग बारे चर्चा गर्ने', method: 'व्याख्यान र छलफल', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '२:०० घण्टा' },
      { sn: '४', activity: 'प्रत्येक सहभागीहरूलाई औजार देखाउदै अभ्यास गराउने।', method: 'प्रदर्शन तथा प्रयोगात्मक', materials: 'औजार तथा प्रयोगात्मक सामाग्री', duration: '६:३० घण्टा' },
      { sn: '५', activity: 'ईलेक्ट्रीसियनले प्रयोग गर्ने औजारहरुको बारेमा प्रश्नोत्तर र गृहकार्य', method: 'प्रश्नोत्तर', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' }
    ],
    contentSections: [
      {
        heading: 'विद्युतिय कार्यका लागी आवश्यक प्रमुख औजारहरू (१ देखि १२):',
        text: '१. पेचकस (Screw Driver): विभिन्न नाप (१२, १५, २०, २५ से.मि.) मा पाइन्छ। अगाडिको भाग तिखो हुनुहुँदैन, जस्तो स्क्रू छ त्यस्तै साइजको प्रयोग गर्नुपर्छ, कहिल्यै छिनाको काम गर्नुहुँदैन र इन्सुलेटेड बिँड भएको मात्र प्रयोग गर्नुपर्छ।\n२. प्लायर (Plier): कम्बिनेसन प्लायर (Combination), डाइगोनल कटिङ प्लायर (Diagonal Cutting), चुच्चे प्लायर (Nose Plier), स्लिप ज्वाइन्ट प्लायर (Slip Joint)। कहिल्यै हथौडाको काम नगर्ने, तातो वस्तु नसमात्ने, स्टिलको तार नकाट्ने।\n३. चक्कु (Knife): इन्सुलेटेड तारको इन्सुलेसन निकाल्न। धारिलो भाग र मोटो भाग हुन्छ।\n४. ईलेक्ट्रिक सोल्डरिङ्ग आईरन (Electric Soldering Iron): स-साना तारहरू वेल्डिङ्ग/जोड्नको लागि।\n५. हथौडा (Hammer): किल्ला ठोक्न वा निकाल्न। क्ल ह्यामर (Claw), बल पिन (Ball pin), क्रस पिन (Cross pin), फ्ल्याट पिन (Flat pin)।\n६. करौती (Wooden Saw): काठ तथा बोर्डहरू काट्न। प्रयोगपछि ग्रिज लगाएर राख्नुपर्छ।\n७. छिनो (Chisel): पर्खाल वा भित्ता फुटाउन।\n८. बटाम (Try Square): तारहरू, रेसिङ केपिङ ९० डिग्रीमा मोडिएको छ छैन नाप्न।\n९. रावो (Wood Chisel): काठ काट्न वा फोर्ने काममा (१३ देखि २० से.मि.)।\n१०. पोकर (Poker): काठमा स्क्रू कस्नु अघि सुरुवाती प्वाल पार्न।\n११. गीमलेट (Gimlet): काठमा सिधा गहिरो प्वाल पार्न (गियर र नन गियर)।\n१२. ईलेक्ट्रिक ह्याण्ड ड्रिल (Electric Hand Drill): Surface Conduit Wiring गर्दा भित्तामा प्वाल पारी ग्रिप राख्न।'
      },
      {
        heading: 'विद्युतिय कार्यका लागी आवश्यक प्रमुख औजारहरू (१३ देखि २४):',
        text: '१३. ह्याक्सो (Hacksaw): फलाम र ठुला तार काट्न। लम्बाइ ३० से.मि., दाँत अगाडि फर्केको हुनुपर्छ। पानी/कुलेन्ट प्रयोग गर्नुपर्छ।\n१४. रेती (File): कन्ड्युट पाइपका धारिला भाग सफा गर्न (२० से.मि.)। सफा गर्दा H2SO4 मा डुबाउनुपर्छ।\n१५. याकेट वीट ब्रास (Ratchet Bit Brace): फलामका पाता वा काठमा ठूलो प्वाल पार्न।\n१६. घण्टी / साहुल (Plumbob): डकर्मी घण्टी। वस्तु Vertical ९० डिग्री कोणमा छ छैन जाँच्न।\n१७. पाईप भाईस (Pipe Vice): पाइप काट्न वा थ्रेड बनाउन पाइपलाई च्याप्ने साधन।\n१८. पाईप कटर (Pipe Cutter): पाइप सहजै काट्न प्रयोग गरिने कटर।\n१९. स्पैनर सेट (Spanner Set): नट-बोल्ट खोल्न। Double Ended, Box Slide, Ring Spanner, Slide Wrench, Pipe Wrench।\n२०. मेजरीङ्ग टेप (Measuring Tape): ३ मि., ५ मि., १० मि., १५ मि. लम्बाइ/चौडाइ नाप्ने फिता।\n२१. फेज टेस्टर / लाइन टेस्टर (Phase/Line Tester): लाइनमा करेन्ट भए नभएको जाँच्न।\n२२. तार छिल्ने (Wire Stripper): तारको इन्सुलेसन सुरक्षित ताछ्न।\n२३. क्रिम्पिङ्ग टुल (Crimping Tool): आल्मुनियम तारमा थिम्बल जोड्न।\n२४. वायर गेज (Wire Gauge): तारको मोटाइ (Size / SWG) नाप्ने गोलो चक्का।'
      }
    ],
    homework: [
      '१) १२ वटा औजारको नाम र त्यसको प्रयोग बारे लेख्नुहोस्।',
      '२) औजारहरू प्रयोग गर्दा अपनाउनु पर्ने सावधानीहरु बारे लेख्नुहोस्।'
    ]
  },
  {
    day: 'सातौं दिन',
    dayNumber: 7,
    title: 'विद्युत उत्पादन, प्रसारण र वितरण',
    nepaliTitle: 'उत्पादन (Generation), उच्च भोल्टेज प्रसारण (Transmission) र वितरण (Distribution)',
    duration: '५:०० घण्टा',
    objective: 'सहभागीहरूले विद्युत उत्पादन, प्रसारण र वितरण कसरी हुन्छ भन्नेबारे जान्नेछन्।',
    category: 'foundation',
    tableRows: [
      { sn: '१', activity: 'अघिल्लो दिनको गृहकार्य जाँच तथा पृष्ठपोषण', method: 'प्रश्नोत्तर र छलफल', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '२', activity: 'विद्युत उत्पादन गृहको नाम सोध्ने र के बाट कसरी उत्पादन हुन्छ छलफल गर्ने।', method: 'प्रश्नोत्तर र छलफल', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '३', activity: 'विद्युत उत्पादन, प्रसारण र वितरण सम्बन्धि विस्तृत ज्ञान दिने।', method: 'व्याख्यान र छलफल', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '२:०० घण्टा' },
      { sn: '४', activity: 'High Voltage बाट प्रसारण गर्दाको फाइदाबारे सामुहिक छलफल गर्ने', method: 'सामुहिक छलफल', materials: 'मार्कर, फ्लिप चार्ट, पिन बोर्ड', duration: '१:३० घण्टा' },
      { sn: '५', activity: 'सहभागीहरुलाई प्रश्नोत्तर र गृहकार्य दिने।', method: 'प्रश्नोत्तर र छलफल', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' }
    ],
    contentSections: [
      {
        heading: 'विद्युत उत्पादन (Generation)',
        text: 'विद्युत उत्पादन सामान्यतया रासायनिक शक्ति, वायु शक्ति, वाष्प शक्ति र जल शक्ति बाट टर्वाइन घुमाइन्छ र यसमा जडित जेनेरेटरबाट विद्युत उत्पादन गर्न सकिन्छ। टर्वाइनको मेकानिकल शक्तिले जेनेरेटरको क्वाइल (रोटर) घुमाई विद्युत शक्ति उत्पन्न गर्दछ।\n\nजेनेरेटर स्टेशनमा उत्पादन हुने भोल्टेज प्रायः 3.3 KV, 6.6 KV, र 11 KV हुने गर्दछ।\n\nविद्युत उत्पादनका प्रमुख स्रोतहरु:\n१) हाईड्रो पावर स्टेशन (Hydro Power)\n२) थर्मल पावर स्टेशन (Thermal Power)\n३) डिजेल पावर स्टेशन (Diesel Power)\n४) आणविक/अटोनिक पावर स्टेशन (Atomic Power)\n५) सोलार पावर स्टेशन (Solar Power)\n६) वीण्ड ईनर्जी (Wind Energy)'
      },
      {
        heading: 'विद्युतको प्रसारण (Transmission)',
        text: 'उत्पादित विद्युत शक्तिलाई लामो दुरि सम्म अर्थात प्रसारण सव स्टेशन सम्म पुर्याउन प्रयोग गरिने सम्पूर्ण उपकरणहरु जडित प्रणालीलाई प्रसारण प्रणाली भनिन्छ।\n\nGenerating Station बाट उत्पादित विद्युतलाई Step-Up Transformer प्रयोग गरी Voltage लाई बढाइन्छ, जस्तै: ३३ के.भी., ६६ के.भी., १३२ के.भी., २२० के.भी. आदि। नेपालमा २२० के.भी. सम्म प्रसारण लाईन संचालनमा छ भने अन्य केहि देशमा ७६५ के.भी. सम्म प्रसारण लाईन प्रयोगमा ल्याइएको पाइन्छ।'
      },
      {
        heading: 'विद्युतको वितरण (Distribution)',
        text: 'उत्पादित विद्युत शक्तिलाई प्रसारण लाईन मार्फत सिधै प्रयोग गर्न नमिल्ने भएकोले सब स्टेशनबाट भोल्टेज घटाएर विभिन्न फिडरहरू मार्फत ४०० भोल्ट (थ्री फेज) र २३० भोल्ट (सिंगल फेज) क्षमता निर्धारण गरी उपभोक्तासम्म पुर्याइन्छ।\n\nवितरण प्रणाली दुई प्रकारका हुन्छन्:\nक) ओभरहेड सिस्टम (Overhead System): पोल वा टावरको क्रस आर्म इन्सुलेटरमा तार तानेर गरिने वितरण। यो सस्तो र सजिलो हुन्छ।\nख) अण्डरग्राउण्ड सिस्टम (Underground System): जमिन मुनिबाट केबललाई १ मिटर गहिराई, ०.५ मिटर चौडाई खाडल खनेर, ५ से.मी. बालुवा राखी, केबल बिछ्याएर पुनः १५ से.मी. बालुवा र इँटाले छोपेर सुरक्षित तरिकाले गरिने वितरण।'
      },
      {
        heading: 'High Voltage Transmission का ३ फाइदाहरू',
        text: '१) Conductor and Material मा वचत: भोल्टेज बढाउँदा लाइनमा Power loss कम हुन्छ, जसले गर्दा तारको साइज (कन्डक्टरको तौल र खर्च) घट्न जान्छ।\n२) Line को कार्यक्षमतामा वृद्धि: पावर लस कम हुने भएकाले प्रसारण लाइनको एफिसिएन्सी बढ्छ।\n३) Voltage Regulation मा राम्रो: भोल्टेज धेरै हुँदा करेन्ट कम हुन्छ, जसले गर्दा Line voltage drop कम भई भोल्टेज रेगुलेसन राम्रो हुन्छ।'
      }
    ],
    homework: [
      '१) Hydro power भन्नाले के बुझिन्छ?',
      '२) विद्युत प्रसारण कसरी गरिन्छ?'
    ]
  },
  {
    day: 'आठौं दिन',
    dayNumber: 8,
    title: 'विद्युत परिपथ (Electric Circuit)',
    nepaliTitle: 'विद्युत परिपथका ७ प्रकार (Open, Close, Short, Leakage, Series, Parallel, Mix)',
    duration: '५:०० घण्टा',
    objective: 'सहभागीहरूले विद्युत परिपथ भनेको के हो? प्रयोग, बनावट र प्रकार बारे जान्नेछन्।',
    category: 'circuits',
    tableRows: [
      { sn: '१', activity: 'अघिल्ला दिनको गृहकार्य जाँच तथा पृष्ठपोषण', method: 'प्रश्नोत्तर र व्याख्यान', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '२', activity: 'विद्युत परिपथ भनेको के हो? यस बारे बुझाउने।', method: 'व्याख्यान र छलफल', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '१:०० घण्टा' },
      { sn: '३', activity: 'विद्युत परिपथ र यसका प्रकार बारे छलफल गर्ने र सिक्नुपर्ने कुराबारे व्याख्या गर्ने।', method: 'व्याख्यान र छलफल', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '२:०० घण्टा' },
      { sn: '४', activity: 'परिपथ सम्बन्धि हिसाबको ज्ञान र कक्षाकार्य र गृहकार्य।', method: 'व्याख्यान र प्रश्नोत्तर', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '१:३० घण्टा' }
    ],
    contentSections: [
      {
        heading: 'विद्युत परिपथ (Electric Circuit) को परिभाषा',
        text: 'सुचालक वस्तुमा भएको ईलेक्ट्रोन (Electron) हरुलाई एक ठाउँबाट अर्को ठाउँ सम्म वग्न तथा लैजानको लागि चाहिने आवश्यक बाटो तथा माध्यमलाई विद्युत परिपथ (Electric Circuit) भनिन्छ। विद्युत परिपथ ७ प्रकारका हुन्छन्:\nक) खुल्ला परिपथ (Open Circuit)\nख) बन्द परिपथ (Close Circuit)\nग) छोटो परिपथ (Short Circuit)\nघ) चुहिएको परिपथ (Leakage Circuit)\nङ) लहरे परिपथ (Series Circuit)\nच) समानान्तर परिपथ (Parallel Circuit)\nछ) संयुक्त परिपथ (Mix Circuit)',
        diagramType: 'circuit-types'
      },
      {
        heading: 'परिपथका विस्तृत विवरणहरू',
        text: '१. खुल्ला परिपथ (Open Circuit): स्वीच Off रहेको वा तार टुटेको अवस्था। करेन्ट बग्दैन (Current = 0), उपकरण चल्दैन, Voltage Drop हुँदैन।\n२. बन्द परिपथ (Close Circuit): स्वीच On भएको अवस्था। करेन्ट स्रोतबाट निस्केर लोडमा पुगी पुनः स्रोतमा फर्किन्छ र लोड चल्छ।\n३. छोटो परिपथ (Short Circuit): लोड बिना नै फेज र न्युट्रल एक आपसमा जोडिँदा। अत्यधिक करेन्ट बग्छ, तार तातेर आगो लाग्ने खतरा हुन्छ।\n४. चुहिएको परिपथ (Leakage Circuit): इन्सुलेसन बिग्रेर तार भित्ता वा उपकरणको धातुको बडीमा छुँदा करेन्ट चुहिन्छ।\n५. लहरे परिपथ (Series Circuit): उपकरणहरू क्रमिक रूपमा जोडिन्छन्। करेन्ट एउटै बग्छ, भोल्टेज बाँडिन्छ (RT = R1+R2+...; VT = V1+V2+...)। सजावटका बत्तीहरू (२२०V / ६V = ३७ बत्ती)। एउटा बिग्रे सबै निभ्छन्।\n६. समानान्तर परिपथ (Parallel Circuit): सबै लोडमा सीधा फेज र न्युट्रल जोडिन्छ। भोल्टेज समान (२३०V) रहन्छ, करेन्ट बाँडिन्छ (1/RT = 1/R1 + 1/R2 + ...)। घरायसी र औद्योगिक वाइरिङ यसैमा गरिन्छ।\n७. संयुक्त परिपथ (Mix Circuit): सिरिज र प्यारालल दुवै विधि एकसाथ जोडिएको परिपथ।'
      }
    ],
    homework: [
      'क) विद्युत परिपथ भनेको के हो? लहरे परिपथ र समानान्तर परिपथ बीच फरक लेख्नुहोस्।'
    ]
  },
  {
    day: 'नवौं दिन',
    dayNumber: 9,
    title: 'विद्युतय झट्का र यसबाट बच्ने उपायहरू',
    nepaliTitle: 'इलेक्ट्रिक शक, १४ सुरक्षा नियमहरू र ३ कृत्रिम श्वास तरिकाहरू',
    duration: '५:०० घण्टा',
    objective: 'सहभागीहरूले विद्युतिय झट्का के हो र यसबाट बच्ने उपाय तथा प्राथमिक उपचार जान्नेछन्।',
    category: 'safety',
    tableRows: [
      { sn: '१', activity: 'अघिल्ला दिनको गृहकार्य जाँच तथा पृष्ठपोषण', method: 'प्रश्नोत्तर र व्याख्यान', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '२', activity: 'विद्युतिय झट्का भनेको के हो? यसबाट बच्ने उपायबारे छलफल गर्ने।', method: 'चित्र, व्याख्यान र छलफल', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '१:३० घण्टा' },
      { sn: '३', activity: 'प्राथमिक उपचारबारे छलफल गर्दै आवश्यक पर्ने कुराको जानकारी दिने।', method: 'व्याख्यान, छलफल र प्रयोगात्मक', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '२:३० घण्टा' },
      { sn: '४', activity: 'प्रश्नोत्तर गर्दै अन्त्यमा गृहकार्य।', method: 'व्याख्यान र प्रश्नोत्तर', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' }
    ],
    contentSections: [
      {
        heading: 'विद्युतिय झट्का (Electric Shock)',
        text: 'शरिरको नशाहरुमा उत्पन्न हुने एक प्रकारको तरंग जसले स्नायु प्रणालीमा असर गरी मसल खुम्चने र अचेत पार्दछ भने त्यसलाई विद्युतिय झट्का (Electric Shock) भनिन्छ।\n\nसामान्यतः ४० भोल्ट भन्दा माथिको भोल्टेजले विद्युतिय झट्का लाग्दछ। तरपनि १२५ भोल्ट भन्दा माथिको भोल्टेज शरिरको लागी बढि खतरा मानिन्छ। जब हाम्रो शरिरले विद्युत वहने सुचालक को कार्य गर्दछ त्यसवेला हामीलाई झट्का लाग्दछ। पृथ्वी एउटा Zero Potential भएकोले शरिरबाट तिव्र गतिमा इलेक्ट्रोनहरु जमिनतर्फ प्रवाह हुन्छन् जसले गर्दा मुटु र स्नायु प्रणालीमा असर गर्छ।'
      },
      {
        heading: 'विद्युतिय सुरक्षाका १४ नियमहरु (Safety Precautions)',
        text: '१. काम गर्ने कार्य स्थलमा सधैव सचेत हुने, Main Supply Shut Down गरेर मात्र कार्य गर्ने।\n२. Safety Tools जस्तो Hand Glove, Safety Belt, बुट, एप्रोन, चस्मा आदि लगाउने।\n३. केबलहरु राम्रोसंग Insulated भए नभएको जाँच गर्ने।\n४. केबलहरू भुईँमा जथाभावी पल्टिरहेको, धारिलो वस्तु वा आगो नजिक भए टाढा राख्ने।\n५. जमिन मुनि गाडिएको केबल कम्तिमा ४५० मि.मि. (१८ ईन्च) मुनि र टायल्सले ढाकिएको हुनुपर्छ।\n६. भुण्डिएका केबल जमिन देखि कम्तिमा ५.२ मिटर (१७ फिट) माथि हुनुपर्दछ।\n७. काम गर्ने ठाउँमा आवश्यक प्रकाश हुनुपर्दछ।\n८. पावर परिपथमा दोब्बर इन्सुलेसन भएको केबल प्रयोग गर्ने।\n९. पोर्टेबल औजारहरू केबलमा समातेर नसार्ने।\n१०. मेसिनमा लोड भएको अवस्थामा सिधै बन्द नगर्ने।\n११. फ्युज बदल्नु अघि मेन स्वीच बन्द गर्ने।\n१२. कार्य गर्नु अघि Line Tester ले जाँच्ने र Line Short गरेर काम गर्ने।\n१३. कार्य सकिएपछि औजारहरू यथास्थानमा राख्ने।\n१४. कार्य प्रारम्भ गर्नु अघि दिईएको निर्देशन राम्ररी अध्ययन गर्ने।'
      },
      {
        heading: 'प्राथमिक उपचार र कृत्रिम श्वास दिने ३ तरिकाहरू',
        text: 'विद्युत झट्का लाग्दा स्विच बन्द गर्ने, कुचालक वस्तु (सुक्खा लट्ठी, डोरी, लेदर बेल्ट) ले पीडितलाई छुटाउने र तुरुन्त समतल ठाउँमा सुताउने।\n\nकृत्रिम श्वास दिने तरिकाहरू (Method of Resuscitation):\n१. काँधमा थिचेर (Prone Resuscitation)\n२. मुखमा मुख जोडेर (Mouth to Mouth Resuscitation)\n३. नाकमा मुख जोडेर (Mouth to Nose Resuscitation)'
      }
    ],
    homework: [
      'क) विद्युत झट्का कसरी लाग्दछ? यसबाट बच्ने उपायहरु लेख्नुहोस्।'
    ]
  },
  {
    day: 'दशौं दिन',
    dayNumber: 10,
    title: 'Wire Joint र यसका प्रकार',
    nepaliTitle: 'तारका जोइन्टहरू: Twist, Married, Britannia र Western Union',
    duration: '५:०० घण्टा',
    objective: 'सहभागीहरूले Wire Joint र यसका प्रकार बारे जान्नेछन् र विभिन्न Wire Joint हरु बनाउन सक्षम हुनेछन्।',
    category: 'circuits',
    tableRows: [
      { sn: '१', activity: 'अघिल्ला दिनको गृहकार्य जाँच तथा पृष्ठपोषण', method: 'प्रश्नोत्तर र छलफल', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '२', activity: 'Wire Joint को महत्व र प्रकार बारे सचित्र वर्णन गर्ने।', method: 'चित्र, व्याख्यान र छलफल', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '१:०० घण्टा' },
      { sn: '३', activity: 'सहभागीहरुलाई चित्र अनुसार विभिन्न किसिमका Wire Joint हरु गर्न लगाउने', method: 'प्रयोगात्मक', materials: '१/१८, ३/२२, ३/२० तार र प्लायर', duration: '३:०० घण्टा' },
      { sn: '४', activity: 'प्रश्नोत्तर गर्दै अन्त्यमा गृहकार्य', method: 'व्याख्यान र प्रश्नोत्तर', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' }
    ],
    contentSections: [
      {
        heading: 'Wire Joint को परिचय र प्रकारहरू',
        text: 'दुई वा दुई भन्दा बढि तारहरुलाई आवश्यकता अनुसार एकआपसमा खप्टाई दरिलो संग जोड्नु नै Wire Joint हो। यो तारको लम्बाई बढाउन, तारको दिशा परिवर्तन गर्न गरिन्छ।\n\nप्रकारहरू:\nक) ट्वीष्ट ज्वाएण्ट (Twist Joint): सिंगल स्ट्राण्ड इन्सुलेटेड तारको लम्बाइ बढाउन र जक्सन बक्समा जोड्न।\n   १. ट्वीष्ट स्ट्रेट ज्वाएण्ट\n   २. ट्वीष्ट टी ज्वाएण्ट\n   ३. र्‍याट/पिग टेल ज्वाएण्ट (Rat / Pig Tail Joint)\n\nख) म्यारिड ज्वाएण्ट (Married Joint): मल्टी स्ट्राण्ड इन्सुलेटेड तारहरूको लम्बाइ बढाउन।\n   १. म्यारिड स्ट्रेट ज्वाएण्ट\n   २. म्यारिड टी ज्वाएण्ट\n\nग) ब्रिटानिया ज्वाएण्ट (Britannia Joint): ओभरहेड लाईनको नाङ्गो तारको लम्बाइ बढाउन, दिशा मोड्न र सर्भिस लाइन जोड्न।\n   १. ब्रिटानिया स्ट्रेट ज्वाएण्ट\n   २. ब्रिटानिया टी ज्वाएण्ट\n\nघ) वेस्टन युनियन (Western Union Joint): ओभरहेड लाईनको सिङ्गल स्ट्राण्ड नाङ्गो तारको लम्बाई बढाउन प्रयोग गरिन्छ।',
        diagramType: 'wire-joints'
      },
      {
        heading: 'तार ज्वाएन्ट गर्दाका ७ वटा सावधानिहरू:',
        text: '१. तार ज्वाएण्ट गरेपछि सजिलै विद्युत प्रवाह हुन सक्षम हुनुपर्दछ।\n२. तार ज्वाएण्टलाई दुईतिर बाट तान्दा नफुत्कने दरिलो हुनुपर्दछ।\n३. तारको ईन्सुलेसन छिल्दा सुचालक वस्तुमा घाउ चोट बनाउनु हुदैन।\n४. तार बटार्दा विचमा खाली ठाउँ हुनुहुदैन र प्लायर वा कटरको दाग बस्नु हुदैन।\n५. ज्वाएण्टमा धुलो, ग्रिज, तथा अन्य चिल्लो पदार्थ हुनुहुदैन।\n६. तारले वाईण्डिङ्ग गर्दा टम्म मिलेको र हेर्दा आकर्षक हुनु पर्दछ।\n७. तारलाई सिधा गर्न कटनको कपडा, जुट, र प्लाष्टिक वा काठको मुङ्ग्रो मात्र प्रयोग गर्नुपर्दछ।'
      }
    ],
    homework: [
      'क) तार ज्वाएण्ट गर्दा अपनाउनु पर्ने प्रक्रियाहरु लेख्नुहोस्।'
    ]
  },
  {
    day: 'एघारौं दिन',
    dayNumber: 11,
    title: 'विद्युतिय चिन्हहरु (Electric Symbol)',
    nepaliTitle: '६४ वटा मानक विद्युतिय संकेतहरू: लेआउट सिम्बोल र वायरिङ सिम्बोल',
    duration: '५:०० घण्टा',
    objective: 'सहभागीहरूले विद्युतिय चिन्हहरु (Electric Symbol) को बारेमा जान्ने छन् र बनाउन सक्नेछन्।',
    category: 'symbols',
    tableRows: [
      { sn: '१', activity: 'अघिल्ला दिनको गृहकार्य जाँच तथा पृष्ठपोषण', method: 'प्रश्नोत्तर र छलफल', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '२', activity: 'विद्युतिय चिन्हहरु (Electric Symbol) को प्रस्तुतिकरण गर्ने।', method: 'चित्र, व्याख्यान र छलफल', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '२:०० घण्टा' },
      { sn: '३', activity: 'विभिन्न किसिमका विद्युतिय चिन्हहरुको चित्र कोर्न लगाउने र नबुझेका कुरा बुझाउने।', method: 'चित्र, व्याख्यान र प्रयोगात्मक', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '२:०० घण्टा' },
      { sn: '४', activity: 'प्रश्नोत्तर गर्दै अन्त्यमा गृहकार्य', method: 'व्याख्यान र प्रश्नोत्तर', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' }
    ],
    contentSections: [
      {
        heading: 'विद्युतिय चिन्हहरु (Electric Symbols) को महत्व',
        text: 'विद्युतिय क्षेत्रमा प्रयोग हुने विभिन्न उपकरणहरुको कहाँ के प्रयोग गर्ने भनि संकेतद्वारा निर्देशित गर्नको लागि बनाईएको सांकेतिक चिन्हलाई विद्युतिय चिन्हहरु (Electric Symbol) भनिन्छ।\n\nइन्जिनियरिङ नक्सांकनमा दुई प्रकारका संकेत प्रयोग हुन्छन्:\n१) लेआउट सिम्बोल (Lay-Out Symbol): नक्सामा उपकरणको स्थान देखाउने आर्किटेक्चरल संकेत।\n२) वायरिङ सिम्बोल (Wiring Symbol): तारहरू कसरी जोडिएका छन् भन्ने देखाउने स्किम्याटिक संकेत।\nतल पृष्ठ ३४ देखि ३६ सम्मका सम्पूर्ण ६४ वटा आधिकारिक संकेतहरूको तालिका दिइएको छ।',
        diagramType: 'symbols-table'
      }
    ],
    homework: [
      'क) कुनै २० वटा महत्वपूर्ण विद्युतिय चिन्हहरूको लेआउट र वायरिङ सिम्बोल बनाउनुहोस्।'
    ]
  },
  {
    day: 'बाह्रौं दिन',
    dayNumber: 12,
    title: 'Electric Diagram (विद्युतिय रेखा चित्र)',
    nepaliTitle: 'Lay-Out Diagram, Wiring Diagram र Single Line Diagram',
    duration: '५:०० घण्टा',
    objective: 'Lay out Diagram र Wiring Diagram का बारे जान्ने छन् र Electric Diagram बनाउन सक्नेछन्।',
    category: 'circuits',
    tableRows: [
      { sn: '१', activity: 'अघिल्ला दिनको गृहकार्य जाँच तथा पृष्ठपोषण', method: 'प्रश्नोत्तर र छलफल', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '२', activity: 'Lay out Diagram र Wiring Diagram को महत्व बारे सचित्र वर्णन गर्ने।', method: 'चित्र, व्याख्यान र छलफल', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '२:०० घण्टा' },
      { sn: '३', activity: 'उपकरण अनुसार Lay out Diagram र Wiring Diagram कोर्न लगाउने।', method: 'प्रयोगात्मक', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '२:०० घण्टा' },
      { sn: '४', activity: 'प्रश्नोत्तर गर्दै अन्त्यमा गृहकार्य', method: 'व्याख्यान र प्रश्नोत्तर', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' }
    ],
    contentSections: [
      {
        heading: 'Electric Diagram का ३ प्रकारहरू',
        text: 'विभिन्न खालको रेखा वा चित्रहरुको माध्यमबाट विद्युतिय सामाग्रीहरुको पहिचान दिई ती सामाग्रीहरुमा तारको जडान गर्न स्पष्ट रुपमा बनाईएको रेखाचित्रहरुलाई नै Electric Diagram (विद्युतिय रेखा चित्र) भनिन्छ।\n\nक) Lay-Out Diagram (लेआउट डायग्राम): के कस्ता विद्युतिय सामाग्रीहरु कुन कति नाप र संख्यामा गर्ने भनि रेखाचित्रद्वारा उल्लेख गरिएको नक्सा। जस्तै: १५ से.मी., ४० से.मी. को दूरीमा F1 फ्युज, S1 स्विच र L1 बत्तीको स्थान।\n\nख) Wiring Diagram (वायरिङ डायग्राम): लेआउट अनुसार राखिएको सामाग्रीहरुमा कुन तार (Phase P वा Neutral N) कहाँ कसरी जोड्ने भन्ने कुरा स्पष्ट देखाइएको निर्देशनात्मक नक्सा।\n\nग) Single Line Diagram (सिंगल लाईन डायग्राम): एउटै रेखाद्वारा फ्युज, स्विच, लोड तथा तिनका क्षमता उल्लेख गरिएको नक्सा। प्रायः Distribution Board (DB) र Pannel Board को जडान गर्न यस्तो नक्सा प्रयोग गरिन्छ।'
      }
    ],
    homework: [
      'क) आफूले जानेको लेआउट ड्रईङलाई वायरिङ डायग्राम बनाएर देखाउनुहोस्।'
    ]
  },
  {
    day: 'तेह्रौं दिन',
    dayNumber: 13,
    title: 'विद्युत जडान कार्यमा प्रयोग हुने तार केबुल',
    nepaliTitle: 'तार र केबुलका प्रकार तथा PVC Insulated Wire करेन्ट क्षमता तालिका',
    duration: '५:०० घण्टा',
    objective: 'तार र केबुलको परिभाषा, प्रकार र प्रयोग बारे जान्नुको साथै आवश्यकता अनुसारको उपयुक्त तार र केबुलको छनौट गर्न सक्नेछन्।',
    category: 'cables',
    tableRows: [
      { sn: '१', activity: 'अघिल्ला दिनको गृहकार्य जाँच तथा पृष्ठपोषण', method: 'प्रश्नोत्तर र छलफल', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '२', activity: 'विद्युत जडान कार्यमा प्रयोग हुने तार र केबुल सम्बन्धी आवश्यक जानकारी दिने।', method: 'छलफल, व्याख्यान र प्रदर्शन', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '२:०० घण्टा' },
      { sn: '३', activity: 'तार र केबुल कुन आधारमा प्रयोग गर्नुपर्छ बारे छलफल गर्दै बुझाउने।', method: 'छलफल र व्याख्यान', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '२:०० घण्टा' },
      { sn: '४', activity: 'प्रश्नोत्तर गर्दै अन्त्यमा गृहकार्य', method: 'व्याख्यान र प्रश्नोत्तर', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' }
    ],
    contentSections: [
      {
        heading: 'तार र केबुलको वर्गीकरण',
        text: '१. इन्सुलेटेड तार (Insulated Wire):\n  क) सिंगल स्ट्राण्ड (Single Stranded): एउटा मात्र सुचालक तारलाई बाहिरबाट कुचालक वस्तुले ढाकिएको।\n  ख) मल्टी स्ट्राण्ड (Multi Stranded): दुई वा दुई भन्दा बढी सुचालक तारलाई बाहिरबाट कुचालकले ढाकिएको।\n\n२. नाङ्गो तार (Non Insulated Wire): बाहिरबाट कुनै पनि कुचालकले नढाकिएको तार। प्रसारण र वितरणमा प्रयोग हुन्छ।\n\n३. केबुल (Cable): दुई वा दुई भन्दा बढी कन्डक्टरहरूलाई बाहिरबाट थप सुरक्षात्मक इन्सुलेसन (PVC, XLPE वा आर्मर) ले ढाकिएको तार।\n  • बनावटको आधारमा: कन्सन्ट्रिक सर्भिस मेन, टि.भी. केबल, आर्मर्ड (Armored), अन-आर्मर्ड।\n  • कोर संख्या: २, ३, ३.५, ४, ५ कोर।\n  • भोल्टेज ग्रेड: Low Voltage (PVC, VIR) र High Voltage (XLPE)।',
        diagramType: 'wire-table'
      },
      {
        heading: 'विद्युतिय तारको छनौट सम्बन्धि महत्वपूर्ण नोट:',
        text: 'विद्युतिय तारको छनौट गर्दा करेन्ट निर्धारणलाई मात्र ध्यान दिएर हुदैन। त्यस परिपथको दुरी, तापक्रम र भोल्टेजलाई पनि ख्याल गर्नु पर्दछ। किन भने जति-जति तारको लम्बाई र तापक्रम बढ्दै जान्छ त्यतिनै भोल्टेज ड्रप (Voltage Drop) बढ्दै जान्छ।'
      }
    ],
    homework: [
      'क) ३/२२, ७/२२ र ७/२० तारको क्षमता र प्रयोग क्षेत्र उल्लेख गर्नुहोस्।'
    ]
  },
  {
    day: 'चौधौं दिन',
    dayNumber: 14,
    title: 'केसिङ्ग केपिङ्ग विद्युत जडान (Casing Capping Wiring)',
    nepaliTitle: 'केसिङ्ग केपिङ्ग वायरिङ्ग विधि, फाइदा र ध्यान दिनुपर्ने कुराहरू',
    duration: '५:०० घण्टा',
    objective: 'Lay Out Diagram अनुसार Casing Capping Wiring गरी विद्युत जडान गर्ने कार्य सम्बन्धि जान्ने छन्।',
    category: 'circuits',
    tableRows: [
      { sn: '१', activity: 'अघिल्ला दिनको गृहकार्य जाँच तथा पृष्ठपोषण', method: 'प्रश्नोत्तर र छलफल', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '२', activity: 'केसिङ्ग केपिङ्ग विद्युत जडान गर्ने विधिको जानकारी दिँदै सामाग्री प्रदर्शन गर्ने।', method: 'छलफल, व्याख्यान र प्रदर्शन', materials: 'केसिङ्ग केपिङ्ग, ह्याक्सो, ग्रीप, स्क्रु आदि', duration: '१:०० घण्टा' },
      { sn: '३', activity: 'Lay Out Diagram अनुसार सम्पूर्ण सामाग्रीहरु सहित Casing Capping कार्यविधिको जानकारी गराउने।', method: 'छलफल, व्याख्यान र प्रयोगात्मक', materials: 'केसिङ्ग केपिङ्ग, ह्याक्सो, ग्रीप, स्क्रु आदि', duration: '३:०० घण्टा' },
      { sn: '४', activity: 'प्रश्नोत्तर गर्दै अन्त्यमा गृहकार्य', method: 'व्याख्यान र प्रश्नोत्तर', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' }
    ],
    contentSections: [
      {
        heading: 'केसिङ्ग केपिङ्ग विद्युत जडान (Casing Capping Wiring)',
        text: 'यो वायरिङ्ग गर्दा पहिले भित्तामा Mark गरी Screw को सहायताले Casing राखिन्छ र पछि VIR तथा PVC तारहरू राखेर त्यसलाई Capping ले छोपिन्छ। यो केहि खर्चिलो भएपनि यस प्रकारको वायरिङ्ग बढि चिसो Dam Proof ठाउँहरूमा तथा आगलागीको संभावना हुने ठाउँहरूमा भने उपयुक्त हुदैन। तर यस प्रकारको Wiring पक्की घरहरु तथा समतल स्थानहरुमा गरिन्छ। यो Wiring सजावटको हिसाबले राम्रो मानिन्छ र आजभोली निकै प्रचलनमा रहेको छ।'
      }
    ],
    homework: [
      'क) केसिङ्ग केपिङ्ग विद्युत जडान गर्दा ध्यान दिनुपर्ने कुराहरु के के हुन्?'
    ]
  },
  {
    day: 'पन्ध्रौं र सोह्रौं दिन',
    dayNumber: 15,
    title: 'कन्ड्युट वायरिङ्ग (Conduit wiring)',
    nepaliTitle: 'सतही वायरिङ्ग (Surface) र सतह भित्र गरिने कन्सिल्ड वायरिङ्ग (Concealed)',
    duration: '१०:०० घण्टा',
    objective: 'कन्ड्युट प्रयोग गरी Surface र Concealed Wiring गर्न सक्नेछन्।',
    category: 'circuits',
    tableRows: [
      { sn: '१', activity: 'अघिल्ला दिनको गृहकार्य जाँच तथा पृष्ठपोषण', method: 'प्रश्नोत्तर र छलफल', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '२', activity: 'कन्ड्युट वायरिङ्गका बारे जानकारी दिँदै आवश्यक सामाग्रीको नाम बताउदै चिनाउने।', method: 'छलफल, व्याख्यान र प्रदर्शन', materials: 'PVC पाईप, ह्याक्स, टी, एल्बो, जक्सन, ह्याम्मर, छिना, मेजरीङ्ग टेप', duration: '२:०० घण्टा' },
      { sn: '३', activity: 'Lay Out Diagram अनुसार PVC पाईप बिछ्याउने अभ्यास।', method: 'डायग्राम, छलफल, प्रयोगात्मक', materials: 'PVC पाईप, फिटिङ्स, औजारहरू', duration: '७:०० घण्टा' },
      { sn: '४', activity: 'प्रश्नोत्तर गर्दै अन्त्यमा गृहकार्य', method: 'व्याख्यान र प्रश्नोत्तर', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' }
    ],
    contentSections: [
      {
        heading: 'कन्ड्युट वायरिङ्गका दुई मुख्य प्रकारहरू:',
        text: 'क) सतही वायरिङ्ग (Surface Wiring):\nआँखाले देख्न र छुन सक्ने गरी भित्ता वा जमिनमा कन्ड्युट बिछ्याई गरिने वायरिङ्गलाई सतही वायरिङ्ग भनिन्छ। यस विधिमा पहिले भित्तामा मार्किङ गरी PVC ग्रिप लगाइन्छ, त्यसपछि Screw को सहायताले Shaddle लगाई Elbow, Tee, Junction Box आदिको राखेर वायरिङ्ग गरिन्छ। र पछिबाट आवश्यक तारहरू छिराइन्छ।\n\nख) सतह भित्रबाट गरिने वायरिङ्ग (Underground / Concealed / Recessed Conduit Wiring):\nआँखाले देख्न र छुन नसक्ने गरी भित्ता वा जमिन मुनिबाट कन्ड्युट बिछ्याई गरिने Wiring लाई कन्सिल्ड वायरिङ्ग भनिन्छ। आजभोली घर निर्माण गर्दा यो सबैभन्दा बढी प्रचलनमा छ। पहिले घरको भित्ता वा वालमा खाँच खनेर बाटो बनाइन्छ, PVC कन्ड्युट पाइप, Bend, Elbow, Junction Box, Iron Box राखिन्छ र प्लास्टर गरेपछि तारहरू छिराइन्छ। यो विधि सुरक्षित र हेर्दा अत्यन्तै सफा देखिन्छ।'
      }
    ],
    homework: [
      'क) Concealed Wiring गर्दा ध्यान दिनुपर्ने कुराहरु के के हुन्?'
    ]
  },
  {
    day: 'सत्रौं र अठारौं दिन',
    dayNumber: 17,
    title: 'एउटा वान वे स्वीचद्वारा नियन्त्रित बत्ती जडान (Practical No. 1)',
    nepaliTitle: 'Lay-Out र Wiring Diagram अनुसार १-वे स्विच र बत्ती जडान',
    duration: '१०:०० घण्टा',
    objective: 'Lay Out Diagram अनुसार Wiring Diagram बनाई एउटा वान वे स्वीचद्वारा नियन्त्रित बत्ती जडान गर्न सक्नेछन्।',
    category: 'circuits',
    tableRows: [
      { sn: '१', activity: 'अघिल्ला दिनको गृहकार्य जाँच तथा पृष्ठपोषण', method: 'प्रश्नोत्तर र छलफल', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '२', activity: 'एउटा वान वे स्वीचद्वारा नियन्त्रित बत्ती जडानको Lay Out Diagram प्रस्तुत गर्ने।', method: 'छलफल, व्याख्यान र प्रदर्शन', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '३', activity: 'Lay Out Diagram अनुसार Wiring Diagram बनाउन लगाउने।', method: 'डायग्राम, व्याख्यान र प्रयोगात्मक', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '४', activity: 'पाइप बिछ्याउने प्रयोगात्मक अभ्यास', method: 'प्रयोगात्मक', materials: 'प्लाई बोर्ड, मेजरीङ टेप, पाइप, एल्बो, स्क्रु', duration: '३:०० घण्टा' },
      { sn: '५', activity: 'तार, १-वे स्विच S1 र बत्ती L1 जडान गर्ने अभ्यास', method: 'प्रयोगात्मक', materials: '३/२२ तार, १-वे स्विच, ब्याटन होल्डर, पीभीसी टेप', duration: '५:०० घण्टा' },
      { sn: '६', activity: 'प्रश्नोत्तर गर्दै अन्त्यमा गृहकार्य', method: 'व्याख्यान र प्रश्नोत्तर', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' }
    ],
    contentSections: [
      {
        heading: 'Lay-Out र Wiring Diagram को संरचना तथा नाप',
        text: 'Lay Out Diagram: फ्युज F1, वान वे स्विच S1, र बत्ती L1। फ्युज देखि स्विच सम्म १५ सेमी, स्विच देखि बत्ती सम्म ४० सेमी पाइपको नाप राखिन्छ।\n\nCondition: F1 = L1\nControl By: S1 = L1',
        diagramType: 'practical-circuit',
        practicalId: 1
      },
      {
        heading: 'सर्किट कार्यविधि तथा सिद्धान्त',
        text: 'फेज तार (Phase P) मेन फ्युज F1 हुँदै स्विच S1 को तल्लो टर्मिनलमा प्रवेश गर्छ। स्विचको माथिल्लो टर्मिनलबाट स्विच फेज तार बत्ती L1 मा पुग्छ। न्युट्रल तार (Neutral N) सिधै बत्ती L1 को अर्को टर्मिनलमा जोडिन्छ। जब S1 अन गरिन्छ परिपथ पूर्ण भई बत्ती बल्छ।'
      }
    ],
    homework: [
      'क) एउटा वान वे स्वीचद्वारा नियन्त्रित बत्तीको Lay-Out र Wiring Diagram कोर्नुहोस्।',
      'ख) स्वीच सधैं फेज तारमा मात्र किन राखिन्छ?'
    ]
  },
  {
    day: 'उन्नाइसौं र बीसौं दिन',
    dayNumber: 19,
    title: 'एउटा वान वे स्वीचद्वारा नियन्त्रित समानान्तर बत्ती जडान (Practical No. 2)',
    nepaliTitle: 'समानान्तर बत्ती जडान - १-वे स्विचबाट दुई बत्ती पूर्ण चम्किलो (Bright) बाल्ने विधि',
    duration: '१०:०० घण्टा',
    objective: 'Lay Out Diagram अनुसार Wiring Diagram बनाई समानान्तर बत्ती परिपथ जडान गर्न सक्नेछन्।',
    category: 'circuits',
    tableRows: [
      { sn: '१', activity: 'अघिल्ला दिनको गृहकार्य जाँच तथा पृष्ठपोषण', method: 'प्रश्नोत्तर र छलफल', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '२', activity: 'समानान्तर बत्ती जडानको Lay Out Diagram प्रस्तुत गर्ने।', method: 'छलफल, व्याख्यान र प्रदर्शन', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '३', activity: 'Lay Out Diagram अनुसार Wiring Diagram बनाउन लगाउने।', method: 'डायग्राम, व्याख्यान र प्रयोगात्मक', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '४', activity: 'पाइप र टी-जक्सन बिछ्याउने प्रयोगात्मक अभ्यास', method: 'प्रयोगात्मक', materials: 'प्लाई बोर्ड, मेजरीङ टेप, पाइप, टी जक्सन, स्क्रु', duration: '३:०० घण्टा' },
      { sn: '५', activity: 'तार, स्विच र दुई बत्ती L1, L2 जडान गरी परीक्षण गर्ने', method: 'प्रयोगात्मक', materials: '३/२२ तार, १-वे स्विच, २ होल्डर, बल्बहरू', duration: '५:०० घण्टा' },
      { sn: '६', activity: 'प्रश्नोत्तर गर्दै गृहकार्य', method: 'व्याख्यान र प्रश्नोत्तर', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' }
    ],
    contentSections: [
      {
        heading: 'Lay-Out र समानान्तर संरचना',
        text: 'Condition: F1 = L1, L2\nControl By: S1 = L1, L2 Bright (पूर्ण चम्किलो)\n\nयस परिपथमा एउटा वान वे स्विच S1 अन गर्दा दुईवटै बत्ती L1 र L2 एकैसाथ समानान्तर (Parallel) रूपमा पूर्ण भोल्टेज (२३०V) पाएर उज्यालो (Bright) बल्दछन्।',
        diagramType: 'practical-circuit',
        practicalId: 2
      },
      {
        heading: 'सर्किट कार्यविधि',
        text: 'स्विच S1 बाट निस्केको स्विच फेज तार समानान्तर रूपमा L1 र L2 दुवैमा बाँडिन्छ। न्युट्रल पनि दुवै बत्तीमा पुग्छ। दुवैले समान २३०V पाउँछन्। एउटा बत्ती बिग्रिए पनि अर्को बलिरहन्छ।'
      }
    ],
    homework: [
      'क) दुई बत्ती समानान्तरमा जोड्दा दुवै बत्ती किन पूर्ण चम्किलो बल्छन्?'
    ]
  },
  {
    day: 'एक्काइसौं र बाईसौं दिन',
    dayNumber: 21,
    title: 'एउटा वान वे स्वीचद्वारा नियन्त्रित श्रेणीक्रम बत्ती जडान (Practical No. 3)',
    nepaliTitle: 'श्रेणीक्रम बत्ती जडान - दुई बत्ती श्रेणीक्रममा जोडी भोल्टेज विभाजन (Dim Lighting)',
    duration: '१०:०० घण्टा',
    objective: 'श्रेणीक्रम बत्ती जडान विधि र यसका गुण तथा भोल्टेज बाँडफाँड बुझ्न सक्नेछन्।',
    category: 'circuits',
    tableRows: [
      { sn: '१', activity: 'अघिल्ला दिनको गृहकार्य जाँच तथा पृष्ठपोषण', method: 'प्रश्नोत्तर र छलफल', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '२', activity: 'श्रेणीक्रम बत्ती जडानको Lay Out प्रस्तुत गर्ने', method: 'छलफल, व्याख्यान र प्रदर्शन', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '३', activity: 'Wiring Diagram बनाउन लगाउने', method: 'डायग्राम, व्याख्यान', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '४', activity: 'पाइप बिछ्याउने अभ्यास', method: 'प्रयोगात्मक', materials: 'पाइप, फिटिङ्स, औजारहरू', duration: '३:०० घण्टा' },
      { sn: '५', activity: 'श्रेणीक्रम तार जडान र परीक्षण', method: 'प्रयोगात्मक', materials: '३/२२ तार, स्विच, २ होल्डर, बल्बहरू', duration: '५:०० घण्टा' },
      { sn: '६', activity: 'प्रश्नोत्तर र गृहकार्य', method: 'व्याख्यान र प्रश्नोत्तर', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' }
    ],
    contentSections: [
      {
        heading: 'Lay-Out र श्रेणीक्रम संरचना',
        text: 'Condition: F1 = L1, L2\nControl By: S1 = L1, L2 Dim (मधुरो)\n\nएउटै स्विचबाट दुईवटा बत्तीहरू श्रेणीक्रम (Series) मा जोडिन्छन् जहाँ भोल्टेज आधा-आधा (११५V प्रत्येक) बाँडिएर बत्तीहरू मधुरो (Dim) बल्छन्।',
        diagramType: 'practical-circuit',
        practicalId: 3
      },
      {
        heading: 'सर्किट कार्यविधि',
        text: 'फेज तार S1 हुँदै L1 को पहिलो पिनमा जान्छ, L1 को दोस्रो पिनबाट तार L2 को पहिलो पिनमा जान्छ, र L2 को दोस्रो पिनबाट बल्ल न्युट्रल N मा जोडिन्छ। एउटा बत्ती खोलेमा दुवै बत्ती निभ्छन्।'
      }
    ],
    homework: [
      'क) श्रेणीक्रम (Series) र समानान्तर (Parallel) परिपथमा के के भिन्नता छन्?'
    ]
  },
  {
    day: 'तेईसौं र चौबीसौं दिन',
    dayNumber: 23,
    title: 'एउटा बेल पुश स्वीचद्वारा बेल र वान वे स्वीचद्वारा नियन्त्रित एउटा बत्ती जडान (Practical No. 4)',
    nepaliTitle: 'Calling Bell र Room Light एकीकृत जडान परिपथ',
    duration: '१०:०० घण्टा',
    objective: 'Lay Out Diagram अनुसार Bell Push Switch द्वारा घण्टी र १-वे स्विचद्वारा बत्ती जडान गर्न सक्नेछन्।',
    category: 'circuits',
    tableRows: [
      { sn: '१', activity: 'अघिल्ला दिनको गृहकार्य जाँच', method: 'प्रश्नोत्तर र छलफल', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '२', activity: 'Lay Out Diagram प्रस्तुत गर्ने', method: 'छलफल, व्याख्यान र प्रदर्शन', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '३', activity: 'Wiring Diagram बनाउन लगाउने', method: 'डायग्राम, व्याख्यान', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '४', activity: 'पाइप बिछ्याउने अभ्यास', method: 'प्रयोगात्मक', materials: 'पाइप, बक्स, क्ल्याम्प', duration: '३:०० घण्टा' },
      { sn: '५', activity: 'बेल पुश स्विच, घण्टी B1, स्विच S2 र बत्ती L1 जडान', method: 'प्रयोगात्मक', materials: '३/२२ तार, बेल पुश स्विच, १-वे स्विच, घण्टी, होल्डर', duration: '५:०० घण्टा' },
      { sn: '६', activity: 'प्रश्नोत्तर र गृहकार्य', method: 'व्याख्यान र प्रश्नोत्तर', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' }
    ],
    contentSections: [
      {
        heading: 'Lay-Out तथा कम्पाउण्ड जडान',
        text: 'Condition: F1 = B1, L1\nControl By: S1 = B1 (Calling Bell), S2 = L1 (Room Lamp)\n\nफ्युज F1 बाट फेज तार आएर स्विच बोर्डमा पुग्छ र लुपिङ मार्फत S1 र S2 दुवैको इनपुटमा जोडिन्छ।',
        diagramType: 'practical-circuit',
        practicalId: 4
      },
      {
        heading: 'सर्किट कार्यविधि',
        text: 'बेल पुश स्विच थिच्दा मात्र घण्टी B1 मा फेज पुगी घण्टी बज्छ र छोड्दा स्प्रिङले सर्किट विच्छेद गर्छ। १-वे स्विच S2 अन गर्दा बत्ती L1 निरन्तर बलिरहन्छ।'
      }
    ],
    homework: [
      'क) बेल पुश स्विच र साधारण १-वे स्विचमा के भिन्नता छ?'
    ]
  },
  {
    day: 'पच्चिसौं र छब्बीसौं दिन',
    dayNumber: 25,
    title: 'तीन वान वे स्वीचद्वारा नियन्त्रित तीन बत्ती जडान (Practical No. 5)',
    nepaliTitle: '३-ग्याङ स्विच बोर्ड वायरिङ - ३ स्विचद्वारा ३ अलग बत्ती स्वतन्त्र नियन्त्रण',
    duration: '१०:०० घण्टा',
    objective: '३-ग्याङ स्विच बोर्डमा कमन फेज लुपिङ गरी ३ वटा बत्ती स्वतन्त्र रूपमा चलाउन सक्नेछन्।',
    category: 'circuits',
    tableRows: [
      { sn: '१', activity: 'अघिल्ला दिनको गृहकार्य जाँच', method: 'प्रश्नोत्तर र छलफल', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '२', activity: 'Lay Out Diagram प्रस्तुत गर्ने', method: 'छलफल, व्याख्यान र प्रदर्शन', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '३', activity: 'Wiring Diagram बनाउन लगाउने', method: 'डायग्राम, व्याख्यान', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '४', activity: 'पाइप बिछ्याउने अभ्यास', method: 'प्रयोगात्मक', materials: 'पाइप, ग्याङ बक्स, स्क्रु', duration: '३:०० घण्टा' },
      { sn: '५', activity: '३-ग्याङ बोर्ड, स्विचहरू S1, S2, S3 र ३ बत्ती जडान', method: 'प्रयोगात्मक', materials: '३/२२ तार, ३ वटा स्विच, ३ वटा होल्डर', duration: '५:०० घण्टा' },
      { sn: '६', activity: 'प्रश्नोत्तर र गृहकार्य', method: 'व्याख्यान र प्रश्नोत्तर', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' }
    ],
    contentSections: [
      {
        heading: 'Lay-Out तथा ३-ग्याङ संरचना',
        text: 'Condition: F1 = Lighting (L1, L2, L3)\nControl By: S1 = L1, S2 = L2, S3 = L3\n\nF1 मेन फ्युजबाट आएको फेज S1, S2, S3 तीनवटै स्विचको तल्लो टर्मिनलमा लुपिङ तारद्वारा जोडिन्छ।',
        diagramType: 'practical-circuit',
        practicalId: 5
      },
      {
        heading: 'सर्किट कार्यविधि',
        text: 'S1 ले L1, S2 ले L2 र S3 ले L3 लाई छुट्टाछुट्टै नियन्त्रण गर्छ। न्युट्रल लाइन सबै बत्तीहरूमा साझा (Common Neutral) रहन्छ।'
      }
    ],
    homework: [
      'क) ३-ग्याङ स्विच बोर्डमा फेज लुपिङ कसरी गरिन्छ?'
    ]
  },
  {
    day: 'सत्ताइसौं र अठ्ठाइसौं दिन',
    dayNumber: 27,
    title: 'दुई वान वे स्वीचद्वारा नियन्त्रित दुई बत्ती र टुपिन सकेट जडान (Practical No. 6)',
    nepaliTitle: '२ बत्ती र २-पिन सकेट (चार्जर आउटलेट) एकीकृत बोर्ड जडान',
    duration: '१०:०० घण्टा',
    objective: '२ वटा १-वे स्विच मार्फत २ बत्ती र १ वटा २-पिन सकेट नियन्त्रण गर्न सक्नेछन्।',
    category: 'circuits',
    tableRows: [
      { sn: '१', activity: 'अघिल्ला दिनको गृहकार्य जाँच', method: 'प्रश्नोत्तर र छलफल', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '२', activity: 'Lay Out Diagram प्रस्तुत गर्ने', method: 'छलफल, व्याख्यान र प्रदर्शन', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '३', activity: 'Wiring Diagram बनाउन लगाउने', method: 'डायग्राम, व्याख्यान', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '४', activity: 'पाइप बिछ्याउने अभ्यास', method: 'प्रयोगात्मक', materials: 'पाइप, बक्स, क्ल्याम्प', duration: '३:०० घण्टा' },
      { sn: '५', activity: 'स्विच S1, S2, सकेट X1 र बत्ती L1, L2 जडान', method: 'प्रयोगात्मक', materials: '३/२२ तार, २ स्विच, १ सकेट, २ होल्डर', duration: '५:०० घण्टा' },
      { sn: '६', activity: 'प्रश्नोत्तर र गृहकार्य', method: 'व्याख्यान र प्रश्नोत्तर', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' }
    ],
    contentSections: [
      {
        heading: 'Lay-Out तथा सकेट संयोजन',
        text: 'Condition: F1 = Lighting (L1, L2), X1\nControl By: S1 = L1, L2; S2 = X1 (2-Pin Socket)\n\nपहिलो स्विच S1 ले दुईवटा बत्ती L1 र L2 लाई समानान्तरमा नियन्त्रण गर्छ र दोस्रो स्विच S2 ले चार्जर जोड्ने टुपिन सकेट X1 नियन्त्रण गर्छ।',
        diagramType: 'practical-circuit',
        practicalId: 6
      },
      {
        heading: 'सर्किट कार्यविधि',
        text: 'स्विच S2 अन गर्दा मात्र टुपिन सकेट X1 मा फेज पुग्छ र सकेटको अर्को पिनमा सिधै न्युट्रल जोडिएको हुन्छ।'
      }
    ],
    homework: [
      'क) स्विच सहितको २-पिन सकेटको वायरिङ डायग्राम कोर्नुहोस्।'
    ]
  },
  {
    day: 'उनन्तीसौँ र तीसौँ दिन',
    dayNumber: 29,
    title: 'दुई टु वे स्वीचद्वारा नियन्त्रित एक बत्ती जडान (सिँढी वाइरिङ / Staircase Wiring) (Practical No. 7)',
    nepaliTitle: 'Staircase / Corridor Wiring - २ ठाउँबाट १ बत्ती अन/अफ नियन्त्रण',
    duration: '१०:०० घण्टा',
    objective: '२ वटा टु वे स्विच प्रयोग गरी भर्‍याङको बत्ती तल वा माथिबाट चलाउने सिँढी वाइरिङ गर्न सक्नेछन्।',
    category: 'circuits',
    tableRows: [
      { sn: '१', activity: 'अघिल्ला दिनको गृहकार्य जाँच', method: 'प्रश्नोत्तर र छलफल', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '२', activity: 'Lay Out Diagram प्रस्तुत गर्ने', method: 'छलफल, व्याख्यान र प्रदर्शन', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '३', activity: 'Wiring Diagram बनाउन लगाउने', method: 'डायग्राम, व्याख्यान', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '४', activity: 'पाइप बिछ्याउने अभ्यास', method: 'प्रयोगात्मक', materials: 'पाइप, बक्स, क्ल्याम्प', duration: '३:०० घण्टा' },
      { sn: '५', activity: '२ वटा टु-वे स्विच S1, S2 र बत्ती L1 जडान', method: 'प्रयोगात्मक', materials: '३/२२ तार, २ वटा टु-वे स्विच, १ होल्डर', duration: '५:०० घण्टा' },
      { sn: '६', activity: 'प्रश्नोत्तर र गृहकार्य', method: 'व्याख्यान र प्रश्नोत्तर', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' }
    ],
    contentSections: [
      {
        heading: 'Lay-Out तथा सिँढी वाइरिङ संरचना',
        text: 'Condition: F1 = Lighting (L1)\nControl By: S1, S2 = L1 (तलबाट बाल्ने, माथिबाट निभाउने वा उल्टो)\n\nफ्युजबाट आएको फेज S1 को बीचको पोल (Common Terminal) मा जोडिन्छ। S1 र S2 का माथिल्ला र तल्ला टर्मिनलहरू दुईवटा स्ट्र्यापर तार (Strappers) मार्फत आपसमा जोडिन्छन्। S2 को बीचको पोलबाट तार बत्ती L1 मा जान्छ।',
        diagramType: 'practical-circuit',
        practicalId: 7
      },
      {
        heading: 'सर्किट कार्यविधि',
        text: 'अवस्था:\n• S1 Down + S2 Down = बत्ती बल्छ (ON)\n• S1 Up + S2 Up = बत्ती बल्छ (ON)\n• S1 Up + S2 Down = बत्ती निभ्छ (OFF)\n• S1 Down + S2 Up = बत्ती निभ्छ (OFF)'
      }
    ],
    homework: [
      'क) सिँढी वाइरिङमा टु-वे स्विचका टर्मिनलहरू कसरी जोडिन्छन्?'
    ]
  },
  {
    day: 'एकतीसौं र बत्तीसौं दिन',
    dayNumber: 31,
    title: 'दुई टु वे स्वीचद्वारा नियन्त्रित एक बत्ती, साथै ईन्डिकेटर र टुपिन सकेट जडान (Practical No. 8)',
    nepaliTitle: 'Staircase Wiring + Always ON Indicator + 2-Pin Socket',
    duration: '१०:०० घण्टा',
    objective: 'सिँढी वाइरिङमा लाइन उपस्थिति देखाउने ईन्डिकेटर र २-पिन सकेट संयोजन गर्न सक्नेछन्।',
    category: 'circuits',
    tableRows: [
      { sn: '१', activity: 'अघिल्ला दिनको गृहकार्य जाँच', method: 'प्रश्नोत्तर र छलफल', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '२', activity: 'Lay Out Diagram प्रस्तुत गर्ने', method: 'छलफल, व्याख्यान र प्रदर्शन', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '३', activity: 'Wiring Diagram बनाउन लगाउने', method: 'डायग्राम, व्याख्यान', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '४', activity: 'पाइप बिछ्याउने अभ्यास', method: 'प्रयोगात्मक', materials: 'पाइप, बक्स, क्ल्याम्प', duration: '३:०० घण्टा' },
      { sn: '५', activity: 'टु-वे स्विच २ वटा, ईन्डिकेटर I1, सकेट X1 र बत्ती जडान', method: 'प्रयोगात्मक', materials: '३/२२ तार, २ टु-वे स्विच, १ ईन्डिकेटर, १ सकेट, १ होल्डर', duration: '५:०० घण्टा' },
      { sn: '६', activity: 'प्रश्नोत्तर र गृहकार्य', method: 'व्याख्यान र प्रश्नोत्तर', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' }
    ],
    contentSections: [
      {
        heading: 'Lay-Out तथा ईन्डिकेटर संयोजन',
        text: 'Condition: F1 = Lighting (L1, I1, X1)\nControl By: S1, S2 = L1; I1 = Always ON Indicator; X1 = 2-Pin Socket\n\nईन्डिकेटर I1 मा स्थायी रूपमा फेज र न्युट्रल जोडिन्छ जसले लाइन चालु रहेको जनाउँछ। S1 र S2 ले बत्ती L1 लाई सिँढी प्रणालीमा चलाउँछन् भने X1 सकेटले पावर प्रदान गर्दछ।',
        diagramType: 'practical-circuit',
        practicalId: 8
      },
      {
        heading: 'सर्किट कार्यविधि',
        text: 'मेन लाइन आउनासाथ ईन्डिकेटर I1 बल्छ जसले राती स्विच बोर्ड सजिलै देख्न मद्दत गर्छ। S1 र S2 बाट बत्ती L1 स्वतन्त्र रूपमा नियन्त्रण हुन्छ।'
      }
    ],
    homework: [
      'क) ईन्डिकेटरलाई किन सधैं फेज र न्युट्रल सिधै दिइन्छ?'
    ]
  },
  {
    day: 'तेत्तीसौं र चौँतीसौँ दिन',
    dayNumber: 33,
    title: 'दुई टु वे स्वीचद्वारा नियन्त्रित एक बत्ती, ईन्डिकेटर, टुपिन सकेट र पावर सकेट जडान (Practical No. 9)',
    nepaliTitle: 'Light & Heavy Power Circuit Dual Fuse Wiring',
    duration: '१०:०० घण्टा',
    objective: 'लाइटिङ सर्किट र १६A पावर सर्किटलाई छुट्टाछुट्टै फ्युजबाट सुरक्षित जडान गर्न सक्नेछन्।',
    category: 'circuits',
    tableRows: [
      { sn: '१', activity: 'अघिल्ला दिनको गृहकार्य जाँच', method: 'प्रश्नोत्तर र छलफल', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '२', activity: 'Lay Out Diagram प्रस्तुत गर्ने', method: 'छलफल, व्याख्यान र प्रदर्शन', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '३', activity: 'Wiring Diagram बनाउन लगाउने', method: 'डायग्राम, व्याख्यान', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '४', activity: 'पाइप बिछ्याउने अभ्यास', method: 'प्रयोगात्मक', materials: 'पाइप, ग्याङ बक्स, क्ल्याम्प', duration: '३:०० घण्टा' },
      { sn: '५', activity: 'फ्युज F1 (Light), फ्युज F2 (Power 16A), स्विच, सकेट, अर्थिङ जडान', method: 'प्रयोगात्मक', materials: '७/२२ तार, ३/२२ तार, अर्थिङ तार, १६A पावर सकेट, टु-वे स्विच, ईन्डिकेटर', duration: '५:०० घण्टा' },
      { sn: '६', activity: 'प्रश्नोत्तर र गृहकार्य', method: 'व्याख्यान र प्रश्नोत्तर', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' }
    ],
    contentSections: [
      {
        heading: 'Lay-Out तथा दुई फ्युज प्रणाली',
        text: 'Condition: F1 = Lighting (L1, I1, X1); F2 = P1 (Power Socket 16A)\nControl By: S1, S2 = L1; I1 (Indicator); X1 (Socket); P1 (16A Power Socket)\n\nलाइटिङ सर्किट (F1) र १६ एम्पियर पावर सर्किट (F2) लाई छुट्टाछुट्टै फ्युज/MCB सुरक्षा सहित ईन्डिकेटर, टुपिन सकेट र पावर सकेट एकीकृत जडान।',
        diagramType: 'practical-circuit',
        practicalId: 9
      },
      {
        heading: 'सर्किट कार्यविधि',
        text: 'पावर सकेट P1 को लागि फ्युज F2 बाट छुट्टै मोटो तार (७/२२) ल्याइन्छ र त्यसमा अनिवार्य रूपमा सुरक्षात्मक अर्थिङ तार (Green Wire) माथिल्लो ठूलो पिनमा जोडिन्छ।'
      }
    ],
    homework: [
      'क) पावर सकेट जडान गर्दा छुट्टै फ्युज र अर्थिङ किन आवश्यक हुन्छ?'
    ]
  },
  {
    day: 'पैँतीसौं र छत्तीसौँ दिन',
    dayNumber: 35,
    title: 'दुई टु वे स्वीच र एक ईन्टरमिडिएट स्वीचद्वारा नियन्त्रित एक बत्ती (Practical No. 10)',
    nepaliTitle: '३ स्थानबाट १ बत्ती नियन्त्रण - Intermediate Switch Wiring',
    duration: '१०:०० घण्टा',
    objective: '२ वटा टु-वे स्विच र १ वटा ईन्टरमिडिएट स्विच प्रयोग गरी ३ अलग स्थानबाट बत्ती नियन्त्रण गर्न सक्नेछन्।',
    category: 'circuits',
    tableRows: [
      { sn: '१', activity: 'अघिल्ला दिनको गृहकार्य जाँच', method: 'प्रश्नोत्तर र छलफल', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '२', activity: 'Lay Out Diagram प्रस्तुत गर्ने', method: 'छलफल, व्याख्यान र प्रदर्शन', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '३', activity: 'Wiring Diagram बनाउन लगाउने', method: 'डायग्राम, व्याख्यान', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '४', activity: 'पाइप बिछ्याउने अभ्यास', method: 'प्रयोगात्मक', materials: 'पाइप, बक्स, क्ल्याम्प', duration: '३:०० घण्टा' },
      { sn: '५', activity: 'S1 (2-Way), S2 (Intermediate), S3 (2-Way) र बत्ती जडान', method: 'प्रयोगात्मक', materials: '३/२२ तार, २ टु-वे स्विच, १ ईन्टरमिडिएट स्विच, १ होल्डर', duration: '५:०० घण्टा' },
      { sn: '६', activity: 'प्रश्नोत्तर र गृहकार्य', method: 'व्याख्यान र प्रश्नोत्तर', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' }
    ],
    contentSections: [
      {
        heading: 'Lay-Out तथा ईन्टरमिडिएट संरचना',
        text: 'Condition: F1 = Lighting (L1)\nControl By: S1, S2 (Intermediate), S3 = L1 (तीन अलग ठाउँबाट अन/अफ)\n\nठूला भवन, अस्पतालको लामो करिडोर वा ३ तलाको भर्‍याङमा तीन फरक स्थानबाट एउटै बत्तीलाई स्वतन्त्र रूपमा अन/अफ गर्न २ वटा टु-वे स्विच र बीचमा १ वटा ईन्टरमिडिएट स्विच जडान गरिन्छ।',
        diagramType: 'practical-circuit',
        practicalId: 10
      },
      {
        heading: 'सर्किट कार्यविधि',
        text: 'S1 को दुई आउटपुट S2 (ईन्टरमिडिएट) को दुई इनपुटमा जोडिन्छन्। S2 का दुई आउटपुट S3 (टु-वे) का दुई इनपुटमा जान्छन्। S3 को कमन पोलबाट बत्ती L1 मा लाइन पुग्छ।'
      }
    ],
    homework: [
      'क) ईन्टरमिडिएट स्विचमा कतिवटा टर्मिनल हुन्छन् र यसले कसरी काम गर्छ?'
    ]
  },
  {
    day: 'सैंतीसौं दिन',
    dayNumber: 37,
    title: 'दुई टु वे स्वीच र दुई ईन्टरमिडिएट स्वीचद्वारा नियन्त्रित एक बत्ती (Practical No. 11)',
    nepaliTitle: '४ स्थानबाट १ बत्ती नियन्त्रण - 2 Intermediate + 2 Two-Way Switches',
    duration: '५:०० घण्टा',
    objective: '४ अलग स्थानबाट एउटै बत्तीलाई नियन्त्रण गर्ने उन्नत परिपथ जडान गर्न सक्नेछन्।',
    category: 'circuits',
    tableRows: [
      { sn: '१', activity: 'अघिल्ला दिनको गृहकार्य जाँच', method: 'प्रश्नोत्तर र छलफल', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '२', activity: 'Lay Out Diagram प्रस्तुत गर्ने', method: 'छलफल, व्याख्यान र प्रदर्शन', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '३', activity: 'Wiring Diagram बनाउन लगाउने', method: 'डायग्राम, व्याख्यान', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '४', activity: 'पाइप बिछ्याउने अभ्यास', method: 'प्रयोगात्मक', materials: 'पाइप, बक्स, क्ल्याम्प', duration: '१:०० घण्टा' },
      { sn: '५', activity: 'S1, S2, S3, S4 चारवटा स्विच र बत्ती जडान', method: 'प्रयोगात्मक', materials: '३/२२ तार, २ टु-वे स्विच, २ ईन्टरमिडिएट स्विच, १ होल्डर', duration: '२:०० घण्टा' },
      { sn: '६', activity: 'प्रश्नोत्तर र गृहकार्य', method: 'व्याख्यान र प्रश्नोत्तर', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' }
    ],
    contentSections: [
      {
        heading: 'Lay-Out तथा ४ स्थान नियन्त्रण',
        text: 'Condition: F1 = Lighting (L1)\nControl By: S1, S2, S3, S4 = L1 (चार अलग ठाउँबाट अन/अफ)\n\nचार फरक स्थानबाट एउटै बत्तीलाई नियन्त्रण गर्न छेउछाउमा दुई टु-वे स्विच (S1, S4) र बीचमा दुई ईन्टरमिडिएट स्विच (S2, S3) जडान गरिन्छ।',
        diagramType: 'practical-circuit',
        practicalId: 11
      },
      {
        heading: 'सर्किट कार्यविधि',
        text: 'S1 बाट निस्केका २ स्ट्र्यापर तार S2 मा, S2 बाट S3 मा, र S3 बाट S4 मा क्रमिक रूपमा जोडिन्छन्। S4 को कमन टर्मिनलबाट बत्ती L1 मा स्विच फेज पुग्छ।'
      }
    ],
    homework: [
      'क) चार स्थानबाट बत्ती नियन्त्रण गर्ने परिपथको वायरिङ डायग्राम कोर्नुहोस्।'
    ]
  },
  {
    day: 'अड्तीसौं दिन',
    dayNumber: 38,
    title: 'पावर सकेट जडान (Power Socket Wiring)',
    nepaliTitle: '१६ एम्पियर पावर सकेट जडान (N-E-P) र तार साइज छनौट',
    duration: '५:०० घण्टा',
    objective: 'Lay Out Diagram अनुसार Wiring Diagram बनाई पावर सकेट जडान गर्न सक्नेछन्।',
    category: 'circuits',
    tableRows: [
      { sn: '१', activity: 'अघिल्ला दिनको गृहकार्य जाँच तथा पृष्ठपोषण', method: 'प्रश्नोत्तर र छलफल', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '२', activity: 'पावर सकेट जडानको Lay Out Diagram प्रस्तुत गर्ने', method: 'छलफल, व्याख्यान र प्रदर्शन', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '३', activity: 'Lay Out Diagram अनुसार Wiring Diagram बनाउन लगाउने।', method: 'डायग्राम, व्याख्यान र प्रयोगात्मक', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' },
      { sn: '४', activity: 'पाइप बिछ्याउने प्रयोगात्मक अभ्यास', method: 'प्रयोगात्मक', materials: 'प्लाई बोर्ड, मेजरीङ टेप, पाइप, एल्बो, स्क्रु', duration: '१:३० घण्टा' },
      { sn: '५', activity: '७/२२ तार, पावर सकेट र अर्थिङ तार जडान गर्ने', method: 'प्रयोगात्मक', materials: '७/२२ तार, पावर सकेट, अर्थिङ तार, पीभीसी टेप', duration: '१:३० घण्टा' },
      { sn: '६', activity: 'प्रश्नोत्तर गर्दै गृहकार्य', method: 'व्याख्यान र प्रश्नोत्तर', materials: 'सेतो बोर्ड, मार्कर, डस्टर', duration: '३० मिनेट' }
    ],
    contentSections: [
      {
        heading: 'पावर सकेटको अवधारणा र नियम',
        text: 'यो एउटा विद्युतिय क्षेत्रमा प्रयोग हुने पावरका उपकरणहरु जस्तै ५ एम्पिएर भन्दा माथि अधिकतम १६ एम्पिएर सम्म करेन्ट खपत गर्न सक्दछ, त्यस्तो उपकरणहरु संचालन गर्नको लागि सहज रुपमा आवश्यक केवल जडान गर्न र छुटाउन सजिलो होस् भनि राखिने विद्युतिय सामाग्रीलाई पावर सकेट भनिन्छ।\n\nपावर सकेट जडान गर्दा यसबाट संचालन हुने उपकरणले खपत गर्ने करेन्टमा ध्यान दिनुपर्ने हुन्छ। र तारको छनौट गर्दा पावर सकेटको भन्दा करेन्ट भारवहन क्षमता तारको बढिनै हुनुपर्दछ। त्यसैले पावर सकेट जडान गर्दा तामाको तार भएमा ३/२०, ७/२२, ७/२० र एल्मुनियम भएमा ७/२२, ७/२०, ७/१८ सम्मको छनौट गर्नुपर्ने हुन्छ। किनभने उपकरणले खपत गर्ने करेन्टको क्षमता भन्दा तारको क्षमतामा आवश्यकता अनुसार २० देखि ५० प्रतिशतले वढि भयो भने सर्किटमा आईपर्ने समस्याको भागिदार हुनुपर्दैन।',
        diagramType: 'power-socket'
      }
    ],
    homework: [
      'क) पावर सकेट जडान गर्दा ध्यान दिनुपर्ने कुराहरु लेख्नुहोस्।'
    ]
  }
];
