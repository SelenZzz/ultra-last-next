<?php

use Donner\BasicRouter;

require_once 'vendor/autoload.php';

set_time_limit(0);
@error_reporting(E_ALL ^ E_WARNING ^ E_NOTICE ^ E_DEPRECATED);

BasicRouter::create()
  ->addController(new App\Controllers\StaticController())
  ->setNotFoundController(new App\Controllers\StaticController())
  ->run();
