export type WeddingTheme = 'lak' | 'sita' | 'venk' | 'anna';
export type WeddingLanguage = 'te' | 'en' | 'hi' | 'ta' | 'kn' | 'ml';

export interface WeddingEvent {
  name: string;
  date: string;
  time: string;
  venue: string;
}

export interface WeddingData {
  theme: WeddingTheme;
  language: WeddingLanguage;
  bride: string;
  groom: string;
  brideFamily: string;
  groomFamily: string;
  venue: string;
  mapUrl: string;
  message: string;
  coverImage: string;
  brideImage: string;
  groomImage: string;
  driveLink: string;
  events: WeddingEvent[];
  gallery: string[];
}
