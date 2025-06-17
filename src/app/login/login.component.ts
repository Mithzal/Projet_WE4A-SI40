import { Component, OnInit } from '@angular/core';
import {Validators, FormGroup, FormControl, AbstractControl} from "@angular/forms";
import { UsersService } from "../services/users.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private userService: UsersService, private router : Router) {
    // Redirect to home if user is already logged in
    if (sessionStorage.getItem('userId')) {
      this.router.navigate(['/home']);
    }
  }
  ngOnInit(): void {
  }

  // Add getters for form controls
  get email(): AbstractControl | null {
    return this.loginForm.get('email');
  }

  get password(): AbstractControl | null {
    return this.loginForm.get('password');
  }

  togglePasswordVisibility(passwordInput: HTMLInputElement): void {
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  }

  loginUser(): void {
    if (this.loginForm.valid) {
      const email = this.email?.value;
      const password = this.password?.value;

      this.userService.loginUser(email, password).subscribe(
        response => {
          this.router.navigate(['/home']);
        },
        error => {
          console.error('Login failed:', error);
          // Handle login error (show message to user)
        }
      );
    }
  }
}
