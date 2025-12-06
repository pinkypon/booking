<?php
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    // Authentication
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Bookings
    Route::prefix('bookings')->group(function () {
        // IMPORTANT: Specific routes MUST come before dynamic routes
        Route::get('/conflicts/report', [BookingController::class, 'conflictReport']);
        
        Route::get('/', [BookingController::class, 'index']);
        Route::post('/', [BookingController::class, 'store']);
        Route::get('/{id}', [BookingController::class, 'show']);
        Route::put('/{id}', [BookingController::class, 'update']);
        Route::delete('/{id}', [BookingController::class, 'destroy']);
    });

    // Admin routes
    Route::prefix('admin')->middleware('admin')->group(function () {
        Route::get('/bookings/conflicts/report', [AdminController::class, 'conflictReport']);
        Route::get('/bookings', [AdminController::class, 'index']);
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
    });
});