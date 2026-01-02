<?php

declare(strict_types=1);

namespace App\Repositories;

use flight\database\PdoWrapper;

class PostRepository
{
    public function __construct(private PdoWrapper $db)
    {
    }

    public function all(): array
    {
        return $this->db->query('SELECT * FROM posts ORDER BY created_at DESC')->fetchAll();
    }

    public function create(array $data): void
    {
        $this->db->runQuery('
            INSERT INTO posts (title, slug, content, description, tag, locale, cover_image, meta_title, meta_description, keywords, prevent_indexing)
            VALUES (:title, :slug, :content, :description, :tag, :locale, :cover_image, :meta_title, :meta_description, :keywords, :prevent_indexing)
        ', $data);
    }

    public function delete(int $id): void
    {
        $this->db->runQuery('DELETE FROM posts WHERE id = :id', ['id' => $id]);
    }
}
