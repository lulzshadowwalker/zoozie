<?php

declare (strict_types = 1);

use App\Support\Vite;

function vite(string $entry): string
{
    return Vite::asset($entry);
}