<?php

namespace App\Http\Resources;

use App\Models\User;
use App\Services\IdHasher;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin User
 */
class UserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => IdHasher::encode($this->id),
            'full_name' => $this->full_name,
            'email' => $this->email,
            'profile_picture' => null,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
