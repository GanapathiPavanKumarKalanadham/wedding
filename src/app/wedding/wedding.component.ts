import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription, interval } from 'rxjs';
import { WeddingData, WeddingEvent } from '../models/wedding-data.model';
import { WeddingDataService } from '../services/wedding-data.service';

const trans = {
  te: { wd: 'వివాహ ఆహ్వానం', weds: 'వివాహం', ev: 'శుభ కార్యక్రమాలు', gl: 'ఫోటోలు', fm: 'ఆశీస్సులతో', vn: 'వేదిక', d: 'రోజులు', h: 'గంటలు', m: 'నిమిషాలు', s: 'ఫోటోలు చూడండి', mp: 'మ్యాప్ చూడండి', no: 'ఫోటో డ్రైవ్ లింక్ త్వరలో జోడించబడుతుంది', msg: 'మా ఇంట జరిగే శుభకార్యానికి మీరు కుటుంబ సమేతంగా విచ్చేసి వధూవరులను ఆశీర్వదించగలరు.', invite: 'కుటుంబ సమేతంగా రావలసిన ప్రత్యేక సందర్భం', close: 'ఆశీర్వాదములతో', together: 'కుటుంబాలతో కలిసి', celebrate: 'వివాహ వేడుకకు ఆహ్వానం', stepsSub: 'ప్రతి అడుగు ఒక శుభ కార్యక్రమం — క్రిస్-క్రాస్ నడక', walk: 'తదుపరి అడుగు', restart: 'మళ్లీ నడవండి', bride: 'వధువు', groom: 'వరుడు', openDrive: 'వెడ్డింగ్ ఫోటో డ్రైవ్ తెరవండి' },
  en: { wd: 'Wedding Invitation', weds: 'weds', ev: 'Wedding Events', gl: 'Photo Gallery', fm: 'With the blessings of', vn: 'Venue', d: 'Days', h: 'Hours', m: 'Mins', s: 'View gallery', mp: 'Open map', no: 'Photo drive link will be added soon', msg: 'We joyfully invite you and your family to bless the couple on their auspicious wedding day.', invite: 'A sacred celebration of love and togetherness', close: 'With blessings and love', together: 'Together with their families', celebrate: 'Invite you to celebrate their wedding', stepsSub: 'Each footprint is a sacred event — walked criss-cross, one after another', walk: 'Take next step', restart: 'Walk again', bride: 'Bride', groom: 'Groom', openDrive: 'Open Wedding Photo Drive' },
  hi: { wd: 'विवाह निमंत्रण', weds: 'परिणय', ev: 'शुभ कार्यक्रम', gl: 'फ़ोटो गैलरी', fm: 'आशीर्वाद सहित', vn: 'स्थान', d: 'दिन', h: 'घंटे', m: 'मिनट', s: 'गैलरी देखें', mp: 'मैप देखें', no: 'फ़ोटो ड्राइव लिंक जल्द जोड़ा जाएगा', msg: 'आप सपरिवार पधारकर वर-वधू को आशीर्वाद दें, यही हमारी विनम्र प्रार्थना है।', invite: 'प्रेम और परंपरा का पवित्र मिलन', close: 'आशीर्वाद और स्नेह के साथ', together: 'अपने परिवारों के साथ', celebrate: 'अपने विवाह उत्सव में आमंत्रित करते हैं', stepsSub: 'हर कदम एक शुभ कार्यक्रम — क्रिस-क्रॉस चाल', walk: 'अगला कदम', restart: 'फिर से चलें', bride: 'वधू', groom: 'वर', openDrive: 'वेडिंग फ़ोटो ड्राइव खोलें' },
  ta: { wd: 'திருமண அழைப்பிதழ்', weds: 'மணமக்கள்', ev: 'சுப நிகழ்வுகள்', gl: 'புகைப்படங்கள்', fm: 'ஆசீர்வாதத்துடன்', vn: 'இடம்', d: 'நாட்கள்', h: 'மணி', m: 'நிமிடம்', s: 'கேலரி', mp: 'வரைபடம்', no: 'புகைப்பட டிரைவ் இணைப்பு விரைவில்', msg: 'தாங்கள் குடும்பத்துடன் வருகை தந்து மணமக்களை ஆசீர்வதிக்க அன்புடன் அழைக்கிறோம்.', invite: 'அன்பும் ஒற்றுமையும் நிறைந்த புனித கொண்டாட்டம்', close: 'ஆசீர்வாதங்களுடன்', together: 'குடும்பங்களுடன் இணைந்து', celebrate: 'திருமண விழாவிற்கு அழைக்கிறோம்', stepsSub: 'ஒவ்வொரு அடியும் ஒரு சுப நிகழ்வு', walk: 'அடுத்த அடி', restart: 'மீண்டும் நடக்க', bride: 'மணமகள்', groom: 'மணமகன்', openDrive: 'திருமண புகைப்பட டிரைவ்' },
  kn: { wd: 'ವಿವಾಹ ಆಮಂತ್ರಣ', weds: 'ವಿವಾಹ', ev: 'ಶುಭ ಕಾರ್ಯಕ್ರಮಗಳು', gl: 'ಫೋಟೋ ಗ್ಯಾಲರಿ', fm: 'ಆಶೀರ್ವಾದದೊಂದಿಗೆ', vn: 'ಸ್ಥಳ', d: 'ದಿನಗಳು', h: 'ಗಂಟೆಗಳು', m: 'ನಿಮಿಷ', s: 'ಗ್ಯಾಲರಿಯನ್ನು ನೋಡಿ', mp: 'ನಕ್ಷೆ ನೋಡಿ', no: 'ಫೋಟೋ ಡ್ರೈವ್ ಲಿಂಕ್ ಶೀಘ್ರದಲ್ಲೇ', msg: 'ತಾವು ಕುಟುಂಬ ಸಮೇತರಾಗಿ ಬಂದು ವಧೂವರರನ್ನು ಆಶೀರ್ವದಿಸಬೇಕೆಂದು ಕೋರಿಕೊಳ್ಳುತ್ತೇವೆ.', invite: 'ಪ್ರೇಮ ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕತೆಯ ಪವಿತ್ರ ಸಂಭ್ರಮ', close: 'ಆಶೀರ್ವಾದದೊಂದಿಗೆ', together: 'ಕುಟುಂಬಗಳೊಂದಿಗೆ', celebrate: 'ವಿವಾಹಕ್ಕೆ ಆಹ್ವಾನಿಸುತ್ತೇವೆ', stepsSub: 'ಪ್ರತಿ ಹೆಜ್ಜೆಯೂ ಒಂದು ಶುಭ ಕಾರ್ಯಕ್ರಮ', walk: 'ಮುಂದಿನ ಹೆಜ್ಜೆ', restart: 'ಮತ್ತೆ ನಡೆಯಿರಿ', bride: 'ವಧು', groom: 'ವರ', openDrive: 'ವೆಡ್ಡಿಂಗ್ ಫೋಟೋ ಡ್ರೈವ್' },
  ml: { wd: 'വിവാഹ ക്ഷണം', weds: 'വിവാഹം', ev: 'ശുഭചടങ്ങുകൾ', gl: 'ഫോട്ടോ ഗാലറി', fm: 'അനുഗ്രഹത്തോടെ', vn: 'വേദി', d: 'ദിവസം', h: 'മണിക്കൂർ', m: 'മിനിറ്റ്', s: 'ഗാലറി', mp: 'മാപ്പ്', no: 'ഫോട്ടോ ഡ്രൈവ് ലിങ്ക് ഉടൻ', msg: 'കുടുംബസമേതം എത്തി വധൂവരന്മാരെ അനുഗ്രഹിക്കണമെന്ന് സ്നേഹപൂർവ്വം ക്ഷണിക്കുന്നു.', invite: 'സ്നേഹവും ചേര്ച്ചയും നിറഞ്ഞ ഒരു പവിത്ര ആഘോഷം', close: 'അനുഗ്രഹത്തോടെ', together: 'കുടുംബങ്ങളോടൊപ്പം', celebrate: 'വിവാഹത്തിലേക്ക് ക്ഷണിക്കുന്നു', stepsSub: 'ഓരോ ചുവടും ഒരു ശുഭചടങ്ങ്', walk: 'അടുത്ത ചുവട്', restart: 'വീണ്ടും നടക്കൂ', bride: 'വധു', groom: 'വരൻ', openDrive: 'വെഡ്ഡിംഗ് ഫോട്ടോ ഡ്രൈവ്' }
};

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
  note?: string;
}

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
  nextEvent: (WeddingEvent & { stamp: number }) | null = null;
  countdown = { days: '00', hours: '00', minutes: '00', seconds: '00' };
  activeStep = 0;
  walkedSteps = 1;
  isWalking = false;
  journeySteps: JourneyStep[] = [];
  activeTab: 'all' | 'muhurtham' | 'rituals' = 'all';
  showInvitationModal = false;
  isAudioPlaying = false;
  videoUrl: SafeResourceUrl;
  autoPlayVideo = false;

  @ViewChild('videoSection') videoSectionRef?: ElementRef;

  private timerSub?: Subscription;
  private walkTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private weddingDataService: WeddingDataService,
    private sanitizer: DomSanitizer
  ) {
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.youtube.com/embed/XRk7sBvrKIs?enablejsapi=1&rel=0&modestbranding=1'
    );
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
    const stageElements = document.querySelectorAll('.vertical-stage-node');
    if (!stageElements || stageElements.length === 0) return;

    const windowCenter = window.innerHeight * 0.5;
    let closestIndex = 0;
    let minDistance = Infinity;

    stageElements.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height * 0.35 - windowCenter);
      if (rect.top <= windowCenter + 120 && distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== this.activeStep) {
      this.activeStep = closestIndex;
      this.walkedSteps = closestIndex + 1;
    }
  }

  ngOnInit(): void {
    this.data = this.weddingDataService.getData();
    this.text = trans[this.data.language] ?? trans.te;
    this.syncJourneySteps();
    this.updateCountdown();
    this.timerSub = interval(1000).subscribe(() => this.updateCountdown());
  }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
    if (this.walkTimer) clearTimeout(this.walkTimer);
  }

  changeLanguage(value: string): void {
    this.weddingDataService.setLanguage(value as any);
    this.data = this.weddingDataService.getData();
    this.text = trans[this.data.language] ?? trans.en;
    this.syncJourneySteps();
    this.updateCountdown();
  }

  getSacredText(): string {
    const sacred = {
      lak: 'శ్రీ లక్ష్మీనారాయణాయ నమః',
      sita: 'శ్రీ సీతారామచంద్రాయ నమః',
      venk: 'ఓం నమో వేంకటేశాయ',
      anna: 'శ్రీ సత్యనారాయణ స్వామియే నమః'
    };
    return sacred[this.data.theme] ?? sacred.lak;
  }

  formatDate(date: string, time: string): string {
    if (!date) return 'Date to be announced';
    const parsed = new Date(`${date}${time ? `T${time}` : ''}`);
    if (Number.isNaN(parsed.getTime())) return date;
    return parsed.toLocaleString(this.data.language + '-IN', { dateStyle: 'full', timeStyle: time ? 'short' : undefined });
  }

  getEventDatePart(part: 'month' | 'day' | 'year'): string {
    if (!this.nextEvent?.date) {
      const fallback = { month: 'AUG', day: '24', year: '2026' };
      return fallback[part];
    }

    const parsed = new Date(`${this.nextEvent.date}T12:00:00`);
    if (Number.isNaN(parsed.getTime())) {
      return part === 'month' ? 'AUG' : part === 'day' ? '24' : '2026';
    }

    const map = {
      month: parsed.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
      day: String(parsed.getDate()).padStart(2, '0'),
      year: String(parsed.getFullYear())
    };

    return map[part];
  }

  getEventTime(): string {
    return this.nextEvent?.time || '7 PM';
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
        icon: event.icon || '🌺',
        description: event.description,
        note: event.description || event.subTitle || 'శుభకార్య వేడుక'
      }));
    } else {
      this.journeySteps = [];
    }

    if (this.activeStep >= this.journeySteps.length) {
      this.activeStep = 0;
    }
  }

  isLeftFoot(index: number): boolean {
    return index % 2 === 0;
  }

  footTop(index: number): string {
    const total = Math.max(1, this.journeySteps.length);
    return `${10 + (index * (80 / total))}%`;
  }

  footLeft(index: number): string {
    return this.isLeftFoot(index) ? '25%' : '65%';
  }

  takeNextStep(): void {
    if (this.isWalking) return;
    const total = this.journeySteps.length;
    if (total === 0) return;

    if (this.walkedSteps >= total) {
      this.walkedSteps = 1;
      this.activeStep = 0;
      return;
    }

    this.isWalking = true;
    this.walkedSteps += 1;
    this.activeStep = this.walkedSteps - 1;

    if (this.walkTimer) clearTimeout(this.walkTimer);
    this.walkTimer = setTimeout(() => {
      this.isWalking = false;
    }, 700);
  }

  selectJourneyStep(index: number): void {
    this.activeStep = index;
    this.walkedSteps = Math.max(this.walkedSteps, index + 1);
  }

  get currentEvent(): JourneyStep {
    return this.journeySteps[Math.min(this.activeStep, Math.max(0, this.journeySteps.length - 1))] || {
      name: 'కళ్యాణ మహోత్సవం',
      teluguName: 'కళ్యాణ మహోత్సవం',
      date: '2026-11-20',
      time: '21:37',
      venue: 'రాజమండ్రి',
      teluguVenue: 'రాజమండ్రి',
      note: 'శుభ ముహూర్తం'
    };
  }

  toggleInvitationModal(show: boolean): void {
    this.showInvitationModal = show;
  }

  onImageUpload(event: Event, type: 'bride' | 'groom'): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (type === 'bride') {
        this.weddingDataService.updateField('brideImage', result);
      } else {
        this.weddingDataService.updateField('groomImage', result);
      }
      this.data = this.weddingDataService.getData();
    };
    reader.readAsDataURL(file);
  }

  updateCountdown(): void {
    const upcoming = this.data.events
      .filter(event => !!event.date)
      .map(event => ({
        ...event,
        stamp: new Date(`${event.date}T${event.time || '00:00'}`).getTime()
      }))
      .sort((a, b) => a.stamp - b.stamp);

    // Pick marriage or next upcoming event
    const marriageEvent = upcoming.find(e => e.name.toLowerCase().includes('muhurtham') || e.name.toLowerCase().includes('marriage'));
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
    const themes = {
      lak: { primary: '#7a1029', secondary: '#c9a227', surface: '#fdf8f0', text: '#4a1f28', decor: '#f3e4c4' },
      sita: { primary: '#0b5f42', secondary: '#d8a84d', surface: '#f5fef7', text: '#123b2e', decor: '#d7f4dd' },
      venk: { primary: '#1a366f', secondary: '#e6b436', surface: '#fefaf0', text: '#1d2d52', decor: '#e8eefc' },
      anna: { primary: '#bf5007', secondary: '#c98b22', surface: '#fff4eb', text: '#5b2a1f', decor: '#f9dec8' }
    };

    const selected = themes[this.data.theme] ?? themes.lak;
    return {
      '--site-primary': selected.primary,
      '--site-secondary': selected.secondary,
      '--site-surface': selected.surface,
      '--site-text': selected.text,
      '--site-decor': selected.decor
    };
  }
}
