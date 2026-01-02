<?php

declare(strict_types=1);

namespace App\Support;

use App\Exceptions\ValidationException;
use Exception;

class Validator
{
    protected array $errors;

    protected array $data;

    protected array $rules;

    public function __construct(array $data, array $rules)
    {
        $this->errors = [];
        $this->data = $data;
        $this->rules = $rules;
    }

    public static function make(array $data, array $rules): self
    {
        return new static($data, $rules);
    }

    public function validate(): void
    {
        foreach ($this->rules as $field => $fieldRules) {
            $value = $this->data[$field] ?? null;
            foreach ($fieldRules as $rule) {
                if ($rule === 'required' && (is_null($value) || $value === '')) {
                    $this->errors[$field] = 'The ' . $field . ' field is required.';
                }
                if ($rule === 'email' && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                    $this->errors[$field] = 'The ' . $field . ' must be a valid email address.';
                }
                if (strpos($rule, 'max:') === 0) {
                    $max = (int)substr($rule, 4);
                    if (strlen((string)$value) > $max) {
                        $this->errors[$field] = 'The ' . $field . ' may not be greater than ' . $max . ' characters.';
                    }
                }
            }
        }

        if (! empty($this->errors)) {
            throw new ValidationException($this->errors, $this->data);
        }
    }

    public function failed(): bool
    {
        return ! empty($this->errors);
    }

    public function fails(): array
    {
        try {
            $this->validate();
        } catch (Exception $e) {
            //
        }

        return $this->errors;
    }
}
