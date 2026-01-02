<?php

declare(strict_types=1);

namespace App\Repositories;

use flight\database\PdoWrapper;

class UserRepository
{
    public function __construct(private PdoWrapper $db)
    {
    }

    public function create(array $data): void
    {
        $this->db->runQuery('
            INSERT INTO users (name, email, password, created_at, updated_at)
            VALUES (:name, :email, :password, NOW(), NOW())
        ', $data);
    }

    public function findByEmail(string $email): array
    {
        return $this->db->fetchRow('SELECT * FROM users WHERE email = :email', ['email' => $email])->getData();
    }
}
