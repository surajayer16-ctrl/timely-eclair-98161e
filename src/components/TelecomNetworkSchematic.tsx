import React, { useState, useEffect } from 'react';
import {
  Layers,
  Network,
  CheckCircle2,
  ChevronRight,
  Info,
  Radio,
  Zap,
  Play,
  RotateCcw,
  Volume2,
  Shield,
  HelpCircle,
  Wrench,
  Sparkles,
  ArrowRight,
  Phone,
  Server,
  Cable,
  Building,
  Home
} from 'lucide-react';
import { telecomNetworkSchematicNodes, SchematicComponent } from '../data/level1CourseData';

// FTTH specific nodes definitions
const ftthNetworkSchematicNodes: SchematicComponent[] = [
  {
    id: 'olt',
    section: 'office',
    sectionNepali: 'टेलिकम कार्यालय (Telecom Central Office)',
    nameNepali: 'ओ-एल-टी (O-LT / Optical Line Terminal)',
    nameEnglish: 'Optical Line Terminal (OLT)',
    shortDesc: 'FTTH नेटवर्कको मुख्य केन्द्रिय स्विचिङ उपकरण जसले फाइबर सिग्नल उत्पन्न गर्छ।',
    detailedFunctionNepali: 'यो टेलिकम कार्यालयमा राखिने मुख्य यन्त्र हो। यसले ग्राहक तर्फ प्रकाशको सिग्नल (Optical Signal) पठाउने र ग्राहकबाट प्राप्त डेटालाई मुख्य नेटवर्कमा स्विचिङ गर्ने कार्य गर्दछ। यसले १४९०nm तरंगलम्बाइमा डेटा पठाउँछ र १३१०nm मा प्राप्त गर्दछ।',
    technicalSpecs: {
      'तरंगलम्बाइ (Downstream)': '१४९० nm (Data) र १५५० nm (Video)',
      'तरंगलम्बाइ (Upstream)': '१३१० nm (Data)',
      'फाइबर पोर्ट क्षमता': 'GPON पोर्ट: १:६४ वा १:१२८ स्प्लिट रेसियो',
      'लाइन रेट (GPON)': 'Downstream: २.४८८ Gbps, Upstream: १.२४४ Gbps',
    },
    fieldGuidelines: [
      'OLT पोर्टको लेजर पावर नियमित ओपीएम (OPM) बाट नाप्नुपर्छ।',
      'धुलोबाट जोगाउन प्रयोग नभएका SFP पोर्टहरूमा अनिवार्य डस्ट क्याप लगाउने।',
      'पावर ब्याकअपका लागि -४८V DC पावर सप्लाई मिलाउने।',
    ],
    examQuestions: [
      'OLT को पूरा रूप के हो? (उत्तर: Optical Line Terminal)',
      'OLT ले डाउनस्ट्रिम डेटा कुन तरंगलम्बाइमा पठाउँछ? (उत्तर: १४९० nm)',
    ],
  },
  {
    id: 'odf',
    section: 'office',
    sectionNepali: 'टेलिकम कार्यालय (Telecom Central Office)',
    nameNepali: 'ओ-डी-एफ (O-DF / Optical Distribution Frame)',
    nameEnglish: 'Optical Distribution Frame (ODF)',
    shortDesc: 'केन्द्रिय कार्यालयका फाइबरहरू टर्मिनेट र क्रस-कनेक्सन गर्ने फ्रेम।',
    detailedFunctionNepali: 'ओडीएफमा OLT बाट आएका फाइबर प्याचकर्डहरू टर्मिनेट गरिन्छन्। यसले कार्यालय भित्रका सक्रिय उपकरण र बाहिर जमिनमुनि जाने फिडर केबल (Feeder Cable) बीच सुरक्षित र व्यवस्थित जोड उपलब्ध गराउँछ।',
    technicalSpecs: {
      'एडेप्टर प्रकार': 'SC/APC (हरियो) वा LC/UPC (नीलो)',
      'टर्मिनेशन क्षमता': '१२, २४, ४८, ९६ वा १४४ कोर मोड्युलर र्याक',
      'फाइबर प्रकार': 'Single Mode G.652D वा G.657A',
      'इन्जर्सन लस': '< ०.३ dB प्रति कनेक्टर',
    },
    fieldGuidelines: [
      'कनेक्टर जोड्नु अघि ९९% आइसोप्रोपाइल अल्कोहल (IPA) र लिन्ट-फ्री वाइप्सले सफा गर्ने।',
      'फाइबर प्याचकर्डहरूलाई बढी दबाब र मोडिन (Bending) बाट जोगाउन केबल गाइड प्रयोग गर्ने।',
    ],
    examQuestions: [
      'ODF को पूरा रूप के हो? (उत्तर: Optical Distribution Frame)',
      'फाइबर प्याच कर्ड सफा गर्न कुन केमिकल प्रयोग गरिन्छ? (उत्तर: ९९% शुद्ध आइसोप्रोपाइल अल्कोहल - IPA)',
    ],
  },
  {
    id: 'cable-vault',
    section: 'office',
    sectionNepali: 'टेलिकम कार्यालय (Telecom Central Office)',
    nameNepali: 'केबल भल्ट (Cable Vault)',
    nameEnglish: 'Cable Vault / Entrance Facility',
    shortDesc: 'कार्यालय बाहिरबाट आउने ठूला फिडर फाइबर केबलहरू भित्रिने भूमिगत कोठा।',
    detailedFunctionNepali: 'बाहिरी सडकबाट आउने ठूला र कडा आर्मर्ड फाइबर केबलहरूलाई कार्यालय भित्र सुरक्षित प्रवेश गराउने बेसमेन्ट कोठा। यहाँ बाहिरी केबलहरूको ज्याकेट अर्थिङ गरिन्छ र लचिला केबलहरूसँग स्प्लाइस गरिन्छ।',
    technicalSpecs: {
      'सुरक्षा प्रकार': 'Underground RCC / Water-tight Sealing',
      'केबल प्रकार': 'Metal Armored Outside Plant (OSP) Fiber Cable',
      'ग्याँस र पानी लीक रोक्न': 'Inflatable Duct Sealing System',
      'अर्थिङ मापदण्ड': 'केबल आर्मर अर्थिङ (< १ ओम प्रतिरोध)',
    },
    fieldGuidelines: [
      'केबल भल्टमा ओस र पानी जम्न नदिन वाटर पम्प (Sump Pump) दुरुस्त राख्ने।',
      'केबलहरूमा स्पष्ट ट्याग (Taging) लगाउने ताकि कुन फिडर कुन दिशामा गएको हो चिन्न सजिलो होस्।',
    ],
    examQuestions: [
      'केबल भल्टमा फाइबर केबलको कुन भागलाई अर्थिङ गरिन्छ? (उत्तर: केबलको धातुको सुरक्षा कवच - Armored Sheath)',
    ],
  },
  {
    id: 'duct',
    section: 'primary',
    sectionNepali: 'प्राईमरी केबल खण्ड (Primary Cable Section)',
    nameNepali: 'डक्ट (PLB HDPE Duct)',
    nameEnglish: 'Underground Duct Pipe',
    shortDesc: 'जमिनमुनि फाइबर केबल बिछ्याउन र बाह्य क्षतिबाट बचाउन प्रयोग गरिने बलियो पाइप।',
    detailedFunctionNepali: 'स्थायी रूपमा लुब्रिकेटेड (Permanently Lubricated - PLB) कडा प्लास्टिकको पाइप, जसको भित्री सतहमा सिलिकनको लेयर हुन्छ। यस भित्र केबललाई हावाको प्रेसर (Blowing Method) द्वारा सजिलै गुडाइन्छ।',
    technicalSpecs: {
      'साइज र ब्यास': '४० mm बाहिरी व्यास / ३३ mm भित्री व्यास',
      'भित्री लेयर': 'Ultra-low friction Co-extruded Silicon Layer',
      'गाड्ने गहिराइ': 'सामान्य सडक खण्डमा १.२ मिटर र फुटपाथमा १.० मिटर',
      'तागत क्षमता': 'न्यूनतम ५०० kPa भन्दा बढी प्रेसर सहन सक्ने',
    },
    fieldGuidelines: [
      'डक्ट खन्दा फेला परेका अन्य युटिलिटी (पानी, ढल) भन्दा तल डक्ट राख्ने।',
      'डक्ट पाइप जोड्दा प्लास्टिक कपलर्स (Couplers) प्रयोग गरी कसिलो बनाउने।',
    ],
    examQuestions: [
      'PLB HDPE डक्ट भित्र कुन लेयर हुन्छ जसले घर्षण कम गर्छ? (उत्तर: सिलिकन लेयर - Silicon Inner Lining)',
      'सडक मुनि डक्ट पाइप कति गहिराइमा गाडिनुपर्छ? (उत्तर: १.२ मिटर)',
    ],
  },
  {
    id: 'manhole-joint',
    section: 'primary',
    sectionNepali: 'प्राईमरी केबल खण्ड (Primary Cable Section)',
    nameNepali: 'म्यानहोल र फाइबर जोइन्ट (Manhole & Joint Fiber Optic)',
    nameEnglish: 'Underground Manhole & Joint Fiber Optic Closure',
    shortDesc: 'जमिनमुनिको ठूलो आरसीसी चेम्बर र वाटरप्रुफ फाइबर जोइन्ट बक्स।',
    detailedFunctionNepali: 'सडक खण्डमा हरेक १५०-२०० मिटरमा बनाइने आरसीसी कोठा हो। यसभित्र केबल तान्न र जोडिएको भागलाई पानीबाट बचाउन मजबूत वाटरप्रुफ जोइन्ट क्लोजर (OFC Joint Closure / joint fiber optic) सुरक्षित राखिन्छ।',
    technicalSpecs: {
      'चेम्बर प्रकार': 'RCC S0, S1, S2 प्रकारका चेम्बरहरू',
      'जोइन्ट बक्स': 'IP68 Dome Closure वा Inline Mechanical Splice Case',
      'सुरक्षा': 'Lockable Heavy Duty Ductile Iron ढक्कन',
      'फाइबर स्प्लाइस लस': '< ०.०५ dB प्रति फ्युजन स्प्लाइस',
    },
    fieldGuidelines: [
      'म्यानहोलभित्र पस्नु अघि बिर्को आधा घण्टा खुला राखी विषाक्त ग्यास परीक्षण अनिवार्य गर्ने।',
      'जोइन्ट क्लोजरभित्र सिलिका जेल (Silica Gel) राखी आद्रता नियन्त्रण गर्ने।',
    ],
    examQuestions: [
      'म्यानहोलभित्र केबलको जोडिएको भागलाई सुरक्षित राख्ने उपकरणलाई के भनिन्छ? (उत्तर: जोइन्ट क्लोजर - Joint Closure)',
      'फाइबर स्प्लाइसिङको स्तरीय नोक्सानी (Loss) कति भन्दा कम हुनुपर्छ? (उत्तर: ०.०५ dB प्रति जोइन्ट)',
    ],
  },
  {
    id: 'handhole',
    section: 'primary',
    sectionNepali: 'प्राईमरी केबल खण्ड (Primary Cable Section)',
    nameNepali: 'ह्याण्डहोल (Handhole)',
    nameEnglish: 'Underground Handhole Pit',
    shortDesc: 'म्यानहोल भन्दा सानो भूमिगत बक्स जहाँ केबल लुप र सानो जोइन्ट राखिन्छ।',
    detailedFunctionNepali: 'सडक किनार वा घर नजिक बनाइने सानो भूमिगत बक्स, जसमा मानिस पुरै छिर्नु पर्दैन, हातले नै बाहिरबाटै केबल तान्न वा सानो जोड मिलाउन सकिन्छ।',
    technicalSpecs: {
      'साइज': '८० सेमी x ६० सेमी x ८० सेमी',
      'कभर': 'Medium Duty RCC वा फाइबर ग्लास रिइन्फोर्स्ड कभर',
      'स्थान': 'वितरण सञ्जाल वा क्याविनेट नजिकको मोडहरूमा',
    },
    fieldGuidelines: [
      'ह्याण्डहोल भन्तर माटो र पानी जम्न नदिन नियमित चेकजाँच र सरसफाइ गर्ने।',
      'डक्ट पाइपको मुख डक्ट प्लगले कसिलो बन्द गर्ने ता कि मुसा र पानी पस्न नसकोस्।',
    ],
    examQuestions: [
      'म्यानहोल र ह्याण्डहोलमा के फरक छ? (उत्तर: म्यानहोल ठूलो हुन्छ जहाँ मानिस छिर्छन्; ह्याण्डहोल सानो हुन्छ जसमा हातले मात्र काम गरिन्छ)',
    ],
  },
  {
    id: 'secondhole',
    section: 'primary',
    sectionNepali: 'प्राईमरी केबल खण्ड (Primary Cable Section)',
    nameNepali: 'सेकेण्डहोल (Secondhole / Secondary Pit)',
    nameEnglish: 'Underground Secondary Hole',
    shortDesc: 'मुख्य फिडर केबलबाट सेकेन्डरी वितरण पाइप छुट्याउने भूमिगत चेम्बर।',
    detailedFunctionNepali: 'फाइबर नेटवर्कको अर्को महत्वपूर्ण भूमिगत खण्ड हो जहाँबाट मुख्य केबलहरू विभिन्न साना गल्लीहरू वा पोलहरू तर्फ साना डक्टहरू मार्फत वितरण हुन्छन्। यसलाई सेकेन्डरी पिट पनि भनिन्छ।',
    technicalSpecs: {
      'साइज': '६० सेमी x ५० सेमी x ६० सेमी',
      'पाइप इन्ट्री': 'मल्टिपल सब-डक्ट्स र कपर/फाइबर मिक्स्ड इन्ट्रीहरू',
      'कभर प्रकार': 'Light Duty Composite Plastic / Concrete',
    },
    fieldGuidelines: [
      'सेकेण्डहोलको ढक्कन सुरक्षित राख्ने र सडक पीच वा माटोले नपुरियोस् भनी सुनिश्चित गर्ने।',
      'केबलहरूलाई सुरक्षित रूपमा मोड (Bending Radius) नमिल्ने गरी घुमाएर राख्ने।',
    ],
    examQuestions: [
      'सेकेण्डहोल (Secondhole) को मुख्य काम के हो? (उत्तर: सेकेन्डरी वितरण केबलहरूलाई गल्ली वा पोल तर्फ मोड्नु र सुरक्षित राख्नु)',
    ],
  },
  {
    id: 'fdc-splitter',
    section: 'primary',
    sectionNepali: 'प्राईमरी केबल खण्ड (Primary Cable Section)',
    nameNepali: 'फाइबर क्याविनेट र स्प्लिटर (FDC & Splitter)',
    nameEnglish: 'Fiber Distribution Cabinet with Optical Splitter',
    shortDesc: 'जमिनमा ठड्याइने मेटल बाकस जसभित्र अप्टिकल स्प्लिटर राखिन्छ।',
    detailedFunctionNepali: 'यसलाई फाइबर डिस्ट्रिब्युसन क्याबिनेट (FDC) भनिन्छ। यसभित्र मुख्य फिडर फाइबरलाई १:८, १:१६ वा १:३२ को रेसियोमा बाँड्ने अप्टिकल स्प्लिटर (Splitter) जडान गरिएको हुन्छ, जसले एउटै प्रकाशको सिग्नललाई धेरै भागमा विभाजन गर्छ।',
    technicalSpecs: {
      'क्याबिनेट प्रकार': 'Outdoor Weatherproof Double-Door IP-65 IP-66 Rating',
      'स्प्लिटर प्रकार': 'PLC Splitter (Planar Lightwave Circuit) १:१६ वा १:३२ रेसियो',
      'स्प्लिटर लस': '१:८ लस: ~१०.३ dB, १:१६ लस: ~१३.८ dB, १:३२ लस: ~१७.० dB',
      'टर्मिनेशन': 'SC/APC हरियो एडेप्टर र कनेक्टरहरू',
    },
    fieldGuidelines: [
      'क्याबिनेट भित्र अत्यधिक ओस जम्न नदिन सिलिका जेलका पोकाहरू राख्ने।',
      'हरेक ग्राहकको लाइन जोड्दा प्याच प्यानलमा स्पष्ट लेबलिङ (Port Mapping) गर्ने।',
    ],
    examQuestions: [
      'FDC को पूरा रूप के हो? (उत्तर: Fiber Distribution Cabinet)',
      'FDC भित्र राखिने मुख्य निष्क्रिय उपकरण के हो? (उत्तर: अप्टिकल स्प्लिटर - Optical Splitter)',
      '१:१६ स्प्लिटरको अनुमानित अटिन्युएसन लस कति हुन्छ? (उत्तर: करिब १३.८ dB देखि १४.५ dB सम्म)',
    ],
  },
  {
    id: 'riser-pole',
    section: 'secondary',
    sectionNepali: 'सेकेन्डरी केबल खण्ड (Secondary Cable Section)',
    nameNepali: 'राइजर पोल (Riser Pole)',
    nameEnglish: 'Riser Pole with Protection Pipe',
    shortDesc: 'भूमिगत डक्टबाट फाइबर केबल पोलमाथि हावामा उठ्ने पहिलो पोल।',
    detailedFunctionNepali: 'सेकेण्डहोल वा FDC बाट आएको वितरण फाइबर केबललाई पोलको टुप्पोमा रहेको FAP सम्म लानका लागि जमिन मुनिदेखि पोलको माथिल्लो भागसम्म धातुको सुरक्षा पाइप (GI Protection Pipe) बाँधिएको पोल।',
    technicalSpecs: {
      'सुरक्षा पाइप साइज': '२.५ वा ३ इन्च फलामे पाइप (GI Pipe)',
      'पाइपको उचाइ': 'जमिनबाट कम्तीमा ३ मिटर (१० फिट) माथिसम्म सुरक्षित हुनुपर्छ',
      'पोल प्रकार': '८.० मिटर ट्युबुलर स्टील पोल',
      'क्ल्याम्प': 'Heavy Duty Riser Clamps',
    },
    fieldGuidelines: [
      'केबल खिइने वा काटिने समस्या नहोस् भनी सुरक्षा पाइपको दुबै मुखमा रबर बुशिङ वा डक्ट सिलर लगाउने।',
      'पाइपलाई पोलमा कम्तीमा ३ ठाउँमा बलियो क्ल्याम्पले कस्नुपर्छ।',
    ],
    examQuestions: [
      'Riser Pole मा केबल जोगाउन कुन पाइप प्रयोग गरिन्छ? (उत्तर: GI Riser Pipe)',
    ],
  },
  {
    id: 'fap',
    section: 'secondary',
    sectionNepali: 'सेकेन्डरी केबल खण्ड (Secondary Cable Section)',
    nameNepali: 'फाइबर एक्सेस प्वाइन्ट (FAP / FAT)',
    nameEnglish: 'Fiber Access Point (FAP) / Fiber Distribution Box (FDB)',
    shortDesc: 'पोल माथि झुन्ड्याइने वाटरप्रुफ बक्स जहाँबाट ग्राहकको घरमा फाइबर ड्रप केबल पठाइन्छ।',
    detailedFunctionNepali: 'यसलाई फाइबर एक्सेस प्वाइन्ट (FAP) वा फाइबर डिस्ट्रिब्युसन बक्स (FDB) भनिन्छ। यसभित्र सामान्यतया १:८ स्प्लिटर हुन्छ र बाहिरबाट ८ वटा ड्रप केबल कनेक्टर्स सजिलै जोड्न मिल्ने पोर्टहरू हुन्छन्।',
    technicalSpecs: {
      'पोर्ट संख्या': '८ वा १६ आउटगोइंग पोर्टहरू (SC/APC)',
      'आईपी रेटिङ': 'IP-65 Waterproof र UV Resistant बाहिरी खोल',
      'स्प्लिटर': '१:८ वा १:१६ PLC Splitter (FAP भित्रै प्रिकोनेक्टेड)',
      'माउन्टिङ': 'Pole Mounting Kit वा Wall Mount Bracket',
    },
    fieldGuidelines: [
      'FAP को ढोका सधैं राम्ररी लक गर्ने ताकि पानी वा किराहरू भित्र पस्न नपाउन्।',
      'प्रयोग नभएका कनेक्टर पोर्टहरूमा सधैं डस्ट क्याप (Dust Cap) कसिलो लगाएर राख्ने।',
    ],
    examQuestions: [
      'FAP को पूरा रूप के हो? (उत्तर: Fiber Access Point)',
      'FAP बक्स पोलको टुप्पोबाट कति तल राखिन्छ? (उत्तर: ११० सेन्टिमिटर तल)',
    ],
  },
  {
    id: 'stay',
    section: 'secondary',
    sectionNepali: 'सेकेन्डरी केबल खण्ड (Secondary Cable Section)',
    nameNepali: 'स्टे (Stay Wire & Anchor)',
    nameEnglish: 'Stay Set Assembly',
    shortDesc: 'पोलको भार सन्तुलन गर्न र हावाहुरीमा पोल ढल्न नदिन बाँधिने बलियो सपोर्टिङ तार।',
    detailedFunctionNepali: 'एरियल केबल तान्दा पोलमा पर्ने तनाव (Tension) लाई सन्तुलनमा राख्न जमिनमा ४५ डिग्रीको कोणमा गाडिएको Stay Plate, Rod र ७/२.५ mm को जस्ता चढेको फलामे सपोर्ट तार।',
    technicalSpecs: {
      'तार प्रकार': 'Galvanized Steel Wire ७/२.५ mm वा ७/३.१५ mm',
      'सुरक्षा': 'Stay Insulator (Egg Type) जमिनबाट ३ मिटर भन्दा माथि उचाइमा',
      'गाड्ने गहिराइ': 'स्टे प्लेट जमिन मुनि कम्तीमा १.५ मिटर गहिरो खाडल खनेर गाडिन्छ',
      'तनाव नियन्त्रण': 'Stay Turnbuckle (टाइट वा खुकुलो बनाउन)',
    },
    fieldGuidelines: [
      'चट्याङ र विद्युतीय प्रवाहबाट बचाउन स्टे तारमा स्टे इन्सुलेटर (Stay Insulator) अनिवार्य रूपमा राख्ने।',
      'स्टे सेट गाड्दा कडा माटो र ढुङ्गाले कसिलो गरी पुर्ने।',
    ],
    examQuestions: [
      'Stay Wire जमिनसँग कति डिग्रीको कोणमा बाँधिन्छ? (उत्तर: ४५ डिग्री)',
      'स्टे तारमा इन्सुलेटर किन हालिन्छ? (उत्तर: पोलमा करेन्ट आएमा त्यसलाई स्टे तार हुँदै भुइँमा आउन र कसैलाई लाग्न नदिन)',
    ],
  },
  {
    id: 'drop-fiber',
    section: 'secondary',
    sectionNepali: 'सेकेन्डरी केबल खण्ड (Secondary Cable Section)',
    nameNepali: 'फाइबर ड्रप केबल (Fiber Drop Cable)',
    nameEnglish: 'Bow-Type FTTH Drop Cable',
    shortDesc: 'FAP बक्सबाट ग्राहकको घरसम्म हावामा तानिने विशेष १ वा २ कोर फाइबर।',
    detailedFunctionNepali: 'FAP पोलबाट ग्राहकको घरको पर्खालसम्म पुर्याइने अत्यन्तै बलियो र लचिलो १-कोर वा २-कोर भएको "Bow-Type" केबल। यसको भित्री भागमा दुईवटा स्टिलका तार (Strength Members) र बीचमा अप्टिकल फाइबर हुन्छ।',
    technicalSpecs: {
      'फाइबर कोर': '१ वा २ कोर (G.657A2 Bending Insensitive Fiber)',
      'स्ट्रेन्थ मेम्बर': '0.5 mm Steel Wire दुईवटा र मुख्य सपोर्ट Steel Messenger Wire (१.२ mm)',
      'ज्याकेट': 'LSZH (Low Smoke Zero Halogen) कालो रङको ज्याकेट',
      'मोडिने न्यूनतम रेडियस': '१५ mm (Bending Radius)',
    },
    fieldGuidelines: [
      'केबल झुन्ड्याउँदा पोल र घर साइडमा ड्रप केबल क्ल्याम्प (Drop Cable S-Clamp) को प्रयोग गर्ने।',
      'घरभित्र छिराउँदा केबललाई अत्यधिक नमोड्ने (९० डिग्रीमा कडा बेन्ड नगर्ने - Macro bending loss आउँछ)।',
    ],
    examQuestions: [
      'FTTH ड्रप केबल भित्र कुन विशेष फाइबर हुन्छ जसलाई थोरै बंग्याउँदा पनि लस हुँदैन? (उत्तर: G.657A Bending-Insensitive Fiber)',
      'ड्रप केबलमा रहने स्टिल वायरको काम के हो? (उत्तर: केबललाई हावाको भार र तानिने शक्तिबाट बचाउन - Strength Member)',
    ],
  },
  {
    id: 'indoor-fiber',
    section: 'subscriber',
    sectionNepali: 'ग्राहकको लाईन खण्ड (Customer Line Section)',
    nameNepali: 'हाउस वायर (Ethernet / Indoor Fiber)',
    nameEnglish: 'Indoor Fiber / Ethernet House Wire',
    shortDesc: 'घरभित्र वा कोठाहरूमा व्यवस्थित रूपमा लगिने फाइबर वा इथरनेट केबल।',
    detailedFunctionNepali: 'पर्खालको ड्रिल गरिएको प्वालबाट कोठाभित्र ल्याई ONT राउटरसम्म सुरक्षित ढंगले लगिने फाइबर वा राउटरबाट आईपी फोन / कम्प्युटरसम्म लगिने इथरनेट केबल (Cat6)।',
    technicalSpecs: {
      'इन्डोर केबल प्रकार': 'नरम सेतो रङको १.६ mm वा २.० mm इन्डोर प्याचकर्ड वा Cat6 केबल',
      'प्याचिङ कनेक्टर': 'SC/APC Connector (हरियो रंगको एङ्गल पोलिस्ड)',
      'क्लिपिङ': 'Casing-Capping वा १० mm Round Cable Clips',
    },
    fieldGuidelines: [
      'घरभित्र कतै पनि केबल खुल्ला नछाड्ने, भित्ताको छेउछेउ मिलाएर क्लिप मार्ने।',
      'विद्युतीय २२०V को तार भन्दा कम्तीमा २० सेमी टाढा राख्ने ता कि कुनै भौतिक स्पर्श नहोस्।',
    ],
    examQuestions: [
      'घरभित्र फाइबर केबल कुन कुनामा कुन पाइप भित्र राख्नु उपयुक्त हुन्छ? (उत्तर: प्लाष्टिकको फ्लेक्सिबल कन्ड्युट वा क्यासिङ-क्यापिङ भित्र)',
    ],
  },
  {
    id: 'ont',
    section: 'subscriber',
    sectionNepali: 'ग्राहकको लाईन खण्ड (Customer Line Section)',
    nameNepali: 'ओ-एन-टी / वाइफाइ राउटर (ONT / Wi-Fi Router)',
    nameEnglish: 'Optical Network Terminal (ONT) / Wi-Fi Router',
    shortDesc: 'फाइबर सिग्नललाई इन्टरनेट र टेलिफोन सिग्नलमा बदल्ने ग्राहकको मुख्य डिभाइस।',
    detailedFunctionNepali: 'यसलाई ग्राहक परिसरको उपकरण (CPE / Customer Premises Equipment) भनिन्छ। यसले फाइबरबाट आउने लेजर प्रकाशको सिग्नललाई कम्प्युटर र फोनले बुझ्ने विद्युतीय डिजिटल सिग्नल (Ethernet / Voice) मा परिणत गर्दछ र वाइफाइ तरंग फैलाउँछ।',
    technicalSpecs: {
      'इनपुट पावर': '१२V DC / १.०A देखि १.५A एडेप्टर',
      'अप्टिकल इन्टरफेस': 'SC/APC Port (हरियो)',
      'इनपुट अप्टिकल पावर': '-८ dBm देखि -२७ dBm सम्म (उत्कृष्ट स्तर: -१५ dBm देखि -२२ dBm)',
      'पोर्टहरू': '४ इथरनेट पोर्ट (GE/FE) र १ वा २ POTS RJ-11 टेलिफोन पोर्ट',
    },
    fieldGuidelines: [
      'ONT को अप्टिकल फाइबर पोर्टमा लेजर लाइट सफा छ छैन नाप्न OPM प्रयोग गर्ने। पावर -२७ dBm भन्दा कमजोर हुनु हुँदैन।',
      'डिभाइसलाई सफा, खुला र बढी हावा चल्ने उचाइ भएको ठाउँमा राख्ने (वाइफाइ कभरेज राम्रो हुन्छ)।',
    ],
    examQuestions: [
      'ONT को पूरा रूप के हो? (उत्तर: Optical Network Terminal)',
      'ONT मा आउने अप्टिकल पावरको न्यूनतम स्वीकार्य सीमा कति हो? (उत्तर: -२७ dBm भन्दा बढी बलियो हुनुपर्छ - जस्तै -२२ dBm)',
      'ONT ले फाइबरको प्रकाशलाई कुन सिग्नलमा बदल्छ? (उत्तर: विद्युतीय डिजिटल सिग्नल - Electrical Digital Signal)',
    ],
  },
  {
    id: 'telephone-ip',
    section: 'subscriber',
    sectionNepali: 'ग्राहकको लाईन खण्ड (Customer Line Section)',
    nameNepali: 'टेलिफोन / आईपी फोन (IP Phone / POTS Telephone)',
    nameEnglish: 'IP Phone / RJ-11 Telephone Instrument',
    shortDesc: 'ONT को फोन पोर्टबाट जोडिने ग्राहकको टेलिफोन सेट।',
    detailedFunctionNepali: 'ONT को RJ-11 टेलिफोन पोर्ट (POTS) बाट जोडिने सामान्य एनालग टेलिफोन वा इथरनेट पोर्टबाट जोडिने आधुनिक आईपी फोन (IP Phone), जसमार्फत ग्राहकले उच्च गुणस्तरको स्पष्ट कुराकानी गर्न सक्दछन्।',
    technicalSpecs: {
      'कनेक्टर प्रकार': 'RJ-11 (Registered Jack 11) २-पेयर ४-पिन वा ४-पेयर ८-पिन RJ-45',
      'भोल्टेज आपूर्ति': 'ONT ले आफैं पोर्ट मार्फत भोल्टेज र डायल टोन दिन्छ',
      'प्रविधि': 'VoIP (Voice over Internet Protocol) / SIP Protocol',
    },
    fieldGuidelines: [
      'फोन सेटको घण्टी नबजेमा वा आवाज नआएमा RJ-11 कनेक्टर राम्ररी फिट भएको छ छैन जाँच गर्ने।',
      'VoIP कन्फिगरेसन ONT भित्र एनटीसीको एकाउन्ट युजरनेम र पासवर्ड हाली एक्टिभ गर्ने।',
    ],
    examQuestions: [
      'VoIP को पूरा रूप के हो? (उत्तर: Voice over Internet Protocol)',
      'ONT सँग टेलिफोन सेट कुन केबल र कनेक्टरले जोडिन्छ? (उत्तर: RJ-11 कनेक्टर र २-पेयर नरम कपर कर्ड)',
    ],
  },
];

export const TelecomNetworkSchematic: React.FC = () => {
  const [viewMode, setViewMode] = useState<'copper' | 'ftth'>('copper');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('switching');
  const [activeSectionFilter, setActiveSectionFilter] = useState<'all' | 'office' | 'primary' | 'secondary' | 'subscriber'>('all');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simStep, setSimStep] = useState<number>(0);

  const currentNodes = viewMode === 'copper' ? telecomNetworkSchematicNodes : ftthNetworkSchematicNodes;

  const selectedNode =
    currentNodes.find((n) => n.id === selectedNodeId) ||
    currentNodes[0];

  const copperSequence = [
    'switching',
    'mdf',
    'cable-vault',
    'duct',
    'manhole',
    'handhole',
    'cabinet',
    'riser-pole',
    'closure',
    'dp',
    'stay',
    'drop-wire',
    'krone-box',
    'house-wire',
    'telephone',
  ];

  const ftthSequence = [
    'olt',
    'odf',
    'cable-vault',
    'duct',
    'manhole-joint',
    'handhole',
    'secondhole',
    'fdc-splitter',
    'riser-pole',
    'fap',
    'stay',
    'drop-fiber',
    'indoor-fiber',
    'ont',
    'telephone-ip',
  ];

  // Simulation sequence of node IDs in transmission order
  const simSequence = viewMode === 'copper' ? copperSequence : ftthSequence;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSimulating) {
      timer = setInterval(() => {
        setSimStep((prev) => {
          const next = prev + 1;
          if (next >= simSequence.length) {
            setIsSimulating(false);
            return 0;
          }
          setSelectedNodeId(simSequence[next]);
          return next;
        });
      }, 1200);
    }
    return () => clearInterval(timer);
  }, [isSimulating, simSequence]);

  const handleStartSimulation = () => {
    setSimStep(0);
    setSelectedNodeId(simSequence[0]);
    setIsSimulating(true);
  };

  const handleResetSimulation = () => {
    setIsSimulating(false);
    setSimStep(0);
    setSelectedNodeId(viewMode === 'copper' ? 'switching' : 'olt');
  };

  const filteredNodes = currentNodes.filter((node) => {
    if (activeSectionFilter === 'all') return true;
    return node.section === activeSectionFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-950/80 border border-amber-800/60 px-3 py-1 rounded-full mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>CTEVT तह–१ आधिकारिक टेलिकम OSP नेटवर्क रेखाचित्र (Official Network Blueprint)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              टेलिकम कार्यालय (Exchange) देखि ग्राहकको टेलिफोनसम्मको पूर्ण सञ्जाल
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-4xl leading-relaxed">
              स्विचिङ, MDF, केबल भल्ट, भूमिगत डक्ट/म्यानहोल/ह्यानहोल, क्याबिनेट, राइजर पोल, क्लोजर, DP बक्स, स्टे, ड्रपवायर, क्रोन बक्स, हाउस वायर तथा टेलिफोन सेटको इन्जिनियरिङ रेखाचित्र
            </p>
          </div>

          {/* Controls: Simulation & FTTH switch */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center bg-slate-950 border border-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('copper')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'copper'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                कपर (PSTN / Copper)
              </button>
              <button
                onClick={() => setViewMode('ftth')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'ftth'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                फाइबर (FTTH PON)
              </button>
            </div>

            <button
              onClick={isSimulating ? handleResetSimulation : handleStartSimulation}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95 ${
                isSimulating
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 animate-pulse'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/30'
              }`}
            >
              {isSimulating ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>सिमुलेसन रोक्नुहोस् ({simStep + 1}/15)</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>सिग्नल फ्लो टेस्ट (Simulate Voice Call)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4 Architectural Tiers Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveSectionFilter(activeSectionFilter === 'office' ? 'all' : 'office')}
            className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
              activeSectionFilter === 'office'
                ? 'bg-blue-950 border-blue-500 text-blue-300 shadow-md ring-1 ring-blue-500'
                : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <span className="text-[10px] text-blue-400 font-extrabold uppercase tracking-wider">खण्ड १</span>
            <span className="text-xs font-bold text-white flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-blue-400" /> टेलिकम कार्यालय
            </span>
            <span className="text-[10px] text-slate-400 font-normal">Switch, MDF, Vault</span>
          </button>

          <button
            onClick={() => setActiveSectionFilter(activeSectionFilter === 'primary' ? 'all' : 'primary')}
            className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
              activeSectionFilter === 'primary'
                ? 'bg-purple-950 border-purple-500 text-purple-300 shadow-md ring-1 ring-purple-500'
                : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <span className="text-[10px] text-purple-400 font-extrabold uppercase tracking-wider">खण्ड २</span>
            <span className="text-xs font-bold text-white flex items-center gap-1">
              <Cable className="w-3.5 h-3.5 text-purple-400" /> प्राईमरी केबल
            </span>
            <span className="text-[10px] text-slate-400 font-normal">Duct, MH, HH, Cabinet</span>
          </button>

          <button
            onClick={() => setActiveSectionFilter(activeSectionFilter === 'secondary' ? 'all' : 'secondary')}
            className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
              activeSectionFilter === 'secondary'
                ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-md ring-1 ring-emerald-500'
                : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider">खण्ड ३</span>
            <span className="text-xs font-bold text-white flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-emerald-400" /> सेकेन्डरी केबल
            </span>
            <span className="text-[10px] text-slate-400 font-normal">Riser Pole, DP, Closure, Stay</span>
          </button>

          <button
            onClick={() => setActiveSectionFilter(activeSectionFilter === 'subscriber' ? 'all' : 'subscriber')}
            className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
              activeSectionFilter === 'subscriber'
                ? 'bg-amber-950 border-amber-500 text-amber-300 shadow-md ring-1 ring-amber-500'
                : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider">खण्ड ४</span>
            <span className="text-xs font-bold text-white flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-amber-400" /> ग्राहकको लाईन
            </span>
            <span className="text-[10px] text-slate-400 font-normal">Drop Wire, Krone, Phone</span>
          </button>
        </div>

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* INTERACTIVE FULL SVG SCHEMATIC - EXACT MATCH OF HAND-DRAWN IMAGE */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        <div className="relative bg-slate-950 border-2 border-slate-800 rounded-2xl p-3 sm:p-6 overflow-x-auto shadow-2xl">
          {/* Top Section Boundary Ruler */}
          <div className="grid grid-cols-4 border-b-2 border-dashed border-slate-700 pb-2 mb-3 text-center text-xs font-bold">
            <div className="text-blue-400 border-r border-slate-800 px-2 flex items-center justify-center gap-1">
              <Building className="w-3.5 h-3.5 hidden sm:inline" /> टेलिकम कार्यालय
            </div>
            <div className="text-purple-400 border-r border-slate-800 px-2 flex items-center justify-center gap-1">
              <Cable className="w-3.5 h-3.5 hidden sm:inline" /> प्रईमरि केबल
            </div>
            <div className="text-emerald-400 border-r border-slate-800 px-2 flex items-center justify-center gap-1">
              <Radio className="w-3.5 h-3.5 hidden sm:inline" /> सेकेण्डरि केबल
            </div>
            <div className="text-amber-400 px-2 flex items-center justify-center gap-1">
              <Home className="w-3.5 h-3.5 hidden sm:inline" /> ग्राहकको लाईन
            </div>
          </div>

          {viewMode === 'copper' ? (
            <svg
              viewBox="0 0 1000 480"
              className="w-full min-w-[760px] h-auto select-none"
              style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
            >
            <defs>
              <linearGradient id="officeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
              <linearGradient id="signalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#4ade80" />
              </linearGradient>
              <pattern id="brickPattern" width="10" height="6" patternUnits="userSpaceOnUse">
                <rect width="10" height="6" fill="#1e293b" />
                <line x1="0" y1="0" x2="10" y2="0" stroke="#334155" strokeWidth="0.8" />
                <line x1="0" y1="3" x2="10" y2="3" stroke="#334155" strokeWidth="0.8" />
                <line x1="5" y1="0" x2="5" y2="3" stroke="#334155" strokeWidth="0.8" />
                <line x1="0" y1="3" x2="0" y2="6" stroke="#334155" strokeWidth="0.8" />
                <line x1="10" y1="3" x2="10" y2="6" stroke="#334155" strokeWidth="0.8" />
              </pattern>
            </defs>

            {/* ─── GROUND LEVEL BASELINE (Across entire diagram) ─── */}
            <rect x="0" y="320" width="1000" height="160" fill="url(#groundGrad)" opacity="0.4" />
            <line x1="0" y1="320" x2="1000" y2="320" stroke="#64748b" strokeWidth="3" strokeDasharray="6 3" />
            <text x="20" y="338" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">जमिनको सतह (Ground Level)</text>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* 1. TELECOM CENTRAL OFFICE BUILDING (Left side)          */}
            {/* ═══════════════════════════════════════════════════════ */}
            <rect x="30" y="70" width="160" height="340" rx="4" fill="url(#officeGrad)" stroke="#3b82f6" strokeWidth="2" />
            
            {/* Floor Dividers */}
            <line x1="30" y1="180" x2="190" y2="180" stroke="#3b82f6" strokeWidth="1.5" />
            <line x1="30" y1="290" x2="190" y2="290" stroke="#3b82f6" strokeWidth="1.5" />

            {/* Room Labels */}
            <text x="110" y="92" textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="bold">स्विचिङ रुम (Switching)</text>
            <text x="110" y="200" textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="bold">एम.डि.एफ. (M.D.F.)</text>
            <text x="110" y="310" textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="bold">केबल भल्ट (Cable Vault)</text>

            {/* Switching Rack (Node 1) */}
            <g
              onClick={() => setSelectedNodeId('switching')}
              className="cursor-pointer group"
            >
              <rect
                x="50"
                y="105"
                width="120"
                height="65"
                rx="4"
                fill={selectedNodeId === 'switching' ? '#1d4ed8' : '#0f172a'}
                stroke={selectedNodeId === 'switching' ? '#60a5fa' : '#38bdf8'}
                strokeWidth={selectedNodeId === 'switching' ? '3' : '1.5'}
                className="transition-all"
              />
              {/* Rack Shelves & Cards */}
              <line x1="70" y1="112" x2="70" y2="162" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="90" y1="112" x2="90" y2="162" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="110" y1="112" x2="110" y2="162" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="130" y1="112" x2="130" y2="162" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="150" y1="112" x2="150" y2="162" stroke="#38bdf8" strokeWidth="1.5" />
              {/* LED dots */}
              <circle cx="60" cy="115" r="2.5" fill="#4ade80" className="animate-ping" />
              <circle cx="60" cy="115" r="2.5" fill="#4ade80" />
              <circle cx="60" cy="125" r="2" fill="#fbbf24" />
              <circle cx="60" cy="135" r="2" fill="#38bdf8" />
              <text x="110" y="145" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                स्विच / OLT
              </text>
            </g>

            {/* Cable from Switch to MDF */}
            <path
              d="M 110 170 C 110 185, 90 190, 90 215"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeDasharray={isSimulating ? '4 2' : 'none'}
            />

            {/* MDF Block (Node 2) */}
            <g
              onClick={() => setSelectedNodeId('mdf')}
              className="cursor-pointer group"
            >
              <rect
                x="60"
                y="215"
                width="100"
                height="65"
                rx="3"
                fill={selectedNodeId === 'mdf' ? '#4338ca' : '#1e1b4b'}
                stroke={selectedNodeId === 'mdf' ? '#a5b4fc' : '#818cf8'}
                strokeWidth={selectedNodeId === 'mdf' ? '3' : '1.5'}
                className="transition-all"
              />
              {/* Vertical & Horizontal terminal slots */}
              <line x1="72" y1="225" x2="92" y2="225" stroke="#cbd5e1" strokeWidth="2" />
              <line x1="72" y1="235" x2="92" y2="235" stroke="#cbd5e1" strokeWidth="2" />
              <line x1="72" y1="245" x2="92" y2="245" stroke="#cbd5e1" strokeWidth="2" />
              <line x1="72" y1="255" x2="92" y2="255" stroke="#cbd5e1" strokeWidth="2" />
              <line x1="72" y1="265" x2="92" y2="265" stroke="#cbd5e1" strokeWidth="2" />

              <line x1="128" y1="225" x2="148" y2="225" stroke="#cbd5e1" strokeWidth="2" />
              <line x1="128" y1="235" x2="148" y2="235" stroke="#cbd5e1" strokeWidth="2" />
              <line x1="128" y1="245" x2="148" y2="245" stroke="#cbd5e1" strokeWidth="2" />
              <line x1="128" y1="255" x2="148" y2="255" stroke="#cbd5e1" strokeWidth="2" />
              <line x1="128" y1="265" x2="148" y2="265" stroke="#cbd5e1" strokeWidth="2" />

              {/* Jumper wire between slots */}
              <path d="M 92 235 C 110 235, 110 255, 128 255" fill="none" stroke="#f43f5e" strokeWidth="2" />
              <text x="110" y="274" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">MDF Frame</text>
            </g>

            {/* Cable from MDF to Cable Vault */}
            <path
              d="M 110 280 L 110 325"
              fill="none"
              stroke="#6366f1"
              strokeWidth="4"
              strokeDasharray={isSimulating ? '4 2' : 'none'}
            />

            {/* Cable Vault (Node 3) */}
            <g
              onClick={() => setSelectedNodeId('cable-vault')}
              className="cursor-pointer group"
            >
              <rect
                x="50"
                y="325"
                width="120"
                height="70"
                rx="3"
                fill={selectedNodeId === 'cable-vault' ? '#7c2d12' : '#292524'}
                stroke={selectedNodeId === 'cable-vault' ? '#fdba74' : '#fb923c'}
                strokeWidth={selectedNodeId === 'cable-vault' ? '3' : '1.5'}
                className="transition-all"
              />
              {/* Cable Vault Joint Splice */}
              <ellipse cx="110" cy="355" rx="14" ry="8" fill="#451a03" stroke="#f97316" strokeWidth="2" />
              <rect x="100" y="348" width="20" height="14" rx="2" fill="#ea580c" />
              <text x="110" y="380" textAnchor="middle" fill="#fdba74" fontSize="10" fontWeight="bold">केबल भल्ट</text>
            </g>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* 2. PRIMARY UNDERGROUND DUCT ROUTE (Middle-Left)         */}
            {/* ═══════════════════════════════════════════════════════ */}

            {/* Underground Duct Pipe (Node 4) */}
            <g
              onClick={() => setSelectedNodeId('duct')}
              className="cursor-pointer group"
            >
              <rect x="170" y="385" width="370" height="24" rx="3" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="170" y1="397" x2="540" y2="397" stroke="#38bdf8" strokeWidth="4" strokeDasharray={isSimulating ? '6 3' : 'none'} />
              <text x="220" y="423" fill="#38bdf8" fontSize="11" fontWeight="bold">डक्ट (Duct Pipe)</text>
            </g>

            {/* Manhole Chamber (Node 5) */}
            <g
              onClick={() => setSelectedNodeId('manhole')}
              className="cursor-pointer group"
            >
              {/* Manhole Neck & Cover */}
              <rect x="270" y="310" width="30" height="14" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
              {/* Manhole Underground Room */}
              <rect
                x="250"
                y="324"
                width="70"
                height="90"
                rx="3"
                fill={selectedNodeId === 'manhole' ? '#4c1d95' : '#1e1b4b'}
                stroke={selectedNodeId === 'manhole' ? '#c084fc' : '#a855f7'}
                strokeWidth={selectedNodeId === 'manhole' ? '3' : '1.5'}
                className="transition-all"
              />
              {/* Inside Sleeve Joint */}
              <ellipse cx="285" cy="397" rx="14" ry="7" fill="#6b21a8" stroke="#d8b4fe" strokeWidth="2" />
              <text x="285" y="304" textAnchor="middle" fill="#c084fc" fontSize="11" fontWeight="bold">म्यानहोल</text>
            </g>

            {/* Handhole Chamber (Node 6) */}
            <g
              onClick={() => setSelectedNodeId('handhole')}
              className="cursor-pointer group"
            >
              {/* Handhole Neck & Cover */}
              <rect x="385" y="312" width="22" height="12" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
              {/* Handhole Room */}
              <rect
                x="370"
                y="324"
                width="52"
                height="80"
                rx="2"
                fill={selectedNodeId === 'handhole' ? '#4c1d95' : '#1e1b4b'}
                stroke={selectedNodeId === 'handhole' ? '#c084fc' : '#a855f7'}
                strokeWidth={selectedNodeId === 'handhole' ? '3' : '1.5'}
                className="transition-all"
              />
              {/* Small joint inside */}
              <ellipse cx="396" cy="397" rx="10" ry="5" fill="#6b21a8" stroke="#d8b4fe" strokeWidth="1.5" />
              <text x="396" y="304" textAnchor="middle" fill="#c084fc" fontSize="11" fontWeight="bold">ह्यानहोल</text>
            </g>

            {/* Cable going up from Handhole into Cabinet */}
            <path
              d="M 422 397 L 460 397 L 460 300 L 475 300"
              fill="none"
              stroke="#a855f7"
              strokeWidth="3.5"
              strokeDasharray={isSimulating ? '4 2' : 'none'}
            />

            {/* Cabinet Pillar (Node 7) */}
            <g
              onClick={() => setSelectedNodeId('cabinet')}
              className="cursor-pointer group"
            >
              {/* Concrete Base */}
              <rect x="455" y="310" width="60" height="14" fill="#334155" stroke="#64748b" strokeWidth="1" />
              {/* Metal Cabinet Box */}
              <rect
                x="460"
                y="220"
                width="50"
                height="90"
                rx="3"
                fill={selectedNodeId === 'cabinet' ? '#065f46' : '#022c22'}
                stroke={selectedNodeId === 'cabinet' ? '#34d399' : '#10b981'}
                strokeWidth={selectedNodeId === 'cabinet' ? '3' : '2'}
                className="transition-all"
              />
              {/* Cabinet Roof Slant */}
              <polygon points="455,220 515,220 510,212 460,212" fill="#047857" />
              {/* Inside Primary & Secondary Terminal strips with jumper */}
              <rect x="466" y="235" width="16" height="60" fill="#064e3b" stroke="#34d399" strokeWidth="1" />
              <rect x="488" y="235" width="16" height="60" fill="#064e3b" stroke="#34d399" strokeWidth="1" />
              <path d="M 474 250 C 480 250, 480 270, 496 270" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
              
              <text x="485" y="200" textAnchor="middle" fill="#34d399" fontSize="12" fontWeight="bold">क्याविनेट</text>
              <text x="485" y="211" textAnchor="middle" fill="#6ee7b7" fontSize="9">(Cabinet)</text>
            </g>

            {/* Cable from Cabinet underground to Riser Pole */}
            <path
              d="M 500 310 L 500 360 L 545 360 L 545 320"
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              strokeDasharray={isSimulating ? '4 2' : 'none'}
            />

            {/* ═══════════════════════════════════════════════════════ */}
            {/* 3. SECONDARY AERIAL POLE LINE (Middle-Right)            */}
            {/* ═══════════════════════════════════════════════════════ */}

            {/* Pole 1: Riser Pole (Node 8) */}
            <g
              onClick={() => setSelectedNodeId('riser-pole')}
              className="cursor-pointer group"
            >
              {/* Pole Ground Embedment */}
              <rect x="540" y="320" width="8" height="60" fill="#1e293b" stroke="#475569" strokeWidth="1" />
              {/* Pole Mast */}
              <rect
                x="540"
                y="150"
                width="8"
                height="170"
                fill={selectedNodeId === 'riser-pole' ? '#0284c7' : '#0369a1'}
                stroke={selectedNodeId === 'riser-pole' ? '#38bdf8' : '#0ea5e9'}
                strokeWidth={selectedNodeId === 'riser-pole' ? '2' : '1'}
                className="transition-all"
              />
              {/* GI Riser Guard Pipe along Pole */}
              <rect x="536" y="210" width="5" height="120" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1" />
              <text x="544" y="140" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">राइजर पोल</text>
            </g>

            {/* Aerial Cable Span connecting Riser Pole to DP Pole */}
            <line x1="544" y1="168" x2="640" y2="168" stroke="#0ea5e9" strokeWidth="3" />

            {/* Splice Closure on Pole / Aerial (Node 9) */}
            <g
              onClick={() => setSelectedNodeId('closure')}
              className="cursor-pointer group"
            >
              <ellipse
                cx="625"
                cy="168"
                rx="14"
                ry="7"
                fill={selectedNodeId === 'closure' ? '#d97706' : '#78350f'}
                stroke={selectedNodeId === 'closure' ? '#fcd34d' : '#f59e0b'}
                strokeWidth={selectedNodeId === 'closure' ? '3' : '1.5'}
                className="transition-all"
              />
              <text x="625" y="125" textAnchor="middle" fill="#fcd34d" fontSize="11" fontWeight="bold">ल्क्लोजर</text>
              <text x="625" y="136" textAnchor="middle" fill="#fde68a" fontSize="8">(Closure)</text>
              <line x1="625" y1="138" x2="625" y2="160" stroke="#fcd34d" strokeWidth="1" strokeDasharray="2 2" />
            </g>

            {/* Pole 2: Distribution Pole with DP (Node 10) */}
            <g
              onClick={() => setSelectedNodeId('dp')}
              className="cursor-pointer group"
            >
              {/* Pole Ground Embedment */}
              <rect x="640" y="320" width="8" height="60" fill="#1e293b" stroke="#475569" strokeWidth="1" />
              {/* Pole Mast */}
              <rect
                x="640"
                y="150"
                width="8"
                height="170"
                fill="#0369a1"
                stroke="#0ea5e9"
                strokeWidth="1"
              />
              
              {/* DP Box attached to Pole */}
              <rect
                x="630"
                y="178"
                width="18"
                height="28"
                rx="2"
                fill={selectedNodeId === 'dp' ? '#b45309' : '#451a03'}
                stroke={selectedNodeId === 'dp' ? '#fbbf24' : '#d97706'}
                strokeWidth={selectedNodeId === 'dp' ? '3' : '1.5'}
                className="transition-all"
              />
              {/* DP Terminal Lines */}
              <line x1="633" y1="184" x2="645" y2="184" stroke="#fde68a" strokeWidth="1" />
              <line x1="633" y1="190" x2="645" y2="190" stroke="#fde68a" strokeWidth="1" />
              <line x1="633" y1="196" x2="645" y2="196" stroke="#fde68a" strokeWidth="1" />

              <text x="615" y="196" textAnchor="end" fill="#fbbf24" fontSize="11" fontWeight="bold">डि.पि.</text>
              <text x="615" y="206" textAnchor="end" fill="#fde68a" fontSize="8">(DP Box)</text>
            </g>

            {/* Stay Wire & Anchor (Node 11) */}
            <g
              onClick={() => setSelectedNodeId('stay')}
              className="cursor-pointer group"
            >
              {/* Stay Wire at 45 degree angle */}
              <line
                x1="644"
                y1="165"
                x2="730"
                y2="320"
                stroke={selectedNodeId === 'stay' ? '#f43f5e' : '#cbd5e1'}
                strokeWidth={selectedNodeId === 'stay' ? '3' : '2'}
                className="transition-all"
              />
              {/* Stay Insulator Egg */}
              <ellipse cx="690" cy="245" rx="5" ry="4" fill="#ffffff" stroke="#000000" strokeWidth="1" />
              {/* Stay Turnbuckle & Ground Anchor */}
              <rect x="715" y="295" width="6" height="12" fill="#94a3b8" />
              {/* Ground Anchor Plate */}
              <line x1="720" y1="320" x2="745" y2="360" stroke="#64748b" strokeWidth="3" />
              <rect x="735" y="355" width="20" height="5" fill="#475569" />

              <text x="705" y="235" fill={selectedNodeId === 'stay' ? '#f43f5e' : '#fecdd3'} fontSize="11" fontWeight="bold">स्टे</text>
              <text x="705" y="246" fill="#fda4af" fontSize="8">(Stay 45°)</text>
            </g>

            {/* Drop Wire Spanning to House (Node 12) */}
            <g
              onClick={() => setSelectedNodeId('drop-wire')}
              className="cursor-pointer group"
            >
              <path
                d="M 648 180 Q 690 195, 740 240"
                fill="none"
                stroke={selectedNodeId === 'drop-wire' ? '#f59e0b' : '#38bdf8'}
                strokeWidth={selectedNodeId === 'drop-wire' ? '3.5' : '2'}
                strokeDasharray={isSimulating ? '4 2' : 'none'}
                className="transition-all"
              />
              <text x="690" y="152" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">ड्रपवायर</text>
              <text x="690" y="163" textAnchor="middle" fill="#bae6fd" fontSize="8">(Drop Wire)</text>
            </g>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* 4. SUBSCRIBER PREMISES / HOUSE (Right side)             */}
            {/* ═══════════════════════════════════════════════════════ */}
            {/* House Structure */}
            <g>
              {/* House Roof Slant */}
              <polygon points="730,230 830,230 780,200" fill="#334155" stroke="#64748b" strokeWidth="2" />
              {/* House Body */}
              <rect x="740" y="230" width="90" height="90" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
              {/* Window */}
              <rect x="795" y="245" width="20" height="18" fill="#38bdf8" opacity="0.6" stroke="#0284c7" strokeWidth="1" />
              {/* Door */}
              <rect x="790" y="280" width="20" height="40" fill="#0f172a" stroke="#475569" strokeWidth="1" />
            </g>

            {/* Krone Box on Outside Wall (Node 13) */}
            <g
              onClick={() => setSelectedNodeId('krone-box')}
              className="cursor-pointer group"
            >
              <rect
                x="745"
                y="245"
                width="14"
                height="18"
                rx="2"
                fill={selectedNodeId === 'krone-box' ? '#b45309' : '#78350f'}
                stroke={selectedNodeId === 'krone-box' ? '#fbbf24' : '#f59e0b'}
                strokeWidth={selectedNodeId === 'krone-box' ? '2.5' : '1.5'}
                className="transition-all"
              />
              <text x="850" y="248" fill="#fbbf24" fontSize="11" fontWeight="bold">क्रोन बक्स</text>
              <text x="850" y="258" fill="#fde68a" fontSize="8">(Krone Box)</text>
              <line x1="845" y1="248" x2="765" y2="248" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" />
            </g>

            {/* House Wire along Wall (Node 14) */}
            <g
              onClick={() => setSelectedNodeId('house-wire')}
              className="cursor-pointer group"
            >
              <path
                d="M 752 263 L 752 300 L 768 300"
                fill="none"
                stroke={selectedNodeId === 'house-wire' ? '#f43f5e' : '#e2e8f0'}
                strokeWidth={selectedNodeId === 'house-wire' ? '3' : '2'}
                strokeDasharray={isSimulating ? '3 1' : 'none'}
                className="transition-all"
              />
              <text x="740" y="350" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold">हाउस वायर</text>
              <text x="740" y="360" textAnchor="middle" fill="#94a3b8" fontSize="8">(House Wire)</text>
            </g>

            {/* Telephone Set on Table (Node 15) */}
            <g
              onClick={() => setSelectedNodeId('telephone')}
              className="cursor-pointer group"
            >
              {/* Table */}
              <line x1="760" y1="305" x2="785" y2="305" stroke="#64748b" strokeWidth="2" />
              
              {/* Telephone Base */}
              <rect
                x="765"
                y="292"
                width="16"
                height="12"
                rx="2"
                fill={selectedNodeId === 'telephone' ? '#1e40af' : '#1e293b'}
                stroke={selectedNodeId === 'telephone' ? '#60a5fa' : '#3b82f6'}
                strokeWidth={selectedNodeId === 'telephone' ? '2.5' : '1.5'}
                className="transition-all"
              />
              {/* Telephone Handset */}
              <path d="M 763 290 Q 773 286, 783 290" fill="none" stroke="#60a5fa" strokeWidth="2.5" />
              {/* Ringing Soundwaves if simulating telephone */}
              {isSimulating && simStep === 14 && (
                <>
                  <path d="M 760 282 Q 773 276, 786 282" fill="none" stroke="#fbbf24" strokeWidth="1.5" className="animate-ping" />
                  <path d="M 758 276 Q 773 270, 788 276" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
                </>
              )}
              
              <text x="815" y="348" fill="#60a5fa" fontSize="11" fontWeight="bold">टेलिफोन</text>
              <text x="815" y="358" fill="#93c5fd" fontSize="8">(Telephone)</text>
              <line x1="810" y1="345" x2="782" y2="302" stroke="#60a5fa" strokeWidth="1" strokeDasharray="2 2" />
            </g>
          </svg>
          ) : (
            <svg
              viewBox="0 0 1000 480"
              className="w-full min-w-[760px] h-auto select-none"
              style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
            >
              <defs>
                <linearGradient id="ftthOfficeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0f172a" />
                  <stop offset="100%" stopColor="#064e3b" />
                </linearGradient>
                <linearGradient id="ftthGroundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#064e3b" />
                </linearGradient>
                <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* ─── GROUND LEVEL BASELINE ─── */}
              <rect x="0" y="320" width="1000" height="160" fill="url(#ftthGroundGrad)" opacity="0.3" />
              <line x1="0" y1="320" x2="1000" y2="320" stroke="#10b981" strokeWidth="3" strokeDasharray="6 3" />
              <text x="20" y="338" fill="#a7f3d0" fontSize="10" fontFamily="sans-serif">जमिनको सतह (Ground Level)</text>

              {/* ═══════════════════════════════════════════════════════ */}
              {/* 1. TELECOM CENTRAL OFFICE BUILDING (Left side)          */}
              {/* ═══════════════════════════════════════════════════════ */}
              <rect x="30" y="70" width="160" height="340" rx="4" fill="url(#ftthOfficeGrad)" stroke="#10b981" strokeWidth="2" />
              
              {/* Floor Dividers */}
              <line x1="30" y1="180" x2="190" y2="180" stroke="#10b981" strokeWidth="1.5" />
              <line x1="30" y1="290" x2="190" y2="290" stroke="#10b981" strokeWidth="1.5" />

              {/* Room Labels */}
              <text x="110" y="92" textAnchor="middle" fill="#a7f3d0" fontSize="11" fontWeight="bold">स्विचिङ रुम (Switching)</text>
              <text x="110" y="200" textAnchor="middle" fill="#a7f3d0" fontSize="11" fontWeight="bold">ओ.डि.एफ. (O.D.F.)</text>
              <text x="110" y="310" textAnchor="middle" fill="#a7f3d0" fontSize="11" fontWeight="bold">केबल भल्ट (Cable Vault)</text>

              {/* OLT Rack (Node 1) */}
              <g
                onClick={() => setSelectedNodeId('olt')}
                className="cursor-pointer group"
              >
                <rect
                  x="50"
                  y="105"
                  width="120"
                  height="65"
                  rx="4"
                  fill={selectedNodeId === 'olt' ? '#064e3b' : '#0f172a'}
                  stroke={selectedNodeId === 'olt' ? '#34d399' : '#10b981'}
                  strokeWidth={selectedNodeId === 'olt' ? '3' : '1.5'}
                  className="transition-all"
                />
                {/* Rack Shelves & Cards */}
                <line x1="70" y1="112" x2="70" y2="162" stroke="#10b981" strokeWidth="1.5" />
                <line x1="90" y1="112" x2="90" y2="162" stroke="#10b981" strokeWidth="1.5" />
                <line x1="110" y1="112" x2="110" y2="162" stroke="#10b981" strokeWidth="1.5" />
                <line x1="130" y1="112" x2="130" y2="162" stroke="#10b981" strokeWidth="1.5" />
                <line x1="150" y1="112" x2="150" y2="162" stroke="#10b981" strokeWidth="1.5" />
                {/* Fiber SFP Ports */}
                <circle cx="70" cy="125" r="2" fill="#10b981" />
                <circle cx="90" cy="125" r="2" fill="#10b981" />
                <circle cx="110" cy="125" r="2" fill="#10b981" />
                <circle cx="130" cy="125" r="2" fill="#10b981" />
                <circle cx="150" cy="125" r="2" fill="#10b981" />
                {/* Active LED indicators */}
                <circle cx="60" cy="115" r="2.5" fill="#4ade80" className="animate-ping" />
                <circle cx="60" cy="115" r="2.5" fill="#4ade80" />
                <circle cx="60" cy="125" r="2" fill="#34d399" />
                <circle cx="60" cy="135" r="2" fill="#059669" />
                <text x="110" y="145" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                  O-LT Rack
                </text>
              </g>

              {/* Cable from OLT to ODF */}
              <path
                d="M 110 170 C 110 185, 90 190, 90 215"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
              />
              {isSimulating && simStep >= 0 && (
                <path
                  d="M 110 170 C 110 185, 90 190, 90 215"
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="10 15"
                >
                  <animate attributeName="stroke-dashoffset" values="100;0" dur="1.5s" repeatCount="indefinite" />
                </path>
              )}

              {/* ODF Block (Node 2) */}
              <g
                onClick={() => setSelectedNodeId('odf')}
                className="cursor-pointer group"
              >
                <rect
                  x="60"
                  y="215"
                  width="100"
                  height="65"
                  rx="3"
                  fill={selectedNodeId === 'odf' ? '#065f46' : '#111827'}
                  stroke={selectedNodeId === 'odf' ? '#a7f3d0' : '#34d399'}
                  strokeWidth={selectedNodeId === 'odf' ? '3' : '1.5'}
                  className="transition-all"
                />
                {/* Splicing Adapter Slots */}
                <line x1="72" y1="225" x2="92" y2="225" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="72" y1="235" x2="92" y2="235" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="72" y1="245" x2="92" y2="245" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="72" y1="255" x2="92" y2="255" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="128" y1="225" x2="148" y2="225" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="128" y1="235" x2="148" y2="235" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="128" y1="245" x2="148" y2="245" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="128" y1="255" x2="148" y2="255" stroke="#cbd5e1" strokeWidth="2" />

                {/* Green fiber patches */}
                <path d="M 92 235 C 110 235, 110 255, 128 255" fill="none" stroke="#10b981" strokeWidth="2" />
                <path d="M 92 225 C 110 225, 110 245, 128 245" fill="none" stroke="#34d399" strokeWidth="2" />
                <text x="110" y="274" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">O-DF Frame</text>
              </g>

              {/* Cable from ODF to Cable Vault */}
              <path
                d="M 110 280 L 110 325"
                fill="none"
                stroke="#047857"
                strokeWidth="4"
              />
              {isSimulating && simStep >= 1 && (
                <path
                  d="M 110 280 L 110 325"
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray="10 15"
                >
                  <animate attributeName="stroke-dashoffset" values="100;0" dur="1.5s" repeatCount="indefinite" />
                </path>
              )}

              {/* Cable Vault (Node 3) */}
              <g
                onClick={() => setSelectedNodeId('cable-vault')}
                className="cursor-pointer group"
              >
                <rect
                  x="50"
                  y="325"
                  width="120"
                  height="70"
                  rx="3"
                  fill={selectedNodeId === 'cable-vault' ? '#064e3b' : '#1f2937'}
                  stroke={selectedNodeId === 'cable-vault' ? '#6ee7b7' : '#10b981'}
                  strokeWidth={selectedNodeId === 'cable-vault' ? '3' : '1.5'}
                  className="transition-all"
                />
                {/* Splice Joint */}
                <ellipse cx="110" cy="355" rx="14" ry="8" fill="#047857" stroke="#34d399" strokeWidth="2" />
                <rect x="100" y="348" width="20" height="14" rx="2" fill="#10b981" />
                <text x="110" y="382" textAnchor="middle" fill="#a7f3d0" fontSize="10" fontWeight="bold">केबल भल्ट</text>
              </g>

              {/* ═══════════════════════════════════════════════════════ */}
              {/* 2. PRIMARY UNDERGROUND DUCT ROUTE                       */}
              {/* ═══════════════════════════════════════════════════════ */}

              {/* PLB HDPE Duct Pipe (Node 4) */}
              <g
                onClick={() => setSelectedNodeId('duct')}
                className="cursor-pointer group"
              >
                <rect
                  x="170"
                  y="385"
                  width="370"
                  height="24"
                  rx="3"
                  fill={selectedNodeId === 'duct' ? '#78350f' : '#292524'}
                  stroke={selectedNodeId === 'duct' ? '#f59e0b' : '#d97706'}
                  strokeWidth={selectedNodeId === 'duct' ? '2.5' : '1.5'}
                  opacity="0.85"
                  className="transition-all"
                />
                <line x1="170" y1="388" x2="540" y2="388" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="5 3" />
                <line x1="170" y1="405" x2="540" y2="405" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="5 3" />
                <line x1="170" y1="397" x2="540" y2="397" stroke="#10b981" strokeWidth="3" />
                <text x="205" y="401" fill="#fef08a" fontSize="8" fontWeight="extrabold" letterSpacing="0.5">PLB HDPE DUCT</text>
              </g>
              {isSimulating && simStep >= 3 && (
                <line
                  x1="170"
                  y1="397"
                  x2="540"
                  y2="397"
                  stroke="#34d399"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="10 15"
                >
                  <animate attributeName="stroke-dashoffset" values="100;0" dur="2.5s" repeatCount="indefinite" />
                </line>
              )}

              {/* Feeder Fiber cable from Vault */}
              <path
                d="M 110 395 C 110 405, 170 397, 170 397"
                fill="none"
                stroke="#10b981"
                strokeWidth="4"
              />
              {isSimulating && simStep >= 2 && (
                <path
                  d="M 110 395 C 110 405, 170 397, 170 397"
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray="10 15"
                >
                  <animate attributeName="stroke-dashoffset" values="100;0" dur="1.5s" repeatCount="indefinite" />
                </path>
              )}

              {/* Manhole & Joint OFC Closure (Node 5) */}
              <g
                onClick={() => setSelectedNodeId('manhole-joint')}
                className="cursor-pointer group"
              >
                <rect
                  x="240"
                  y="324"
                  width="70"
                  height="90"
                  rx="4"
                  fill={selectedNodeId === 'manhole-joint' ? '#111827' : '#1f2937'}
                  stroke={selectedNodeId === 'manhole-joint' ? '#6ee7b7' : '#94a3b8'}
                  strokeWidth={selectedNodeId === 'manhole-joint' ? '3' : '1.5'}
                  className="transition-all"
                />
                <rect x="245" y="320" width="60" height="5" rx="1" fill="#475569" stroke="#334155" strokeWidth="1" />
                <rect x="257" y="345" width="36" height="40" rx="4" fill="#030712" stroke="#10b981" strokeWidth="1.5" />
                <line x1="257" y1="352" x2="293" y2="352" stroke="#10b981" strokeWidth="1" />
                <line x1="257" y1="359" x2="293" y2="359" stroke="#10b981" strokeWidth="1" />
                <line x1="257" y1="366" x2="293" y2="366" stroke="#10b981" strokeWidth="1" />
                <line x1="257" y1="373" x2="293" y2="373" stroke="#10b981" strokeWidth="1" />
                <path d="M 275 385 C 265 385, 260 395, 275 395 C 290 395, 285 385, 275 385" fill="none" stroke="#34d399" strokeWidth="1.5" />
                <text x="275" y="405" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">म्यानहोल</text>
                <text x="275" y="340" textAnchor="middle" fill="#6ee7b7" fontSize="8" fontWeight="bold">Joint OFC</text>
              </g>

              {/* Handhole (Node 6) */}
              <g
                onClick={() => setSelectedNodeId('handhole')}
                className="cursor-pointer group"
              >
                <rect
                  x="360"
                  y="334"
                  width="52"
                  height="80"
                  rx="3"
                  fill={selectedNodeId === 'handhole' ? '#111827' : '#1f2937'}
                  stroke={selectedNodeId === 'handhole' ? '#6ee7b7' : '#64748b'}
                  strokeWidth={selectedNodeId === 'handhole' ? '3' : '1.5'}
                  className="transition-all"
                />
                <rect x="364" y="330" width="44" height="4" rx="1" fill="#475569" stroke="#334155" strokeWidth="1" />
                <rect x="371" y="355" width="30" height="20" rx="2" fill="#030712" stroke="#10b981" strokeWidth="1.2" />
                <path d="M 386 370 C 378 370, 374 378, 386 378 C 398 378, 394 370, 386 370" fill="none" stroke="#34d399" strokeWidth="1" />
                <text x="386" y="405" textAnchor="middle" fill="#94a3b8" fontSize="7" fontWeight="bold">ह्याण्डहोल</text>
              </g>

              {/* Secondhole (Node 7) */}
              <g
                onClick={() => setSelectedNodeId('secondhole')}
                className="cursor-pointer group"
              >
                <rect
                  x="530"
                  y="340"
                  width="60"
                  height="60"
                  rx="3"
                  fill={selectedNodeId === 'secondhole' ? '#111827' : '#1f2937'}
                  stroke={selectedNodeId === 'secondhole' ? '#6ee7b7' : '#475569'}
                  strokeWidth={selectedNodeId === 'secondhole' ? '3' : '1.5'}
                  className="transition-all"
                />
                <rect x="534" y="337" width="52" height="3" rx="1" fill="#334155" />
                <circle cx="550" cy="360" r="4" fill="none" stroke="#64748b" strokeWidth="1" />
                <circle cx="570" cy="360" r="4" fill="none" stroke="#64748b" strokeWidth="1" />
                <circle cx="560" cy="375" r="4" fill="none" stroke="#64748b" strokeWidth="1" />
                <text x="560" y="392" textAnchor="middle" fill="#94a3b8" fontSize="7" fontWeight="bold">सेकेण्डहोल</text>
              </g>

              {/* Fiber Distribution Cabinet & Splitter (Node 8) */}
              <g
                onClick={() => setSelectedNodeId('fdc-splitter')}
                className="cursor-pointer group"
              >
                <rect x="475" y="310" width="70" height="10" fill="#334155" stroke="#1e293b" />
                <rect
                  x="480"
                  y="220"
                  width="60"
                  height="90"
                  rx="3"
                  fill={selectedNodeId === 'fdc-splitter' ? '#065f46' : '#1f2937'}
                  stroke={selectedNodeId === 'fdc-splitter' ? '#a7f3d0' : '#10b981'}
                  strokeWidth={selectedNodeId === 'fdc-splitter' ? '3' : '1.5'}
                  className="transition-all"
                />
                <line x1="510" y1="220" x2="510" y2="310" stroke="#10b981" strokeWidth="1.2" />
                <rect x="506" y="255" width="2" height="8" rx="0.5" fill="#e2e8f0" />
                <rect x="512" y="255" width="2" height="8" rx="0.5" fill="#e2e8f0" />
                <rect x="490" y="235" width="40" height="35" rx="2" fill="#022c22" stroke="#34d399" strokeWidth="1" />
                <path d="M 495 252 L 505 252" fill="none" stroke="#34d399" strokeWidth="1.5" />
                <path d="M 505 252 Q 515 240, 525 242 M 505 252 L 525 252 M 505 252 Q 515 264, 525 262" fill="none" stroke="#f59e0b" strokeWidth="1" />
                <text x="510" y="300" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">FDC Splitter</text>
              </g>

              {/* Fiber linking Handhole to FDC Cabinet */}
              <path d="M 412 397 C 445 397, 445 315, 485 315" fill="none" stroke="#10b981" strokeWidth="3.5" />
              {isSimulating && simStep >= 5 && (
                <path
                  d="M 412 397 C 445 397, 445 315, 485 315"
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="5 10"
                >
                  <animate attributeName="stroke-dashoffset" values="100;0" dur="1s" repeatCount="indefinite" />
                </path>
              )}

              {/* Splitter outputs to secondhole */}
              <path d="M 535 310 C 535 320, 560 325, 560 340" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
              {isSimulating && simStep >= 7 && (
                <path
                  d="M 535 310 C 535 320, 560 325, 560 340"
                  fill="none"
                  stroke="#fef08a"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="5 10"
                >
                  <animate attributeName="stroke-dashoffset" values="100;0" dur="1s" repeatCount="indefinite" />
                </path>
              )}

              {/* From secondhole to Riser Pole */}
              <path d="M 590 370 L 610 370" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
              {isSimulating && simStep >= 7 && (
                <path
                  d="M 590 370 L 610 370"
                  fill="none"
                  stroke="#fef08a"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="5 10"
                >
                  <animate attributeName="stroke-dashoffset" values="100;0" dur="1s" repeatCount="indefinite" />
                </path>
              )}

              {/* Riser Pole (Node 9) */}
              <g
                onClick={() => setSelectedNodeId('riser-pole')}
                className="cursor-pointer group"
              >
                <line
                  x1="610"
                  y1="130"
                  x2="610"
                  y2="320"
                  stroke={selectedNodeId === 'riser-pole' ? '#38bdf8' : '#475569'}
                  strokeWidth={selectedNodeId === 'riser-pole' ? '7' : '4'}
                  className="transition-all"
                />
                <line x1="595" y1="130" x2="625" y2="130" stroke="#334155" strokeWidth="3" />
                <circle cx="610" cy="320" r="5" fill="#334155" />
                <rect x="604" y="320" width="12" height="12" fill="#64748b" />
                <line
                  x1="613"
                  y1="170"
                  x2="613"
                  y2="325"
                  stroke={selectedNodeId === 'riser-pole' ? '#94a3b8' : '#64748b'}
                  strokeWidth="3"
                />
                <line x1="613" y1="170" x2="613" y2="325" stroke="#f59e0b" strokeWidth="1.2" />
                <text x="560" y="150" fill="#94a3b8" fontSize="8" fontWeight="bold">राइजर पोल</text>
              </g>
              {isSimulating && simStep >= 8 && (
                <line
                  x1="613"
                  y1="170"
                  x2="613"
                  y2="325"
                  stroke="#fef08a"
                  strokeWidth="2.2"
                  strokeDasharray="5 5"
                >
                  <animate attributeName="stroke-dashoffset" values="0;100" dur="1.5s" repeatCount="indefinite" />
                </line>
              )}

              {/* Overhead Feeder connection between riser pole and FAP */}
              <path
                d="M 610 130 C 650 145, 690 145, 730 130"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
              />
              {isSimulating && simStep >= 8 && (
                <path
                  d="M 610 130 C 650 145, 690 145, 730 130"
                  fill="none"
                  stroke="#fef08a"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="5 10"
                >
                  <animate attributeName="stroke-dashoffset" values="100;0" dur="1.5s" repeatCount="indefinite" />
                </path>
              )}

              {/* FAP Box on Pole (Node 10) */}
              <g
                onClick={() => setSelectedNodeId('fap')}
                className="cursor-pointer group"
              >
                <line
                  x1="730"
                  y1="130"
                  x2="730"
                  y2="320"
                  stroke={selectedNodeId === 'fap' ? '#34d399' : '#475569'}
                  strokeWidth={selectedNodeId === 'fap' ? '7' : '4'}
                  className="transition-all"
                />
                <line x1="715" y1="130" x2="745" y2="130" stroke="#334155" strokeWidth="3" />
                <circle cx="730" cy="320" r="5" fill="#334155" />
                <rect x="724" y="320" width="12" height="12" fill="#64748b" />
                <rect
                  x="715"
                  y="160"
                  width="30"
                  height="40"
                  rx="3"
                  fill={selectedNodeId === 'fap' ? '#065f46' : '#1f2937'}
                  stroke={selectedNodeId === 'fap' ? '#34d399' : '#10b981'}
                  strokeWidth={selectedNodeId === 'fap' ? '3' : '1.5'}
                  className="transition-all"
                />
                <circle cx="723" cy="170" r="1.5" fill="#e2e8f0" />
                <circle cx="730" cy="170" r="1.5" fill="#e2e8f0" />
                <circle cx="737" cy="170" r="1.5" fill="#e2e8f0" />
                <circle cx="723" cy="180" r="1.5" fill="#e2e8f0" />
                <circle cx="730" cy="180" r="1.5" fill="#e2e8f0" />
                <circle cx="737" cy="180" r="1.5" fill="#e2e8f0" />
                <rect x="727" y="188" width="6" height="4" rx="0.5" fill="#10b981" />
                <text x="755" y="152" fill="#a7f3d0" fontSize="8" fontWeight="bold">FAP Box</text>
              </g>

              {/* Stay wire (Node 11) */}
              <g
                onClick={() => setSelectedNodeId('stay')}
                className="cursor-pointer group"
              >
                <line
                  x1="730"
                  y1="145"
                  x2="800"
                  y2="320"
                  stroke={selectedNodeId === 'stay' ? '#fbbf24' : '#64748b'}
                  strokeWidth={selectedNodeId === 'stay' ? '3' : '1.5'}
                  className="transition-all"
                />
                <ellipse cx="753" cy="202" rx="4" ry="6" transform="rotate(-45, 753, 202)" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="1" />
                <rect x="780" y="270" width="4" height="15" rx="1" transform="rotate(-21.8, 780, 270)" fill="#9ca3af" stroke="#4b5563" strokeWidth="1" />
                <rect x="793" y="315" width="14" height="6" fill="#334155" />
                <text x="785" y="260" fill="#94a3b8" fontSize="8" fontWeight="bold">स्टे</text>
              </g>

              {/* Fiber Drop Cable (Node 12) */}
              <g
                onClick={() => setSelectedNodeId('drop-fiber')}
                className="cursor-pointer group"
              >
                <path
                  d="M 730 190 Q 780 230, 842 250"
                  fill="none"
                  stroke={selectedNodeId === 'drop-fiber' ? '#10b981' : '#1f2937'}
                  strokeWidth={selectedNodeId === 'drop-fiber' ? '3' : '1.8'}
                  className="transition-all"
                />
                <text x="790" y="222" fill="#a7f3d0" fontSize="8" fontWeight="bold" transform="rotate(15, 790, 222)">Fiber Drop Cable</text>
              </g>
              {isSimulating && simStep >= 11 && (
                <path
                  d="M 730 190 Q 780 230, 842 250"
                  fill="none"
                  stroke="#6ee7b7"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeDasharray="5 10"
                >
                  <animate attributeName="stroke-dashoffset" values="100;0" dur="1s" repeatCount="indefinite" />
                </path>
              )}

              {/* House Boundary Structure */}
              <polygon points="840,210 900,170 960,210" fill="#1e293b" stroke="#10b981" strokeWidth="1.5" />
              <rect x="840" y="210" width="120" height="110" rx="2" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
              <rect x="850" y="235" width="22" height="25" fill="#1e293b" stroke="#334155" />
              <rect x="840" y="248" width="6" height="10" rx="1" fill="#4b5563" />

              {/* Indoor House wire fiber route (Node 13) */}
              <g
                onClick={() => setSelectedNodeId('indoor-fiber')}
                className="cursor-pointer group"
              >
                <path
                  d="M 843 253 L 880 253 L 880 285"
                  fill="none"
                  stroke={selectedNodeId === 'indoor-fiber' ? '#f59e0b' : '#ffffff'}
                  strokeWidth={selectedNodeId === 'indoor-fiber' ? '2.5' : '1.2'}
                  className="transition-all"
                />
                <text x="895" y="250" fill="#cbd5e1" fontSize="7" fontWeight="medium">इन्डोर फाइबर</text>
              </g>
              {isSimulating && simStep >= 12 && (
                <path
                  d="M 843 253 L 880 253 L 880 285"
                  fill="none"
                  stroke="#fef08a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="3 5"
                >
                  <animate attributeName="stroke-dashoffset" values="100;0" dur="0.8s" repeatCount="indefinite" />
                </path>
              )}

              {/* ONT Wi-Fi Router (Node 14) */}
              <g
                onClick={() => setSelectedNodeId('ont')}
                className="cursor-pointer group"
              >
                <rect
                  x="862"
                  y="285"
                  width="36"
                  height="22"
                  rx="2"
                  fill={selectedNodeId === 'ont' ? '#065f46' : '#1e293b'}
                  stroke={selectedNodeId === 'ont' ? '#34d399' : '#10b981'}
                  strokeWidth={selectedNodeId === 'ont' ? '2.5' : '1.2'}
                  className="transition-all"
                />
                <line x1="867" y1="285" x2="861" y2="270" stroke="#10b981" strokeWidth="1.2" />
                <line x1="893" y1="285" x2="899" y2="270" stroke="#10b981" strokeWidth="1.2" />
                <circle cx="868" cy="296" r="1.2" fill="#34d399" className="animate-pulse" />
                <circle cx="873" cy="296" r="1.2" fill="#34d399" />
                <circle cx="878" cy="296" r="1.2" fill="#34d399" />
                <circle cx="883" cy="296" r="1.2" fill="#34d399" />
                <text x="880" y="303" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">ONT</text>
              </g>

              {/* Telephone Set on Desk (Node 15) */}
              <g
                onClick={() => setSelectedNodeId('telephone-ip')}
                className="cursor-pointer group"
              >
                <rect
                  x="915"
                  y="292"
                  width="28"
                  height="15"
                  rx="1.5"
                  fill={selectedNodeId === 'telephone-ip' ? '#0284c7' : '#1e293b'}
                  stroke={selectedNodeId === 'telephone-ip' ? '#60a5fa' : '#3b82f6'}
                  strokeWidth={selectedNodeId === 'telephone-ip' ? '2.5' : '1.2'}
                  className="transition-all"
                />
                <rect x="918" y="295" width="12" height="6" fill="#022c22" stroke="#34d399" strokeWidth="0.5" />
                <line x1="934" y1="295" x2="939" y2="295" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="934" y1="299" x2="939" y2="299" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="934" y1="303" x2="939" y2="303" stroke="#cbd5e1" strokeWidth="1" />
                <path d="M 898 296 C 905 296, 905 299, 915 299" fill="none" stroke="#60a5fa" strokeWidth="1" />
                {isSimulating && simStep === 14 && (
                  <>
                    <circle cx="924" cy="285" r="4" fill="none" stroke="#fbbf24" strokeWidth="1" className="animate-ping" />
                    <path d="M 919 285 Q 924 282, 929 285" fill="none" stroke="#fbbf24" strokeWidth="1.2" />
                  </>
                )}
                <text x="929" y="318" textAnchor="middle" fill="#60a5fa" fontSize="8" fontWeight="bold">आईपी फोन</text>
              </g>
            </svg>
          )}
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* COMPONENT CAROUSEL / SELECTOR & DETAILED INSPECTOR CARD           */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: 15 Components List */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Network className="w-4 h-4 text-emerald-400" />
              १५ वटा मुख्य संरचना सूची ({filteredNodes.length})
            </h3>
            <span className="text-[10px] text-slate-400">क्लिक गरी हेर्नुहोस्</span>
          </div>

          <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
            {filteredNodes.map((node, index) => {
              const isSelected = node.id === selectedNodeId;
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all border flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-400 shadow-lg scale-[1.01]'
                      : 'bg-slate-950/70 border-slate-800/80 text-slate-300 hover:bg-slate-850 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isSelected ? 'bg-white text-blue-900' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold leading-tight">{node.nameNepali}</p>
                      <p
                        className={`text-[10px] ${
                          isSelected ? 'text-blue-100' : 'text-slate-400'
                        }`}
                      >
                        {node.nameEnglish}
                      </p>
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Detailed Technical Inspector Card */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="bg-indigo-900/80 border border-indigo-700 text-indigo-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                {selectedNode.sectionNepali}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                {selectedNode.nameNepali}
              </h2>
              <p className="text-xs text-amber-400 font-semibold">{selectedNode.nameEnglish}</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-right">
              <span className="text-[10px] text-slate-400 block">CTEVT तह-१ मानक</span>
              <span className="text-xs font-bold text-emerald-400">NSTB Skill Standard</span>
            </div>
          </div>

          {/* Quick Summary Box */}
          <div className="bg-indigo-950/40 border border-indigo-800/40 p-4 rounded-xl space-y-1">
            <span className="text-xs font-bold text-amber-300">कार्यप्रणाली तथा भूमिका:</span>
            <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
              {selectedNode.detailedFunctionNepali}
            </p>
          </div>

          {/* Technical Specifications Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Zap className="w-4 h-4 text-amber-400" />
              प्राविधिक विशिष्टताहरू (Technical Specifications)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(selectedNode.technicalSpecs).map(([specKey, specVal], idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-medium">{specKey}</span>
                  <span className="text-xs font-bold text-white mt-0.5 block">{specVal}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Field Practical Guidelines */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Wrench className="w-4 h-4 text-emerald-400" />
              फिल्ड कार्यशाला निर्देशिका (Field Practical Guidelines)
            </h4>
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
              {selectedNode.fieldGuidelines.map((guide, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{guide}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTEVT Level-1 Exam Questions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
              <HelpCircle className="w-4 h-4 text-purple-400" />
              CTEVT परीक्षामा सोधिने मुख्य प्रश्नोत्तर (Exam Q&A)
            </h4>
            <div className="space-y-2">
              {selectedNode.examQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="bg-purple-950/30 border border-purple-800/40 p-3 rounded-xl text-xs text-purple-200"
                >
                  <span className="font-bold text-amber-300">प्र. {idx + 1}: </span>
                  {q}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
