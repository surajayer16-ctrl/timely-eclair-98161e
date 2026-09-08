export interface SurveyMapNode {
  id: string;
  titleNepali: string;
  titleEnglish: string;
  tag: string;
  descNepali: string;
  specs: Record<string, string>;
  keyNotes: string[];
}

export interface SurveyProcedureStep {
  step: number;
  title: string;
  desc: string;
  safety: string;
}

export interface SurveyVivaQuestion {
  q: string;
  a: string;
}

export interface CopperVsFiberItem {
  sn: number;
  copper: string;
  copperDetails: string;
  fiber: string;
  fiberDetails: string;
  roleInGwarko: string;
}

export interface FiberColorCodeRow {
  no: number;
  ntColorNepali: string;
  ntColorEnglish: string;
  intlColorNepali: string;
  intlColorEnglish: string;
  hex: string;
}

export interface NitvtChapter {
  id: string;
  chapterNo: number;
  titleNepali: string;
  titleEnglish: string;
  shortDesc: string;
  contentNepali: string;
  bulletPoints: string[];
  safetyOrAlert?: string;
}

export interface NitvtToolItem {
  nameNepali: string;
  nameEnglish: string;
  descNepali: string;
  iconName: string;
  usageTip: string;
}

export interface NitvtFaultItem {
  faultNepali: string;
  faultEnglish: string;
  causeNepali: string;
  preventionNepali: string;
}

export interface NitvtManualData {
  title: string;
  subtitle: string;
  organization: string;
  location: string;
  targetRole: string;
  copperVsFiber: CopperVsFiberItem[];
  chapters: NitvtChapter[];
  colorCodes: FiberColorCodeRow[];
  tools: NitvtToolItem[];
  faults: NitvtFaultItem[];
  safetyGuidelines: {
    laser: string[];
    glassShards: string[];
    aerial: string[];
    manhole: string[];
  };
}

export interface Level1FieldSurveyData {
  id: string;
  titleNepali: string;
  titleEnglish: string;
  subtitle: string;
  descriptionNepali: string;
  audioNarrationText: string;
  imageUrl: string;
  quickSpecs: {
    cabinetNo: string;
    dpNo: string;
    dropWireLength: string;
    customerAddress: string;
  };
  nodes: Record<string, SurveyMapNode>;
  procedures: SurveyProcedureStep[];
  vivaQuestions: SurveyVivaQuestion[];
  nitvtManual?: NitvtManualData;
}

export const defaultLevel1FieldSurveyData: Level1FieldSurveyData = {
  id: 'gwarko-udaya-basti-osp',
  titleNepali: 'नेपाल टेलिकम – ग्वार्को चोक, उदय बस्ती OSP फिल्ड सर्भे नक्सा',
  titleEnglish: 'Nepal Telecom – Gwarko Chowk, Udaya Basti OSP Field Survey Map',
  subtitle:
    'तह–१ प्रयोगात्मक परीक्षा तथा फिल्ड अभ्यासको वास्तविक नक्सा: क्याबिनेट-०९ बाट उदय बस्ती, पोल ०९/२८ देखि ०९/३२, र डि.पि. ३१ बाट हाउस नं. १६ (NITVT अफिस, ग्राउन्ड फ्लोर) सम्म ७० मिटर ड्रप वायर जडान रुट।',
  descriptionNepali:
    'यो नेपाल टेलिकमको ग्वार्को चोक, उदय बस्ती र हरितकोलोनी क्षेत्रको वास्तविक आउटसाइड प्लान्ट फिल्ड सर्भे नक्सा हो। यसमा क्याबिनेट नम्बर ०९ बाट पोल नम्बर ०९/२८, २९, ३०, ३१ र ३२ हुँदै डि.पि. नम्बर ३१ बाट हाउस नम्बर १६ ग्राउन्ड फ्लोरमा रहेको NITVT कार्यालय सम्म ७० मिटर ड्रप वायर तान्ने रुट स्पष्ट देखाइएको छ।',
  audioNarrationText:
    'यो नेपाल टेलिकमको ग्वार्को चोक, उदय बस्ती र हरितकोलोनी क्षेत्रको वास्तविक आउटसाइड प्लान्ट फिल्ड सर्भे नक्सा हो। यसमा क्याबिनेट नम्बर ०९ बाट पोल नम्बर ०९/२८, २९, ३०, ३१ र ३२ हुँदै डि.पि. नम्बर ३१ बाट हाउस नम्बर १६ ग्राउन्ड फ्लोरमा रहेको NITVT कार्यालय सम्म ७० मिटर ड्रप वायर तान्ने रुट स्पष्ट देखाइएको छ।',
  imageUrl: '/osp_level1_survey_map.jpg',
  quickSpecs: {
    cabinetNo: 'Cabinet No. 09',
    dpNo: 'DP No. 31 (Pole 09/31)',
    dropWireLength: '७० मिटर (३०m + ४०m)',
    customerAddress: 'House 16, Ground Floor (NITVT Offce)',
  },
  nodes: {
    cabinet09: {
      id: 'cabinet09',
      titleNepali: 'क्याबिनेट नं. ०९ (Cabinet No. 09 - Imadol Route)',
      titleEnglish: 'Distribution Cabinet No. 09',
      tag: 'Primary to Secondary Interface',
      descNepali:
        'ग्वार्को चोक एक्सचेन्जबाट आएको प्राथमिक फिडर केबल (Primary Feeder 300x0.5mm) यस क्याबिनेटमा टर्मिनेट हुन्छ। यहाँबाट सेकेन्डरी केबलहरू (Secondary Cables 70x0.4mm, 50x0.4mm) विभिन्न सडकका डीपीहरूमा पठाइन्छ।',
      specs: {
        'फिडर इनपुट': '300x0.5 mm Primary Cable',
        'सेकेन्डरी आउटपुट': '100x0.4 / 70x0.4 mm Secondary Cable',
        'अर्थिङ प्रतिरोध': '< १० ओम (Earth Pit)',
        'स्थान': 'ग्वार्को - इमाडोल / लुभु सडक संगम',
      },
      keyNotes: [
        'क्याबिनेट एरिया एक्सचेन्जबाट ५०० मिटर भन्दा टाढाको वितरण प्रणाली हो।',
        'क्याबिनेट भित्र भर्टिकल स्ट्रिपमा नम्बर साइड र लाइन साइड जम्परिङ गरिन्छ।',
      ],
    },
    pole28: {
      id: 'pole28',
      titleNepali: 'लठ्ठा नं. ०९/२८ (Pole 09/28 with Stay / Strut)',
      titleEnglish: 'Terminal / Angle Pole with Strut & Stay',
      tag: 'Angle Pole with Guy Wire',
      descNepali:
        'उदय बस्ती सडक मोडमा रहेको मुख्य पोल। यहाँ केबलको तनाव सन्तुलन गर्न स्टे वायर (Stay Wire) र स्ट्राउट (Strut) जडान गरिएको छ, जसलाई नक्सामा गोलो वृत्त चिन्हले दर्शाइएको छ।',
      specs: {
        'पोल नम्बरिङ': '०९/२८ (Cabinet 09, Pole 28)',
        'पोल प्रकार': '८ मिटर फलामे ट्यूबुलर वा कंक्रीट पोल',
        'खाडल गहिराइ': '१.३३ मिटर (पोल लम्बाइको १/६ भाग)',
        'सुरक्षा': 'स्टे सेट (४५° कोणमा स्टे सिट ४०-५०cm तल)',
      },
      keyNotes: [
        'मोड वा लाइनको अन्त्यमा पोललाई ढल्न नदिन स्टे वा स्ट्राउट अनिवार्य हुन्छ।',
        'स्टे इन्सुलेटर जमिनबाट ३ मिटर माथि राखिन्छ ताकि करेन्ट प्रवाह नहोस्।',
      ],
    },
    pole29_30: {
      id: 'pole29_30',
      titleNepali: 'मध्यवर्ती लठ्ठाहरू (Pole 09/29 & Pole 09/30)',
      titleEnglish: 'Intermediate Line Poles (09/29, 09/30)',
      tag: 'Intermediate Aerial Poles',
      descNepali:
        'उदय बस्ती सडक किनारमा रहेका सीधा लाइनका पोलहरू। यी पोलहरूमा ५० मिटरको स्प्यानमा सेकेन्डरी केबल टाँगिएको हुन्छ।',
      specs: {
        'स्प्यान दूरी': 'लगभग ४० देखि ५० मिटर प्रति पोल',
        'ब्राकेट फिटिङ': 'डिस्ट्रीब्युसन ब्राकेट (टुप्पोबाट २०cm) र पिन ब्राकेट (५०cm)',
        'ब्राइडल रिङ': '८० देखि ११० cm मा केबल गाइड',
      },
      keyNotes: [
        'सीधा रेखामा रहेका मध्यवर्ती पोलहरूमा अतिरिक्त स्टे आवश्यक पर्दैन।',
        'सडक वारपार गर्दा जमिनबाट न्यूनतम ५.५ मिटर उचाइ कायम गर्नुपर्छ।',
      ],
    },
    dp31: {
      id: 'dp31',
      titleNepali: 'डि.पि. नं. ३१ / पोल ०९/३१ (DP No. 31 on Pole 09/31)',
      titleEnglish: 'Distribution Point 31 (Pole 09/31)',
      tag: 'Subscriber Drop Take-off Point',
      descNepali:
        'उदय बस्ती सडकमा रहेको १०-पेयर डिस्ट्रिब्युसन प्वाइन्ट (DP Box)। यही डीपी बक्सबाट ग्राहक (NITVT Office, House No. 16) को लागि ड्रप वायर (D/W 70m) निकालिएको छ।',
      specs: {
        'डीपी क्षमता': '१० पेयर इन्टरनल क्रोने वा स्क्रू टर्मिनल बक्स',
        'फिटिङ उचाइ': 'पोलको टुप्पोबाट ११० cm तल',
        'इनकमर केबल': 'सेकेन्डरी कपर केबल (२०x०.४ mm)',
        'लाइन भोल्टेज': '-४८V DC (On-Hook Idle State)',
      },
      keyNotes: [
        'नक्सामा DP 31 लाई पोलको साथमा विशेष आयताकार/गोलो बक्स चिन्हले देखाइन्छ।',
        'डीपीमा पानी पस्न नदिन तलपट्टिबाट ड्रपवायर छिराएर ड्रिप लुप बनाउनुपर्छ।',
      ],
    },
    pole32: {
      id: 'pole32',
      titleNepali: 'लठ्ठा नं. ०९/३२ (Pole 09/32 - Line Continuation)',
      titleEnglish: 'Continuation Pole 09/32',
      tag: 'Route Extension',
      descNepali:
        'उदय बस्ती र हरितकोलोनी तर्फ लाइन अगाडि बढाउने निरन्तर पोल। यस पोलबाट बाँकी घरहरूमा लाइन वितरण गरिन्छ।',
      specs: {
        'पोल नम्बरिङ': '०९/३२',
        'गन्तव्य': 'उदय बस्ती अन्तिम विन्दु र हरितकोलोनी',
      },
      keyNotes: ['नेटवर्क विस्तारका लागि यस पोलमा थप डीपी बक्स राख्न सकिन्छ।'],
    },
    dropwire: {
      id: 'dropwire',
      titleNepali: 'ड्रप वायर स्प्यान ७० मिटर (D/W-70m Span)',
      titleEnglish: '70m Drop Wire Span (30m + 40m)',
      tag: 'Aerial Drop Cable Section',
      descNepali:
        'डीपी ३१ बाट NITVT कार्यालय सम्मको कुल ७० मिटर ड्रप वायर। लामो दूरी भएकाले यसलाई ३० मिटर (मध्यवर्ती स्टे/हुक सम्म) र ४० मिटर (घरको भित्ता सम्म) गरी दुई भागमा विभाजन गरिएको छ।',
      specs: {
        'कुल लम्बाइ': '७० मिटर (D/W-70)',
        'खण्ड १': '३० मिटर (DP 31 देखि मध्यवर्ती हुक सम्म)',
        'खण्ड २': '४० मिटर (मध्यवर्ती हुक देखि हाउस १६ सम्म)',
        'तार प्रकार': '०.९ mm कपर ड्रपवायर (G.I. बेयरिङ मेसेन्जर वायर सहित)',
        'अधिकतम सिफारिस स्प्यान': 'एकल स्प्यानमा ३५-४० मिटर भन्दा बढी हुनुहुँदैन',
      },
      keyNotes: [
        'एकै स्प्यान ७० मिटर तन्काउँदा हावाहुरी र तौलले तार चुँडिने वा स्याग (Sag) बढी हुने जोखिम हुन्छ।',
        'त्यसैले नक्सा अनुसार ३०m + ४०m गरी बीचमा सपोर्ट प्रयोग गरिएको छ।',
      ],
    },
    house16: {
      id: 'house16',
      titleNepali: 'हाउस नं. १६ - ग्राउन्ड फ्लोर (NITVT Office, House No. 16)',
      titleEnglish: 'Subscriber Premises - NITVT Office (House No. 16, Ground Floor)',
      tag: 'Subscriber Termination',
      descNepali:
        'लक्ष्य ग्राहक स्थान। डीपी ३१ बाट आएको ७० मिटर ड्रप वायर हाउस नं. १६ को ग्राउन्ड फ्लोरमा रहेको NITVT अफिसमा रोसेट बक्स र टेलिफोन सेटमा जोडिएको छ।',
      specs: {
        'ठेगाना': 'उदय बस्ती, ग्वार्को, हाउस नं. १६',
        'तल्ला': 'ग्राउन्ड फ्लोर (Ground Floor)',
        'कार्यालय': 'NITVT Offce (राष्ट्रिय प्राविधिक तालीम संस्थान)',
        'टर्मिनेशन': 'आई-हुक (Eye-Hook) + ड्रप वायर क्ल्याम्प + ड्रिप लुप + रोसेट बक्स',
      },
      keyNotes: [
        'भित्तामा तार छिराउनु अघि वर्षातको पानी भित्र नपसोस् भनी अनिवार्य Drip Loop बनाइन्छ।',
        'घरभित्र रोसेट बक्स (Rosette Box) मार्फत टेलिफोन सेट वा ADSL/VDSL मोडेम जोडिन्छ।',
      ],
    },
  },
  procedures: [
    {
      step: 1,
      title: 'चरण १: फिल्ड सर्भे नक्सा अध्ययन र विन्दु पहिचान',
      desc: 'नक्सा बमोजिम ग्वार्को चोकबाट उदय बस्ती सडक पछ्याउँदै क्याबिनेट ०९ र लठ्ठा नम्बर ०९/३१ मा रहेको DP 31 पत्ता लगाउने। पोल ०९/२८ को स्टे र ०९/३१ को डि.पि. बक्सको भौतिक अवस्था निरीक्षण गर्ने।',
      safety: 'सुरक्षा टोपी (Helmet) र सेफ्टी बेल्ट बिना पोलमा नचढ्ने।',
    },
    {
      step: 2,
      title: 'चरण २: DP 31 मा जोडी (Pair) परीक्षण तथा भोल्टेज मापन',
      desc: 'डीपी बक्स ३१ खोलेर तोकिएको पेयर नम्बरमा मल्टिमिटरको सहायताले अन-हुक भोल्टेज (-४८V DC) परीक्षण गर्ने। त्यसपछि टेस्ट टेलिफोन (Lineman Butt Set) जोडेर डायल टोन सफा आएको यकिन गर्ने।',
      safety: 'तार सर्ट हुन नदिन क्रोने टूल वा उपयुक्त इन्सुलेटेड स्क्रूड्राइभर प्रयोग गर्ने।',
    },
    {
      step: 3,
      title: 'चरण ३: ड्रप वायर (D/W 70m) नाप र स्प्यान विभाजन',
      desc: 'कुल दूरी ७० मिटर लामो भएकाले यसलाई नक्सा बमोजिम दुई स्प्यानमा बाँड्ने: (क) DP 31 पोलबाट मध्यवर्ती हुक सम्म ३० मिटर, र (ख) मध्यवर्ती हुकबाट हाउस १६ सम्म ४० मिटर। ३५-४० मिटर भन्दा लामो एकल स्प्यान राख्दा तार तन्किएर चुँडिने भएकाले बीचको सपोर्ट अनिवार्य प्रयोग गर्ने।',
      safety: 'सडक वारपार गर्दा गाडीले नभेट्टाउने गरी न्यूनतम ५.५ मिटर उचाइ कायम गर्ने।',
    },
    {
      step: 4,
      title: 'चरण ४: हाउस नं. १६ को भित्तामा क्ल्याम्पिङ र ड्रिप लुप',
      desc: 'हाउस नं. १६ को ग्राउन्ड फ्लोरको बाहिरी भित्तामा आई-हुक (Eye-Hook) ठोकेर ड्रप वायर क्ल्याम्पले तार कस्ने। त्यसपछि भित्तामा प्वाल पारी भित्र तार छिराउनु अघि वर्षातको पानी भित्र नपसोस् भनेर अनिवार्य रूपमा U-आकारको ड्रिप लुप (Drip Loop) बनाउने।',
      safety: 'भित्तामा ड्रिल गर्दा भित्रको बिजुली वायरिङ सुरक्षित रहेको यकिन गर्ने।',
    },
    {
      step: 5,
      title: 'चरण ५: NITVT अफिस भित्र रोसेट बक्स र टेलिफोन सेट जडान',
      desc: 'अफिस भित्र लिडिङ-इन वायरलाई रोसेट बक्स (Rosette Box) को L1 र L2 मा कस्ने। त्यसपछि टेलिफोन सेट जोडेर १९८ मा कल गरी वा अन्य नम्बरमा डायल गरी अडियो तथा रिङ परीक्षण गर्ने।',
      safety: 'सबै काम सकिएपछि डीपी बक्सको ढक्कन राम्रोसँग बन्द गरी लक गर्ने।',
    },
  ],
  vivaQuestions: [
    {
      q: 'नक्सामा उल्लेख भएको Cabinet No. 09 र DP No. 31 को अर्थ के हो?',
      a: 'क्याबिनेट ०९ भनेको एक्सचेन्जबाट प्राथमिक फिडर केबल आउने ९ नम्बरको क्याबिनेट हो, र डीपी ३१ भनेको सो क्याबिनेट मातहत रहेको ३१ नम्बरको १०-पेयर डिस्ट्रिब्युसन प्वाइन्ट बक्स हो।',
    },
    {
      q: 'ड्रप वायर (D/W) ७० मिटर लामो हुँदा ३० मिटर र ४० मिटर गरी दुई स्प्यानमा किन विभाजन गरिएको हो?',
      a: 'नेपाल टेलिकमको मापदण्ड अनुसार एरियल ड्रप वायरको एकल स्प्यान ३५ देखि ४० मिटर भन्दा बढी हुनुहुँदैन। ७० मिटर सिधै तन्काउँदा तारको आफ्नै तौल र हावाहुरीका कारण स्याग (Sag) अत्यधिक भई तार चुँडिने खतरा हुने भएकाले बीचमा सपोर्ट प्रयोग गरी ३०m + ४०m बनाइएको हो।',
    },
    {
      q: 'पोल नम्बर ०९/२८ मा गोलो वृत्त (Circle) चिन्हले के जनाउँछ?',
      a: 'यसले पोलमा स्टे वायर (Stay Wire) वा स्ट्राउट (Strut) जडान गरिएको छ भन्ने जनाउँछ। सडकको मोड वा लाइनको अन्त्यमा पोललाई तारको तनावले ढल्न नदिन स्टे अनिवार्य राखिन्छ।',
    },
    {
      q: 'ग्राहकको घर (House No. 16, Ground Floor) को भित्तामा ड्रिप लुप (Drip Loop) किन बनाइन्छ?',
      a: 'पानी परेको बेला ड्रप वायर हुँदै बग्ने वर्षातको पानी भित्ताको प्वालबाट सिधै कोठाभित्र नपसोस् भनेर तारलाई तल झुण्ड्याएर U-आकारको लुप बनाइन्छ, जसबाट पानी भुइँमा मात्र तप्किन्छ।',
    },
    {
      q: 'डीपी ३१ मा लाइनम्यान बटर सेट वा मल्टिमिटर जोड्दा कति भोल्टेज पाउनुपर्छ?',
      a: 'सामान्य अन-हुक (Idle) अवस्थामा -४८V DC भोल्टेज हुनुपर्छ। फोन उठाउँदा (Off-Hook) भोल्टेज घटेर ६ देखि १२V DC सम्म पुग्छ र रिङ आउँदा ७५ देखि ९०V AC भोल्टेज हुन्छ।',
    },
    {
      q: 'फिल्ड नक्सामा देखाइएको रिङ्ग रोड (उत्तर) र लुभु सडकमा कुन प्रकारको केबल बिछ्याइन्छ?',
      a: 'मुख्य सडकमा जमिनमुनि PLB HDPE डक्ट पाइप भित्र आर्मर्ड केबल (Underground Cable) बिछ्याइन्छ भने भित्री उदय बस्तीको गल्लीमा लठ्ठामा एरियल केबल (Aerial Cable) टाँगिन्छ।',
    },
  ],
  nitvtManual: {
    title: 'फाइबर अप्टिक नेटवर्क प्राविधिक म्यानुअल',
    subtitle: 'Fiber Optic Network Technical Manual',
    organization: 'नेपाल इन्स्टिच्युट अफ टेक्निकल एण्ड भोकेशनल ट्रेनिङ प्रा. लि. (NITVT)',
    location: 'ललितपुर, नेपाल (Estd. 2064)',
    targetRole: 'जूनियर टेलिकम टेक्निसियन (Junior Telecom Technician) को लागि उपयोगी',
    copperVsFiber: [
      {
        sn: 1,
        copper: 'मेन डिस्ट्रिब्युशन फ्रेम (MDF)',
        copperDetails: 'कापर एक्सचेन्जको स्विच र फिडर जोड्ने भर्टिकल र होरिजन्टल फ्रेम',
        fiber: 'अप्टिकल डिस्ट्रिब्युशन फ्रेम (ODF) / OLT',
        fiberDetails: 'अप्टिकल लाइन टर्मिनल (OLT) र फाइबर टर्मिनेशन फ्रेम',
        roleInGwarko: 'ग्वार्को एक्सचेन्जमा MDF को सट्टा उच्च गतिको OLT/ODF स्थापना'
      },
      {
        sn: 2,
        copper: 'प्राइमरी केबल (Primary Cable)',
        copperDetails: 'तामाको धेरै पेयर (300x0.5mm / 200x0.5mm) भएको भूमिगत केबल',
        fiber: 'फिडर फाइबर केबल (Feeder OFC)',
        fiberDetails: 'OLT देखि FDC सम्म जाने २४ वा ४८ कोर फाइबर केबल',
        roleInGwarko: 'ग्वार्को चोकबाट रिङरोड हुँदै क्याबिनेट ०९ रुटमा फिडर फाइबर'
      },
      {
        sn: 3,
        copper: 'क्याबिनेट (Cabinet No. 09 / CCC)',
        copperDetails: 'क्रस कनेक्ट क्याबिनेट जहाँ प्राथमिक र द्वितीयक तामा जोडिन्छ',
        fiber: 'फाइबर डिस्ट्रिब्युशन क्याबिनेट (FDC) / Splicing Closure',
        fiberDetails: 'प्राथमिक फिडर फाइबरलाई द्वितीयक डिस्ट्रिब्युशन फाइबरमा बाँड्ने क्याबिनेट',
        roleInGwarko: 'ग्वार्को चोक क्याबिनेट ०९ लाई एफ.डी.सी. (FDC-09) मा स्तरोन्नति'
      },
      {
        sn: 4,
        copper: 'डिस्ट्रिब्युशन प्वाइन्ट (DP No. 31)',
        copperDetails: 'लठ्ठा ०९/३१ मा रहेको १०-पेयर कापर DP Box',
        fiber: 'अप्टिकल डिस्ट्रिब्युशन बक्स (ODB / FDB No. 31)',
        fiberDetails: '१:८ वा १:१६ अप्टिकल स्प्लिटर (Optical Splitter) सहितको ODB बक्स',
        roleInGwarko: 'पोल ०९/३१ मा डीपी ३१ को ठाउँमा १:८ स्प्लिटर सहित ODB-31'
      },
      {
        sn: 5,
        copper: 'तामाको ड्रपवायर (Copper Drop Wire 70m)',
        copperDetails: '०.९ एमएम कपर तार (३०m + ४०m स्प्यान)',
        fiber: 'फाइबर ड्रप केबल (Bow-Type Drop Cable 70m)',
        fiberDetails: '१ वा २ कोर भएको मजबुत, लचिलो र हलुका Bow-Type फाइबर केबल',
        roleInGwarko: 'ODB 31 देखि हाउस १६ (NITVT अफिस) को ONT सम्म ७० मिटर Bow-Type'
      }
    ],
    chapters: [
      {
        id: 'ch1',
        chapterNo: 1,
        titleNepali: 'परिच्छेद १: आउटसाइड प्लान्ट (Outside Plant - OSP) र यसको फाइबर बनावट',
        titleEnglish: 'Chapter 1: Outside Plant (OSP) & Fiber Architecture',
        shortDesc: 'टेलिफोन कार्यालय (OLT) देखि ग्राहकको घर (ONT) सम्मको सम्पूर्ण फाइबर भौतिक संरचना र कापरबाट फाइबरमा स्तरोन्नति।',
        contentNepali:
          'टेलिफोन संचार माध्यमको एउटा प्रमुख अंग हो। यसले सूचना आदानप्रदान गर्नका लागि मद्दत गर्दछ। यसको बनावट टेलिकम कार्यालय देखि ग्राहकको घर सम्म जोडेको हुन्छ। परम्परागत रूपमा ग्राहकहरूले कुराकानी गर्न र इन्टरनेट सेवा प्रयोग गर्न टेलिफोन कार्यालयको एक्सचेन्जबाट स्वीचिङ बोर्ड केबलले एम.डि.एफ. (MDF) को नम्बर साइडमा टर्मिनेशन, नम्बर साइडबाट लाइन साइडमा जम्पर वायरले जम्पर गरी जोडिन्थ्यो। नम्बर साइडलाई एक्सचेन्ज साइड (E) र लाइन साइडलाई प्राइमरी साइड (D) भनिन्छ।\\n\\nटेलिकम नेटवर्क गर्दा तामाको तार (Copper Network) प्रयोग गर्ने गरिन्थ्यो। आधुनिक प्रविधि अनुसार तामाको केबललाई पूर्णरूपमा विस्थापित गरी फाइबर अप्टिक केबल (Optical Fiber Cable - OFC) को माध्यमबाट उच्च गतिको डाटा र भ्वाइस सेवा पुर्याउने संरचनालाई फाइबर आउटसाइड प्लान्ट (OSP) भनिन्छ। टेलिफोन कार्यालय (OLT) देखि ग्राहकको घर (ONT) सम्म जोडिएका फाइबर केबलहरू, तिनीहरूलाई संरक्षण गर्ने सामानहरू, स्प्लिटरहरू र पोलहरू आदिको सम्पूर्ण संरचना नै फाइबर नेटवर्कको आउटसाइड प्लान्ट हो।',
        bulletPoints: [
          '१) एरियल प्लान्ट (Aerial Plant): यसमा लठ्ठाहरू (Poles), एरियल फाइबर केबल (Aerial OFC), ड्रप फाइबर (Drop Cable), एरिब्यान्ड र एङ्करिङ क्ल्याम्पहरू पर्दछन्। यो जमिन माथिबाट हावामा टाँगिने प्लान्ट हो।',
          '२) अण्डरग्राउण्ड प्लान्ट (Underground Plant): यसमा जमिनमुनि बिछ्याइने फाइबर केबलहरू, डक्ट पाइप (Duct Pipes), म्यानहोल (Manholes) र ह्याण्डहोल (Handholes) पर्दछन्। यसले बाह्य वातावरणीय असरबाट केबललाई सुरक्षित राख्दछ।',
          '३) फिडर र डिस्ट्रिब्युशन फाइबर केबल: फाइबर केबलमा मुख्य रूपमा कोर (Core), क्लाडिङ (Cladding) र बाहिरी सुरक्षात्मक ज्याकेट (Sheath/Coating) हुन्छ। फाइबर केबलले प्रकाशको किरण (Light Pulse) को रूपमा डाटा प्रवाह गर्दछ। फिडर केबल OLT बाट FDC सम्म जान्छ र डिस्ट्रिब्युशन केबल FDC बाट ODB सम्म पुग्छ।',
          '४) अप्टिकल डिस्ट्रिब्युशन बक्स (ODB / FDB): कापरको १० पेयर भएको डि.पि. (DP) बक्सको सट्टा फाइबर नेटवर्कमा ODB प्रयोग गरिन्छ। यस भित्र अप्टिकल स्प्लिटर (Optical Splitter - १:८ वा १:१६) राखिएको हुन्छ, जसले एउटा मुख्य फाइबर कोरको सिग्नललाई ८ वा १६ वटा ग्राहकको घरमा बाँड्दछ।',
          '५) फाइबर ड्रप केबल (Drop Cable): ODB देखि ग्राहकको घर भित्र रहेको ONT (Optical Network Terminal / Router) सम्म लगिने १ वा २ कोर भएको अत्यन्तै बलियो र लचिलो केबल हो। कापरको ०.९ एमएम ड्रपवायर भन्दा धेरै गुणा हलुका र उच्च क्षमताको हुन्छ।',
          'प्राविधिक नोट: फाइबर अप्टिक नेटवर्कमा "जम्पर वायर" को सट्टा फाइबर अप्टिक प्याच कर्ड (Patch Cord) वा पिक्टेल (Pigtail) प्रयोग गरिन्छ। कापरको फल्ट परीक्षण गर्ने मल्टिमिटरको सट्टा फाइबरमा OTDR र लेजर सोर्स (VFL) को प्रयोग गरिन्छ।'
        ],
        safetyOrAlert: 'फाइबर अप्टिक नेटवर्कमा जम्पर वायरको सट्टा प्याच कर्ड/पिक्टेल र मल्टिमिटरको सट्टा OTDR/VFL अनिवार्य हुन्छ।'
      },
      {
        id: 'ch2',
        chapterNo: 2,
        titleNepali: 'परिच्छेद २: अण्डरग्राउण्ड र एरियल फाइबर नेटवर्कका विभिन्न भागहरू',
        titleEnglish: 'Chapter 2: Underground & Aerial Fiber Network Components',
        shortDesc: 'फ्युजन स्प्लाइस, जोइन्ट क्लोजर, म्यानहोल, ह्याण्डहोल, PLB HDPE डक्ट, नेटवर्क डायग्राम र नेपाल टेलिकम १२-कलर कोड।',
        contentNepali:
          'फाइबर अप्टिक नेटवर्कमा जमिनमुनि (Underground) र लठ्ठामा टाँगिने (Aerial) दुवै किसिमका पूर्वाधारहरू हुन्छन्। कापरको तार जस्तै फाइबरलाई हातले बटारेर जोड्न मिल्दैन। दुई फाइबर कोरहरूलाई अत्याधुनिक फ्युजन स्प्लाइसिङ मेसिन (Fusion Splicing Machine) को सहायताले ८००० डिग्री सेल्सियस भन्दा बढीको आगोको झिल्को (Electric Arc) दिएर एकापसमा पगालेर जोड्ने प्रक्रियालाई फाइबर स्प्लाइसिङ भनिन्छ।\\n\\nफाइबरको जोडिएको भागलाई पानी, धुलो र मेकानिकल दबाबबाट जोगाउन स्प्लाइस प्रोटेक्सन स्लिभ (Sleeve) भित्र राखेर प्लास्टिकको WATERPROOF बाकसमा बन्द गरिन्छ, जसलाई फाइबर जोइन्ट क्लोजर (OFC Closure) भनिन्छ।',
        bulletPoints: [
          '१) फ्युजन स्प्लाइस र जोइन्ट क्लोजर: दुई फाइबर कोरहरूलाई ८०००°C को इलेक्ट्रिक आर्क दिएर एकापसमा पगालेर जोडिन्छ। स्प्लाइस प्रोटेक्सन स्लिभ भित्र सुरक्षित गरी वाटरप्रूफ क्लोजरमा बन्द गरिन्छ।',
          '२) म्यानहोल (Manhole) र ह्याण्डहोल (Handhole): जमिनमुनि मुख्य फिडर फाइबर केबलहरू लैजाँदा केबलको लुप (Loop Room) र ठूला जोइन्ट क्लोजरहरू सुरक्षित राख्न कंक्रीटको कोठालाई म्यानहोल भनिन्छ। डिस्ट्रिब्युशन र ड्रप केबलको जोइन्ट राख्ने सानो भूमिगत बक्सलाई ह्याण्डहोल भनिन्छ।',
          '३) डक्ट (Duct) र एचडीपीई पाइप (PLB HDPE Duct): जमिनमुनि केबल सुरक्षित राख्न प्रयोग गरिने प्लास्टिक पाइप। यसको भित्री तहमा घर्षण कम गर्ने सिलिकन लेयर हुन्छ, जसले गर्दा हावाको दबाब (Blowing Method) द्वारा सजिलै केबल छिराउन सकिन्छ।',
          '४) टेलिकम नेटवर्क डायग्राम: टेलिकम कार्यालय (O-LT, O-DF, Cable Vault) -> प्राइमरी केबल (Manhole, Handhole, Duct, Splitter, Joint OFC) -> सेकेण्डरी केबल (Riser Pole, FDC, FAP, Stay) -> ग्राहकको लाइन (Fiber Drop Cable, House Wire, ONT/Wi-Fi Router, IP Phone)।',
          '५) फाइबर कलर कोडिङ व्यवस्था: नेपाल टेलिकम र अन्तर्राष्ट्रिय मापदण्ड (TIA/EIA-598) अनुसार १२ वटा रंगहरूको आधारमा कलर कोडिङ गरिएको हुन्छ। स्प्लाइस गर्दा यो कलर कोड कडाइका साथ पालना गर्नुपर्छ।'
        ],
        safetyOrAlert: 'भूमिगत डक्टमा केबल छिराउँदा सिलिकन लेयर र उच्च चाप हावा (Blowing Method) प्रयोग गरिन्छ।'
      },
      {
        id: 'ch3',
        chapterNo: 3,
        titleNepali: 'परिच्छेद ३: सुरक्षा सम्बन्धि नियमहरू र फाइबर प्रविधिको विशेष सावधानी',
        titleEnglish: 'Chapter 3: Safety Regulations & Fiber Technology Precautions',
        shortDesc: 'लेजर विकिरण सुरक्षा, सिसाका टुक्रा (Glass Shards) बाट बच्ने उपाय, पोलमा काम गर्दाका सुरक्षा नियम र म्यानहोल विषाक्त ग्यास सावधानी।',
        contentNepali:
          'फाइबर अप्टिक नेटवर्कमा काम गर्दा सामान्य शारीरिक सुरक्षाका अतिरिक्त फाइबर प्रविधिको संवेदनशीलताका कारण विशेष आधुनिक नियमहरू पालना गर्नु अनिवार्य हुन्छ। मुख्यतया फाइबर केबल भित्र प्रवाह हुने प्रकाश (Laser Light) नाङ्गो आँखाले देख्न सकिँदैन (Invisible Infrared Light)। यदि सक्रिय (Live) फाइबर कोरमा नाङ्गो आँखाले सिधै हेरेमा आँखाको रेटिना सधैँका लागि ड्यामेज हुन सक्छ। त्यसैले केबल काट्नु वा हेर्नु अगाडि लेजर पावर मिटरले जाँच गर्नुपर्छ।',
        bulletPoints: [
          '१) लेजर सुरक्षा (Laser Radiation Safety): फाइबर भित्रको अदृश्य इन्फ्रारेड लेजर किरणले आँखाको रेटिना जलाउन सक्छ। कहिल्यै पनि सक्रिय फाइबरको मुखमा नाङ्गो आँखाले सिधै नहेर्ने। जहिले पनि OPM वा लेजर पावर मिटरले जाँच गर्ने।',
          '२) फाइबरको टुक्रा (Fiber Glass Shards) बाट सुरक्षा: फाइबर स्ट्रिप वा क्लिभ गर्दा निस्कने सिसाका मसिना टुक्राहरू भुइँ वा कपडामा नछोड्ने। ती शरीर वा छाला भित्र छिरेमा वा खानासँग पुगेमा गम्भीर आन्तरिक चोट लाग्छ। जहिले पनि Fiber Trash Can मा संकलन गर्ने र Safety Glasses लगाउने।',
          '३) एरियल प्लान्ट सुरक्षा: पोलमा चढ्नु अघि पोल बलियो छ छैन र त्यसमा विद्युतीय प्रवाह (Current Leakage) छ छैन भनी टेस्टर वा भोल्टेज डिटेक्टरले जाँच्ने। सेफ्टी बेल्ट र हेल्मेट अनिवार्य लगाउने। भीडभाडमा सेफ्टी कोन र Signboards राख्ने। चट्याङ्ग वा हुरीबतासमा काम रोक्ने।',
          '४) म्यानहोल र भूमिगत सुरक्षा: म्यानहोल भित्र पस्नु अगाडि त्यहाँ जम्मा भएको विषाक्त ग्यास (Toxic Gases) बाहिर फाल्न बिर्को कम्तीमा आधा घण्टा खुला राख्ने। ग्यास डिटेक्टरले हावा शुद्ध भएको प्रमाणित गरेपछि मात्र भित्र पस्ने।',
          '५) प्रज्वलनशील पदार्थ निषेध: म्यानहोल भित्र वा बाहिर धुम्रपान गर्न वा आगो बाल्न सख्त मनाही छ, किनकि भूमिगत ग्यासले ठूलो विस्फोट गराउन सक्छ।'
        ],
        safetyOrAlert: 'चेतावनी: सक्रिय फाइबर कोरलाई नाङ्गो आँखाले कहिल्यै नहेर्नुहोस्! म्यानहोल पस्नु अघि कम्तीमा ३० मिनेट बिर्को खुला राखी ग्यास परीक्षण गर्नुहोस्।'
      },
      {
        id: 'ch4',
        chapterNo: 4,
        titleNepali: 'परिच्छेद ४: फाइबर आउटसाइड नेटवर्कमा प्रयोग हुने आधुनिक औजारहरू र फल्ट निवारण',
        titleEnglish: 'Chapter 4: Modern OFC Tools & FTTH Fault Troubleshooting',
        shortDesc: 'फ्युजन स्प्लाइसर, क्लिभर, स्ट्रिपर, OTDR, पावर मिटर, VFL, IPA र FTTH फल्ट (Macro-bending, Dust, Cable Cut) निवारण।',
        contentNepali:
          'कापर नेटवर्कमा प्रयोग हुने परम्परागत औजारहरू (जस्तै क्रोने टुल, क्रिम्पिङ टुल) फाइबर प्रविधिमा काम लाग्दैनन्। फाइबर अप्टिक नेटवर्क स्थापना र मर्मतका लागि अत्याधुनिक विशेष औजारहरू प्रयोग गरिन्छ। साथै, फाइबर ड्रप केबल जडान गर्दा र मर्मत गर्दा कापर केबल भन्दा फरक प्रकृतिका समस्याहरू आउँछन्, जसलाई समयमै पहिचान गरी मर्मत गर्नुपर्दछ।',
        bulletPoints: [
          '१) फ्युजन स्प्लाइसिङ मेसिन (Fusion Splicing Machine): दुईवटा अप्टिकल फाइबरका कोरहरूलाई Alignment गरी उच्च तापक्रम (८०००°C) मा पगालेर स्थायी रूपमा जोड्ने मुख्य मेसिन।',
          '२) फाइबर क्लिभर (Fiber Cleaver): फाइबरको सिसाको कोरलाई स्प्लाइस गर्नु अगाडि ९० डिग्रीको कोणमा सिधा र सफा काट्न प्रयोग गरिने विशेष कटर।',
          '३) फाइबर अप्टिक स्ट्रिपर (Miller Stripper): फाइबर केबलको बाहिरी प्लास्टिक ज्याकेट र फाइबर कोरको कोटिङलाई सुरक्षित रूपमा निकाल्न प्रयोग गरिने स्ट्रिपर।',
          '४) ओ.टी.डी.आर. (OTDR): फाइबर केबलको लम्बाइ, केबल भित्र फाइबर भाँचिएको वा फल्ट भएको दूरी (Fault Location) नाप्ने सबैभन्दा मुख्य यन्त्र।',
          '५) अप्टिकल पावर मिटर (OPM): फाइबर नेटवर्कमा प्रकाशको पावर (सिग्नलको शक्ति - dBm मा) नाप्न प्रयोग गरिने डिजिटल मिटर।',
          '६) भिजुअल फल्ट लोकेटर (VFL): फाइबर केबल भित्र रातो लेजर लाइट पठाएर फाइबर कोर कतै भाँचिएको छ छैन भनी पत्ता लगाउने सानो टर्च जस्तो यन्त्र।',
          '७) आइसोप्रोपाइल अल्कोहल (IPA): फाइबर केबललाई सफा गर्न प्रयोग गरिने ९९% शुद्ध केमिकल र धुलोरहित कपडा (Lint-free Wipes)।',
          '८) FTTH फल्ट निवारण: अत्यधिक केबल मोडिनु (Macro-bending), कनेक्टरमा धुलो पस्नु (Dust/Dirty Connector), केबल काटिनु (Cable Break), र खराब स्प्लाइस (High Splice Loss) मुख्य फल्ट हुन्।',
          '९) प्रिभेन्टिभ मेन्टेनेन्स: घर भित्र लैजाँदा फ्लेक्सिबल पाइप प्रयोग गर्ने, फास्ट कनेक्टरको सफाइ गर्ने, केबल तान्दा Cable Roller प्रयोग गर्ने, र बिजुलीको नाङ्गो तारबाट कम्तीमा १ मिटर दूरी राख्ने।'
        ],
        safetyOrAlert: 'फाइबर ड्रप केबल तान्दा Cable Roller प्रयोग गर्नुहोस् र बिजुलीको नाङ्गो तारबाट कम्तीमा १ मिटरको दूरी कायम गर्नुहोस्।'
      }
    ],
    colorCodes: [
      { no: 1, ntColorNepali: 'नीलो', ntColorEnglish: 'Blue', intlColorNepali: 'नीलो', intlColorEnglish: 'Blue', hex: '#2563eb' },
      { no: 2, ntColorNepali: 'सेतो', ntColorEnglish: 'White', intlColorNepali: 'सुन्तला', intlColorEnglish: 'Orange', hex: '#f8fafc' },
      { no: 3, ntColorNepali: 'पहेंलो', ntColorEnglish: 'Yellow', intlColorNepali: 'हरियो', intlColorEnglish: 'Green', hex: '#eab308' },
      { no: 4, ntColorNepali: 'हरियो', ntColorEnglish: 'Green', intlColorNepali: 'खैरो', intlColorEnglish: 'Brown', hex: '#16a34a' },
      { no: 5, ntColorNepali: 'खरानी', ntColorEnglish: 'Slate / Grey', intlColorNepali: 'खरानी (Gray)', intlColorEnglish: 'Slate (Gray)', hex: '#64748b' },
      { no: 6, ntColorNepali: 'रातो', ntColorEnglish: 'Red', intlColorNepali: 'सेतो', intlColorEnglish: 'White', hex: '#dc2626' },
      { no: 7, ntColorNepali: 'सुन्तला', ntColorEnglish: 'Orange', intlColorNepali: 'रातो', intlColorEnglish: 'Red', hex: '#ea580c' },
      { no: 8, ntColorNepali: 'कालो', ntColorEnglish: 'Black', intlColorNepali: 'कालो', intlColorEnglish: 'Black', hex: '#18181b' },
      { no: 9, ntColorNepali: 'गुलाबी', ntColorEnglish: 'Pink', intlColorNepali: 'पहेंलो', intlColorEnglish: 'Yellow', hex: '#ec4899' },
      { no: 10, ntColorNepali: 'बैजनी', ntColorEnglish: 'Violet / Purple', intlColorNepali: 'बैजनी (Purple)', intlColorEnglish: 'Violet (Purple)', hex: '#9333ea' },
      { no: 11, ntColorNepali: 'खैरो', ntColorEnglish: 'Brown', intlColorNepali: 'गुलाबी (Pink)', intlColorEnglish: 'Rose (Pink)', hex: '#854d0e' },
      { no: 12, ntColorNepali: 'आकाशी नीलो', ntColorEnglish: 'Aqua / Turquoise', intlColorNepali: 'आकाशी नीलो (Cyan)', intlColorEnglish: 'Aqua (Cyan)', hex: '#06b6d4' }
    ],
    tools: [
      {
        nameNepali: 'फ्युजन स्प्लाइसिङ मेसिन',
        nameEnglish: 'Fusion Splicing Machine',
        descNepali: 'दुईवटा अप्टिकल फाइबरका कोरहरूलाई अलाइनमेन्ट गरी ८०००°C तापक्रमको इलेक्ट्रिक आर्कले पगालेर स्थायी रूपमा जोड्ने मुख्य मेसिन।',
        iconName: 'Flame',
        usageTip: 'स्प्लाइसिङ इलेक्ट्रोड नियमित सफा राख्नुपर्छ र क्लिभ कोण १° भन्दा कम हुनुपर्छ।'
      },
      {
        nameNepali: 'फाइबर क्लिभर',
        nameEnglish: 'Fiber Cleaver (High Precision)',
        descNepali: 'फाइबरको सिसाको कोरलाई स्प्लाइस गर्नु अगाडि ठ्याक्कै ९० डिग्रीको कोणमा सिधा र ऐना जस्तै सफा काट्न प्रयोग गरिने विशेष कटर।',
        iconName: 'Scissors',
        usageTip: 'ब्लेडको उचाइ र स्थिति सही राख्नुपर्छ, ब्लेडले सिसालाई क्र्यास नगरी सिधा काट्नुपर्छ।'
      },
      {
        nameNepali: 'फाइबर अप्टिक स्ट्रिपर',
        nameEnglish: 'Miller Stripper (3-Hole)',
        descNepali: 'फाइबर केबलको बाहिरी ज्याकेट, बफर ट्युब र २५०μm एक्रिलेट कोटिङलाई १२५μm कोर नकोरिने गरी ताछ्न प्रयोग गरिने स्ट्रिपर।',
        iconName: 'Wrench',
        usageTip: '३-होल स्ट्रिपरमा सही होल प्रयोग गर्नुपर्छ ताकि सिसा कोरमा कोतरिन नपाओस्।'
      },
      {
        nameNepali: 'ओ.टी.डी.आर.',
        nameEnglish: 'OTDR (Optical Time Domain Reflectometer)',
        descNepali: 'फाइबर केबलको लम्बाइ, एटेन्युएसन लस, स्प्लाइस लस र केबल काटिएको वा भाँचिएको दूरी (Fault Distance in km/m) पत्ता लगाउने मुख्य यन्त्र।',
        iconName: 'Activity',
        usageTip: 'इभेन्ट टेबलमा रिफ्लेक्टिभ र नन-रिफ्लेक्टिभ इभेन्टहरूको विश्लेषण गरी फल्ट पत्ता लगाइन्छ।'
      },
      {
        nameNepali: 'अप्टिकल पावर मिटर',
        nameEnglish: 'Optical Power Meter (OPM)',
        descNepali: 'फाइबर नेटवर्कमा लेजर सिग्नलको शक्ति (dBm मा) नाप्न प्रयोग गरिने डिजिटल मिटर। FTTH मा -१५ dBm देखि -२४ dBm सामान्य मानिन्छ।',
        iconName: 'Gauge',
        usageTip: 'वेभलेन्थ (1310nm, 1490nm वा 1550nm) सही छनोट गरी क्यालिब्रेसन गर्नुपर्छ।'
      },
      {
        nameNepali: 'भिजुअल फल्ट लोकेटर',
        nameEnglish: 'Visual Fault Locator (VFL - Red Laser)',
        descNepali: '६५०nm वेभलेन्थको रातो लेजर प्रकाश पठाएर फाइबर कोर कतै भाँचिएको वा च्यातिएको छ छैन भनी उज्यालो रातो प्रकाश मार्फत हेर्ने यन्त्र।',
        iconName: 'Zap',
        usageTip: 'ड्रप केबल वा प्याच कर्डमा म्याक्रोबेन्डिङ वा भाँचिएको ठाउँमा रातो प्रकाश बाहिर चम्किन्छ।'
      },
      {
        nameNepali: 'आइसोप्रोपाइल अल्कोहल र कपडा',
        nameEnglish: 'IPA (99% Pure) & Lint-Free Wipes',
        descNepali: 'फाइबरको सिसा सफा गर्न प्रयोग गरिने ९९% शुद्ध केमिकल र धुलो नउड्ने लिन्ट-फ्री विशेष वाइप्स कपडा।',
        iconName: 'Sparkles',
        usageTip: 'साधारण पानी वा पेट्रोल प्रयोग गर्नु हुँदैन; ९९% आईपीएले मात्र सिसाको कोटिङ सफा गर्छ।'
      }
    ],
    faults: [
      {
        faultNepali: 'अत्यधिक केबल मोडिनु (म्याक्रोबेन्डिङ)',
        faultEnglish: 'Macro-bending Fault',
        causeNepali: 'फाइबर केबललाई यसको तोकिएको मोडिने क्षमता (Bending Radius - न्यूनतम ३०mm) भन्दा बढी कडा कोणमा बङ्गाउँदा प्रकाश बाहिर जान्छ वा कोर भाँचिन्छ।',
        preventionNepali: 'घरको कुना वा ढोका/झ्यालमा तार लैजाँदा ९० डिग्रीमा नमोडी नरम कर्भ बनाउने र फ्लेक्सिबल पाइप प्रयोग गर्ने।'
      },
      {
        faultNepali: 'कनेक्टरमा धुलो वा फोहोर पस्नु',
        faultEnglish: 'Dust / Dirty Connector',
        causeNepali: 'ODB बक्सको ढक्कन खुला राख्दा वा फास्ट कनेक्टर/एडेप्टरमा नाङ्गो हातले छुँदा धुलो वा तेल पसेर सिग्नल ब्लक हुनु।',
        preventionNepali: 'काम नगर्दा जहिले पनि डस्ट क्याप लगाउने र जडान गर्नु अघि आईपीए र लिन्ट-फ्री कपडाले सफा गर्ने।'
      },
      {
        faultNepali: 'केबल काटिनु वा चुँडिनु',
        faultEnglish: 'Fiber Cut / Cable Break',
        causeNepali: 'बाटो विस्तार गर्दा, अग्ला टिपर/गाडीले तार तान्दा, रुखका हाँगा खस्दा वा हावाहुरीमा एरियल केबल चुँडिनु।',
        preventionNepali: 'सडक वारपार गर्दा न्यूनतम ५.५ मिटर उचाइ कायम गर्ने, केबल रोलर प्रयोग गर्ने र उपयुक्त स्टे/च्यानल सपोर्ट राख्ने।'
      },
      {
        faultNepali: 'खराब स्प्लाइस जोइन्ट (उच्च लस)',
        faultEnglish: 'Poor Fusion Splicing (High Loss)',
        causeNepali: 'फ्युजन स्प्लाइस गर्दा मेसिनको इलेक्ट्रोड फोहोर हुनु, क्लिभरले सिधा ९०° नकाट्नु वा सिसामा धुलो टाँसिनु।',
        preventionNepali: 'क्लिभिङ कोण १° भन्दा कम राख्ने, मेसिनको वी-ग्रुभ सफा गर्ने र स्प्लाइसिङ लस ०.०२ dB भन्दा कम सुनिश्चित गर्ने।'
      }
    ],
    safetyGuidelines: {
      laser: [
        'फाइबर भित्रको अदृश्य इन्फ्रारेड लेजर प्रकाशले आँखाको रेटिनामा अपूरणीय क्षति पुर्याउन सक्छ।',
        'कुनै पनि फाइबर केबलको मुखमा नाङ्गो आँखाले सिधै कहिल्यै नहेर्नुहोस्।',
        'केबल काट्नु वा निरीक्षण गर्नु अघि सधैँ अप्टिकल पावर मिटर (OPM) ले लेजर सक्रिय छ छैन जाँच्नुहोस्।'
      ],
      glassShards: [
        'फाइबर क्लिभ गर्दा निस्कने सिसाका मसिना टुक्राहरूलाई जथाभावी भुइँ वा लुगामा नफाल्नुहोस्।',
        'सबै सिसाका टुक्राहरूलाई बन्द फाइबर ट्र्यास क्यान (Fiber Trash Can) मा मात्र संकलन गरी विसर्जन गर्नुहोस्।',
        'फाइबर स्ट्रिपिङ र क्लिभिङ गर्दा जहिले पनि सेफ्टी चश्मा (Safety Glasses) लगाउनुहोस्।'
      ],
      aerial: [
        'पोलमा चढ्नु अघि पोल बलियो छ छैन र विद्युतीय लिकेज (Current Leakage) छ छैन टेस्टरले जाँच्नुहोस्।',
        'स्वीकृत मापदण्डको सेफ्टी बेल्ट (Safety Belt) र हेल्मेट (Helmet) बिना पोलमा नचढ्नुहोस्।',
        'सडकमा काम गर्दा सेफ्टी कोन (Safety Cones) र Work in Progress बोर्ड अनिवार्य राख्नुहोस्।',
        'चट्याङ्ग पर्ने, वर्षात हुने वा ठूलो हुरीबतास चलेको बेला पोलमा चढ्ने काम तुरुन्त रोक्नुहोस्।'
      ],
      manhole: [
        'म्यानहोल भित्र पस्नु अघि जम्मा भएको विषाक्त ग्यास (Toxic Gases) बाहिर निकाल्न कम्तीमा ३० मिनेट बिर्को खुला राख्नुहोस्।',
        'ग्यास डिटेक्टरले अक्सिजन र हावा शुद्ध भएको प्रमाणित गरेपछि मात्र भित्र पस्नुहोस्।',
        'म्यानहोल भित्र वा नजिकै धुम्रपान गर्न वा आगो बाल्न सख्त निषेध छ (विस्फोटको ठूलो जोखिम हुन्छ)।'
      ]
    }
  }
};

import { saveImageToIndexedDb, getImageFromIndexedDb } from '../lib/fileStorageDb';

export const LEVEL1_SURVEY_MAP_STORAGE_KEY = 'nitvt_level1_field_survey_map';

export function getLevel1FieldSurveyData(): Level1FieldSurveyData {
  try {
    const saved = localStorage.getItem(LEVEL1_SURVEY_MAP_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const result: Level1FieldSurveyData = {
        ...defaultLevel1FieldSurveyData,
        ...parsed,
        quickSpecs: {
          ...defaultLevel1FieldSurveyData.quickSpecs,
          ...(parsed.quickSpecs || {}),
        },
        nodes: {
          ...defaultLevel1FieldSurveyData.nodes,
          ...(parsed.nodes || {}),
        },
        procedures: Array.isArray(parsed.procedures) && parsed.procedures.length > 0
          ? parsed.procedures
          : defaultLevel1FieldSurveyData.procedures,
        vivaQuestions: Array.isArray(parsed.vivaQuestions) && parsed.vivaQuestions.length > 0
          ? parsed.vivaQuestions
          : defaultLevel1FieldSurveyData.vivaQuestions,
        nitvtManual: parsed.nitvtManual || defaultLevel1FieldSurveyData.nitvtManual,
      };

      // Hydrate image from IndexedDB if not in localStorage or if indexedDB has richer copy
      if (typeof window !== 'undefined') {
        getImageFromIndexedDb('nitvt_level1_survey_map_img').then((cachedImg) => {
          if (cachedImg && cachedImg !== result.imageUrl) {
            result.imageUrl = cachedImg;
            window.dispatchEvent(new CustomEvent('nitvt_level1_field_survey_map_updated', { detail: result }));
          }
        }).catch(() => {});
      }

      return result;
    }
  } catch (err) {
    console.error('Failed to load level1 field survey map data:', err);
  }
  return defaultLevel1FieldSurveyData;
}

export function saveLevel1FieldSurveyData(data: Level1FieldSurveyData): void {
  try {
    if (data.imageUrl) {
      saveImageToIndexedDb('nitvt_level1_survey_map_img', data.imageUrl);
    }
    localStorage.setItem(LEVEL1_SURVEY_MAP_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('nitvt_level1_field_survey_map_updated', { detail: data }));
  } catch (err) {
    console.error('Failed to save level1 field survey map data:', err);
    // If localStorage quota exceeded, save image in IndexedDB and rest in localStorage
    try {
      if (data.imageUrl) {
        saveImageToIndexedDb('nitvt_level1_survey_map_img', data.imageUrl);
      }
      const lightweightData = { ...data, imageUrl: 'INDEXED_DB' };
      localStorage.setItem(LEVEL1_SURVEY_MAP_STORAGE_KEY, JSON.stringify(lightweightData));
      window.dispatchEvent(new CustomEvent('nitvt_level1_field_survey_map_updated', { detail: data }));
    } catch (_) {}
  }
}


export function resetLevel1FieldSurveyData(): Level1FieldSurveyData {
  try {
    localStorage.removeItem(LEVEL1_SURVEY_MAP_STORAGE_KEY);
    window.dispatchEvent(
      new CustomEvent('nitvt_level1_field_survey_map_updated', { detail: defaultLevel1FieldSurveyData })
    );
  } catch (err) {
    console.error('Failed to reset level1 field survey map data:', err);
  }
  return defaultLevel1FieldSurveyData;
}
