<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PasswordResetRequest extends Model
{
    protected $table = 'password_reset_requests'; // ou le bon nom de table
    protected $fillable = ['email', 'token']; // adapte selon tes colonnes
    public $timestamps = true;
}
