<?php

namespace App\Console\Commands;

use App\Repositories\BookingRepositoryInterface;
use Illuminate\Console\Command;

class CleanupOldBookings extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'bookings:cleanup
                            {--days=30 : Number of days to keep bookings}
                            {--dry-run : Run without actually deleting}';

    /**
     * The console command description.
     */
    protected $description = 'Delete bookings older than specified days';

    public function __construct(
        private BookingRepositoryInterface $bookingRepository
    ) {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $days = (int) $this->option('days');
        $dryRun = $this->option('dry-run');

        $this->info("Searching for bookings older than {$days} days...");

        $oldBookings = $this->bookingRepository->getOlderThan($days);
        $count = $oldBookings->count();

        if ($count === 0) {
            $this->info('No old bookings found.');
            return self::SUCCESS;
        }

        $this->warn("Found {$count} booking(s) to delete.");

        if ($dryRun) {
            $this->table(
                ['ID', 'Date', 'User ID', 'Title'],
                $oldBookings->map(fn($b) => [
                    $b->id,
                    $b->date->format('Y-m-d'),
                    $b->user_id,
                    $b->title ?? 'N/A',
                ])
            );
            $this->info('Dry run completed. No bookings were deleted.');
            return self::SUCCESS;
        }

        if (!$this->confirm('Do you want to proceed with deletion?')) {
            $this->info('Operation cancelled.');
            return self::SUCCESS;
        }

        $deleted = $this->bookingRepository->deleteOlderThan($days);

        $this->info("Successfully deleted {$deleted} booking(s).");

        return self::SUCCESS;
    }
}