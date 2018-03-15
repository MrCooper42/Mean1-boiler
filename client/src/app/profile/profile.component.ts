import { Component, OnInit } from '@angular/core';
import { AuthenticationService, UserDetails } from '../shared/services/authentication/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  details: UserDetails;

  constructor(private auth: AuthenticationService) {
  }

  ngOnInit() {
    this.auth.profile().subscribe(user => {
      console.log(user, 'user in profile');
      this.details = user;
    }, (err) => {
      console.error(err);
    });
  }

}
