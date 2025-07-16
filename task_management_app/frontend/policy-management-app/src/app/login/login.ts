import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, LoginRequest } from '../auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit {
    // Form group for login form
  loginForm!: FormGroup;
    // Track loading state and error message
  loading = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
      return;
    }

      // Initialize login form with validators
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }
  // Easy access to form controls
  get f() {
    return this.loginForm.controls;
  }

    // Handle form submission
  onSubmit(): void {
        // If the form is invalid, do not proceed
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';
    // Prepare login request data
    const loginData: LoginRequest = {
      email: this.f['email'].value,
      password: this.f['password'].value
    };

       // Call AuthService to perform login
    this.authService.login(loginData).subscribe({
      next: (response) => {
        // On successful login, navigate to home
        if (response.success) {
          this.router.navigate(['/']);
        } else {
              // If login fails, display the error message
          this.error = response.message || 'Login failed';
          this.loading = false;
        }
      },
      error: (error) => {
          // On error (e.g. network/server issues), show generic error message
        console.error('Login error:', error);
        this.error = error.error?.message || 'Login failed. Please try again.';
        this.loading = false;
      }
    });
  }
}

