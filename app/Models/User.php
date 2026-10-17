<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Laravel\Sanctum\HasApiTokens;
use App\Notifications\PPResetPassword;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

/**
 * @property integer $id
 * @property string $name
 * @property string $email
 * @property \Illuminate\Support\Carbon $email_verified_at
 * @property string $password
 * @property string $remember_token
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class User extends Authenticatable{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = ['name', 'email', 'password'];
    protected $hidden = ['password', 'remember_token'];
    protected $casts = ['email_verified_at' => 'datetime'];

    public function analyses(){
        return $this->hasMany(Analysis::class);
    }

    public function latestAnalysis(){
        return $this->hasOne(Analysis::class)->latestOfMany();
    }

    public function sendPasswordResetNotification($token){
        $this->notify(new PPResetPassword($token));
    }
}
