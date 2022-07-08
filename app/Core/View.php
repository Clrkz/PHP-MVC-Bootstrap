<?php

namespace App\Core;

class View
{

    public static function render($view, $args = [])
    {
        extract($args, EXTR_SKIP);

        $file = dirname(dirname(dirname(__FILE__))) . '/resources/views/' . $view . '.php';

        if (is_readable($file)) {
            require_once $file;
        } else {
            throw new \Exception("$file not found");
        }
    }
}
