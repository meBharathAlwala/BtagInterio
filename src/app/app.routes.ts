import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Portfolio } from './portfolio/portfolio';
import { Services } from './services/services';
import { Contact } from './contact/contact';
import { About } from './about/about';
import { AdminLogin } from './admin/admin-login/admin-login';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { adminGuard } from './admin/admin.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'portfolio', component: Portfolio },
  { path: 'services', component: Services },
  { path: 'contact', component: Contact },
  { path: 'about', component: About },
  { path: 'admin/login', component: AdminLogin },
  { path: 'admin', component: AdminDashboard, canActivate: [adminGuard] },
  { path: '**', redirectTo: '' }
];
