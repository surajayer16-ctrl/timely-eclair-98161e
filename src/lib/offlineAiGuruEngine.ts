// Client-side Offline Knowledge Engine for AI Technical Guru (सुरेन्द्र ऐर AI प्राविधिक गुरु)
// Enables full offline capabilities without internet connection based on CTEVT Level 1 & Level 2 Telecom Curriculum

export interface OfflineKnowledgeItem {
  id: string;
  keywords: string[];
  title: string;
  reply: string;
}

export const offlineKnowledgeBase: OfflineKnowledgeItem[] = [
  {
    id: 'color-code-12',
    keywords: ['color', 'colour', 'रङ', 'रंग', 'कोड', '12 core', '१२ कोर', 'कलर कोड', 'फाइबरको रङ', 'fiber color', 'ntc fiber', 'international fiber', 'standard', 'eia 598', 'tia 598'],
    title: 'Nepal Telecom Standard vs International Standard Fiber Color Code',
    reply: `**१२-कोर अप्टिकल फाइबर कलर कोड तुलना (Nepal Telecom vs International Standard):**

१. **फाइबर १**: NTC = **निलो (Blue)** | International = **नीलो (Blue)**
२. **फाइबर २**: NTC = **सेतो (White)** | International = **सुन्तला (Orange)**
३. **फाइबर ३**: NTC = **पहेंलो (Yellow)** | International = **हरियो (Green)**
४. **फाइबर ४**: NTC = **हरियो (Green)** | International = **खैरो (Brown)**
५. **फाइबर ५**: NTC = **खरानी (Slate/Grey)** | International = **खरानी (Slate/Gray)**
६. **फाइबर ६**: NTC = **रातो (Red)** | International = **सेतो (White)**
७. **फाइबर ७**: NTC = **सुन्तला (Orange)** | International = **रातो (Red)**
८. **फाइबर ८**: NTC = **कालो (Black)** | International = **कालो (Black)**
९. **फाइबर ९**: NTC = **गुलाबी (Pink)** | International = **पहेंलो (Yellow)**
१०. **फाइबर १०**: NTC = **बैजनी (Violet/Purple)** | International = **बैजनी (Violet/Purple)**
११. **फाइबर ११**: NTC = **खैरो (Brown)** | International = **गुलाबी (Rose/Pink)**
१२. **फाइबर १२**: NTC = **आकाशी निलो (Aqua/Turquoise)** | International = **आकाशी नीलो (Aqua/Cyan)**

*महत्वपूर्ण फरक: नेपाल टेलिकम मापदण्डमा २ नं. सेतो र ३ नं. पहेंलो हुन्छ भने अन्तर्राष्ट्रिय मापदण्ड (TIA/EIA-598) मा २ नं. सुन्तला (Orange) र ३ नं. हरियो (Green) हुन्छ।*`
  },
  {
    id: 'splicing-cleaving',
    keywords: ['splice', 'splicing', 'cleave', 'cleaving', 'स्प्लाइस', 'क्लिभ', 'आर्क', 'arc', 'joint', 'फ्युजन', 'fusion', 'सफा', 'alcohol'],
    title: 'Fusion Splicing & Precision Cleaving Guidelines',
    reply: `**फ्युजन स्प्लाइसिङ (Fusion Splicing) का ५ अनिवार्य चरणहरू (CTEVT Level 2):**

१. **Stripping**: फाइबरको २५०µm प्राथमिक बफर कोटिंग हटाई १२५µm क्ल्याडिङ नाङ्गो बनाउने।
२. **Cleaning**: ९९% शुद्ध Isopropyl Alcohol (IPA) र लिन्ट-फ्री टिस्युले २-३ पटक एकै दिशामा सफा गर्ने।
३. **Precision Cleaving**: High precision Fiber Cleaver प्रयोग गरी **ठीक ९०° (90 Degree)** कोणमा काट्ने (Cleave Angle < 1°)।
४. **Fusion Arc**: ८०००°C को इलेक्ट्रिक आर्कद्वारा फाइबर कोरहरू पगालेर जोड्ने (लक्ष्य: Splice Loss < 0.02 dB)।
५. **Heat Shrink Protection**: ६० मिमी (60mm) Sleeve भित्र हालेर हिट ओभनमा ९० सेकेन्ड तताउने र Joint Closure (OJC) मा कम्तीमा १ मिटर फाइबर स्ल्याक कोइल गरी राख्ने।`
  },
  {
    id: 'otdr-testing',
    keywords: ['otdr', 'dead zone', 'rayleigh', 'fresnel', 'ओटीडीआर', 'loss', 'attenuation', 'vfl', 'laser', 'power meter', 'opm', 'dBm'],
    title: 'OTDR & Optical Testing Instruments',
    reply: `**अप्टिकल परीक्षण उपकरण तथा OTDR सिद्धान्त:**

१. **OTDR (Optical Time Domain Reflectometer)**:
   - **सिद्धान्त**: Rayleigh Scattering (फाइबर भित्रको प्रकाश छरिने) र Fresnel Reflection (जडान/ब्रेकमा टल्कने)।
   - **Event Dead Zone**: एउटा रिफ्लेक्टिभ इभेन्ट पछि अर्को नजिकैको इभेन्ट देख्न नसकिने दूरी।
   - **Attenuation**: 1310nm मा करिब 0.35 dB/km र 1550nm मा करिब 0.22 dB/km लस हुन्छ।

२. **VFL (Visual Fault Locator)**:
   - ६५०nm रातो लेजर (Class 2/3) प्रयोग गरी २-५ किमी सम्म स्थानीय म्याक्रोबेन्ड र फाइबर क्र्याक नाङ्गो आँखाले हेर्ने।

३. **Optical Power Meter (OPM)**:
   - FTTH/GPON मा रिसिभ पावर नाप्न प्रयोग हुन्छ। सामान्य रिडिङ: **-8 dBm देखि -27 dBm** सम्म हुनुपर्छ।`
  },
  {
    id: 'ftth-gpon',
    keywords: ['ftth', 'gpon', 'olt', 'onu', 'ont', 'splitter', 'स्प्लिटर', 'fdc', 'fap', 'drop cable', 'एफटीटीएच', 'जीपोन'],
    title: 'FTTH (Fiber to the Home) & GPON Network',
    reply: `**FTTH / GPON अप्टिकल नेटवर्क संरचना (Surendra Air Chapter 6):**

- **OLT (Optical Line Terminal)**: एक्सचेन्ज वा पीओपी (PoP) मा राखिने मुख्य सर्भर उपकरण।
  - Downstream Wavelength: **1490 nm** (Data/Voice) & 1550 nm (CATV)
  - Upstream Wavelength: **1310 nm**
- **Optical Splitter (स्प्लिटर)**:
  - 1:2 (-3.5 dB), 1:4 (-7.2 dB), 1:8 (-10.5 dB), 1:16 (-14 dB), 1:32 (-17.5 dB) लस।
- **FDC (Fiber Distribution Cabinet)**: बाहिरी प्राइमरी फाइबर बाँड्ने बाकस।
- **FAP (Fiber Access Point / FAT)**: पोलमा झुण्ड्याइने १२/१६ पोर्टको ग्राहक बक्स।
- **Drop Cable**: ग्राहकको घरसम्म पुग्ने २-कोर बाउन्ड वा राउन्ड फाइबर केबल।
- **ONU / ONT**: ग्राहकको घरमा राखिने FTTH वाइफाई राउटर।`
  },
  {
    id: 'safety-pole-clearance',
    keywords: ['safety', 'clearance', 'दूरी', 'सुरक्षा', 'ppe', 'ladder', 'भर्‍याङ', '33kv', '11kv', '230v', 'pole', 'भोल्टेज', 'म्यानहोल'],
    title: 'Safety Standards & Electrical Pole Clearances',
    reply: `**सुरक्षा मापदण्ड र टेलिकम केबल सुरक्षित दूरी (Surendra Air Chapter 15 & 34):**

- **33kV / 66kV Transmission Line**: कम्तीमा **२ मिटर (2m)** ठाडो दूरी हुनुपर्छ।
- **11kV Distribution Line**: कम्तीमा **१.२m देखि १.५m** ठाडो दूरी।
- **230V / 400V Low Voltage Line**: कम्तीमा **३० सेमी (30cm)** दूरी।
- **क्रसिङ कोण (Crossing Angle)**: विद्युत लाइनसँग ठीक **९०° (90 Degree)** मा मात्र केबल क्रस गर्ने।
- **भर्‍याङ (Ladder Safety)**: भुइँसँग ठीक **७५° कोण** (4:1 Rule) मा अड्याउने।
- **व्यक्तिगत सुरक्षा उपकरण (PPE)**: Safety Helmet, Full Body Harness Belt with Double Lanyard, Insulated Gloves, Safety Shoes.
- **म्यानहोल (Manhole Entry)**: भित्र पस्नुअघि कम्तीमा **३० मिनेट भेन्टिलेसन** दिने र ग्यास डिटेक्टरले अक्सिजन नाप्ने।`
  },
  {
    id: 'earthing-resistance',
    keywords: ['earth', 'earthing', 'resistance', 'ओम', 'ohm', 'अर्थिङ', 'ग्रान्डिङ', 'grounding', 'bts', 'ग्याल्भनाइज्ड', 'माटो', 'नुन'],
    title: 'Telecom Earthing System & Resistance Standards',
    reply: `**टेलिकम अर्थिङ प्रणाली र ओम (Ohm) मापदण्ड (Chapter 11):**

- **अर्थ रेसिस्टेन्स सीमा (Max Earth Resistance)**:
  - **मुख्य एक्सचेन्ज / OLT Core**: **< १ ओम (Less than 1 Ω)**
  - **BTS / FDC Cabinet / Tower**: **< ५ ओम (Less than 5 Ω)**
  - **Secondary DP / Distribution**: **< १० ओम (Less than 10 Ω)**

- **अर्थिङ सुधार गर्ने उपायहरू**:
  १. काठको कोइला (Charcoal) र नुन (Salt) वा बेन्टोनाइट माटो (Bentonite Clay) मिसाउने।
  २. तामा (Copper Rod) वा जीआई पाइप (GI Pipe) गहिरो (कम्तीमा ८-१० फिट) गाड्ने।
  ३. धेरै वटा अर्थ रडलाई समानान्तर (Parallel) मा जोड्ने।
  ४. सुख्खा मौसममा पानी हाल्ने।`
  },
  {
    id: 'battery-dc-power',
    keywords: ['battery', 'dc', '-48v', '48v', 'acid', 'hydrometer', 'हाइड्रोमिटर', 'cell', 'बैट्री', 'पावर', 'float', 'equalize'],
    title: '-48V DC Telecom Power System & Batteries',
    reply: `**टेलिकम म्यानुअल -४८V DC पावर सिस्टम र ब्याट्री (Chapter 12):**

- **टेलिकम मानक भोल्टेज**: **-४८ भोल्ट DC (-48V DC)**। (पोजिटिभ पोल अर्थिङ गरिएको हुन्छ ताकि तामा र केबलमा इलेक्ट्रोलाइसिस कोरोज्न नहोस्)।
- **ब्याट्री बैंक**: २ भोल्ट (2V) का २४ वटा Lead-Acid वा Lithium-Ion सेलहरू सिरिज (Series) मा जोडेर ४८V बनाइन्छ।
- **Floating Voltage**: प्रति सेल २.२५V = **५४ भोल्ट (54V DC)**।
- **Equalizing / Boost Voltage**: प्रति सेल २.३५V = **५६.४ भोल्ट (56.4V DC)**।
- **Hydro-meter (हाइड्रोमिटर)**: लेड-एसिड ब्याट्रीको इलेक्ट्रोलाइट (H₂SO₄) को विशिष्ट घनत्व (Specific Gravity) नाप्न प्रयोग हुन्छ।
  - पूर्ण चार्ज (Full Charge): **१.२४० देखि १.२८०**
  - डिस्चार्ज (Discharged): **१.१५० भन्दा कम**`
  },
  {
    id: 'copper-krone-mdf',
    keywords: ['krone', 'mdf', 'tag block', 'punching', 'copper', 'कपर', 'क्रोने', 'पन्चिङ', 'dp', 'tag', 'drop wire', 'uy connector'],
    title: 'MDF, Krone Punching & Distribution Point (DP)',
    reply: `**MDF, क्रोने ट्याग ब्लक र कपर जोइन्टिङ (Chapter 8 & 9):**

- **Krone Insertion Tool**: १०/२० पेयर ट्याग ब्लकमा कपर तार पन्च गर्दा प्रयोग हुन्छ। यसमा भएको बाहिरी **कटिङ ब्लेड (Blade Facing Outside)** ले अतिरिक्त तार आफै काट्छ।
- **MDF (Main Distribution Frame)**:
  - **Vertical Side**: बाहिरी प्राथमिक केबल (OSP) जोडिने भाग।
  - **Horizontal Side**: एक्सचेन्जको स्विच/एम्प्लीफायर जोडिने भाग।
- **UY/UR/UG Crimp Connectors**: २ वा ३ वटा कपर तारलाई स्ट्रिप नगरी सिधै थिचेर जोड्ने वाटरप्रूफ (Silicone Gel) कनेक्टर।
- **Pick Up Joint (PUJ)**: मुख्य केबल नकाटी ड्रप वायर शाखा निकाल्ने विधि।`
  },
  {
    id: 'copper-color-code-ntc',
    keywords: ['copper color', 'coper color', 'कपर रङ', 'कपर कलर', 'पेयर कलर', 'युनिट बाइण्डर', 'unit binder', '10 pair', '25 pair', '300 pair', '600 pair', '1800 pair', 'शीथ', 'sheath', 'cross talk', 'क्रस टक'],
    title: 'NTC Official Copper Cable Color Code & Unit Binder Standard',
    reply: `**नेपाल टेलिकम (NTC Standard) कपर केबल कलर कोड र युनिट बाइण्डर:**

१. **१०-पेयर केबल स्प्लाइस रङ (10-Pair Cable Pair Colors)**:
   - १: निलो + सेतो | २: सुन्तला + सेतो | ३: हरियो + सेतो | ४: खैरो + सेतो | ५: खरानी + सेतो
   - ६: निलो + रातो | ७: सुन्तला + रातो | ८: हरियो + रातो | ९: खैरो + रातो | १०: खरानी + रातो

२. **युनिट बाइण्डर कलर कोड (50/100 Pair Cable Unit Binder)**:
   - १. निलो (1-10 Pair) | २. सुन्तला (11-20) | ३. हरियो (21-30) | ४. खैरो (31-40) | ५. खरानी (41-50)
   - ६. रातो+निलो (51-60) | ७. रातो+सुन्तला (61-70) | ८. रातो+हरियो (71-80) | ९. रातो+खैरो (81-90) | १०. रातो+खरानी (91-100)

३. **३०० पेयर र ६०० पेयर ग्रुप वाइण्डर**:
   - ३०० पेयर: १-निलो(1-50), २-सुन्तला(51-100), ३-हरियो(101-150), ४-खैरो(151-200), ५-खरानी(201-250), ६-निलो/रातो(251-300)
   - ६०० पेयर: १-निलो(1-100), २-सुन्तला(101-200), ३-हरियो(201-300), ४-खैरो(301-400), ५-खरानी(401-500), ६-निलो/रातो(501-600)

४. **अन्डरग्राउण्ड केबल १८०० पेयर**: १८ वटा ग्रुप वाइण्डर (निलो, सुन्तला, हरियो, खैरो, खरानी, रातो/निलो ... कालो/हरियो सम्म)।

५. **केबल स्प्लाइस गर्दा शिथ निकाल्ने नाप (Stripping Length)**:
   - १०, २०, ३० पेयर: **३० से.मी.**
   - ५०, ७०, १००, १५० पेयर: **४३ से.मी.**
   - १५० देखि ९०० पेयर: **४७ से.मी.**
   - १२०० देखि १८०० पेयर: **५० से.मी.**

*महत्वपूर्ण नियम: केबल स्प्लाइस गर्दा अनिवार्य रूपमा कलर कोड अनुसार जोड्नु पर्छ, अन्यथा Cross Talk (आवाज मिसिने समस्या) उत्पन्न हुन्छ।*`
  },
  {
    id: 'mobile-gsm-hlr-vlr',
    keywords: ['gsm', 'hlr', 'vlr', 'bts', 'bsc', 'msc', '4g', 'lte', 'mobile', 'मोबाइल', 'सिम', 'eir', 'imei', 'shortcode'],
    title: 'GSM Mobile Architecture & NTC Shortcodes',
    reply: `**मोबाइल नेटवर्क (GSM 2G/3G/4G) र सर्टकोडहरू (Chapter 21 & 36):**

- **HLR (Home Location Register)**: ग्राहकको स्थायी डाटाबेस (सिम नम्बर, प्याकेज, ठेगाना)।
- **VLR (Visitor Location Register)**: ग्राहक जुन टावर वा क्षेत्रमा भ्रमण गर्छ, त्यहाँको अस्थायी डाटाबेस।
- **EIR (Equipment Identity Register)**: मोबाइलको १५ डिजिटको IMEI नम्बर ट्रयाक/ब्लक गर्ने डाटाबेस।
- **NTC मुख्य सर्टकोडहरू**:
  - **198**: ल्यान्डलाइन, FTTH र एनटीसी इन्टरनेट मर्मत तथा उजुरी।
  - **197**: टेलिफोन नम्बर सोधपुछ (Enquiry Service)।
  - **1606**: PSTN टेलिफोन महसुल/बिल सोधपुछ।
  - **1600**: IVR आधारित सेवा जानकारी।`
  },
  {
    id: 'ctevt-exam-prep',
    keywords: ['ctevt', 'nstb', 'exam', 'परीक्षा', 'पास', 'तयारी', 'marks', 'level 1', 'level 2', 'तह १', 'तह २', 'practical'],
    title: 'CTEVT / NSTB Level 1 & Level 2 Exam Preparation',
    reply: `**CTEVT / NSTB स्किल टेस्ट र लिखित परीक्षा सफलताको सूत्र:**

१. **वस्तुगत (MCQs)**: ५० वटा बहुवैकल्पिक प्रश्नहरू हुन्छन्। कलर कोड, मापदण्ड र एकाइ (Units) मा बढी ध्यान दिनुहोस्।
२. **विषयगत (Subjective)**: १९ वटा प्रश्नहरू हुन्छन्। उत्तर लेख्दा:
   - स्पष्ट परिभाषा (Definition)
   - सूत्र (Formulas) जस्तै $V=IR$ वा $Splice Loss < 0.02dB$
   - सफा ब्लक डायग्राम वा स्केच (Diagram)
   - सुरक्षा र PPE को जिक्र अनिवार्य गर्नुहोस्।
३. **प्रयोगात्मक (Practical & Spotting)**:
   - Fiber Splicing: Cleave Angle < 1° र Splice Loss < 0.02 dB ल्याउनुहोस्।
   - Spotting: १६ वटा सामान चिन्ने र मुख्य काम लेख्ने।`
  },
  {
    id: 'institute-surendra-air',
    keywords: ['surendra air', 'सुरेन्द्र ऐर', 'institute', 'इन्स्टिच्युट', 'contact', 'फोन', 'नम्बर', 'ठेगाना', 'location', 'महालक्ष्मी'],
    title: 'Surendra Air Telecom & Optical Fiber Training Institute',
    reply: `**सुरेन्द्र ऐर (Surendra Air) टेलिकम तथा अप्टिकल फाइबर तालिम केन्द्र:**

- **मुख्य प्रशिक्षक**: सुरेन्द्र ऐर (Surendra Air) - १९+ वर्षको टेलिकम तथा अप्टिकल फाइबर क्षेत्रको अनुभव।
- **सम्बन्धन**: CTEVT तथा NSTB प्रमाणित।
- **ठेगाना**: महालक्ष्मी-२, इमाडोल, ललितपुर (काठमाडौँ उपत्यका)।
- **सम्पर्क फोन**: **०१-५२०३५२२** / **९८५१०९८२३४** / **९८६०१२३९८७**
- **इमेल**: nitvtnepal@gmail.com
- **सञ्चालित तालिमहरू**:
  - CTEVT Level 1 Junior Telecom Technician (३ महिना / ३९० घण्टा)
  - CTEVT Level 2 Telecom Technician (६ महिना / ७२० घण्टा)
  - Optical Fiber Splicing, OTDR & FTTH Special Master Class`
  }
];

export function queryOfflineGuru(userQuery: string): string {
  const query = userQuery.trim().toLowerCase();

  if (!query) {
    return 'कृपया टेलिकम, अप्टिकल फाइबर, फ्युजन स्प्लाइसिङ वा CTEVT पाठ्यक्रम सम्बन्धी प्रश्न टाइप गर्नुहोस्।';
  }

  // 1. Direct Greetings
  if (['hello', 'hi', 'namaste', 'नमस्कार', 'नमस्ते', 'सलाम', 'हालो'].includes(query)) {
    return `नमस्कार! म सुरेन्द्र ऐर (Surendra Air) को **अन्तरनिर्मित अफलाइन AI प्राविधिक गुरु (Offline Guru Engine)** हुँ। 
इन्टरनेट नहुँदा वा अफलाइन मोडमा पनि म CTEVT तह-१, तह-२, फ्युजन स्प्लाइसिङ, १२-कोर फाइबर कलर कोड, OTDR, Krone Punching र NTC मापदण्डका सम्पूर्ण ३८ च्याप्टरबाट तुरुन्त उत्तर दिन सक्छु।

तपाईं के सोध्न चाहनुहुन्छ? (उदाहरण: "१२ कोर फाइबरको रङ के हो?", "फ्युजन स्प्लाइसिङ कसरी गरिन्छ?", "अर्थिङ रेसिस्टेन्स कति हुनुपर्छ?")`;
  }

  // 2. Score match against knowledge base
  let bestMatch: OfflineKnowledgeItem | null = null;
  let maxScore = 0;

  for (const item of offlineKnowledgeBase) {
    let score = 0;
    for (const kw of item.keywords) {
      if (query.includes(kw.toLowerCase())) {
        score += kw.length > 4 ? 3 : 2;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && maxScore >= 2) {
    return `**[अफलाइन गुरु नलेज बेस - ${bestMatch.title}]**\n\n${bestMatch.reply}\n\n*(अफलाइन मोड: इन्टरनेट नभए पनि CTEVT ३८ म्यानुअलबाट प्रमाणीकृत उत्तर)*`;
  }

  // 3. Fallback answer combining broad CTEVT principles
  return `**[सुरेन्द्र ऐर अफलाइन प्राविधिक गुरु]:** 
तपाईंको प्रश्न: "${userQuery}"

**मुख्य CTEVT / NTC प्राविधिक मापदण्ड र सूत्रहरू:**
१. **OFC 12-Core Color**: १-नीलो, २-सेतो, ३-पहेँलो, ४-हरियो, ५-खैरो, ६-रातो, ७-सुन्तला, ८-कालो, ९-गुलावी, १०-बैजनी, ११-कफी, १२-फिरोजा।
२. **Fusion Splicing**: ९०° precision cleaving, ९९% IPA सफाइ, Splice Loss < 0.02 dB।
३. **Pole Clearance**: 33kV सँग २ मिटर, 11kV सँग १.२m-१.५m, 230V सँग ३० सेमि, क्रसिङ कोण ९०°।
४. **Earth Resistance**: Core Exchange < 1Ω, BTS/FDC < 5Ω, Secondary < 10Ω।
५. **Telecom Power**: -48V DC, 24 cells Lead-Acid battery bank, Float 54V।

*(इन्टरनेट उपलब्ध भएमा वा Gemini connected हुँदा थप विस्तृत AI अनुसन्धान प्राप्त हुनेछ। तालिम सम्बन्धी सोधपुछका लागि ०१-५२०३५२२ मा फोन गर्नुहोस्।)*`;
}
