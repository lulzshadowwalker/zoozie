<?php

declare(strict_types=1);

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Middlewares\AuthMiddleware;
use App\Http\Middlewares\GuestMiddleware;

$authMiddleware = new AuthMiddleware();
$guestMiddleware = new GuestMiddleware();

Flight::route('GET /login', [AuthController::class, 'login'])->addMiddleware($guestMiddleware);
Flight::route('POST /login', [AuthController::class, 'authenticate'])->addMiddleware($guestMiddleware);
Flight::route('GET /logout', [AuthController::class, 'logout'])->addMiddleware($authMiddleware);

Flight::group('', function () {
    Flight::route('GET /', static function (): void {
        Flight::panel('pages/index', ['title' => 'Dashboard']);
    });

    Flight::route('GET /posts', [PostController::class, 'index']);
    Flight::route('POST /posts', [PostController::class, 'store']);
    Flight::route('GET /posts/create', [PostController::class, 'create']);
    Flight::route('DELETE /posts/@id', [PostController::class, 'destroy']);
}, [$authMiddleware]);

// TODO: 500 page
Flight::map('notFound', static function (): void {
  Flight::render('pages/404');
});

Flight::map('panel', static function (string $view, array $data = []): void {
  Flight::render($view, $data, 'content');
  Flight::render('components/header', [], 'header');
  Flight::render('components/sidebar', [], 'sidebar');
  Flight::render('components/alert', [], 'alert');
  Flight::render('layouts/panel', $data);
});
