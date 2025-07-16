import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, RegisterRequest } from '../auth';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent implements OnInit {
  // Reactive form group for registration
  registerForm!: FormGroup;
    // Flag for loading state
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
// Initialize the registration form with validation rules
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required]]
    }, {
       // Custom validator to ensure password matches confirmation
      validators: this.passwordMatchValidator
    });
  }
  // Custom validator to ensure password and confirmation match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('password_confirmation');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }
  // Convenient getter to access form controls
  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
        // Do nothing if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';
    // Call register API
    const registerData: RegisterRequest = {
      name: this.f['name'].value,
      email: this.f['email'].value,
      password: this.f['password'].value,
      password_confirmation: this.f['password_confirmation'].value
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/']);
        } else {
          this.error = response.message || 'Registration failed';
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Registration error:', error);
        if (error.error?.errors) {
          // Handle validation errors
          const errors = error.error.errors;
          const errorMessages = Object.keys(errors).map(key => errors[key][0]).join(', ');
          this.error = errorMessages;
        } else {
          this.error = error.error?.message || 'Registration failed. Please try again.';
        }
        this.loading = false;
      }
    });
  }
}

