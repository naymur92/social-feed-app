<?php

namespace App\Http\Requests;

use App\Services\IdHasher;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreCommentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'body'      => ['required', 'string', 'max:2000'],
            'parent_id' => ['nullable', 'exists:comments,id'], // hashid of parent comment for replies
        ];
    }

    /**
     * Decode the hashed parent_id filter before validation runs.
     * An invalid or absent hash leaves parent_id as null (no filter applied).
     */
    protected function prepareForValidation(): void
    {
        if ($this->filled('parent_id')) {
            $this->merge([
                'parent_id' => IdHasher::decode((string) $this->parent_id),
            ]);
        }
    }
}
