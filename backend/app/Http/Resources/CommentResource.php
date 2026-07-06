<?php

namespace App\Http\Resources;

use App\Services\IdHasher;
use Carbon\CarbonInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => IdHasher::encode($this->id),
            'body'        => $this->body,
            'created_at'  => $this->created_at->diffForHumans([
                'syntax' => CarbonInterface::DIFF_ABSOLUTE,
                'short'  => true,
                'parts'  => 1,
            ]),
            'user'        => new UserResource($this->whenLoaded('user')),
            'likes_count' => $this->likes_count ?? 0,
            'liked_by_me' => (bool) ($this->liked_by_me ?? false),
            'replies_count' => $this->replies_count ?? 0,
            'replies'     => CommentResource::collection($this->whenLoaded('replies')),
        ];
    }
}
