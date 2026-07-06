<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

abstract class Controller
{
    /**
     * Abort with 404 when the post is private and not owned by the requester.
     * 404 (not 403) so the response doesn't reveal that the post exists.
     */
    protected function authorizePostVisibility(Request $request, Post $post): void
    {
        if ($post->visibility === 'private' && $post->user_id !== $request->user()->id) {
            abort(404);
        }
    }
}
