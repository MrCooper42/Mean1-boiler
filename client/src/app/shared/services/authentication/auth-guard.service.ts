import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class AuthGuardService implements CanActivate {

  canActivate = () => {
    if (!this.auth.isLoggedIn()) {
      this.router.navigateByUrl('/');
      return false;
    }
    return true;
  }

  constructor(private auth: AuthenticationService, private router: Router) {
  }
}
