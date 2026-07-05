<?php

namespace App\Http\Resources;

use App\Services\IdHasher;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'             => IdHasher::encode($this->id),
            'content'        => $this->content,
            'visibility'     => $this->visibility,
            'created_at'     => $this->created_at->diffForHumans(), // "5 minutes ago" per design
            'user'           => new UserResource($this->whenLoaded('user')),
            'images'         => $this->whenLoaded('images', fn() => $this->images->map(fn($i) => [
                'id'  => IdHasher::encode($i->id),
                'url' => asset('storage/' . $i->path),
            ])),
            'likes_count'    => $this->likes_count ?? 0,
            'comments_count' => $this->comments_count ?? 0,
            'liked_by_me'    => (bool) ($this->liked_by_me ?? false),
        ];
    }
}
