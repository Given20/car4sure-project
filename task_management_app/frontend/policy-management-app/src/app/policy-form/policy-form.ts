import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PolicyService } from '../policy';
import { Policy, Coverage } from '../models/policy.model';

@Component({
  selector: 'app-policy-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './policy-form.html',
  styleUrls: ['./policy-form.css']
})
export class PolicyFormComponent implements OnInit {
  // Reactive form instance
  policyForm: FormGroup;
  isEditMode = false;
  policyId: number | null = null;
  // Flags for form state
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private policyService: PolicyService,
    private router: Router,
    private route: ActivatedRoute
  ) 
  {
    // Initialize the form structure
    this.policyForm = this.createForm();
  }

  ngOnInit(): void {
      // Check if editing an existing policy (URL has an ID)
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.policyId = +params['id'];
        this.loadPolicy(this.policyId);// Load policy details into the form
      }
    });
  }

    // Create the reactive form structure with validation
  createForm(): FormGroup {
    return this.fb.group({
      policy_no: ['', [Validators.required]],
      policy_status: ['Active', [Validators.required]],
      policy_type: ['Auto', [Validators.required]],
      policy_effective_date: ['', [Validators.required]],
      policy_expiration_date: ['', [Validators.required]],
      policy_holder_first_name: ['', [Validators.required]],
      policy_holder_last_name: ['', [Validators.required]],
      policy_holder_street: ['', [Validators.required]],
      policy_holder_city: ['', [Validators.required]],
      policy_holder_state: ['', [Validators.required]],
      policy_holder_zip: ['', [Validators.required]],
      driver_first_name: ['', [Validators.required]],
      driver_last_name: ['', [Validators.required]],
      driver_age: ['', [Validators.required, Validators.min(16), Validators.max(100)]],
      driver_gender: ['', [Validators.required]],
      driver_marital_status: ['', [Validators.required]],
      driver_license_number: ['', [Validators.required]],
      driver_license_state: ['', [Validators.required]],
      driver_license_status: ['Valid', [Validators.required]],
      driver_license_effective_date: ['', [Validators.required]],
      driver_license_expiration_date: ['', [Validators.required]],
      driver_license_class: ['A', [Validators.required]],
      vehicle_year: ['', [Validators.required, Validators.min(1900)]],
      vehicle_make: ['', [Validators.required]],
      vehicle_model: ['', [Validators.required]],
      vehicle_vin: ['', [Validators.required, Validators.minLength(17), Validators.maxLength(17)]],
      vehicle_usage: ['', [Validators.required]],
      vehicle_primary_use: ['', [Validators.required]],
      vehicle_annual_mileage: ['', [Validators.required, Validators.min(0)]],
      vehicle_ownership: ['', [Validators.required]],
      vehicle_garaging_street: ['', [Validators.required]],
      vehicle_garaging_city: ['', [Validators.required]],
      vehicle_garaging_state: ['', [Validators.required]],
      vehicle_garaging_zip: ['', [Validators.required]],
      coverages: this.fb.array([this.createCoverageGroup()])
    });
  }
 // Create a single coverage form group
  createCoverageGroup(): FormGroup {
    return this.fb.group({
      type: ['', [Validators.required]],
      limit: ['', [Validators.required, Validators.min(0)]],
      deductible: ['', [Validators.required, Validators.min(0)]]
    });
  }

    // Getter for the FormArray of coverages
  get coverages(): FormArray {
    return this.policyForm.get('coverages') as FormArray;
  }
  // Add a new coverage to the list
  addCoverage(): void {
    this.coverages.push(this.createCoverageGroup());
  }
  // Remove a coverage from the list
  removeCoverage(index: number): void {
    if (this.coverages.length > 1) {
      this.coverages.removeAt(index);
    }
  }
  // Load policy details from API and populate form
  loadPolicy(id: number): void {
    this.loading = true;
    this.policyService.getPolicyById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.populateForm(response.data);
        } else {
          this.error = 'Failed to load policy';
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      }
    });
  }

    // Populate form fields with existing policy data
  populateForm(policy: Policy): void {
    // Clear existing coverages
    while (this.coverages.length > 0) {
      this.coverages.removeAt(0);
    }

    // Add coverages from policy
    policy.coverages.forEach(coverage => {
      const coverageGroup = this.createCoverageGroup();
      coverageGroup.patchValue(coverage);
      this.coverages.push(coverageGroup);
    });

    // Populate the rest of the form
    this.policyForm.patchValue(policy);
  }
  // Handle form submission (create or update)
  onSubmit(): void {
    if (this.policyForm.valid) {
      this.loading = true;
      this.error = null;

      const policyData = this.policyForm.value;

      if (this.isEditMode && this.policyId) {
        // Update existing policy
        this.policyService.updatePolicy(this.policyId, policyData).subscribe({
          next: (response) => {
            if (response.success) {
              this.router.navigate(['/']);
            } else {
              this.error = 'Failed to update policy';
            }
            this.loading = false;
          },
          error: (error) => {
            this.error = error;
            this.loading = false;
          }
        });
      } else {
        // Create new policy
        this.policyService.createPolicy(policyData).subscribe({
          next: (response) => {
            if (response.success) {
              this.router.navigate(['/']);
            } else {
              this.error = 'Failed to create policy';
            }
            this.loading = false;
          },
          error: (error) => {
            this.error = error;
            this.loading = false;
          }
        });
      }
    } else {
        // Mark all fields as touched to show validation messages
      this.markFormGroupTouched(this.policyForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          if (arrayControl instanceof FormGroup) {
            this.markFormGroupTouched(arrayControl);
          }
        });
      }
    });
  }

    // Check if a field is invalid and touched
  isFieldInvalid(fieldName: string): boolean {
    const field = this.policyForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

   // Return user-friendly error message for a given field
  getFieldError(fieldName: string): string {
    const field = this.policyForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) return `${fieldName.replace('_', ' ')} is required`;
      if (field.errors['min']) return `${fieldName.replace('_', ' ')} must be at least ${field.errors['min'].min}`;
      if (field.errors['max']) return `${fieldName.replace('_', ' ')} must be at most ${field.errors['max'].max}`;
      if (field.errors['minlength']) return `${fieldName.replace('_', ' ')} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['maxlength']) return `${fieldName.replace('_', ' ')} must be at most ${field.errors['maxlength'].requiredLength} characters`;
    }
    return '';
  }
  // Cancel and return to home route
  cancel(): void {
    this.router.navigate(['/']);
  }
  // Attempt code to download certificate and convert it to a PDF - 2025-/07/17
downloadCertificate(): void {
  if (this.policyId) {
    this.loading = true;
    this.error = null;
    this.policyService.generateCertificate(this.policyId).subscribe({
      next: (base64String: string) => {
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `policy_certificate_${this.policyId}_${new Date().toISOString().slice(0, 10)}.pdf`; 
        link.click();
        window.URL.revokeObjectURL(url);
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message || 'Failed to download certificate';
        this.loading = false;
      }
    });
  } else {
    this.error = 'No policy selected for download';
  }
}
}