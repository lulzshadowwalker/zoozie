<?php

require __DIR__ . '/../vendor/autoload.php';

use App\Repositories\UserRepository;
use Symfony\Component\Dotenv\Dotenv;
use flight\database\PdoWrapper;

$dotenv = new Dotenv();
$dotenv->load(__DIR__ . '/../.env');

$db = new PdoWrapper(
    "mysql:host={$_ENV['DB_HOST']};dbname={$_ENV['DB_DATABASE']};port={$_ENV['DB_PORT']}",
    $_ENV['DB_USERNAME'],
    $_ENV['DB_PASSWORD'],
    [
        PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES \'utf8mb4\'',
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::ATTR_STRINGIFY_FETCHES => false,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]
);

$repo = new UserRepository($db);

echo "Creating user...\n";
$name = readline("Name: ");
$email = readline("Email: ");
$password = readline("Password: ");

if (!$name || !$email || !$password) {
    echo "All fields are required.\n";
    exit(1);
}

try {
    $repo->create([
        'name' => $name,
        'email' => $email,
        'password' => password_hash($password, PASSWORD_BCRYPT),
    ]);
    echo "User created successfully!\n";
} catch (Exception $e) {
    echo "Error creating user: " . $e->getMessage() . "\n";
}
