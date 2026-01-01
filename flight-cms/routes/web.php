<?php

declare(strict_types=1);

Flight::route('GET /', static function (): void {
  Flight::panel('pages/index', ['title' => 'Dashboard']);
});

Flight::route('GET /posts', static function (): void {
  Flight::panel('pages/posts/index', ['title' => 'Posts']);
});

Flight::route('GET /posts/create', static function (): void {
  Flight::panel('pages/posts/create', ['title' => 'Create Post']);
});

Flight::map('notFound', static function (): void { 
  Flight::render('pages/404');
});

Flight::map('panel', static function (string $view, array $data = []): void {
  Flight::render($view, $data, 'content');
  Flight::render('components/header', [], 'header');
  Flight::render('components/sidebar', [], 'sidebar');
  Flight::render('layouts/panel', $data);
});