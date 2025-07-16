import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Policy } from './models/policy.model';
import { AuthService } from './auth';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any;
}

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
   // Base URL for all policy-related API requests
  private apiUrl = 'http://localhost:8000/api/policies';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  //Fetch all policies for the authenticated user.
  getAllPolicies(): Observable<ApiResponse<Policy[]>> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<ApiResponse<Policy[]>>(this.apiUrl, { headers });
  }
  //Fetch the policy by the use of an ID
  getPolicyById(id: number): Observable<ApiResponse<Policy>> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<ApiResponse<Policy>>(`${this.apiUrl}/${id}`, { headers });
  }

  //Create a new policy
  createPolicy(policy: Partial<Policy>): Observable<ApiResponse<Policy>> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<ApiResponse<Policy>>(this.apiUrl, policy, { headers });
  }

  //Update an existing policy
  updatePolicy(id: number, policy: Partial<Policy>): Observable<ApiResponse<Policy>> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put<ApiResponse<Policy>>(`${this.apiUrl}/${id}`, policy, { headers });
  }

  //Delete a policy by its ID.
  deletePolicy(id: number): Observable<ApiResponse<any>> {
    const headers = this.authService.getAuthHeaders();
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`, { headers });
  }

 
  // Generate and Fetch a certificate (PDF URL or base64 string) for a specific policy
  generateCertificate(policyId: number): Observable<string> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<ApiResponse<string>>(`${this.apiUrl}/${policyId}/certificate`, { headers }).pipe(
      map((response: ApiResponse<string>) => response.data as string)
    );
  }
}

