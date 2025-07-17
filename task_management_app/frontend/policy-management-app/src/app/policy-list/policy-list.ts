import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PolicyService } from '../policy';
import { AuthService, User } from '../auth';
import { Policy } from '../models/policy.model';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-policy-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './policy-list.html',
  styleUrls: ['./policy-list.css']
})
export class PolicyListComponent implements OnInit {
  policies: Policy[] = [];
  policyForm: FormGroup;
  loading = true;
  error = '';
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private policyService: PolicyService,
    private authService: AuthService,
    private router: Router
  ) {
    this.policyForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      policyId: [null]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadPolicies();
      } else {
        this.policies = [];
        this.loading = false;
      }
    });
  }

  loadPolicies(): void {
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
          this.policies = response.data;
        } else {
          this.error = response.message || 'Failed to load policies';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading policies:', error);
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          this.error = 'Failed to load policies. Please try again.';
        }
        this.loading = false;
      }
    });
  }

  deletePolicy(id: number): void {
    if (!confirm('Are you sure you want to delete this policy?')) {
      return;
    }

    this.policyService.deletePolicy(id).subscribe({
      next: (response) => {
        if (response.success) {
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

  onAddNewPolicy(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/policy/new']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  onLogin(): void {
    this.router.navigate(['/login']);
  }

  onRegister(): void {
    this.router.navigate(['/register']);
  }

  onLogout(): void {
    this.authService.logout()?.subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        this.router.navigate(['/login']);
      }
    });
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  downloadCertificate(policyId: number): void {
    const selectedPolicy = this.policies.find(p => p.id === policyId);
    if (!selectedPolicy) {
      this.error = 'Selected policy not found';
      return;
    }

    const doc = new jsPDF();
    let yPos = 20;
    const pageHeight = 270; // A4 page height 

    // Helper function to check if new page is needed
    const checkPageBreak = (spaceNeeded: number) => {
      if (yPos + spaceNeeded > pageHeight) {
        doc.addPage();
        yPos = 20;
      }
    };

    // Title
    doc.setFontSize(16);
    doc.text('Insurance Policy Certificate', 20, yPos);
    yPos += 10;

    // Policy Information
    checkPageBreak(40);
    doc.setFontSize(12);
    doc.text('Policy Information', 20, yPos);
    yPos += 10;
    doc.setFontSize(10);
    doc.text(`Policy Number: ${selectedPolicy.policy_no || 'N/A'}`, 20, yPos);
    yPos += 6;
    doc.text(`Status: ${selectedPolicy.policy_status || 'N/A'}`, 20, yPos);
    yPos += 6;
    doc.text(`Type: ${selectedPolicy.policy_type || 'N/A'}`, 20, yPos);
    yPos += 6;
    doc.text(`Effective Date: ${selectedPolicy.policy_effective_date || 'N/A'}`, 20, yPos);
    yPos += 6;
    doc.text(`Expiration Date: ${selectedPolicy.policy_expiration_date || 'N/A'}`, 20, yPos);
    yPos += 10;

    // Policy Holder Information
    checkPageBreak(30);
    doc.setFontSize(12);
    doc.text('Policy Holder Information', 20, yPos);
    yPos += 10;
    doc.setFontSize(10);
    doc.text(`Name: ${selectedPolicy.policy_holder_first_name || ''} ${selectedPolicy.policy_holder_last_name || ''}`, 20, yPos);
    yPos += 6;
    doc.text(`Address: ${selectedPolicy.policy_holder_street || ''}, ${selectedPolicy.policy_holder_city || ''}, ${selectedPolicy.policy_holder_state || ''} ${selectedPolicy.policy_holder_zip || ''}`, 20, yPos);
    yPos += 10;

    // Driver Information
    checkPageBreak(70);
    doc.setFontSize(12);
    doc.text('Driver Information', 20, yPos);
    yPos += 10;
    doc.setFontSize(10);
    doc.text(`Name: ${selectedPolicy.driver_first_name || ''} ${selectedPolicy.driver_last_name || ''}`, 20, yPos);
    yPos += 6;
    doc.text(`Age: ${selectedPolicy.driver_age || 'N/A'}`, 20, yPos);
    yPos += 6;
    doc.text(`Gender: ${selectedPolicy.driver_gender || 'N/A'}`, 20, yPos);
    yPos += 6;
    doc.text(`Marital Status: ${selectedPolicy.driver_marital_status || 'N/A'}`, 20, yPos);
    yPos += 6;
    doc.text(`License Number: ${selectedPolicy.driver_license_number || 'N/A'}`, 20, yPos);
    yPos += 6;
    doc.text(`License State: ${selectedPolicy.driver_license_state || 'N/A'}`, 20, yPos);
    yPos += 6;
    doc.text(`License Status: ${selectedPolicy.driver_license_status || 'N/A'}`, 20, yPos);
    yPos += 6;
    doc.text(`License Effective Date: ${selectedPolicy.driver_license_effective_date || 'N/A'}`, 20, yPos);
    yPos += 6;
    doc.text(`License Expiration Date: ${selectedPolicy.driver_license_expiration_date || 'N/A'}`, 20, yPos);
    yPos += 6;
    doc.text(`License Class: ${selectedPolicy.driver_license_class || 'N/A'}`, 20, yPos);
    yPos += 10;

    // Vehicle Information
    checkPageBreak(60);
    doc.setFontSize(12);
    doc.text('Vehicle Information', 20, yPos);
    yPos += 10;
    doc.setFontSize(10);
    doc.text(`Year: ${selectedPolicy.vehicle_year || 'N/A'}`, 20, yPos);
    yPos += 6;
    doc.text(`Make: ${selectedPolicy.vehicle_make || 'N/A'}`, 20, yPos);
    yPos += 6;
    doc.text(`Model: ${selectedPolicy.vehicle_model || 'N/A'}`, 20, yPos);
    yPos += 6;
    doc.text(`VIN: ${selectedPolicy.vehicle_vin || 'N/A'}`, 20, yPos);
    yPos += 6;
    doc.text(`Usage: ${selectedPolicy.vehicle_usage || 'N/A'}`, 20, yPos);
    yPos += 6;
    doc.text(`Primary Use: ${selectedPolicy.vehicle_primary_use || 'N/A'}`, 20, yPos);
    yPos += 6;
    doc.text(`Annual Mileage: ${selectedPolicy.vehicle_annual_mileage || 'N/A'}`, 20, yPos);
    yPos += 6;
    doc.text(`Ownership: ${selectedPolicy.vehicle_ownership || 'N/A'}`, 20, yPos);
    yPos += 10;

    // Garaging Address
    checkPageBreak(30);
    doc.setFontSize(12);
    doc.text('Garaging Address', 20, yPos);
    yPos += 10;
    doc.setFontSize(10);
    doc.text(`Address: ${selectedPolicy.vehicle_garaging_street || ''}, ${selectedPolicy.vehicle_garaging_city || ''}, ${selectedPolicy.vehicle_garaging_state || ''} ${selectedPolicy.vehicle_garaging_zip || ''}`, 20, yPos);
    yPos += 10;

    // Coverage Information
    checkPageBreak(30);
    doc.setFontSize(12);
    doc.text('Coverage Information', 20, yPos);
    yPos += 10;
    doc.setFontSize(10);
    (selectedPolicy.coverages || []).forEach((coverage: any, index: number) => {
      // Check space for each coverage item (header + 3 lines + spacing)
      checkPageBreak(34); // 10 (header) + 6*3 (lines) + 6 (spacing)
      doc.text(`Coverage ${index + 1}:`, 20, yPos);
      yPos += 6;
      doc.text(`Type: ${coverage.type || 'N/A'}`, 30, yPos);
      yPos += 6;
      doc.text(`Limit: ${coverage.limit || 'N/A'}`, 30, yPos);
      yPos += 6;
      doc.text(`Deductible: ${coverage.deductible || 'N/A'}`, 30, yPos);
      yPos += 10;
    });

    doc.save(`policy_certificate_${policyId}_${new Date().toISOString().slice(0, 10)}.pdf`);
  }
}