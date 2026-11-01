<?php

namespace App\Models;

class Pillar extends TitleModel{
    public function questions(){
        return $this->hasMany(Question::class);
    }

    public function pillarsSchemes(){
        return $this->hasMany(PillarScheme::class);
    }
}
