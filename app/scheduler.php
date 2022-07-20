<?php
error_reporting(E_ALL);
// load composer dependencies
require_once '../vendor/autoload.php';
// Load Config
// require_once '../app/config.php';
// Load our helpers
require_once '../app/helpers.php';

use GO\Scheduler;

$dotenv = \Dotenv\Dotenv::createImmutable(dirname(__DIR__));
$dotenv->load();

date_default_timezone_set(env('APP_TIMEZONE'));


$scheduler = new Scheduler();
$scheduler_log_dir = __DIR__ . '/../public/' . env('APP_DISK') . '/logs/scheduler/';

if (!file_exists($scheduler_log_dir)) {
	mkdir($scheduler_log_dir, 0777, true);
}



// $scheduler->call(function () {
// 	echo "Execute time is " . date("h:i:sa") . "\n";
// 	$user = new \App\Models\User();
// 	$user_data = $user->getUser(array(1));
// 	print_r($user_data);
// })->output('scheduler.log')->everyMinute();

// $scheduler->call(function () {
// 	echo "The time is " . date("h:i:sa");
// })->output('scheduler1.log')->everyMinute();

$scheduler->call(function () {
	\App\Console\Commands\DemoCron::start();
})
	->output($scheduler_log_dir . 'democron_' . date('m-d-Y_hia') . '.log')
	->everyMinute();

// $scheduler->run(); //live
$scheduler->work(); //local
