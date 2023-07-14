<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\HtmlString;

class PPResetPassword extends ResetPassword{
    public function __construct($token){
        parent::__construct($token);
    }

    public function toMail($notifiable){
        return parent::toMail($notifiable)
                ->line('Please do not reply to this email.')
                ->salutation(new HtmlString("<br>Regards,<br>TEESlab team"));
    }
}
