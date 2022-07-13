<?php

use Pecee\SimpleRouter\SimpleRouter as Router;
use Pecee\Http\Url;
use Pecee\Http\Response;
use Pecee\Http\Request;

/**
 * Get url for a route by using either name/alias, class or method name.
 *
 * The name parameter supports the following values:
 * - Route name
 * - Controller/resource name (with or without method)
 * - Controller class name
 *
 * When searching for controller/resource by name, you can use this syntax "route.name@method".
 * You can also use the same syntax when searching for a specific controller-class "MyController@home".
 * If no arguments is specified, it will return the url for the current loaded route.
 *
 * @param string|null $name
 * @param string|array|null $parameters
 * @param array|null $getParams
 * @return \Pecee\Http\Url
 * @throws \InvalidArgumentException
 */
function url(?string $name = null, $parameters = null, ?array $getParams = null): Url
{
    return Router::getUrl($name, $parameters, $getParams);
}

/**
 * @return \Pecee\Http\Response
 */
function response(): Response
{
    return Router::response();
}

/**
 * @return \Pecee\Http\Request
 */
function request(): Request
{
    return Router::request();
}

/**
 * Get input class
 * @param string|null $index Parameter index name
 * @param string|null $defaultValue Default return value
 * @param array ...$methods Default methods
 * @return \Pecee\Http\Input\InputHandler|array|string|null
 */
function input($index = null, $defaultValue = null, ...$methods)
{
    if ($index !== null) {
        return request()->getInputHandler()->value($index, $defaultValue, ...$methods);
    }

    return request()->getInputHandler();
}

/**
 * @param string $url
 * @param int|null $code
 */
function redirect(string $url, ?int $code = null): void
{
    if ($code !== null) {
        response()->httpCode($code);
    }

    response()->redirect($url);
}

/**
 * Get current csrf-token
 * @return string|null
 */
function csrf_token(): ?string
{
    $baseVerifier = Router::router()->getCsrfVerifier();
    if ($baseVerifier !== null) {
        return $baseVerifier->getTokenProvider()->getToken();
    }

    return null;
}

//Custom Helpers 

/**
 * Flatten the array
 * @return array|null
 */
function array_flatten(array $array)
{
    $return = array();
    array_walk_recursive($array, function ($a) use (&$return) {
        $return[] = $a;
    });
    return $return;
}

/**
 * Get data from .env
 * @return string
 */
function env($key, $value = null)
{
    if ($value) {
        $_ENV[$key] = $value;
    }
    return $_ENV[$key];
}


/**
 *  Given a valid file location (it must be an path starting with "/"), i.e. "/css/style.css",
 *  it returns a string containing the file's mtime as query string, i.e. "/css/style.css?v=0123456789".
 *  Otherwise, it returns the file location.
 *
 *  @param $file  the file to be loaded.
 */
// function auto_version($file)
// {
//     // if it is not a valid path (example: a CDN url)
//     if (strpos($file, '/') !== 0 || !file_exists($_SERVER['DOCUMENT_ROOT'] . $file)) return $file;

//     // retrieving the file modification time
//     // https://www.php.net/manual/en/function.filemtime.php
//     $mtime = filemtime($_SERVER['DOCUMENT_ROOT'] . $file);

//     return sprintf("%s?v=%d", $file, $mtime);
// }

function asset_version($file)
{
    // if it is not a valid path (example: a CDN url)
    if (strpos($file, '/') !== 0 || !file_exists($_SERVER['DOCUMENT_ROOT'] . $file)) return $file;
    return sprintf("%s?v=%s", $file, env('ASSETS_VERSION'));
}


function escape($string)
{
    return htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
    // return htmlspecialchars($string, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    // return htmlentities($string, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

function config($config)
{
    return  (object) include('../config/' . $config . '.php');
}
