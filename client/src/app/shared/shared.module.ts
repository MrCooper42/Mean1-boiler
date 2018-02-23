import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { AuthenticationModule } from './services/authentication/authentication.module';
import { FooterComponent } from './templates/footer/footer.component';
import { AuthenticationService } from './services/authentication/authentication.service';
import { AuthGuardService } from './services/authentication/auth-guard.service';
import { NavbarComponent } from './templates/navbar/navbar.component';
import { DropdownDirective } from './directives/dropdown.directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    SharedRoutingModule,
    AuthenticationModule,
    NgbModule
  ],
  declarations: [
    NavbarComponent,
    FooterComponent,
    DropdownDirective
  ],
  providers: [
    AuthenticationService,
    AuthGuardService
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    DropdownDirective
  ]
})
export class SharedModule {
}
