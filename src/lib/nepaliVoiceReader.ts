/**
 * Advanced Nepali Text-to-Speech (TTS) & Audio Reader Engine
 * Featuring:
 * 1. Comprehensive Devanagari & Telecom Phonetic Normalization (acronyms, technical terms, numbers, units, colors)
 * 2. Sentence-by-sentence continuous queueing (prevents browser TTS 15s freeze & audio clipping)
 * 3. Smart Neural/Natural voice detection with multi-voice selection support
 * 4. Precise playback controls (Speed, Sentence Skip, Pause/Resume, Keep-alive heartbeat)
 */

export interface SpeechState {
  isPlaying: boolean;
  isPaused: boolean;
  currentTitle: string;
  currentText: string;
  currentSentence: string;
  currentSentenceIndex: number;
  totalSentences: number;
  progressPercent: number;
  rate: number;
  selectedVoiceURI: string | null;
  availableVoices: { name: string; lang: string; voiceURI: string }[];
  error?: string | null;
}

type Listener = (state: SpeechState) => void;

let sentenceQueue: string[] = [];
let currentSentenceIndex = 0;
let isSpeakingActive = false;
let keepAliveTimer: any = null;

const currentState: SpeechState = {
  isPlaying: false,
  isPaused: false,
  currentTitle: '',
  currentText: '',
  currentSentence: '',
  currentSentenceIndex: 0,
  totalSentences: 0,
  progressPercent: 0,
  rate: 0.88, // Optimal clarity speed for Nepali pronunciation
  selectedVoiceURI: null,
  availableVoices: [],
  error: null,
};

const listeners: Set<Listener> = new Set();

function notifyListeners() {
  listeners.forEach((fn) => fn({ ...currentState }));
}

export function subscribeVoiceState(listener: Listener): () => void {
  listeners.add(listener);
  listener({ ...currentState });
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Normalizes English technical terms, acronyms, symbols, and Devanagari grammar
 * into natural, studio-clear spoken Nepali.
 */
export function prepareNepaliText(rawText: string): string {
  if (!rawText) return '';

  let text = rawText
    // Strip Markdown & formatting symbols
    .replace(/#+/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`{1,3}.*?`{1,3}/gs, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/[—–_=+~|]+/g, ' ')
    .replace(/\r\n/g, '\n');

  // Telecom Acronyms & Institutional Entities
  const technicalTerms: [RegExp, string][] = [
    [/\bCTEVT\b/gi, 'सीटीईभीटी'],
    [/\bNSTB\b/gi, 'एनएसटीबी'],
    [/\bNITVT\b/gi, 'एनआईटीभीटी'],
    [/\bOTDR\b/gi, 'ओटीडीआर (अप्टिकल टाइम डोमेन रिफ्लेक्टोमिटर)'],
    [/\bOFC\b/gi, 'ओएफसी (अप्टिकल फाइबर केबल)'],
    [/\bFTTH\b/gi, 'एफटीटीएच (फाइबर टु द होम)'],
    [/\bGPON\b/gi, 'जी-पोन'],
    [/\bEPON\b/gi, 'ई-पोन'],
    [/\bEPABX\b/gi, 'ईपीएबीएक्स टेलिफोन एक्सचेन्ज'],
    [/\bPBX\b/gi, 'पीबीएक्स'],
    [/\bVFL\b/gi, 'भीएफएल (भिजुअल फल्ट लोकेटर)'],
    [/\bOPM\b/gi, 'ओपीएम (अप्टिकल पावर मिटर)'],
    [/\bOLT\b/gi, 'ओएलटी'],
    [/\bONT\b/gi, 'ओएनटी'],
    [/\bONU\b/gi, 'ओएनयु'],
    [/\bFDB\b/gi, 'एफडीबी बक्स'],
    [/\bFAT\b/gi, 'एफएटी बक्स'],
    [/\bFDT\b/gi, 'एफडीटी क्याबिनेट'],
    [/\bSJC\b/gi, 'एसजेसी स्प्लाइस क्लोजर'],
    [/\bODF\b/gi, 'ओडीएफ र्याक'],
    [/\bMDF\b/gi, 'एमडीएफ'],
    [/\bOSP\b/gi, 'ओएसपी बाहिरी प्लान्ट'],
    [/\bISP\b/gi, 'आईएसपी इन्टरनेट सेवा प्रदायक'],
    [/\bMCQ\b/gi, 'वस्तुगत प्रश्न'],
    [/\bVIVA\b/gi, 'मौखिक भाइभा प्रश्न'],
    [/\bSOP\b/gi, 'एसओपी कार्यविधि'],
    [/\bLAN\b/gi, 'ल्यान'],
    [/\bWAN\b/gi, 'व्यान'],
    [/\bWLAN\b/gi, 'डब्लु-ल्यान'],
    [/\bIP\b/gi, 'आईपी एड्रेस'],
    [/\bTCP\/IP\b/gi, 'टीसीपी आईपी'],
    [/\bCAT-?6A?\b/gi, 'क्याट सिक्स केबल'],
    [/\bCAT-?5E?\b/gi, 'क्याट फाइभ केबल'],
    [/\bRJ-?45\b/gi, 'आरजे पैंतालीस कनेक्टर'],
    [/\bRJ-?11\b/gi, 'आरजे एघार कनेक्टर'],
    [/\bUTP\b/gi, 'युटीपी तार'],
    [/\bSTP\b/gi, 'एसटीपी तार'],
    [/\bAC\b/g, 'एसी बिजुली'],
    [/\bDC\b/g, 'डीसी बिजुली'],
    [/\bLED\b/gi, 'एलईडी'],
    [/\bLASER\b/gi, 'लेजर किरण'],
    [/\bADSS\b/gi, 'एडीएसएस केबल'],
    [/\bSplicer\b/gi, 'स्प्लाइसर मेसिन'],
    [/\bCleaver\b/gi, 'क्लिभर'],
    [/\bStripper\b/gi, 'स्ट्रिपर'],
    [/\bPatch\s*cord\b/gi, 'प्याच कर्ड'],
    [/\bPigtail\b/gi, 'पिगटेल'],
    [/\bAdapter\b/gi, 'एडप्टर'],
    [/\bSplitter\b/gi, 'स्प्लिटर'],
    [/\bAttenuator\b/gi, 'एटेनुएटर'],
    [/\bDrop\s*cable\b/gi, 'ड्रप केबल'],
    [/\bSingle\s*mode\b/gi, 'सिंगल मोड'],
    [/\bMulti\s*mode\b/gi, 'मल्टि मोड'],
    [/\bG\.?652D\b/gi, 'जी ६५२ डी'],
    [/\bG\.?657A\b/gi, 'जी ६५७ ए'],
    [/\bSC\/UPC\b/gi, 'एससी युपीसी नीलो कनेक्टर'],
    [/\bSC\/APC\b/gi, 'एससी एपीसी हरियो कनेक्टर'],
    [/\bLC\/UPC\b/gi, 'एलसी युपीसी'],
    [/\bFC\/UPC\b/gi, 'एफसी युपीसी'],
    [/\bST\b/g, 'एसटी'],
    [/\bLevel-?1\b/gi, 'तह एक'],
    [/\bLevel-?2\b/gi, 'तह दुई'],
    [/\bPPE\b/gi, 'पीपीई सुरक्षा उपकरण'],
    [/\bCore\b/gi, 'कोर'],
    [/\bCores\b/gi, 'कोर'],
    [/\bLoss\b/gi, 'लस'],
    [/\bSplice\b/gi, 'स्प्लाइस'],
    [/\bMicro-?bending\b/gi, 'माइक्रो बेन्डिङ'],
    [/\bMacro-?bending\b/gi, 'म्याक्रो बेन्डिङ'],
    [/\bReturn\s*loss\b/gi, 'रिटर्न लस'],
    [/\bInsertion\s*loss\b/gi, 'इन्सर्सन लस'],
    [/\bSafety\b/gi, 'सुरक्षा'],
    [/\bMultimeter\b/gi, 'मल्टिमिटर'],
    [/\bContinuity\b/gi, 'कन्टिन्युइटी'],
    [/\bResistance\b/gi, 'प्रतिरोध'],
    [/\bVoltage\b/gi, 'भोल्टेज'],
    [/\bCurrent\b/gi, 'करेन्ट'],
  ];

  for (const [regex, replacement] of technicalTerms) {
    text = text.replace(regex, replacement);
  }

  // Optical Ratios & Measurements
  text = text
    .replace(/(\d+)\s*:\s*(\d+)/g, '$1 बाइ $2')
    .replace(/(\d+)\s*\/\s*(\d+)/g, '$1 बाइ $2')
    .replace(/(\d+)\s*nm\b/gi, '$1 नानोमिटर')
    .replace(/(\d+)\s*dBm\b/gi, '$1 डिबिएम')
    .replace(/(\d+)\s*dB\b/gi, '$1 डेसिबल')
    .replace(/(\d+)\s*km\b/gi, '$1 किलोमिटर')
    .replace(/(\d+)\s*m\b/gi, '$1 मिटर')
    .replace(/(\d+)\s*cm\b/gi, '$1 सेन्टिमिटर')
    .replace(/(\d+)\s*mm\b/gi, '$1 मिलिमिटर')
    .replace(/(\d+)\s*µm\b/gi, '$1 माइक्रोमिटर')
    .replace(/(\d+)\s*um\b/gi, '$1 माइक्रोमिटर')
    .replace(/(\d+)\s*kV\b/gi, '$1 किलोभोल्ट')
    .replace(/(\d+)\s*V\b/gi, '$1 भोल्ट')
    .replace(/(\d+)\s*A\b/gi, '$1 एम्पियर')
    .replace(/(\d+)\s*W\b/gi, '$1 वाट')
    .replace(/(\d+)\s*Ω\b/gi, '$1 ओम')
    .replace(/(\d+)\s*Hz\b/gi, '$1 हर्ज')
    .replace(/(\d+)\s*kHz\b/gi, '$1 किलोहर्ज')
    .replace(/(\d+)\s*MHz\b/gi, '$1 मेगाहर्ज')
    .replace(/(\d+)\s*GHz\b/gi, '$1 गिगाहर्ज')
    .replace(/•\s*/g, 'बुँदा: ')
    .replace(/-\s*/g, ' ');

  return text.trim();
}

/**
 * Splits formatted text into clean sentence chunks for progressive reading.
 */
function splitIntoSentences(text: string): string[] {
  const prepared = prepareNepaliText(text);
  if (!prepared) return [];

  // Split by Devanagari full stop (।), question mark (?), exclamation (!), or double newlines
  const rawSentences = prepared.split(/(?<=[।?!।\n])\s+/);

  const cleanSentences: string[] = [];
  for (const s of rawSentences) {
    const trimmed = s.trim();
    if (trimmed.length > 0) {
      // If a single sentence is very long (> 200 chars), split by commas to ensure natural breathing pauses
      if (trimmed.length > 200) {
        const parts = trimmed.split(/(?<=[,;])\s+/);
        for (const p of parts) {
          const pt = p.trim();
          if (pt.length > 0) cleanSentences.push(pt);
        }
      } else {
        cleanSentences.push(trimmed);
      }
    }
  }

  return cleanSentences.length > 0 ? cleanSentences : [prepared];
}

/**
 * Ranked voice discovery to pick the highest clarity Devanagari / Nepali voice.
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  return window.speechSynthesis.getVoices() || [];
}

export function updateAvailableVoicesList() {
  const voices = getAvailableVoices();
  const devanagariOrIndianVoices = voices.filter(
    (v) =>
      v.lang.toLowerCase().includes('ne') ||
      v.lang.toLowerCase().includes('hi') ||
      v.lang.toLowerCase().includes('in') ||
      v.name.toLowerCase().includes('nepali') ||
      v.name.toLowerCase().includes('hindi') ||
      v.name.toLowerCase().includes('india') ||
      v.name.toLowerCase().includes('natural')
  );

  const listToSave = (devanagariOrIndianVoices.length > 0 ? devanagariOrIndianVoices : voices).map((v) => ({
    name: v.name,
    lang: v.lang,
    voiceURI: v.voiceURI,
  }));

  currentState.availableVoices = listToSave;
  notifyListeners();
}

function findBestVoice(selectedURI?: string | null): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices();
  if (!voices || voices.length === 0) return null;

  // 1. If user explicitly selected a voice
  if (selectedURI) {
    const userVoice = voices.find((v) => v.voiceURI === selectedURI);
    if (userVoice) return userVoice;
  }

  // 2. Look for Native Nepali voices
  const nepaliVoice = voices.find(
    (v) => v.lang.toLowerCase().includes('ne') || v.name.toLowerCase().includes('nepali')
  );
  if (nepaliVoice) return nepaliVoice;

  // 3. Look for Microsoft Natural Online / Google Neural Hindi voices (flawless Devanagari clarity)
  const premiumDevanagariVoice = voices.find(
    (v) =>
      (v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Google')) &&
      (v.lang.toLowerCase().includes('hi') || v.name.toLowerCase().includes('hindi'))
  );
  if (premiumDevanagariVoice) return premiumDevanagariVoice;

  // 4. Look for Standard Hindi / Devanagari voices
  const hindiVoice = voices.find(
    (v) => v.lang.toLowerCase().includes('hi') || v.name.toLowerCase().includes('hindi')
  );
  if (hindiVoice) return hindiVoice;

  // 5. Look for Indian English (often comes with bilingual Devanagari acoustic models)
  const indianVoice = voices.find(
    (v) => v.lang.toLowerCase().includes('en-in') || v.name.toLowerCase().includes('india')
  );
  if (indianVoice) return indianVoice;

  // 6. Default fallback
  return voices.find((v) => v.default) || voices[0] || null;
}

// Ensure voices are updated when browser loads them
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    updateAvailableVoicesList();
  };
}

/**
 * Chrome keep-alive heartbeat to prevent speech synthesis sleep
 */
function startKeepAlive() {
  stopKeepAlive();
  keepAliveTimer = setInterval(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (currentState.isPlaying && !currentState.isPaused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }
  }, 10000);
}

function stopKeepAlive() {
  if (keepAliveTimer) {
    clearInterval(keepAliveTimer);
    keepAliveTimer = null;
  }
}

/**
 * Internal sentence player that advances through the queue
 */
function playNextSentence() {
  if (!isSpeakingActive || currentSentenceIndex >= sentenceQueue.length) {
    // Finished reading all sentences
    isSpeakingActive = false;
    stopKeepAlive();
    currentState.isPlaying = false;
    currentState.isPaused = false;
    currentState.currentSentence = '';
    currentState.progressPercent = 100;
    notifyListeners();
    return;
  }

  const sentenceText = sentenceQueue[currentSentenceIndex];
  currentState.currentSentence = sentenceText;
  currentState.currentSentenceIndex = currentSentenceIndex;
  currentState.totalSentences = sentenceQueue.length;
  currentState.progressPercent = Math.round(
    ((currentSentenceIndex + 1) / sentenceQueue.length) * 100
  );
  currentState.isPlaying = true;
  currentState.isPaused = false;
  currentState.error = null;
  notifyListeners();

  const utterance = new SpeechSynthesisUtterance(sentenceText);
  utterance.rate = currentState.rate || 0.88;
  utterance.pitch = 1.0;
  utterance.lang = 'ne-NP';

  const bestVoice = findBestVoice(currentState.selectedVoiceURI);
  if (bestVoice) {
    utterance.voice = bestVoice;
    currentState.selectedVoiceURI = bestVoice.voiceURI;
  }

  utterance.onend = () => {
    if (isSpeakingActive) {
      currentSentenceIndex++;
      // Subtle natural 160ms pause between sentences for clarity
      setTimeout(() => {
        if (isSpeakingActive) {
          playNextSentence();
        }
      }, 160);
    }
  };

  utterance.onerror = (e) => {
    console.warn('Speech synthesis sentence notification:', e);
    // If it's a genuine error and not an intentional cancellation
    if (isSpeakingActive && e.error !== 'canceled' && e.error !== 'interrupted') {
      currentSentenceIndex++;
      setTimeout(() => {
        if (isSpeakingActive) playNextSentence();
      }, 150);
    }
  };

  try {
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('Failed to trigger speechSynthesis.speak:', err);
    currentState.isPlaying = false;
    currentState.isPaused = false;
    currentState.error =
      'आईफ्रेम (Iframe) सुरक्षाले आवाजमा वाचन गर्न रोक लगाएको छ। पूर्ण अडियो सुन्नको लागि माथि रहेको "Open in New Tab" थिची नयाँ ट्याबमा एप खोल्नुहोस्।';
    notifyListeners();
  }
}

/**
 * Main Public Function to Read Chapter / Note out loud with maximum clarity
 */
export function speakNepaliText(
  rawText: string,
  title: string = 'नेपाली नोट वाचन (Audio Chapter)',
  customRate?: number
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    alert('तपाईंको ब्राउजरमा आवाजमा पढ्ने (Text-to-Speech) सुविधा उपलब्ध छैन।');
    return;
  }

  // Cancel any existing speech
  window.speechSynthesis.cancel();
  stopKeepAlive();

  const sentences = splitIntoSentences(rawText);
  if (sentences.length === 0) return;

  sentenceQueue = sentences;
  currentSentenceIndex = 0;
  isSpeakingActive = true;

  if (customRate) {
    currentState.rate = customRate;
  }

  currentState.currentTitle = title;
  currentState.currentText = rawText;
  currentState.totalSentences = sentences.length;
  currentState.currentSentenceIndex = 0;
  currentState.progressPercent = 0;
  currentState.error = null;

  updateAvailableVoicesList();
  startKeepAlive();
  playNextSentence();
}

export function pauseNepaliVoice(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.pause();
    currentState.isPaused = true;
    currentState.isPlaying = false;
    notifyListeners();
  }
}

export function resumeNepaliVoice(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.resume();
    currentState.isPaused = false;
    currentState.isPlaying = true;
    notifyListeners();
  }
}

export function stopNepaliVoice(): void {
  isSpeakingActive = false;
  stopKeepAlive();
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentState.isPlaying = false;
    currentState.isPaused = false;
    currentState.error = null;
    currentState.currentTitle = '';
    currentState.currentText = '';
    currentState.currentSentence = '';
    currentState.currentSentenceIndex = 0;
    currentState.totalSentences = 0;
    currentState.progressPercent = 0;
    notifyListeners();
  }
}

export function nextNepaliSentence(): void {
  if (currentSentenceIndex < sentenceQueue.length - 1) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    currentSentenceIndex++;
    isSpeakingActive = true;
    playNextSentence();
  }
}

export function prevNepaliSentence(): void {
  if (currentSentenceIndex > 0) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    currentSentenceIndex--;
    isSpeakingActive = true;
    playNextSentence();
  }
}

export function setNepaliVoiceSpeed(newRate: number): void {
  currentState.rate = newRate;
  notifyListeners();

  // If currently active, re-speak current sentence with new rate
  if (isSpeakingActive) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    playNextSentence();
  }
}

export function setNepaliVoice(voiceURI: string): void {
  currentState.selectedVoiceURI = voiceURI;
  notifyListeners();

  if (isSpeakingActive) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    playNextSentence();
  }
}

