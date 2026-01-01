<?php

declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class CreatePostsTable extends AbstractMigration
{
    public function change(): void
    {
        $posts = $this->table('posts');
        $posts->addColumn('title', 'string')
              ->addColumn('slug', 'string')
              ->addColumn('content', 'text', ['null' => true])
              
              // General Info
              ->addColumn('description', 'string', ['limit' => 500, 'null' => true])
              ->addColumn('tag', 'string', ['null' => true])
              ->addColumn('locale', 'string', ['limit' => 10, 'default' => 'en'])
              ->addColumn('cover_image', 'string', ['null' => true])
              
              // SEO Settings
              ->addColumn('meta_title', 'string', ['null' => true])
              ->addColumn('meta_description', 'string', ['limit' => 500, 'null' => true])
              ->addColumn('keywords', 'string', ['null' => true])
              ->addColumn('prevent_indexing', 'boolean', ['default' => false])
              
              // Timestamps (created_at, updated_at)
              ->addTimestamps()
              
              // Indexes
              ->addIndex(['slug'], ['unique' => true])
              ->create();
    }
}
