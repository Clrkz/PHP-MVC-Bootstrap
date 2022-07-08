<?php

namespace App\Core;

class Database
{
    private static $host;
    private static $user;
    private static $password;
    private static $database;
    private static $conn;

    private static $instance;

    function __construct()
    {

        self::$host = env('DB_HOST');
        self::$user = env('DB_USERNAME');
        self::$password = env('DB_PASSWORD');
        self::$database = env('DB_DATABASE');

        self::$conn = self::connectDB();

        //Server Config
        self::$conn->query("SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));");
        // ini_set('memory_limit', '-1');
    }

    public static function connect()
    {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public static function connectDB()
    {
        $conn = mysqli_connect(self::$host, self::$user, self::$password, self::$database);
        return $conn;
    }

    public static function runBaseQuery($query)
    {
        $result = self::$conn->query($query);
        if (self::$conn->error) {
            return self::$conn->error;
        }
        $resultset = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $resultset[] = $row;
            }
        }
        return $resultset;
    }


    public static function runQuery($query, $param_type, $param_value_array)
    {
        $sql = self::$conn->prepare($query);
        if (self::$conn->error) {
            return self::$conn->error;
        }
        self::bindQueryParams($sql, $param_type, $param_value_array);
        $sql->execute();
        $result = $sql->get_result();

        $resultset = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $resultset[] = $row;
            }
        }

        return $resultset;
    }

    public static function bindQueryParams($sql, $param_type, $param_value_array)
    {
        $param_value_reference[] = &$param_type;
        for ($i = 0; $i < count($param_value_array); $i++) {
            $param_value_reference[] = &$param_value_array[$i];
        }
        call_user_func_array(array(
            $sql,
            'bind_param'
        ), $param_value_reference);
    }

    public static function insert($query, $param_type, $param_value_array)
    {
        $sql = self::$conn->prepare($query);
        if (self::$conn->error) {
            return self::$conn->error;
        }
        self::bindQueryParams($sql, $param_type, $param_value_array);
        $sql->execute();
        if ($sql->errno) {
            return $sql->error;
        }
        $insertId = $sql->insert_id;
        return $insertId;
    }

    public static function update($query, $param_type, $param_value_array)
    {
        $sql = self::$conn->prepare($query);
        if (self::$conn->error) {
            return self::$conn->error;
        }
        self::bindQueryParams($sql, $param_type, $param_value_array);
        $sql->execute();
        if ($sql->errno) {
            return $sql->error;
        }
        return  $sql->affected_rows;
    }

    public static function select($query, $param_type, $param_value_array)
    {
        $sql = self::$conn->prepare($query);
        if (self::$conn->error) {
            return self::$conn->error;
        }
        self::bindQueryParams($sql, $param_type, $param_value_array);
        $sql->execute();
        $result = $sql->get_result();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $resultset[] = $row;
                foreach ($resultset as $resultsetRow) {
                    foreach ($resultsetRow as $resultsetRowRow) {
                        return $resultsetRowRow;
                    }
                }
            }
        } else {
            return '';
        }
    }


    public static function selectBaseQuery($query)
    {
        $result = self::$conn->query($query);
        if (self::$conn->error) {
            return self::$conn->error;
        }
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $resultset[] = $row;
                foreach ($resultset as $resultsetRow) {
                    foreach ($resultsetRow as $resultsetRowRow) {
                        return $resultsetRowRow;
                    }
                }
            }
        } else {
            return '';
        }
    }

    public static function insertBaseQuery($query)
    {
        $sql = self::$conn->prepare($query);
        if (self::$conn->error) {
            return self::$conn->error;
        }
        $sql->execute();
        if ($sql->errno) {
            return $sql->error;
        }
        $insertId = $sql->insert_id;
        return $insertId;
    }


    public static function updateBaseQuery($query)
    {
        $sql = self::$conn->prepare($query);
        if (self::$conn->error) {
            return self::$conn->error;
        }
        $sql->execute();
        if ($sql->errno) {
            return $sql->error;
        }
        return  $sql->affected_rows;
    }
}
