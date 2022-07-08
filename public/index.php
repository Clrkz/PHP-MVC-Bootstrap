<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
// ini_set("session.cookie_secure", '1');
ini_set("session.cookie_httponly", '1');
// load composer dependencies
require_once '../vendor/autoload.php';
// Load Config
// require_once '../app/config.php';
// Load our helpers
require_once '../app/helpers.php';

$dotenv = \Dotenv\Dotenv::createImmutable(dirname(__DIR__));
$dotenv->load();

error_reporting(E_ALL);
date_default_timezone_set(env('APP_TIMEZONE'));
/**
 *  Set session
 */
session_start();

/**
 * Set Defaults
 */
// env('CURRENCY_SYMBOL', \App\Models\Currency::getDefaultSymbol());

// Start the routing
\App\Router::start();
