<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCommentRequest;
use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    use \App\Traits\CustomResponseTrait;

    public function index(Request $request, Post $post)
    {
        $this->authorizePostVisibility($request, $post);

        $userId = $request->user()->id;

        $comments = $post->comments()
            ->with(['user', 'replies.user'])
            ->withCount(['likes', 'replies'])
            ->withExists(['likes as liked_by_me' => fn($q) => $q->where('user_id', $userId)])
            ->with([
                'replies' => fn($q) => $q
                    ->withCount('likes')
                    ->withExists(['likes as liked_by_me' => fn($qq) => $qq->where('user_id', $userId)])
            ])
            ->orderByDesc('id')
            ->cursorPaginate(3);

        return $this->jsonResponse(
            flag: true,
            message: 'Comments retrieved successfully',
            data: CommentResource::collection($comments->items()),
            extra: [
                'next_cursor' => $comments->nextCursor()?->encode(),
                'has_more'    => $comments->hasMorePages(),
            ],
            responseCode: 200
        );
    }

    public function store(StoreCommentRequest $request, Post $post)
    {
        $this->authorizePostVisibility($request, $post);

        $parentId = null;
        if ($request->filled('parent_id')) {
            $parent = Comment::findOrFail($request->parent_id);

            // parent must belong to this post
            abort_unless($parent->post_id === $post->id, 422, 'Parent comment does not belong to this post.');

            // one nesting level only: replying to a reply attaches to its parent
            $parentId = $parent->parent_id ?? $parent->id;
        }

        $comment = $post->comments()->make([
            'body'      => $request->body,
            'parent_id' => $parentId,
        ]);
        $comment->user_id = $request->user()->id;
        $comment->save();

        $comment->load('user')->loadCount('likes');

        return $this->jsonResponse(
            flag: true,
            message: 'Comment created successfully.',
            data: new CommentResource($comment),
            responseCode: 201
        );
    }
}
