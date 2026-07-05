<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    use \App\Traits\CustomResponseTrait;

    // POST /api/posts/{post}/like
    public function togglePost(Request $request, Post $post)
    {
        return $this->toggle($request, $post);
    }

    // POST /api/comments/{comment}/like
    public function toggleComment(Request $request, Comment $comment)
    {
        return $this->toggle($request, $comment);
    }

    // GET /api/posts/{post}/likes
    public function postLikers(Request $request, Post $post)
    {
        return $this->likers($request, $post);
    }

    // GET /api/comments/{comment}/likes
    public function commentLikers(Request $request, Comment $comment)
    {
        return $this->likers($request, $comment);
    }


    private function toggle(Request $request, Post|Comment $likeable)
    {
        $this->authorizeVisibility($request, $likeable);

        $existing = $likeable->likes()
            ->where('user_id', $request->user()->id)
            ->first();

        if ($existing) {
            $existing->delete();
            $liked = false;
        } else {
            $likeable->likes()->create(['user_id' => $request->user()->id]);
            $liked = true;
        }

        return $this->jsonResponse(
            flag: true,
            message: $liked ? 'Liked successfully.' : 'Unliked successfully.',
            data: [
                'liked'       => $liked,
                'likes_count' => $likeable->likes()->count(),
            ],
            responseCode: 200
        );
    }

    private function likers(Request $request, Post|Comment $likeable)
    {
        $this->authorizeVisibility($request, $likeable);

        return $this->jsonResponse(
            flag: true,
            message: 'Likers retrieved successfully.',
            data: [
                'likers' => UserResource::collection($likeable->likes()->with('user')->get()->pluck('user')),
            ],
            responseCode: 200
        );
    }

    private function authorizeVisibility(Request $request, Post|Comment $likeable): void
    {
        $post = $likeable instanceof Post ? $likeable : $likeable->post;

        if ($post->visibility === 'private' && $post->user_id !== $request->user()->id) {
            abort(404);
        }
    }
}
