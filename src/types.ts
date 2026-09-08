export interface Course {
  id: string;
  titleNepali: string;
  titleEnglish: string;
  level: string;
  duration: string;
  practicalPercentage: number;
  description: string;
  features: string[];
  targetAudience: string[];
  jobProspects: string[];
  badge: string;
  icon: string;
  feeText?: string;
  upcomingBatch: string;
  imageUrl?: string;
}

export interface TechnicalTool {
  id: number;
  nepaliName: string;
  englishName: string;
  category: 'optical-fiber' | 'copper-splicing' | 'measuring-testing' | 'pole-civil' | 'electrical-power' | 'safety-ppe';
  description: string;
  usagePlace: string;
  keyExamFact: string;
  imageUrl?: string;
}

export interface ColorCodeItem {
  number: number;
  nepaliName: string;
  englishName: string;
  hexColor: string;
  textColor?: string;
  internationalColor?: string;
  internationalNepali?: string;
  internationalHex?: string;
}

export interface CopperPairItem {
  pairNo: number;
  tipWire: string; // Primary
  ringWire: string; // Secondary
  primaryColorHex: string;
  secondaryColorHex: string;
  binderGroup?: string;
}

export interface ExamQuestionMCQ {
  id: number;
  questionNepali: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanationNepali: string;
  category: 'fiber' | 'copper' | 'tools' | 'electrical' | 'safety' | 'networking' | 'telecom';
  imageUrl?: string;
}

export interface VivaQuestion {
  id: number;
  questionNepali: string;
  answerNepali: string;
  englishKey: string;
  category: string;
  setNumber?: string;
  imageUrl?: string;
}

export interface SubjectiveQuestion {
  id: number;
  marks: number;
  questionNepali: string;
  modelAnswerNepali: string;
  keyPoints: string[];
  category: string;
  setNumber?: string;
  diagramRequired?: boolean;
  imageUrl?: string;
}

export interface MatchingGroup {
  id: string;
  titleNepali: string;
  items: { id: string; premise: string }[];
  responses: { id: string; letter: string; text: string }[];
  correctMatches: Record<string, string>; // Maps item ID to response ID
  imageUrl?: string;
}

export interface SpottingItem {
  id: number;
  nameEnglish: string;
  nameNepali: string;
  category: string;
  purposeNepali: string;
  purposeEnglish: string;
  tipNepali: string;
  imageUrl?: string;
}

export interface PracticalTask {
  id: string;
  taskNumber: number;
  titleNepali: string;
  titleEnglish: string;
  objectiveNepali: string;
  materialsNeeded: string[];
  stepsNepali: string[];
  safetyPrecautions: string[];
  markingCriteria: { criterion: string; marks: number }[];
}

export interface PracticalExamSet {
  id: string;
  setNumber: string;
  titleNepali: string;
  tasks: PracticalTask[];
}

export interface TelecomKnot {
  id: string;
  nameNepali: string;
  nameEnglish: string;
  purposeNepali: string;
  usageContext: string;
  stepGuide: string[];
  caution: string;
  imageUrl?: string;
}

export interface TelecomSymbol {
  id: number;
  nameNepali: string;
  nameEnglish: string;
  category: 'outside-plant' | 'electrical-schematic' | 'network-hierarchy';
  description: string;
  symbolAsciiOrSvg: string;
  imageUrl?: string;
  statusVariants?: {
    existing: string;
    toInstall: string;
    dismantled: string;
  };
}

export interface ManualChapter {
  id: string;
  chapterNumber: number;
  titleNepali: string;
  titleEnglish: string;
  summary: string;
  contentMarkdown: string;
  keyTakeaways: string[];
  relatedTools: number[];
  relatedExamQuestions: number[];
  fileUrl?: string;
  fileName?: string;
  fileType?: 'pdf' | 'jpg' | 'png';
}

export interface Enrollment {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  course: string;
  batch: string;
  experience: string;
  purpose: string;
  createdAt: string;
  seatNumber: string;
}

export type TestimonialCategory = 'all' | 'fiber' | 'telecom' | 'isp' | 'abroad' | 'women-tech' | 'entrepreneur';

export interface Testimonial {
  id: string;
  nameNepali: string;
  nameEnglish: string;
  batchYear: string;
  courseTaken: string;
  currentRole: string;
  company: string;
  location: string;
  avatarColor: string;
  rating: number;
  certificationBadge: string;
  quoteNepali: string;
  quoteEnglish: string;
  careerHighlight: string;
  skillsMastered: string[];
  category: TestimonialCategory;
  featured?: boolean;
  salaryGrowth?: string;
}

export interface SurveyMap {
  id: string;
  titleNepali: string;
  titleEnglish: string;
  category: string;
  descriptionNepali: string;
  asciiDiagram: string;
  legendItems?: { label: string; color: string }[];
  routeDetails?: {
    title: string;
    details: string[];
  }[];
  notesNepali?: string;
  imageUrl?: string;
  pdfUrl?: string;
  updatedAt?: string;
}

export interface InstructorProfile {
  nameNepali: string;
  nameEnglish: string;
  roleNepali: string;
  roleEnglish: string;
  photoUrl: string;
  experienceBadge: string;
  assessorBadge: string;
  phone: string;
  email: string;
  headingNepali: string;
  paragraphsNepali: string[];
  mottoNepali: string;
  signatureNameNepali: string;
  signatureTitleNepali: string;
  domains?: {
    icon: string;
    titleNepali: string;
    descriptionNepali: string;
  }[];
}

export interface DownloadableTelecomNote {
  id: string;
  titleNepali: string;
  titleEnglish: string;
  category: 'level1' | 'level2' | 'optical-fiber' | 'osp-telecom' | 'electrician' | 'exam' | 'manual' | 'other';
  fileType: 'pdf' | 'jpg' | 'png';
  fileName: string;
  fileSize?: string;
  fileUrl: string; // Base64 data URL or external URL
  uploadedAt: string;
  descriptionNepali?: string;
  descriptionEnglish?: string;
  downloadsCount?: number;
  featured?: boolean;
  allowDownload?: boolean; // Controls whether download is allowed (true) or view-only (false)
}
