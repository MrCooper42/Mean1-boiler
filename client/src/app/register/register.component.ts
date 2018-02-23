import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, TokenPayload } from '../shared/services/authentication/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css' ]
})
export class RegisterComponent {

  credentials: TokenPayload = {
    email: '',
    name: '',
    password: '',
  };

  constructor(private auth: AuthenticationService, private router: Router) {
  }

  register = () => {
    this.auth.register(this.credentials).subscribe(() => {
      this.router.navigateByUrl('/profile');
    }, (err) => {
      console.error(err);
    });
  }
}
