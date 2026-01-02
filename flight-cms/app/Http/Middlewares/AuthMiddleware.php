<?php

declare(strict_types=1);

namespace App\Http\Middlewares;

use Flight;

class AuthMiddleware
{
    public function before(array $params): void
    {
        if (Flight::session()->get('user_id')) {
            return;
        }

        Flight::redirect('/login');
    }
}
