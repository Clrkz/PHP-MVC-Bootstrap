<?php

namespace App\Utilities;

class Utility
{
    public static function alphaNumericOnly($data)
    {
        $str = preg_replace("/[^a-zA-Z0-9]+/", "", $data);
        if (strlen($str) < 5) {
            return "";
        }
        return $str;
    }


    public static function nullEmptyArray($array)
    {
        foreach ($array as $key => $value) {
            if (is_array($value)) {
                $array[$key]  =  self::nullEmptyArray($value);
            }
            if (empty($value) && !strlen($value)) {
                $array[$key] = NULL;
            }
        }

        return $array;
    }

    public static function emptyNullArray($array)
    {
        foreach ($array as $key => $value) {
            if (is_array($value)) {
                $array[$key]  =  self::emptyNullArray($value);
            }
            if ($value === null) {
                $array[$key] = "";
            }
        }

        return $array;
    }

    public static function toUpperCase($data)
    {
        if (is_array($data)) {
            foreach ($data as $key => $value) {
                if (is_array($value)) {
                    $data[$key]  =  self::toUpperCase($value);
                } else {
                    $data[$key] = strtoupper($data[$key]);
                }
            }
            return $data;
        } else {
            return strtoupper($data);
        }
    }

    public static function includeFiles($directory)
    {
        if (is_dir($directory)) {
            $scan = scandir($directory);
            unset($scan[0], $scan[1]); //unset . and ..
            foreach ($scan as $file) {
                if (is_dir($directory . "/" . $file)) {
                    self::includeFiles($directory . "/" . $file);
                } else {
                    if (strpos($file, '.php') !== false) {
                        include_once($directory . "/" . $file);
                    }
                }
            }
        }
    }

    public static function numberFormat($number)
    {
        return number_format($number, 2, '.', ',');
    }
}
