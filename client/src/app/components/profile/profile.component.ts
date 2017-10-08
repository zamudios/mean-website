import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  username;
  email;

  constructor( private authService: AuthService ) { }

  // When profile component load it will run function to get profile
  ngOnInit() {
    // Get user
    this.authService.getProfile().subscribe(profile => {
    if (profile.user.username != undefined  && profile.user.email != undefined) {
      this.username = profile.user.username;
      this.email = profile.user.email;
    } 
    });
  }

}
