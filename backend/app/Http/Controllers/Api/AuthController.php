<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Traits\CustomResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    use CustomResponseTrait;

    public function register(RegisterRequest $request)
    {
        $user = User::create([
            ...$request->validated(),
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth')->plainTextToken;

        return $this->jsonResponse(
            flag: true,
            message: 'User registered successfully',
            data: ['user' => UserResource::make($user)->resolve(), 'token' => $token],
            responseCode: 201
        );
    }

    public function login(LoginRequest $request)
    {
        if (! Auth::attempt($request->validated())) {
            return $this->jsonResponse(
                flag: false,
                message: 'Invalid credentials.',
                responseCode: 422
            );
        }

        $user  = $request->user();
        $token = $user->createToken('auth')->plainTextToken;

        return $this->jsonResponse(
            flag: true,
            message: 'Login successful.',
            data: ['user' => UserResource::make($user)->resolve(), 'token' => $token],
            responseCode: 200
        );
    }

    public function me(Request $request)
    {
        return $this->jsonResponse(
            flag: true,
            message: 'User data retrieved.',
            data: ['user' => UserResource::make($request->user())->resolve()],
            responseCode: 200
        );
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return $this->jsonResponse(
            flag: true,
            message: 'Logged out.',
            responseCode: 200
        );
    }
}
