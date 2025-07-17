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
  policyForm: FormGroup;
  isEditMode = false;
  policyId: number | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private policyService: PolicyService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.policyForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.isEditMode = !!params['id'];
      if (this.isEditMode) {
        this.policyId = +params['id'];

        // create form with placeholder policy_no
        this.policyForm = this.createForm(); 
        this.loadPolicy(this.policyId);
      } else {
        this.policyForm = this.createForm();
      }
    });
  }

  //Auto-generate a random policy number
  generatePolicyNumber(): string {
    return 'POL' + Math.floor(100000 + Math.random() * 900000);
  }

  createForm(): FormGroup {
    return this.fb.group({
      policy_no: [this.isEditMode ? '' : this.generatePolicyNumber(), [Validators.required]],
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

  createCoverageGroup(): FormGroup {
    return this.fb.group({
      type: ['', [Validators.required]],
      limit: ['', [Validators.required, Validators.min(0)]],
      deductible: ['', [Validators.required, Validators.min(0)]]
    });
  }

  get coverages(): FormArray {
    return this.policyForm.get('coverages') as FormArray;
  }

  addCoverage(): void {
    this.coverages.push(this.createCoverageGroup());
  }

  removeCoverage(index: number): void {
    if (this.coverages.length > 1) {
      this.coverages.removeAt(index);
    }
  }

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

  populateForm(policy: Policy): void {
    while (this.coverages.length > 0) {
      this.coverages.removeAt(0);
    }

    policy.coverages.forEach(coverage => {
      const coverageGroup = this.createCoverageGroup();
      coverageGroup.patchValue(coverage);
      this.coverages.push(coverageGroup);
    });

    this.policyForm.patchValue(policy);
  }

  onSubmit(): void {
    if (this.policyForm.valid) {
      this.loading = true;
      this.error = null;
      const policyData = this.policyForm.value;

      if (this.isEditMode && this.policyId) {
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

  isFieldInvalid(fieldName: string): boolean {
    const field = this.policyForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

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

  cancel(): void {
    this.router.navigate(['/']);
  }
}
