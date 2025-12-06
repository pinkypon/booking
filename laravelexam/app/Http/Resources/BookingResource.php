<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Parse string times to Carbon instances for formatting
        $startTime = Carbon::parse($this->start_time);
        $endTime = Carbon::parse($this->end_time);

        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                ];
            }),
            'date' => $this->date instanceof Carbon 
                ? $this->date->format('Y-m-d') 
                : $this->date, // Handle both Carbon and string
            'start_time' => $startTime->format('H:i'),
            'end_time' => $endTime->format('H:i'),
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'duration_minutes' => $startTime->diffInMinutes($endTime),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}