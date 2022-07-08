<?php

namespace App\Models;

//Tips for impelementing codes

use App\Core\Model;
use App\Core\Database;

class User extends Model
{

    public function getUser($array_data)
    {
        $query = "SELECT * FROM `users` WHERE 1 AND `id` = ?";
        $paramType = "i";
        $response = Database::connect()->runQuery($query, $paramType, $array_data);
        return count($response) > 0 ? $response[0] : $response;
    }

    public function getUserByEmail($array_data)
    {
        $query = "SELECT * FROM `users` WHERE 1 AND `email` = ?";
        $paramType = "s";
        $response = Database::connect()->runQuery($query, $paramType, $array_data);
        return count($response) > 0 ? $response[0] : $response;
    }
    public function getUserByUsername($array_data)
    {
        $query = "SELECT * FROM `users` WHERE 1 AND `username` = ?";
        $paramType = "s";
        $response = Database::connect()->runQuery($query, $paramType, $array_data);
        return count($response) > 0 ? $response[0] : $response;
    }

    public function getUserStatus($array_data)
    {
        $query = "SELECT * FROM `users` WHERE 1 AND `id` = ? AND status = 1 AND active = 1";
        $paramType = "i";
        $response =  Database::connect()->runQuery($query, $paramType, $array_data);
        return count($response) > 0 ? $response[0] : $response;
    }

    public function createLoginToken($array_data)
    {
        $query = "INSERT INTO `users_login_session_token`(`user_id`, `token`, `updated_at`,`status`) VALUES (?,?,NOW(),1) ON DUPLICATE KEY UPDATE    
							token  = VALUES (token),
                            updated_at = VALUES(updated_at),
                            status = VALUES(status)
                            ";
        $paramType = "is";
        $insertId =  Database::connect()->insert($query, $paramType, $array_data);
        return $insertId;
    }


    public function createLastLoginDate($array_data)
    {
        $query = "UPDATE users SET last_login = NOW() WHERE id = ?";
        $paramType = "i";
        Database::connect()->update($query, $paramType, $array_data);
    }

    public function getUserIdBySessionToken($array_data)
    {
        $query = "SELECT user_id FROM users_login_session_token WHERE token = ? AND status = 1";
        $paramType = "s";
        return Database::connect()->select($query, $paramType, $array_data);
    }
}
