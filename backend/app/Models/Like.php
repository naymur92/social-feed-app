<?php

namespace App\Models;

use App\Traits\HashesIds;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['user_id', 'likeable_type', 'likeable_id'])]
class Like extends Model
{
    use HashesIds;

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function likeable()
    {
        return $this->morphTo();
    }
}
