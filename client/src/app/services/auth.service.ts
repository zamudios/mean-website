import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { tokenNotExpired } from 'angular2-jwt';                   
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  // Development Domain - 
  domain = "http://localhost:3000"; 
  token;                              // User token
  user;                               // & information.
  options;

  constructor(
    private http: Http
  ) { }


  // Function to attach headers. (needed when user needs to be authenticated.)
  authenticationHeaders() {
    this.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': this.token
      })
    });
  }

  // Grab user token from browser's local storage.
  loadToken() {
    this.token = localStorage.getItem('token');
  }

  // Register Users.
  registerUser(user) {
    return this.http.post(this.domain + '/authentication/register', user).map(res => res.json());
  }

  checkUsername(username) {
    return this.http.get(this.domain + '/authentication/checkUsername/' + username).map(res => res.json());
  }

  checkEmail(email) {
    return this.http.get(this.domain + '/authentication/checkEmail/' + email).map(res => res.json());
  }

  // Function to log in user.
  login(user) {
    return this.http.post(this.domain + '/authentication/login', user).map(res => res.json());
  } 

  // Function to log out user.
  logout() {
    this.token = null;
    this.user = null;
    localStorage.clear();
  }

  // Get user and token, store in localStorage (Browser).
  storeUser(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.token = token;
    this.user = user;
  }

  getProfile() {
    this.authenticationHeaders();
    return this.http.get(this.domain + '/authentication/profile', this.options).map(res => res.json());
  }

  // Check if the user is logged in or the token is valid.
  loggedIn() {
    return tokenNotExpired();
  }

}

