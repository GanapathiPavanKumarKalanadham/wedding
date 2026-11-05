import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { WeddingData, WeddingEvent, WeddingTheme } from '../models/wedding-data.model';
import { WeddingDataService } from '../services/wedding-data.service';

const themeOptions: Array<{ key: WeddingTheme; display: string; icon: string; sacred: string }> = [
  { key: 'lak', display: 'Lakshmi Narayana', icon: '🪷', sacred: 'శ్రీ లక్ష్మీనారాయణాయ నమః' },
  { key: 'sita', display: 'Sita Rama', icon: '🏹', sacred: 'శ్రీ సీతారామచంద్రాయ నమః' },
  { key: 'venk', display: 'Venkateswara', icon: '🪔', sacred: 'ఓం నమో వేంకటేశాయ' },
  { key: 'anna', display: 'Annavaram Satyanarayana', icon: '🕉', sacred: 'శ్రీ సత్యనారాయణ స్వామియే నమః' }
];

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  data!: WeddingData;
  themeOptions = themeOptions;

  constructor(
    private weddingDataService: WeddingDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.data = this.weddingDataService.getData();
  }

  updateField<K extends keyof WeddingData>(key: K, value: WeddingData[K]): void {
    this.weddingDataService.updateField(key, value);
    this.data = this.weddingDataService.getData();
  }

  updateEvent(index: number, field: keyof WeddingEvent, value: string): void {
    const event = { ...this.data.events[index] };
    event[field] = value;
    this.weddingDataService.updateEvent(index, event);
    this.data = this.weddingDataService.getData();
  }

  addEvent(): void {
    this.weddingDataService.addEvent();
    this.data = this.weddingDataService.getData();
  }

  removeEvent(index: number): void {
    this.weddingDataService.removeEvent(index);
    this.data = this.weddingDataService.getData();
  }

  handlePhotoUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) return;

    this.weddingDataService.addGalleryFiles(files).then(() => {
      this.data = this.weddingDataService.getData();
      input.value = '';
    });
  }

  removePhoto(index: number): void {
    this.weddingDataService.removeGalleryImage(index);
    this.data = this.weddingDataService.getData();
  }

  previewWebsite(): void {
    this.router.navigate(['/wedding']);
  }

  setTheme(themeKey: WeddingTheme): void {
    this.weddingDataService.setTheme(themeKey);
    this.data = this.weddingDataService.getData();
  }

  setLanguage(language: string): void {
    this.updateField('language', language as any);
  }
}
