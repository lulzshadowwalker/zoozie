<?php

declare (strict_types = 1);

namespace App\Exceptions;

use Exception;

class ValidationException extends Exception
{
    public readonly array $errors;

    public readonly array $old;

    public function __construct(array $errors, array $old)
    {
        $this->errors = $errors;
        $this->old = $old;
    }
}