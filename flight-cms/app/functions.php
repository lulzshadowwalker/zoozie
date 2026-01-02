<?php

declare (strict_types = 1);

use App\Support\Vite;

function vite(string $entry): string
{
    return Vite::asset($entry);
}

function message(string $entry): string
{
    $messages = Flight::flash('errors') ?? [];
    return $messages[$entry] ?? '';
}

function error(string $field): bool
{
    $errors = Flight::flash('errors') ?? [];
    return isset($errors[$field]);
}

function old(string $field, $default = ''): string
{
    $old = Flight::flash('old') ?? [];
    return $old[$field] ?? $default;
}