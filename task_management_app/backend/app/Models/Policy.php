<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Policy extends Model
{
    use HasFactory;

    //I used the $fillable to allow safe bulk updates/creates
    protected $fillable = [
        'user_id',
        'policy_no',
        'policy_status',
        'policy_type',
        'policy_effective_date',
        'policy_expiration_date',
        'policy_holder_first_name',
        'policy_holder_last_name',
        'policy_holder_street',
        'policy_holder_city',
        'policy_holder_state',
        'policy_holder_zip',
        'driver_first_name',
        'driver_last_name',
        'driver_age',
        'driver_gender',
        'driver_marital_status',
        'driver_license_number',
        'driver_license_state',
        'driver_license_status',
        'driver_license_effective_date',
        'driver_license_expiration_date',
        'driver_license_class',
        'vehicle_year',
        'vehicle_make',
        'vehicle_model',
        'vehicle_vin',
        'vehicle_usage',
        'vehicle_primary_use',
        'vehicle_annual_mileage',
        'vehicle_ownership',
        'vehicle_garaging_street',
        'vehicle_garaging_city',
        'vehicle_garaging_state',
        'vehicle_garaging_zip',
        'coverages'
    ];

    //Ensure dates integers, and the JSON coverages field are handled properly
    protected $casts = [
        'coverages' => 'array',
        'policy_effective_date' => 'date',
        'policy_expiration_date' => 'date',
        'driver_license_effective_date' => 'date',
        'driver_license_expiration_date' => 'date',
        'driver_age' => 'integer',
        'vehicle_year' => 'integer',
        'vehicle_annual_mileage' => 'integer'
    ];

    //Get the user that owns the policy
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}