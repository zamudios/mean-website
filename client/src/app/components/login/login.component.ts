import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';  // Import modules for reactive form 
import { AuthService } from '../../services/auth.service';            // Import 
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	constructor(
		private formBuilder: FormBuilder,
		private authService: AuthService,
		private router: Router,
		private authGuard : AuthGuard
	) { 
		this.createForm();
	}

	loginForm: FormGroup;
	message;
	messageClass;
	processing = false;
	previousUrl;

	createForm() {
		this.loginForm = this.formBuilder.group({
			username: ['', Validators.required],
			password: ['', Validators.required]
		});
	}

	disableForm() {
		this.loginForm.controls['username'].disable();
		this.loginForm.controls['password'].disable();
	}

	enableForm() {
		this.loginForm.controls['username'].enable();
		this.loginForm.controls['password'].enable();
	}

	onLogin() {
		this.processing = true;
		this.disableForm();
		const user = {
			username: this.loginForm.get('username').value,
			password: this.loginForm.get('password').value
		};

		// Log in user.
		this.authService.login(user).subscribe(data => {
			if (!data.success) {
				this.messageClass = 'alert alert-danger';
				this.message = data.message;
				this.processing = false;
				this.enableForm();
			} else {
				this.messageClass = 'alert alert-success';
				this.message = data.message;
				this.authService.storeUser(data.token, data.user);
				setTimeout(() => {
					if (this.previousUrl) {
						this.router.navigate([this.previousUrl]);
					} else {
						this.router.navigate(['/dashboard']);												
					}
				}, 2000);

			}
		});
	}

	ngOnInit() {
		// Determine if log in is required.
		if (this.authGuard.redirectedUrl) {
			this.messageClass = 'alert alert-danger';
			this.message = 'Log In Required';
			this.previousUrl = this.authGuard.redirectedUrl;
			this.authGuard.redirectedUrl = undefined;
		}
	}

}
