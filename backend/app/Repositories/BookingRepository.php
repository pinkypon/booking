<?php

namespace App\Repositories;

use App\Models\Booking;
use Illuminate\Database\Eloquent\Collection;

class BookingRepository implements BookingRepositoryInterface
{
    /**
     * Get all bookings.
     */
    public function all(): Collection
    {
        return Booking::orderBy('date', 'desc')
            ->orderBy('start_time', 'asc')
            ->get();
    }

    /**
     * Get bookings for a specific user.
     */
    public function getByUser(int $userId): Collection
    {
        return Booking::forUser($userId)
            ->orderBy('date', 'desc')
            ->orderBy('start_time', 'asc')
            ->get();
    }

    /**
     * Find a booking by ID.
     */
    public function find(int $id): ?Booking
    {
        return Booking::find($id);
    }

    /**
     * Create a new booking.
     */
    public function create(array $data): Booking
    {
        return Booking::create($data);
    }

    /**
     * Update an existing booking.
     */
    public function update(int $id, array $data): bool
    {
        $booking = $this->find($id);
        
        if (!$booking) {
            return false;
        }

        return $booking->update($data);
    }

    /**
     * Delete a booking.
     */
    public function delete(int $id): bool
    {
        $booking = $this->find($id);
        
        if (!$booking) {
            return false;
        }

        return $booking->delete();
    }

    /**
     * Get bookings on a specific date.
     */
    public function getByDate(string $date): Collection
    {
        return Booking::onDate($date)
            ->orderBy('start_time', 'asc')
            ->get();
    }

    /**
     * Get bookings older than specified days.
     */
    public function getOlderThan(int $days): Collection
    {
        return Booking::olderThan($days)->get();
    }

    /**
     * Delete bookings older than specified days.
     */
    public function deleteOlderThan(int $days): int
    {
        return Booking::olderThan($days)->delete();
    }

    /**
     * Get all bookings with user relationship.
     */
    public function getAllWithUser(): Collection
    {
        return Booking::with('user')
            ->orderBy('date', 'desc')
            ->orderBy('start_time', 'asc')
            ->get();
    }
}