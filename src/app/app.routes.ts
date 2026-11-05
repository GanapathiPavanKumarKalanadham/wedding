import { Routes } from '@angular/router';
import { WeddingComponent } from './wedding/wedding.component';

export const routes: Routes = [
  { path: '', component: WeddingComponent },
  { path: '**', redirectTo: '' }
];
