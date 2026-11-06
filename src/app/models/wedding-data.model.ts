export type WeddingTheme = 'lak' | 'sita' | 'venk' | 'anna';
export type WeddingLanguage = 'te' | 'en' | 'hi' | 'ta' | 'kn' | 'ml';

export interface WeddingEvent {
  name: string;
  teluguName?: string;
  subTitle?: string;
  date: string;
  time: string;
  venue: string;
  teluguVenue?: string;
  mapUrl?: string;
  icon?: string;
  description?: string;
}

export interface WeddingData {
  theme: WeddingTheme;
  language: WeddingLanguage;
  bride: string;
  groom: string;
  brideTelugu: string;
  groomTelugu: string;
  brideQualification: string;
  groomQualification: string;
  brideFather: string;
  brideMother: string;
  groomFather: string;
  groomMother: string;
  brideGrandParents: string;
  groomGrandParents: string;
  brideFamily: string;
  groomFamily: string;
  venue: string;
  venueTelugu: string;
  dinnerVenueTelugu: string;
  dinnerTimeTelugu: string;
  muhurthamTimeTelugu: string;
  tithiNakshatramTelugu: string;
  mapUrl: string;
  message: string;
  coverImage: string;
  brideImage: string;
  groomImage: string;
  invitationCardImage: string;
  groomInvitationCardImage?: string;
  driveLink: string;
  events: WeddingEvent[];
  gallery: string[];
  contacts?: { label: string; name: string; phone?: string }[];
  wellWishers?: string[];
  lovingBrotherNote?: string;
}
