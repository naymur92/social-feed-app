<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['post_id', 'path', 'sort_order'])]
class PostImage extends Model
{
    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
