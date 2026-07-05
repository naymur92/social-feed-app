<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
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
            'content'    => ['required', 'string', 'max:5000'],
            'visibility' => ['required', 'in:public,private'],
            'images'     => ['nullable', 'array', 'max:4'],
            'images.*'   => ['image', 'mimes:jpg,jpeg,png,webp', 'max:2048'], // 2MB each
        ];
    }
}
