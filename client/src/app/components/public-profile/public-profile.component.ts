import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private activatedRouter: ActivatedRoute,
    private blogService: BlogService 
  ) { }

  url;
  username;
  email;
  collection;
  message;
  messageClass;
  found = false;

  ngOnInit() {
    this.url = this.activatedRouter.snapshot.params;
    this.authService.publicProfile(this.url.username).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      } else {
        this.username = data.user.username;
        this.email = data.user.email;
        this.found = true;
        this.getPosts();
      }
    });
  }

  getPosts() {
    this.blogService.userPosts(this.username).subscribe( data =>{
      if (!data) {

      } else {
        this.collection = data.blogs;
      }
    });
  }

}
