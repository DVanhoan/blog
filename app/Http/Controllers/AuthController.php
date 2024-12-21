<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user = auth('api')->user();

        return response()->json([
            'role' => $user->getRoleNames(),
            "user" => $user,
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60
        ]);
    }


    public function register(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
        ]);

        $role = Role::where('name', operator: 'user')
            ->where('guard_name', 'api')
            ->first();

        $user->assignRole($role);

        return response()->json(['message' => 'Tạo tài khoản thành công'], 201);
    }

    public function logout()
    {
        auth('api')->logout();
        return response()->json(['message' => 'Đăng xuất thành công']);
    }

    public function userProfile()
    {
        return response()->json(auth('api')->user());
    }
}
