import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormControl, AbstractControl} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

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

  @Output() loginSuccess = new EventEmitter<void>();
  loginError: string | null = null;

  constructor(private authService: AuthService, private router: Router) {
    // Redirect to home if user is already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
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

      this.authService.login(email, password).subscribe(
        response => {
          this.loginError = null;
          this.loginSuccess.emit(); // Emit event on successful login
          this.router.navigate(['/']);
        },
        error => {
          console.error('Login failed:', error);
          this.loginError = 'Login failed: ' + (error.error?.message);
        }
      );
    }
  }
}
