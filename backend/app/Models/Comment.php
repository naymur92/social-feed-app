<?php

namespace App\Models;

use App\Traits\HashesIds;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['user_id', 'post_id', 'parent_id', 'body'])]
class Comment extends Model
{
    use HashesIds;

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function replies()
    {
        return $this->hasMany(Comment::class, 'parent_id');
    }

    public function likes()
    {
        return $this->morphMany(Like::class, 'likeable');
    }
}
