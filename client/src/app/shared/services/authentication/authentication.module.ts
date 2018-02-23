import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationService } from './authentication.service';
import { AuthGuardService } from './auth-guard.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [
    AuthenticationService,
    AuthGuardService
  ],

})
export class AuthenticationModule {
}
