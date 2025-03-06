<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    protected $fillable = ['category', 'label', 'icon'];

    public function users()
    {
        return $this->belongsToMany(User::class);
    }
}
