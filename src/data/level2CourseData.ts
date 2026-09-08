// NITVT - Telecom Technician Level-2 (CTEVT / NSTB) Master Data
// Prepared based on the official NITVT Level-2 Manual & CTEVT Curriculum

export interface Level2Chapter {
  id: string;
  chapterNumber: number;
  titleNepali: string;
  titleEnglish: string;
  category: 'core-telecom' | 'wireless-satellite' | 'optical-fiber' | 'electrical-electronics' | 'network-planning' | 'safety-migration';
  readTime: string;
  summaryNepali: string;
  keyPoints: string[];
  imageUrl?: string;
  contentSections: {
    heading: string;
    subheading?: string;
    paragraphs: string[];
    diagramAscii?: string;
    tableData?: {
      headers: string[];
      rows: string[][];
    };
    formulas?: { name: string; formula: string; explanation: string }[];
    importantNotes?: string[];
  }[];
}

export interface Level2ExamPaper {
  id: string;
  examTitleNepali: string;
  examDate: string;
  fullMarks: number;
  passMarks: number;
  timeDuration: string;
  institution: string;
  objectiveSection: {
    totalMarks: number;
    instructions: string;
    questions: {
      qNo: number;
      question: string;
      options: { A: string; B: string; C: string; D: string };
      correctOption: 'A' | 'B' | 'C' | 'D';
      explanation: string;
    }[];
  };
  matchingSection?: {
    groupTitle: string;
    columnA: { qNo: number; premise: string; correctAns: string }[];
    columnB: { code: string; response: string }[];
  }[];
  spottingSection?: {
    id: number;
    item: string;
    usedFor: string;
    time: string;
  }[];
  practicalAssignments?: {
    qNo: number;
    taskTitle: string;
    durationMinutes: number;
    description: string;
  }[];
  subjectiveSection: {
    totalMarks: number;
    instructions: string;
    questions: {
      qNo: number;
      question: string;
      marks: number;
      modelAnswer: string;
      bulletPoints: string[];
      diagramAscii?: string;
    }[];
  };
}

export interface PoleStandardSpec {
  item: string;
  distanceFromTop: string;
  descriptionNepali: string;
  standardRule: string;
  category: 'pole-fitting' | 'power-clearance' | 'underground-depth';
}

export const level2CourseInfo = {
  courseId: 'telecom-technician-level-2',
  titleNepali: 'टेलिकम टेक्निसियन तालिम तह–२ (Telecom Technician Level-2)',
  titleEnglish: 'Telecom Technician (CTEVT Level 2 Professional)',
  level: 'CTEVT तह-२ (National Occupational Skill Standard Level-2)',
  durationHours: '१६९६ घण्टा (१० महिना)',
  practicalPercentage: 75,
  theoryPercentage: 25,
  certification: 'CTEVT / राष्ट्रिय सीप परीक्षण समिति (NSTB) आधिकारिक प्रमाणपत्र',
  institute: 'Nepal Institute of Technical and Vocational Training (NITVT) Pvt. Ltd.',
  location: 'महालक्ष्मी नगरपालिका-०२, ललितपुर (फोन: ०१-५२०३५२२, ९८४८८०५११९)',
  prerequisites: 'तह-१ (Junior Telecom Technician) उत्तीर्ण वा ३ वर्षभन्दा बढी टेलिकम/आईएसपी फिल्ड कार्य अनुभव',
  objectives: [
    'दूरसञ्चार नेटवर्क प्रणाली (Exchange, MDF, ODF, Cabinet, DP) को पूर्ण योजना र कार्यान्वयन',
    'कपर तथा अप्टिकल फाइबर नेटवर्कको डिजाइन, रुट सर्भे र नेटवर्क माइग्रेसन',
    'माइक्रोवेभ, स्याटेलाइट (VSAT), जीएसएम (GSM) तथा सीडीएमए (CDMA) वायरलेस प्रविधिको ज्ञान',
    'इलेक्ट्रिकल र डिजिटल इलेक्ट्रोनिक्स (Logic Gates, Theorems, Rectifiers, Transistors, Oscillators)',
    'विशिष्ट परीक्षण उपकरणहरू (OTDR, DSP Meter, Megger, C-Meter, Earth Tester, OPM, VFL) मा पूर्ण दक्षता',
    'पेशागत सुरक्षा, व्यावसायिक स्वास्थ्य (OSH), उच्च भोल्टेज सेपरेसन र अर्थिङ सुरक्षा मापदण्ड'
  ]
};

// 12 Comprehensive Level-2 Chapters based on the 271-page document
export const level2ManualChapters: Level2Chapter[] = [
  {
    id: 'ch1-telecom-switching-principles',
    chapterNumber: 1,
    titleNepali: 'दूरसञ्चार प्रणाली, सिग्नल र स्विचिङ प्रणाली (Telecommunication & Switching Systems)',
    titleEnglish: 'Telecommunication Principles & Switching Systems',
    category: 'core-telecom',
    readTime: '१२ मिनेट',
    summaryNepali: 'दूरसञ्चारका प्रमुख ५ भागहरू, सञ्चार अपरेशन्स, एनालग र डिजिटल सिग्नल, सर्किट/प्याकेट/सेल स्विचिङ, एक्सचेन्जका कार्यहरू र कार्यात्मक तत्वहरू।',
    keyPoints: [
      'दूरसञ्चारका ५ प्रमुख भाग: Transmitter, Transmission Medium, Receiver, Message/Information, Protocol/Control',
      'सञ्चार अपरेशन्स: Transmission, Reception, Processing, Switching, Storage, Retrieval',
      'स्विचिङ प्रविधिहरू: Circuit Switching (PSTN), Message Switching, Packet Switching (Internet), Cell Switching (ATM)',
      'एक्सचेन्जका आधारभूत कार्य: Call Establishment, Call Routing, Signal Processing, Supervision, Billing, Termination'
    ],
    contentSections: [
      {
        heading: 'दूरसञ्चार (Telecommunication) को परिचय र प्रमुख भागहरू',
        paragraphs: [
          'दूरसञ्चार (Telecommunication) भनेको तार, रेडियो, अप्टिकल फाइबर वा अन्य माध्यम प्रयोग गरी टाढा-टाढासम्म सूचना, आवाज, चित्र तथा डाटा आदान-प्रदान गर्ने प्रक्रिया हो।',
          'यसका ५ वटा प्रमुख कम्पोनेन्टहरू हुन्छन्: प्रेषक (Transmitter), सञ्चार माध्यम (Transmission Medium - Wire/Fiber/Radio), ग्राहक (Receiver), सन्देश (Message), र नियम प्रणाली (Protocol/System Control)।'
        ],
        tableData: {
          headers: ['अपरेशन (Operation)', 'कार्य विवरण (Description)'],
          rows: [
            ['Transmission (प्रेषण)', 'सूचनालाई माध्यममार्फत गन्तव्यतर्फ पठाउने कार्य'],
            ['Reception (ग्रहण)', 'पठाइएको सूचना वा सिग्नल रिसिभरमा प्राप्त गर्ने कार्य'],
            ['Processing (प्रशोधन)', 'सूचनालाई आवश्यकता अनुसार रूपान्तरण वा विश्लेषण गर्ने कार्य'],
            ['Switching (स्विचिङ)', 'सूचनालाई सही गन्तव्यसम्म पुर्याउन मार्ग (Path) चयन गर्ने कार्य'],
            ['Storage & Retrieval', 'सूचना सुरक्षित भण्डारण गर्ने र आवश्यकता पर्दा पुन: निकाल्ने कार्य']
          ]
        }
      },
      {
        heading: 'स्विचिङ प्रणाली र एक्सचेन्जका कार्यहरू (Switching & Exchange Operations)',
        paragraphs: [
          'स्विचिङ (Switching) भनेको सञ्चार प्रणालीमा एक प्रेषकबाट आएको सूचना सही गन्तव्यसम्म पुर्याउन मार्ग चयन गर्ने प्रक्रिया हो। टेलिफोन एक्सचेन्ज यसको प्रमुख उदाहरण हो।',
          'स्विचिङ प्रविधिहरू: १) Circuit Switching (कुराकानी अघि समर्पित पाथ बन्ने), २) Message Switching (Store and Forward), ३) Packet Switching (डाटा साना प्याकेटमा विभाजन हुने), ४) Cell Switching (निश्चित आकारका Cell, जस्तै ATM)।'
        ],
        diagramAscii: `[Subscriber A] ---> [Line Interface Unit] ---> [Switching Network] ---> [Line Interface Unit] ---> [Subscriber B]
                                      |                       ^
                                      v                       |
                               [Signaling Unit] <---> [Control Unit / CPU] <---> [Memory Unit]`
      }
    ]
  },
  {
    id: 'ch2-transmission-multiplexing-modulation',
    chapterNumber: 2,
    titleNepali: 'प्रसारण प्रणाली, मल्टिप्लेक्सिङ र डिजिटल मोड्युलेसन (Transmission, Multiplexing & Modulation)',
    titleEnglish: 'Transmission Systems, Multiplexing & Digital Modulation',
    category: 'core-telecom',
    readTime: '१५ मिनेट',
    summaryNepali: 'एनालग तथा डिजिटल ट्रान्समिसन, FDM/TDM/WDM मल्टिप्लेक्सिङ, PCM सिग्नल विकास (Sampling, Quantization, Encoding), डिजिटल मोड्युलेसन (ASK, FSK, PSK, QPSK, QAM), र SNR गणना।',
    keyPoints: [
      'एनालग ट्रान्समिसनमा Noise बढी पर्छ; डिजिटल ट्रान्समिसन (0 र 1) बढी सुरक्षित र भरपर्दो हुन्छ',
      'Multiplexing का प्रकार: FDM (Frequency), TDM (Time), WDM (Wavelength for Fiber)',
      'PCM Signal विकासका ४ चरण: Sampling -> Quantization -> Encoding (Binary Code) -> Transmission',
      'Signal to Noise Ratio: SNR = Signal Power / Noise Power; SNR(dB) = 10 log10(S/N)',
      'Transmission Impairments: Attenuation, Noise, Distortion, Interference, Delay/Latency, Fading'
    ],
    contentSections: [
      {
        heading: 'मल्टिप्लेक्सिङ र मोड्युलेसन (Multiplexing & Modulation)',
        paragraphs: [
          'Multiplexing भनेको धेरै वटा सिग्नल वा डाटालाई एउटै सञ्चार माध्यम (Channel) प्रयोग गरेर एकै समयमा पठाउने प्रक्रिया हो। पठाउने पक्षमा MUX र प्राप्त गर्ने पक्षमा DEMUX प्रयोग गरिन्छ।',
          'Modulation भनेको कमजोर बेसरी सूचना सिग्नललाई लामो दूरीसम्म पठाउन उच्च आवृत्तिको क्यारियर वेभमा मिसाउने प्रक्रिया हो।'
        ],
        formulas: [
          {
            name: 'Signal-to-Noise Ratio (SNR)',
            formula: 'SNR = Signal Power (S) / Noise Power (N) | SNR(dB) = 10 * log10(S/N)',
            explanation: 'SNR बढी भएमा सिग्नलको गुणस्तर स्पष्ट र राम्रो हुन्छ। १० dB भन्दा कम SNR अति कमजोर मानिन्छ।'
          },
          {
            name: 'Radio Wave Speed in Free Space',
            formula: 'v = 3 * 10^8 m/s',
            explanation: 'रेडियो तरङ्गहरू प्रकाशको गति (३ लाख किलोमिटर प्रति सेकेन्ड) मा अन्तरिक्षमा यात्रा गर्दछन्।'
          }
        ],
        tableData: {
          headers: ['डिजिटल मोड्युलेसन', 'कार्य सिद्धान्त (Operating Principle)'],
          rows: [
            ['ASK (Amplitude Shift Keying)', 'कन्स्टेन्ट फ्रिक्वेन्सीमा क्यारियरको एम्प्लिच्युड परिवर्तन गरी डाटा पठाइन्छ'],
            ['FSK (Frequency Shift Keying)', 'क्यारियरको फ्रिक्वेन्सी परिवर्तन गरी बाइनरी 0 र 1 पठाइन्छ'],
            ['PSK (Phase Shift Keying)', 'क्यारियरको फेज (Phase Angle) परिवर्तन गरेर सूचना पठाइन्छ'],
            ['QPSK (Quadrature Phase Shift Keying)', 'PSK को उन्नत रूप, जसले प्रति सिम्बोल २ बिट डाटा पठाउँछ'],
            ['QAM (Quadrature Amplitude Modulation)', 'Amplitude र Phase दुवै एकसाथ परिवर्तन गरेर उच्च गतिको डाटा प्रसारण गरिन्छ']
          ]
        }
      }
    ]
  },
  {
    id: 'ch3-wireless-microwave-satellite',
    chapterNumber: 3,
    titleNepali: 'माइक्रोवेभ, एन्टेना र स्याटेलाइट सञ्चार (Microwave, Antenna & Satellite Communication)',
    titleEnglish: 'Microwave, Antenna Systems & Satellite Communication',
    category: 'wireless-satellite',
    readTime: '१४ मिनेट',
    summaryNepali: 'माइक्रोवेभ (१ देखि ३०० GHz), रेडियो सिस्टमका भागहरू, एन्टेनाका प्रकार तथा विशेषताहरू, स्याटेलाइट Uplink/Downlink, अर्थ स्टेशन, केप्लरका नियमहरू, र अर्थ अर्बिटहरू (LEO, MEO, GEO, HEO)।',
    keyPoints: [
      'Microwave फ्रिक्वेन्सी सामान्यतया १ GHz देखि ३०० GHz सम्म हुन्छ (नेपाल टेलिकममा ६/८/१२/१५ GHz प्रयोग)',
      'एन्टेनाका प्रकार: Dipole (Wire), Loop, Array, Parabolic Dish, Horn, Microstrip Patch, Yagi-Uda',
      'स्याटेलाइट फ्रिक्वेन्सी ब्यान्डहरू: L-Band (1-2GHz), S-Band (2-4GHz), C-Band (4-8GHz), X-Band (8-12GHz), Ku-Band (12-18GHz), Ka-Band (26-40GHz)',
      'केप्लरको पहिलो नियम: ग्रह/स्याटेलाइट इलिप्टिकल (Elliptical) कक्षमा घुम्छ; तेस्रो नियम: T^2 ∝ a^3',
      'अभिकेन्द्रीय बल (Centripetal Force): F = (m * v^2) / r'
    ],
    contentSections: [
      {
        heading: 'स्याटेलाइट र अर्थ अर्बिटहरू (Earth Orbits & VSAT)',
        paragraphs: [
          'स्याटेलाइट सञ्चार पृथ्वीको कक्षमा रहेका कृत्रिम उपग्रह प्रयोग गरी डाटा प्रसारण गर्ने प्रणाली हो। ग्राउन्ड स्टेशनबाट स्याटेलाइटतर्फ पठाउनुलाई Uplink र स्याटेलाइटबाट पृथ्वीतर्फ पठाउनुलाई Downlink भनिन्छ।',
          'VSAT (Very Small Aperture Terminal) ले साना डिश एन्टेना, BUC (Block Up Converter), LNB, र मोडेम प्रयोग गरी दुर्गम क्षेत्रमा इन्टरनेट र भ्वाइस सेवा दिन्छ।'
        ],
        tableData: {
          headers: ['अर्बिट (Orbit)', 'उचाइ (Altitude)', 'प्रमुख अनुप्रयोग (Applications)'],
          rows: [
            ['LEO (Low Earth Orbit)', '160 - 2000 km', 'Starlink, Low Latency Internet, Earth Imaging'],
            ['MEO (Medium Earth Orbit)', '2000 - 35,786 km', 'GPS, GLONASS, Galileo Navigation'],
            ['GEO (Geostationary Earth Orbit)', '३५,७८६ km', 'TV Broadcasting, Weather, NTC Satellite VSAT (पृथ्वीको घूर्णन बराबर)'],
            ['HEO (Highly Elliptical Orbit)', 'ध्रुवीय क्षेत्रहरू', 'विशिष्ट वैज्ञानिक अनुसन्धान तथा उच्च अक्षांश सञ्चार']
          ]
        }
      }
    ]
  },
  {
    id: 'ch4-cellular-mobile-gsm-cdma',
    chapterNumber: 4,
    titleNepali: 'सेलुलर मोबाइल सञ्चार (GSM र CDMA नेटवर्क आर्किटेक्चर)',
    titleEnglish: 'Cellular Mobile Communication (GSM & CDMA Architecture)',
    category: 'wireless-satellite',
    readTime: '१६ मिनेट',
    summaryNepali: '१G देखि ५G सम्मको विकास, GSM नेटवर्क आर्किटेक्चर (MS, BSS, NSS, OSS), GSM इन्टरफेसहरू (Um, Abis, A, MAP), CDMA र Spread Spectrum (DSSS, FHSS), Rake Receiver, Near-Far समस्या र पावर कन्ट्रोल।',
    keyPoints: [
      '१G (एनालग भ्वाइस) -> २G (डिजिटल GSM/SMS) -> ३G (भिडियो/इन्टरनेट) -> ४G (LTE ब्रोडब्यान्ड) -> ५G (अल्ट्रा लो लेटेन्सी/IoT)',
      'GSM ब्लक डायग्राम: Mobile User -> BTS (Base Station) -> BSC (Controller) -> MSC (Switching) -> PSTN / Internet',
      'NSS का मुख्य डेटाबेस: HLR (Home Location Register), VLR (Visitor Location Register), AuC (Authentication), EIR (IMEI Register)',
      'GSM Interfaces: Um (MS-BTS), Abis (BTS-BSC), A (BSC-MSC), MAP (MSC-HLR-VLR)',
      'Near-Far Problem: नजिकको मोबाइलले टाढाको सिग्नल दबाउने; समाधान: Open/Closed/Outer Loop Power Control'
    ],
    contentSections: [
      {
        heading: 'GSM नेटवर्क आर्किटेक्चर र कम्पोनेन्टहरू',
        paragraphs: [
          'GSM (Global System for Mobile Communications) विश्वको सबैभन्दा लोकप्रिय डिजिटल मोबाइल स्ट्यान्डर्ड हो। यसले सिमकार्ड प्रयोग गरी सुरक्षित र गुणस्तरीय सञ्चार सुविधा दिन्छ।'
        ],
        diagramAscii: `┌──────────────┐
│ Mobile User  │
│ (Handset/SIM)│
└──────┬───────┘
       │  [Um Interface - Radio Air]
       ▼
┌──────────────┐
│     BTS      │ (Base Transceiver Station - Tower Radio)
└──────┬───────┘
       │  [Abis Interface]
       ▼
┌──────────────┐
│     BSC      │ (Base Station Controller - Manages multiple BTS)
└──────┬───────┘
       │  [A Interface]
       ▼
┌──────────────┐      [MAP]      ┌─────────────┐
│     MSC      │ <=============> │ HLR / VLR   │
│  (Switching) │                 │  AuC / EIR  │
└──────┬───────┘                 └─────────────┘
       │
  ┌────┴────┐
  ▼         ▼
[PSTN]  [Internet / Core IP]`
      },
      {
        heading: 'CDMA, Spread Spectrum र Rake Receiver',
        paragraphs: [
          'CDMA (Code Division Multiple Access) मा सबै प्रयोगकर्ताले एउटै फ्रिक्वेन्सी ब्यान्डमा छुट्टाछुट्टै युनिक कोड प्रयोग गरी सञ्चार गर्दछन्।',
          'Rake Receiver: वायरलेस सञ्चारमा भवन/पहाडबाट रिफ्लेक्ट भई विभिन्न समयमा आइपुग्ने मल्टिपाथ (Multipath) सिग्नलहरूलाई ग्रहण गरी संयोजन गरेर मूल सिग्नललाई बलियो र स्पष्ट बनाउने यन्त्र हो।'
        ]
      }
    ]
  },
  {
    id: 'ch5-optical-fiber-physics-splicing',
    chapterNumber: 5,
    titleNepali: 'अप्टिकल फाइबर सिद्धान्त, स्नेल्स ल र स्प्लाइसिङ प्रविधि (Optical Fiber Physics & Splicing)',
    titleEnglish: 'Optical Fiber Physics, Snell\'s Law & Precision Splicing',
    category: 'optical-fiber',
    readTime: '१८ मिनेट',
    summaryNepali: 'पूर्ण आन्तरिक परावर्तन (TIR), स्नेल्स ल, क्रिटिकल कोण, फाइबर संरचना (Core, Cladding, Coating, Jacket), Single Mode vs Multimode, १२/२४/१४४ कोर कलर कोड, OJC जोइन्टमा १ सेमी र १ मिटर शिथ ओपनिङका प्राविधिक कारणहरू।',
    keyPoints: [
      'फाइबर सञ्चार Total Internal Reflection (TIR) मा आधारित हुन्छ (Incident Angle > Critical Angle)',
      'Snell\'s Law: n1 * sin(θ1) = n2 * sin(θ2); Critical Angle: sin(θc) = n2 / n1 (जहाँ n1 > n2)',
      'फाइबरका ४ तह: Core (प्रकाश हिँड्ने), Cladding (TIR गराउने), Coating/Buffer (सुरक्षा), Jacket (बाहिरी कभर)',
      'Single Mode Fiber (SMF): ९ µm कोर, लामो दूरी, कम लस; Multi Mode Fiber (MMF): ५०/६२.५ µm कोर, छोटो दूरी',
      'स्प्लाइसिङ ट्रेमा १ मिटर शिथ ओपनिङ लुपिङका लागि; OJC बक्स/क्ल्याम्पमा १ सेमी मात्र शिथ ओपनिङ FRP लक र वाटरप्रूफिङका लागि'
    ],
    contentSections: [
      {
        heading: 'अप्टिकल फाइबरको कार्य सिद्धान्त र संरचना',
        paragraphs: [
          'प्रकाश जब घना माध्यम (Core, n1) बाट विरल माध्यम (Cladding, n2) तर्फ क्रिटिकल कोणभन्दा ठूलो कोणमा प्रवेश गर्दछ, तब प्रकाश बाहिर ननिस्की पूर्ण रूपमा कोरभित्रै परावर्तित हुन्छ।',
          'फाइबर स्प्लाइसिङमा फ्युजन स्प्लाइसिङ (इलेक्ट्रिक आर्कबाट पगाल्ने, लस < ०.०२ dB) र मेकानिकल स्प्लाइसिङ (क्लिप/जेल) गरिन्छ।'
        ],
        diagramAscii: `           ┌─────────────────────────────────────────┐
           │ Jacket (बाहिरी कभर)                     │
           │   ┌─────────────────────────────────┐   │
           │   │ Coating / Buffer (२५० µm)       │   │
           │   │   ┌─────────────────────────┐   │   │
           │   │   │ Cladding (१२५ µm, n2)   │   │   │
Light Ray  │   │   │   ┌─────────────────┐   │   │   │
========>  │   │   │   │ Core (९ µm, n1) │   │   │   │  (TIR: n1 > n2)
           │   │   │   └─────────────────┘   │   │   │
           │   │   └─────────────────────────┘   │   │
           │   └─────────────────────────────────┘   │
           └─────────────────────────────────────────┘`
      },
      {
        heading: 'नेपाल टेलिकम १२/२४/१४४ कोर कलर कोड र लुज ट्युब मानक',
        paragraphs: [
          '१२ कोर स्ट्यान्डर्ड (TIA/EIA-598): १. निलो (Blue), २. सुन्तला (Orange), ३. हरियो (Green), ४. खैरो (Brown), ५. खरानी (Grey), ६. सेतो (White), ७. रातो (Red), ८. कालो (Black), ९. पहेंलो (Yellow), १०. बैजनी (Violet), ११. गुलाबी (Pink), १२. आकाशी निलो (Aqua)।',
          '२४ कोरमा १३ देखि २४ सम्मका कोरहरूमा कालो धर्का (Black Stripe) वा रिङ मार्क राखिन्छ। १४४ कोर केबलमा १२ वटा लुज ट्युब (Loose Tubes) र प्रत्येक ट्युबमा १२ वटा कोर हुन्छन्।'
        ]
      }
    ]
  },
  {
    id: 'ch6-optical-testing-otdr-opm-vfl',
    chapterNumber: 6,
    titleNepali: 'अप्टिकल परीक्षण उपकरणहरू (OTDR, Optical Power Meter र Visual Fault Locator)',
    titleEnglish: 'Optical Testing Instruments (OTDR, OPM, VFL & Trace Analysis)',
    category: 'optical-fiber',
    readTime: '१६ मिनेट',
    summaryNepali: 'OTDR को सिद्धान्त (Rayleigh Backscatter र Fresnel Reflection), OTDR Trace विश्लेषण (Peak = Connector/Splice, Drop = Loss, End = Break), Dead Zone, OPM dBm रिडिङ, र VFL ६५०nm रातो लेजर।',
    keyPoints: [
      'OTDR ले फाइबरमा लेजर पल्स पठाई ब्याकस्क्याटर र रिफ्लेक्सनबाट लम्बाइ, लस, स्प्लाइस प्वाइन्ट र फल्ट पत्ता लगाउँछ',
      'OTDR Trace मा: Initial Pulse (Dead Zone), Peak (Connector Reflectance), Step Drop (Splice Loss), End Drop (Fiber End/Break)',
      'Optical Power Meter (OPM) ले dBm (वा µW) मा प्रकाशको शक्ति नाप्छ; FTTH लिङ्क लस बजेट प्रमाणीकरण गर्छ',
      'Visual Fault Locator (VFL) ले ६५० nm रातो लेजर प्रयोग गरी प्याचकर्ड, ड्रप केबल र जोइन्ट बक्समा प्रत्यक्ष चम्किने फल्ट देखाउँछ'
    ],
    contentSections: [
      {
        heading: 'OTDR Trace Graph विश्लेषण र व्याख्या',
        paragraphs: [
          'OTDR को ग्राफमा ठाडो अक्ष (Y-axis) मा Power Loss (dB) र तेर्सो अक्ष (X-axis) मा Distance from OTDR (km/m) देखाइन्छ।'
        ],
        diagramAscii: `Power
Loss
(dB) ^  [Initial Pulse]
     |   |\\
     |   | \\
     |   |  \\____ [Connector Loss & Reflectance Peak]
     |   |       |\\
     |           | \\____ [Splice Loss Drop - सानो लस]
     |                  \\
     |                   \\____ [Fiber Attenuation Slope dB/km]
     |                        |
     |                        |______ [Fiber End / Break Drop]
   0 +---------------------------------------------------------> Distance (km)`
      },
      {
        heading: 'OTDR, OPM र VFL तुलनात्मक तालिका',
        paragraphs: [
          'फाइबर नेटवर्क मर्मतमा यी तीनवटै उपकरण एकअर्काका परिपूरक हुन्।'
        ],
        tableData: {
          headers: ['आधार (Feature)', 'OTDR', 'Optical Power Meter (OPM)', 'Visual Fault Locator (VFL)'],
          rows: [
            ['मापन गर्ने कुरा', 'लम्बाइ, लस (dB), स्प्लाइस, फल्ट दुरी', 'सिग्नल पावर स्ट्रेंथ (dBm)', 'दृष्टिगत फल्ट (रातो बत्ती)'],
            ['प्रविधि', 'Laser Pulse + Time Analysis', 'Photodiode Detector', '६५० nm Visible Red Laser'],
            ['दूरी क्षमता', 'लामो दूरी (५०-१००+ km)', 'सम्पूर्ण लिङ्क', 'छोटो दूरी (१-१० km, प्याचकर्ड)'],
            ['आउटपुट ढाँचा', 'Trace Graph & Event Table', 'Digital Number (dBm)', 'Optical Glow (रातो प्रकाश)']
          ]
        }
      }
    ]
  },
  {
    id: 'ch7-basic-electrical-electronics',
    chapterNumber: 7,
    titleNepali: 'आधारभूत विद्युतीय तथा इलेक्ट्रोनिक्स सिद्धान्त (Electrical & Electronics Principles)',
    titleEnglish: 'Basic Electrical, Electronics & Component Principles',
    category: 'electrical-electronics',
    readTime: '१६ मिनेट',
    summaryNepali: 'ओहम्स ल (V=IR), ग्राफ (AC vs DC), किरचोफ्स ल (KCL र KVL), पावर तथा इनर्जी (P=VI, E=Pt), ब्याट्री कनेक्सन (Series/Parallel), र AC/DC ब्रिजेज (Wheatstone Bridge)।',
    keyPoints: [
      'ओहम्स ल: V = IR, I = V/R, R = V/I (जहाँ भोल्टेज V, करेन्ट I, र रेजिस्टेन्स R)',
      'KCL (Current Law): कुनै जंक्शनमा प्रवेश गर्ने कुल करेन्ट = बाहिर जाने कुल करेन्ट (∑Iin = ∑Iout)',
      'KVL (Voltage Law): कुनै बन्द लुपमा सबै भोल्टेजको योगफल शून्य हुन्छ (∑V = 0)',
      'इलेक्ट्रिकल पावर: P = V * I = I^2 * R = V^2 / R (Watts); Energy: E = P * t (Watt-hour)',
      'ब्याट्री सिरिज: भोल्टेज जोडिन्छ, करेन्ट समान; ब्याट्री प्यारालल: करेन्ट क्षमता बढ्छ, भोल्टेज स्थिर रहन्छ',
      'Wheatstone Bridge सन्तुलन शर्त: R1 / R2 = Rx / R3'
    ],
    contentSections: [
      {
        heading: 'किरचोफ्स नियम र ओहम्स ल',
        paragraphs: [
          'गुस्ताभ किरचोफले सर्किट विश्लेषणका लागि दुईवटा महत्वपूर्ण नियम दिएका हुन्:',
          '१) KCL: Node मा 5A र 3A प्रवेश गरे बाहिर जाने करेन्ट 5A + 3A = 8A हुन्छ।',
          '२) KVL: 12V ब्याट्री जोडिएको लुपमा यदि दुई रेजिस्टन्समा 7V र 5V ड्रप भए: 12V - 7V - 5V = 0 हुन्छ।'
        ],
        formulas: [
          {
            name: 'Ohm\'s Law Triangle',
            formula: 'V = I * R | I = V / R | R = V / I',
            explanation: 'यदि V = 12V र R = 4Ω भए, Current I = 12/4 = 3A हुन्छ।'
          },
          {
            name: 'Resistors in Series vs Parallel',
            formula: 'Series: RT = R1 + R2 + R3 | Parallel: 1/RT = 1/R1 + 1/R2 + 1/R3',
            explanation: 'सिरिजमा कुल रेजिस्टेन्स बढ्छ, प्याराललमा कुल रेजिस्टेन्स घट्छ।'
          }
        ]
      }
    ]
  },
  {
    id: 'ch8-active-components-rectifiers-digital',
    chapterNumber: 8,
    titleNepali: 'सेमिकन्डक्टर, रेक्टिफायर, ट्रान्जिस्टर र डिजिटल इलेक्ट्रोनिक्स (Active Devices & Digital Logic)',
    titleEnglish: 'Semiconductors, Rectifiers, Transistors & Digital Logic',
    category: 'electrical-electronics',
    readTime: '१५ मिनेट',
    summaryNepali: 'PN जंक्शन डायोड, स्पेशल डायोड (Zener, LED, Photodiode, Solar Cell), हाफ-वेभ र फुल-वेभ ब्रिज रेक्टिफायर, क्यापासिटर फिल्टर, ट्रान्जिस्टर एम्प्लिफायर/स्विच, र बुलियन अल्जेब्रा (De Morgan\'s Laws)।',
    keyPoints: [
      'सेमिकन्डक्टर: Silicon र Germanium; P-Type मा Holes धेरै, N-Type मा Electrons धेरै',
      'Diode: Forward Bias मा करेन्ट बग्छ, Reverse Bias मा ब्लक गर्छ; Rectifier: AC लाई DC मा बदल्छ',
      'Special Diodes: Zener (भोल्टेज रेगुलेटर), LED (प्रकाश उत्सर्जन), Photodiode (प्रकाशबाट करेन्ट), Solar Cell',
      'Transistor: ३ टर्मिनल (Emitter, Base, Collector); सानो Base Current ले ठूलो Collector Current नियन्त्रण गर्छ',
      'De Morgan\'s Theorems: (A • B)\' = A\' + B\' र (A + B)\' = A\' • B\''
    ],
    contentSections: [
      {
        heading: 'रेक्टिफायर र फिल्टर सर्किटहरू',
        paragraphs: [
          'रेक्टिफायर (Rectifier) ले घरमा आउने AC करेन्टलाई टेलिकम तथा इलेक्ट्रोनिक्स उपकरण चलाउन आवश्यक DC मा रूपान्तरण गर्छ।',
          'Half Wave Rectifier मा १ वटा डायोड र Full Wave Bridge Rectifier मा ४ वटा डायोड प्रयोग हुन्छन्। क्यापासिटर फिल्टरले DC मा बाँकी रहेको तरङ्ग (Ripple) हटाएर Smooth DC बनाउँछ।'
        ],
        diagramAscii: `AC Input (230V) ---> [Step-down Transformer] ---> [Bridge Rectifier (4 Diodes)] ---> [Capacitor Filter] ---> Pure DC Output`
      },
      {
        heading: 'डिजिटल इलेक्ट्रोनिक्स र बुलियन नियमहरू (Boolean Theorems)',
        paragraphs: [
          'डिजिटल सर्किटलाई सरल र प्रभावकारी बनाउन बुलियन अल्जेब्राका नियमहरू प्रयोग गरिन्छ:'
        ],
        tableData: {
          headers: ['नियम (Boolean Law)', 'OR रूप (Addition)', 'AND रूप (Multiplication)'],
          rows: [
            ['Identity Law', 'A + 0 = A', 'A • 1 = A'],
            ['Null / Domination Law', 'A + 1 = 1', 'A • 0 = 0'],
            ['Idempotent Law', 'A + A = A', 'A • A = A'],
            ['Complement Law', 'A + A\' = 1', 'A • A\' = 0'],
            ['De Morgan\'s Law', '(A + B)\' = A\' • B\'', '(A • B)\' = A\' + B\'']
          ]
        }
      }
    ]
  },
  {
    id: 'ch9-internet-ip-networking',
    chapterNumber: 9,
    titleNepali: 'इन्टरनेट, आईपी नेटवर्किङ र कम्प्युटर फन्डामेन्टल्स (Internet, IP & Computer Fundamentals)',
    titleEnglish: 'Internet, IP Networking & Computer Systems',
    category: 'core-telecom',
    readTime: '१४ मिनेट',
    summaryNepali: 'IP नेटवर्क (Router, Switch, Server, Client, IP Address), टोपोलोजिज (Bus, Star, Ring, Mesh, Tree), OSI Model ७ लेयर्स, IPv4 vs IPv6, र ४०+ आवश्यक सर्ट फर्महरू।',
    keyPoints: [
      'OSI ७ लेयर्स: Physical (1), Data Link (2 - MAC/Switch), Network (3 - IP/Router), Transport (4 - TCP/UDP), Session (5), Presentation (6), Application (7 - HTTP/DNS)',
      'Router ले फरक-फरक नेटवर्क (IP) जोड्छ; Switch ले एउटै नेटवर्कभित्र MAC Address मार्फत डिभाइस जोड्छ',
      'IPv4: ३२-बिट (उदा. 192.168.1.1); IPv6: १२८-बिट (उदा. 2001:db8::1)',
      'सबैभन्दा बढी प्रयोग हुने टोपोलोजि Star Topology (Switch/Hub केन्द्रित); सबैभन्दा भरपर्दो Mesh Topology',
      'महत्वपूर्ण एब्रिभिएशन: DNS (Domain Name System), DHCP (Auto IP), NAT (Private to Public IP), VoIP, ISP'
    ],
    contentSections: [
      {
        heading: 'OSI ७ लेयर्स र उपकरणहरूको कार्य',
        paragraphs: [
          'ओपन सिस्टम्स इन्टरकनेक्सन (OSI) मोडलले कम्प्युटर तथा सञ्चार नेटवर्कमा डाटा कसरी प्रसारण हुन्छ भन्ने ७ तहमा व्याख्या गर्छ।'
        ],
        tableData: {
          headers: ['Layer No.', 'तह (Layer Name)', 'मुख्य कार्य (Function)', 'उपकरण / प्रोटोकल'],
          rows: [
            ['7', 'Application Layer', 'प्रयोगकर्तालाई नेटवर्क सेवा प्रदान गर्ने', 'HTTP, HTTPS, FTP, SMTP, DNS'],
            ['6', 'Presentation Layer', 'डाटा फर्म्याट, इन्क्रिप्सन र कम्प्रेसन', 'SSL, TLS, JPEG, ASCII'],
            ['5', 'Session Layer', 'सञ्चार सत्र स्थापना र नियन्त्रण', 'RPC, NetBIOS'],
            ['4', 'Transport Layer', 'भरपर्दो र त्रुटिरहित एन्ड-टु-एन्ड डेलिभरी', 'TCP, UDP'],
            ['3', 'Network Layer', 'प्याकेट रुटिङ र लजिकल एड्रेसिङ', 'Router, IPv4, IPv6, ICMP'],
            ['2', 'Data Link Layer', 'फ्रेमिङ र फिजिकल म्याक एड्रेसिङ', 'Switch, Bridge, NIC, MAC'],
            ['1', 'Physical Layer', 'विद्युतीय वा प्रकाशिय सिग्नल प्रसारण', 'Hub, Cables, Connectors, Bits']
          ]
        }
      }
    ]
  },
  {
    id: 'ch10-earthing-power-testing-instruments',
    chapterNumber: 10,
    titleNepali: 'अर्थिङ प्रणाली, पावर रुम र परीक्षण उपकरणहरू (Earthing, Power Systems & Specialized Meters)',
    titleEnglish: 'Earthing Systems, Power Rooms & Diagnostic Meters',
    category: 'safety-migration',
    readTime: '१८ मिनेट',
    summaryNepali: 'अर्थिङको उद्देश्य र प्रकार (Plate, Pipe, Rod, Strip), अर्थ टेस्टर मेगर ३-स्पाइक विधि, मानक सीमा (Exchange < 5Ω, Secondary < 10Ω), ब्याट्री बैंक ४८V DC टेस्टिङ, ACDB, र Megger vs C-Meter vs DSP Meter।',
    keyPoints: [
      'अर्थिङले लिफेज करेन्ट र चट्याङको भोल्टेजलाई सुरक्षित रूपमा जमिनमा पठाई मानिस र उपकरण जोगाउँछ',
      'Earth Resistance मानक: एक्सचेन्ज/MDF ≤ १ देखि ५ Ω; सेकेन्डरी नेटवर्क/क्याबिनेट ≤ १० Ω',
      'Earth Resistance Tester (Fall of Potential): E (Main Earth), P (Potential Spike 5-10m), C (Current Spike 10-20m)',
      'पावर रुम ब्याट्री बैंक: २V सेल = २.०-२.२V; ४८V ब्याट्री बैंक = ४८V देखि ५४V DC (Full Charge SG: 1260-1280)',
      'Megger (Insulation MΩ), C-Meter (Capacitance/Distance nF), DSP Meter (Signal Frequency/Noise/Quality)'
    ],
    contentSections: [
      {
        heading: 'अर्थिङ परीक्षण विधि (Earth Resistance Testing by Megger)',
        paragraphs: [
          'स्टेप १: मुख्य अर्थिङ तारलाई उपकरणबाट अस्थायी रूपमा विच्छेद (Disconnect) गर्ने।',
          'स्टेप २: दुईवटा सहायक स्पाइकहरू जमिनमा ५ मिटर र १० मिटरको दूरीमा गाड्ने।',
          'स्टेप ३: E लाई मुख्य अर्थ इलेक्ट्रोडमा, P लाई पोटेन्सियल स्पाइकमा र C लाई करेन्ट स्पाइकमा जोड्ने।',
          'स्टेप ४: टेस्टर अन गरी मान पढ्ने (यदि मान धेरै आएमा नुन, कोइला, पानी वा बेन्टोनाइट पाउडर थप्ने)।'
        ],
        diagramAscii: `[ Earth Tester Meter ]
    |        |        |
    E        P        C
    |        |        |
    v        v        v
[Main Earth] -(5-10m)-> [Potential Spike] -(5-10m)-> [Current Spike]
(Ground Pit)`
      },
      {
        heading: 'टेलिकम मापन उपकरणहरूको तुलनात्मक तालिका',
        paragraphs: [
          'टेलिकम प्राविधिकले कार्यस्थलमा प्रयोग गर्ने प्रमुख मिटरहरूको विवरण:'
        ],
        tableData: {
          headers: ['उपकरण (Meter)', 'पूर्ण नाम', 'के नाप्छ?', 'एकाइ (Unit)', 'फिल्ड प्रयोग'],
          rows: [
            ['Multimeter', 'Multi-purpose Meter', 'Voltage, Current, Resistance, Continuity', 'V, A, Ω', 'आधारभूत सर्किट र पावर जाँच'],
            ['Megger', 'Mega Ohm Meter', 'High DC Insulation Resistance', 'MΩ (Mega Ohm)', 'केबल इन्सुलेसन र सेफ्टी चेक (>200MΩ)'],
            ['C-Meter', 'Capacitance Meter', 'Capacitance & Drop Wire Distance', 'µF, nF, pF', 'क्यापासिटर र ड्रप वायर लम्बाइ/फल्ट'],
            ['DSP Meter', 'Digital Signal Processor', 'Frequency, Noise, Waveform, Attenuation', 'dB, Hz', 'एक्सचेन्ज र ट्रान्समिसन सिग्नल विश्लेषण'],
            ['Earth Tester', 'Earth Resistance Tester', 'Soil & Electrode Ground Resistance', 'Ω (Ohm)', 'टावर, एक्सचेन्ज र क्याबिनेट अर्थिङ जाँच']
          ]
        }
      }
    ]
  },
  {
    id: 'ch11-outside-plant-network-survey',
    chapterNumber: 11,
    titleNepali: 'बाहिरी प्लान्ट, नेटवर्क योजना र सर्भे डायग्राम (Outside Plant - OSP & Network Survey)',
    titleEnglish: 'Outside Plant (OSP), Network Planning & Field Survey',
    category: 'network-planning',
    readTime: '२० मिनेट',
    summaryNepali: 'Primary vs Secondary vs Subscriber नेटवर्क, Gwarko Chowk बेस म्यापिङ, MFD र २ वटा क्याबिनेट सर्भे, १ क्याबिनेट २ DP ३ पोल सेकेन्डरी पोलिङ, पोल एक्ससेरिजको सही दूरी, र डिमान्ड सर्भे।',
    keyPoints: [
      'Primary Network: Exchange/MDF देखि क्याबिनेटसम्म फिडर केबल (३००-१८०० पेयर / १४४F)',
      'Secondary Network: क्याबिनेटदेखि DP बक्ससम्म (१०-१५० पेयर / २४-४८F, १.३ गुणा क्षमता/Fudge Factor)',
      'Subscriber Network: DP देखि ग्राहकको घरको रोजेटसम्म ड्रप वायर (अधिकतम २०० मिटर)',
      'पोल एक्ससेरिज उचाइ मापदण्ड: टुप्पोदेखि २०cm = Distribution Bracket, ४०-४५cm = Stay, ५०cm = Suspension/Pin/Anchor, ११०cm = DP Box, ११५-१२०cm = Bridle Ring',
      'सडक माथि केबल उचाइ कम्तीमा ५ मिटर; बिजुली ११kV बाट १.५m, ३३kV/६६kV बाट २m मुनि'
    ],
    contentSections: [
      {
        heading: 'टेलिकम पोल एक्ससेरिज जडान उचाइ मापदण्ड (Pole Fitting Standard)',
        paragraphs: [
          'नेपाल टेलिकमको आधिकारिक मापदण्ड र फिल्ड गाइड अनुसार पोलको टुप्पो (Top: 0 cm) बाट तल विभिन्न उपकरणहरू जडान गर्ने स्थान यस प्रकार छ:'
        ],
        tableData: {
          headers: ['दूरी (From Pole Top)', 'एक्ससेरिजको नाम (Accessory Name)', 'कार्य विवरण र नियम'],
          rows: [
            ['० देखि २० सेमी', 'Distribution Bracket (डिस्ट्रिब्युसन ब्राकेट)', 'DP मा जोडिएका ड्रप वायरहरूलाई एकीकृत गरी ग्राहकको घरतर्फ लैजाने ब्राकेट'],
            ['४० देखि ४५ सेमी', 'Stay Seat / Stay Wire (स्टे सिट)', 'पोललाई हावा र तनावबाट ढल्न नदिन ब्यालेन्स राख्ने स्टे तार बाँध्ने स्थान (४५° कोण)'],
            ['५० सेमी', 'Pin Type Bracket / Suspension Clamp / Anchoring Eye', 'सिधा रुटमा सस्पेन्सन क्ल्याम्प, बाङ्गो रुटमा पिन टाइप ब्राकेट/एन्करिङ आई (केबल अड्याउने)'],
            ['८० देखि ११० सेमी', 'D.P (Distribution Point) Box', '१० वा २० पेयरको डीपी बक्स जडान गर्ने मुख्य स्थान (जहाँबाट ड्रप वायर छुट्याइन्छ)'],
            ['११५ देखि १२० सेमी', 'Bridle Ring (ब्राइडल रिङ)', 'डीपी बक्सभन्दा ठीक मुनि ड्रप वायरहरूलाई व्यवस्थित रूपमा गाइड गर्ने रिङ']
          ]
        },
        diagramAscii: `(Unit: cm)   [POLE TOP : 0 cm]
   0 ───┬─── 
  10    │
  20 ───┴───  [ 20 cm ]  --->  डिस्ट्रिब्युसन ब्राकेट (Distribution Bracket)
  30    │
  40 ───┼───  [ 40-45cm] --->  स्टे सिट / स्टे वायर (Stay Seat)
  50 ───┴───  [ 50 cm ]  --->  पिन टाइप ब्राकेट / एन्करिङ आई / सस्पेन्सन क्ल्याम्प
  60    │
  70    │
  80    │
  90    │
 100    │
 110 ───┴───  [ 110 cm]  --->  डि. पि. बक्स (D.P. Box 10/20 Pair)
 115 ───┬───  [ 115 cm]  --->  ब्राइडल रिङ (Bridle Ring - वायर गाइड)
        │
(Ground Depth: 1/6th of height - 7m pole = 1.4m, 7.5m = 1.5m, 8m = 1.6m)`
      },
      {
        heading: 'ग्ग्वार्को चोक (Gwarko Chowk) प्राथमिक र सेकेन्डरी फिल्ड सर्भे नक्सा विश्लेषण',
        paragraphs: [
          'नेपाल टेलिकमको क्षेत्रीय सर्भे अनुसार ग्वार्को चोक (Gwarkochok Exchange) बाट दुईवटा मुख्य क्याबिनेटहरू लगनखेल (Cabinet-08) र इमाडोल (Cabinet-09) मा प्राथमिक फिडर केबल (Primary Feeder Cable) लगिएको छ।',
          'Cabinet-08 फिडर: 600x0.5 (250m) -> 200x0.5 (250m) -> 150x0.5 (100m)।',
          'Cabinet-09 फिडर: 300x0.5 (250m) -> 100x0.4 (40m) -> 70x0.4 (30m)।',
          'सेकेन्डरी डिस्ट्रिब्युसन: DP नम्बरिङ क्याबिनेट/डीपी ढाँचामा गरिन्छ (उदा. 08/01, 08/07, 08/09, 08/11, 08/12, 08/20; 09/01, 09/02, 09/06, 09/07, 09/10, 09/11, 09/12, 09/13)।'
        ]
      }
    ]
  },
  {
    id: 'ch12-safety-migration-maintenance',
    chapterNumber: 12,
    titleNepali: 'पेशागत सुरक्षा, नेटवर्क माइग्रेसन र मर्मतसम्भार (Safety, OSH & Network Migration)',
    titleEnglish: 'Occupational Safety, Network Migration & Maintenance',
    category: 'safety-migration',
    readTime: '१५ मिनेट',
    summaryNepali: 'पोल तथा म्यानहोल सुरक्षा (ग्यास टेस्ट, भेन्टिलेसन), हाई भोल्टेज सेपरेसन (Power vs Telecom), नेटवर्क माइग्रेसन (Copper to FTTH, ADSL to GPON, Cutover steps), पिक अप जोइन्ट, र ग्राहक व्यवस्थापन (Customer Handling)।',
    keyPoints: [
      'म्यानहोलमा पस्नु अघि Toxic Gas Test अनिवार्य; बाहिर Standby व्यक्ति र Emergency Lighting अनिवार्य',
      'पावर र टेलिकम केबल बीच सेपरेसन: Low Voltage 230V ≥ 30cm, Distribution 0.5-1m, High Voltage 33/66kV ≥ 2m (Crossing 90°)',
      'Network Migration चरण: Planning -> Installation -> Configuration -> Testing -> Cutover -> Service Verification',
      'पिक अप जोइन्ट (Pick Up Joint): मुख्य केबल नकाटीकनै बीचबाट ग्राहकका लागि ड्रप लाइन निकाल्ने विशेष प्रविधि',
      'फल्ट प्रकार: Open (Line Break), Short (Wire Contact), Earth (Ground Leakage), Cross (Crosstalk), High Resistance'
    ],
    contentSections: [
      {
        heading: 'पिक अप ज्वाइन्ट (Pick Up Joint) र यसको फाइदा',
        paragraphs: [
          'Pick Up Joint टेलिकम ल्यान्डलाइनमा प्रयोग हुने यस्तो विधि हो जहाँ मुख्य कपर केबललाई पूर्ण रूपमा नकाटीकनै मुख्य पेयरबाट आवश्यक सिग्नल लिएर ग्राहक लाइन (Drop Wire) तर्फ वितरण गरिन्छ।',
          'फाइदा: मुख्य केबल काट्न पर्दैन, छिटो र सजिलो जडान, लाइन डिस्टर्बेन्स नहुने, र कम लागतमा ग्राहक विस्तार गर्न सकिन्छ।'
        ],
        diagramAscii: `Main Cable Pair (मुख्य केबल पेयर - नकटिएको)
═════════════════════╤═════════════════════
                     │ [Contact Blade / Gel Connector]
                     ▼
             [Drop Wire to Subscriber] (ग्राहक लाइन)`
      }
    ]
  }
];

// Official CTEVT / NSTB Level-2 Exam Paper (2083 Baishakh Model)
export const level2ExamPaper2083: Level2ExamPaper = {
  id: 'ctevt-nstb-level2-2083',
  examTitleNepali: 'प्राविधिक शिक्षा तथा व्यावसायिक तालीम परिषद् राष्ट्रिय सीप परीक्षण समिति - लिखित परीक्षण (तह-२)',
  examDate: '२०८३ बैशाख',
  fullMarks: 100,
  passMarks: 60,
  timeDuration: '३ घण्टा (विषयगत २ घण्टा + वस्तुगत १ घण्टा)',
  institution: 'परीक्षण केन्द्र: NITVT Pvt. Ltd., बालकुमारी, ललितपुर (सिम्बोल नं: CTEVT-NSTB-L2-2083)',
  objectiveSection: {
    totalMarks: 50,
    instructions: 'सबै ५० वटा बहु-वैकल्पिक प्रश्नहरूको उत्तर दिनुहोस्। प्रत्येक प्रश्नको १ अंक रहनेछ।',
    questions: [
      {
        qNo: 1,
        question: 'पोलको टूप्पाबाट ब्राइडल रिङ्ग (Bridle Ring) कति मूनि कसिन्छ ?',
        options: { A: '१५ से.मी.', B: '२० से.मी.', C: '२५ से.मी.', D: '३० से.मी.' },
        correctOption: 'B',
        explanation: 'नेपाल टेलिकमको मानक पोल मापदण्ड अनुसार पोलको टुप्पा (Top Point) बाट ठीक २० से.मी. मुनि पहिलो ब्राइडल रिङ कसिन्छ।'
      },
      {
        qNo: 2,
        question: 'केबल पोलको टूप्पाबाट कति मूनि राखिन्छ ?',
        options: { A: '४० से.मी.', B: '४५ से.मी.', C: '५० से.मी.', D: '५५ से.मी.' },
        correctOption: 'C',
        explanation: 'पोलको टुप्पाबाट ५० से.मी. मुनि केबल Clamp जडान गरी केबल तानिन्छ।'
      },
      {
        qNo: 3,
        question: '५० पेयरको एरिएल केबलको शिथ ओपनिङ्ग (Sheath Opening) कति हुन्छ ?',
        options: { A: '३० से.मी.', B: '४१ से.मी.', C: '४३ से.मी.', D: '४७ से.मी.' },
        correctOption: 'C',
        explanation: '५० पेयर एरियल केबल जोड्दा ४३ से.मी. बाहिरी शिथ खोलेर स्प्लाइसिङ गरिन्छ।'
      },
      {
        qNo: 4,
        question: 'Ampere Meter (Amp Meter) ले के नापिन्छ ?',
        options: { A: 'क्यापासिटेन्स', B: 'करेन्ट', C: 'रेसिस्टेन्स', D: 'भोल्टेज' },
        correctOption: 'B',
        explanation: 'एम्मिटर/एम्पियर मिटर विद्युतीय परिपथमा बग्ने करेन्ट (Current in Amperes) नाप्न प्रयोग गरिन्छ।'
      },
      {
        qNo: 5,
        question: 'फास्टनर (Fastener) कुन वायरको लागि प्रयोग गरिन्छ ?',
        options: { A: 'जम्पर वायर', B: 'हाउस वायर', C: 'ड्रप वायर', D: 'लाइन वायर' },
        correctOption: 'D',
        explanation: 'लाइन वायर/ड्रप वायरलाई घरको भित्ता वा पोलमा ओभरहेड बाँध्न फास्टनर प्रयोग गरिन्छ।'
      },
      {
        qNo: 6,
        question: '४० मिटरको केबल स्पान (Cable Span) मा कतिपटक टूइष्ट (Twist) गरिन्छ ?',
        options: { A: '२ पटक', B: '३ पटक', C: '४ पटक', D: '५ पटक' },
        correctOption: 'B',
        explanation: 'हावाको झोंकाबाट जोगिन र कम्पन रोक्न ४० मिटर स्पानमा केबललाई ३ पटक Twist (ऐंठन) गरिन्छ।'
      },
      {
        qNo: 7,
        question: 'Bridle Ring कुन वायरको लागि प्रयोग हुन्छ ?',
        options: { A: 'ग्रुप वायर', B: 'हाउस वायर', C: 'जम्पर वायर', D: 'ड्रप वायर / लाइन वायर' },
        correctOption: 'D',
        explanation: 'ब्राइडल रिङ पोलमा डीपी बक्समुनि ड्रप वायर/लाइन वायरलाई व्यवस्थित तरिकाले छिराउन प्रयोग गरिन्छ।'
      },
      {
        qNo: 8,
        question: 'पोलमा भर्याङ्ग (Ladder) कति डिग्रिको कोणमा राख्नुपर्दछ ?',
        options: { A: '४५°', B: '६०°', C: '७५°', D: '८०°' },
        correctOption: 'C',
        explanation: 'सुरक्षित रूपमा पोल चढ्न भर्याङलाई जमिनसँग ७५° (75 Degree) कोणमा तेस्र्याउनुपर्छ।'
      },
      {
        qNo: 9,
        question: 'ड्रप वायर जोइन्ट (Drop Wire Joint) मा कुन कनेक्टर प्रयोग गरिन्छ ?',
        options: { A: 'Modular Connector', B: 'UY Connector', C: 'UPW Connector', D: 'WR Connector' },
        correctOption: 'B',
        explanation: '३M Scotchlok UY2 कनेक्टर २-तार ड्रप वायर जोड्न चिस्यानरोधी (Gel-filled) जोइन्टमा प्रयोग गरिन्छ।'
      },
      {
        qNo: 10,
        question: 'टेलिफोन सेटमा डायल टोन (Dial Tone) आउँदा लाइन भोल्टेज कति हुन्छ ?',
        options: { A: '-३० V DC', B: '+३० V DC', C: '-४८ V DC', D: '+४८ V DC' },
        correctOption: 'C',
        explanation: 'अन-हुक (On-Hook / Idle) स्थितिमा एक्सचेन्जबाट सामान्यतया -४८ V DC आउँछ।'
      },
      {
        qNo: 11,
        question: 'प्राइमरी पेयर (Primary Pair) को नम्बरिङ कति डिजिटको हुन्छ ?',
        options: { A: '३ डिजिट', B: '४ डिजिट', C: '५ डिजिट', D: '६ डिजिट' },
        correctOption: 'C',
        explanation: 'नेपाल टेलिकम रेकर्ड अनुसार प्राइमरी पेयर ५ डिजिटको मानक कोडमा दर्ता हुन्छ।'
      },
      {
        qNo: 12,
        question: 'टेलिफोन स्विच (MSAN) मा मुख्यतया कतिवटा अप्टिकल फाइबर जोडिन्छ ?',
        options: { A: '२ वटा', B: '४ वटा', C: '६ वटा', D: '८ वटा' },
        correctOption: 'A',
        explanation: 'MSAN रिडन्डन्सी (Tx र Rx Upstream/Downstream) को लागि २ वटा कोर फाइबर लिङ्कमा जोडिन्छ।'
      },
      {
        qNo: 13,
        question: 'FAP (FTTH Splitter Point) नेटवर्कमा ग्राहकका लागि कतिवटा फाइबर कोर जोडिन्छ ?',
        options: { A: '१ कोर', B: '२ कोर', C: '३ कोर', D: '४ कोर' },
        correctOption: 'A',
        explanation: 'GPON FTTH मा सिंगल कोर (Single Strand BiDi Fiber) बाटै Tx र Rx डाटाहरू १३१०nm/१४९०nm मा चल्छन्।'
      },
      {
        qNo: 14,
        question: 'परिपथमा बग्ने विद्युतीय करेन्ट नाप्ने मिटर कुन हो ?',
        options: { A: 'Ampere Meter', B: 'Capacitance Meter', C: 'Megger', D: 'Volt Meter' },
        correctOption: 'A',
        explanation: 'एम्पियर मिटरले परिपथमा बग्ने करेन्ट नाप्छ।'
      },
      {
        qNo: 15,
        question: 'केनिष्टर (Canister) कुन क्लोजरमा प्रयोग गरिन्छ ?',
        options: { A: 'अप्टीकल क्लोजर (Optical Joint Closure)', B: 'अण्डर ग्राउण्ड क्लोजर', C: 'डक्ट क्लोजर', D: 'एरिएल क्लोजर' },
        correctOption: 'A',
        explanation: 'अप्टिकल जोइन्ट क्लोजर (OJC) भित्र फाइबर कोरहरू जोडेपछि हिट श्रिङ्केबल केनिष्टर/स्लिभ प्रयोग गरिन्छ।'
      },
      {
        qNo: 16,
        question: '३०० पेयरको अण्डर ग्राउण्ड केबलको शिथ ओपनिङ्ग कति हुन्छ ?',
        options: { A: '४५ से.मी.', B: '४६ से.मी.', C: '४७ से.मी.', D: '४८ से.मी.' },
        correctOption: 'C',
        explanation: '३०० पेयरको भूमिगत (UG) केबल जोड्दा ४७ से.मी. बाहिरी शिथ खोलेर स्प्लाइसिङ गरिन्छ।'
      },
      {
        qNo: 17,
        question: 'एम डि एफ (MDF) को लाइन/प्राइमरी साइडमा कुन केबल प्रयोग गरिन्छ ?',
        options: { A: 'अण्डरग्राउण्ड फिडर केबल', B: 'अप्टीकल केबल', C: 'ड्रप केबल', D: 'स्विचबोर्ड केबल' },
        correctOption: 'A',
        explanation: 'MDF को D-Side मा बाहिर फिल्डमा जाने भूमिगत फिडर (Underground Cable) जोडिएको हुन्छ।'
      },
      {
        qNo: 18,
        question: 'प्राइमरी केबलका २५ पेयर एकसाथ जोड्न कुन कनेक्टर प्रयोग गरिन्छ ?',
        options: { A: 'Modular Connector (25-pair)', B: 'UPW Connector', C: 'UY Connector', D: 'WR Connector' },
        correctOption: 'A',
        explanation: 'प्राइमरी र सेकेन्डरी कपर केबलका २५ पेयर एकैचोटि हाइड्रोलिक क्रिम्परले मोड्युलर कनेक्टरमा जोडिन्छ।'
      },
      {
        qNo: 19,
        question: '१५० पेयरको केबलमा ७५ पेयर कुन सुपर ग्रुपको कुन युनिट ग्रुप वाइन्डरमा पर्छ ?',
        options: { A: 'निलो + सुन्तला', B: 'सुन्तला + निलो', C: 'हरियो + हरियो', D: 'हरियो + खैरो' },
        correctOption: 'D',
        explanation: '१५० पेयरमा ७५औँ पेयर ३rd ५०-पेयर सुपरग्रुप (हरियो) को तेस्रो २५-पेयर युनिट (खैरो वाइन्डर) भित्र पर्छ।'
      },
      {
        qNo: 20,
        question: 'स्लाइसमा दुईवटा तार टुइष्ट गरेपछि कनेक्टर लगाउन कतिमा काट्नुपर्छ ?',
        options: { A: '१ से.मी.', B: '२ से.मी.', C: '३ से.मी.', D: '४ से.मी.' },
        correctOption: 'A',
        explanation: 'UY कनेक्टर हाल्नु अघि नाङ्गो तार १ से.मी. (1 cm) मा कट गरी बराबर पारेर थिच्नुपर्छ।'
      },
      {
        qNo: 21,
        question: 'साधारण माटोमा पोल गाड्दा पोलको कुल लम्बाइको कति भाग जमिनमुनि गाडिन्छ ?',
        options: { A: '१/४ भाग', B: '१/५ भाग', C: '१/६ भाग', D: '१/७ भाग' },
        correctOption: 'B',
        explanation: 'मानक पोल मापदण्ड अनुसार पोलको कुल लम्बाइको १/५ (1/5th) भाग (उदा. ८ मिटर पोलको १.६ मिटर) गाडिन्छ।'
      },
      {
        qNo: 22,
        question: '१० पेयरको केबलमा ५ औं पेयर कुन रङको हुन्छ ?',
        options: { A: 'सेतो + निलो', B: 'सेतो + हरियो', C: 'रातो + निलो', D: 'रातो + हरियो' },
        correctOption: 'B',
        explanation: '२५-पेयर कलर कोड अनुसार: १=सेतो/निलो, २=सेतो/सुन्तला, ३=सेतो/हरियो (वा ५ औं पेयर = सेतो/हरियो)।'
      },
      {
        qNo: 23,
        question: 'केबलमा स्प्लिट (Split Pair Fault) भयो भने टेलिफोनमा के असर देखिन्छ ?',
        options: { A: 'डायल टोन आउँदैन', B: 'क्रस टक (Cross Talk) र नोइज आउँछ', C: 'घण्टी बज्दैन', D: 'लाइन बिजी आउँछ' },
        correctOption: 'B',
        explanation: 'दोहोरो पेयर आपसमा मिसिँदा (Split Pair) इन्डक्सनले गर्दा आवाजमा घारघुर (Noisy) र क्रस-टक उत्पन्न हुन्छ।'
      },
      {
        qNo: 24,
        question: 'वेब पेज लोड गर्न प्रयोग गरिने प्रोटोकल कुन हो ?',
        options: { A: 'HTTP / HTTPS', B: 'DHCP', C: 'DNS', D: 'POP3' },
        correctOption: 'A',
        explanation: 'HyperText Transfer Protocol (HTTP/HTTPS) वेब सर्भरबाट ब्राउजरमा डाटा ल्याउने मुख्य प्रोटोकल हो।'
      },
      {
        qNo: 25,
        question: 'इन्टरनेट भनेको के हो ?',
        options: { A: 'Single Network', B: 'Vast collection of different global networks', C: 'Local LAN connection', D: 'Printer Connection' },
        correctOption: 'B',
        explanation: 'इन्टरनेट भनेको विश्वभरका करोडौँ कम्प्युटर र स्वायत्त नेटवर्कहरूको सञ्जाल (Network of Networks) हो।'
      },
      {
        qNo: 26,
        question: 'पोलको फेदको व्यास ४० से.मी. छ भने खाल्टो खन्ने व्यास (Hole Diameter) कति हुनुपर्छ ?',
        options: { A: '५० से.मी.', B: '६० से.मी.', C: '७० से.मी.', D: '८० से.मी.' },
        correctOption: 'C',
        explanation: 'रामिङ र सोलिङ ग्यापका लागि खाल्टोको व्यास पोलको फेदभन्दा ३० से.मी. बढी (४० + ३० = ७० से.मी.) हुनुपर्छ।'
      },
      {
        qNo: 27,
        question: '०.४ एम एम कपर केबलमा १५०० मिटर दूरीमा सर्ट (Short) भएको छ भने लुप रेजिस्टेन्स कति हुन्छ ?',
        options: { A: '२७० ओहम', B: '३०० ओहम', C: '३६० ओहम', D: '३७० ओहम' },
        correctOption: 'A',
        explanation: '०.४mm केबलको १ किमी लुप रेजिस्टेन्स २७० Ω/किमी हुन्छ। १.५ किमी (जाने-आउने ३ किमी तार) = २७० ओहम मान।'
      },
      {
        qNo: 28,
        question: 'क्याबिनेटबाट क्यापासिटेन्स मिटरले टेस्ट गर्दा 5 nF (न्यानोफ्याराड) आयो भने फल्ट कति दूरीमा छ ?',
        options: { A: '५०० मिटर', B: '७०० मिटर', C: '१००० मिटर', D: '१५०० मिटर' },
        correctOption: 'B',
        explanation: 'सामान्य केबलको क्यापासिटेन्स ५० nF/km हुन्छ। ५ nF क्यापासिटेन्सले करिब ७०० मिटर (वा १००m = ५nF) खुल्छ।'
      },
      {
        qNo: 29,
        question: '०.४ एम एम कपर केबलमा ५ किलोमिटर तार तान्दा सिग्नलमा कति dB एटेनुएसन (Loss) हुन्छ ?',
        options: { A: '७ dB', B: '९ dB', C: '१० dB', D: '११ dB' },
        correctOption: 'C',
        explanation: '०.४mm कपरमा १ kHz मा एटेनुएसन करिब २ dB/km हुन्छ। ५ किमी x २ dB = १० dB Signal Loss हुन्छ।'
      },
      {
        qNo: 30,
        question: 'ड्रपवायर सर्ट फल्टमा मिटरले नाप्दा २९ ओहम आयो भने फल्ट कति मिटर दूरीमा छ ?',
        options: { A: '४०० मिटर', B: '४५० मिटर', C: '५०० मिटर', D: '६०० मिटर' },
        correctOption: 'C',
        explanation: 'ड्रपवायरको प्रति १००m लुप रेजिस्टेन्स करिब ५.८ Ω हुन्छ। २९ Ω ÷ ५.८ = ५०० मिटर दूरीमा फल्ट छ।'
      },
      {
        qNo: 31,
        question: 'OTDR (Optical Time Domain Reflectometer) ले अप्टिकल फाइबरमा कुन कुन परीक्षण गर्दछ ?',
        options: { A: 'फाइबर लम्बाइ र फल्ट स्थान', B: 'स्प्लाइस लस र एटेनुएसन', C: 'कनेक्टर र रिफ्लेक्टेन्स लस', D: 'माथिका सबै' },
        correctOption: 'D',
        explanation: 'OTDR ले फाइबरको कुल दुरी, ब्रेक फल्ट स्थान, स्प्लाइस लस र बेन्ड लस सबै नाप्छ।'
      },
      {
        qNo: 32,
        question: 'Fiber Cleaver ले फाइबरलाई कति डिग्री कोणमा समतल काट्नुपर्छ ?',
        options: { A: '४५°', B: '६०°', C: '९०°', D: '१८०°' },
        correctOption: 'C',
        explanation: 'फ्युजन स्प्लाइसिङ गर्नुअघि फाइबर क्लिभरले फाइबरलाई ठीक ९०° समतल कोणमा काट्नुपर्छ।'
      },
      {
        qNo: 33,
        question: 'MSAN (Multi-Service Access Node) को मुख्य काम के हो ?',
        options: { A: 'भ्वाइस, ADSL र FTTH लाई एउटै एक्सेस नोडमा समेट्नु', B: 'केवल रेडियो तरंग फाल्नु', C: 'ब्याट्री चार्ज गर्नु', D: 'पोल गाड्नु' },
        correctOption: 'A',
        explanation: 'MSAN ले परम्परागत टेलिफोन भ्वाइस र ब्रॉडब्यान्ड इन्टरनेट दुवैलाई एउटै डिजिटल फाइबर नोडबाट उपलब्ध गराउँछ।'
      },
      {
        qNo: 34,
        question: 'MCB मा ओभरलोड हुँदा कुन धातु तातेर बाङ्गिन्छ ?',
        options: { A: 'Copper Strip', B: 'Bimetal Strip', C: 'Aluminium Rod', D: 'Iron Plate' },
        correctOption: 'B',
        explanation: 'ओभरलोड हुँदा बाइमेटालिक स्ट्रिप (Bimetal Strip) तातेर बाङ्गिन्छ र Trip मेकानिजम सक्रिय गराउँछ।'
      },
      {
        qNo: 35,
        question: 'DC Clamp Meter प्रयोग गरी के नापिन्छ ?',
        options: { A: 'ब्याट्री बैंकको AC Voltage', B: 'तार नकाटी DC Current', C: 'Fiber Loss', D: 'Resistance' },
        correctOption: 'B',
        explanation: 'क्लेम्प मिटरले तारलाई नकाटिकन वा सर्किट नखोलिकन हल इफेक्ट (Hall Effect) मार्फत DC करेन्ट नाप्छ।'
      },
      {
        qNo: 36,
        question: '4 Core Optical Fiber Cable मा दोस्रो कोरको रङ कुन हुन्छ ?',
        options: { A: 'निलो (Blue)', B: 'सुन्तला (Orange)', C: 'हरियो (Green)', D: 'खैरो (Brown)' },
        correctOption: 'B',
        explanation: 'मानक फाइबर कलर कोड: १=निलो, २=सुन्तला, ३=हरियो, ४=खैरो।'
      },
      {
        qNo: 37,
        question: '12 Core Optical Fiber Cable मा पहिलो र बाह्रौ कोरका रङ क्रमशः के के हुन् ?',
        options: { A: 'निलो र Aqua (फिका निलो)', B: 'सुन्तला र सेतो', C: 'हरियो र पहेँलो', D: 'गुलाबी र रातो' },
        correctOption: 'A',
        explanation: '१२ कोर फाइबरमा १st = Blue (निलो) र १२th = Aqua (फिका निलो) हुन्छ।'
      },
      {
        qNo: 38,
        question: 'टेलिफोन केबल र पावर केबल बीच कम्तीमा कति से.मी. दूरी (Separation) हुनुपर्छ ?',
        options: { A: '१० से.मी.', B: '२० से.मी.', C: '३० से.मी.', D: '५० से.मी.' },
        correctOption: 'C',
        explanation: 'इन्डक्सन र विद्युत सुरक्षाका लागि कम भोल्टेज पावर केबल र टेलिकम केबल बीच कम्तीमा ३० से.मी. अन्तर हुनुपर्छ।'
      },
      {
        qNo: 39,
        question: 'High voltage (33kV/66kV) विद्युत लाइनभन्दा टेलिकम केबल कति मिटर मुनि हुनुपर्छ ?',
        options: { A: '०.५ मिटर', B: '१.० मिटर', C: '१.५ मिटर', D: '२.० मिटर' },
        correctOption: 'D',
        explanation: 'उच्च भोल्टेज प्रसारण लाइन मुनि क्रसिङ गर्दा कम्तीमा २ मिटरको सुरक्षित दूरी कायम राख्नुपर्छ।'
      },
      {
        qNo: 40,
        question: 'DSP Meter ले कपर केबलमा के मुख्य परीक्षण गर्छ ?',
        options: { A: 'Insulation Resistance (IR Test) र Line Faults', B: 'Audio Frequency', C: 'Light Speed', D: 'Battery Ah' },
        correctOption: 'A',
        explanation: 'DSP Meter (Digital Subscriber Pair Tester) ले कपर तारको Insulation Resistance, Loop Resistance र Faults नाप्छ।'
      },
      {
        qNo: 41,
        question: 'पिक-अप ज्वाइन्ट (Pick-Up Joint) भनेको के हो ?',
        options: { A: 'मुख्य केबल पुरा नकाटीकन बीचबाट ब्रान्च केबल निकाल्ने ज्वाइन्ट', B: 'फाइबर कट गर्ने', C: 'पोल गाड्ने', D: 'ब्याट्री चार्ज गर्ने' },
        correctOption: 'A',
        explanation: 'रनिङ फिडर केबललाई बीचबाट काटेर अर्को ब्रान्च तर्फ पेयर लैजाने प्रक्रिया पिक-अप ज्वाइन्ट हो।'
      },
      {
        qNo: 42,
        question: 'सर्किटमा Fuse र Surge Arrestor कसरी जडान गरिन्छ ?',
        options: { A: 'Fuse Parallel मा र Arrestor Series मा', B: 'Fuse Series मा र Arrestor Parallel मा', C: 'दुवै Parallel मा', D: 'दुवै Series मा' },
        correctOption: 'B',
        explanation: 'फ्युजलाई लाइनको सिरिज (Series) मा र एरेस्टरलाई लाइन र अर्थ बीच प्यारालेल (Parallel) मा जोडिन्छ।'
      },
      {
        qNo: 43,
        question: 'Earth Resistance केन्द्रीय एक्सचेन्ज (Exchange Building) मा कति ओहम भन्दा कम हुनुपर्छ ?',
        options: { A: '१ ओहम (1 Ω) भन्दा कम', B: '५ ओहम', C: '१० ओहम', D: '२० ओहम' },
        correctOption: 'A',
        explanation: 'टेलिकम एक्सचेन्जमा संवेदनशील उपकरणका लागि अर्थिङ रेजिस्टेन्स १ ओहमभन्दा कम हुनुपर्छ।'
      },
      {
        qNo: 44,
        question: 'Earth Resistance सेकेन्डरी नेटवर्क वा क्याबिनेटमा कति ओहम भन्दा कम हुनुपर्छ ?',
        options: { A: '१ ओहम', B: '५ ओहम', C: '१० ओहम (10 Ω) भन्दा कम', D: '५० ओहम' },
        correctOption: 'C',
        explanation: 'फिल्ड क्याबिनेट र सेकेन्डरी नेटवर्कका लागि १० ओहमभन्दा कम अर्थिङ हुनुपर्छ।'
      },
      {
        qNo: 45,
        question: 'Test lamp method मा १०० वाटको बल्ब Phase र Earthing मा जोड्दा चम्किलो बलेमा के बुझिन्छ ?',
        options: { A: 'अर्थिङ नराम्रो छ', B: 'अर्थिङ अति उत्तम (राम्रो) छ', C: 'ब्याट्री बिग्रियो', D: 'केबल सर्ट छ' },
        correctOption: 'B',
        explanation: 'बल्ब पूर्ण रूपमा चम्किलो बल्नुको अर्थ अर्थिङको रेजिस्टेन्स एकदमै कम छ र करेन्ट निर्बाध बगेको छ।'
      },
      {
        qNo: 46,
        question: 'ADSS केबल र OPGW केबल बीच मुख्य फरक के हो ?',
        options: { A: 'ADSS नन-कन्डक्टिभ हो भने OPGW अर्थ वायरयुक्त धातु केबल हो', B: 'ADSS मा फाइबर हुँदैन', C: 'OPGW केवल कपर तार हो', D: 'केही पनि फरक छैन' },
        correctOption: 'A',
        explanation: 'ADSS मा धातु हुँदैन (Non-metallic); OPGW मा उच्च भोल्टेज टावरमा अर्थिङ गर्न बाहिरी भागमा धातु हुन्छ।'
      },
      {
        qNo: 47,
        question: '4-Core Optical Fiber Splicing गर्दा ग्लास कोर सफा गर्न प्रयोग गरिने शुद्ध रसायन कुन हो ?',
        options: { A: 'पानी (Water)', B: 'मट्टितेल (Kerosene)', C: '९९% शुद्ध Isopropyl Alcohol (IPA)', D: 'एसिटोन (Acetone)' },
        correctOption: 'C',
        explanation: 'फाइबर कोरको कोटिङ हटाएपछि धुलो र चिल्लो हटाउन ९९% Isopropyl Alcohol (IPA) र Lint-free tissue प्रयोग गरिन्छ।'
      },
      {
        qNo: 48,
        question: 'Transformer ले कुन विद्युतीय सिद्धान्तमा काम गर्छ ?',
        options: { A: 'Mutual Induction (पारस्परिक प्रेरणा)', B: 'Self Friction', C: 'Solar Energy', D: 'Chemical Fusion' },
        correctOption: 'A',
        explanation: 'प्राइमरी वाइन्डिङको चुम्बकीय फ्लक्सले सेकेन्डरी वाइन्डिङमा भोल्टेज उत्पन्न गराउने (Mutual Induction) सिद्धान्तमा काम गर्छ।'
      },
      {
        qNo: 49,
        question: 'MDF र Cabinet बीचको मुख्य फरक के हो ?',
        options: { A: 'MDF एक्सचेन्जभित्र हुन्छ, Cabinet सडक छेउमा हुन्छ', B: 'Cabinet एक्सचेन्जभित्र हुन्छ', C: 'MDF सडक छेउमा हुन्छ', D: 'दुवै एउटै हो' },
        correctOption: 'A',
        explanation: 'MDF केन्द्रीय एक्सचेन्ज भवनमा हजारौँ लाइन जोड्ने मुख्य स्थान हो भने क्याबिनेट फिल्डको वितरण बिन्दु हो।'
      },
      {
        qNo: 50,
        question: 'गुणात्मक केबल स्प्लाइस (Cable Splice) मा हुनुपर्ने मुख्य विशेषता कुन हो ?',
        options: { A: 'उच्च रेजिस्टेन्स', B: 'मेकानिकली मजबुत, न्यूनतम लस, कम रेजिस्टेन्स र वाटरप्रूफ (चिस्यानमुक्त)', C: 'बढी लस', D: 'खुकुलो जोड' },
        correctOption: 'B',
        explanation: 'राम्रो स्प्लाइस बलियो, पानी नछिर्ने, कम्तीमा सिग्नल लस हुने र विद्युतीय रूपमा स्थिर हुनुपर्छ।'
      }
    ]
  },

  // CTEVT Matching Tests (Page 3 of official paper)
  matchingSection: [
    {
      groupTitle: 'समूह (क): उपकरण र तिनका मुख्य प्राविधिक काम (Matching Test Group 1)',
      columnA: [
        { qNo: 1, premise: 'DSP Meter', correctAns: 'ग' },
        { qNo: 2, premise: 'OTDR', correctAns: 'घ' },
        { qNo: 3, premise: 'Fusion Splicer', correctAns: 'क' },
        { qNo: 4, premise: 'Megger (Insulation Tester)', correctAns: 'ख' }
      ],
      columnB: [
        { code: 'क', response: 'फाइबर कोरहरूलाई पगालेर स्थायी रूपमा जोड्ने मेसिन' },
        { code: 'ख', response: 'उच्च भोल्टेजमा केबलको इन्सुलेशन रेजिस्टेन्स नाप्ने' },
        { code: 'ग', response: 'कपर तारको लुप रेजिस्टेन्स र क्यापासिटेन्स नाप्ने' },
        { code: 'घ', response: 'फाइबरको लम्बाइ, एटेनुएसन र फल्ट दुरी नाप्ने' }
      ]
    },
    {
      groupTitle: 'समूह (ख): टेलिकम मापदण्ड र मानक नाप (Matching Test Group 2)',
      columnA: [
        { qNo: 1, premise: 'पोलको टुप्पाबाट ब्राइडल रिङ', correctAns: 'ख' },
        { qNo: 2, premise: 'पोलको टुप्पाबाट केबल क्ल्याम्प', correctAns: 'क' },
        { qNo: 3, premise: '५० पेयर एरियल केबल शिथ ओपनिङ', correctAns: 'घ' },
        { qNo: 4, premise: '३०० पेयर युजी केबल शिथ ओपनिङ', correctAns: 'ग' }
      ],
      columnB: [
        { code: 'क', response: '५० से.मी. (50 cm)' },
        { code: 'ख', response: '२० से.मी. (20 cm)' },
        { code: 'ग', response: '४७ से.मी. (47 cm)' },
        { code: 'घ', response: '४३ से.मी. (43 cm)' }
      ]
    },
    {
      groupTitle: 'समूह (ग): केबल र रङ कोड (Matching Test Group 3)',
      columnA: [
        { qNo: 1, premise: '४ Core Fiber को २nd Core', correctAns: 'ख' },
        { qNo: 2, premise: '२५ Pair Cable को ५th Pair', correctAns: 'क' },
        { qNo: 3, premise: '१२ Core Fiber को १२th Core', correctAns: 'घ' },
        { qNo: 4, premise: 'High Voltage Transmission Line Top Wire', correctAns: 'ग' }
      ],
      columnB: [
        { code: 'क', response: 'सेतो + हरियो (White / Green)' },
        { code: 'ख', response: 'सुन्तला (Orange)' },
        { code: 'ग', response: 'OPGW (Optical Ground Wire)' },
        { code: 'घ', response: 'Aqua (फिका निलो)' }
      ]
    },
    {
      groupTitle: 'समूह (घ): अर्थिङ र विद्युत सुरक्षा (Matching Test Group 4)',
      columnA: [
        { qNo: 1, premise: 'Exchange Building Earth Resistance', correctAns: 'ख' },
        { qNo: 2, premise: 'Secondary Network / Cabinet Earth Resistance', correctAns: 'क' },
        { qNo: 3, premise: 'MCB Protection Mechanism', correctAns: 'घ' },
        { qNo: 4, premise: 'Surge Arrestor Connection', correctAns: 'ग' }
      ],
      columnB: [
        { code: 'क', response: '१० ओहम (10 Ω) भन्दा कम' },
        { code: 'ख', response: '१ ओहम (1 Ω) भन्दा कम' },
        { code: 'ग', response: 'लाइन र अर्थको बीचमा प्यारालेल (Parallel)' },
        { code: 'घ', response: 'Bimetal Strip तातेर ओभरलोडमा ट्रिप हुने' }
      ]
    }
  ],

  // Spotting Items (Pages 13, 18, 21 of official PDF)
  spottingSection: [
    { id: 1, item: 'UY2 Scotchlok Connector', usedFor: '२-तार कपर/ड्रप वायर जोड्न चिस्यानरोधी जल-युक्त कनेक्टर', time: '२ मिनेट' },
    { id: 2, item: 'Bridle Ring', usedFor: 'पोलमा डीपी बक्स मुनि ड्रप वायरलाई safely गाइड गर्न', time: '२ मिनेट' },
    { id: 3, item: 'Fiber Cleaver', usedFor: 'फाइबर स्प्लाइसिङ गर्नुअघि कोरलाई ९०° समतल कोणमा काट्न', time: '२ मिनेट' },
    { id: 4, item: 'Fusion Splicing Machine', usedFor: 'फाइबर कोरलाई इलेक्ट्रिक आर्कबाट पगालेर स्थायी जोड्न', time: '२ मिनेट' },
    { id: 5, item: 'DSP Meter (Pair Tester)', usedFor: 'कपर तारको इन्सुलेशन, लुप रेजिस्टेन्स र फल्ट दुरी नाप्न', time: '२ मिनेट' },
    { id: 6, item: 'OTDR (Optical Reflectometer)', usedFor: 'फाइबरको कुल लम्बाइ, कट फल्ट दुरी र सिग्नल लस नाप्न', time: '२ मिनेट' },
    { id: 7, item: 'Optical Joint Closure (OJC)', usedFor: 'बाहिरी फाइबर केबल स्प्लाइसिङ गरिसकेपछि वाटरप्रूफ सुरक्षा दिन', time: '२ मिनेट' },
    { id: 8, item: '25-Pair Modular Connector', usedFor: 'प्राइमरी कपर केबलका २५ पेयर एकैचोटि क्रिम्प गरी जोड्न', time: '२ मिनेट' },
    { id: 9, item: 'DP Box (Distribution Point)', usedFor: 'सेकेन्डरी केबलबाट ग्राहकको घरमा ड्रप वायर बाँड्न', time: '२ मिनेट' },
    { id: 10, item: 'Miniature Circuit Breaker (MCB)', usedFor: 'पावर परिपथलाई ओभरलोड र सर्ट सर्किटबाट जोगाउन', time: '२ मिनेट' },
    { id: 11, item: 'Surge Arrestor / Lightning Arrestor', usedFor: 'आकाशीय चट्याङ र हाई भोल्टेजलाई जमिनमा डिस्चार्ज गर्न', time: '२ मिनेट' },
    { id: 12, item: 'Digital Multimeter', usedFor: 'AC/DC भोल्टेज, करेन्ट र रेजिस्टेन्स नाप्न', time: '२ मिनेट' },
    { id: 13, item: 'Earth Resistance Tester (Megger)', usedFor: 'अर्थिङ इलेक्ट्रोडको प्रतिरोधात्मक क्षमता (Resistance in Ohms) नाप्न', time: '२ मिनेट' },
    { id: 14, item: 'Visual Fault Locator (VFL Red Light)', usedFor: 'फाइबरमा बेन्ड वा ब्रेक भएको ठाउँ रातो लेजर लाइटबाट हेर्न', time: '२ मिनेट' },
    { id: 15, item: 'Drop Wire Tension Clamp', usedFor: 'ड्रप वायरलाई पोल वा घरको भित्तामा कडासँग च्यापेर ताङ्न', time: '२ मिनेट' },
    { id: 16, item: 'Optical Power Meter (OPM)', usedFor: 'FTTH / FAP मा प्रकाशको सिग्नल पावर (dBm) नाप्न', time: '२ मिनेट' }
  ],

  // Practical Assignments (Pages 16, 19, 22 of official PDF)
  practicalAssignments: [
    {
      qNo: 1,
      taskTitle: 'प्रयोगात्मक कार्य १: ४ Core Optical Fiber Cable Splicing र OJC Packing',
      durationMinutes: 45,
      description: 'परीक्षार्थीले उपलब्ध गराइएको ४ कोर फाइबर केबललाई Stripper, Cleaver र Fusion Splicer को प्रयोग गरी स्प्लाइस गरी Splice Tray मा व्यवस्थित राखी ओप्टिकल जोइन्ट क्लोजर (OJC) मा बन्द गर्नुपर्नेछ (Loss < 0.05 dB)।'
    },
    {
      qNo: 2,
      taskTitle: 'प्रयोगात्मक कार्य २: Distribution Point (DP Box) Cable Termination & Jumpering',
      durationMinutes: 30,
      description: '१०/२० पेयर कपर केबललाई DP Box को टर्मिनलमा Punch Down Tool प्रयोग गरी क्रोन ब्लकमा टर्मिनेट गर्ने र UY कनेक्टर प्रयोग गरी ड्रप वायर जोडाई लाइन डायल टोन टेस्ट गर्ने।'
    },
    {
      qNo: 3,
      taskTitle: 'प्रयोगात्मक कार्य ३: Earth Resistance Measurement & Solar Power System Wiring',
      durationMinutes: 45,
      description: 'Earth Resistance Tester प्रयोग गरी ३-पोइन्ट विधिबाट जमिनको अर्थिङ रेजिस्टेन्स (< 10 Ω) नाप्ने र सोलार प्यानल, चार्ज कन्ट्रोलर, ब्याट्री तथा DC लोडको सही वायरिङ जडान गर्ने।'
    }
  ],

  // 19 Detailed Subjective Questions (Pages 4, 5, 6, 7, 9, 10, 11, 12 of PDF)
  subjectiveSection: {
    totalMarks: 50,
    instructions: 'कुनै १० वटा प्रश्नहरूको उत्तर दिनुहोस्। सबै प्रश्नहरूको समान ५ अंक रहनेछ (१० x ५ = ५० अंक)।',
    questions: [
      {
        qNo: 1,
        marks: 5,
        question: 'पोलमा केबल तान्न (Overhead Line Construction) के के सुरक्षाका नियमहरू पालना गर्नुपर्छ ?',
        modelAnswer: 'पोलमा केबल तान्ने कार्य उच्च जोखिमयुक्त हुने भएकाले व्यक्तिगत सुरक्षा उपकरण (PPE) र प्राविधिक मापदण्डको पूर्ण पालना गर्नुपर्छ।',
        bulletPoints: [
          'व्यक्तिगत सुरक्षा उपकरण (PPE): हेल्मेट, सेफ्टी बेल्ट, गमबुट र Leather Gloves अनिवार्य प्रयोग गर्ने।',
          'भर्याङ सुरक्षा: भर्याङलाई पोलसँग ७५° (75 Degree) कोणमा तेस्र्याउने र तल एक जना सहयोगीले समात्ने।',
          'विद्युतीय दूरी (Clearance): ३३kV/६६kV पावर लाइनभन्दा कम्तीमा २ मिटर मुनि र लो भोल्टेज विद्युत तारभन्दा कम्तीमा ३० से.मी. मुनि केबल तान्ने।',
          'मौसम तथा ट्राफिक: हावाहुरी, वर्षा र चट्याङ परेको बेला पोल नचढ्ने। सडक छेउमा काम गर्दा ट्राफिक कोन र Warning Sign राख्ने।',
          'उपकरण परीक्षण: पोल चढ्नुअघि पोल मक्किइ/भाँचिएको छ कि छैन र स्टे वायर बलियो छ कि छैन भनी जाँच गर्ने।'
        ]
      },
      {
        qNo: 2,
        marks: 5,
        question: 'Earthing (अर्थिङ) टेष्ट गर्ने प्रमुख तरिकाहरू (Three-Point Method र Test Lamp Method) स्पष्ट पार्नुहोस्।',
        modelAnswer: 'अर्थिङ इलेक्ट्रोडको प्रतिरोधात्मक क्षमता मापन गर्न र यसको प्रभावकारिता जाँच्न दुई मुख्य विधिहरू प्रयोग गरिन्छ।',
        bulletPoints: [
          '१. Three-Point Method (Earth Tester / Megger): मुख्य अर्थ इलेक्ट्रोड (E) बाट निश्चित दुरी (उदा. ५m र १०m) मा दुईवटा स्पाइक रड (P - Potential & C - Current) ठोकिन्छ। अर्थ टेष्टरबाट AC करेन्ट पठाएर सोझै अर्थ रेजिस्टेन्स (Ohms) मापन गरिन्छ।',
          '२. Test Lamp Method (व्यावहारिक जाँच): १०० वाटको filament बल्बलाई Phase (लाइभ) र Earth तारको बीचमा जोडिन्छ। यदि बल्ब पूर्ण रूपमा चम्किलो बल्छ भने अर्थिङ राम्रो छ; धमिलो बलेमा वा नबलेमा अर्थिङ खराब/खुला छ भन्ने बुझिन्छ।',
          'मापदण्ड: एक्सचेन्जमा < १ Ω र क्याबिनेट/पोलमा < १० Ω हुनुपर्छ।'
        ]
      },
      {
        qNo: 3,
        marks: 5,
        question: 'पिक-अप ज्वाइन्ट (Pick-Up Joint) भनेको के हो ? यसको सचित्र वर्णन र प्रयोगबारे लेख्नुहोस्।',
        modelAnswer: 'रनिङ फिडर केबल (Main Running Cable) लाई बीचमा नकाटीकन बाहिरको शिथ खोलेर आवश्यक पेयरहरूलाई ट्यापिङ गरी ब्रान्च केबलतर्फ लैजाने प्रक्रियालाई Pick-Up Joint भनिन्छ।',
        bulletPoints: [
          'प्रयोग: मूल केबलको सेवा अवरुद्ध नगरी नयाँ क्षेत्र वा क्याबिनेटमा केबल पेयरहरू विस्तार (Branching) गर्न।',
          'विधि: मुख्य केबलको शिथ निश्चित लम्बाई (उदा. ३५-४५ से.मी.) खोल्ने, आवश्यक पेयरहरू पहिचान गरी बन्चबाट अलग्याउने, ब्रान्च केबलसँग जोड्ने र बाँकी निरन्तर पेयरलाई नकाटी सुरक्षित छाड्ने।',
          'विशेषता: सम्पूर्ण केबल काट्नु नपर्ने हुनाले चालु सेवाहरू (Existing subscribers) प्रभावित हुँदैनन्।',
          'प्रकार: कपर केबल पिक-अप र अप्टिकल फाइबर Mid-Span Access (Express Loop Splice)।'
        ]
      },
      {
        qNo: 4,
        marks: 5,
        question: 'Fuse र Surge Arrestor मा के प्राविधिक फरक छ ? यिनीहरूको जडान र प्रयोगबारे लेख्नुहोस्।',
        modelAnswer: 'फ्युजले ओभर-करेन्ट (अत्यधिक विद्युत प्रवाह) बाट र सर्ज एरेस्टरले ओभर-भोल्टेज (चट्याङ वा उच्च भोल्टेज) बाट उपकरणलाई जोगाउँछ।',
        bulletPoints: [
          'फ्युज (Fuse): परिपथको Series (सिरिज) मा जोडिन्छ। करेन्ट तोकिएको सीमाभन्दा बढी भएमा यसभित्रको पातलो तार पग्लेर (Melt) परिपथ खुला गराउँछ।',
          'सर्ज एरेस्टर (Surge Arrestor): परिपथ र अर्थिङको बीचमा Parallel (प्यारालेल) मा जोडिन्छ। सामान्य अवस्थामा high resistance हुन्छ तर चट्याङ पर्दा instant voltage surge लाई सोझै जमिन (Earth) मा पठाउँछ।',
          'स्थान: फ्युज AC switchboard र DC power supply मा; एरेस्टर MDF, DP box र टेलिकम टावरको पावर इन्ट्रीमा प्रयोग गरिन्छ।'
        ]
      },
      {
        qNo: 5,
        marks: 5,
        question: 'Network Migration गर्दा जडान गर्नुपर्ने १२ वटा मुख्य उपकरणहरू र तिनका कार्यहरू लेख्नुहोस्।',
        modelAnswer: 'पुरानो प्रविधिबाट नयाँ FTTH/NKN फाइबर नेटवर्कमा माइग्रेसन गर्दा निम्न १२ उपकरणहरू प्रयोग गरिन्छ:',
        bulletPoints: [
          '१. MSAN (Multi-Service Access Node): भ्वाइस र डाटालाई फाइबरमा एकीकृत गर्ने।',
          '२. OLT (Optical Line Terminal): केन्द्रीय कार्यालयमा FTTH नियन्त्रण गर्ने प्रविधि।',
          '३. ODF (Optical Distribution Frame): एक्सचेन्जमा फाइबर केबल Terminate र Patch गर्ने।',
          '४. MDF (Main Distribution Frame): पुरानो कपर लाइन व्यवस्थापन र जम्परिङ गर्ने।',
          '५. Optical Fiber Cable (Armored/ADSS): उच्च गतिको डाटा प्रसारण गर्ने माध्यम।',
          '६. Splitter (1:8 / 1:64): अप्टिकल पावरलाई धेरै ग्राहकमा विभाजन गर्ने।',
          '७. ONT / ONU: ग्राहकको घरमा फाइबरलाई इथरनेट/भ्वाइसमा रूपान्तरण गर्ने डिभाइस।',
          '८. Core Switch & Router: प्याकेट रुटिङ र नेटवर्क ट्राफिक व्यवस्थापन।',
          '९. Rectifier Unit: AC २३०V लाई DC -४८V मा रूपान्तरण गर्ने।',
          '१०. Battery Bank (-48V Lead-Acid/Lithium): विद्युत जाँदा निरन्तर पावर ब्याकअप दिने।',
          '११. Solar Inverter & Charge Controller: सौर्य उर्जा ब्याकअप सञ्चालन गर्ने।',
          '१२. MCB & Surge Arrestor: पावर प्यानलको सुरक्षा र अर्थिङ प्रोटेक्सन।'
        ]
      },
      {
        qNo: 6,
        marks: 5,
        question: 'केबल स्प्लाइसिङ्गको लागि शिथ ओपनिङ्ग (Sheath Opening) किन गरिन्छ र यसको नाप किन फरक हुन्छ ?',
        modelAnswer: 'केबल भित्रका तारहरू (Copper Pairs वा Fiber Cores) लाई सहज रूपमा जोड्न, स्प्लाइस ट्रे वा मोड्युलर कनेक्टरमा मिलाएर राख्न बाहिरी ज्याकेट हटाउनुलाई Sheath Opening भनिन्छ।',
        bulletPoints: [
          'कारण: तार जोड्न पर्याप्त स्थान प्राप्त गर्न र ज्वाइन्ट बक्स भित्र केबलको स्ट्रेन रिलिफ (Strength Member) कस्न।',
          'नाप फरक हुनुको कारण: केबलको पेयर/कोर सङ्ख्या अनुसार ज्वाइन्ट बक्स र स्प्लाइसिङ विधिको आकार फरक हुन्छ।',
          '५० पेयर एरियल केबल: ४३ से.मी. शिथ ओपनिङ।',
          '१५० पेयर एरियल/युजी केबल: ४७ देखि ४८ से.मी. शिथ ओपनिङ।',
          '३०० पेयर युजी केबल: ४७ से.मी. शिथ ओपनिङ।',
          'सावधानी: कोर नकाटिने गरी ज्याकेट काट्ने र स्टिल वायर/केभ्लारलाई क्ल्याम्पमा कडासँग बाँध्ने।'
        ]
      },
      {
        qNo: 7,
        marks: 5,
        question: 'गुणात्मक टेलिकम केबल स्लाइस (Cable Splice) मा हुनुपर्ने १० वटा मुख्य गुणहरू लेख्नुहोस्।',
        modelAnswer: 'केबल स्प्लाइस टेलिकम सञ्चारको अति संवेदनशील जोड हो। एक राम्रो स्प्लाइसमा निम्न १० गुणहरू अनिवार्य हुनुपर्छ:',
        bulletPoints: [
          '१. न्यूनतम सिग्नल लस (Low Insertion Loss < 0.05 dB)।',
          '२. कम विद्युतीय प्रतिरोध (Low Loop Resistance)।',
          '३. मेकानिकली मजबुत (High Mechanical Pull Strength)।',
          '४. पूर्ण चिस्यानमुक्त र वाटरप्रूफ (Waterproof & Moisture-sealed)।',
          '५. सही कलर कोड म्याचिङ (Proper Color Pair Alignment)।',
          '६. व्यवस्थित केबल ड्रेसिङ (Neat Bending & Routing in Tray)।',
          '७. जंग र अक्सिडेसन प्रतिरोधी (Corrosion Free Gel Filling)।',
          '८. उच्च इन्सुलेशन रेजिस्टेन्स (High Insulation Resistance Megger test)।',
          '९. दीर्घकालीन टिकाउपन (Long Physical Life Span)।',
          '१०. सजिलो मर्मतयोग्य (Easy Maintenance Access)।'
        ]
      },
      {
        qNo: 8,
        marks: 5,
        question: 'डी.एस.पी. मिटर (DSP Meter) ले टेलिफोन लाइनको इन्सुलेशन रेजिष्टेन्स (IR Test) नाप्ने विधि लेख्नुहोस्।',
        modelAnswer: 'DSP Meter कपर टेलिफोन लाइनको गुणस्तर र leakage current नाप्ने आधुनिक डिजिटल मिटर हो।',
        bulletPoints: [
          '१. Isolation: परीक्षण गर्ने लाइनलाई एक्सचेन्ज वा क्याबिनेटबाट डिस्कनेक्ट (Open) गर्ने।',
          '२. Lead Connection: DSP मिटरको Red Test Lead लाई Tip (A-wire), Black Lead लाई Ring (B-wire), र Green Lead लाई Earth मा जोड्ने।',
          '३. Function Selection: मिटरको नब घुमाएर Insulation Resistance (IR / Megger) मोड छान्ने।',
          '४. Measurement: Test बटन थिचेर A-B (Tip-Ring), A-E (Tip-Earth), र B-E (Ring-Earth) बीचको रेजिस्टेन्स नाप्ने।',
          '५. Result Evaluation: यदि मान > १० MΩ (Mega Ohms) आएमा इन्सुलेशन उत्तम; < १ MΩ आएमा केबलमा चिस्यान वा फल्ट भएको बुझिन्छ।'
        ]
      },
      {
        qNo: 9,
        marks: 5,
        question: 'पावर रुमको ब्याट्री बैंकको भोल्टेज र करेन्ट टेष्ट गर्ने प्राविधिक विधि लेख्नुहोस्।',
        modelAnswer: 'टेलिकम एक्सचेन्ज र बिटिएस टावरमा निरन्तर DC पावर ब्याकअपका लागि २V का २४ वटा सेलहरू सिरिजमा जोडेर -४८V ब्याट्री बैंक बनाइएको हुन्छ।',
        bulletPoints: [
          'भोल्टेज टेष्ट (Float & Individual Cell): डिजिटल मल्टिमिटरलाई DC Volts मोडमा राखी सिंगो ब्याट्री बैंकको फ्लोट भोल्टेज (५३.५V देखि ५४V) र प्रत्येक २V सेलको भोल्टेज (२.१५V - २.२V) नाप्ने।',
          'करेन्ट टेष्ट (Charge/Discharge Current): DC Clamp Meter लाई ब्याट्रीको मुख्य पोजिटिभ वा नेगेटिभ केबलमा क्ल्याम्प गरी चार्जिङ करेन्ट वा लोड डिस्चार्जिङ करेन्ट नाप्ने।',
          'सघनता/ग्र्याभिटी टेष्ट: हाइड्रोमिटर प्रयोग गरी इलेक्ट्रोलाइटको Specific Gravity (१.२१५ देखि १.२४०) नाप्ने।',
          'सुरक्षा: आँखामा चस्मा र हातमा रबर ग्लोभ्स लगाउने; ब्याट्री सर्ट हुन नदिने।'
        ]
      },
      {
        qNo: 10,
        marks: 5,
        question: 'OTDR (Optical Time Domain Reflectometer) ले गर्न सकिने १० वटा मुख्य परीक्षण कार्यहरू लेख्नुहोस्।',
        modelAnswer: 'OTDR अप्टिकल फाइबर नेटवर्कको निदान र प्रमाणीकरण गर्ने सबैभन्दा शक्तिशाली परीक्षण उपकरण हो।',
        bulletPoints: [
          '१. फाइबरको कुल लम्बाइ मापन गर्ने (Total Fiber Distance)।',
          '२. फाइबर कट वा ब्रेक भएको वास्तविक दुरी पत्ता लगाउने (Fault Location)।',
          '३. फ्युजन स्प्लाइस लस (Splice Loss in dB) नाप्ने।',
          '४. कनेक्टर लस र रिफ्लेक्टेन्स लस (Connector Loss & Reflection) नाप्ने।',
          '५. केबलको प्रति किलोमिटर एटेनुएसन दर (Attenuation Rate dB/km) नाप्ने।',
          '६. फाइबर अत्यधिक मोडिएको ठाउँ (Macro-bend / Micro-bend) पहिचान गर्ने।',
          '७. स्प्लिटर (Splitter 1:8 / 1:16) को लस परीक्षण गर्ने।',
          '८. फाइबरको रिफ्रेक्टिभ इन्डेक्स (Group Index / IOR) क्यालिब्रेसन गर्ने।',
          '९. फाइबर लिङ्कको निरन्तरता (Continuity Trace Graphic) हेर्ने।',
          '१०. फाइबर मर्मतपछि गुणस्तरको आधिकारिक रिपोर्ट (PDF Trace Save) तयार पार्ने।'
        ]
      },
      {
        qNo: 11,
        marks: 5,
        question: 'टेलिफोन केबल र पावर केबल बीच सेपरेशन (Separation Distance) किन र कति राख्नुपर्छ ?',
        modelAnswer: 'टेलिकम केबललाई विद्युत लाइनबाट निश्चित दुरीमा नराखेमा इन्डक्सन नोइज र विद्युतीय दुर्घटनाको खतरा हुन्छ।',
        bulletPoints: [
          'कारण १: Electro-Magnetic Induction (EMI) ले गर्दा टेलिफोन र डाटा लाइनमा हुनसक्ने घारघुर (Humming Noise & Cross-talk) रोक्न।',
          'कारण २: हाइ-भोल्टेज विद्युत टेलिकम केबलमा लीक भई प्राविधिक र उपकरण डढ्ने दुर्घटना बचाउन।',
          'लो-भोल्टेज (२३०V/४००V) विद्युत लाइनसँग parallel जाँदा: कम्तीमा ३० से.मी. (30 cm) दूरी राख्नुपर्छ।',
          'हाई-भोल्टेज (११kV/३३kV/६६kV) लाइन मुनि crossing गर्दा: कम्तीमा २ मिटर (2 Meters) मुनि हुनुपर्छ।',
          'भूमिगत क्रसिङ (UG Pipe Underground): कम्तीमा ५० से.मी. मुनि GI पाइपभित्र छिराएर लैजानुपर्छ।'
        ]
      },
      {
        qNo: 12,
        marks: 5,
        question: 'MCB (Miniature Circuit Breaker) को कार्य सिद्धान्त र आन्तरिक सुरक्षा संरचना लेख्नुहोस्।',
        modelAnswer: 'MCB विद्युतीय परिपथलाई ओभरलोड र सर्ट सर्किटबाट जोगाउने स्वतः ट्रिप हुने आधुनिक सुरक्षा स्विच हो।',
        bulletPoints: [
          'Thermal Protection (Overload): परिपथमा तोकिएको क्षमताभन्दा बढी करेन्ट निरन्तर बग्दा MCB भित्रको Bimetal Strip तातेर बाङ्गिन्छ र मेकानिजम ट्रिप गराउँछ।',
          'Magnetic Protection (Short Circuit): सर्ट सर्किट हुँदा अत्यधिक करेन्टले Solenoid Coil मा बलियो चुम्बकीय क्षेत्र पैदा गर्छ र मिलिसेकेन्डमै प्लन्जरलाई धकेलेर ट्रिप गराउँछ।',
          'Arc Chute: कन्ट्याक्ट छुट्टिँदा उत्पन्न हुने बिजुलीको झिल्का (Arc) लाई साम्य पार्छ।',
          'फाइदा: फ्युज जस्तो तार फेर्नु पर्दैन; समस्या समाधानपछि पुनः ON गर्न सकिन्छ।'
        ]
      },
      {
        qNo: 13,
        marks: 5,
        question: 'टेलिकम नेटवर्कमा Network Migration गर्नुपर्नुका प्रमुख १० वटा कारणहरू स्पष्ट पार्नुहोस्।',
        modelAnswer: 'प्रविधिमा आएको क्रान्ति र ग्राहकको उच्च गतिको इन्टरनेट माग सम्बोधन गर्न पुरानो कपर नेटवर्कलाई फाइबर (FTTH) मा माइग्रेट गरिन्छ।',
        bulletPoints: [
          '१. पुरानो कपर प्रविधि (ADSL/PSTN) विस्थापित हुनु (Technology Obsolescence)।',
          '२. उच्च गतिको ब्यान्डविथ (Gigabit Internet Demand) पूरा गर्न।',
          '३. कपर चोरी र पानी पसेर हुने बारम्बारको फल्ट मर्मत खर्च घटाउन।',
          '४. Triple-Play Services (Voice, High-speed Data, IPTV) एउटै तारबाट दिन।',
          '५. लामो दुरीमा सिग्नल लस न्यूनतम (Low Attenuation) गराउन।',
          '६. 4G/5G BTS टावरलाई उच्च गतिको बैकहोल फाइबर उपलब्ध गराउन।',
          '७. केन्द्रीय एक्सचेन्जको ऊर्जा (Electricity Cost & Space) बचत गर्न।',
          '८. सेवाको गुणस्तर (QoS) र SLA सुधार्न।',
          '९. ग्राहक सन्तुष्टि (Customer Satisfaction) अभिवृद्धि गर्न।',
          '१०. भविष्यको ६G र स्मार्ट सिटी प्रविधिसँग अनुकूल बनाउन।'
        ]
      },
      {
        qNo: 14,
        marks: 5,
        question: 'Main Distribution Frame (MDF) मा जम्पर (Jumpering) गर्ने विधि र अपनाउनुपर्ने सावधानीहरू लेख्नुहोस्।',
        modelAnswer: 'MDF मा एक्सचेन्जको ई-साइड र बाहिरी केबलको डी-साइडलाई ०.४mm/०.५mm जम्पर तारले जोड्ने प्रक्रिया जम्परिङ हो।',
        bulletPoints: [
          '१. रेकर्ड म्याचिङ: वर्क अर्डर (Work Order) अनुसार E-side vertical र D-side tag सङ्ख्या यकिन गर्ने।',
          '२. लाइन टेस्ट: जम्पर जोड्नु अघि लाइनमा सर्ट/ग्राउन्ड छ कि छैन भनी मल्टिमिटरबाट टेष्ट गर्ने।',
          '३. Punch Down Tool: तारलाई क्रोन (Krone) वा सिमेन्स ब्लकमा insertion tool ले सही थिचेर बढी भाग काट्ने।',
          '४. Cable Routing: जम्पर वायरलाई जुंगा नलगाई MDF को बाटो (Ring Guide) बाट मिलाएर ड्रेसिङ गर्ने।',
          'सावधानी: धेरै तार खुकुलो नछाड्ने, पोलारिटी (+ Tip / - Ring) उल्टाउन नदिने, र म्यागाजिन एरेस्टर जोड्ने।'
        ]
      },
      {
        qNo: 15,
        marks: 5,
        question: '४ कोर अप्टिकल फाइबर केबल स्प्लाइसिङ (Fusion Splicing) गर्ने पूर्ण प्राविधिक चरणहरू लेख्नुहोस्।',
        modelAnswer: 'फ्युजन स्प्लाइसर मेसिनबाट दुई फाइबर कोरलाई उच्च तापक्रममा पगालेर जोड्ने विधि निम्न बमोजिम छ:',
        bulletPoints: [
          '१. Preparation: फाइबर केबलको बाहिरी ज्याकेट, केभ्लार र बफर ट्युब हटाई ४ वटा कोर (Blue, Orange, Green, Brown) छुट्याउने।',
          '२. Protection Sleeve Insertion: एउटा फाइबर कोरमा हिट-श्रिङ्क प्रोटेक्सन स्लिभ छिराउने।',
          '३. Stripping & Cleaning: फाइबर स्ट्रिपरले २५०μm प्राइमरी कोटिङ हटाई ९९% pure IPA ले फाइबर सफा गर्ने।',
          '४. Cleaving: फाइबर क्लिभरमा राखी ठीक ९०° समतल कोणमा क्लिभ गर्ने।',
          '५. Splicing: दुवै फाइबरलाई स्प्लाइसरको V-groove मा राखी Auto Alignment पश्चात Arc Discharge गरी जोड्ने।',
          '६. Protection & Heating: स्प्लाइस ठाउँमा स्लिभ सारेर हिटरमा राखी तताउने र Splice Tray मा सुरक्षित राख्ने।'
        ]
      },
      {
        qNo: 16,
        marks: 5,
        question: 'Multi-Service Access Node (MSAN) भनेको के हो ? यसका फाइदा र संरचनात्मक भूमिका लेख्नुहोस्।',
        modelAnswer: 'MSAN परम्परागत Telephone PSTN, ADSL ब्रॉडब्यान्ड र आधुनिक FTTH/IP सेवाहरूलाई एउटै नोडमा समेट्ने बहु-सेवा पहुँच उपकरण हो।',
        bulletPoints: [
          'भूमिका: यसले तामाका पुराना लाइनहरूलाई IP/Ethernet सिग्नलमा रूपान्तरण गरी फाइबर ब्याकबोनसँग जोड्छ।',
          'फाइदा १: एक्सचेन्ज भवनभन्दा बाहिर फिल्डको क्याबिनेट (Cabinet MSAN) मा राख्न सकिने हुनाले ग्राहकसम्म कपरको दुरी घट्छ।',
          'फाइदा २: उच्च गतिको VDSL2 र POTS भ्वाइस सेवा एउटै डिभाइसबाट पाइन्छ।',
          'संरचना: Control Card (uplink), POTS Voice Cards, DSL Line Cards, Rectifier र Battery Backup System.'
        ]
      },
      {
        qNo: 17,
        marks: 5,
        question: 'Electrical Earthing System मा प्रयोग हुने ७ वटा मुख्य कम्पोनेन्टहरू र तिनका कार्यहरू लेख्नुहोस्।',
        modelAnswer: 'प्रभावकारी अर्थिङ प्रणाली निर्माण गर्न निम्न ७ कम्पोनेन्टहरू प्रयोग गरिन्छ:',
        bulletPoints: [
          '१. Earth Electrode (GI Pipe / Copper Rod): करेन्ट जमिनमा डिस्चार्ज गर्ने मुख्य कन्डक्टर।',
          '२. Earth Lead (Copper Wire / Strip): उपकरणको बडीबाट इलेक्ट्रोडसम्म जाने मुख्य तार।',
          '३. Earth Pit (खाल्टो): इलेक्ट्रोड गाडिने स्थान (जसमा नुन, कोइला र बेन्टोनाइट माटो भरिन्छ)।',
          '४. Salt, Charcoal & Bentonite: माटोको सापेक्षित सांद्रता र चिस्यान कायम राखी Resistance घटाउने सामग्री।',
          '५. Earth Bus Bar (EBB): धेरै उपकरणहरूका अर्थिङ तारहरू एकै ठाउँमा जोड्ने तामाको प्लेट।',
          '६. Main Earthing Clamp: इलेक्ट्रोड र तारलाई बलियोसँग कस्ने तामा/GI क्ल्याम्प।',
          '७. Inspection Chamber (परीक्षण चेम्बर): समय-समयमा अर्थिङ रेजिस्टेन्स नाप्न बनाइएको ढक्कनयुक्त चेम्बर।'
        ]
      },
      {
        qNo: 18,
        marks: 5,
        question: 'Transformer भनेको के हो ? यसका प्रकारहरू, कार्य सिद्धान्त र टेलिकममा प्रयोगबारे लेख्नुहोस्।',
        modelAnswer: 'ट्रान्सफर्मर फ्रिक्वेन्सी परिवर्तन नगरी इलेक्ट्रोम्याग्नेटिक इन्डक्सनको सिद्धान्त अनुसार AC भोल्टेज बढाउने वा घटाउने स्थिर विद्युतीय उपकरण हो।',
        bulletPoints: [
          'कार्य सिद्धान्त: Faraday\'s Law of Mutual Induction (प्राइमरी वाइन्डिङको AC करेन्टले सेकेन्डरी वाइन्डिङमा भोल्टेज इन्ड्युस गराउँछ)।',
          'Step-Up Transformer: भोल्टेज बढाउने (सेकेन्डरी फन्का बढी रहने)।',
          'Step-Down Transformer: भोल्टेज घटाउने (उदा. ११kV लाई २३०V/४००V मा झार्ने)।',
          'Isolation Transformer: १:१ अनुपातमा रहने र विद्युतीय नोइज तथा सुरक्षाका लागि प्रयोग हुने।',
          'टेलिकममा प्रयोग: सबस्टेसनबाट टेलिकम पावर रुममा २३०V/४००V AC सप्लाई ल्याउन र रेक्टिफायर चलाउन।'
        ]
      },
      {
        qNo: 19,
        marks: 5,
        question: 'MDF (Main Distribution Frame) र Cabinet (क्याबिनेट) बीचको तुलनात्मक तालिका स्पष्ट पार्नुहोस्।',
        modelAnswer: 'MDF र Cabinet दुवै कपर टेलिफोन नेटवर्कका वितरण बिन्दु हुन् तर यिनीहरूमा निम्न भिन्नता छ:',
        bulletPoints: [
          '१. स्थान (Location): MDF केन्द्रीय एक्सचेन्ज भवनभित्र हुन्छ; Cabinet सडक छेउमा (Outdoor Field) हुन्छ।',
          '२. क्षमता (Capacity): MDF मा १०,००० देखि ५०,००० पेयर सम्म हुन्छ; Cabinet मा ३०० देखि १२०० पेयर सम्म हुन्छ।',
          '३. कनेक्टिभिटी: MDF ले Switch (Exchange) र Main Underground Cable जोड्छ; Cabinet ले Main Cable र Secondary Cable जोड्छ।',
          '४. अर्थिङ मानक: MDF अर्थिङ रेजिस्टेन्स < १ Ω; Cabinet अर्थिङ रेजिस्टेन्स < १० Ω हुनुपर्छ।',
          '५. सुरक्षा संरचना: MDF भवनको AC/Environment Control भित्र हुन्छ; Cabinet Outdoor Weatherproof Metallic Shell भित्र हुन्छ।'
        ]
      }
    ]
  }
};

// 100 Comprehensive Level-2 VIVA Questions & High-Yield Answers
export const level2VivaBank = [
  { id: 1, q: 'MDF को पूर्ण रूप के हो ?', a: 'Main Distribution Frame (एक्सचेन्जभित्र लाइन व्यवस्थापन गर्ने मुख्य फ्रेम)', cat: 'telecom' },
  { id: 2, q: 'ODF को पूर्ण रूप के हो ?', a: 'Optical Distribution Frame (फाइबर केबल टर्मिनेसन र प्याचिङ फ्रेम)', cat: 'fiber' },
  { id: 3, q: 'FDC वा FDH भनेको के हो ?', a: 'Fiber Distribution Cabinet / Hub (फाइबर वितरण क्याबिनेट)', cat: 'fiber' },
  { id: 4, q: 'FAP को पूर्ण रूप के हो ?', a: 'Fiber Access Point (ग्राहक नजिकको फाइबर जोड्ने बक्स)', cat: 'fiber' },
  { id: 5, q: 'OTDR ले के नाप्छ ?', a: 'फाइबरको लम्बाइ, लस (dB/km), स्प्लाइस लस, र फल्ट दूरी', cat: 'tools' },
  { id: 6, q: 'VFL ले कुन रङको प्रकाश फाल्छ ?', a: '६५० nm को देखिने रातो लेजर प्रकाश (Visible Red Laser)', cat: 'tools' },
  { id: 7, q: 'Optical Power Meter को एकाइ के हो ?', a: 'dBm (decibel-milliwatt) वा µW (microwatt)', cat: 'tools' },
  { id: 8, q: 'Megger मिटरले के नाप्छ ?', a: 'केबल र उपकरणको उच्च इन्सुलेसन रेजिस्टेन्स (MΩ मा)', cat: 'tools' },
  { id: 9, q: 'C-Meter को प्रयोग केमा हुन्छ ?', a: 'क्यापासिट्यान्स र ड्रप वायरको फल्ट दूरी नाप्न', cat: 'tools' },
  { id: 10, q: 'DSP Meter को मुख्य काम के हो ?', a: 'डिजिटल सिग्नल प्रोसेसिङ मार्फत फ्रिक्वेन्सी, नोइज र सिग्नल गुणस्तर विश्लेषण', cat: 'tools' },
  { id: 11, q: 'Earth Resistance कति हुनुपर्छ ?', a: 'एक्सचेन्जमा १-५ ओहम, सेकेन्डरी नेटवर्क/क्याबिनेटमा १० ओहमभन्दा कम', cat: 'safety' },
  { id: 12, q: 'टेलिफोन अन-हुक (Idle) भोल्टेज कति हुन्छ ?', a: 'लगभग -४८ V DC', cat: 'electrical' },
  { id: 13, q: 'टेलिफोनमा घण्टी (Ringing) बज्दा कति भोल्टेज आउँछ ?', a: '७५ देखि ९० V AC (२० Hz)', cat: 'electrical' },
  { id: 14, q: 'कुराकानी गर्दा (Off-Hook) कति भोल्टेज हुन्छ ?', a: '६ देखि १२ V DC (औसत १८-२५ V DC)', cat: 'electrical' },
  { id: 15, q: 'कपर केबलमा २५ पेयरका प्रमुख ५ रङ के हुन् ?', a: 'White, Red, Black, Yellow, Violet', cat: 'copper' },
  { id: 16, q: 'कपर केबलमा सहायक ५ रङ के हुन् ?', a: 'Blue, Orange, Green, Brown, Slate (Grey)', cat: 'copper' },
  { id: 17, q: '१२ कोर फाइबरको पहिलो कोर कुन रङको हुन्छ ?', a: 'निलो (Blue)', cat: 'fiber' },
  { id: 18, q: '१२ कोर फाइबरको १२औं कोर कुन रङको हुन्छ ?', a: 'आकाशी निलो (Aqua)', cat: 'fiber' },
  { id: 19, q: 'स्प्लाइसिङ मेसिनमा फाइबर राख्नुअघि कुन केमिकलले सफा गरिन्छ ?', a: 'Isopropyl Alcohol (IPA)', cat: 'fiber' },
  { id: 20, q: 'फाइबर क्लिभरले कति डिग्रीमा फाइबर काट्नुपर्छ ?', a: 'ठीक ९०° (Perpendicular Flat Surface)', cat: 'fiber' },
  { id: 21, q: 'फ्युजन स्प्लाइसिङमा स्प्लाइस लस कतिभन्दा कम हुनु राम्रो मानिन्छ ?', a: '०.०२ dB भन्दा कम', cat: 'fiber' },
  { id: 22, q: 'OJC बक्सभित्र फाइबर केबलको शिथ कति सेमी मात्र खोल्नुपर्छ ?', a: 'ठीक १ सेमी (FRP लक र वाटरप्रूफिङका लागि)', cat: 'fiber' },
  { id: 23, q: 'स्प्लाइसिङ ट्रेभित्र फाइबर लुपिङका लागि कति केबल शिथ खोलिन्छ ?', a: '१ मिटर वा सोभन्दा बढी', cat: 'fiber' },
  { id: 24, q: 'पिक अप ज्वाइन्ट (Pick Up Joint) भनेको के हो ?', a: 'मुख्य केबल नकाटीकनै बीचबाट ग्राहकका लागि ड्रप लाइन निकाल्ने जडान', cat: 'copper' },
  { id: 25, q: 'फ्युज (Fuse) को काम के हो ?', a: 'अत्यधिक करेन्ट (Overcurrent/Short Circuit) बाट सर्किट जोगाउने', cat: 'electrical' },
  { id: 26, q: 'एरेस्टर (Arrester) को काम के हो ?', a: 'चट्याङ र हाइ भोल्टेज सर्जलाई जमिनमा पठाई उपकरण जोगाउने', cat: 'electrical' },
  { id: 27, q: 'MCB को पूर्ण रूप के हो ?', a: 'Miniature Circuit Breaker', cat: 'electrical' },
  { id: 28, q: 'MCCB को पूर्ण रूप के हो ?', a: 'Moulded Case Circuit Breaker (६३A देखि ३०००A सम्म)', cat: 'electrical' },
  { id: 29, q: 'ACDB को पूर्ण रूप के हो ?', a: 'Alternating Current Distribution Box', cat: 'electrical' },
  { id: 30, q: 'इन्भर्टर (Inverter) ले के काम गर्छ ?', a: 'DC विद्युतलाई AC विद्युतमा रूपान्तरण गर्छ', cat: 'electrical' },
  { id: 31, q: 'रेक्टिफायर (Rectifier) ले के काम गर्छ ?', a: 'AC विद्युतलाई DC विद्युतमा रूपान्तरण गर्छ', cat: 'electrical' },
  { id: 32, q: 'ट्रान्सफर्मरले कुन सिद्धान्तमा काम गर्छ ?', a: 'इलेक्ट्रोम्याग्नेटिक इन्डक्सन (Mutual Induction)', cat: 'electrical' },
  { id: 33, q: 'ओहम्स ल अनुसार V, I र R को सम्बन्ध के हो ?', a: 'V = I * R (भोल्टेज = करेन्ट x रेजिस्टेन्स)', cat: 'electrical' },
  { id: 34, q: 'KCL को नियम के हो ?', a: 'कुनै जंक्शनमा आउने कुल करेन्ट = बाहिर जाने कुल करेन्ट', cat: 'electrical' },
  { id: 35, q: 'KVL को नियम के हो ?', a: 'कुनै बन्द लुपमा सबै भोल्टेजको योगफल शून्य हुन्छ', cat: 'electrical' },
  { id: 36, q: 'पावरको सूत्र के हो ?', a: 'P = V * I (एकाइ: वाट / Watt)', cat: 'electrical' },
  { id: 37, q: '१ हर्सपावर (1 HP) मा कति वाट हुन्छ ?', a: '७४६ वाट (746 Watts)', cat: 'electrical' },
  { id: 38, q: 'ब्याट्री बैंकमा भोल्टेज बढाउन कुन कनेक्सन गरिन्छ ?', a: 'सिरिज कनेक्सन (Series Connection)', cat: 'electrical' },
  { id: 39, q: 'ब्याट्री बैंकमा करेन्ट क्षमता बढाउन कुन कनेक्सन गरिन्छ ?', a: 'प्यारालल कनेक्सन (Parallel Connection)', cat: 'electrical' },
  { id: 40, q: 'पूर्ण चार्ज भएको लेड-एसिड ब्याट्रीको स्पेसिफिक ग्र्याभिटी कति हुन्छ ?', a: '१२६० देखि १२८० (Hydrometer बाट नापिन्छ)', cat: 'electrical' },
  { id: 41, q: 'टेलिकम एक्सचेन्ज पावर प्लान्टमा कति भोल्टको ब्याट्री बैंक प्रयोग हुन्छ ?', a: '-४८ V DC बैंक (२४ वटा २V सेल सिरिजमा)', cat: 'electrical' },
  { id: 42, q: 'डायोड (Diode) ले करेन्ट कुन दिशामा बग्न दिन्छ ?', a: 'केबल एक दिशामा मात्र (Forward Bias)', cat: 'electrical' },
  { id: 43, q: 'जेनर डायोड (Zener Diode) को मुख्य प्रयोग के हो ?', a: 'भोल्टेज रेगुलेटर वा स्थिर भोल्टेज कायम राख्न', cat: 'electrical' },
  { id: 44, q: 'ट्रान्जिस्टरका ३ वटा टर्मिनल के के हुन् ?', a: 'Emitter (E), Base (B), र Collector (C)', cat: 'electrical' },
  { id: 45, q: 'ट्रान्जिस्टरका मुख्य २ काम के हुन् ?', a: 'सिग्नल एम्प्लिफायर (Amplifier) र इलेक्ट्रोनिक स्विच (Switch)', cat: 'electrical' },
  { id: 46, q: 'De Morgan\'s पहिलो नियम के हो ?', a: '(A • B)\' = A\' + B\'', cat: 'electrical' },
  { id: 47, q: 'AND गेटको आउटपुट कहिले १ हुन्छ ?', a: 'जब सबै इनपुट १ हुन्छन्', cat: 'electrical' },
  { id: 48, q: 'OR गेटको आउटपुट कहिले ० हुन्छ ?', a: 'जब सबै इनपुट ० हुन्छन्', cat: 'electrical' },
  { id: 49, q: 'OSI Model मा कतिवटा लेयर्स हुन्छन् ?', a: '७ वटा (Physical, Data Link, Network, Transport, Session, Presentation, Application)', cat: 'networking' },
  { id: 50, q: 'Router कुन OSI लेयरको डिभाइस हो ?', a: 'Layer 3 (Network Layer - IP Routing)', cat: 'networking' },
  { id: 51, q: 'Switch कुन OSI लेयरमा काम गर्छ ?', a: 'Layer 2 (Data Link Layer - MAC Addressing)', cat: 'networking' },
  { id: 52, q: 'IPv4 कति बिटको हुन्छ ?', a: '३२ बिट (32-bit, उदा. 192.168.1.1)', cat: 'networking' },
  { id: 53, q: 'IPv6 कति बिटको हुन्छ ?', a: '१२८ बिट (128-bit, उदा. 2001:db8::1)', cat: 'networking' },
  { id: 54, q: 'DNS को काम के हो ?', a: 'Domain Name (वेबसाइट नाम) लाई IP Address मा बदल्ने', cat: 'networking' },
  { id: 55, q: 'DHCP को काम के हो ?', a: 'कम्प्युटर/डिभाइसलाई अटोमेटिक IP Address प्रदान गर्ने', cat: 'networking' },
  { id: 56, q: 'सबैभन्दा बढी प्रयोग हुने नेटवर्क टोपोलोजि कुन हो ?', a: 'Star Topology (केन्द्रमा स्विच भएको)', cat: 'networking' },
  { id: 57, q: 'सबैभन्दा भरपर्दो (Most Reliable) टोपोलोजि कुन हो ?', a: 'Mesh Topology (प्रत्येक नोड आपसमा जोडिएको)', cat: 'networking' },
  { id: 58, q: 'GSM नेटवर्कमा BTS को काम के हो ?', a: 'Base Transceiver Station - मोबाइलसँग रेडियो सिग्नल आदान-प्रदान गर्ने टावर', cat: 'wireless' },
  { id: 59, q: 'GSM नेटवर्कमा BSC को काम के हो ?', a: 'Base Station Controller - धेरै वटा BTS लाई नियन्त्रण गर्ने', cat: 'wireless' },
  { id: 60, q: 'MSC को पूर्ण रूप के हो ?', a: 'Mobile Switching Center (कल स्विचिङ र रुटिङ गर्ने मुख्य केन्द्र)', cat: 'wireless' },
  { id: 61, q: 'HLR र VLR मा के फरक छ ?', a: 'HLR मा स्थायी ग्राहक रेकर्ड हुन्छ; VLR मा रोमिङ/अस्थायी प्रयोगकर्ता रेकर्ड हुन्छ', cat: 'wireless' },
  { id: 62, q: 'EIR मा के जानकारी हुन्छ ?', a: 'मोबाइल डिभाइसको IMEI नम्बर (ब्ल्याकलिस्ट/ह्वाइटलिस्ट)', cat: 'wireless' },
  { id: 63, q: 'CDMA को पूरा नाम के हो ?', a: 'Code Division Multiple Access', cat: 'wireless' },
  { id: 64, q: 'Near-Far Problem भनेको के हो ?', a: 'नजिकको मोबाइलको शक्तिशाली सिग्नलले टाढाको कमजोर सिग्नल दबाउने समस्या (पावर कन्ट्रोलबाट समाधान हुन्छ)', cat: 'wireless' },
  { id: 65, q: 'Rake Receiver को काम के हो ?', a: 'मल्टिपाथबाट आएका विभिन्न कमजोर सिग्नलहरूलाई मिलाएर बलियो बनाउने', cat: 'wireless' },
  { id: 66, q: 'माइक्रोवेभ सञ्चारको फ्रिक्वेन्सी रेन्ज कति हुन्छ ?', a: '१ GHz देखि ३०० GHz सम्म', cat: 'wireless' },
  { id: 67, q: 'स्याटेलाइटमा Uplink र Downlink के हो ?', a: 'पृथ्वीबाट स्याटेलाइट पठाउनु Uplink, स्याटेलाइटबाट पृथ्वीमा पठाउनु Downlink', cat: 'wireless' },
  { id: 68, q: 'GEO स्याटेलाइट पृथ्वीबाट कति उचाइमा हुन्छ ?', a: 'लगभग ३५,७८६ किलोमिटर (पृथ्वीको घूर्णन बराबर गति)', cat: 'wireless' },
  { id: 69, q: 'केप्लरको पहिलो नियम के हो ?', a: 'ग्रह तथा स्याटेलाइट सूर्य/पृथ्वी वरिपरि इलिप्टिकल (दीर्घवृत्त) कक्षमा घुम्छन्', cat: 'wireless' },
  { id: 70, q: 'पोलको टुप्पोबाट डिस्ट्रिब्युसन ब्राकेट कति मुनि कसिन्छ ?', a: '२० से.मी. (20 cm)', cat: 'osp' },
  { id: 71, q: 'पोलको टुप्पोबाट स्टे सिट कति मुनि कसिन्छ ?', a: '४० देखि ४५ से.मी.', cat: 'osp' },
  { id: 72, q: 'पोलको टुप्पोबाट पिन टाइप ब्राकेट वा सस्पेन्सन क्ल्याम्प कति मुनि कसिन्छ ?', a: '५० से.मी. (50 cm)', cat: 'osp' },
  { id: 73, q: 'पोलको टुप्पोबाट DP बक्स कति मुनि कसिन्छ ?', a: '११० से.मी. (110 cm)', cat: 'osp' },
  { id: 74, q: 'ब्राइडल रिङ कति मुनि कसिन्छ ?', a: '११५ देखि १२० से.मी. (DP भन्दा ठीक मुनि)', cat: 'osp' },
  { id: 75, q: 'पोलमा भर्याङ कति डिग्रीमा राख्नुपर्छ ?', a: '७५° (75 Degree)', cat: 'safety' },
  { id: 76, q: '८ मिटरको पोल गाड्दा खाल्डोको गहिराइ कति हुनुपर्छ ?', a: '१.६ मिटर (कुल लम्बाइको १/६ भाग)', cat: 'osp' },
  { id: 77, q: '७.५ मिटरको पोल गाड्दा खाल्डो कति खनिन्छ ?', a: '१.५ मिटर', cat: 'osp' },
  { id: 78, q: 'एक पोलदेखि अर्को पोलको सामान्य दूरी (Span) कति हुन्छ ?', a: '४० देखि ५० मिटर', cat: 'osp' },
  { id: 79, q: 'सडक पार गर्दा टेलिकम केबल सडकबाट कति माथि हुनुपर्छ ?', a: 'कम्तीमा ५ मिटर (5 Meters)', cat: 'safety' },
  { id: 80, q: 'विद्युतको ३३kV वा ६६kV लाइनबाट टेलिकम केबल कति दूरीमा हुनुपर्छ ?', a: 'कम्तीमा २ मिटर मुनि', cat: 'safety' },
  { id: 81, q: 'पावर लाइन र टेलिकम लाइन क्रसिङ गर्दा कति कोणमा गर्नुपर्छ ?', a: 'ठीक ९०° (Right Angle)', cat: 'safety' },
  { id: 82, q: 'ड्रप वायरको व्यास कति हुन्छ ?', a: '०.९ mm कपर कन्डक्टर', cat: 'copper' },
  { id: 83, q: '०.४ mm कपर केबलको लुप रेजिस्टेन्स कति हुन्छ ?', a: '२८० Ohm/km', cat: 'copper' },
  { id: 84, q: '०.५ mm कपर केबलको लुप रेजिस्टेन्स कति हुन्छ ?', a: '१७५ Ohm/km', cat: 'copper' },
  { id: 85, q: '०.९ mm कपर केबलको लुप रेजिस्टेन्स कति हुन्छ ?', a: '६३.२ Ohm/km', cat: 'copper' },
  { id: 86, q: 'नयाँ केबलमा इन्सुलेसन रेजिस्टेन्स कति हुनुपर्छ ?', a: '२०० Mega Ohm (MΩ) भन्दा बढी', cat: 'copper' },
  { id: 87, q: 'ड्रप वायर जोड्न कुन कनेक्टर प्रयोग गरिन्छ ?', a: 'UY / UY2 कनेक्टर', cat: 'copper' },
  { id: 88, q: 'अन्डरग्राउन्ड केबलमा २५ पेयर जोड्न कुन कनेक्टर प्रयोग गरिन्छ ?', a: '३M Modular Connector', cat: 'copper' },
  { id: 89, q: 'म्यानहोल (Manhole) का प्रकारहरू के के हुन् ?', a: 'S-Type, L-Type, T-Type (Shallow, Normal, Deep)', cat: 'osp' },
  { id: 90, q: 'एउटा म्यानहोलदेखि अर्को म्यानहोलको औसत दूरी कति हुन्छ ?', a: '२०० देखि २५० मिटर', cat: 'osp' },
  { id: 91, q: 'MDF देखि क्याबिनेटसम्म अधिकतम कति दूरीमा केबल तानेर लाइन चलाउन सकिन्छ ?', a: '४ किलोमिटर (4000 m)', cat: 'osp' },
  { id: 92, q: 'क्याबिनेटदेखि एन्ड पोलसम्म कति दूरीमा लाइन चलाउन सकिन्छ ?', a: '२ किलोमिटर (2000 m)', cat: 'osp' },
  { id: 93, q: 'डीपी बक्सदेखि ग्राहकको घरसम्म अधिकतम दूरी कति हुनुपर्छ ?', a: '२०० मिटर', cat: 'osp' },
  { id: 94, q: 'नेपालमा FTTH सेवा कहिले सुरु भएको हो ?', a: 'सन् २०१५ (व्यावसायिक विस्तार २०१६)', cat: 'telecom' },
  { id: 95, q: 'नेपालमा 4G/LTE सेवा कहिले सुरुवात भएको हो ?', a: 'सन् २०१७ जनवरी १ (वि.सं. २०७३ पुस १७)', cat: 'telecom' },
  { id: 96, q: 'नेपालमा NTTV (IPTV) सेवा कहिले सुरु भएको हो ?', a: 'सन् २०२१ जनवरी १ (वि.सं. २०७७ पुस १७)', cat: 'telecom' },
  { id: 97, q: 'नेपालमा eSIM सेवा कहिले सुरु भएको हो ?', a: 'सन् २०२२ सेप्टेम्बर १६ (वि.सं. २०७९ भदौ ३१)', cat: 'telecom' },
  { id: 98, q: 'नेपाल टेलिकममा टेलिफोन कम्प्लेन दर्ता गर्ने नम्बर कुन हो ?', a: '१९८ (198)', cat: 'telecom' },
  { id: 99, q: 'टेलिफोन सोधपुछ (Telephone Enquiry) नम्बर कुन हो ?', a: '१९७ (197)', cat: 'telecom' },
  { id: 100, q: 'PSTN बिल सोधपुछ नम्बर कुन हो ?', a: '१६०६ (1606)', cat: 'telecom' }
];

// Pole Accessories & Distance Standards Spec
export const level2PoleSpecs: PoleStandardSpec[] = [
  {
    item: 'Distribution Bracket (डिस्ट्रिब्युसन ब्राकेट)',
    distanceFromTop: '२० से.मी. (20 cm)',
    descriptionNepali: 'DP मा जोडिएका ड्रपवायरहरूलाई एकीकृत गरेर डिस्ट्रिब्युसन गरी ग्राहकको घरमा लैजान प्रयोग गरिने ब्राकेट।',
    standardRule: 'पोलको टुप्पोबाट ठीक २० सेमी तल कसिन्छ।',
    category: 'pole-fitting'
  },
  {
    item: 'Stay Seat / Stay Wire (स्टे सिट)',
    distanceFromTop: '४० देखि ४५ से.मी.',
    descriptionNepali: 'पोललाई दुवैतर्फबाट तानेर सन्तुलन कायम राख्ने स्टे तार बाँध्न प्रयोग गरिने भाग।',
    standardRule: 'जमिनसँग ४५° को कोणमा स्टे तार टाइट गरी राखिन्छ।',
    category: 'pole-fitting'
  },
  {
    item: 'Pin Type Bracket / Anchoring Eye / Suspension Clamp',
    distanceFromTop: '५० से.मी. (50 cm)',
    descriptionNepali: 'सिधा रुटमा सस्पेन्सन क्ल्याम्प, बाङ्गो रुटमा पिन टाइप ब्राकेट वा एन्करिङ आई प्रयोग गरी एरियल/फाइबर केबल अड्याइन्छ।',
    standardRule: 'पोलको टुप्पोबाट ५० सेमी तल मेसेन्जर तारसहित कसिन्छ।',
    category: 'pole-fitting'
  },
  {
    item: 'D.P. Box (Distribution Point बक्स)',
    distanceFromTop: '११० से.मी. (110 cm)',
    descriptionNepali: '१० वा २० पेयरको टर्मिनल बक्स जहाँ सेकेन्डरी केबल टर्मिनेट भई ड्रप वायरमा छुट्याइन्छ।',
    standardRule: 'पोलको टुप्पोबाट ११० सेमी मुनि ग्राहक पहुँचयोग्य स्थानमा कसिन्छ।',
    category: 'pole-fitting'
  },
  {
    item: 'Bridle Ring (ब्राइडल रिङ)',
    distanceFromTop: '११५ देखि १२० से.मी.',
    descriptionNepali: 'डीपी बक्सभन्दा मुनि ड्रप वायरहरूलाई हावा वा घर्षणबाट जोगाउन व्यवस्थित गाइड गर्ने रिङ।',
    standardRule: 'डीपी बक्सको ठीक मुनि ११५-१२० सेमीमा कसिन्छ।',
    category: 'pole-fitting'
  },
  {
    item: 'Low Voltage 230V Power Line Clearance',
    distanceFromTop: 'कम्तीमा ३० से.मी. (0.3m)',
    descriptionNepali: 'घरायसी २३०V लाइन र टेलिकम केबल बीचको न्यूनतम समानान्तर दूरी।',
    standardRule: 'कम्तीमा ३० सेमी वा छुट्टै डक्टमा राख्ने।',
    category: 'power-clearance'
  },
  {
    item: 'High Voltage 33kV / 66kV Power Clearance',
    distanceFromTop: 'कम्तीमा २.० मिटर (2m)',
    descriptionNepali: 'उच्च भोल्टेज ट्रान्समिसन लाइनबाट हुने विद्युतीय चुहावट र इन्डक्सनबाट जोगिन।',
    standardRule: 'कन्डक्टरभन्दा कम्तीमा २ मिटर मुनि मात्र टेलिकम केबल राख्ने।',
    category: 'power-clearance'
  },
  {
    item: 'Road Crossing Height Clearance',
    distanceFromTop: 'कम्तीमा ५.० मिटर (5m)',
    descriptionNepali: 'सवारी साधन आवतजावत हुने सडकमाथि केबल झुण्ड्याउँदा कायम गर्नुपर्ने उचाइ।',
    standardRule: 'सडक सतहबाट न्यूनतम ५ मिटर माथि हुनुपर्छ।',
    category: 'power-clearance'
  },
  {
    item: 'Pole Foundation Depth (खाल्डोको गहिराइ)',
    distanceFromTop: '१/६ भाग (1/6th of height)',
    descriptionNepali: '७m पोल = १.४m, ७.५m पोल = १.५m, ८m पोल = १.६m गहिराइ र ५०-६०cm चौडाइ।',
    standardRule: 'माटो, गिट्टी वा कंक्रीट हालेर ट्याम्पिङ टुलले कसिन्छ।',
    category: 'underground-depth'
  }
];
