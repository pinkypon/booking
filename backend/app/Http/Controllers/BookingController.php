<?php

namespace App\Http\Controllers;

use App\Events\BookingCreated;
use App\Events\BookingDeleted;
use App\Events\BookingUpdated;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingRequest;
use App\Http\Resources\BookingResource;
use App\Http\Resources\ConflictReportResource;
use App\Repositories\BookingRepositoryInterface;
use App\Services\BookingConflictService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class BookingController extends Controller
{
    public function __construct(
        private BookingRepositoryInterface $bookingRepository,
        private BookingConflictService $conflictService
    ) {}

    /**
     * Display a listing of the user's bookings.
     */
    public function index(): AnonymousResourceCollection
    {
        $userId = auth()->id();
        $bookings = $this->bookingRepository->getByUser($userId);

        return BookingResource::collection($bookings);
    }

    /**
     * Store a newly created booking.
     */
    public function store(StoreBookingRequest $request): JsonResponse
    {
        // user_id is already added in StoreBookingRequest::prepareForValidation()
        $booking = $this->bookingRepository->create($request->validated());

        // 🔥 Broadcast the event for real-time updates
        event(new BookingCreated($booking));

        return response()->json([
            'message' => 'Booking created successfully',
            'data' => new BookingResource($booking),
        ], 201);
    }

    /**
     * Display the specified booking.
     */
    public function show(int $id): JsonResponse
    {
        $booking = $this->bookingRepository->find($id);

        if (!$booking) {
            return response()->json([
                'message' => 'Booking not found',
            ], 404);
        }

        $user = auth()->user();

        // Check authorization
        if ($booking->user_id !== $user->id && !$user->is_admin) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        return response()->json([
            'data' => new BookingResource($booking),
        ]);
    }

    /**
     * Update the specified booking.
     */
    public function update(UpdateBookingRequest $request, int $id): JsonResponse
    {
        $booking = $this->bookingRepository->find($id);

        if (!$booking) {
            return response()->json([
                'message' => 'Booking not found',
            ], 404);
        }

        $user = auth()->user();

        // 🔥 CRITICAL: Check authorization - user can only update their own bookings
        if ($booking->user_id !== $user->id && !$user->is_admin) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $updated = $this->bookingRepository->update($id, $request->validated());

        if (!$updated) {
            return response()->json([
                'message' => 'Failed to update booking',
            ], 500);
        }

        $booking = $this->bookingRepository->find($id);

        // 🔥 Broadcast the event for real-time updates
        event(new BookingUpdated($booking));

        return response()->json([
            'message' => 'Booking updated successfully',
            'data' => new BookingResource($booking),
        ]);
    }

    /**
     * Remove the specified booking.
     */
    public function destroy(int $id): JsonResponse
    {
        $booking = $this->bookingRepository->find($id);

        if (!$booking) {
            return response()->json([
                'message' => 'Booking not found',
            ], 404);
        }

        $user = auth()->user();

        // Check authorization
        if ($booking->user_id !== $user->id && !$user->is_admin) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        // Store the booking ID before deletion
        $bookingId = $booking->id;

        $deleted = $this->bookingRepository->delete($id);

        if (!$deleted) {
            return response()->json([
                'message' => 'Failed to delete booking',
            ], 500);
        }

        // 🔥 Broadcast the event for real-time updates
        event(new BookingDeleted($bookingId));

        return response()->json([
            'message' => 'Booking deleted successfully',
        ]);
    }

    /**
     * Get conflict report for the authenticated user's bookings.
     */
    public function conflictReport(): JsonResponse
    {
        $userId = auth()->id();
        $report = $this->conflictService->generateConflictReport($userId);

        return response()->json([
            'data' => new ConflictReportResource($report),
        ]);
    }
}