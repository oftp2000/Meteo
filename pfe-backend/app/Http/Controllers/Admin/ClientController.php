<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ClientController extends Controller
{
    /**
     * Créer un client avec un mot de passe défini par l'admin.
     */
    public function createClient(Request $request)
    {
        // Validation des données
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6' // Vérifie la présence du mot de passe
        ]);

        // Création du client
        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']), // Hash du mot de passe
            'role' => 'client'
        ]);

        // Réponse JSON
        return response()->json([
            'status' => 'success',
            'message' => 'Client créé avec succès',
            'client' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email
            ]
        ], 201);
    }
}
