<div class="fixed bottom-4 sm:left-auto sm:right-4 z-50 sm:max-w-md w-full space-y-4">
    <?php if ($message = Flight::flash('success')): ?>
        <!-- Success Alert -->
        <div x-cloak x-data="alert" x-show="show" x-transition class="bg-teal-50 border-t-2 border-teal-500 rounded-lg p-4 dark:bg-teal-800/30" role="alert" tabindex="-1" aria-labelledby="hs-bordered-success-style-label">
            <div class="flex">
                <div class="shrink-0">
                    <i class="hgi hgi-stroke hgi-checkmark-circle-02"></i>
                </div>
                <div class="ms-3">
                    <h3 id="hs-bordered-success-style-label" class="text-gray-800 font-semibold dark:text-white">
                        Success
                    </h3>
                    <p class="text-sm text-gray-700 dark:text-neutral-400">
                        <?= htmlspecialchars($message) ?>
                    </p>
                </div>
            </div>
        </div>
    <?php endif; ?>

    <!-- Warning Alert -->
    <?php if ($message = Flight::flash('warning')): ?>
        <div x-cloak x-data="alert" x-show="show" x-transition class="bg-yellow-50 border-t-2 border-yellow-500 rounded-lg p-4 dark:bg-yellow-800/30" role="alert" tabindex="-1" aria-labelledby="hs-bordered-warning-style-label">
            <div class="flex">
                <div class="shrink-0">
                    <i class="hgi hgi-stroke hgi-alert-02"></i>
                </div>
                <div class="ms-3">
                    <h3 id="hs-bordered-warning-style-label" class="text-gray-800 font-semibold dark:text-white">
                        Warning!
                    </h3>
                    <p class="text-sm text-gray-700 dark:text-neutral-400">
                        <?= htmlspecialchars($message) ?>
                    </p>
                </div>
            </div>
        </div>
    <?php endif; ?>

    <!-- Info Alert -->
    <?php if ($message = Flight::flash('info')): ?>
        <div x-cloak x-data="alert" x-show="show" x-transition class="bg-blue-50 border-t-2 border-blue-500 rounded-lg p-4 dark:bg-blue-800/30" role="alert" tabindex="-1" aria-labelledby="hs-bordered-info-style-label">
            <div class="flex">
                <div class="shrink-0">
                    <i class="hgi hgi-stroke hgi-information-circle-02"></i>
                </div>
                <div class="ms-3">
                    <h3 id="hs-bordered-info-style-label" class="text-gray-800 font-semibold dark:text-white">
                        Info
                    </h3>
                    <p class="text-sm text-gray-700 dark:text-neutral-400">
                        <?= htmlspecialchars($message) ?>
                    </p>
                </div>
            </div>
        </div>
    <?php endif; ?>

    <!-- Error Alert -->
    <?php if ($message = Flight::flash('error')): ?>
        <div x-cloak x-data="alert" x-show="show" x-transition class="bg-red-50 border-t-2 border-red-500 rounded-lg p-4 dark:bg-red-800/30" role="alert" tabindex="-1" aria-labelledby="hs-bordered-error-style-label">
            <div class="shrink-0">
                <i class="hgi hgi-stroke hgi-alert-circle"></i>
                </div>
                <div class="ms-3">
                    <h3 id="hs-bordered-error-style-label" class="text-gray-800 font-semibold dark:text-white">
                        Error
                    </h3>
                    <p class="text-sm text-gray-700 dark:text-neutral-400">
                        <?= htmlspecialchars($message) ?>
                    </p>
                </div>
            </div>
        </div>
    <?php endif; ?>
</div>
