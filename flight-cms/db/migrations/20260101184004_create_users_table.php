<?php

declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class CreateUsersTable extends AbstractMigration
{
    public function change(): void
    {
        $users = $this->table('users');
        $users->addColumn('name', 'string')
              ->addColumn('email', 'string')
              ->addColumn('password', 'string')
              ->addTimestamps()
              ->addIndex(['email'], ['unique' => true])
              ->create();
    }
}
