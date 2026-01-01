<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <meta name="color-scheme" content="dark light" />
    <title><?= $title ? "{$title} | " : "" ?><?= $_ENV['APP_NAME'] ?></title>
    <base href="<?= str_replace('index.php', '', $_SERVER['SCRIPT_NAME']) ?>" />
    <link rel="icon" href="./resources/images/favicon.svg" />

    <link rel="stylesheet" href="https://cdn.hugeicons.com/font/hgi-stroke-rounded.css" />
    <?= vite('resources/src/index.ts') ?>
</head>

<body>
    <?= $header ?>
    <?= $sidebar ?>
    <?= $content ?>
</body>

</html>