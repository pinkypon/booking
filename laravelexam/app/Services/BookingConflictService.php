<?php

namespace App\Services;

use App\Repositories\BookingRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class BookingConflictService
{
    public function __construct(
        private BookingRepositoryInterface $bookingRepository
    ) {}

    /**
     * Generate a comprehensive conflict report.
     */
    public function generateConflictReport(?int $userId = null): array
    {
        $bookings = $userId 
            ? $this->bookingRepository->getByUser($userId)
            : $this->bookingRepository->all();

        $conflicts = $this->detectConflicts($bookings);
        $overlaps = $this->detectOverlaps($bookings);
        $gaps = $this->detectGaps($bookings);
        $suggestions = $this->generateSuggestions($bookings, $gaps);

        return [
            'total_bookings' => $bookings->count(),
            'conflicts' => $conflicts,
            'overlaps' => $overlaps,
            'gaps' => $gaps,
            'suggestions' => $suggestions,
            'summary' => $this->generateSummary($conflicts, $overlaps, $gaps),
        ];
    }

    /**
     * Detect exact conflicts (same date and time).
     */
    private function detectConflicts(Collection $bookings): array
    {
        $conflicts = [];

        foreach ($bookings as $booking) {
            $conflicting = $bookings->filter(function ($other) use ($booking) {
                return $other->id !== $booking->id
                    && $other->date->isSameDay($booking->date)
                    && $other->start_time === $booking->start_time
                    && $other->end_time === $booking->end_time;
            });

            if ($conflicting->isNotEmpty()) {
                $conflicts[] = [
                    'booking' => $this->formatBooking($booking),
                    'conflicting_with' => $conflicting->map(fn($b) => $this->formatBooking($b))->values(),
                ];
            }
        }

        return $this->removeDuplicateConflicts($conflicts);
    }

    /**
     * Detect overlapping bookings.
     */
    private function detectOverlaps(Collection $bookings): array
    {
        $overlaps = [];

        foreach ($bookings as $booking) {
            $overlapping = $bookings->filter(function ($other) use ($booking) {
                return $other->id !== $booking->id
                    && $other->date->isSameDay($booking->date)
                    && $this->hasTimeOverlap($booking, $other);
            });

            if ($overlapping->isNotEmpty()) {
                $overlaps[] = [
                    'booking' => $this->formatBooking($booking),
                    'overlapping_with' => $overlapping->map(fn($b) => $this->formatBooking($b))->values(),
                    'overlap_duration' => $this->calculateOverlapDuration($booking, $overlapping),
                ];
            }
        }

        return $this->removeDuplicateConflicts($overlaps);
    }

    /**
     * Detect gaps between consecutive bookings.
     */
    private function detectGaps(Collection $bookings): array
    {
        $gaps = [];
        $sortedBookings = $bookings->sortBy([
            ['date', 'asc'],
            ['start_time', 'asc'],
        ])->values();

        for ($i = 0; $i < $sortedBookings->count() - 1; $i++) {
            $current = $sortedBookings[$i];
            $next = $sortedBookings[$i + 1];

            if ($current->date->isSameDay($next->date)) {
                $currentEnd = Carbon::parse($current->end_time);
                $nextStart = Carbon::parse($next->start_time);

                if ($nextStart->greaterThan($currentEnd)) {
                    $gapMinutes = $currentEnd->diffInMinutes($nextStart);

                    $gaps[] = [
                        'between' => [
                            $this->formatBooking($current),
                            $this->formatBooking($next),
                        ],
                        'gap_duration_minutes' => $gapMinutes,
                        'gap_duration_formatted' => $this->formatDuration($gapMinutes),
                        'date' => $current->date->format('Y-m-d'),
                    ];
                }
            }
        }

        return $gaps;
    }

    /**
     * Check if two bookings have time overlap.
     */
    private function hasTimeOverlap($booking1, $booking2): bool
    {
        $start1 = Carbon::parse($booking1->start_time);
        $end1 = Carbon::parse($booking1->end_time);
        $start2 = Carbon::parse($booking2->start_time);
        $end2 = Carbon::parse($booking2->end_time);

        return $start1->lessThan($end2) && $end1->greaterThan($start2);
    }

    /**
     * Calculate overlap duration between bookings.
     */
    private function calculateOverlapDuration($booking, Collection $overlapping): string
    {
        $totalMinutes = 0;

        foreach ($overlapping as $other) {
            $start1 = Carbon::parse($booking->start_time);
            $end1 = Carbon::parse($booking->end_time);
            $start2 = Carbon::parse($other->start_time);
            $end2 = Carbon::parse($other->end_time);

            $overlapStart = $start1->greaterThan($start2) ? $start1 : $start2;
            $overlapEnd = $end1->lessThan($end2) ? $end1 : $end2;

            $totalMinutes += $overlapStart->diffInMinutes($overlapEnd);
        }

        return $this->formatDuration($totalMinutes);
    }

    /**
     * Generate smart suggestions based on gaps.
     */
    private function generateSuggestions(Collection $bookings, array $gaps): array
    {
        $suggestions = [];

        // Suggest filling small gaps
        foreach ($gaps as $gap) {
            if ($gap['gap_duration_minutes'] >= 30 && $gap['gap_duration_minutes'] <= 120) {
                $suggestions[] = [
                    'type' => 'fill_gap',
                    'message' => "Consider scheduling a {$gap['gap_duration_formatted']} booking on {$gap['date']}",
                    'gap' => $gap,
                ];
            }
        }

        // Suggest optimal booking times
        $busyDays = $bookings->groupBy(fn($b) => $b->date->format('Y-m-d'));
        foreach ($busyDays as $date => $dayBookings) {
            if ($dayBookings->count() >= 5) {
                $suggestions[] = [
                    'type' => 'busy_day',
                    'message' => "High activity on {$date} with {$dayBookings->count()} bookings",
                    'date' => $date,
                ];
            }
        }

        return $suggestions;
    }

    /**
     * Generate summary statistics.
     */
    private function generateSummary(array $conflicts, array $overlaps, array $gaps): array
    {
        return [
            'total_conflicts' => count($conflicts),
            'total_overlaps' => count($overlaps),
            'total_gaps' => count($gaps),
            'has_issues' => count($conflicts) > 0 || count($overlaps) > 0,
            'status' => $this->determineStatus($conflicts, $overlaps),
        ];
    }

    /**
     * Determine overall status.
     */
    private function determineStatus(array $conflicts, array $overlaps): string
    {
        if (count($conflicts) > 0) {
            return 'critical';
        }

        if (count($overlaps) > 0) {
            return 'warning';
        }

        return 'healthy';
    }

    /**
     * Format booking data.
     */
    private function formatBooking($booking): array
    {
        return [
            'id' => $booking->id,
            'date' => $booking->date->format('Y-m-d'),
            'start_time' => Carbon::parse($booking->start_time)->format('H:i'),
            'end_time' => Carbon::parse($booking->end_time)->format('H:i'),
            'title' => $booking->title,
            'user_id' => $booking->user_id,
        ];
    }

    /**
     * Format duration in human-readable format.
     */
    private function formatDuration(int $minutes): string
    {
        $hours = floor($minutes / 60);
        $mins = $minutes % 60;

        if ($hours > 0 && $mins > 0) {
            return "{$hours}h {$mins}m";
        } elseif ($hours > 0) {
            return "{$hours}h";
        }

        return "{$mins}m";
    }

    /**
     * Remove duplicate conflicts from array.
     */
    private function removeDuplicateConflicts(array $conflicts): array
    {
        $seen = [];
        $unique = [];

        foreach ($conflicts as $conflict) {
            $key = $conflict['booking']['id'];
            
            if (!isset($seen[$key])) {
                $seen[$key] = true;
                $unique[] = $conflict;
            }
        }

        return $unique;
    }
}