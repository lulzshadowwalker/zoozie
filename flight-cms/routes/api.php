<?php

declare(strict_types=1);

Flight::group('/api', static function (): void {
  Flight::route('GET /status', static fn() => Flight::json(['status' => 'ok']));

  Flight::route('GET /v1/posts', static function (): void {
    $acceptLanguage = $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? 'en';
    $locale = explode(',', $acceptLanguage)[0];
    $locale = explode('-', $locale)[0];

    $posts = Flight::posts()->getByLocale($locale);
    Flight::json($posts);
  });
});
