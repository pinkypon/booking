<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Booking extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'date',
        'start_time',
        'end_time',
        'title',
        'description',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date' => 'date',
        // Remove time casts - Laravel will handle them as strings
    ];

    /**
     * Get the user that owns the booking.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to only include bookings for a specific user.
     */
    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope a query to only include bookings on a specific date.
     */
    public function scopeOnDate($query, string $date)
    {
        return $query->where('date', $date);
    }

    /**
     * Scope a query to only include bookings older than specified days.
     */
    public function scopeOlderThan($query, int $days)
    {
        return $query->where('date', '<', now()->subDays($days));
    }
}
