import { Injectable } from '@angular/core';
import { WeddingData, WeddingEvent, WeddingLanguage, WeddingTheme } from '../models/wedding-data.model';

const STORAGE_KEY = 'vivaha-vedika-angular-data-v8';

const DEFAULT_DATA: WeddingData = {
  theme: 'lak',
  language: 'te',
  bride: 'Divya',
  groom: 'Pavan Kumar',
  brideTelugu: 'దివ్య',
  groomTelugu: 'పవన్ కుమార్',
  brideQualification: 'B.Ed',
  groomQualification: 'Software Engineer',
  brideFather: 'శ్రీ మొండి గంగాధర్',
  brideMother: 'శ్రీమతి దుర్గాభవాని',
  groomFather: 'శ్రీ ఆదిరెడ్డి నరసింహం',
  groomMother: 'శ్రీమతి వెంకట గౌరి పార్వతి',
  brideGrandParents: 'శ్రీ మొండి నాగరాజు, శ్రీమతి అమ్మాజీ గార్ల దివ్య ఆశీస్సులతో...',
  groomGrandParents: 'కీ॥శే॥ శ్రీ ఆదిరెడ్డి భోగేశ్వరరావు, శ్రీమతి పాపమ్మ గార్ల దివ్య ఆశీస్సులతో...',
  brideFamily: 'శ్రీ మొండి గంగాధర్, శ్రీమతి దుర్గాభవాని దంపతులు (ఏకైక కుమార్తె)',
  groomFamily: 'శ్రీ ఆదిరెడ్డి నరసింహం, శ్రీమతి వెంకట గౌరి పార్వతి దంపతులు (ఏకైక కుమారుడు) - హుకుంపేట, రాజమండ్రి రూరల్',
  venue: 'Sri Uma Rama Lingeshwara Function Hall, Gandhi Bomma Veedhi, Jampeta, Rajahmundry',
  venueTelugu: 'శ్రీ ఉమా రామ లింగేశ్వర ఫంక్షన్ హాల్, జాం పేట గాంధీ బొమ్మ వీధి, రాజమండ్రి',
  dinnerVenueTelugu: 'శ్రీ ఉమా రామ లింగేశ్వర ఫంక్షన్ హాల్, కళ్యాణ వేదిక నందు',
  dinnerTimeTelugu: 'ది. 20-11-2026 శుక్రవారం రాత్రి 7:00 గంటల నుండి',
  muhurthamTimeTelugu: 'ది. 20-11-2026 శుక్రవారం రాత్రి 09:37 నిమిషాలకు',
  tithiNakshatramTelugu: 'స్వస్తిశ్రీ చాంద్రమాన శ్రీ పరాభవ నామ సంవత్సర కార్తీక శుద్ధ ఏకాదశి ఉత్తరభద్ర నక్షత్రయుక్త ధనుస్సు లగ్నమునందు',
  mapUrl: 'https://maps.app.goo.gl/qrjV9x88hjcjeF4B7?g_st=ic',
  message: 'పచ్చని పందిరిలో ముత్యాల తలంబ్రాలు - వేదమంత్రాల నడుమ ఒకటవుతున్న మా చిరంజీవులను మీ పవిత్రమైన దీవెనలతో ఆశీర్వదిస్తారని ఆకాంక్షిస్తూ...',
  coverImage: 'assets/wedding/couple-telephone.jpg',
  brideImage: 'assets/wedding/bride-profile-cropped.jpg',
  groomImage: 'assets/wedding/groom-profile-cropped.jpg',
  invitationCardImage: 'assets/wedding/invitation-card.jpg',
  groomInvitationCardImage: 'assets/wedding/groom-invitation-card.jpg',
  driveLink: '',
  contacts: [
    { label: 'భవదీయులు (వధువు)', name: 'శ్రీ మొండి గంగాధర్, శ్రీమతి దుర్గాభవాని' },
    { label: 'భవదీయులు (వరుడు)', name: 'శ్రీ తులసూర్ రఘునాథ్ - శ్రీమతి దుర్గ, శ్రీ తులసూర్ రవి వెంకటకుమార్ - శ్రీమతి తేజస్విని' },
    { label: 'ఆగమనాభిలాషులు', name: 'శ్రీ ఆదిరెడ్డి నరసింహం, శ్రీమతి వెంకట గౌరిపార్వతి' },
    { label: 'బంధుమిత్రుల అభినందనలతో', name: 'శ్రీ ఆదిరెడ్డి రామకృష్ణారావు - శ్రీమతి లక్ష్మి, శ్రీ సింగంపల్లి అప్పారావు - శ్రీమతి అప్పాయమ్మ (లేటు), శ్రీ కొరుపల్లి వెంకటేశ్వరరావు (లేటు) - శ్రీమతి అప్పలనరసమ్మ (లేటు), శ్రీ బండారు దుర్గాప్రసాద్ (లేటు) - శ్రీమతి నరసమాంబ, శ్రీ గులిపల్లి వెంకటేశ్వరరావు (లేటు) - శ్రీమతి వెంకటలక్ష్మి, శ్రీ ఆదిరెడ్డి కమల్ కుమార్ - శ్రీమతి మున్ని, శ్రీ ఆదిరెడ్డి ఉదయ్ కిరణ్ కుమార్ - శ్రీమతి సంధ్య, మొండి బ్రదర్స్, ఆదిరెడ్డి బ్రదర్స్ & సన్స్' }
  ],
  lovingBrotherNote: 'మా బావమరిది పెళ్ళికి మీరంతా తప్పక వస్తారని ఆశిస్తూ... మీ తులసూర్ రవి వెంకట కుమార్, శ్రీమతి తేజస్విని',
  events: [
    {
      name: 'Ganesh Biyam',
      teluguName: 'గణేష్ బియ్యం (విఘ్నేశ్వర పూజ)',
      subTitle: 'Sacred Ganesh Biyam Ritual & Auspicious Blessings',
      date: '2026-11-02',
      time: '09:00',
      venue: '',
      teluguVenue: '',
      mapUrl: '',
      icon: '🕉️',
      description: 'వివాహ కార్యాలు నిర్విఘ్నంగా పరిసమాప్తి చెందాలని విఘ్నేశ్వరుని సన్నిధిలో పవిత్ర గణేష్ బియ్యం పూజ.'
    },
    {
      name: 'Pelli Kuturu & Pelli Koduku',
      teluguName: 'పెళ్లి కూతురు & పెళ్లి కొడుకు వేడుక',
      subTitle: 'Bride & Groom Ceremonies & Traditional Rituals',
      date: '2026-11-19',
      time: '10:00',
      venue: '',
      teluguVenue: '',
      mapUrl: '',
      icon: '🌸',
      description: 'వధూవరులకు మంగళస్నానం, పసుపు పూసి సంప్రదాయ వస్త్రాలంకరణతో జరిగే మంగళప్రదమైన శుభకార్యం.'
    },
    {
      name: 'Haldi Function',
      teluguName: 'హల్దీ సంబరం (పసుపు వేడుక)',
      subTitle: 'Mangala Snanam & Haldi Celebration',
      date: '2026-11-20',
      time: '09:00',
      venue: '',
      teluguVenue: '',
      mapUrl: '',
      icon: '✨',
      description: 'బంధుమిత్రుల ఆనందోత్సాహాలు, సంగీతం, నృత్యాలు, పసుపు తలంబ్రాల సంతోషకరమైన వేడుక.'
    },
    {
      name: 'Sangeeth',
      teluguName: 'సంగీత్ సంబరం',
      subTitle: 'Musical Night, Dances & Joyful Celebration',
      date: '2026-11-20',
      time: '17:00',
      venue: '',
      teluguVenue: '',
      mapUrl: '',
      icon: '🎶',
      description: '20, నవంబర్ 2026, శుక్రవారం సాయంత్రం 5:00 PMకి పాటలు, నృత్యాల సంగీత్ రంగుల వేడుక.'
    },
    {
      name: 'Vindhu (Wedding Dinner)',
      teluguName: 'విందు భోజనం',
      subTitle: 'Sumptuous Traditional Wedding Feast',
      date: '2026-11-20',
      time: '19:00',
      venue: 'Sri Uma Rama Lingeshwara Function Hall, Jampeta Gandhi Bomma Street, Rajahmundry',
      teluguVenue: 'శ్రీ ఉమా రామ లింగేశ్వర ఫంక్షన్ హాల్, జాం పేట గాంధీ బొమ్మ వీధి, రాజమండ్రి',
      mapUrl: 'https://maps.app.goo.gl/qrjV9x88hjcjeF4B7?g_st=ic',
      icon: '🍛',
      description: 'కళ్యాణ వేదిక వద్ద ఘనంగా ఏర్పాటు చేసిన రుచికరమైన తెలుగు సంప్రదాయ విందు ఆరగించి నూతన దంపతులను ఆశీర్వదించండి.'
    },
    {
      name: 'Subha Muhurtham (Marriage)',
      teluguName: 'కళ్యాణ మహోత్సవం (సుముహూర్తం)',
      subTitle: 'Sacred Telugu Wedding Muhurtham',
      date: '2026-11-20',
      time: '21:37',
      venue: 'Sri Uma Rama Lingeshwara Function Hall, Jampeta Gandhi Bomma Street, Rajahmundry',
      teluguVenue: 'శ్రీ ఉమా రామ లింగేశ్వర ఫంక్షన్ హాల్, జాం పేట గాంధీ బొమ్మ వీధి, రాజమండ్రి',
      mapUrl: 'https://maps.app.goo.gl/qrjV9x88hjcjeF4B7?g_st=ic',
      icon: '🪔',
      description: 'కార్తీక శుద్ధ ఏకాదశి ఉత్తరభద్ర నక్షత్రయుక్త ధనుస్సు లగ్నమునందు రాత్రి 09:37 ని॥లకు జీలకర్ర బెల్లం, మాంగల్య ధారణ మహోత్సవం.'
    },
    {
      name: 'Reception',
      teluguName: 'రిసెప్షన్ వేడుక (Grand Reception)',
      subTitle: 'Grand Reception & Fellowship',
      date: '',
      time: '',
      venue: '',
      teluguVenue: '',
      mapUrl: '',
      icon: '💐',
      description: 'నూతన దంపతులను ఆశీర్వదించేందుకు ఆత్మీయ కలయిక మరియు ప్రత్యేక విందు.'
    }
  ],
  gallery: [
    'assets/wedding/couple-telephone.jpg',
    'assets/wedding/couple-traditional.jpg',
    'assets/wedding/gallery-candid-1.jpg',
    'assets/wedding/gallery-candid-2.jpg',
    'assets/wedding/gallery-trad-1.jpg',
    'assets/wedding/gallery-trad-2.jpg',
    'assets/wedding/gallery-trad-hands.jpg',
    'assets/wedding/gallery-bride-trad.jpg',
    'assets/wedding/gallery-ocean.jpg'
  ]
};

@Injectable({ providedIn: 'root' })
export class WeddingDataService {
  private data: WeddingData = this.loadData();

  getData(): WeddingData {
    return this.data;
  }

  save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
  }

  updateField<K extends keyof WeddingData>(key: K, value: WeddingData[K]): void {
    this.data[key] = value;
    this.save();
  }

  setTheme(value: WeddingTheme): void {
    this.data.theme = value;
    this.save();
  }

  setLanguage(value: WeddingLanguage): void {
    this.data.language = value;
    this.save();
  }

  addEvent(): void {
    this.data.events.push({ name: '', date: '', time: '', venue: '' });
    this.save();
  }

  updateEvent(index: number, event: WeddingEvent): void {
    if (!this.data.events[index]) return;
    this.data.events[index] = event;
    this.save();
  }

  removeEvent(index: number): void {
    this.data.events.splice(index, 1);
    this.save();
  }

  async addGalleryFiles(files: FileList | File[]): Promise<void> {
    const fileList = Array.from(files ?? []);
    const images = await Promise.all(fileList.map(file => this.compressImage(file)));
    this.data.gallery.push(...images.filter(Boolean) as string[]);
    this.save();
  }

  removeGalleryImage(index: number): void {
    this.data.gallery.splice(index, 1);
    this.save();
  }

  private loadData(): WeddingData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_DATA, events: [...DEFAULT_DATA.events], gallery: [...DEFAULT_DATA.gallery] };
      const parsed = JSON.parse(raw) as Partial<WeddingData>;
      return {
        ...DEFAULT_DATA,
        ...parsed,
        coverImage: parsed.coverImage || DEFAULT_DATA.coverImage,
        brideImage: parsed.brideImage || DEFAULT_DATA.brideImage,
        groomImage: parsed.groomImage || DEFAULT_DATA.groomImage,
        events: Array.isArray(parsed.events) && parsed.events.length
          ? parsed.events
          : [...DEFAULT_DATA.events],
        gallery: Array.isArray(parsed.gallery) && parsed.gallery.length
          ? parsed.gallery
          : [...DEFAULT_DATA.gallery]
      };
    } catch (error) {
      return { ...DEFAULT_DATA, events: [...DEFAULT_DATA.events], gallery: [...DEFAULT_DATA.gallery] };
    }
  }

  private compressImage(file: File): Promise<string | null> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement('canvas');
          const maxSize = 1200;
          const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
          canvas.width = Math.max(1, Math.round(image.width * scale));
          canvas.height = Math.max(1, Math.round(image.height * scale));
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.75));
        };
        image.onerror = () => resolve(null);
        image.src = String(reader.result);
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  }
}
