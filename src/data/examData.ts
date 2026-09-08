import { ExamQuestionMCQ, VivaQuestion, SubjectiveQuestion, MatchingGroup, SpottingItem } from '../types';
import { allSubjectiveQuestions, subjectiveSetsList } from './subjectiveSetsData';

// ==========================================
// 1. MULTIPLE CHOICE QUESTIONS (MCQs) - 65+ High-Yield Questions
// ==========================================
export const modelExamLevel2MCQs: ExamQuestionMCQ[] = [
  // --- PDF 1 (Exam Paper 1) Questions ---
  {
    id: 1,
    questionNepali: 'पोलको टूप्पाबाट बाइडल ररङ्ग (Bridle Ring) कनत मूनि कनसन्छ?',
    options: { A: '१५ से.मी.', B: '२० से.मी.', C: '२५ से.मी.', D: '३० से.मी.' },
    correctAnswer: 'B',
    explanationNepali: 'पोलको टुप्पाबाट ब्राइडल रिङ साधारणतया २० से.मी. मुनि कसिन्छ। (PDF उत्तर कुञ्जी अनुसार)',
    category: 'tools'
  },
  {
    id: 2,
    questionNepali: 'केबल पोलको टूप्पाबाट कनत मूनि रानखन्छ?',
    options: { A: '४० से.मी.', B: '४५ से.मी.', C: '५० से.मी.', D: '५५ से.मी.' },
    correctAnswer: 'C',
    explanationNepali: 'केबललाई पोलको टुप्पाबाट ५० से.मी. मुनि फिक्स गरिन्छ।',
    category: 'telecom'
  },
  {
    id: 3,
    questionNepali: '५० पेर्रको एररर्ल केबलको निथ ओपनिङ्ग (Sheath Opening) कनत हुन्छः',
    options: { A: '३० से.मी.', B: '४१ से.मी.', C: '४३ से.मी.', D: '४७ से.मी.' },
    correctAnswer: 'C',
    explanationNepali: '५० पेयरको एरियल केबल जोड गर्दा सिथ ओपनिङ ४३ से.मी. गर्नुपर्दछ।',
    category: 'copper'
  },
  {
    id: 4,
    questionNepali: 'AMP meter ले के िानपन्छ?',
    options: { A: 'क्यापासिटेन्स', B: 'करेन्ट', C: 'रेजिस्टेन्स', D: 'भोल्टेज' },
    correctAnswer: 'B',
    explanationNepali: 'Ammeter (Amp meter) ले विद्युतीय परिपथमा बग्ने विद्युत करेन्ट (Current) नाप्दछ।',
    category: 'electrical'
  },
  {
    id: 5,
    questionNepali: 'फास्टिर (Fastener) कुि वार्रको लानग प्रर्ोग गररन्छ?',
    options: { A: 'जम्प वायर', B: 'हाउस वायर', C: 'इप वायर', D: 'लाइि वायर' },
    correctAnswer: 'D',
    explanationNepali: 'फास्टनर मुख्यतया पोलमा वा भित्तामा लाइन वायर (Line Wire) लाई अड्याउन प्रयोग गरिन्छ।',
    category: 'tools'
  },
  {
    id: 6,
    questionNepali: '४० नमटरको के वल स्पाि (Span) मा कनतपटक टूइष्ट (Twist) गररन्छ?',
    options: { A: '२ पटक', B: '३ पटक', C: '४ पटक', D: '५ पटक' },
    correctAnswer: 'B',
    explanationNepali: '४० मिटरको केबल स्पान (Span) मा हावाको चाप र कम्पन कम गर्न ३ पटक ट्विस्ट गरिन्छ।',
    category: 'telecom'
  },
  {
    id: 7,
    questionNepali: 'Bridle Ring कुि वार्रको लानग प्रर्ोग हुन्छ?',
    options: { A: 'ग्रुप वायर', B: 'हाउस वायर', C: 'जम्पर वायर', D: 'लाइि वायर' },
    correctAnswer: 'D',
    explanationNepali: 'ब्राइडल रिङ (Bridle Ring) मुख्यतया पोलबाट ग्राहकको घरसम्म जाने लाइन वायर (Line Wire) वा ड्रप वायरलाई व्यवस्थित गर्न प्रयोग हुन्छ।',
    category: 'tools'
  },
  {
    id: 8,
    questionNepali: 'पोलमा भऱ्याङ्ग कनत नडनग्र (Degree) मा राख्िुपियछ?',
    options: { A: '४५°', B: '६०°', C: '७५°', D: '८०°' },
    correctAnswer: 'C',
    explanationNepali: 'सुरक्षित रूपमा पोलमा भऱ्याङ्ग अडाउन ७५ डिग्री (75°) को कोण राख्नुपर्दछ।',
    category: 'safety'
  },
  {
    id: 9,
    questionNepali: 'ड्रप बार्र जोइि गदाा कुि किेक्टर प्रर्ोग गररन्छ?',
    options: { A: 'Modular Connector', B: 'UY Connector', C: 'UPW Connector', D: 'WR Connector' },
    correctAnswer: 'B',
    explanationNepali: '२-कोर कपर ड्रप वायर जोड्नका लागि वाटरप्रुफ UY Connector (जेल कनेक्टर) प्रयोग गरिन्छ।',
    category: 'copper'
  },
  {
    id: 10,
    questionNepali: 'टेनलफोि सेटमा डार्ले टोि (Dial Tone) छ भिे कनत भोल्ट आउछ?',
    options: { A: '-30 vdc', B: '+30 vdc', C: '-48 vdc', D: '+48 vdc' },
    correctAnswer: 'C',
    explanationNepali: 'टेलिफोन सेट निष्क्रिय अवस्था (Idle / On-Hook) मा डायल टोन हुँदा -48 VDC भोल्टेज आउँछ।',
    category: 'telecom'
  },
  {
    id: 11,
    questionNepali: 'प्राइमरर पेर्र (Primary Pair) कनत नडनजट (Digits) को हुन्छ?',
    options: { A: '३ डिजिट', B: '४ डिजिट', C: '५ डिजिट', D: '६ डिजिट' },
    correctAnswer: 'C',
    explanationNepali: 'नेपाल टेलिकममा प्राथमिक पेयर पहिचान गर्दा ५ डिजिटको नम्बर कोड प्रयोग हुन्छ।',
    category: 'telecom'
  },
  {
    id: 12,
    questionNepali: 'टेनलफोि स्वीि (MSAN) मा कनतवटा फाइबर जोनडन्छ?',
    options: { A: '२ फाइबर', B: '४ फाइबर', C: '६ फाइबर', D: '८ फाइबर' },
    correctAnswer: 'A',
    explanationNepali: 'MSAN (Multi Service Access Node) स्विचमा अपलिङ्कका लागि मुख्यतया २ वटा फाइबर (Rx र Tx) जोडिन्छ।',
    category: 'fiber'
  },
  {
    id: 13,
    questionNepali: 'FAP (FTTH) िेटवकयमा कनतवटा फाइबर जोनडन्छः',
    options: { A: '१ फाइबर', B: '२ फाइबर', C: '३ फाइबर', D: '४ फाइबर' },
    correctAnswer: 'A',
    explanationNepali: 'FTTH को FAP (Fiber Access Point) नेटवर्कमा ग्राहक तर्फ १ कोर फाइबर मात्र जोडिन्छ।',
    category: 'fiber'
  },
  {
    id: 14,
    questionNepali: 'के निष्टर (Canister) कुि क्लोजरमा प्रर्ोग गररन्छः',
    options: { A: 'अप्टीकल क्लोजर', B: 'अण्डर ग्राउण्ड क्लोजर', C: 'डक्ट क्लोजर', D: 'एरियल क्लोजर' },
    correctAnswer: 'A',
    explanationNepali: 'क्यानिष्टर (Canister) मुख्य रूपमा फाइबर अप्टिकल जोइन्ट क्लोजर (Optical Closure) मा सुरक्षात्मक कभरको रूपमा प्रयोग गरिन्छ।',
    category: 'fiber'
  },
  {
    id: 15,
    questionNepali: '३०० पेर्रको अण्डर ग्राउण्ड के वलको निव ओपनिङ्ग (Sheath Opening) कनत हुन्छः',
    options: { A: '45 cm', B: '46 cm', C: '47 cm', D: '48 cm' },
    correctAnswer: 'C',
    explanationNepali: '३०० पेयरको ठूलो भूमिगत कपर केबल टर्मिनेसन गर्दा ४७.५ से.मी. (राउन्डमा ४७ से.मी.) सिथ खोल्नुपर्छ।',
    category: 'copper'
  },
  {
    id: 16,
    questionNepali: 'एम नड एफ (MDF) को प्राइमरी साइड कूि केबल प्रर्ोग गररन्छ?',
    options: { A: 'अण्डरग्राउण्ड केबल', B: 'अप्टीकल केबल', C: 'एरियल केबल', D: 'स्वीचबोर्ड केबल' },
    correctAnswer: 'A',
    explanationNepali: 'MDF को प्राइमरी साइड (D-Side / Line Side) मा बाहिरबाट आउने अण्डरग्राउण्ड (भूमिगत) केबल टर्मिनेट गरिन्छ।',
    category: 'telecom'
  },
  {
    id: 17,
    questionNepali: 'प्राइमरी केवल जोड्ि कुि किेक्टर प्रर्ोग गररन्छ?',
    options: { A: 'Modular connector', B: 'UPW connector', C: 'UY connector', D: 'WR connector' },
    correctAnswer: 'A',
    explanationNepali: 'ठूला प्राथमिक कपर केबल (Primary Cable) हरू जोड्न २५-पेयर क्षमताको Modular Connector प्रयोग गरिन्छ।',
    category: 'copper'
  },
  {
    id: 18,
    questionNepali: '१५० पेर्रको केवलमा ७५ पेवर कूि सूपर र्ूनिट ग्रुप वाइन्डरमा पछयः',
    options: { A: 'निलो + सुन्तला', B: 'सुन्तला + निलो', C: 'हरियो + हरियो', D: 'हरियो + खैरो' },
    correctAnswer: 'D',
    explanationNepali: 'नेपाल टेलिकम मानक अनुसार १५० पेयर केबलमा ७५ औं पेयर हरियो र खैरो (Green + Brown) वाइन्डर समूहमा पर्दछ।',
    category: 'copper'
  },
  {
    id: 19,
    questionNepali: 'स्लाइसमा िइुवटा तार टूइष्ट गरेपनछ किेक्टर लगाउि कनतमा काट्िुपछय?',
    options: { A: '1 cm', B: '2 cm', C: '3 cm', D: '4 cm' },
    correctAnswer: 'A',
    explanationNepali: 'दुईवटा तारलाई जोडिसकेपछि UY कनेक्टरमा घुसाउनु अगाडि अतिरिक्त तारलाई १ से.मी. मा काट्नुपर्छ।',
    category: 'copper'
  },
  {
    id: 20,
    questionNepali: 'साधारण माटोमा पोलको लम्बाइको कनत भाग गािुुपछय?',
    options: { A: '१/४ भाग', B: '१/५ भाग', C: '१/६ भाग', D: '१/७ भाग' },
    correctAnswer: 'B',
    explanationNepali: 'NSTB Level 2 को यस परीक्षामा १/५ भाग पोल गाड्ने विकल्पलाई सही मानिएको छ। (यद्यपि इन्जिनियरिङ मानक १/६ हो)',
    category: 'safety'
  },
  {
    id: 21,
    questionNepali: '१० पेर्रको के वलमा ५ औ पेर्र कूि रंगको हुन्छ?',
    options: { A: 'सेतो + निलो', B: 'रातो + निलो', C: 'सेतो + हरियो', D: 'रातो + हरियो' },
    correctAnswer: 'C',
    explanationNepali: '१० पेयर कपर केबलमा ५ औं पेयर सेतो र हरियो (White + Green) रङको हुन्छ।',
    category: 'copper'
  },
  {
    id: 22,
    questionNepali: 'स्लीट/स्प्लिट (Split) फल्ट भर्ो भिे टेनलफोिमा के हुन्छ?',
    options: { A: 'डायल टोन आउँदैन', B: 'क्रस टक हुन्छ', C: 'नोइजी टोन हुन्छ', D: 'डबल डायल टोन' },
    correctAnswer: 'C',
    explanationNepali: 'केबल पेयर आपसमा मिसिँदा (Split Fault) लाइनमा नोइजी टोन आउँछ र क्रस-टक बढेर कुराकानी डिस्टर्ब हुन्छ।',
    category: 'telecom'
  },
  {
    id: 23,
    questionNepali: 'प्रोटोकाल िेटवकय कूि हो?',
    options: { A: 'HTTP', B: 'DHSP', C: 'DNS', D: 'POP' },
    correctAnswer: 'A',
    explanationNepali: 'HTTP (Hypertext Transfer Protocol) वेब ब्राउजिङका लागि प्रयोग हुने एउटा स्थापित नेटवर्क प्रोटोकल हो।',
    category: 'networking'
  },
  {
    id: 24,
    questionNepali: 'इन्टरिेट (Internet) के हो?',
    options: { A: 'Single Network', B: 'Vast collection of different networks', C: 'Inter connection of local network', D: 'Connection of computer & printer' },
    correctAnswer: 'B',
    explanationNepali: 'इन्टरनेट भनेको विश्वभरिका विभिन्न नेटवर्कहरूको ठूलो सञ्जाल (Vast collection of different networks) हो।',
    category: 'networking'
  },
  {
    id: 25,
    questionNepali: 'पोलको फेिको व्र्ास ४० से.मी. छ भिे खाल्टो खन्ने व्र्ास कनत खन्नूपछ?',
    options: { A: '५ से.मी.', B: '६० से.मी.', C: '७० से.मी.', D: '८० से.मी.' },
    correctAnswer: 'C',
    explanationNepali: '४० से.मी. व्यास भएको पोल गाड्नका लागि कम्तीमा ७० से.मी. व्यास भएको गोलाकार खाडल खन्नुपर्दछ।',
    category: 'safety'
  },
  {
    id: 26,
    questionNepali: '०.४ एम एम को केबलमा १५०० नमटरमा सटय भएको छ भिे लूप रेनजष्टेन्स कनत हून्छ?',
    options: { A: '270 ohms', B: '300 ohms', C: '360 ohms', D: '370 ohms' },
    correctAnswer: 'A',
    explanationNepali: '०.४ mm व्यास भएको तामाको तारको १५०० मिटर दूरीमा सर्ट हुँदा औसत लुप रेजिस्टेन्स २७० ओहम हुन्छ।',
    category: 'copper'
  },
  {
    id: 27,
    questionNepali: 'के नविेट वाट (C-Meter) टेस्ट गदााय ५ nF (nanofarad) आयो भिे कनत िरीमा फल्ट िेखाउंछ?',
    options: { A: '५०० मिटर', B: '७०० मिटर', C: '१००० मिटर', D: '१५०० मिटर' },
    correctAnswer: 'A',
    explanationNepali: 'ड्रप वायरको क्यापासिटेन्स औसतमा ५० nF प्रति किलोमिटर हुन्छ। तसर्थ ५ nF ले ५०० मिटरमा फल्ट भएको देखाउँछ।',
    category: 'tools'
  },
  {
    id: 28,
    questionNepali: '०.४ एम एम को के वल ५ किलोमिटर तार तान्िा कनत नड नव (dB) लस हुन्छ?',
    options: { A: '७ डि.वि.', B: '९ डि.वि.', C: '१० डि.वि.', D: '११ डि.वि.' },
    correctAnswer: 'B',
    explanationNepali: '०.४ mm को तामाको तारमा ५ किलोमिटर प्रसारण गर्दा लगभग ९ dB सिग्नल लस (Attenuation) हुन्छ।',
    category: 'copper'
  },
  {
    id: 29,
    questionNepali: 'ड्रपवार्र सटय फल्टमा नमटरले िाप्िा २९ ओहम आयो भिे फल्ट कनत नमटरमा हुन्छ?',
    options: { A: '४०० मिटर', B: '४५० मिटर', C: '५०० मिटर', D: '६०० मिटर' },
    correctAnswer: 'C',
    explanationNepali: '२९ ओहम रेजिस्टेन्स आएमा ड्रप वायर (०.९ mm कपर) को फल्ट दूरी लगभग ५०० मिटर मानिन्छ।',
    category: 'copper'
  },

  // --- Additional High-yield Level-2 Telecom Questions from PDF 2 ---
  {
    id: 30,
    questionNepali: 'विद्युतको 33kv line छ भने टेलिकम लाईन देखी कति मुनी राख्नुपर्छ?',
    options: { A: '१.५ मिटर', B: '१.७ मिटर', C: '२.० मिटर', D: '१.९ मिटर' },
    correctAnswer: 'C',
    explanationNepali: '३३ kV हाई-भोल्टेज विद्युत प्रसारण लाइन र टेलिकम लाइनबीच कम्तीमा २ मिटरको सुरक्षित ठाडो दूरी हुनुपर्छ।',
    category: 'safety'
  },
  {
    id: 31,
    questionNepali: 'सेकेन्डरी नेटवर्कमा अर्थिङ्ग रेजिस्तेन्स (Earth Resistance) कति हुनुपर्छ?',
    options: { A: '२० ओहम भन्दा कम', B: '५ ओहम भन्दा कम', C: '१० ओहम भन्दा कम', D: '३ ओहम भन्दा कम' },
    correctAnswer: 'C',
    explanationNepali: 'बाहिरी सेकेन्डरी क्याबिनेट तथा पोल सपोर्टहरूमा अर्थ रेजिस्टेन्स १० ओहम भन्दा कम हुनुपर्दछ।',
    category: 'electrical'
  },
  {
    id: 32,
    questionNepali: 'नेपाल टेलिकम नेटवर्क विस्तार गर्दा एम.डि.एफ. देखी ग्राहकको घर सम्म कति ओह्म सीमा हुनुपर्छ?',
    options: { A: '१०० ओहम', B: '२००० ओहम', C: '१५०० ओहम', D: '५०० ओहम' },
    correctAnswer: 'B',
    explanationNepali: 'MDF देखि ग्राहकको टेलिफोन सेटसम्मको अधिकतम व्यावहारिक कपर लुप रेजिस्टेन्स सीमा २००० ओहम तोकिएको छ।',
    category: 'telecom'
  },
  {
    id: 33,
    questionNepali: '१५० पेयर देखि १८०० पेयर सम्मको केवलको सिथ कति खोल्नु पर्छ?',
    options: { A: '३० से.मी.', B: '४३ से.मी.', C: '४७ से.मी.', D: '५० से.मी.' },
    correctAnswer: 'D',
    explanationNepali: '१५० भन्दा बढी र १८०० पेयरसम्मका ठूला कपर केबलहरूको स्प्लाइसिङ गर्दा ५० से.मी. सम्म सिथ खोल्न सिफारिस गरिन्छ।',
    category: 'copper'
  },
  {
    id: 34,
    questionNepali: 'सिधा रुट (Straight Route) भएको पोलमा कुन पोल एसेसरी प्रयोग गरिन्छ?',
    options: { A: 'Bridle Ring', B: 'Suspension Clamp', C: 'Pin Type Bracket', D: 'Distribution Bracket' },
    correctAnswer: 'B',
    explanationNepali: 'सिधा रुटमा केबललाई पोलमा झुण्ड्याउन र थेग्न Suspension Clamp प्रयोग गरिन्छ।',
    category: 'tools'
  },
  {
    id: 35,
    questionNepali: 'Underground network मा केबल लाई सुरक्षाको लागी कुन उपकरण प्रयोग गरिन्छ?',
    options: { A: 'Duct Pipe', B: 'Manhole', C: 'Handhole', D: 'माथिका सबै (All of the above)' },
    correctAnswer: 'D',
    explanationNepali: 'भूमिगत केबल सुरक्षा र मर्मतका लागि डक्ट पाइप, म्यानहोल र ह्यान्डहोल सबै आवश्यक कम्पोनेन्टहरू हुन्।',
    category: 'telecom'
  },
  {
    id: 36,
    questionNepali: 'Riser Pole भन्नाले कुन पोल लाई बुझिन्छ?',
    options: { A: 'Terminal Pole', B: 'Branch Pole', C: 'भूमिगतबाट एरियलमा जाने पहिलो पोल', D: 'माथिका सबै' },
    correctAnswer: 'C',
    explanationNepali: 'केबल भूमिगत (Underground) बाट बाहिर निस्केर एरियल (Aerial) मा उक्लने पहिलो पोललाई Riser Pole भनिन्छ।',
    category: 'telecom'
  },
  {
    id: 37,
    questionNepali: 'सोलार Battery को सामान्य भोल्टेज कति हुन्छ?',
    options: { A: '१० V', B: '१२ V', C: '२४ V', D: '२० V' },
    correctAnswer: 'B',
    explanationNepali: 'टेलिकम ब्याकअप र घरेलु सोलार प्रणालीमा प्रयोग हुने मानक ब्याट्री भोल्टेज १२ भोल्ट (12V DC) हुन्छ।',
    category: 'electrical'
  },
  {
    id: 38,
    questionNepali: 'Half wave rectifier मा कति वटा Diode प्रयोग गरिन्छ?',
    options: { A: '२ वटा', B: '१ वटा', C: '३ वटा', D: '४ वटा' },
    correctAnswer: 'B',
    explanationNepali: 'हाफ वेभ रेक्टिफायरले एसीको एक भाग मात्र रेक्टिफाई गर्न केवल १ वटा डायोड प्रयोग गर्दछ।',
    category: 'electrical'
  },
  {
    id: 39,
    questionNepali: 'Full wave rectifier मा कति वटा Diode प्रयोग गरिन्छ?',
    options: { A: '२ वा ४ वटा', B: '१ वटा', C: '३ वटा', D: '६ वटा' },
    correctAnswer: 'A',
    explanationNepali: 'फुल वेभ रेक्टिफायर (Center-tapped मा २ वटा वा Bridge Type मा ४ वटा) डायोड प्रयोग गरेर बन्दछ।',
    category: 'electrical'
  },
  {
    id: 40,
    questionNepali: 'चट्याङ र हाई भोल्टेजबाट टेलिकम उपकरण बचाउन कुन डिभाइस प्रयोग गरिन्छ?',
    options: { A: 'Fuse', B: 'Arrester', C: 'MCB', D: 'Relay' },
    correctAnswer: 'B',
    explanationNepali: 'चट्याङ र हाई भोल्टेजबाट उपकरण जोगाउन उच्च भोल्टेजलाई सिधै अर्थमा बाइपास गर्ने Surge Arrester प्रयोग गरिन्छ।',
    category: 'electrical'
  },
  {
    id: 41,
    questionNepali: 'FTTH नेटवर्कमा १:८ स्प्लिटर (Splitter) ले सामान्यतया कति dB सम्म सिग्नल नोक्सानी (Optical Loss) गराउँछ?',
    options: { A: '३ dB भन्दा कम', B: '७ dB भन्दा कम', C: '१०.५ dB सम्म', D: '१५ dB सम्म' },
    correctAnswer: 'C',
    explanationNepali: '१:८ फाइबर स्प्लिटरले प्रकाशको च्यानललाई ८ भागमा बाँड्ने हुँदा सैद्धान्तिक र व्यावहारिक रूपमा करिब १०.३ देखि १०.५ dB सिग्नल लस गराउँदछ।',
    category: 'fiber'
  },
  {
    id: 42,
    questionNepali: 'एकल मोड फाइबर (Single Mode Fiber) को कोर (Core) को मानक व्यास कति हुन्छ?',
    options: { A: '९ माइक्रोन (9 μm)', B: '५० माइक्रोन (50 μm)', C: '६२.५ माइक्रोन (62.5 μm)', D: '१२५ माइक्रोन (125 μm)' },
    correctAnswer: 'A',
    explanationNepali: 'सिङ्गल मोड अप्टिकल फाइबरको प्रकाश बग्ने कोरको व्यास एकदमै मसिनो अर्थात् ९ माइक्रोन हुन्छ भने बाहिरी क्ल्याडिङ व्यास १२५ माइक्रोन हुन्छ।',
    category: 'fiber'
  },
  {
    id: 43,
    questionNepali: 'अप्टिकल फाइबर स्प्लाइसिङ (Fusion Splicing) गर्दा आदर्श जोड क्षय (Splice Loss) कति हुनुपर्छ?',
    options: { A: '०.०५ dB भन्दा कम', B: '०.५ dB भन्दा बढी', C: '१.० dB', D: '२.० dB' },
    correctAnswer: 'A',
    explanationNepali: 'गुणस्तरीय फाइबर फ्युजन जोडाइमा लस अत्यन्त कम अर्थात् ०.०५ dB वा सोभन्दा कम (०.०२ - ०.०३ dB) हुनुपर्दछ।',
    category: 'fiber'
  },
  {
    id: 44,
    questionNepali: 'Earth Resistance (अर्थ रेजिस्टेन्स) नाप्न कुन शास्त्रीय प्रविधि प्रयोग गरिन्छ?',
    options: { A: 'Fall of Potential Method (Three-Point Method)', B: 'Two-Point Multimeter Method', C: 'Capacitance Test', D: 'OPM Laser Method' },
    correctAnswer: 'A',
    explanationNepali: 'अर्थ इलेक्ट्रोडको सही रेजिस्टेन्स पत्ता लगाउन पोटेन्सियल फल (Fall of Potential Method) अर्थात् ३-पोइन्ट अर्थिङ टेष्ट प्रविधि प्रयोग गरिन्छ।',
    category: 'electrical'
  },
  {
    id: 45,
    questionNepali: 'OLT को पूरा रूप के हो?',
    options: { A: 'Optical Line Termination', B: 'Optical Loop Transmission', C: 'Output Line Technology', D: 'Optical Link Tester' },
    correctAnswer: 'A',
    explanationNepali: 'FTTH प्रविधिमा एक्सचेन्ज कार्यालयमा रहने मुख्य केन्द्रिय अप्टिकल नियन्त्रण युनिटलाई Optical Line Termination (OLT) भनिन्छ।',
    category: 'fiber'
  },
  {
    id: 46,
    questionNepali: 'Cat6 LAN केबल भित्र कति वटा इन्सुलेटेड कपर कन्डक्टरहरू (तारहरू) हुन्छन्?',
    options: { A: '४ वटा', B: '६ वटा', C: '८ वटा', D: '१० वटा' },
    correctAnswer: 'C',
    explanationNepali: 'क्याट-६ केबलमा ४ वटा ट्विस्टेड पेयरहरू हुन्छन्, जसले गर्दा यसभित्र जम्मा ८ वटा बेग्लाबेग्लै रंगका तारहरू हुन्छन्।',
    category: 'copper'
  },
  {
    id: 47,
    questionNepali: 'MDF को पूरा रूप के हो?',
    options: { A: 'Main Distribution Frame', B: 'Main Digital Fiber', C: 'Multi Device Filter', D: 'Main Duct Pipe' },
    correctAnswer: 'A',
    explanationNepali: 'MDF को पूरा रूप Main Distribution Frame हो। यो एक्सचेन्ज कोठाभित्र प्राथमिक केबल र स्विच बोर्डहरू जडान गर्ने मुख्य फ्रेम हो।',
    category: 'telecom'
  },
  {
    id: 48,
    questionNepali: 'कपर केबल बिछ्याउँदा सुरक्षाको लागि डक्ट पाइप (Duct Pipe) कुन ठाउँमा राखिन्छ?',
    options: { A: 'पोलको टुप्पामा', B: 'घरको भित्तामा', C: 'जमिनमुनी (Underground)', D: 'ब्याट्री कोठामा' },
    correctAnswer: 'C',
    explanationNepali: 'डक्ट पाइपलाई जमिन खनेर सडक मुनि (Underground) भूमिगत केबल तान्न र सुरक्षा दिन प्रयोग गरिन्छ।',
    category: 'telecom'
  },
  {
    id: 49,
    questionNepali: 'अप्टिकल फाइबर सञ्चार प्रणालीमा प्रकाश तरंग उत्पादन गर्न कुन कम्पोनेन्ट प्रयोग गरिन्छ?',
    options: { A: 'LED वा Semiconductor Laser', B: 'Neon Bulb', C: 'Filament Lamp', D: 'Fluorescent Tube' },
    correctAnswer: 'A',
    explanationNepali: 'फाइबर भित्र प्रकाश पठाउन तीव्र गतिको स्विचिंग क्षमता भएको LED वा सेमीकन्डक्टर लेजर डायोड (Laser Diode) को प्रयोग गरिन्छ।',
    category: 'fiber'
  },
  {
    id: 50,
    questionNepali: 'ONT (Optical Network Terminal) ग्राहकको घरमा कुन प्रविधि मार्फत जडान गरिन्छ?',
    options: { A: 'ADSL प्रविधि', B: 'FTTH प्रविधि', C: 'VSAT उपग्रह', D: 'GSM सेलुलर' },
    correctAnswer: 'B',
    explanationNepali: 'FTTH (Fiber to the Home) नेटवर्कमा ग्राहकको घरमा फाइबर केबल जोड्न र वाइफाइ चलाउन ONT उपकरण राखिन्छ।',
    category: 'fiber'
  },
  {
    id: 51,
    questionNepali: 'अप्टिकल फाइबर स्प्लाइसिङ गर्नु अघि फाइबरको कोण (Cleave Angle) कति हुनुपर्दछ?',
    options: { A: '५ डिग्री भन्दा कम', B: '०.५ देखि १ डिग्री भन्दा कम', C: '१० डिग्री', D: '१५ डिग्री' },
    correctAnswer: 'B',
    explanationNepali: 'सटीक फ्युजन स्प्लाइसिङका लागि प्रिसिजन फाइबर क्लिभरले काटेको कोण १ डिग्री भन्दा कम (आदर्श < ०.५°) हुनुपर्दछ।',
    category: 'fiber'
  },
  {
    id: 52,
    questionNepali: 'टेलिकम एक्सचेन्ज र BTS टावरमा सञ्चालित मानक डिसी भोल्टेज (Standard DC Voltage) कति हो?',
    options: { A: '+१२V DC', B: '+२४V DC', C: '-४८V DC', D: '+२३०V DC' },
    correctAnswer: 'C',
    explanationNepali: 'टेलिकम उपकरणहरूमा धातुको क्षय (Electrolytic Corrosion) रोक्न मानक -४८ भोल्ट DC (Negative 48V DC) प्रयोग गरिन्छ।',
    category: 'electrical'
  },
  {
    id: 53,
    questionNepali: 'लेड-एसिड ब्याट्रीको इलेक्ट्रोलाइटको स्पेसिफिक ग्र्याभिटी (Specific Gravity) नाप्ने उपकरण कुन हो?',
    options: { A: 'मल्टिमिटर', B: 'हाइड्रोमिटर (Hydrometer)', C: 'क्यापासिटेन्स मिटर', D: 'टेकोमिटर' },
    correctAnswer: 'B',
    explanationNepali: 'ब्याट्री भित्रको एसिडको घनत्व नाप्न हाइड्रोमिटर प्रयोग गरिन्छ (पूर्ण चार्जमा १.२४० देखि १.२८० हुन्छ)।',
    category: 'electrical'
  },
  {
    id: 54,
    questionNepali: 'FTTH नेटवर्कमा १:२ स्प्लिटरले लगभग कति dB सिग्नल क्षय (Loss) गराउँछ?',
    options: { A: '३.० देखि ३.५ dB', B: '७.० dB', C: '१०.५ dB', D: '१४.० dB' },
    correctAnswer: 'A',
    explanationNepali: '१:२ स्प्लिटरले प्रकाशको पावरलाई आधा-आधा (५०/५०%) बाँड्ने हुँदा करिब ३.० देखि ३.५ dB लस हुन्छ।',
    category: 'fiber'
  },
  {
    id: 55,
    questionNepali: 'Cat6 LAN केबलको अधिकतम लम्बाइ बिना रिपिटर कति मिटरसम्म चलाउन सकिन्छ?',
    options: { A: '५० मिटर', B: '१०० मिटर', C: '१५० मिटर', D: '२०० मिटर' },
    correctAnswer: 'B',
    explanationNepali: 'IEEE ८०२.३ मानक अनुसार क्याट-६ युटीपी केबल अधिकतम १०० मिटर (३२८ फिट) सम्म चलाउन सकिन्छ।',
    category: 'networking'
  },
  {
    id: 56,
    questionNepali: '२५-पेयर कपर केबलमा १७ औँ पेयर (Pair 17) को कलर कोड के हो?',
    options: { A: 'Yellow / Orange', B: 'Yellow / Blue', C: 'Violet / Orange', D: 'Red / Orange' },
    correctAnswer: 'A',
    explanationNepali: '१६ देखि २० नम्बरको पेयर Yellow ग्रुपमा पर्छ। १७ औँ पेयर Yellow (Major) र Orange (Minor) हुन्छ।',
    category: 'copper'
  },
  {
    id: 57,
    questionNepali: '१२-कोर फाइबर केबलमा चौथो (4th) र पाँचौँ (5th) कोरको रङ के हो?',
    options: { A: 'Blue र Orange', B: 'Green र Brown', C: 'Brown र Slate (खरानी)', D: 'White र Red' },
    correctAnswer: 'C',
    explanationNepali: '१२ कोर फाइबर मानक अनुसार चौथो कोर Brown (खैरो) र पाँचौँ कोर Slate (खरानी) हुन्छ।',
    category: 'fiber'
  },
  {
    id: 58,
    questionNepali: 'सडक वारपार (Road Crossing) गर्दा टेलिकम एरियल केबलको न्यूनतम ग्राउन्ड क्लियरेन्स कति हुनुपर्छ?',
    options: { A: '३.५ मिटर', B: '४.५ मिटर', C: '५.५ मिटर (१८ फिट)', D: '६.५ मिटर' },
    correctAnswer: 'C',
    explanationNepali: 'सडक वारपार गर्ने ठाउँमा ठूला गाडीले नतानून् भनी कम्तीमा ५.५ मिटर (१८ फिट) उचाइ अनिवार्य गरिन्छ।',
    category: 'outside_plant'
  },
  {
    id: 59,
    questionNepali: 'टेलिकम एक्सचेन्ज भवनको लागि आदर्श अर्थ रेजिस्टेन्स (Earth Resistance) कति हुनुपर्दछ?',
    options: { A: '१ ओहम भन्दा कम (< 1 Ω)', B: '५ ओहम', C: '१० ओहम', D: '२० ओहम' },
    correctAnswer: 'A',
    explanationNepali: 'केन्द्रीय एक्सचेन्ज र संवेदनशील OLT उपकरण सुरक्षाका लागि अर्थ रेजिस्टेन्स १ ओहम भन्दा कम हुनुपर्दछ।',
    category: 'electrical'
  },
  {
    id: 60,
    questionNepali: 'घरेलु सिंगल-फेज विद्युत लाइनको मानक भोल्टेज र फ्रिक्वेन्सी कति हो?',
    options: { A: '११०V, ६०Hz', B: '२३०V AC, ५०Hz', C: '४००V AC, ५०Hz', D: '४८V DC, ५०Hz' },
    correctAnswer: 'B',
    explanationNepali: 'नेपालमा घरेलु २३०V AC भोल्टेज र ५० हर्ज (50 Hz) फ्रिक्वेन्सी मानक प्रयोग गरिन्छ।',
    category: 'electrical'
  },
  {
    id: 61,
    questionNepali: 'ट्रान्सफर्मर (Transformer) ले कुन प्रकारको विद्युत धारामा मात्र काम गर्दछ?',
    options: { A: 'DC (Direct Current)', B: 'AC (Alternating Current)', C: 'ब्याट्री करेन्ट', D: 'स्थिर करेन्ट' },
    correctAnswer: 'B',
    explanationNepali: 'ट्रान्सफर्मरले आपसी चुम्बकीय उपपादन (Mutual Induction) सिद्धान्तमा काम गर्ने हुँदा यो केवल AC मा मात्र चल्दछ।',
    category: 'electrical'
  },
  {
    id: 62,
    questionNepali: 'कपर ड्रप वायरमा UY Connector (जेल कनेक्टर) जोड्दा तारको इन्सुलेशन ताछ्नु पर्छ कि पर्दैन?',
    options: { A: '५ से.मी. ताछ्नु पर्छ', B: 'ताछ्नु पर्दैन (Insulation Displacement)', C: 'जलाएर मात्र जोड्नुपर्छ', D: 'सोलिडरिङ गर्नुपर्छ' },
    correctAnswer: 'B',
    explanationNepali: 'UY कनेक्टर IDC (Insulation Displacement Connection) प्रविधि भएकोले तार नताछी सिधै पसाएर क्रिम्प गरिन्छ।',
    category: 'copper'
  },
  {
    id: 63,
    questionNepali: 'VFL (Visual Fault Locator) बाट निस्कने रातो लेजर लाइटको तरंग लम्बाइ (Wavelength) कति हुन्छ?',
    options: { A: '१३१० nm', B: '१५५० nm', C: '६५० nm', D: '८५० nm' },
    correctAnswer: 'C',
    explanationNepali: 'दृश्य रातो प्रकाशको VFL लेजर ६५० न्यानोमिटर (650 nm) को दृश्य प्रकाश उत्सर्जन गर्दछ।',
    category: 'fiber'
  },
  {
    id: 64,
    questionNepali: 'MDF मा लाइन साइड र एक्सचेन्ज साइड बीच क्रस कनेक्सन गर्न कुन तार प्रयोग गरिन्छ?',
    options: { A: 'Drop Wire', B: 'Jumper Wire (कपर जम्पर)', C: 'Patch Cord', D: 'Coaxial Cable' },
    correctAnswer: 'B',
    explanationNepali: 'MDF र वितरण क्याबिनेटमा कनेक्सन मिलाउन २-कोर कपर जम्पर वायर (Jumper Wire) प्रयोग गरिन्छ।',
    category: 'copper'
  },
  {
    id: 65,
    questionNepali: 'कम्प्युटरलाई अर्को कम्प्युटरसँग सिधै जोड्न कुन प्रकारको LAN केबल बनाइन्छ?',
    options: { A: 'Straight-Through Cable', B: 'Crossover Cable (क्रस केबल)', C: 'Rollover Cable', D: 'Coaxial Cable' },
    correctAnswer: 'B',
    explanationNepali: 'दुई उस्तै डिभाइसहरू (PC to PC) सिधै जोड्न एकातिर T568A र अर्कातिर T568B भएको Crossover केबल प्रयोग हुन्छ।',
    category: 'networking'
  },
  {
    id: 66,
    questionNepali: 'म्यानहोल भित्र प्रवेश गर्नुपूर्व कुन कुरा अनिवार्य परीक्षण गर्नुपर्दछ?',
    options: { A: 'पानीको तापक्रम', B: 'विषाक्त ग्याँस (Toxic Gases) र अक्सिजन स्तर', C: 'माटोको प्रकार', D: 'प्रकाशको तीव्रता' },
    correctAnswer: 'B',
    explanationNepali: 'म्यानहोलमा मिथेन, CO जस्ता विषाक्त ग्याँस हुनसक्ने हुँदा ग्याँस डिटेक्टर परीक्षण र भेन्टिलेसन अनिवार्य हुन्छ।',
    category: 'safety'
  },
  {
    id: 67,
    questionNepali: 'MCB (Miniature Circuit Breaker) ले परिपथलाई कुन-कुन अवस्थामा सुरक्षा दिन्छ?',
    options: { A: 'ओभरलोड (Overload) र सर्ट-सर्किट (Short Circuit)', B: 'केवल चट्याङ पर्दा', C: 'भोल्टेज बढ्दा मात्र', D: 'अर्थ लिकेज मात्र' },
    correctAnswer: 'A',
    explanationNepali: 'MCB ले अत्यधिक करेन्ट लोड (Overload) र अचानक सर्ट-सर्किट हुँदा परिपथलाई तुरुन्तै ट्रीप गराएर सुरक्षा गर्दछ।',
    category: 'electrical'
  },
  {
    id: 68,
    questionNepali: 'FTTH नेटवर्कमा OLT ले प्रयोग गर्ने मुख्य डाउनस्ट्रीम (Downstream) तरंग लम्बाइ कुन हो?',
    options: { A: '१३१० nm', B: '१४९० nm', C: '८५० nm', D: '६५० nm' },
    correctAnswer: 'B',
    explanationNepali: 'GPON FTTH मा OLT बाट ONT तर्फ डाटा/इन्टरनेट पठाउन १४९० nm (Downstream) र प्राप्त गर्न १३१० nm प्रयोग हुन्छ।',
    category: 'fiber'
  },
  {
    id: 69,
    questionNepali: 'कपर लाइनमा ०.४ mm व्यासको १ कि.मि. तारको औसत लुप रेजिस्टेन्स कति हुन्छ?',
    options: { A: '५८ ओहम', B: '१२० ओहम', C: '१७० ओहम', D: '२७० ओहम' },
    correctAnswer: 'D',
    explanationNepali: '०.४ mm कपर केबलको प्रति किलोमिटर लुप रेजिस्टेन्स करिब २७० Ω हुन्छ।',
    category: 'copper'
  },
  {
    id: 70,
    questionNepali: 'चट्याङ पर्दा टेलिकम लाइनमा आउने अत्यधिक उच्च भोल्टेजलाई जमिनमा पठाउने डिभाइस कुन हो?',
    options: { A: 'Fuse', B: 'Surge Arrester / SPD', C: 'Capacitor', D: 'Relay' },
    correctAnswer: 'B',
    explanationNepali: 'सर्ज एरेस्टर (Surge Arrester / SPD) ले उच्च भोल्टेजको स्पाइकलाई तुरुन्तै अर्थिङमा बाइपास गर्दछ।',
    category: 'electrical'
  }
];

// ==========================================
// 2. SUBJECTIVE QUESTIONS (खण्ड 'ख') - Complete 5-Set Subjective Bank (53 Questions)
// ==========================================
export const modelSubjectiveQuestions: SubjectiveQuestion[] = allSubjectiveQuestions;
export { allSubjectiveQuestions, subjectiveSetsList };

// ==========================================
// 3. VIVA-VOCE QUESTIONS (मौखिक परीक्षा) - 30 Questions
// ==========================================
export const vivaQuestionsList: VivaQuestion[] = [
  { id: 1, questionNepali: 'Rectifier ले के काम गर्छ?', answerNepali: 'एसी (AC - Alternating Current) विद्युतलाई डिसी (DC - Direct Current) मा बदल्ने काम गर्छ।', englishKey: 'AC to DC Conversion', category: 'Electrical' },
  { id: 2, questionNepali: 'Solar Panel मा कुन Voltage आउँछ र कस्तो प्रकारको करेन्ट दिन्छ?', answerNepali: 'सोलार प्यानलले सूर्यको प्रकाश संकलन गरी सामान्यतया १२ देखि २४ भोल्टको DC (Direct Current) विद्युत उत्पादन गर्दछ।', englishKey: '12V-24V DC Output', category: 'Electrical' },
  { id: 3, questionNepali: 'VSAT को full form के हो?', answerNepali: 'VSAT को पूरा रूप Very Small Aperture Terminal हो। यो स्याटेलाइट (उपग्रह) मार्फत सिधै इन्टरनेट र डाटा चलाउने प्रविधि हो।', englishKey: 'Very Small Aperture Terminal', category: 'Telecom' },
  { id: 4, questionNepali: 'ADSL Splitter को मुख्य काम के हो?', answerNepali: 'यसले टेलिफोन लाइनबाट आउने मिश्रित सिग्नललाई छुट्याएर एउटा पोर्ट टेलिफोन (Voice) र अर्को पोर्ट मोडेम (ADSL Data) मा पठाउँछ।', englishKey: 'Voice & Data Separation', category: 'Telecom' },
  { id: 5, questionNepali: 'Manhole र Handhole को प्रतीक (Symbol) मा के फरक हुन्छ?', answerNepali: 'म्यानहोल (Manhole) आकारमा ठूलो हुन्छ र यसको भुइँमा वृत्त/गोलो वा वर्गाकार सिम्बोल हुन्छ जसमा मानिस भित्र छिर्न सक्छ। ह्यान्डहोल (Handhole) सानो र अर्ध-गोलाकार हुन्छ जहाँ हात मात्र घुसाएर काम गरिन्छ।', englishKey: 'Manhole vs Handhole Symbols', category: 'Outside Plant' },
  { id: 6, questionNepali: 'Aerial Cable मा सामान्यतया कति कति जोडी (Pair) का केबलहरू हुन्छन्?', answerNepali: 'एरियल केबलहरू सामान्यतया ५, १०, २०, ३०, ५०, १०० र १५० पेयर (Pair) का तामाका तारहरू भएका केबलहरू हुन्छन्।', englishKey: '5, 10, 20, 50, 100 Pairs', category: 'Copper' },
  { id: 7, questionNepali: 'Battery को Power/Capacity नाप्ने एकाइ (Unit) कुन हो?', answerNepali: 'ब्याट्रीको क्षमता नाप्ने एकाइ एम्पियर-आवर (Ah - Ampere-hour) हो। ठूला सबस्टेशनमा Ah मा क्षमता मापिन्छ।', englishKey: 'Ampere-hour (Ah)', category: 'Electrical' },
  { id: 8, questionNepali: 'Network Cable (LAN Cable) अधिकतम कति मिटरसम्म सिग्नल लस बिना चलाउन सकिन्छ?', answerNepali: 'बिना पुनरावृत्ति (Without Repeater/Switch), सामान्य क्याट-६ (Cat6) इथरनेट केबल अधिकतम १०० मिटर (100 Meters) सम्म चलाउन सकिन्छ।', englishKey: 'Maximum 100 Meters', category: 'Networking' },
  { id: 9, questionNepali: 'Insulation Resistance नाप्न कुन उपकरण प्रयोग गरिन्छ?', answerNepali: 'केबल वा तारको इन्सुलेशन रेजिस्टेन्स नाप्न "मेगर" (Megger) वा "Insulation Tester" प्रयोग गरिन्छ। यसले सामान्यतया मेगा-ओहम (MΩ) मा मान दिन्छ।', englishKey: 'Megger / Insulation Tester', category: 'Instruments' },
  { id: 10, questionNepali: '३-फेज (3∅) लाइनमा Line-to-Line Voltage कति भोल्ट हुन्छ?', answerNepali: 'नेपालको मानक अनुसार ३-फेज विद्युत लाइनमा लाइन-देखि-लाइन भोल्टेज ४०० भोल्ट (400V AC) हुन्छ।', englishKey: '400V AC Line-to-Line', category: 'Electrical' },
  { id: 11, questionNepali: 'Optical fiber मा हुने प्रकाशको क्षय (Loss) कुन उपकरणले नापिन्छ?', answerNepali: 'फाइबरको कुल लस नाप्न Optical Power Meter (OPM) र फाइबरको विभिन्न ठाउँको फल्ट र जोडाई लस नाप्न OTDR प्रयोग गरिन्छ।', englishKey: 'Optical Power Meter & OTDR', category: 'Fiber Tools' },
  { id: 12, questionNepali: 'Optical fiber ले कुन सिद्धान्त (Principle) मा काम गर्छ?', answerNepali: 'अप्टिकल फाइबरले प्रकाशको "पूर्ण आन्तरिक परावर्तन" (Total Internal Reflection - TIR) को भौतिक सिद्धान्तमा काम गर्दछ।', englishKey: 'Total Internal Reflection', category: 'Fiber' },
  { id: 13, questionNepali: 'Capacitance कुन उपकरणले नापिन्छ र यसको एकाइ के हो?', answerNepali: 'Capacitance लाई C-Meter वा क्यापासिटेन्स मिटरले नापिन्छ। यसको एकाई फाराड (Farad) वा माइक्रोफाराड (µF) / नानोफाराड (nF) हो।', englishKey: 'Capacitance Meter (Farad)', category: 'Instruments' },
  { id: 14, questionNepali: 'E-mail पठाउन र पाउन कुन-कुन प्रोटोकल (Protocol) हरू प्रयोग गरिन्छ?', answerNepali: 'इमेल पठाउन SMTP (Simple Mail Transfer Protocol) र प्राप्त गर्न POP3 वा IMAP प्रोटोकल प्रयोग गरिन्छ।', englishKey: 'SMTP, POP3, IMAP', category: 'Networking' },
  { id: 15, questionNepali: 'रेडियो वा वायरलेस ट्रान्समिसनमा Receiving Level कुन उपकरणले नापिन्छ?', answerNepali: 'यसलाई "Spectrum Analyzer" वा "RF Power Meter" को सहायताले dBm मा नापिन्छ।', englishKey: 'Spectrum Analyzer', category: 'Instruments' },
  { id: 16, questionNepali: 'PCM को पूरा नाम के हो?', answerNepali: 'PCM को पूरा रूप Pulse Code Modulation हो। यो एनालग भ्वाइस सिग्नललाई डिजिटल डाटामा बदल्ने प्रविधि हो।', englishKey: 'Pulse Code Modulation', category: 'Telecom' },
  { id: 17, questionNepali: 'चट्याङबाट बच्न फ्यूज (Fuse) कि एरेस्टर (Arrester) कुन प्रयोग गर्नु राम्रो हुन्छ?', answerNepali: 'चट्याङको उच्च भोल्टेजबाट बच्न Arrester (Surge Arrester) प्रयोग गर्नुपर्छ। यसलाई समानान्तर (Parallel) मा जोडिने हुनाले यसले भोल्टेजलाई सिधै अर्थमा बगाउँछ। फ्यूज सिरिजमा जोडिने भएकाले यसले करेन्ट मात्र रोक्छ।', englishKey: 'Arrester for Surge Voltage', category: 'Electrical' },
  { id: 18, questionNepali: 'पोल र डि.पि. (D.P.) को सिम्बोल (Symbol) मा के फरक छ?', answerNepali: 'नक्सामा पोल (Pole) लाई एउटा सानो गोलो वृत्त (Circle ) ले देखाइन्छ भने DP लाई एउटा सानो वर्गाकार बाकस (Square ) को सिम्बोलले जनाइन्छ।', englishKey: 'Pole (Circle) vs DP (Square)', category: 'Outside Plant' },
  { id: 19, questionNepali: 'Optical fiber connector मा FC र SC मा के फरक छ?', answerNepali: 'FC (Ferrule Connector) धातुको बडी भएको स्क्रू-टाइप (घुमाएर कस्ने) कनेक्टर हो भने SC (Subscriber Connector) प्लास्टिकको बडी भएको पुस-पुल (ठ्याक्क बस्ने) वर्गाकार कनेक्टर हो।', englishKey: 'FC (Screw) vs SC (Push-Pull)', category: 'Fiber' },
  { id: 20, questionNepali: 'तामाको केबल भित्र पानी छिर्‍यो भने के हुन्छ?', answerNepali: 'केबल भित्र पानी छिर्दा कपर तारहरू बीचको इन्सुलेशन घट्छ, जसले गर्दा लाइन सर्ट हुने, न्वाइज आउने र डायल टोन काटिने (Low Insulation / Short Fault) समस्या आउँछ।', englishKey: 'Low Insulation & Noise', category: 'Copper' },
  { id: 21, questionNepali: 'पोल माथि बसेर काम गर्दा के-के सुरक्षाका नियम पालना गर्नुपर्छ?', answerNepali: 'अनिवार्य रूपमा सेफ्टी बेल्ट (Safety Belt) पोलमा बाँध्नुपर्छ, हेल्मेट, पञ्जा र सेफ्टी बुट लगाउनुपर्छ र बिजुलीको पोल भएमा विद्युत बन्द छ कि छैन टेष्टरले जाँच्नुपर्छ।', englishKey: 'Safety Belt & PPE', category: 'Safety' },
  { id: 22, questionNepali: 'म्यानहोल (Manhole) भित्र काम गर्न पस्नु अघि के-के कुरा जाँच गर्नुपर्छ?', answerNepali: 'म्यानहोल भित्र हानिकारक र विषाक्त ग्याँसहरू (जस्तै मिथेन, कार्बन मोनोअक्साइड) जम्मा हुन सक्ने हुनाले ढक्कन खोलेर केही समय हावा प्रवाह गराउनुपर्छ र ग्याँस डिटेक्टरले परीक्षण गर्नुपर्छ।', englishKey: 'Gas Detection & Ventilation', category: 'Safety' },
  { id: 23, questionNepali: 'Search Engine भनेको के हो? ३ वटा सर्च इन्जिनको नाम भन्नुहोस्।', answerNepali: 'इन्टरनेटमा आवश्यक जानकारी वा वेबसाइटहरू खोज्न मद्दत गर्ने सफ्टवेयर प्लेटफर्म हो। उदाहरण: Google, Bing, Yahoo।', englishKey: 'Google, Bing, Yahoo', category: 'Networking' },
  { id: 24, questionNepali: 'सेयर गरिएको फाइल वा फोल्डरमा कसैलाई मात्र फुल कभर र अरूलाई "Read Only" अनुमति कसरी लगाइन्छ?', answerNepali: 'फोल्डरको Properties मा गई Sharing -> Advanced Sharing -> Permissions मा जाने र सम्बन्धित युजरलाई "Full Control" टिक लगाउने तथा अन्य "Everyone" ग्रुपलाई "Read Only" मात्र टिक लगाउने।', englishKey: 'Folder Share Permissions', category: 'Networking' },
  { id: 25, questionNepali: 'नेपाल टेलिकम १२-कोर फाइबरमा पहिलो र दोस्रो कोरको रङ के-के हुन्छ?', answerNepali: 'नेपाल टेलिकम मानक अनुसार पहिलो कोर नीलो (Blue) र दोस्रो कोर सेतो (White) रङको हुन्छ।', englishKey: '1st Blue, 2nd White', category: 'Fiber' },
  { id: 26, questionNepali: 'FTTH मा प्रयोग हुने स्प्लिटर (Splitter) कति प्रकारका हुन्छन्?', answerNepali: 'मुख्यतया दुई प्रकारका हुन्छन्: FBT (Fused Biconical Taper) स्प्लिटर र PLC (Planar Lightwave Circuit) स्प्लिटर। उच्च क्षमताका लागि PLC स्प्लिटर बढी प्रयोग हुन्छ।', englishKey: 'PLC and FBT Splitters', category: 'Fiber' },
  { id: 27, questionNepali: 'Telecom System मा -48V DC नै किन प्रयोग गरिन्छ?', answerNepali: 'पोजिटिभ ग्राउन्डिङका साथ -४८V DC प्रयोग गर्दा कपर तार र धातुका यन्त्रहरूमा इलेक्ट्रोलाइटिक खिया (Corrosion) लाग्दैन र यो मानव शरीरका लागि सुरक्षित भोल्टेज सीमाभित्र पर्छ।', englishKey: 'Corrosion Prevention (-48V)', category: 'Electrical' },
  { id: 28, questionNepali: 'Fusion Splicing Machine ले दुई फाइबरलाई कसरी जोड्छ?', answerNepali: 'यसले दुईवटा टंगस्टन इलेक्ट्रोड बीच विद्युतीय स्पार्क (Electric Arc / High Temperature) उत्पन्न गराई ग्लास कोरलाई पग्ल्याएर (Melt) एक आपसमा जोड्दछ।', englishKey: 'Electric Arc Fusion', category: 'Fiber Tools' },
  { id: 29, questionNepali: 'Substation र OLT को लागि Earthing Resistance कति भन्दा कम हुनुपर्छ?', answerNepali: 'केन्द्रीय एक्सचेन्ज र OLT का लागि अर्थिङ रेजिस्टेन्स १ ओहम (1 Ω) भन्दा कम र स्थानीय क्याबिनेट/डीपीका लागि ५ ओहम भन्दा कम हुनुपर्दछ।', englishKey: 'Under 1 Ohm (Exchange)', category: 'Electrical' },
  { id: 30, questionNepali: 'OTDR मा Dead Zone भनेको के हो?', answerNepali: 'फाइबरको कनेक्टर वा ठूलो रिफ्लेक्सन पछि निश्चित दूरीसम्म OTDR ले फल्ट पत्ता लगाउन नसक्ने अन्धो क्षेत्रलाई डेड जोन (Dead Zone) भनिन्छ (Event Dead Zone र Attenuation Dead Zone)।', englishKey: 'Event & Attenuation Dead Zone', category: 'Fiber Tools' },
  { id: 31, questionNepali: 'LAN Cable मा T568A र T568B बीच मुख्य भिन्नता के हो?', answerNepali: 'T568A मा पहिलो पेयर हरियो (Green/White-Green) बाट सुरु हुन्छ भने T568B मा पहिलो पेयर सुन्तला (Orange/White-Orange) बाट सुरु हुन्छ।', englishKey: 'Pin 1-2 Green vs Orange', category: 'Networking' },
  { id: 32, questionNepali: 'Drop Wire मा Spann Clamp र Dead End Clamp कहाँ प्रयोग गरिन्छ?', answerNepali: 'स्प्यान क्ल्याम्प पोल बीचमा तार अड्याउन प्रयोग हुन्छ भने डेड-इन्ड क्ल्याम्प (Dead-End Clamp) अन्तिम पोल वा घरको भित्तामा तारको तनाव रोक्न कस्न प्रयोग हुन्छ।', englishKey: 'Dead-End & Span Clamps', category: 'Outside Plant' },
  { id: 33, questionNepali: 'UPS र Inverter बीचको मुख्य भिन्नता के हो?', answerNepali: 'UPS ले बिजुली जाँदा बिना कुनै समय अन्तर (० देखि ५ मिलिसेकेन्ड) मा ब्याकअप दिन्छ, जबकी सामान्य इन्भर्टरले स्विच हुन १० देखि ५०० मिलिसेकेन्ड समय लिन्छ।', englishKey: 'Zero Transfer Time (UPS)', category: 'Electrical' },
  { id: 34, questionNepali: 'Transformer को Core मा किन पातलो लेमिनेटेड पाता (Laminated Sheets) प्रयोग गरिन्छ?', answerNepali: 'ट्रान्सफर्मरको कोरमा घुमिरहने अनावश्यक करेन्ट (Eddy Current Loss) कम गर्नका लागि पातला लेमिनेटेड सिलिकन स्टीलका पाताहरू प्रयोग गरिन्छ।', englishKey: 'Reduce Eddy Current Loss', category: 'Electrical' },
  { id: 35, questionNepali: 'Drop Cable को Outer Sheath मा FRP Member को के काम हुन्छ?', answerNepali: 'FRP (Fiber Reinforced Plastic) ले फाइबर कोरलाई तन्किन, थिचिन र भाँचिनबाट बचाउन मेकानिकल बल (Tensile Strength) प्रदान गर्दछ।', englishKey: 'Tensile Strength (FRP)', category: 'Fiber' }
];

// ==========================================
// 4. INTERACTIVE MATCHING GROUPS - 6 Groups (Q31-50 in Exam Sheet)
// ==========================================
export const matchingGroupsList: MatchingGroup[] = [
  {
    id: 'group-a',
    titleNepali: 'समूह क - केबल र कटिङ टुलहरू (Cable Cutters & Tools)',
    items: [
      { id: '31', premise: '३१. एररर्ल केबल कटर (Aerial Cable Cutter)' },
      { id: '32', premise: '३२. वेभ कटर (Wave Cutter / Wire Stripper)' },
      { id: '33', premise: '३३. सिमेरा (Shimera / Come-Along Clamp)' },
      { id: '34', premise: '३४. UG केबल कटर (Underground Cable Cutter)' },
      { id: '35', premise: '३५. सिथ कटर (Sheath Cutter)' }
    ],
    responses: [
      { id: '35-ans', letter: 'क', text: 'केबलको बाहिरी भाग (सिथ) ताछ्ने / चिन्ने' },
      { id: '33-ans', letter: 'ख', text: 'केबल तानेर टाइट गर्न' },
      { id: '34-ans', letter: 'ग', text: 'प्राइमरी अन्डरग्राउण्ड केबल काट्न' },
      { id: '32-ans', letter: 'घ', text: 'केबल भित्रको कपर कन्डक्टर ताछ्न' },
      { id: '31-ans', letter: 'ङ', text: 'एरियल केबल र सस्पेन्सन वायर काट्न' }
    ],
    correctMatches: {
      '31': '31-ans',
      '32': '32-ans',
      '33': '33-ans',
      '34': '34-ans',
      '35': '35-ans'
    }
  },
  {
    id: 'group-b',
    titleNepali: 'समूह ख - आउटसाइड प्लान्ट प्रतीकहरू (Outside Plant Symbols)',
    items: [
      { id: '36', premise: '३६. O (नक्सामा गोलो वृत्त)' },
      { id: '37', premise: '३७. O (वर्ग भित्र गोलो)' },
      { id: '38', premise: '३८. OW (Wall Sign)' },
      { id: '39', premise: '३९. OP (DP Sign)' },
      { id: '40', premise: '४०.  (खाली कोठा / वर्ग)' }
    ],
    responses: [
      { id: '40-ans', letter: 'क', text: 'ह्यान्ड होल (Hand Hole)' },
      { id: '39-ans', letter: 'ख', text: 'प्रोटेक्टिभ डी.पी. (Protective DP)' },
      { id: '36-ans', letter: 'ग', text: 'स्टे पोल / स्टे वायर (Stay / Support Pole)' },
      { id: '37-ans', letter: 'घ', text: 'पुस ब्रेस (Push Brace Pole)' },
      { id: '38-ans', letter: 'ङ', text: 'वाल डि.पि. (Wall DP)' }
    ],
    correctMatches: {
      '36': '36-ans',
      '37': '37-ans',
      '38': '38-ans',
      '39': '39-ans',
      '40': '40-ans'
    }
  },
  {
    id: 'group-c',
    titleNepali: 'समूह ग - समस्या र प्राविधिक असरहरू (Troubleshooting & Effects)',
    items: [
      { id: '41', premise: '४१. ड्रप वायरमा धेरै जोइन्ट भयो भने' },
      { id: '42', premise: '४२. अप्टिकल फाइबर कनेक्टर फोहोर भयो भने' },
      { id: '43', premise: '४३. केबल जोइन्ट भित्र पानी पस्यो भने' },
      { id: '44', premise: '४४. अर्थिङमा रेजिस्टेन्स अत्यधिक बढी भयो भने' },
      { id: '45', premise: '४५. क्याबिनेटमा डायल टोन नै आएन भने' }
    ],
    responses: [
      { id: '42-ans', letter: 'क', text: 'सिग्नल लस (Optical Loss) अत्यधिक बढ्छ' },
      { id: '44-ans', letter: 'ख', text: 'चट्याङ र हाई भोल्टेजले उपकरण पूरै डेमेज गर्छ' },
      { id: '43-ans', letter: 'ग', text: 'प्राइमरी केबल फल्ट (इन्सुलेशन ड्रप) हुन्छ' },
      { id: '45-ans', letter: 'घ', text: 'ओपन फल्ट (एक्सचेन्ज वा केबल बिग्रिएको)' },
      { id: '41-ans', letter: 'ङ', text: 'लुप रेजिस्टेन्स बढेर नोइज तथा आउने-जाने समस्या हुन्छ' }
    ],
    correctMatches: {
      '41': '41-ans',
      '42': '42-ans',
      '43': '43-ans',
      '44': '44-ans',
      '45': '45-ans'
    }
  },
  {
    id: 'group-d',
    titleNepali: 'समूह घ - कम्पोनेन्ट र परिभाषा (Components & Definitions)',
    items: [
      { id: '46', premise: '४६. जम्पर वायर (Jumper Wire)' },
      { id: '47', premise: '४७. पिग टेल (Pigtail Fiber)' },
      { id: '48', premise: '४८. स्लाइस (Splice)' },
      { id: '49', premise: '४९. स्याग (Sag)' },
      { id: '50', premise: '५०. स्पेन (Span)' }
    ],
    responses: [
      { id: '46-ans', letter: 'क', text: 'एम.डि.एफ. र क्याबिनेट भित्र कनेक्सन जोड्ने तार' },
      { id: '47-ans', letter: 'ख', text: 'एक छेउमा मात्र कनेक्टर भएको अप्टिकल फाइबर' },
      { id: '49-ans', letter: 'ग', text: 'दुई पोलको बीचमा केबल झुण्डिँदा बन्ने लचकता/भलाई' },
      { id: '50-ans', letter: 'घ', text: 'दुईवटा पोलहरू बीचको तेर्सो दूरी' },
      { id: '48-ans', letter: 'ङ', text: 'दुईवटा फाइबर वा कपर तारको स्थायी जोडाइ' }
    ],
    correctMatches: {
      '46': '46-ans',
      '47': '47-ans',
      '48': '48-ans',
      '49': '49-ans',
      '50': '50-ans'
    }
  },
  {
    id: 'group-e',
    titleNepali: 'समूह ङ - टेलिकम संक्षिप्त रूप र कार्य (Acronyms & Functions)',
    items: [
      { id: '51', premise: '५१. OLT (Optical Line Terminal)' },
      { id: '52', premise: '५२. ONT (Optical Network Terminal)' },
      { id: '53', premise: '५३. FDC (Fiber Distribution Cabinet)' },
      { id: '54', premise: '५४. FAT (Fiber Access Terminal)' },
      { id: '55', premise: '५५. VFL (Visual Fault Locator)' }
    ],
    responses: [
      { id: '51-ans', letter: 'क', text: 'केन्द्रीय एक्सचेन्जमा रहने मुख्य अप्टिकल ट्रान्समिटर' },
      { id: '52-ans', letter: 'ख', text: 'ग्राहकको घरमा रहने इन्टरनेट र वाइफाइ मोडेम' },
      { id: '53-ans', letter: 'ग', text: 'सडक किनारमा रहने प्राथमिक फाइबर विभाजन क्याबिनेट' },
      { id: '54-ans', letter: 'घ', text: 'पोलमा झुण्डिने वितरण बाकस जहाँबाट ड्रप केबल तानिन्छ' },
      { id: '55-ans', letter: 'ङ', text: 'रातो लेजर बालेर कोर भाँचिएको पत्ता लगाउने टुल' }
    ],
    correctMatches: {
      '51': '51-ans',
      '52': '52-ans',
      '53': '53-ans',
      '54': '54-ans',
      '55': '55-ans'
    }
  },
  {
    id: 'group-f',
    titleNepali: 'समूह च - मानक प्राविधिक मानहरू (Standard Technical Values)',
    items: [
      { id: '56', premise: '५६. १:८ स्प्लिटरको औसत सिग्नल लस' },
      { id: '57', premise: '५७. सडक वारपार केबलको न्यूनतम उचाइ' },
      { id: '58', premise: '५८. सिंगल मोड फाइबर कोरको व्यास' },
      { id: '59', premise: '५९. एक्सचेन्जको मानक अर्थ रेजिस्टेन्स' },
      { id: '60', premise: '६०. Cat6 केबलको अधिकतम सुरक्षित लम्बाइ' }
    ],
    responses: [
      { id: '56-ans', letter: 'क', text: 'करिब १०.२ देखि १०.५ dB' },
      { id: '57-ans', letter: 'ख', text: '५.५ मिटर (१८ फिट)' },
      { id: '58-ans', letter: 'ग', text: '९ माइक्रोमिटर (९ µm)' },
      { id: '59-ans', letter: 'घ', text: '१ ओहम भन्दा कम (< 1 Ω)' },
      { id: '60-ans', letter: 'ङ', text: '१०० मिटर (१०० m)' }
    ],
    correctMatches: {
      '56': '56-ans',
      '57': '57-ans',
      '58': '58-ans',
      '59': '59-ans',
      '60': '60-ans'
    }
  }
];

// ==========================================
// 5. SPOTTING ITEMS - 15 Practical Tools & Components
// ==========================================
export const spottingItemsList: SpottingItem[] = [
  {
    id: 1,
    nameEnglish: 'Krone Tool',
    nameNepali: 'क्रोनिङ टुल (Krone Punch Down Tool)',
    category: 'Copper / MDF',
    purposeNepali: 'MDF र क्याबिनेट (Cabinet) को ट्याग ब्लकमा कपर तारहरू पञ्च गरेर जम्पर गर्न प्रयोग गरिन्छ।',
    purposeEnglish: 'Used to punch down and terminate copper jumper wires into Krone terminal blocks in MDF and Cabinets.',
    tipNepali: 'यो टुलले कपर तारलाई ट्याग भित्र पञ्च गर्नाका साथै बढी भएको बाहिरी तारलाई स्वचालित रूपमा काटिदिन्छ।',
    imageUrl: ''
  },
  {
    id: 2,
    nameEnglish: 'Optical Power Meter',
    nameNepali: 'अप्टिकल पावर मिटर (OPM)',
    category: 'Fiber Optic',
    purposeNepali: 'अप्टिकल फाइबर भित्र बगिरहेको प्रकाशको पावर (dBm) र कुल सिग्नल क्षय (Loss) नाप्न प्रयोग गरिन्छ।',
    purposeEnglish: 'Used to measure the optical power (dBm) and overall attenuation/loss of light propagating through fiber.',
    tipNepali: '८५०nm, १३१०nm र १५५०nm जस्ता तरंग लम्बाइ (Wavelength) सेट गरेर शुद्ध मान लिन सकिन्छ।',
    imageUrl: ''
  },
  {
    id: 3,
    nameEnglish: 'Visual Fault Locator',
    nameNepali: 'भिजुअल फल्ट लोकेटर (VFL / Red Laser)',
    category: 'Fiber Optic',
    purposeNepali: 'अप्टिकल फाइबरमा कोर भाँचिएको, अत्यधिक झुकेको (Bend) वा काटिएको ठाउँ रातो लेजर बत्ती बालेर पत्ता लगाउन।',
    purposeEnglish: 'Used to locate fiber breaks, tight bends, or continuity failures visually using a visible red laser light.',
    tipNepali: 'यसले ६५०nm को चम्किलो देखिने रातो लेजर लाइट फाल्छ, नाङ्गो आँखाले सीधै लेजर लाइट हेर्नु हुँदैन।'
  },
  {
    id: 4,
    nameEnglish: 'Multimeter',
    nameNepali: 'डिजिटल मल्टिमिटर (Digital Multimeter)',
    category: 'Testing / Instruments',
    purposeNepali: 'विद्युतीय भोल्टेज, एसी/डीसी करेन्ट, रेजिस्टेन्स नाप्न र कपर तारको कन्टिन्युटी (Continuity) जाँच गर्न।',
    purposeEnglish: 'A versatile instrument used to measure voltage, current, resistance, and test electrical/copper continuity.',
    tipNepali: 'कपर लाइन सर्ट वा ओपन छ कि छैन भनी जाँच्न बज्ने साउन्ड (Buzzer/Beep) मोड सबैभन्दा बढी प्रयोग हुन्छ।'
  },
  {
    id: 5,
    nameEnglish: 'Megger / Magar',
    nameNepali: 'मेगर (Megger / Insulation Tester)',
    category: 'Testing / Earthing',
    purposeNepali: 'कपर केबलको कन्डक्टरहरू बीचको इन्सुलेशन रेजिस्टेन्स नाप्न र कपर फल्ट तथा अर्थिङ्ग सुरक्षा जाँच गर्न।',
    purposeEnglish: 'Used to measure extremely high insulation resistance (in Mega-ohms) of cables and electrical earthing system.',
    tipNepali: 'नयाँ कपर केबल बिछ्याएपछि वा पुरानो केबलमा सर्ट फल्ट हुँदा कन्डक्टर र अर्थ बीचको इन्सुलेशन स्तर जाँच्न प्रयोग हुन्छ।'
  },
  {
    id: 6,
    nameEnglish: 'ADSL Router',
    nameNepali: 'एडीएसएल राउटर (ADSL/VDSL Router)',
    category: 'CPE / Networking',
    purposeNepali: 'कपर टेलिफोन लाइन मार्फत ग्राहकको घरमा उच्च गतिको इन्टरनेट सञ्चालन गर्न प्रयोग गरिने वायरलेस राउटर।',
    purposeEnglish: 'A customer premises device used to establish high-speed internet connection over copper telephone lines.',
    tipNepali: 'यसमा इनपुट RJ-11 DSL पोर्ट हुन्छ भने लोकल आउटपुटका लागि ४ वटा RJ-45 LAN पोर्टहरू र वाईफाई एन्टिना हुन्छन्।'
  },
  {
    id: 7,
    nameEnglish: 'Suspension Clamp',
    nameNepali: 'सस्पेन्सन क्ल्याम्प (Suspension Clamp)',
    category: 'Pole Civil / Line Support',
    purposeNepali: 'सिधा रुट (Straight Route) भएका पोलहरूमा एरियल केबललाई झुण्ड्याएर थेग्न प्रयोग गरिने विशेष क्ल्याम्प।',
    purposeEnglish: 'Used to support and suspend aerial telecom/fiber cables on straight route poles without causing physical strain.',
    tipNepali: 'यसलाई पोलको टुप्पाबाट ५० से.मी. मुनि पिन टाइप ब्राकेट वा पोल ब्यान्डमा फिट गरेर केबल अड्काइन्छ।'
  },
  {
    id: 8,
    nameEnglish: 'Eri-Band Tool',
    nameNepali: 'एरी-ब्यान्ड टुल (Eri-Band / Stainless Steel Strapping Tool)',
    category: 'Pole Civil / Support',
    purposeNepali: 'पोलमा फलामे ब्राकेट, पोल ब्यान्ड वा हुकहरू स्टेनलेस स्टील फिता (SS Strap) को सहायताले कस्न र बाँध्न प्रयोग गरिने टुल।',
    purposeEnglish: 'Used to tension, tighten, and cut stainless steel strapping bands when fixing brackets and bands on poles.',
    tipNepali: 'यो टुलले पोलमा एसएस ब्यान्ड कसिलो गरी खिच्ने र बढी भएको स्ट्र्यापलाई च्वाट्ट काट्ने काम गर्छ।'
  },
  {
    id: 9,
    nameEnglish: 'Crimping Tool',
    nameNepali: 'क्रिमपिङ टुल (Crimping Tool / Network Plier)',
    category: 'Networking / Copper',
    purposeNepali: 'RJ-9, RJ-11 र RJ-45 कनेक्टर्सहरूलाई क्रमशः टेलिफोन ह्यान्डसेट, फोन लाइन र कम्प्युटर LAN केवलमा क्रिम्प गरी टाँस्न।',
    purposeEnglish: 'Used to crimp and terminate RJ-9, RJ-11, and RJ-45 connectors onto telephone and Ethernet copper cables.',
    tipNepali: 'यस प्लायरमा तार ताँस्ने ब्लेड, तार बराबर काट्ने कटर र कनेक्टर्सलाई थिचेर लक गर्ने मेटल डाईहरू हुन्छन्।'
  },
  {
    id: 10,
    nameEnglish: 'OTDR',
    nameNepali: 'ओटीडीआर (Optical Time Domain Reflectometer)',
    category: 'Testing / Fiber Optic',
    purposeNepali: 'अप्टिकल फाइबरको कुल लम्बाई, विभिन्न ठाउँको स्प्लाइस लस (Splice Loss), कनेक्टर लस र केबल काटिएको वा भाँचिएको ठाउँको दूरी पत्ता लगाउन।',
    purposeEnglish: 'An advanced instrument that analyzes fiber optic cables by backscattering, measuring fiber length, splice loss, and break distance.',
    tipNepali: 'यसले फाइबरको वेभफर्म ग्राफ देखाउँछ जसमा विभिन्न इभेन्ट (Events) को दूरी र क्षय प्रतिशत सजिलै हेर्न सकिन्छ।'
  },
  {
    id: 11,
    nameEnglish: 'Precision Fiber Cleaver',
    nameNepali: 'प्रिसिजन फाइबर क्लिभर (Precision Fiber Cleaver)',
    category: 'Fiber Optic',
    purposeNepali: 'फ्युजन स्प्लाइसिङ गर्नु पूर्व फाइबरको कोरलाई ९० डिग्री (०.५° भन्दा कम विचलन) मा सिधा र चिल्लो गरी काट्न।',
    purposeEnglish: 'Used to achieve a clean, perpendicular end-face cleave (<0.5 degree angle) on optical fibers before fusion splicing.',
    tipNepali: 'क्लिभरको टंगस्टन कार्बाइड ब्लेडलाई सफा राख्नुपर्छ र कहिल्यै पनि तार ताछ्ने कटर जस्तै जोडले थिच्नु हुँदैन।'
  },
  {
    id: 12,
    nameEnglish: 'Fusion Splicer',
    nameNepali: 'फ्युजन स्प्लाइसिङ मेसिन (Fusion Splicer)',
    category: 'Fiber Optic',
    purposeNepali: 'दुईवटा अप्टिकल फाइबरका कोरहरूलाई विद्युतीय आर्क (Electric Arc) मार्फत उच्च तापक्रममा पग्ल्याएर स्थायी रूपमा जोड्न।',
    purposeEnglish: 'Automated high-precision instrument that aligns and welds two optical fibers end-to-end using an electric arc.',
    tipNepali: 'यसले स्प्लाइसिङ गरिसकेपछि अनुमानित लस (dB) तुरुन्तै डिस्प्लेमा देखाउँछ र स्लिभलाई हिटिङ ओभनमा तताएर बलियो बनाउँछ।'
  },
  {
    id: 13,
    nameEnglish: 'Hydrometer',
    nameNepali: 'हाइड्रोमिटर (Battery Hydrometer)',
    category: 'Electrical / Power',
    purposeNepali: 'टेलिकम ब्याट्री बैंकका लेड-एसिड सेलहरूको इलेक्ट्रोलाइट (सल्फ्युरिक एसिड) को स्पेसिफिक ग्र्याभिटी (घनत्व) नाप्न।',
    purposeEnglish: 'Used to measure the specific gravity of electrolyte in lead-acid batteries to determine charge status.',
    tipNepali: 'पूर्ण चार्ज भएको ब्याट्रीको स्पेसिफिक ग्र्याभिटी १.२४० देखि १.२८० बीच हुन्छ।'
  },
  {
    id: 14,
    nameEnglish: 'Earth Tester (Earth Resistance Meter)',
    nameNepali: 'अर्थ टेष्टर (Earth Resistance Meter)',
    category: 'Testing / Earthing',
    purposeNepali: 'टेलिकम एक्सचेन्ज, BTS पोल र क्याबिनेटको ग्राउन्डिङ/अर्थिङ इलेक्ट्रोडको रेजिस्टेन्स (Ω) नाप्न।',
    purposeEnglish: 'Specialized 3-terminal / 4-terminal meter used to measure soil resistivity and grounding electrode resistance.',
    tipNepali: 'यसले ५ मिटर र १० मिटरको दूरीमा दुईवटा स्पाइक जमिनमा गाडेर विभव गिरावट (Fall-of-Potential) विधिबाट शुद्ध ओहम मान दिन्छ।'
  },
  {
    id: 15,
    nameEnglish: 'UY Gel Connector',
    nameNepali: 'यु.वाई. जेल कनेक्टर (UY Scotchlok Connector)',
    category: 'Copper / Splicing',
    purposeNepali: 'कपर ड्रप वायर र टेलिफोनका दुई तारहरूलाई बिना इन्सुलेशन ताछी वाटरप्रूफ रूपमा जोड्न।',
    purposeEnglish: 'Moisture-resistant gel-filled IDC connector used for quick, reliable 2-wire copper conductor splicing.',
    tipNepali: 'यसको भित्र सिलिकन जेल भरिएको हुन्छ जसले पानी र ओसबाट कपर तारमा खिया लाग्न दिँदैन।'
  }
];
