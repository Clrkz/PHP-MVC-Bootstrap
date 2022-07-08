<?php

namespace App\Utilities;

class Slug
{
    public static function create($data){ 
        $data = strtolower(trim($data));
        $slug=preg_replace('/[^A-Za-z0-9-]+/', '-', $data);
        return $slug;
    }
}