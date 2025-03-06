<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Commandes personnalisées pour le projet météo.
     */
    protected $commands = [
        Commands\FetchWeatherDataCommand::class, // Commande pour récupérer les données météo
        Commands\CleanOldDataCommand::class,     // Nettoyage des anciennes données
    ];

    /**
     * Planification des tâches.
     */
    protected function schedule(Schedule $schedule)
    {
        // Récupération des données météo toutes les heures
        $schedule->command('weather:fetch')
                 ->hourly()
                 ->withoutOverlapping();

        // Nettoyage des données anciennes chaque nuit
        $schedule->command('data:clean')
                 ->dailyAt('03:00');
    }

    /**
     * Enregistrement des commandes.
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');
        require base_path('routes/console.php');
    }
}