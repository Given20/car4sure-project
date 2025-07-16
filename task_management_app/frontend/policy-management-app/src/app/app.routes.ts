import { Routes } from '@angular/router';
import { PolicyListComponent } from './policy-list/policy-list';
import { PolicyFormComponent } from './policy-form/policy-form';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { AuthGuard } from './auth-guard';

// Define application routes
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', component: PolicyListComponent },
  { path: 'policy/new', component: PolicyFormComponent, canActivate: [AuthGuard] },
  { path: 'policy/edit/:id', component: PolicyFormComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];
