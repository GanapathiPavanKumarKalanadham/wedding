import { Injectable } from '@angular/core';
import { WeddingData, WeddingEvent, WeddingLanguage, WeddingTheme } from '../models/wedding-data.model';

const STORAGE_KEY = 'vivaha-vedika-angular-data';

const DEFAULT_DATA: WeddingData = {
  theme: 'lak',
  language: 'te',
  bride: 'Sravani',
  groom: 'Venkata Ramana',
  brideFamily: 'Sri K. Satyanarayana & Smt. Lakshmi',
  groomFamily: 'Sri P. Suryanarayana & Smt. Padmavathi',
  venue: 'Sri Sai Convention Hall, Rajahmundry, East Godavari',
  mapUrl: 'https://maps.google.com/?q=Sri+Sai+Convention+Hall+Rajahmundry',
  message: 'We joyfully invite you and your family to bless the couple on their auspicious wedding day.',
  coverImage: 'assets/wedding/invite-couple.png',
  brideImage: 'assets/wedding/invite-couple.png',
  groomImage: 'assets/wedding/namam-couple.png',
  driveLink: '',
  events: [
    { name: 'Ganesh Pooja', date: '2027-02-09', time: '09:00', venue: 'Home Temple' },
    { name: 'Nandi Puja', date: '2027-02-09', time: '11:00', venue: 'Pooja Mandap' },
    { name: 'Pelli Koduku / Pelli Kuthuru', date: '2027-02-10', time: '18:00', venue: 'Sri Sai Convention Hall' },
    { name: 'Mangalaya Snanam', date: '2027-02-11', time: '06:00', venue: 'Family Home' },
    { name: 'Muhurtham', date: '2027-02-12', time: '07:48', venue: 'Sri Sai Convention Hall' },
    { name: 'Kanyadana', date: '2027-02-12', time: '08:30', venue: 'Wedding Mandap' },
    { name: 'Reception', date: '2027-02-12', time: '19:00', venue: 'Sri Sai Convention Hall' }
  ],
  gallery: []
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
        gallery: []
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
