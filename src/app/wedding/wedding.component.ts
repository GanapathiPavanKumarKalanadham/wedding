import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription, interval } from 'rxjs';
import { WeddingData, WeddingEvent } from '../models/wedding-data.model';
import { WeddingDataService } from '../services/wedding-data.service';

export interface JourneyStep {
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
  enDescription?: string;
  note?: string;
}

const trans = {
  te: {
    wd: 'వివాహ ఆహ్వానం',
    weds: 'వివాహం',
    ev: 'శుభ కార్యక్రమాలు',
    gl: 'చిత్రమాలిక',
    fm: 'భవదీయులు & ఆగమనాభిలాషులు',
    vn: 'కళ్యాణ వేదిక & శుభలేఖలు',
    d: 'రోజులు',
    h: 'గంటలు',
    m: 'నిమిషాలు',
    s: 'సెకన్లు',
    mp: 'మ్యాప్ చూడండి',
    msg: 'మా ఇంట జరిగే శుభకార్యానికి మీరు కుటుంబ సమేతంగా విచ్చేసి వధూవరులను ఆశీర్వదించగలరు.',
    invite: 'వివాహ ఆహ్వానం',
    close: 'ఆశీర్వాదములతో',
    stepsTitle: 'ఏడడుగులు — శుభ కార్యక్రమాల ప్రయాణం',
    stepsSub: 'పూల రంగవల్లులు మరియు దీపాల నడుమ పవిత్రమైన ఏడడుగుల నడక. స్క్రోల్ చేస్తూ ప్రతి శుభ ఘట్టాన్ని దర్శించండి.',
    stepLabel: 'అడుగు',
    activeStepLabel: 'ప్రస్తుత శుభ ఘట్టం',
    completedStepLabel: 'దర్శించిన శుభకార్యం',
    viewMapLabel: 'Google Maps లో లొకేషన్ చూడండి',
    bride: 'వధువు (చి॥ల॥సౌ॥)',
    groom: 'వరుడు (చి॥)',
    groomRole: 'వరుడు',
    brideRole: 'వధువు',
    welcomeOpen: 'వివాహ పత్రికను తెరవడానికి తాకండి (Tap to Open Invitation)',
    welcomeKicker: 'శ్రీరస్తు • శుభమస్తు • అవిఘ్నమస్తు',
    welcomeSubtitle: 'వివాహ ఆహ్వాన శుభపత్రిక',
    welcomeCoupleNames: 'పవన్ కుమార్ & దివ్య',
    welcomeInvitationNote: 'సీతారాముల దివ్య ఆశీస్సులతో వివాహ ఆహ్వానం',
    welcomeClickHint: 'వివాహ శుభలేఖ తెరవబడుతోంది...',
    cardSelectGroom: 'వరుని శుభలేఖ (Groom Card)',
    cardSelectBride: 'వధువు శుభలేఖ (Bride Card)',
    countdownTitle: '✨ కళ్యాణ మహోత్సవ సుముహూర్తానికి సమయం ✨',
    muhurthamLabel: 'సుముహూర్తము',
    muhurthamTimeText: 'రాత్రి 09:37 ని॥లకు (సుముహూర్తం)',
    venueMapBtn: '📍 కళ్యాణ వేదిక లొకేషన్ (Marriage Venue Map)',
    videoTitle: 'వధూవరుల పరిచయ వేడుక వీడియో (Couple Special Moments)',
    videoSub: 'మధుర స్మృతులు',
    galleryTitle: 'వధూవరుల అందమైన చిత్రమాలిక (Photo Gallery)',
    gallerySub: 'స్నేహం • ప్రేమ • పరిణయం',
    officialCardsTitle: 'కళ్యాణ వేదిక & శుభలేఖలు (Official Wedding Cards)',
    langLabel: 'English',
    currentLangCode: 'te'
  },
  en: {
    wd: 'Wedding Invitation',
    weds: 'weds',
    ev: 'Auspicious Ceremonies',
    gl: 'Photo Gallery',
    fm: 'With Best Compliments & Blessings',
    vn: 'Wedding Venue & Cards',
    d: 'Days',
    h: 'Hours',
    m: 'Mins',
    s: 'Secs',
    mp: 'View Map',
    msg: 'We cordially invite you and your family to grace the auspicious wedding ceremony and bless the couple.',
    invite: 'Wedding Invitation',
    close: 'With warm regards & blessings',
    stepsTitle: 'The Seven Sacred Steps — Wedding Journey',
    stepsSub: 'The holy journey of seven steps amidst flower rangoli and sacred lamps. Scroll to explore each ceremony.',
    stepLabel: 'Step',
    activeStepLabel: 'Active Ceremony',
    completedStepLabel: 'Completed',
    viewMapLabel: 'View Location in Google Maps',
    bride: 'Bride',
    groom: 'Groom',
    groomRole: 'Groom',
    brideRole: 'Bride',
    welcomeOpen: 'Tap to Open Sacred Wedding Invitation',
    welcomeKicker: 'Sri Rastu • Subhamastu • Avighnamastu',
    welcomeSubtitle: 'Wedding Invitation Card',
    welcomeCoupleNames: 'Pavan Kumar & Divya',
    welcomeInvitationNote: 'With the divine blessings of Sri Sita Rama Kalyanam',
    welcomeClickHint: 'Opening wedding card invitation...',
    cardSelectGroom: "Groom's Invitation Card",
    cardSelectBride: "Bride's Invitation Card",
    countdownTitle: '✨ Countdown to Auspicious Muhurtham ✨',
    muhurthamLabel: 'Muhurtham',
    muhurthamTimeText: 'Night at 09:37 PM (Muhurtham)',
    venueMapBtn: '📍 Wedding Venue Location Map',
    videoTitle: 'Couple Special Moments & Journey Video',
    videoSub: 'Cherished Memories',
    galleryTitle: 'Couple Photo Gallery',
    gallerySub: 'Love • Togetherness • Celebration',
    officialCardsTitle: 'Wedding Venue & Official Subhalekha Cards',
    langLabel: 'తెలుగు',
    currentLangCode: 'en'
  }
};

const EN_EVENT_DESCRIPTIONS: Record<string, { name: string; desc: string; time: string; venue?: string }> = {
  'Ganesh Biyam': {
    name: 'Ganesh Biyam (Vighneshwara Pooja)',
    desc: 'Sacred Ganesh Biyam pooja seeking the blessings of Lord Vighneshwara for obstacle-free, smooth wedding celebrations.',
    time: 'Morning 09:00 AM'
  },
  'Pelli Kuturu & Pelli Koduku': {
    name: 'Pelli Koduku & Pelli Kooturu Ceremony',
    desc: 'Auspicious ritual of applying turmeric (pasupu) and ceremonial oil bath dressing the groom and bride traditionally.',
    time: 'Morning 10:00 AM'
  },
  'Haldi Function': {
    name: 'Haldi Celebration',
    desc: 'Vibrant turmeric celebration filled with music, dance, joyous moments with cousins and family members.',
    time: 'Morning 04:30 PM'
  },
  'Sangeeth': {
    name: 'Sangeeth & Musical Evening',
    desc: 'Friday evening 05:00 PM onwards filled with vibrant music, celebratory dances, and joyous family performances.',
    time: 'Evening 05:00 PM'
  },
  'Vindhu (Wedding Dinner)': {
    name: 'Vindhu (Traditional Wedding Dinner)',
    desc: 'Grand traditional Telugu wedding dinner hosted for all beloved relatives and friends at the marriage venue.',
    time: 'Friday Night from 07:00 PM',
    venue: 'Sri Uma Rama Lingeshwara Function Hall, Jampeta Gandhi Bomma Street, Rajahmundry'
  },
  'Subha Muhurtham (Marriage)': {
    name: 'Subha Muhurtham (Kalyana Mahotsavam)',
    desc: 'Sacred Jeelakarra Bellam and Mangalya Dharana tying the knot of eternal togetherness at the auspicious Dhanus lagna.',
    time: 'Friday Night at 09:37 PM (Subha Muhurtham)',
    venue: 'Sri Uma Rama Lingeshwara Function Hall, Jampeta Gandhi Bomma Street, Rajahmundry'
  },
  'Reception': {
    name: 'Grand Reception Celebration',
    desc: 'Grand get-together and fellowship to felicitate, bless and celebrate with the newly-wed couple.',
    time: 'Date to be announced'
  }
};

@Component({
  selector: 'app-wedding',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wedding.component.html',
  styleUrl: './wedding.component.scss'
})
export class WeddingComponent implements OnInit, OnDestroy {
  data!: WeddingData;
  text = trans.te;
  currentLang: 'te' | 'en' = 'te';

  nextEvent: (WeddingEvent & { stamp: number }) | null = null;
  countdown = { days: '00', hours: '00', minutes: '00', seconds: '00' };
  activeStep = 0;
  walkedSteps = 1;
  journeySteps: JourneyStep[] = [];

  // Welcome card gatekeeper with Sita-Ram animated book unfold
  isWelcomeCardOpened = false;
  isOpeningCardAnimation = false;

  // Invitation Modal
  showInvitationModal = false;
  selectedCardType: 'groom' | 'bride' = 'groom';

  videoUrl: SafeResourceUrl;
  autoPlayVideo = false;

  @ViewChild('videoSection') videoSectionRef?: ElementRef;

  private timerSub?: Subscription;

  constructor(
    private weddingDataService: WeddingDataService,
    private sanitizer: DomSanitizer
  ) {
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.youtube.com/embed/XRk7sBvrKIs?enablejsapi=1&rel=0&modestbranding=1'
    );
  }

  ngOnInit(): void {
    this.data = this.weddingDataService.getData();
    // Default to groom-first and Telugu
    this.currentLang = 'te';
    this.text = trans[this.currentLang];
    this.selectedCardType = 'groom';
    this.syncJourneySteps();
    this.updateCountdown();
    this.timerSub = interval(1000).subscribe(() => this.updateCountdown());
  }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
  }

  toggleLanguage(): void {
    this.currentLang = this.currentLang === 'te' ? 'en' : 'te';
    this.text = trans[this.currentLang];
    this.syncJourneySteps();
    this.updateCountdown();
  }

  openWelcomeCard(): void {
    if (this.isOpeningCardAnimation) return;
    this.isOpeningCardAnimation = true;
    setTimeout(() => {
      this.isWelcomeCardOpened = true;
      this.isOpeningCardAnimation = false;
    }, 1100);
  }

  toggleInvitationModal(show: boolean, type: 'groom' | 'bride' = 'groom'): void {
    this.showInvitationModal = show;
    this.selectedCardType = type;
  }

  switchCardTab(type: 'groom' | 'bride'): void {
    this.selectedCardType = type;
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    this.checkVideoInView();
    this.updateVerticalScrollJourney();
  }

  private checkVideoInView(): void {
    if (this.autoPlayVideo || !this.videoSectionRef) return;
    const rect = this.videoSectionRef.nativeElement.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top <= windowHeight * 0.75 && rect.bottom >= windowHeight * 0.25) {
      this.autoPlayVideo = true;
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://www.youtube.com/embed/XRk7sBvrKIs?autoplay=1&mute=1&enablejsapi=1&rel=0&modestbranding=1'
      );
    }
  }

  private updateVerticalScrollJourney(): void {
    const stageElements = document.querySelectorAll('.snake-stage-node');
    if (!stageElements || stageElements.length === 0) return;

    const windowCenter = window.innerHeight * 0.48;
    let closestIndex = 0;
    let minDistance = Infinity;

    stageElements.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height * 0.3 - windowCenter);
      if (rect.top <= windowCenter + 150 && distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== this.activeStep) {
      this.activeStep = closestIndex;
      this.walkedSteps = closestIndex + 1;
    }
  }

  formatDate(date: string, time: string): string {
    if (!date) return this.currentLang === 'te' ? 'తేదీ త్వరలో' : 'Date to be announced';
    const parsed = new Date(`${date}${time ? `T${time}` : ''}`);
    if (Number.isNaN(parsed.getTime())) return date;
    return parsed.toLocaleString(this.currentLang === 'te' ? 'te-IN' : 'en-IN', {
      dateStyle: 'full',
      timeStyle: time ? 'short' : undefined
    });
  }

  getEventName(step: JourneyStep): string {
    if (this.currentLang === 'en') {
      return EN_EVENT_DESCRIPTIONS[step.name]?.name || step.name;
    }
    return step.teluguName || step.name;
  }

  getEventSubName(step: JourneyStep): string {
    if (this.currentLang === 'en') {
      return step.teluguName || '';
    }
    return step.name;
  }

  getEventDescription(step: JourneyStep): string {
    if (this.currentLang === 'en') {
      return EN_EVENT_DESCRIPTIONS[step.name]?.desc || step.description || '';
    }
    return step.description || '';
  }

  getEventTime(step: JourneyStep): string {
    if (this.currentLang === 'en') {
      return EN_EVENT_DESCRIPTIONS[step.name]?.time || step.time;
    }
    if (step.time === '21:37') return 'రాత్రి 09:37 ని॥లకు (సుముహూర్తం)';
    if (step.time === '17:00') return 'సాయంత్రం 05:00 PMకి';
    if (step.time === '19:00') return 'రాత్రి 07:00 PM నుండి';
    if (step.time === '10:00') return 'ఉదయం 10:00 AM';
    if (step.time === '09:00') return 'ఉదయం 09:00 AM';
    return step.time;
  }

  syncJourneySteps(): void {
    if (this.data?.events && this.data.events.length > 0) {
      this.journeySteps = this.data.events.map(event => ({
        name: event.name,
        teluguName: event.teluguName,
        subTitle: event.subTitle,
        date: event.date,
        time: event.time,
        venue: event.venue,
        teluguVenue: event.teluguVenue,
        mapUrl: event.mapUrl,
        icon: event.icon || '🌸',
        description: event.description,
        enDescription: EN_EVENT_DESCRIPTIONS[event.name]?.desc,
        note: event.description || event.subTitle || 'శుభకార్య వేడుక'
      }));
    } else {
      this.journeySteps = [];
    }

    if (this.activeStep >= this.journeySteps.length) {
      this.activeStep = 0;
    }
  }

  selectJourneyStep(index: number): void {
    this.activeStep = index;
    this.walkedSteps = Math.max(this.walkedSteps, index + 1);
  }

  updateCountdown(): void {
    const upcoming = this.data.events
      .filter(event => !!event.date)
      .map(event => ({
        ...event,
        stamp: new Date(`${event.date}T${event.time || '00:00'}`).getTime()
      }))
      .sort((a, b) => a.stamp - b.stamp);

    const marriageEvent = upcoming.find(e =>
      e.name.toLowerCase().includes('muhurtham') ||
      e.name.toLowerCase().includes('marriage')
    );
    this.nextEvent = marriageEvent ?? upcoming[0] ?? null;

    if (!this.nextEvent) {
      this.countdown = { days: '00', hours: '00', minutes: '00', seconds: '00' };
      return;
    }

    const diff = Math.max(0, this.nextEvent.stamp - Date.now());
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    this.countdown = {
      days: String(days).padStart(2, '0'),
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0')
    };
  }

  getThemeStyles(): Record<string, string> {
    return {
      '--site-primary': '#85122d',
      '--site-secondary': '#d4a024',
      '--site-surface': '#fffbf2',
      '--site-text': '#3a101b',
      '--site-decor': '#fdf5df'
    };
  }
}
