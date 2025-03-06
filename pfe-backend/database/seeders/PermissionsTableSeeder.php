<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionsTableSeeder extends Seeder
{
    public function run()
    {
        $permissions = [
            'CLIMAT' => [
                ['label' => 'Carte Neige', 'icon' => '❄️'],
                ['label' => 'Carte Ecart-RR-ABH', 'icon' => '📊'],
                ['label' => 'Climatologie‑Réanalyses', 'icon' => '📈'],
                ['label' => 'Suivi-Sécheresse', 'icon' => '💧'],
                ['label' => 'Indicateurs-DBClimat', 'icon' => '⚙️'],
                ['label' => 'Records', 'icon' => '🏆'],
                ['label' => 'Qualité de l\'air', 'icon' => '🌬️'],
            ],
            'OBSERVATION' => [
                ['label' => 'Obsmet-Maroc', 'icon' => '🔭'],
                ['label' => 'Planche-Quotidienne', 'icon' => '🗓️'],
                ['label' => 'Planche-Provinciale', 'icon' => '📅'],
                ['label' => 'Planche-Horaire', 'icon' => '⏰'],
                ['label' => 'Planche-Décadaire', 'icon' => '📆'],
                ['label' => 'Planche-Précipitation', 'icon' => '🌧️'],
                ['label' => 'Planche-Neige', 'icon' => '❄️'],
                ['label' => 'Postes - Auxiliaires', 'icon' => '⚡'],
                ['label' => 'Pluvio-Urbain', 'icon' => '🌂'],
                ['label' => 'Obsmap-Maroc', 'icon' => '🗺️'],
                ['label' => 'Map-Observation', 'icon' => '🗺️'],
                ['label' => 'Map-Précipitation', 'icon' => '🗺️'],
            ],
            'TELEDETECTION' => [
                ['label' => 'Satellite-Standard', 'icon' => '🛰️'],
                ['label' => 'Satellite-Developpe', 'icon' => '🚀'],
                ['label' => 'Radar-Standard', 'icon' => '📡'],
                ['label' => 'Radar-Developpe', 'icon' => '📡'],
                ['label' => 'Foudre-Standard', 'icon' => '⚡'],
            ],
            'MODELISATION' => [
                ['label' => 'Météographes', 'icon' => '🌤️'],
                ['label' => 'Modele-NUMERIQUE', 'icon' => '💻'],
                ['label' => 'Modele-MARINE', 'icon' => '🚢'],
            ],
            'PREVISION' => [
                ['label' => 'Prévision-Maroc', 'icon' => '🌦️'],
                ['label' => 'Prévision-Monde', 'icon' => '🌍'],
                ['label' => 'Prévision-Ma-Plage', 'icon' => '🏖️'],
                ['label' => 'Légende icones', 'icon' => '📜'],
            ],
            'CARTOGRAPHIE' => [
                ['label' => 'Map-Vigilances', 'icon' => '🗺️'],
                ['label' => 'Map-Modeles', 'icon' => '🗺️'],
                ['label' => 'Map-Observation', 'icon' => '🗺️'],
                ['label' => 'Ma-Plage', 'icon' => '🏝️'],
            ],
        ];

        foreach ($permissions as $category => $perms) {
            foreach ($perms as $perm) {
                Permission::create([
                    'category' => $category,
                    'label'    => $perm['label'],
                    'icon'     => $perm['icon']
                ]);
            }
        }
    }
}
