<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PasswordRequest extends Model
{
    protected $fillable = ['user_id', 'reason'];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
