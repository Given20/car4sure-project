<?php

namespace App\Http\Controllers;

use App\Models\Policy;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Barryvdh\DomPDF\Facade\Pdf;
class PolicyController extends Controller
{
    
    // Display a listing of the user's policies.
    
    public function index(Request $request): JsonResponse
    {
        try {
            $policies = $request->user()->policies()->get();

            return response()->json([
                'success' => true,
                'data' => $policies
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve policies',
                'error' => $e->getMessage()
            ], 500);
        }
    }

 
     // Store a newly created policy in storage.
 
    public function store(Request $request): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'policy_no' => 'required|string|max:255|unique:policies',
                'policy_status' => 'required|string|in:Active,Inactive,Pending',
                'policy_type' => 'required|string|in:Auto',
                'policy_effective_date' => 'required|date',
                'policy_expiration_date' => 'required|date|after:policy_effective_date',
                'policy_holder_first_name' => 'required|string|max:255',
                'policy_holder_last_name' => 'required|string|max:255',
                'policy_holder_street' => 'required|string|max:255',
                'policy_holder_city' => 'required|string|max:255',
                'policy_holder_state' => 'required|string|max:255',
                'policy_holder_zip' => 'required|string|max:10',
                'driver_first_name' => 'required|string|max:255',
                'driver_last_name' => 'required|string|max:255',
                'driver_age' => 'required|integer|min:16|max:100',
                'driver_gender' => 'required|string|in:Male,Female,Other',
                'driver_marital_status' => 'required|string|in:Single,Married,Divorced,Widowed',
                'driver_license_number' => 'required|string|max:255',
                'driver_license_state' => 'required|string|max:255',
                'driver_license_status' => 'required|string|max:255',
                'driver_license_effective_date' => 'required|date',
                'driver_license_expiration_date' => 'required|date|after:driver_license_effective_date',
                'driver_license_class' => 'required|string|max:255',
                'vehicle_year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
                'vehicle_make' => 'required|string|max:255',
                'vehicle_model' => 'required|string|max:255',
                'vehicle_vin' => 'required|string|size:17',
                'vehicle_usage' => 'required|string|in:Pleasure,Commuting,Business',
                'vehicle_primary_use' => 'required|string|in:Commuting,Pleasure,Business',
                'vehicle_annual_mileage' => 'required|integer|min:0|max:100000',
                'vehicle_ownership' => 'required|string|in:Owned,Leased,Financed',
                'vehicle_garaging_street' => 'required|string|max:255',
                'vehicle_garaging_city' => 'required|string|max:255',
                'vehicle_garaging_state' => 'required|string|max:255',
                'vehicle_garaging_zip' => 'required|string|max:10',
                'coverages' => 'required|array|min:1',
                'coverages.*.type' => 'required|string|in:Liability,Collision,Comprehensive,Personal Injury Protection,Uninsured Motorist',
                'coverages.*.limit' => 'required|numeric|min:0',
                'coverages.*.deductible' => 'required|numeric|min:0'
            ]);

            // Add user_id to the validated data
            $validatedData['user_id'] = $request->user()->id;

            $policy = Policy::create($validatedData);

            return response()->json([
                'success' => true,
                'message' => 'Policy has been created successfully',
                'data' => $policy
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create policy',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    
    //  Display the specified policy.
    
    public function show(Request $request, string $id): JsonResponse
    {
        try {
            $policy = $request->user()->policies()->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $policy
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Policy not found or access denied',
                'error' => $e->getMessage()
            ], 404);
        }
    }

 
     //Update the specified policy in storage.
    
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $policy = $request->user()->policies()->findOrFail($id);

            $validatedData = $request->validate([
                'policy_no' => 'required|string|max:255|unique:policies,policy_no,' . $id,
                'policy_status' => 'required|string|in:Active,Inactive,Pending',
                'policy_type' => 'required|string|in:Auto',
                'policy_effective_date' => 'required|date',
                'policy_expiration_date' => 'required|date|after:policy_effective_date',
                'policy_holder_first_name' => 'required|string|max:255',
                'policy_holder_last_name' => 'required|string|max:255',
                'policy_holder_street' => 'required|string|max:255',
                'policy_holder_city' => 'required|string|max:255',
                'policy_holder_state' => 'required|string|max:255',
                'policy_holder_zip' => 'required|string|max:10',
                'driver_first_name' => 'required|string|max:255',
                'driver_last_name' => 'required|string|max:255',
                'driver_age' => 'required|integer|min:16|max:100',
                'driver_gender' => 'required|string|in:Male,Female,Other',
                'driver_marital_status' => 'required|string|in:Single,Married,Divorced,Widowed',
                'driver_license_number' => 'required|string|max:255',
                'driver_license_state' => 'required|string|max:255',
                'driver_license_status' => 'required|string|max:255',
                'driver_license_effective_date' => 'required|date',
                'driver_license_expiration_date' => 'required|date|after:driver_license_effective_date',
                'driver_license_class' => 'required|string|max:255',
                'vehicle_year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
                'vehicle_make' => 'required|string|max:255',
                'vehicle_model' => 'required|string|max:255',
                'vehicle_vin' => 'required|string|size:17',
                'vehicle_usage' => 'required|string|in:Pleasure,Commuting,Business',
                'vehicle_primary_use' => 'required|string|in:Commuting,Pleasure,Business',
                'vehicle_annual_mileage' => 'required|integer|min:0|max:100000',
                'vehicle_ownership' => 'required|string|in:Owned,Leased,Financed',
                'vehicle_garaging_street' => 'required|string|max:255',
                'vehicle_garaging_city' => 'required|string|max:255',
                'vehicle_garaging_state' => 'required|string|max:255',
                'vehicle_garaging_zip' => 'required|string|max:10',
                'coverages' => 'required|array|min:1',
                'coverages.*.type' => 'required|string|in:Liability,Collision,Comprehensive,Personal Injury Protection,Uninsured Motorist',
                'coverages.*.limit' => 'required|numeric|min:0',
                'coverages.*.deductible' => 'required|numeric|min:0'
            ]);

            $policy->update($validatedData);

            return response()->json([
                'success' => true,
                'message' => 'Policy has been updated successfully',
                'data' => $policy
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update policy or policy not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    
    // Remove the specified policy from storage.
     
    public function destroy(Request $request, string $id): JsonResponse
    {
        try {
            $policy = $request->user()->policies()->findOrFail($id);
            $policy->delete();

            return response()->json([
                'success' => true,
                'message' => 'Policy has been deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete policy or policy not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }
    // Generate and download the policy certificate as PDF
    public function generateCertificate(Request $request, string $id): JsonResponse
    {
        try {
            $policy = $request->user()->policies()->findOrFail($id);

            $data = [
                'policyNo' => $policy->policy_no,
                'policyStatus' => $policy->policy_status,
                'policyType' => $policy->policy_type,
                'effectiveDate' => $policy->policy_effective_date,
                'expirationDate' => $policy->policy_expiration_date,
                'policyHolder' => $policy->policy_holder_first_name . ' ' . $policy->policy_holder_last_name,
                'address' => $policy->policy_holder_street . ', ' . $policy->policy_holder_city . ', ' . $policy->policy_holder_state . ' ' . $policy->policy_holder_zip,
                'vehicle' => (object) [
                    'year' => $policy->vehicle_year,
                    'make' => $policy->vehicle_make,
                    'model' => $policy->vehicle_model,
                    'vin' => $policy->vehicle_vin,
                ],
                'coverages' => json_decode($policy->coverages, true), // Assuming coverages is stored as JSON
                'issuedDate' => now()->format('Y-m-d H:i:s'),
            ];

            $pdf = Pdf::loadView('certificates.policy', $data);

            return response()->json([
                'success' => true,
                'message' => 'PDF generation successful',
                'data' => base64_encode($pdf->output()) // Encode PDF content for frontend
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate certificate or policy not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }
}
