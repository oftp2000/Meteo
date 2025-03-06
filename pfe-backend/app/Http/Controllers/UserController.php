<?php
// app/Http/Controllers/UserController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function store(Request $request)
{
    // Validez les champs, en vous assurant que "permissions" est un tableau d’IDs (ex: [1,2,3])
    $data = $request->validate([
        'name'        => 'required|string|max:255',
        'email'       => 'required|string|email|max:255|unique:users',
        'password'    => 'required|string|min:6',
        'role'        => 'required|string',
        'permissions' => 'sometimes|array'
    ]);

    // Création de l'utilisateur
    $user = \App\Models\User::create([
        'name'     => $data['name'],
        'email'    => $data['email'],
        'password' => bcrypt($data['password']),
        'role'     => $data['role'],
    ]);

    // Si des permissions sont envoyées, les synchroniser dans la table pivot
    if (isset($data['permissions'])) {
        $user->permissions()->sync($data['permissions']);
    }

    return response()->json([
        'message' => 'Utilisateur créé avec succès',
        'user'    => $user
    ], 201);
}

    public function update(Request $request, $id)
{
    $user = \App\Models\User::findOrFail($id);

    $data = $request->validate([
        'name'        => 'required|string|max:255',
        'email'       => 'required|string|email|max:255|unique:users,email,'.$user->id,
        'role'        => 'required|string',
        'permissions' => 'sometimes|array'
    ]);

    // Mise à jour des informations de base de l'utilisateur
    $user->update($data);

    // Synchronisation des permissions via la table pivot
    if (isset($data['permissions'])) {
        $user->permissions()->sync($data['permissions']);
    } else {
        // Si aucune permission n'est transmise, on vide la relation
        $user->permissions()->sync([]);
    }

    return response()->json([
        'message' => 'Utilisateur mis à jour avec succès',
        'user'    => $user
    ]);
}

public function destroy($id)
{
    // Trouver l'utilisateur ou renvoyer une erreur 404 si non trouvé
    $user = \App\Models\User::findOrFail($id);

    // Supprimer l'utilisateur
    $user->delete();

    // Retourner une réponse JSON de succès
    return response()->json([
        'message' => 'Utilisateur supprimé avec succès',
    ], 200);
}



}
