import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuardService } from './shared/services/authentication/auth-guard.service';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [ AuthGuardService ] },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      { enableTracing: true }
    )
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
}

export const routingComponents = [
  HomeComponent,
  PageNotFoundComponent,
  LoginComponent,
  RegisterComponent,
  ProfileComponent,
  AboutComponent
];
