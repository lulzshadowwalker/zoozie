<main class="lg:hs-overlay-layout-open:ps-60 bg-gray-100 transition-all duration-300 lg:fixed lg:inset-0 pt-13 px-3 pb-3 dark:bg-neutral-900">
  <div class="h-[calc(100dvh-62px)] lg:h-full overflow-hidden flex flex-col bg-white border border-gray-200 shadow-xs rounded-lg dark:bg-neutral-800 dark:border-neutral-700">
    <div class="flex-1 flex flex-col overflow-y-auto [&::-webkit-scrollbar]:w-0">
      <div class="flex-1 min-w-0 flex flex-col border-e border-gray-200 dark:border-neutral-700">
        <header class="flex items-end justify-between px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
          <div>
            <h1 class="text-lg font-semibold text-gray-900 dark:text-neutral-100">Posts</h1>
            <p class="mt-1 text-sm text-gray-600 dark:text-neutral-400">A list of all the posts in your CMS.</p>
          </div>

          <a href="/posts/create" class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
            <i class="hgi hgi-stroke hgi-add-circle-half-dot"></i>
            Create
          </a>
        </header>

        <!-- Table -->
        <div class="flex flex-col px-6 py-4">
          <div class="-m-1.5 overflow-x-auto">
            <div class="p-1.5 min-w-full inline-block align-middle">
              <div class="border border-gray-200 rounded-lg overflow-hidden dark:border-neutral-700">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                  <thead>
                    <tr>
                      <th scope="col" class="max-w-full w-full px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Title</th>
                      <th scope="col" class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Slug</th>
                      <th scope="col" class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Tag</th>
                      <th scope="col" class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Date</th>
                      <th scope="col" class="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Action</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 dark:divide-neutral-700">
                    <?php foreach ($posts as $post): ?>
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                        <?= htmlspecialchars($post['title']) ?>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                        <span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-gray-50 text-gray-500 dark:bg-white/10 dark:text-white max-w-fit">
                          <?= htmlspecialchars($post['slug']) ?>
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                        <span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-500">
                          <?= htmlspecialchars($post['tag'] ?? '—') ?>
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                        <?= date('M d, Y', strtotime($post['created_at'])) ?>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                        <form action="/posts/<?= $post['id'] ?>" method="POST">
                          <input type="hidden" name="_method" value="DELETE">
                          <button type="submit" class="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:text-blue-400" onclick="confirm('are you sure you want to delete this post?')">Delete</button>
                      </form>
                      </td>
                    </tr>
                    <?php endforeach; ?>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>