<?php

namespace App\Console\Commands;

use App\Models\User;

class DemoCron
{
    public static function start()
    {
        echo "Execute time is " . date("h:i:sa") . "\n";
        $user = new User();
        $user_data = $user->getUser(array(1));
        print_r($user_data);
    }
}
