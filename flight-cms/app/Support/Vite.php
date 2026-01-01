<?php

namespace App\Support;

class Vite
{
    private static ?array $manifest = null;
    private static bool $injected = false;

    public static function asset(string $entry): string
    {
        $isDev = ($_ENV['APP_ENV'] ?? 'production') === 'local';
        if ($isDev) {
            return self::dev($entry);
        }

        return self::prod($entry);
    }

    private static function dev(string $entry): string
    {
        $tags = '';
        if (! self::$injected) {
            $tags .= '<script type="module" src="http://localhost:5173/@vite/client"></script>' . PHP_EOL;
            self::$injected = true;
        }
        
        $tags .= '<script type="module" src="http://localhost:5173/' . $entry . '"></script>';
        return $tags;
    }

    private static function prod(string $entry): string
    {
        $manifest = self::manifest();
        if (! isset($manifest[$entry])) {
            return "<!-- Vite entry '{$entry}' not found in manifest -->";
        }

        $file = $manifest[$entry]['file'];
        $tags = '<script type="module" src="./resources/dist/' . $file . '"></script>' . PHP_EOL;

        if (isset($manifest[$entry]['css'])) {
            foreach ($manifest[$entry]['css'] as $cssFile) {
                $tags .= '<link rel="stylesheet" href="./resources/dist/' . $cssFile . '" />' . PHP_EOL;
            }
        }

        return $tags;
    }

    private static function manifest(): array
    {
        if (self::$manifest !== null) {
            return self::$manifest;
        }

        $path = __DIR__ . '/../../resources/dist/.vite/manifest.json';
        if (! file_exists($path)) {
            $path = __DIR__ . '/../../resources/dist/manifest.json';
        }

        self::$manifest = [];
        if (file_exists($path)) {
            self::$manifest = json_decode(file_get_contents($path), true);
        }

        return self::$manifest;
    }
}
