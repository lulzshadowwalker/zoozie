<?php

declare(strict_types=1);

namespace App\Http\Middlewares;

use Flight;

class GuestMiddleware
{
    public function before(array $params): void
    {
        if (! Flight::session()->get('user_id')) {
            return;
        }

        Flight::redirect('/');
    }
}
