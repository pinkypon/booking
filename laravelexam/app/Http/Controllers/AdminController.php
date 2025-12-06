<?php

namespace App\Http\Controllers;

use App\Http\Resources\BookingResource;
use App\Http\Resources\ConflictReportResource;
use App\Repositories\BookingRepositoryInterface;
use App\Services\BookingConflictService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminController extends Controller
{
    public function __construct(
        private BookingRepositoryInterface $bookingRepository,
        private BookingConflictService $conflictService
    ) {}

    /**
     * Display all bookings (admin only).
     */
    public function index(): AnonymousResourceCollection
    {
        $bookings = $this->bookingRepository->getAllWithUser();

        return BookingResource::collection($bookings);
    }

    /**
     * Get conflict report for all bookings (admin only).
     */
    public function conflictReport(): JsonResponse
    {
        $report = $this->conflictService->generateConflictReport();

        return response()->json([
            'data' => new ConflictReportResource($report),
        ]);
    }

    /**
     * Get statistics dashboard data (admin only).
     */
    public function dashboard(): JsonResponse
    {
        $bookings = $this->bookingRepository->all();
        $report = $this->conflictService->generateConflictReport();

        return response()->json([
            'data' => [
                'total_bookings' => $bookings->count(),
                'total_users' => $bookings->unique('user_id')->count(),
                'bookings_today' => $bookings->filter(fn($b) => $b->date->isToday())->count(),
                'bookings_this_week' => $bookings->filter(fn($b) => $b->date->isCurrentWeek())->count(),
                'conflicts_summary' => $report['summary'],
                'recent_bookings' => BookingResource::collection($bookings->take(10)),
            ],
        ]);
    }
}