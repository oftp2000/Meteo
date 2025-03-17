<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\PasswordRequest; // modèle à créer
use Illuminate\Support\Facades\Hash;

class ForgotPasswordController extends Controller
{
    // Traitement de la demande de réinitialisation
    public function sendResetRequest(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        // Vérifier si l'email existe
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => "Cet email n'existe pas."], 404);
        }

        // Enregistrer la demande (vous pouvez aussi envoyer directement un email)
        $passwordRequest = PasswordRequest::create([
            'user_id' => $user->id,
            'reason' => 'Demande de réinitialisation', // vous pouvez récupérer une raison si besoin
        ]);

        return response()->json([
            'message' => 'Demande de réinitialisation enregistrée.',
            'request_id' => $passwordRequest->id,
        ]);
    }

    // Récupérer les demandes pour l'interface admin
// Récupérer les demandes pour l'interface admin avec les infos complètes de l'utilisateur
public function getRequests()
{
    $requests = PasswordRequest::with('user')->get();

    return response()->json([
        'requests' => $requests->map(function ($request) {
            return [
                'id' => $request->id,
                'user_id' => $request->user->id ?? null,
                'user_name' => $request->user->name ?? 'Utilisateur inconnu',
                'user_email' => $request->user->email ?? 'Email inconnu',
                'user_role' => $request->user->role ?? 'Non spécifié',
                'user_profile_photo' => $request->user->profile_photo ? asset('storage/' . $request->user->profile_photo) : null,
                'reason' => $request->reason,
                'created_at' => $request->created_at,
            ];
        }),
    ]);
}


    // Mise à jour du mot de passe via la demande
    public function setNewPassword(Request $request, $id)
    {
        $request->validate([
            'new_password' => 'required|min:4',
        ]);

        $passwordRequest = PasswordRequest::find($id);
        if (!$passwordRequest) {
            return response()->json(['message' => 'Demande non trouvée.'], 404);
        }

        $user = User::find($passwordRequest->user_id);
        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé.'], 404);
        }

        // Mettre à jour le mot de passe de l'utilisateur
        $user->password = Hash::make($request->new_password);
        $user->save();

        // (Optionnel) Supprimer ou marquer la demande comme traitée
        $passwordRequest->delete();

        return response()->json(['message' => 'Mot de passe mis à jour avec succès.']);
    }
    
    // Supprimer une demande de réinitialisation
  // Suppression d'une demande de réinitialisation
public function deleteRequest($id)
{
    $passwordRequest = PasswordRequest::find($id);

    if (!$passwordRequest) {
        return response()->json(['message' => 'Demande non trouvée.'], 404);
    }

    $passwordRequest->delete();

    return response()->json(['message' => 'Demande supprimée avec succès.'], 200);
}

}
