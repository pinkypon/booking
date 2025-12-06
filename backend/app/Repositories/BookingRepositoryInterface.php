<?php

namespace App\Repositories;

use App\Models\Booking;
use Illuminate\Database\Eloquent\Collection;

interface BookingRepositoryInterface
{
    /**
     * Get all bookings.
     */
    public function all(): Collection;

    /**
     * Get bookings for a specific user.
     */
    public function getByUser(int $userId): Collection;

    /**
     * Find a booking by ID.
     */
    public function find(int $id): ?Booking;

    /**
     * Create a new booking.
     */
    public function create(array $data): Booking;

    /**
     * Update an existing booking.
     */
    public function update(int $id, array $data): bool;

    /**
     * Delete a booking.
     */
    public function delete(int $id): bool;

    /**
     * Get bookings on a specific date.
     */
    public function getByDate(string $date): Collection;

    /**
     * Get bookings older than specified days.
     */
    public function getOlderThan(int $days): Collection;

    /**
     * Delete bookings older than specified days.
     */
    public function deleteOlderThan(int $days): int;

    /**
     * Get all bookings with user relationship.
     */
    public function getAllWithUser(): Collection;
}