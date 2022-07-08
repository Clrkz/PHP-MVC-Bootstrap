<?php

namespace App\Controllers;

use App\Utilities\Session;
use App\Core\View;

class DefaultController
{

	public function mainIndex()
	{
		View::render('dashboard', get_defined_vars());
	}
}
