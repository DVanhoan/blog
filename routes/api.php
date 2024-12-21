<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Hash;


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'userProfile']);
});





Route::get('login/github', function () {
    return Socialite::driver('github')->redirect();
})->name('login.github');

Route::get('/login/github/callback', function () {
    $github_user = Socialite::driver('github')->stateless()->user();
    $user = User::where("github_id", $github_user->id)->orWhere('email', $github_user->getEmail())->first();

    if ($user) {
        auth()->login($user, true);
    } else {
        $newUser = User::create([
            'name' => $github_user->getNickname(),
            'email' => $github_user->getEmail(),
            'avatar' => $github_user->getAvatar(),
            'github_id' => $github_user->getId(),
            'password' => Hash::make($github_user->getId()),
        ]);

        $newUser->assignRole('user');

        auth()->login($newUser, true);
    }

    return redirect()->route('/');
});


Route::get('login/google', function () {
    return Socialite::driver('google')->redirect();
})->name('login.google');

Route::get('/login/google/callback', function () {
    $google_user = Socialite::driver('google')->stateless()->user();
    $user = User::where("google_id", $google_user->id)->orWhere('email', $google_user->getEmail())->first();
    // dd($user);

    if ($user) {
        auth()->login($user, true);
    } else {
        $newUser = User::create([
            'name' => $google_user->getName(),
            'email' => $google_user->getEmail(),
            'avatar' => $google_user->getAvatar(),
            'google_id' => $google_user->getId(),
            'password' => Hash::make($google_user->getId()),
        ]);

        $newUser->assignRole('user');

        auth()->login($newUser, true);
    }

    $token = $user->createToken('GoogleAuthToken')->plainTextToken;

    return response()->json([
        'user' => $user,
        'access_token' => $token,
        'token_type' => 'bearer',
        'expires_in' => auth('api')->factory()->getTTL() * 60,
        'role' => $user->getRoleNames(),
    ]);
});
