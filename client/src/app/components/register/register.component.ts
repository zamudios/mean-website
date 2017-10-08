import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';  // Import modules for reactive form 
import { AuthService } from '../../services/auth.service';            // Import 
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor( private formBuilder: FormBuilder, private authService: AuthService, private router: Router ) { 
    this.createForm();
  }

  // Exporting a form of FormGroup type.
  registrationForm: FormGroup;
  message; 
  messageClass;
  processing = false;
  emailValid;
  emailMessage;
  usernameValid;
  usernameMessage;

  // Function to create form
  createForm() {
    // 
    this.registrationForm = this.formBuilder.group({
      // Passes this by default(which should be blank).
      // Using validation to make sure the user enters required information.
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        this.validateEmail
      ])],
      username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        this.validateUsername
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(35),
        this.validatePassword
      ])],
      // Confirm Password Input
      confirm: ['', Validators.required]                    // Field is required.
    }, {
      validator: this.matchPassword('password', 'confirm')  // Add custom validator to form for matching password
    });
  }

  // Disable form when user information is being processed.
  disableForm() {
    this.registrationForm.controls['email'].disable();
    this.registrationForm.controls['username'].disable();
    this.registrationForm.controls['password'].disable();
    this.registrationForm.controls['confirm'].disable();  
  }

  // Enable form after being disabled. (if needed)
  enableForm() {
    this.registrationForm.controls['email'].enable();
    this.registrationForm.controls['username'].enable();
    this.registrationForm.controls['password'].enable();
    this.registrationForm.controls['confirm'].enable();
  }

  // Validate user email: check (again) if the user email is valid.
  validateEmail(controls) {
        // Check validity with regular expression.
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (regExp.test(controls.value)) {
          return null;
        } else {
          return { 'validateEmail': true }; // Return valid email
        }

  }
  
  // Validate username: check (again) if the username is valid.
  validateUsername(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        if(regExp.test(controls.value)) {
          return null;
        } else {
          return { 'validateUsername': true };
        }
  }

  // Validate password: check (again) if the password is valid.
  validatePassword(controls) {
    const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
        if (regExp.test(controls.value)) {
          return null;
        } else {
          return { 'validatePassword': true };
        }
  }

  // Make sure the user confirmed password correctly
  matchPassword(password, confirm) {
    return (group: FormGroup) => {
      // Check if both fields are the same
      if (group.controls[password].value === group.controls[confirm].value) {
        return null;  // Match
      } else {
        return { 'matchPassword': true }; // Passwords do not match.
      }
    }
  }

  // Function to submit form
  onRegister() {
    this.processing = true;
    this.disableForm();
    // Create user object with information collected in form.
    const user = {
      email: this.registrationForm.get('email').value,
      username: this.registrationForm.get('username').value,
      password: this.registrationForm.get('password').value
    };
    // Call authentication service with user created. (to save user in database)
    this.authService.registerUser(user).subscribe(data => {
      if (!data.success) { 
        // There is an error with data.
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
        this.enableForm();
      } else {
        // All is good.
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      }
    });
  }

  checkUsername() {
    const username = this.registrationForm.get('username').value;
    this.authService.checkUsername(username).subscribe(data => {
      if (data.success) {
        this.usernameValid = true;
        this.usernameMessage = data.message;
      } else {
        this.usernameValid = false;
        this.usernameMessage = data.message;
      }
    });
  }

  checkEmail() {
    const email = this.registrationForm.get('email').value;
    this.authService.checkEmail(email).subscribe(data => {
      if (data.success) {
        this.emailValid = true;
        this.emailMessage = data.message;
      } else {
        this.emailValid = false;
        this.emailMessage = data.message;
      }
    });
  }

  ngOnInit() {
  }

}
