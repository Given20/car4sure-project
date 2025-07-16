export interface Policy {
  id?: number;
  policy_no: string;
  policy_status: string;
  policy_type: string;
  policy_effective_date: string;
  policy_expiration_date: string;
  // Policy holder (customer) personal information
  policy_holder_first_name: string;
  policy_holder_last_name: string;
  policy_holder_street: string;
  policy_holder_city: string;
  policy_holder_state: string;
  policy_holder_zip: string;
  // Driver details (specific to auto policies)
  driver_first_name: string;
  driver_last_name: string;
  driver_age: number;
  driver_gender: string;
  driver_marital_status: string;
  // Driver license details
  driver_license_number: string;
  driver_license_state: string;
  driver_license_status: string;
  driver_license_effective_date: string;
  driver_license_expiration_date: string;
  driver_license_class: string;
  // Vehicle information
  vehicle_year: number;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_vin: string;
  vehicle_usage: string;
  vehicle_primary_use: string;
  vehicle_annual_mileage: number;
  vehicle_ownership: string;
  // Vehicle location/garage address
  vehicle_garaging_street: string;
  vehicle_garaging_city: string;
  vehicle_garaging_state: string;
  vehicle_garaging_zip: string;
  // Coverage details (array of coverages)
  coverages: Coverage[];
  // Timestamps
  created_at?: string;
  updated_at?: string;
}
// Represents a single coverage line within a policy
export interface Coverage {
  type: string;
  limit: number;
  deductible: number;
}

