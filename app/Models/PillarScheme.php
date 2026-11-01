<?php

namespace App\Models;

/**
 * @property integer $pillar_id
 * @property integer $scheme_id
 * @property float $weight
 */
class PillarScheme extends Model{
    protected $table = 'pillars_schemes';
    protected $fillable = ['pillar_id', 'scheme_id', 'weight'];

    public function pillar(){
        return $this->belongsTo(Pillar::class);
    }

    public function scheme(){
        return $this->belongsTo(Scheme::class);
    }
}
