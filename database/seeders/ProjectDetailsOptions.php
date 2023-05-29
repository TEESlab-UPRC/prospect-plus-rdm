<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Phase;
use App\Models\Plan;
use App\Models\Type;

class ProjectDetailsOptions extends Seeder{
    public function run(): void{
        array_map(fn($a) => Plan::create(['answer' => $a]), [
            'Yes',
            'Partially',
            'No'
        ]);

        array_map(fn($a) => Type::create(['answer' => $a]), [
            'Technical or Non-technical',
            'Legislative',
            'Normative'
        ]);

        array_map(fn($a) => Phase::create(['answer' => $a]), [
            'Development',
            'Implementation',
            'Monitoring'
        ]);
    }
}
