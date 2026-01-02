<?php

declare(strict_types=1);

use App\Exceptions\ValidationException;
use App\Repositories\PostRepository;
use App\Repositories\UserRepository;
use flight\Container;
use flight\Session;
use Symfony\Component\Dotenv\Dotenv;

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/routes/web.php';
require_once __DIR__ . '/routes/api.php';
require_once __DIR__ . '/app/functions.php';

$dotenv = new Dotenv;
$dotenv->load(__DIR__ . '/.env.dist', __DIR__ . '/.env');

$container = new Container;

$container->singleton(PDO::class, static fn(): PDO => new PDO(
  match (strtolower((string) $_ENV['DB_CONNECTION'])) {
    'sqlite' => 'sqlite:'
      . __DIR__
      . '/database/'
      . ($_ENV['DB_DATABASE'] ?? 'flighravel')
      . '.db',
    'mysql' => 'mysql:host='
      . $_ENV['DB_HOST']
      . ';dbname='
      . $_ENV['DB_DATABASE']
      . ';port='
      . $_ENV['DB_PORT'],
  },
  $_ENV['DB_USERNAME'] ?? null,
  $_ENV['DB_PASSWORD'] ?? null,
));

Flight::registerContainerHandler($container->get(...));

Flight::register('db', \flight\database\PdoWrapper::class, [
  "mysql:host={$_ENV['DB_HOST']};dbname={$_ENV['DB_DATABASE']};port={$_ENV['DB_PORT']}",
  $_ENV['DB_USERNAME'],
  $_ENV['DB_PASSWORD'],
  [
    PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES \'utf8mb4\'',
    PDO::ATTR_EMULATE_PREPARES => false,
    PDO::ATTR_STRINGIFY_FETCHES => false,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
  ]
]);

Flight::register('posts', PostRepository::class, [Flight::db()]);
Flight::register('user', UserRepository::class, [Flight::db()]);

Flight::register('session', Session::class);

Flight::map('flash', function (string $key, $value = null) {
  $session = Flight::session();

  // get
  if ($value === null) {
    $data = $session->get('__flash', []);
    if (! array_key_exists($key, $data)) {
      return null;
    }

    return $data[$key];
  }

  // set
  $data = $session->get('__flash', []);
  $data[$key] = $value;
  $session->set('__flash', $data);
});

Flight::map('unflash', function () {
  Flight::session()->set('__flash', []);
});

Flight::set('flight.views.path', 'resources/views');
Flight::view()->preserveVars = false;

try {
  Flight::start();
} catch (ValidationException $e) {
  Flight::flash('errors', $e->errors);
  Flight::flash('old', $e->old);

  Flight::redirect(Flight::request()->referrer, 303);
  exit(); // I am not sure if flight halts execution after a redirect.
}

Flight::unflash();
