<?php

namespace App\Models;

use App\Traits\HashesIds;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['post_id', 'path', 'sort_order'])]
class PostImage extends Model
{
    use HashesIds;

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
