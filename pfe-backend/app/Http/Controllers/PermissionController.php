<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Permission;

class PermissionController extends Controller
{
    public function index()
    {
        // Récupère toutes les permissions et les regroupe par catégorie
        $permissions = Permission::all()->groupBy('category');
        return response()->json($permissions);
    }
}
