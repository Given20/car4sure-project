<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
// helps Laravel find and autoload this controller when you reference it 
class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;
}
