<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class AdminController extends Controller
{
    // Récupérer le profil de l'utilisateur connecté
    public function getProfile()
    {
        $user = auth()->user();
        return response()->json($user);
    }

    // Mettre à jour le profil de l'utilisateur connecté
    public function updateProfile(Request $request)
    {
        $user = auth()->user();
        $user->update($request->only(['name', 'email']));
        return response()->json($user);
    }

    // Récupérer tous les utilisateurs
    public function getUsers()
    {
        $users = User::all();
        $totalUsers = User::count();
        $activeUsers = User::where('status', 'active')->count();
        $lastConnectedUsers = User::orderBy('last_login_at', 'desc')->take(5)->get();

        return response()->json([
            'users' => $users,
            'totalUsers' => $totalUsers,
            'activeUsers' => $activeUsers,
            'lastConnectedUsers' => $lastConnectedUsers,
        ]);
    }

    // Créer un nouvel utilisateur
    public function createUser(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:user,admin',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => $request->role,
        ]);

        return response()->json($user, 201);
    }

    // Mettre à jour le statut d'un utilisateur
    public function updateUserStatus(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->update(['status' => $request->status]);
        return response()->json($user);
    }
}