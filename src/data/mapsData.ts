import { SurveyMap } from '../types';

export const defaultSurveyMaps: SurveyMap[] = [
  {
    id: 'gwarko',
    titleNepali: 'नेपाल टेलिकम – ग्वार्को चोक (Gwarko Chowk) प्राथमिक तथा सेकेन्डरी नेटवर्क सर्भे',
    titleEnglish: 'Official Field Base Map - Gwarko Chowk',
    category: 'Gwarko Map',
    descriptionNepali: 'कागजातको नक्सा अनुसार ग्वार्को चोक एक्सचेन्जबाट लगनखेल क्याबिनेट (Cabinet-08) र इमाडोल क्याबिनेट (Cabinet-09) बीचको केबल रुट, पेयर साइज, स्प्यान र डीपी नम्बरिङ विवरण।',
    asciiDiagram: `====================================================================================================
                        नेपाल टेलिकम - ग्वार्को चोक फिल्ड सर्भे नक्सा (Gwarko Map)
====================================================================================================

               [DP 08/09] ──── 30x0.4 (40m) ──── [DP 08/07] ──── 70x0.4 (120m) ──── [DP 09/06]
                    │                                                                   │
               30x0.4 (80m)                                                      150x0.5 (100m)
                    │                                                                   │
               [DP 08/07]                                                        [CABINET-08] (Lagankhel)
                    │                                                                   ▲
               10x0.4 (L6m)                                                             │ 200x0.5 (250m)
                    │                                                                   │
               [DP 08/07] ──── 30x0.4 (40m) ──── [DP 08/20]                      [JOINT POINT]
                                                       │                                ▲
                                                  20x0.4 (40m)                          │ 600x0.5 (250m)
                                                       │                                │
                                                  [DP 08/11] ─────── [EXCHANGE: GWARKOCHOK] ───────
                                                       │                                │
                                                  10x0.4 (140m)                         │ 300x0.5 (250m)
                                                       │                                ▼
                                                  [DP 08/12]                      [CABINET-09] (Imadol)
                                                                                        │
                                                                                 100x0.4 (40m)
                                                                                        │
                                                  [DP 09/07] ──── 70x0.4 (120m) ──── [DP 09/06] ──── 70x0.4 (50m) ──── [DP 09/02]
                                                       │                                │                                   │
                                                  30x0.4 (100m)                    20x0.4 (40m)                        50x0.4 (80m)
                                                       │                                │                                   │
                                                  [DP 09/11] ─── 70x0.4 (80m) ─── [DP 08/29] ─── 30x0.4 (40m) ─── [DP 09/12] ─── [DP 09/13]
====================================================================================================`,
    legendItems: [
      { label: 'फिडर केबल (Primary Feeder)', color: '#ef4444' },
      { label: 'सेकेन्डरी केबल (Secondary Cable)', color: '#3b82f6' },
      { label: 'डीपी (Distribution Point)', color: '#10b981' },
      { label: 'क्याबिनेट (Cabinet 08/09)', color: '#f59e0b' }
    ],
    routeDetails: [
      {
        title: 'कैबिनेट-०८ (Lagankhel Route)',
        details: [
          'प्राथमिक फिडर: 600x0.5 (250m) → 200x0.5 (250m)',
          'सेकेन्डरी केबल: 150x0.5, 70x0.4, 30x0.4, 20x0.4, 10x0.4',
          'डीपीहरू: DP 08/01, 08/07, 08/09, 08/11, 08/12, 08/20',
          'स्थान: लगनखेल रुट, महालक्ष्मी नगरपालिका'
        ]
      },
      {
        title: 'क्याबिनेट-०९ (Imadol Route)',
        details: [
          'प्राथमिक फिडर: 300x0.5 (250m) → 100x0.4 (40m)',
          'सेकेन्डरी केबल: 70x0.4, 50x0.4, 30x0.4, 20x0.4, 10x0.4',
          'डीपीहरू: DP 09/01, 09/02, 09/06, 09/07, 09/10, 09/11, 09/12, 09/13',
          'स्थान: इमाडोल रुट, महालक्ष्मी नगरपालिका'
        ]
      }
    ],
    notesNepali: 'ग्वार्को चोक बेस म्यापमा प्राइमरी फिडर र सेकेन्डरी कपर/फाइबर वितरण नेटवर्क स्पष्ट परिभाषित छ।'
  },
  {
    id: 'mfd-2cab',
    titleNepali: 'Main Distribution Frame (MFD/MDF) र २ वटा Cabinet को प्राथमिक सञ्जाल योजना',
    titleEnglish: 'MFD & 2 Cabinets Primary Planning Scheme',
    category: 'MFD & 2 Cabinet Plan',
    descriptionNepali: 'नेपाल टेलिकम सबस्टेशनबाट MFD सम्म 11kV/400V वा फाइबर इनकमर, र MFD बाट क्याबिनेट-१ (३०० मिटर) तथा क्याबिनेट-२ (४५० मिटर) सम्म १४४F/२८८F ट्रंक केबल र अर्थिङ पिट संरचना।',
    asciiDiagram: `┌────────────────────────┐
│      SOURCE            │
│  नेपाल टेलिकम सबस्टेशन │
└──────────┬─────────────┘
           │ [Primary Feeder Cable - Existing/Planned]
           ▼
┌─────────────────────────────────────────────────────────────┐
│              मुख्य वितरण फ्रेम (MFD / MDF)                  │
│  - प्राथमिक टर्मिनेसन (From Exchange)                      │
│  - ODF (Fiber) + COPPER DISTRIBUTION (MDF)                  │
│  - SURGE PROTECTION DEVICE + EARTH BAR (Earth Pit < 5Ω)     │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
     [Underground Duct/Pipe]        [Underground Duct/Pipe]
     144F / 288F Trunk Cable        144F / 288F Trunk Cable
     Length: ~300m - 350m           Length: ~420m - 450m
               │                              │
               ▼                              ▼
┌─────────────────────────────┐┌─────────────────────────────┐
│   क्याबिनेट-१ (CABINET-1)   ││   क्याबिनेट-२ (CABINET-2)   │
│ - 11kV RMU / LBS / FDH      ││ - 11kV RMU / LBS / FDH      │
│ - Earth Pit (< 10Ω)         ││ - Earth Pit (< 10Ω)         │
└──────────────┬──────────────┘└──────────────┬──────────────┘
               │                              │
     [Secondary Drops/Feeders]      [Secondary Drops/Feeders]
               │                              │
               ▼                              ▼
     [SERVICE AREA 1]               [SERVICE AREA 2]
  (Residential/Commercial/Govt)   (Residential/Commercial/Govt)`,
    legendItems: [
      { label: 'मुख्य एक्सचेन्ज / सबस्टेशन', color: '#a855f7' },
      { label: 'MFD / MDF वितरक फ्रेम', color: '#10b981' },
      { label: 'क्याबिनेट १ र २', color: '#06b6d4' }
    ],
    routeDetails: [
      {
        title: 'MFD देखि क्याबिनेट-१ (Cabinet-1)',
        details: [
          'दूरी: ~३०० मिटर देखि ३५० मिटर',
          'केबल: Underground HDPE Duct मा १४४F/२८८F Armor Cable',
          'अर्थिङ: Copper Plate Earth Pit (< 5Ω resistance)'
        ]
      },
      {
        title: 'MFD देखि क्याबिनेट-२ (Cabinet-2)',
        details: [
          'दूरी: ~४२० मिटर देखि ४५० मिटर',
          'केबल: Direct Buried / Duct Trunk Cable',
          'सुरक्षा: Surge Arrester & Gas Discharge Tube'
        ]
      }
    ],
    notesNepali: 'MFD र २ क्याबिनेट प्राथमिक योजनाले OSP नेटवर्कको मुख्य Backbone र Feeder Architecture प्रतिनिधित्व गर्दछ।'
  },
  {
    id: 'secondary-poling',
    titleNepali: '१ क्याबिनेट, २ डि.पि., ३ वटा पोल, १ स्टे, १ पुस ब्रेस भएको सेकेन्डरी पोलिङ',
    titleEnglish: 'Secondary Polling Diagram (1 Cab, 2 DP, 3 Poles, 1 Stay)',
    category: 'Secondary Polling',
    descriptionNepali: 'Secondary Cabinet (SC-01) बाट Pole-1 (DP-1), Pole-2 (DP-2), र Pole-3 (Stay Wire + Push Brace) सम्मको वास्तविक फिल्ड स्ट्रक्चर।',
    asciiDiagram: `┌──────────────┐
│  CABINET     │
│  (SC - 01)   │
└──────┬───────┘
       │ [2 Pair Distribution Feeder Cable]
       │
       ▼
   [ POLE - 1 ] ────────────── (Span 1: Approx 50m) ──────────────> [ POLE - 2 ] ────────── (Span 2: 50m) ──────────> [ POLE - 3 ]
       │                                                                   │                                                 │
   [ DP - 1 ]                                                          [ DP - 2 ]                                            ├── [STAY WIRE (स्टे) ४५°]
       │                                                                   │                                                 │
  [Drop Wire 1 Pair]                                                  [Drop Wire 1 Pair]                                     └── [PUSH BRACE (पुस ब्रेस)]
       │                                                                   │
       ▼                                                                   ▼
 [ Subscriber - 1 ]                                                  [ Subscriber - 2 ]
   (ग्राहक घर १)                                                       (ग्राहक घर २)

* Note: Pole Depth = 1.5m (7.5m pole); DP Height = 110cm below top; Earth Resistance < 10Ω`,
    legendItems: [
      { label: 'क्याबिनेट (SC-01)', color: '#f59e0b' },
      { label: 'पोल १, २ र ३', color: '#38bdf8' },
      { label: 'डीपी १ र २', color: '#10b981' },
      { label: 'स्टे तार र पुस ब्रेस (Stay & Push Brace)', color: '#f43f5e' }
    ],
    routeDetails: [
      {
        title: 'सेकेन्डरी पोलिङ स्पेसिफिकेसन',
        details: [
          'पोल गहिराइ: १.५ मिटर (७.५m पोलका लागि १/६ भाग गहिराइ)',
          'डीपी उचाइ: पोल टुप्पोबाट ११० सेमी मुनि',
          'स्प्यान दूरी: पोल देखि पोल ५० मिटर',
          'स्टे वायर: ४५° कोणमा स्टे सिट (४०-४५ सेमी मुनि जडान)'
        ]
      }
    ],
    notesNepali: 'यो सेकेन्डरी पोलिङ रेखाचित्रले क्याबिनेटदेखि ग्राहकको घरसम्मको पोलिङ र ड्रप wire रुटिङ प्रस्तुत गर्छ।'
  }
];
