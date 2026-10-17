<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model as EloquentModel;

/**
 * @property integer $id
 */
abstract class Model extends EloquentModel{
    public $timestamps = false;
}
