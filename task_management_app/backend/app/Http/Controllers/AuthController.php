<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;

class AuthController extends Controller
{
    // Register a new user on the application
    public function register(Request $request): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
            ]);

            $user = User::create([
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'User registered successfully',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                    ],
                    'token' => $token,
                ]
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
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Login the user on the application
    public function login(Request $request): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'email' => 'required|string|email',
                'password' => 'required|string',
            ]);

            if (!Auth::attempt($validatedData)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials'
                ], 401);
            }

            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                    ],
                    'token' => $token,
                ]
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
                'message' => 'Login failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Logout the user on the application
    public function logout(Request $request): JsonResponse
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Logout successful'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Logout failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Retrieve authenticated user details
    public function user(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Retrieve active insurance policies for the authenticated user
    public function fetchUserActivePolicies(Request $request): JsonResponse
    {
        try {
            // Ensure user is authenticated
            if (!$request->user()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized: Please log in to access your Car4Sure policies'
                ], 401);
            }

            // Fetch policies that are active and not expired
            $policies = $request->user()->policies()
                ->where('policyStatus', 'Active')
                ->where('policyExpirationDate', '>=', Carbon::today())
                ->get()
                ->map(function ($policy) {
                    return [
                        'policyNo' => $policy->policyNo,
                        'policyType' => $policy->policyType,
                        'policyStatus' => $policy->policyStatus,
                        'effectiveDate' => $policy->policyEffectiveDate,
                        'expirationDate' => $policy->policyExpirationDate,
                        'policyHolder' => [
                            'firstName' => $policy->policyHolder->firstName,
                            'lastName' => $policy->policyHolder->lastName,
                        ]
                    ];
                });

            return response()->json([
                'success' => true,
                'message' => 'Active policies retrieved successfully',
                'data' => $policies
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve Car4Sure policies',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}