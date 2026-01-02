<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title><?= $title ?? 'Login' ?></title>
    <?= vite('resources/src/index.ts') ?>
</head>
<body class="bg-gray-100 flex h-full items-center py-16 dark:bg-neutral-800">
    <main class="w-full max-w-md mx-auto p-6">
        <?= $content ?>
    </main>
</body>
</html>
