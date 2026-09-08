export interface BlogPost {
  id: string;
  titleNepali: string;
  titleEnglish?: string;
  summaryNepali: string;
  summaryEnglish?: string;
  contentNepali: string;
  contentEnglish?: string;
  category: 'optical_fiber' | 'telecom' | 'exams' | 'ctevt_news' | 'tips';
  categoryLabel: string;
  categoryLabelEnglish?: string;
  author: string;
  authorRole: string;
  authorRoleEnglish?: string;
  authorAvatar?: string;
  date: string;
  dateEnglish?: string;
  readTime: string;
  readTimeEnglish?: string;
  imageUrl: string;
  tags: string[];
  views: number;
  likes: number;
  isFeatured?: boolean;
}

export const initialBlogPosts: BlogPost[] = [
  {
    id: 'blog-1-ftth-splicing-loss-troubleshooting',
    titleNepali: 'FTTH र अप्टिकल फाइबर स्प्लाइसिङ गर्दा Splice Loss घटाउने ५ मुख्य प्राविधिक तरिकाहरू',
    titleEnglish: '5 Crucial Technical Tips to Minimize Splice Loss in FTTH Optical Fiber Splicing',
    category: 'optical_fiber',
    categoryLabel: 'अप्टिकल फाइबर (Optical Fiber)',
    categoryLabelEnglish: 'Optical Fiber (FTTH)',
    author: 'सुरेन्द्र ऐर (Surendra Air)',
    authorRole: 'मुख्य प्रशिक्षक तथा टेलिकम विज्ञ',
    authorRoleEnglish: 'Lead Instructor & Telecom Specialist',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    date: '२०८३ भाद्र १५',
    dateEnglish: 'Aug 31, 2026',
    readTime: '५ मिनेट',
    readTimeEnglish: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1000&q=80',
    summaryNepali: 'FTTH तथा ब्याकबोन फाइबर नेटवर्कमा ०.०२ dB भन्दा कम स्प्लाइस लस कसरी कायम राख्ने? फाइबर क्लिभिङ, ARC क्यालिब्रेसन र फाइबर सरसफाइका व्यवहारिक नियमहरू।',
    summaryEnglish: 'How to achieve less than 0.02 dB splice loss in FTTH & backbone optical fiber networks? Practical rules for fiber cleaving, ARC calibration, and alcohol cleaning.',
    contentNepali: `अप्टिकल फाइबर जोड्दा (Fusion Splicing) धेरै प्राविधिकहरूले सामना गर्ने मुख्य समस्या भनेको बढी लस (High Splice Loss) हुनु हो। CTEVT लेभल-१ र लेभल-२ परीक्षा तथा ISP को फिल्ड कार्यमा ०.०५ dB भन्दा कम लस ल्याउनु अनिवार्य मानिन्छ।

### १. फाइबरलाई उच्च शुद्धताका साथ सफा गर्नुहोस् (Alcohol Cleansing)
फाइबर स्ट्रिप गरिसकेपछि ९९% शुद्ध Isopropyl Alcohol (IPA) र Lint-free Tissue प्रयोग गरी ३ देखि ४ पटक राम्रोसँग सफा गर्नुहोस्। साधारण कटन वा पानी प्रयोग गर्दा फाइबरको बाहिरी सतहमा धुलो र तेलका कणहरू रहन्छन् जसले ARC दिँदा बबल वा लस बढाउँछ।

### २. क्लिभर ब्लेडको सही प्रयोग (Precision Cleaving)
स्प्लाइसिङको ८०% सफलता फाइबरको क्लिभिङ (Cleave Angle) मा निर्भर हुन्छ।
- क्लिभ एंगल १.० डिग्री (1.0°) भन्दा कम हुनुपर्छ।
- क्लिभर ब्लेड फोहोर भएमा IPA ले ब्लेड सफा गर्नुहोस्।
- ब्लेडको कटिङ पोजिसन धेरै पटक प्रयोग भइसकेको भए ब्लेडलाई अर्को नम्बरमा घुमाउनुहोस्।

### ३. फ्युजन स्प्लाइसरको Arc Calibration
मौसम परिवर्तन (चिसो, तातो, वा उच्च हिमाली क्षेत्र) हुँदा हावाको चाप र तापक्रम परिवर्तन हुन्छ। त्यसैले काम सुरु गर्नुअघि स्प्लाइसरमा अनिवार्य रूपमा **Automatic Arc Calibration** वा Motor Calibration चलाउनुहोस्।

### ४. V-Groove र Kamera को नियमित सरसफाइ
समीक्षा गर्दा फाइबर misalignment हुनुको मुख्य कारण V-Groove मा धुलो जम्नु हो। Clean Cotton Swab र Isopropyl Alcohol प्रयोग गरी V-Groove र Objective Lens सफा राख्नुहोस्।

### ५. सही Protection Sleeve हिटिङ (Heat Shrinking)
स्प्लाइस भइसकेपछि ६०mm वा ४०mm प्रोटेक्सन स्लिभलाई हिटिङ च्याम्बरमा हाल्दा स्प्लाइस पोइन्ट नमोडिने गरी सिधा राखेर तताउनुहोस्। हिट भइसकेपछि तुरुन्तै Cooling Tray मा राखेर सेलाउन दिनुहोस्।

---
**निष्कर्ष:** 
यी ५ नियमहरू पालना गरेमा तपाईँको स्प्लाइस लस सधैं ०.०१ dB देखि ०.०३ dB को दायरामा रहनेछ, जसले CTEVT प्रयोगात्मक परीक्षामा १००% अंक ल्याउन सहयोग पुर्‍याउँछ।`,
    contentEnglish: `When fusion splicing optical fibers, the most common issue encountered by technicians is high splice loss. In CTEVT Level-1, Level-2 practical exams and telecom/ISP field work, maintaining a splice loss below 0.05 dB is mandatory.

### 1. High-Purity Alcohol Cleansing
After stripping the buffer and coating, clean the bare glass fiber 3 to 4 times using 99% pure Isopropyl Alcohol (IPA) and lint-free wipes. Regular cotton or water leaves dust and oil residues that produce micro-bubbles or high attenuation during arc discharge.

### 2. Precision Cleaving & Angle Control
Over 80% of splicing success depends on precision cleaving.
- The cleave angle must strictly be under 1.0 degree.
- Regularly wipe the cleaver blade and rubber pads with IPA.
- Rotate the circular cleaver blade to the next numbered position once its duty cycle is reached.

### 3. Automatic Arc Calibration
Weather and atmospheric pressure changes (cold mountain air vs. humid plains) alter electric arc discharge temperature. Always execute **Automatic Arc Calibration** or Motor Calibration on your fusion splicer before commencing daily splicing.

### 4. Regular Maintenance of V-Grooves & Lenses
Fiber core misalignment is frequently caused by micro-dust settled inside the V-grooves. Use dry cotton swabs or IPA-moistened swabs to keep V-grooves and optical mirrors pristine.

### 5. Heat Shrink Protection Sleeve Alignment
When inserting the 60mm or 40mm heat-shrink sleeve into the heater oven, ensure the spliced fiber remains perfectly straight and unbent. Allow it to cool down completely on the cooling tray before winding into the splice tray.

---
**Conclusion:**
Following these 5 golden rules guarantees splice loss in the ideal 0.01 dB to 0.03 dB window, securing top scores in CTEVT exams and excellent ISP transmission quality.`,
    tags: ['Fusion Splicing', 'FTTH', 'Optical Fiber', 'Splice Loss', 'OTDR', 'NITVT Tips'],
    views: 1420,
    likes: 189,
    isFeatured: true,
  },
  {
    id: 'blog-2-ctevt-level-2-exam-guide-2083',
    titleNepali: 'CTEVT टेलिकम टेक्निसियन तह-२ सीप परीक्षण (Skill Test) कसरी सहजै पास गर्ने?',
    titleEnglish: 'Comprehensive Guide to Pass CTEVT Telecom Technician Level-2 Skill Test',
    category: 'exams',
    categoryLabel: 'परीक्षा तथा तयारी (Exams & Prep)',
    categoryLabelEnglish: 'Exams & Preparation',
    author: 'NITVT परीक्षा समिति',
    authorRole: 'सीप परीक्षण मूल्यांकन विज्ञ समूह',
    authorRoleEnglish: 'Skill Test Evaluation Panel',
    date: '२०८३ भाद्र १०',
    dateEnglish: 'Aug 26, 2026',
    readTime: '६ मिनेट',
    readTimeEnglish: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    summaryNepali: 'राष्ट्रिय सीप परीक्षण समिति (NSTB) ले लिने ६० अंकको प्रयोगात्मक र ४० अंकको लिखित/मौखिक परीक्षाको सम्पूर्ण खाका, ध्यान दिनुपर्ने मुख्य बुँदा र समय व्यवस्थापन।',
    summaryEnglish: 'Complete breakdown of NSTB Level-2 60-mark practical and 40-mark theory/viva exams, key test points, and time management strategies.',
    contentNepali: `प्राविधिक शिक्षा तथा व्यावसायिक तालिम परिषद (CTEVT) अन्तर्गतको NSTB ले लिने **टेलिकम टेक्निसियन तह-२ (Skill Test Level-2)** परीक्षा उत्तीर्ण गर्न प्रयोगात्मक सीप र सैद्धान्तिक ज्ञान दुवैमा पकड हुनुपर्छ।

### परीक्षाको संरचना (Exam Structure):
१. **प्रयोगात्मक परीक्षा (Practical Exam - 60 Marks):**
   - OSP Pole Erection, Stay Wire Fitting, र C-Clamp / Tension Clamp जडान।
   - १२ कोर अप्टिकल फाइबर जोड्ने (Fusion Splicing) र OTDR बाट Loss नाप्ने।
   - Electrical Earthing (अर्थिङ) परीक्षण र Megger प्रयोग गरी Insulation Test गर्ने।
   - Distribution Frame (MDF/SDF) मा Punching Tool ले जोड्ने।

२. **सैद्धान्तिक तथा मौखिक परीक्षा (Theory & Viva - 40 Marks):**
   - टेलिकम सुरक्षा (Safety Standards) र PPE सेटको सही प्रयोग।
   - NTC र ISP का गुणस्तर मापदण्डहरू।
   - औजार र उपकरणहरूको नाम र प्रयोग (Multimeter, OTDR, Power Meter, Cleaver, Stripper)।

### सफलताका मुख्य ३ कडीहरू:
- **PPE अनिवार्य प्रयोग:** परीक्षा हल वा प्राक्टिकल यार्डमा पस्दा Safety Helmet, Gloves, Safety Shoe र Harness Belt अनिवार्य लगाउनुहोस्। सुरक्षा साधन नलगाएमा अंक काटिन्छ।
- **समयको पावन्दी (Time Management):** फ्युजन स्प्लाइसिङका लागि तोकिएको १५-२० मिनेटभित्र सफा र मजबुत स्प्लाइस गरिसक्नुपर्छ।
- **मौखिक जवाफ (Viva Confidence):** प्रशिक्षकले सोधेका प्रश्नहरूमा स्पष्ट र प्राविधिक शब्दहरू प्रयोग गरी जवाफ दिनुहोस्।`,
    contentEnglish: `Passing the **CTEVT / NSTB Telecom Technician Level-2 Skill Test** requires solid hands-on craftsmanship combined with conceptual engineering clarity.

### Exam Structure & Breakdown:
1. **Practical Exam (60 Marks):**
   - OSP Pole Erection, Stay Wire Guying, and Clamp Assembly.
   - 12-Core Optical Fiber Fusion Splicing and OTDR loss profiling.
   - Ground Earthing testing and Megger Insulation Resistance measurement.
   - Main Distribution Frame (MDF) IDC Krone Punch-down termination.

2. **Theoretical & Oral Viva (40 Marks):**
   - Telecom safety protocols and full PPE harness handling.
   - Nepal Telecom (NTC) and ISP industry transmission benchmarks.
   - Tool spotting identification (OTDR, Optical Power Meter, VFL, Crimper, Stripper).

### Top 3 Success Strategies:
- **Mandatory PPE Gear:** Wear your Safety Helmet, Protective Gloves, Safety Boots, and Full-Body Harness during all practical tasks. Lack of PPE incurs automatic mark deductions.
- **Time Management:** Complete your fusion splice and joint enclosure sealing within the allocated 15-20 minute window.
- **Confident Viva Communication:** Give direct, precise technical answers with standard telecom terminology.`,
    tags: ['CTEVT', 'Skill Test', 'Level 2', 'NSTB Exam', 'Telecom License', 'Nepal Telecom'],
    views: 2150,
    likes: 312,
    isFeatured: false,
  },
  {
    id: 'blog-3-telecom-pole-erection-safety-standards',
    titleNepali: 'टेलिकम पोल गाड्दा र तार तान्दा अपनाउनुपर्ने राष्ट्रिय सुरक्षा मापदण्डहरू (Safety First)',
    titleEnglish: 'National Safety Standards for Telecom Pole Erection & Aerial Cabling',
    category: 'telecom',
    categoryLabel: 'टेलिकम इन्जिनियरिङ (Telecom Engineering)',
    categoryLabelEnglish: 'Telecom Engineering',
    author: 'सुरेन्द्र ऐर (Surendra Air)',
    authorRole: 'संरचना तथा OSP विशेषज्ञ',
    authorRoleEnglish: 'Structural & OSP Specialist',
    date: '२०८३ श्रावण २५',
    dateEnglish: 'Aug 10, 2026',
    readTime: '४ मिनेट',
    readTimeEnglish: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=1000&q=80',
    summaryNepali: '८ मिटर र ९ मिटरको स्टिल ट्युबुलर पोल कति गहिरो गाड्ने? High Tension विद्युत लाइनबाट कति दुरी कायम गर्ने? दुर्घटनाबाट बच्ने सुरक्षा उपायहरू।',
    summaryEnglish: 'How deep to plant 8m and 9m steel tubular poles? How to maintain safe clearance from high-voltage electrical lines and prevent field hazards.',
    contentNepali: `फिल्डमा काम गर्दा अलिकति पनि लापरवाही भएमा ज्यानै जाने जोखिम हुन्छ। नेपाल टेलिकम तथा NEA को संयुक्त मापदण्ड अनुसार पोल इरेक्सन गर्दा निम्न कुरामा विशेष ध्यान दिनुपर्छ:

### १. पोलको गहिराइ (Pole Depth Calculation)
- ८ मिटर पोलको लागि: १.५ मिटर (१/५ भाग वा १५%) जमिनमुनि हुनुपर्छ।
- ९ मिटर पोलको लागि: १.६ मिटर गहिरो खाल्डो खनेर मुनि Concrete/Cement बेस हाल्नुपर्छ।

### २. विद्युत लाइनबाट सुरक्षित दुरी (Clearance from Power Lines)
- 11kV High Voltage Line बाट टेलिकम केबल कम्तिमा **१.२ मिटर (4 Feet)** मुनि हुनुपर्छ।
- Domestic Low Voltage Line (230V/400V) बाट कम्तिमा **०.६ मिटर (2 Feet)** दुरी कायम गर्नुपर्छ।

### ३. पोल क्लाइम्बिङ सुरक्षा (Pole Climbing Rules)
- पोल चढ्नुभन्दा अगाडि पोलको फेद मक्किएको वा ढलेको छ कि छैन जाँच्नुहोस्।
- Safety Harness Belt पोलमा लक नगरी दुवै हात छोडेर काम नगर्नुहोस्।
- चिसो मौसम वा पानी परेको बेला फलामको पोलमा विद्युतीय करेन्ट प्रवाह हुन सक्ने भएकाले Voltage Detector Pen ले टेस्ट गर्नुहोस्।`,
    contentEnglish: `In outside plant (OSP) telecom operations, electrical safety and structural stability are vital to protect lives. According to Nepal Telecom and NEA joint safety standards, the following guidelines must be strictly enforced:

### 1. Pole Planting Depth Rules
- For 8-meter steel tubular poles: Minimum 1.5 meters underground depth (1/5th or 15% rule).
- For 9-meter steel tubular poles: Minimum 1.6 meters depth with a reinforced concrete/cement base collar.

### 2. Mandatory Electrical Clearance
- Maintain at least **1.2 meters (4 feet)** clear vertical gap below 11kV high-voltage lines.
- Maintain at least **0.6 meters (2 feet)** clearance from 230V/400V low-voltage domestic lines.

### 3. Pole Climbing Safety Protocols
- Inspect the base of the pole for rust, foundation soil erosion, or tilting before ascent.
- Secure your full-body safety harness locking lanyard onto the pole before using both hands.
- In damp or wet conditions, verify the pole surface with a non-contact voltage detector pen before touching.`,
    tags: ['Pole Erection', 'OSP Safety', 'Electrical Clearance', 'Telecom Pole', 'NITVT Safety'],
    views: 980,
    likes: 145,
    isFeatured: false,
  },
  {
    id: 'blog-4-5g-fiberization-career-opportunities-nepal',
    titleNepali: 'नेपालमा ५G विस्तार र अप्टिकल फाइबर प्राविधिकहरूको भविष्य र रोजगारीको अवसर',
    titleEnglish: '5G Expansion in Nepal & High Demand for Certified Fiber Optic Technicians',
    category: 'ctevt_news',
    categoryLabel: 'CTEVT समाचार तथा करियर (Career & News)',
    categoryLabelEnglish: 'Career & Industry News',
    author: 'NITVT अनुसन्धान शाखा',
    authorRole: 'करियर काउन्सिलिङ डेस्क',
    authorRoleEnglish: 'Career Counseling Desk',
    date: '२०८३ श्रावण १०',
    dateEnglish: 'Jul 26, 2026',
    readTime: '५ मिनेट',
    readTimeEnglish: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=80',
    summaryNepali: 'नेपालका ५० भन्दा बढी जिल्लामा FTTH विस्तार र ५G BTS टावर कनेक्टिभिटीका लागि दक्ष फाइबर टेक्निसियनहरूको उच्च माग र वैदेशिक रोजगारीको सम्भावना।',
    summaryEnglish: 'Rapid FTTH expansion across Nepal and 5G BTS connectivity create record-high job demands for certified fiber optic professionals in Nepal and abroad.',
    contentNepali: `डिजिटल नेपाल फ्रेमवर्क (Digital Nepal Framework) अन्तर्गत नेपालका ७५३ वटै स्थानीय तहमा उच्च गतिको ब्रोडब्यान्ड इन्टरनेट पुर्‍याउने कार्य द्रुत गतिमा अघि बढिरहेको छ।

### किन बढ्दैछ डिक्स अप्टिकल फाइबर टेक्निसियनको माग?
१. **नेपाल टेलिकम र एनसेलको ५G परीक्षण:** ५G टावरहरूमा उच्च ब्यान्डविथ पठाउन हरेक टावरसम्म Fiber-to-the-Tower (FTTT) अनिवार्य गरिएको छ।
२. **विदेशी रोजगार (Gulf & European Countries):** दुबई, साउदी, कतार, मलेसिया, र क्रोएसिया जस्ता देशहरूमा CTEVT / NSTB लेभल-१ र लेभल-२ पास गरेका प्राविधिकहरूको माग ह्वात्तै बढेको छ।
३. **आत्मनिर्भर व्यवसाय:** तालिमपश्चात् आफैले सानो लगानीमा ISP को Sub-contractor बनेर वा लोकल नेटवर्क केबुलिङ गरेर मासिक रु ५०,००० देखि १,५०,००० सम्म आम्दानी गर्न सकिन्छ।`,
    contentEnglish: `Under the Digital Nepal Framework, high-speed optical fiber connectivity is reaching all 753 local administrative units, creating massive demand for certified telecom technicians.

### Key Drivers for Certified Optical Fiber Technicians:
1. **5G Rollout & Fiber-to-the-Tower (FTTT):** Ultra-dense 5G cell sites require dedicated gigabit fiber links at every tower.
2. **High Demand in Foreign Employment:** Gulf countries (UAE, Saudi Arabia, Qatar) and European nations (Croatia, Poland, Romania) heavily prioritize candidates holding recognized CTEVT/NSTB skill certificates.
3. **Entrepreneurial Sub-Contracting:** Graduates can establish independent FTTH splicing and cabling contracting businesses, generating substantial monthly earnings.`,
    tags: ['5G Network', 'Fiber Optic Jobs', 'Career in Telecom', 'CTEVT Certification', 'Foreign Jobs'],
    views: 1840,
    likes: 276,
    isFeatured: false,
  },
  {
    id: 'blog-5-multimeter-otdr-reading-guide',
    titleNepali: 'डिजिटल मल्टिमिटर र OTDR ग्राफ कसरी सही तरिकाले पढ्ने? (Practical Guide)',
    titleEnglish: 'How to Read Digital Multimeter & OTDR Trace Waveforms Correctly',
    category: 'tips',
    categoryLabel: 'प्राविधिक टिप्स (Technical Tips)',
    categoryLabelEnglish: 'Technical Tips & Testing',
    author: 'सुरेन्द्र ऐर (Surendra Air)',
    authorRole: 'मुख्य प्रशिक्षक',
    authorRoleEnglish: 'Lead Instructor',
    date: '२०८३ असार २८',
    dateEnglish: 'Jul 12, 2026',
    readTime: '६ मिनेट',
    readTimeEnglish: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80',
    summaryNepali: 'OTDR मा Fresnel Reflection, Rayleigh Backscattering र Splice Event कसरी पहिचान गर्ने? मल्टिमिटरबाट DC Voltage र Continuity टेस्ट गर्ने तरिका।',
    summaryEnglish: 'How to identify Fresnel reflections, Rayleigh backscatter, and splice events on OTDR traces, plus multimeter continuity & DC testing guides.',
    contentNepali: `इन्जिनियरिङ क्षेत्रमा उपकरणको सही नतिजा (Reading) पढ्न नजान्दा गल्ती निदान (Wrong Fault Diagnosis) हुने गर्दछ।

### OTDR ग्राफ पढ्ने नियम (OTDR Trace Analysis):
- **सुरुवाती स्पाइक (Dead Zone):** OTDR सँग फाइबर जोडिएको सुरुवाती बिन्दुमा आउने ठूलो स्पाइक (Event)।
- **सिधा तेर्सो रेखा (Fiber Attenuation Slope):** फाइबरको लम्बाई र प्रति किलोमिटर लस (dB/km) देखाउँछ। (१३१०nm मा ~०.३५ dB/km र १५५०nm मा ~०.२१ dB/km)।
- **अचानक तल झरेको स्टेप (Non-Reflective Event):** यसले स्प्लाइस लस (Fusion Splice) वा फाइबर धेरै मोडिएको (Bending Loss) जनाउँछ।
- **माथि गएर तल झरेको स्पाइक (Reflective Event):** कनेक्टर जडान (Mechanical Splice or Connector interface) वा फाइबर टुटेको ठाउँ (End of Fiber)।

### मल्टिमिटर प्रयोगका मुख्य टिप्स:
- Voltage नाप्दा सधैं AC र DC सेलेक्ट गर्दा होसियार हुनुहोस्।
- Continuity मोडमा बीप (Beep) आवाज आएमा सर्किट जोडिएको (Short / Continuous) प्रमाणित हुन्छ।`,
    contentEnglish: `Accurate instrument waveform interpretation is the cornerstone of effective telecom fault diagnosis.

### OTDR Trace Waveform Analysis:
- **Initial Launch Peak (Dead Zone):** High reflective event where launch fiber connects to the instrument front panel.
- **Linear Attenuation Slope:** The downward slope representing distributed optical loss (dB/km) along the fiber span (~0.35 dB/km @ 1310nm, ~0.21 dB/km @ 1550nm).
- **Downward Non-Reflective Step:** Represents a fusion splice loss or a macrobending point.
- **Spike with Drop (Reflective Event):** Represents a mechanical connector joint, patch panel interface, or fiber end termination.

### Digital Multimeter Best Practices:
- Always ensure the dial is accurately switched between AC and DC voltage modes before probing energized power rails.
- In continuity buzzer mode, a clear tone confirms low-impedance copper wire continuity.`,
    tags: ['Multimeter', 'OTDR Reading', 'Dead Zone', 'Troubleshooting', 'Engineering Tips'],
    views: 1670,
    likes: 240,
    isFeatured: false,
  }
];
