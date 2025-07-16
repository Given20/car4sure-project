import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

// Interface representing the user object
export interface User {
  id: number;
  name: string;
  email: string;
}

// Interface representing the structure of the authentication response
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
  errors?: any;
}
// Interface for login request 
export interface LoginRequest {
  email: string;
  password: string;
}
// Interface for Register request 
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
    // BehaviorSubject holds the current user state
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is already logged in
    this.checkAuthStatus();
  }

  // Check authentication status by validating the token and retrieving user info
  private checkAuthStatus(): void {
    const token = this.getToken();
    if (token) {
      this.getCurrentUser().subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.currentUserSubject.next(response.data.user);
          }
        },
        error: () => {
           // If token is invalid or expired, clear stored data
          this.logout();
        }
      });
    }
  }

  // Register a new user
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setToken(response.data.token);
            this.currentUserSubject.next(response.data.user);
          }
        })
      );
  }
// Login the existing user that has already been registered
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setToken(response.data.token);
            this.currentUserSubject.next(response.data.user);
          }
        })
      );
  }
// Logout from the application
  logout(): Observable<AuthResponse> | void {
    const token = this.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post<AuthResponse>(`${this.apiUrl}/logout`, {}, { headers })
        .pipe(
          tap(() => {
            this.clearAuth();
          })
        );
    } else {
      this.clearAuth();
    }
  }

  // Get the authenticated user's data
  getCurrentUser(): Observable<AuthResponse> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<AuthResponse>(`${this.apiUrl}/user`, { headers });
  }

  // Clear stored token and reset current user state
  private clearAuth(): void {
    localStorage.removeItem('auth_token');
    this.currentUserSubject.next(null);
  }
 
  // Store the authentication token in local storage
  private setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }
  
  // Retrieve the stored authentication token
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Check whether the user is currently authenticated
  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.currentUserSubject.value;
  }
 
  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}

