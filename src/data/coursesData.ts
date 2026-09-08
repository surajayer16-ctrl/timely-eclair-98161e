import { Course } from '../types';

export const instituteInfo = {
  nameNepali: 'सुरेन्द्र ऐर (Surendra Air)',
  nameEnglish: 'Nepal Institute of Technical & Vocational Training (NITVT) Pvt. Ltd.',
  establishedNepali: '२०६४ साल (विगत १९ वर्षको गौरवमय प्राविधिक तालिम इतिहास)',
  affiliation: 'प्राविधिक शिक्षा तथा व्यावसायिक तालीम परिषद् (CTEVT) बाट सम्बन्धन प्राप्त',
  locationNepali: 'महालक्ष्मी नगरपालिका-०२, ललितपुर, नेपाल (बालकुमारी/ उदयबस्ती)',
  phonePrimary: '०१-५२०३५२२',
  phoneSecondary: '९८४८८०५११९',
  phoneAlternate: '०१-५१२१५१५',
  email: 'nitvtnepal@gmail.com',
  emailTop: 'surajayer16@gmail.com',
  website: 'www.surendraair.com.np',
  regdNo: '46341/063/064',
  panNo: '302883240',
  accreditationDetails: 'CTEVT, राष्ट्रिय सीप परीक्षण समिति (National Skill Testing Board - NSTB) बाट मान्यता प्राप्त परीक्षा केन्द्र',
  keyHighlights: [
    'विगत १९ वर्षदेखि नेपालमै सबैभन्दा धेरै टेलिकम प्राविधिकहरू उत्पादन गरेको अग्रणी संस्था (सुरेन्द्र ऐर)',
    'तालिम पश्चात सीटीईभीटी, राष्ट्रिय सीप परीक्षण समितिबाट सीपको परीक्षण (Skill Test) पश्चात आधिकारिक प्रमाणपत्र प्राप्त हुने',
    'Practical को लागि आफ्नै सम्पूर्ण आधुनिक पूर्वाधार (Fusion Splicer, OTDR, Power Meter, Cable Poling Yard) भएको एक मात्र संस्था',
    'तालिम पश्चात नेपाल टेलिकम (NTC), Ncell तथा अग्रणी इन्टरनेट प्रदायक संस्थाहरू (WorldLink, Vianet, DishHome, Subisu) मा रोजगारीको प्रत्यक्ष अवसर',
    'अनुभवी, दक्ष तथा नेपाल टेलिकमका पूर्व-इन्जिनियरहरूबाट सरल, प्रभावकारी र व्यवहारिक प्रशिक्षण',
    'Optical Fiber, Telecom तथा Networking सम्बन्धी आधुनिक प्रविधि र उपकरणमा १००% प्रयोगात्मक अभ्यास',
    'सीप भएका तर प्रमाणपत्र नभएका अनुभवी कामदारहरूका लागि Skill Test तयारी तथा सहजीकरण विशेष कक्षा',
  ],
  targetAudience: [
    {
      title: 'साधारण लेखपढ जान्ने व्यक्तिहरू',
      desc: 'प्राविधिक क्षेत्रमा आफ्नो करियर सुरु गर्न चाहने नयाँ युवायुवतीहरू।',
    },
    {
      title: 'इन्टरनेट कम्पनी (ISP) मा कार्यरत प्राविधिकहरू',
      desc: 'FTTH, Fiber Splicing, OTDR Testing र Fault Restoration मा दक्षता बढाउन।',
    },
    {
      title: 'नेपाल टेलिकममा कार्यरत कर्मचारीहरू',
      desc: 'आधिकारिक CTEVT / NSTB Level-1 र Level-2 प्रमाणपत्र मार्फत बढुवा (Promotion) का लागि।',
    },
    {
      title: 'इन्जिनियरिङ (Electronics & Communication, IT, Electrical) विद्यार्थीहरू',
      desc: 'सैद्धान्तिक ज्ञानलाई फिल्ड लेभलको Practical Telecom & Fiber Optic सीपसँग जोड्न।',
    },
    {
      title: 'स्वदेश वा विदेशमा रोजगारी खोज्नेहरू',
      desc: 'गल्फ, युरोप वा अन्य देशहरूमा Telecom/Fiber Optic प्राविधिकका रूपमा उच्च तलबमा काम गर्न।',
    },
    {
      title: 'प्रमाणपत्रविहीन अनुभवी कामदारहरू',
      desc: 'पहिलेदेखि फिल्डमा काम गरिरहेका तर औपचारिक CTEVT / NSTB प्रमाणपत्र नभएकाहरूको लागि सीप परीक्षण तयारी।',
    }
  ]
};

export const coursesList: Course[] = [
  {
    id: 'optical-fiber-technician',
    titleNepali: 'अप्टिकल फाईबर टेक्निसियन तालिम (FTTH & OFC Specialist)',
    titleEnglish: 'Optical Fiber Technician Training',
    level: 'Specialist / Pro Level',
    duration: '१ महिना (दैनिक ६ घण्टा) / १५ दिन (फास्ट ट्र्याक)',
    practicalPercentage: 85,
    badge: 'सर्वाधिक माग भएको कोर्स',
    icon: 'Zap',
    upcomingBatch: 'नयाँ भर्ना खुला (Morning: 7-9 AM / Evening: 4-6 PM)',
    description: 'आधुनिक FTTH, OLT, ODF, FDC, Fusion Splicing, Cleaving, OTDR Trace Interpretation, Visual Fault Locator र Fiber Route Planning को पूर्ण प्रयोगात्मक तालिम।',
    features: [
      'फ्युजन स्प्लाइसिङ मेसिन (Fusion Splicer) मा वास्तविक फाइबर जोड्ने अभ्यास',
      'फाइबर क्लिभर (Fiber Cleaver) बाट ९०° Precision Cleaving प्रविधि',
      'OTDR (Optical Time Domain Reflectometer) बाट Fault Distance र Loss Measurement',
      'Optical Power Meter (OPM) र Visual Fault Locator (VFL) सञ्चालन',
      '१२-कोर NTC तथा TIA/EIA-598 अन्तर्राष्ट्रिय कलर कोडिङ कण्ठस्थ तालिम',
      'FTTH Drop Cable, Joint Closure (OJC) र FAP / FAT Box जडान कार्य',
      'लेजर सुरक्षा र ग्लास सार्ड्स (Fiber Glass Shards) सुरक्षा सावधानी'
    ],
    targetAudience: [
      'इन्टरनेट सेवा प्रदायक (ISPs) मा काम गर्न चाहनेहरू',
      'विदेशमा Fiber Technician भिसामा जान चाहनेहरू',
      'FTTH नेटवर्क निर्माण र मर्मतमा संलग्न प्राविधिकहरू'
    ],
    jobProspects: [
      'FTTH Splicing Engineer / Technician',
      'ISP Field Support Lead (WorldLink, Vianet, ClassicTech, Subisu)',
      'OFC Maintenance Specialist (Nepal Telecom, Ncell)',
      'Gulf & Overseas Fiber Optic Installer'
    ]
  },
  {
    id: 'junior-telecom-level-1',
    titleNepali: 'जुनियर टेलिकम टेक्निसियन तालिम तह–१ (Junior Telecom Technician Level-1)',
    titleEnglish: 'Junior Telecom Technician (CTEVT Level 1)',
    level: 'CTEVT तह-१ (Level-1)',
    duration: '३ महिना (३९० घण्टा)',
    practicalPercentage: 80,
    badge: 'CTEVT मान्यता प्राप्त तह-१',
    icon: 'Radio',
    upcomingBatch: 'नयाँ भर्ना खुला (Morning / Day / Evening)',
    description: 'बाहिरी प्लान्ट (Outside Plant - OSP), पोल जडान, ड्रप वायर तान्ने, UY कनेक्टर, रोजेट बक्स, बेसिक कपर नेटवर्क, ल्यान्डलाइन परीक्षण र प्राथमिक सुरक्षा सम्बन्धी आधारभूत तहको राष्ट्रिय तालिम।',
    features: [
      'आउटसाइड प्लान्ट (OSP) र पोल इरेक्सन (Pole Erection) प्रविधि',
      'कपर केबल (Copper Cable), २५-पेयर कलर कोड र बाइन्डर रङ पहिचान',
      'DP (Distribution Point) बक्स, रोजेट बक्स र ADSL स्प्लिटर जडान',
      'ड्रप वायर (Drop Wire) फास्नर, ब्राइडल रिङ र हुक फिक्सिङ',
      'टेलिफोन सेट भोल्टेज परीक्षण (-48V DC On-Hook, 6-12V Talking, 75-90V AC Ringing)',
      'मल्टिमिटर, क्ल्याम्प मिटर र बेसिक इलेक्ट्रिकल सुरक्षा',
      'राष्ट्रिय सीप परीक्षण समिति (NSTB) तह-१ परीक्षा विशेष तयारी'
    ],
    targetAudience: [
      '८ कक्षा वा एसईई (SEE) उत्तीर्ण युवाहरू',
      'नेपाल टेलिकममा लाइनम्यान / हेल्परका रूपमा काम सुरु गर्न चाहनेहरू',
      'इन्टरनेट कम्पनीमा फिल्ड लेभल टेक्निसियन बन्न चाहनेहरू'
    ],
    jobProspects: [
      'Junior Telecom Lineman',
      'Customer Premises Telecom Installer',
      'Nepal Telecom Outside Plant Assistant',
      'CCTV & Local Network Wireman'
    ]
  },
  {
    id: 'telecom-technician-level-2',
    titleNepali: 'टेलिकम टेक्निसियन तालिम तह–२ (Telecom Technician Level-2)',
    titleEnglish: 'Telecom Technician (CTEVT Level 2)',
    level: 'CTEVT तह-२ (Level-2)',
    duration: '१० महिना (१६९६ घण्टा)',
    practicalPercentage: 75,
    badge: 'व्यावसायिक इन्जिनियरिङ स्तर',
    icon: 'Cpu',
    upcomingBatch: 'नयाँ भर्ना खुला (Morning & Evening Batches)',
    description: 'पूर्ण व्यावसायिक पाठ्यक्रम: MDF जम्परीङ, क्याबिनेट टर्मिनेसन, म्यानहोल/डक्टिङ, ट्रान्सफर्मर, एसी/डीसी कन्भर्जन, अर्थिङ रेजिस्टेन्स टेस्टिङ, ईपीएबीएक्स (EPABX) प्रोग्रामिङ, जीएसएम/सीडीएमए र नेटवर्क माइग्रेसन।',
    features: [
      'MDF (Main Distribution Frame) मा जम्पर वायर ड्रेसिङ र लाइन म्यापिङ',
      'क्याबिनेट (Cabinet / CCC) टर्मिनेसन र सेकेन्डरी पोलिङ डिजाइन',
      'अर्थिङ टेस्टिङ (Earth Resistance Tester / Fall-of-Potential Megger)',
      'डिजिटल इलेक्ट्रोनिक्स (Boolean Theorems, Logic Gates, De Morgan Laws)',
      'रेक्टिफायर (Half-Wave, Full-Wave Bridge) र क्यापासिटर फिल्टर सर्किट',
      'EPABX Hi-Tech Model (308/412/616) कमाण्ड प्रोग्रामिङ',
      'GSM Network Architecture (BTS, BSC, MSC, HLR, VLR) र माइग्रेसन',
      'CTEVT Level-2 सैद्धान्तिक तथा प्रयोगात्मक १००% नतिजामुखी परीक्षा तयारी'
    ],
    targetAudience: [
      'तह-१ उत्तीर्ण वा ३ वर्षभन्दा बढी टेलिकम अनुभव भएका कामदारहरू',
      'डिप्लोमा / इन्जिनियरिङ विद्यार्थीहरू र टेलिकममा बढुवा चाहने कर्मचारीहरू',
      'नेटवर्क सुपरभाइजर वा प्रोजेक्ट इन्चार्ज बन्न चाहने प्राविधिकहरू'
    ],
    jobProspects: [
      'Senior Telecom Technician (Nepal Telecom / Ncell)',
      'Telecom Exchange & MDF Supervisor',
      'PBX & Corporate Telecom Systems Engineer',
      'Outside Plant Network Survey & Project Lead'
    ]
  },
  {
    id: 'building-vocational-trades',
    titleNepali: 'अन्य निर्माण तथा प्राविधिक तालिमहरू (Building & Vocational Trades)',
    titleEnglish: 'Other Technical & Vocational Trade Courses',
    level: 'CTEVT / NSTB Skill Certified',
    duration: '१ देखि ३ महिना',
    practicalPercentage: 90,
    badge: 'रोजगारमुखी व्यावसायिक तालिम',
    icon: 'Wrench',
    upcomingBatch: 'प्रत्येक महिनाको १ र १५ गते नयाँ भर्ना',
    description: 'मेसन (Mason), प्लम्बर (Plumber), कार्पेन्टर (Carpenter), वेल्डर (Welder), इलेक्ट्रिसियन (Electrician), टेलरिङ (Tailoring), स्टिल फिक्सर (Steel Fixer), र असिस्टेन्ट ब्युटिसियन (Assistant Beautician)।',
    features: [
      'मेसन (Mason) र प्लम्बर (Plumber) व्यावहारिक निर्माण तालिम',
      'हाउस वायरिङ तथा इन्डस्ट्रियल इलेक्ट्रिसियन (Electrician)',
      'आर्क तथा ग्यास वेल्डिङ (Welder) प्रयोगात्मक तालिम',
      'फिनिसिङ तथा सटरिङ कार्पेन्टर (Carpenter)',
      'स्टिल फिक्सर (Steel Fixer) र टेलरिङ (Tailoring)',
      'असिस्टेन्ट ब्युटिसियन (Assistant Beautician) ब्युटी पार्लर तालिम'
    ],
    targetAudience: [
      'दक्ष सीप सिकेर स्वदेशमै व्यवसाय गर्न चाहनेहरू',
      'वैदेशिक रोजगारीका लागि प्रमाणित सीप तथा प्रमाणपत्र आवश्यक भएकाहरू'
    ],
    jobProspects: [
      'Self-Employed Technical Contractor',
      'Certified Gulf/Overseas Skilled Worker',
      'Industrial Maintenance Professional'
    ]
  }
];
