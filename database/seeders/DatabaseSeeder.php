<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder{
    /**
     * Seed the application's database. Call other seeders here.
     */
    public function run(): void{
        $this->call([
            QuestionnaireData::class,
            ProjectDetailsOptions::class
        ]);
    }
}
