<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Support\Validator;
use Flight;

abstract class BaseRequest
{
    public static function make(): self
    {
        $instance = new static();

        $instance->validate();

        return $instance;
    }

    public function data(): object
    {
        return (object) Flight::request()->data->getData();
    }

    public function validate(): void
    {
        Validator::make(
            (array) $this->data(),
            $this->rules()
        )->validate();
    }

    public function __get(string $name)
    {
        $data = $this->data();
        if (! isset($data->$name)) {
            return null;
        }

        return $data->$name;
    }

    abstract public function rules(): array;
}
