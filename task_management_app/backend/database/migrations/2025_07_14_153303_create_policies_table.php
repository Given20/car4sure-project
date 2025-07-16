<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('policies', function (Blueprint $table) {
            $table->id();
            $table->string('policy_no')->unique();
            $table->string('policy_status');
            $table->string('policy_type');
            $table->date('policy_effective_date');
            $table->date('policy_expiration_date');
            
            // Policy Holder Info
            $table->string('policy_holder_first_name');
            $table->string('policy_holder_last_name');
            $table->string('policy_holder_street');
            $table->string('policy_holder_city');
            $table->string('policy_holder_state');
            $table->string('policy_holder_zip');
            
            // Driver Info (simplified - assuming one driver per policy for now)
            $table->string('driver_first_name');
            $table->string('driver_last_name');
            $table->integer('driver_age');
            $table->string('driver_gender');
            $table->string('driver_marital_status');
            $table->string('driver_license_number');
            $table->string('driver_license_state');
            $table->string('driver_license_status');
            $table->date('driver_license_effective_date');
            $table->date('driver_license_expiration_date');
            $table->string('driver_license_class');
            
            // Vehicle Info (simplified - assuming one vehicle per policy for now)
            $table->integer('vehicle_year');
            $table->string('vehicle_make');
            $table->string('vehicle_model');
            $table->string('vehicle_vin');
            $table->string('vehicle_usage');
            $table->string('vehicle_primary_use');
            $table->integer('vehicle_annual_mileage');
            $table->string('vehicle_ownership');
            $table->string('vehicle_garaging_street');
            $table->string('vehicle_garaging_city');
            $table->string('vehicle_garaging_state');
            $table->string('vehicle_garaging_zip');
            
            // Coverage Info (simplified - storing as JSON for flexibility)
            $table->json('coverages');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('policies');
    }
};
