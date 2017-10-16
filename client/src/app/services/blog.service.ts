import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';


@Injectable()
export class BlogService {

  constructor(
    private authService : AuthService,
    private http: Http
  ) { }
  options;
  domain = this.authService.domain;

  // Function to attach headers. (needed when user needs to be authenticated.)
  authenticationHeaders() {
    this.authService.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': this.authService.token
      })
    });
  }

  getPosts() {
    this.authenticationHeaders();
    return this.http.get(this.domain + 'blogs/collection', this.options).map(res => res.json());
  }

  getPost(id) {
    this.authenticationHeaders();
    return this.http.get(this.domain + 'blogs/post/' + id, this.options).map(res => res.json());
  }

  userPosts(username) {
    this.authenticationHeaders();
    return this.http.get(this.domain + 'blogs/userPosts/' + username, this.options).map(res => res.json());
  }

  newBlog(blog) {
    this.authenticationHeaders();
    return this.http.post(this.domain + 'blogs/newBlog', blog, this.options).map(res => res.json());
  }

  delete(id) {
    this.authenticationHeaders();
    return this.http.delete(this.domain + 'blogs/delete/' + id, this.options).map(res => res.json());
  }

  edit(blog) {
    this.authenticationHeaders();
    return this.http.put(this.domain + 'blogs/update/', blog, this.options).map(res => res.json());
  }

  like(id) {
    const data = { id: id };
    // this.authenticationHeaders();
    return this.http.put(this.domain + 'blogs/like', data, this.options).map(res => res.json());
  }

  dislike(id) {
    const data = { id: id};
    // this.authenticationHeaders();
    return this.http.put(this.domain + 'blogs/dislike', data, this.options).map(res => res.json());
  }
}
