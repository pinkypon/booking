<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConflictReportResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'total_bookings' => $this->resource['total_bookings'],
            'conflicts' => $this->resource['conflicts'],
            'overlaps' => $this->resource['overlaps'],
            'gaps' => $this->resource['gaps'],
            'suggestions' => $this->resource['suggestions'],
            'summary' => $this->resource['summary'],
            'generated_at' => now()->toISOString(),
        ];
    }
}
