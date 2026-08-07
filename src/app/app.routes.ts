import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Portfolio } from './portfolio/portfolio';
import { Services } from './services/services';
import { Contact } from './contact/contact';
import { About } from './about/about';
import { Admin } from './admin/admin';
import { MarketingCenter } from './marketing-center/marketing-center';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'portfolio', component: Portfolio },
  { path: 'services', component: Services },
  { path: 'contact', component: Contact },
  { path: 'about', component: About },
  { path: 'admin', component: Admin },
  { path: 'marketing-center', component: MarketingCenter },
  { path: '**', redirectTo: '' }
];
