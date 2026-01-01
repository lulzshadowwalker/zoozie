<main class="lg:hs-overlay-layout-open:ps-60 bg-gray-100 transition-all duration-300 lg:fixed lg:inset-0 pt-13 px-3 pb-3 dark:bg-neutral-900">
  <div class="h-[calc(100dvh-62px)] lg:h-full overflow-hidden flex flex-col bg-white border border-gray-200 shadow-xs rounded-lg dark:bg-neutral-800 dark:border-neutral-700">
    <div class="flex-1 flex flex-col overflow-y-auto [&::-webkit-scrollbar]:w-0">
      <div class="flex-1 min-w-0 flex flex-col border-e border-gray-200 dark:border-neutral-700">
        <header class="flex items-end justify-between px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
          <div>
            <h1 class="text-lg font-semibold text-gray-900 dark:text-neutral-100">Create Post</h1>
            <p class="mt-1 text-sm text-gray-600 dark:text-neutral-400">Create a new post in your CMS.</p>
          </div>

          <button type="submit" form="post-form" class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
            <i class="hgi hgi-stroke hgi-sent"></i>
            Publish
          </button>
        </header>

        <form id="post-form" class="p-6 space-y-8" x-data="{ 
            title: '', 
            slug: '',
            updateSlug() {
                this.slug = this.title
                    .toLowerCase()
                    .replace(/[^\w ]+/g, '')
                    .replace(/ +/g, '-')
            }
        }">
          <!-- Title & Slug -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Title</label>
              <input type="text" id="title" name="title" x-model="title" @input="updateSlug()" class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="Enter post title">
            </div>
            <div class="space-y-2">
              <label for="slug" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Slug</label>
              <input type="text" id="slug" name="slug" x-model="slug" class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="auto-generated-slug">
            </div>
          </div>

          <!-- Content -->
          <div class="space-y-2">
            <label for="content" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Content</label>
            <textarea id="content" name="content" rows="10" class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="Write your post content here..."></textarea>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- General Info -->
            <div class="space-y-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-neutral-700">General Information</h3>
                
                <div class="space-y-2">
                    <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Description</label>
                    <textarea id="description" name="description" rows="3" class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"></textarea>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label for="tag" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Tag</label>
                        <input type="text" id="tag" name="tag" class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                    </div>
                    <div class="space-y-2">
                        <label for="locale" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Locale</label>
                        <select id="locale" name="locale" class="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                            <option selected>en</option>
                            <option>ar</option>
                        </select>
                    </div>
                </div>

                <div class="space-y-2">
                    <label for="cover_picture" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Cover Picture</label>
                    <input type="file" id="cover_picture" name="cover_picture" class="block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 file:bg-gray-50 file:border-0 file:me-4 file:py-3 file:px-4 dark:file:bg-neutral-700 dark:file:text-neutral-400">
                </div>
            </div>

            <!-- SEO Settings -->
            <div class="space-y-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-neutral-700">SEO Settings</h3>
                
                <div class="space-y-2">
                    <label for="meta_title" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Meta Title</label>
                    <input type="text" id="meta_title" name="meta_title" class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                </div>

                <div class="space-y-2">
                    <label for="meta_description" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Meta Description</label>
                    <textarea id="meta_description" name="meta_description" rows="3" class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"></textarea>
                </div>

                <div class="space-y-2">
                    <label for="keywords" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Keywords</label>
                    <input type="text" id="keywords" name="keywords" class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="keyword1, keyword2, keyword3">
                </div>

                <div class="flex items-center">
                    <input type="checkbox" id="prevent_indexing" name="prevent_indexing" class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800">
                    <label for="prevent_indexing" class="text-sm text-gray-500 ms-3 dark:text-neutral-400">Prevent search engines from indexing this page</label>
                </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</main>