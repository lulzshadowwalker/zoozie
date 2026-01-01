<?php declare(strict_types=1) ?>

<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
  <meta name="color-scheme" content="dark light" />
  <title><?= $_ENV['APP_NAME'] ?></title>
  <base href="<?= str_replace('index.php', '', $_SERVER['SCRIPT_NAME']) ?>" />
  <link rel="icon" href="./resources/images/favicon.svg" />
  <?= vite('resources/src/index.ts') ?>
</head>

<body>
  <h1>hello, lulzie</h1>
</body>

</html>
