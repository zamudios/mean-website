import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  username = '';
  email = '';
  profileImage;
  collection;
  id;


  constructor( 
    private authService: AuthService,
    private blogService: BlogService
  ) { }

  // When profile component load it will run function to get profile
  ngOnInit() {
    // Get user
    this.authService.getProfile().subscribe(profile => {
      if (!profile) {

      } else {
        this.username = profile.user.username;
        this.email = profile.user.email;
        this.getPosts();
      } 
    });
  }

  getPosts() {
    this.blogService.userPosts(this.username).subscribe( data => {
      if (!data) {

      } else {
        this.collection = data.blogs;
      }
    });
  }

}
