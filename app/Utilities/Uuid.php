<?php

namespace App\Utilities;

use Ramsey\Uuid\Uuid as rUuid;
// use App\Core\View; 

class Uuid
{
    public static function long()
    {

        return rUuid::uuid4();
        // $sql = "SELECT UUID()";
        // $db_handle = new \App\Core\Database;
        // $result = $db_handle->selectBaseQuery($sql);
        // return $result;
    }
    public static function short()
    {

        return rUuid::uuid4();
        // $sql = "SELECT UUID_SHORT()";
        // $db_handle = new \App\Core\Database;
        // $result = $db_handle->selectBaseQuery($sql);
        // return $result;
    }
}
