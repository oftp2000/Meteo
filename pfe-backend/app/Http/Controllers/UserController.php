<?php
// app/Http/Controllers/UserController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // Création d'un nouvel utilisateur
    public function store(Request $request)
    {
        // Validation des données avec gestion du fichier photo
        $data = $request->validate([
            'name'          => 'required|string|max:255',
            'email'         => 'required|string|email|max:255|unique:users',
            'password'      => 'required|string|min:6',
            'role'          => 'required|string',
            'permissions'   => 'sometimes|array',
            'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Si une photo de profil est fournie, on la stocke
        if ($request->hasFile('profile_photo')) {
            $data['profile_photo'] = $request->file('profile_photo')->store('profile_photos', 'public');
        }

        // Création de l'utilisateur avec le mot de passe hashé
        $user = User::create([
            'name'          => $data['name'],
            'email'         => $data['email'],
            'password'      => bcrypt($data['password']),
            'role'          => $data['role'],
            'profile_photo' => $data['profile_photo'] ?? null,
        ]);

        // Synchronisation des permissions si fournies
        if (isset($data['permissions'])) {
            $user->permissions()->sync($data['permissions']);
        }

        return response()->json([
            'message' => 'Utilisateur créé avec succès',
            'user'    => $user
        ], 201);
    }

    // Mise à jour d'un utilisateur existant
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Validation des données, y compris pour la photo et le mot de passe optionnel
        $data = $request->validate([
            'name'          => 'required|string|max:255',
            'email'         => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'role'          => 'required|string',
            'permissions'   => 'sometimes|array',
            'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'password'      => 'nullable|string|min:6',
        ]);

        // Gestion de l'upload de la nouvelle photo (suppression de l'ancienne si présente)
        if ($request->hasFile('profile_photo')) {
            if ($user->profile_photo) {
                Storage::disk('public')->delete($user->profile_photo);
            }
            $data['profile_photo'] = $request->file('profile_photo')->store('profile_photos', 'public');
        }

        // Mise à jour du mot de passe si fourni
        if (!empty($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        if (isset($data['permissions'])) {
            $user->permissions()->sync($data['permissions']);
        } else {
            $user->permissions()->sync([]);
        }

        return response()->json([
            'message' => 'Utilisateur mis à jour avec succès',
            'user'    => $user
        ]);
    }

    // Suppression d'un utilisateur
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Suppression de la photo de profil du stockage si elle existe
        if ($user->profile_photo) {
            Storage::disk('public')->delete($user->profile_photo);
        }

        $user->delete();

        return response()->json([
            'message' => 'Utilisateur supprimé avec succès',
        ], 200);
    }
}
