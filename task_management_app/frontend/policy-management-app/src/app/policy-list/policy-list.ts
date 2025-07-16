import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PolicyService } from '../policy';
import { AuthService, User } from '../auth';
import { Policy } from '../models/policy.model';

@Component({
  selector: 'app-policy-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './policy-list.html',
  styleUrl: './policy-list.css'
})
export class PolicyListComponent implements OnInit {
  // List of all policies to be displayed
  policies: Policy[] = [];
 // Flag to track loading state
  loading = true;
  error = '';
 // Stores the currently logged-in user
  currentUser: User | null = null;

  constructor(
    private policyService: PolicyService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to current user changes
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      // If user is logged in, fetch their policies
      if (user) {
        this.loadPolicies();
      } else {
         // If not logged in, clear policy list
        this.policies = [];
        this.loading = false;
      }
    });
  }
  // Fetch all policies from the backend
  loadPolicies(): void {
  // Double-check authentication status
    if (!this.authService.isAuthenticated()) {
      this.policies = [];
      this.loading = false;
      return;
    }

    this.loading = true;
    this.error = '';

    this.policyService.getAllPolicies().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Successfully loaded policies
          this.policies = response.data;
        } else {
          // Handle unsuccessful API response
          this.error = response.message || 'Failed to load policies';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading policies:', error);
        // Handle unauthorized access
        if (error.status === 401) {
          // Token expired or invalid, redirect to login
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          this.error = 'Failed to load policies. Please try again.';
        }
        this.loading = false;
      }
    });
  }
  // Delete a policy by ID
  deletePolicy(id: number): void {
    if (!confirm('Are you sure you want to delete this policy?')) {
      return;
    }

    this.policyService.deletePolicy(id).subscribe({
      next: (response) => {
        if (response.success) {
           // Remove deleted policy from local list
          this.policies = this.policies.filter(p => p.id !== id);
        } else {
          alert('Failed to delete policy: ' + response.message);
        }
      },
      error: (error) => {
        console.error('Error deleting policy:', error);
        alert('Failed to delete policy. Please try again.');
      }
    });
  }
  // Navigate to the new policy form if authenticated
  onAddNewPolicy(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/policy/new']);
    } else {
      this.router.navigate(['/login']);
    }
  }

    // Navigate to login page
  onLogin(): void {
    this.router.navigate(['/login']);
  }
  // Navigate to registration page
  onRegister(): void {
    this.router.navigate(['/register']);
  }
  // Handle logout process
  onLogout(): void {
    this.authService.logout()?.subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Even if logout fails on server, clear local auth
        this.router.navigate(['/login']);
      }
    });
  }
  // Utility method to check if the user is authenticated
  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
  
}