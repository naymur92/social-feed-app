<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    use \App\Traits\CustomResponseTrait;

    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $posts = Post::query()
            ->where(function ($q) use ($userId) {
                $q->where('visibility', 'public')
                    ->orWhere('user_id', $userId);
            })
            ->with(['user', 'images'])
            ->withCount(['likes', 'comments'])
            ->withExists(['likes as liked_by_me' => fn($q) => $q->where('user_id', $userId)])
            ->orderByDesc('id')
            ->cursorPaginate(10);

        return $this->jsonResponse(
            flag: true,
            message: 'Posts retrieved successfully',
            data: PostResource::collection($posts)->resolve(),
            responseCode: 200
        );
    }

    public function store(StorePostRequest $request)
    {
        $post = $request->user()->posts()->create($request->safe()->only(['content', 'visibility']));

        foreach ($request->file('images', []) as $i => $file) {
            $post->images()->create([
                'path'       => $file->store('posts', 'public'),
                'sort_order' => $i,
            ]);
        }

        $post->load(['user', 'images'])->loadCount(['likes', 'comments']);

        return $this->jsonResponse(
            flag: true,
            message: 'Posts created successfully',
            data: PostResource::make($post)->resolve(),
            responseCode: 201
        );
    }
}
