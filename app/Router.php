<?php
//Fix file do not modify
/**
 * Custom router which handles default middlewares, default exceptions and things
 * that should be happen before and after the router is initialised.
 */

namespace App;

use Pecee\SimpleRouter\SimpleRouter;

class Router extends SimpleRouter
{
	/**
	 * @throws \Exception
	 * @throws \Pecee\Http\Middleware\Exceptions\TokenMismatchException
	 * @throws \Pecee\SimpleRouter\Exceptions\HttpException
	 * @throws \Pecee\SimpleRouter\Exceptions\NotFoundHttpException
	 */
	public static function start(): void
	{
		// Load our helpers
		// require_once 'helpers.php'; move to index

		Router::csrfVerifier(new \App\Middlewares\CsrfVerifier());

		Router::setDefaultNamespace('\App\Controllers');

		Router::group(['exceptionHandler' => \App\Handlers\CustomExceptionHandler::class], function () {
			// API
			// Router::group(['prefix' => '/api', 'middleware' => \App\Middlewares\ApiVerification::class], function () {
			// 	Router::resource('/demo', 'ApiController');
			// });

			// Load our custom routes
			$gfg_folderpath = "../routes/";
			\App\Utilities\Utility::includeFiles($gfg_folderpath);
		});

		// Do initial stuff 
		parent::start();
	}
}
