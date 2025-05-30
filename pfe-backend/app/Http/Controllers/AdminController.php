<?php
// app/Http/Controllers/AdminController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use App\Models\PasswordRequest;
use Illuminate\Support\Facades\DB;



class AdminController extends Controller
{
    // Récupérer le profil de l'utilisateur connecté
    public function getProfile()
    {
        $user = auth()->user();
    
        if (!$user) {
            return response()->json(['message' => 'Utilisateur non authentifié'], 401);
        }
    
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'profile_photo' => $user->profile_photo ? asset('storage/' . $user->profile_photo) : null,
            'created_at' => $user->created_at,
            'last_login_at' => $user->last_login_at ?? null
        ]);
    }
    

 
    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $data = $request->validate([
            'name'          => 'required|string|max:255',
            'email'         => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'password'      => 'nullable|string|min:6',
        ]);

        $user->name = $data['name'];
        $user->email = $data['email'];

        // Si une nouvelle photo est uploadée, suppression de l'ancienne et stockage de la nouvelle
        if ($request->hasFile('profile_photo')) {
            if ($user->profile_photo) {
                Storage::disk('public')->delete($user->profile_photo);
            }
            $user->profile_photo = $request->file('profile_photo')->store('profile_photos', 'public');
        }

        // Mise à jour du mot de passe si fourni
        if (!empty($data['password'])) {
            $user->password = bcrypt($data['password']);
        }

        $user->save();

        return response()->json($user);
    }

    // Récupérer tous les utilisateurs et certaines statistiques
    public function getUsers()
    {
        $users = User::all()->map(function ($user) {
            $user->profile_photo = $user->profile_photo ? asset('storage/' . $user->profile_photo) : null;
            return $user;
        });
    
        return response()->json([
            'users' => $users,
            'totalUsers' => User::count(),
            'activeUsers' => User::where('status', 'active')->count(),
            'lastConnectedUsers' => User::orderBy('last_login_at', 'desc')->take(5)->get(),
        ]);
    }

    // Création d'un nouvel utilisateur (avec gestion de la photo)
    public function createUser(Request $request)
    {
        $data = $request->validate([
            'name'          => 'required|string',
            'email'         => 'required|email|unique:users',
            'password'      => 'required|string|min:8',
            'role'          => 'required|in:user,admin',
            'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Gestion du fichier de photo de profil s'il existe
        if ($request->hasFile('profile_photo')) {
            $data['profile_photo'] = $request->file('profile_photo')->store('profile_photos', 'public');
        }

        $user = User::create([
            'name'          => $data['name'],
            'email'         => $data['email'],
            'password'      => bcrypt($data['password']),
            'role'          => $data['role'],
            'profile_photo' => $data['profile_photo'] ?? null,
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
    // Ajoutez ces nouvelles méthodes à votre AdminController

public function getStats(Request $request)
{
    $startDate = $request->input('start_date');
    $endDate = $request->input('end_date');

    return response()->json([
        'kpis' => [
            'activeUsers' => User::where('last_login_at', '>=', now()->subDays(30))->count(),
            'newUsers' => User::whereBetween('created_at', [$startDate, $endDate])->count(),
           'passwordRequests' => PasswordRequest::whereBetween('created_at', [$startDate, $endDate])->count(),
            'activationRate' => round((User::where('status', 'active')->count() / max(User::count(), 1)) * 100) . '%',
            'adminCount' => User::where('role', 'admin')->count(),
            'userCount' => User::where('role', 'user')->count(),
        ],
    ]);
}

public function getActivityData(Request $request)
{
    $startDate = $request->input('start_date');
    $endDate = $request->input('end_date');

    $activityData = User::selectRaw('DATE(last_login_at) as date, COUNT(*) as count')
        ->whereBetween('last_login_at', [$startDate, $endDate])
        ->groupBy('date')
        ->orderBy('date')
        ->get();

    return response()->json($activityData);
}

public function getPermissionStats(Request $request)
{
    $startDate = $request->input('start_date');
    $endDate = $request->input('end_date');

    $results = DB::table('permission_user')
        ->join('permissions', 'permission_user.permission_id', '=', 'permissions.id')
        ->select('permissions.category', DB::raw('count(*) as count'))
        ->groupBy('permissions.category')
        ->get();

    return response()->json($results);
}

public function updateUser(Request $request, $id)
{
    $user = User::findOrFail($id);

    $data = $request->validate([
        'name' => 'required|string',
        'email' => 'required|email|unique:users,email,'.$user->id,
        'role' => 'required|in:user,admin',
        'password' => 'nullable|string|min:8',
        'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        'permissions' => 'nullable|array',
    ]);

    $user->name = $data['name'];
    $user->email = $data['email'];
    $user->role = $data['role'];

    if ($request->hasFile('profile_photo')) {
        if ($user->profile_photo) {
            Storage::disk('public')->delete($user->profile_photo);
        }
        $user->profile_photo = $request->file('profile_photo')->store('profile_photos', 'public');
    }

    if (!empty($data['password'])) {
        $user->password = bcrypt($data['password']);
    }

    if (!empty($data['permissions'])) {
        $user->permissions = json_encode($data['permissions']);
    }

    $user->save();

    return response()->json($user);
}

public function deleteUser($id)
{
    $user = User::findOrFail($id);
    
    if ($user->profile_photo) {
        Storage::disk('public')->delete($user->profile_photo);
    }
    
    $user->delete();
    
    return response()->json(['message' => 'User deleted successfully']);
}

    
}
