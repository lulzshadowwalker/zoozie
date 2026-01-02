<div id="hs-pro-sidebar" class="hs-overlay [--body-scroll:true] lg:[--overlay-backdrop:false] [--is-layout-affect:true] [--opened:lg] [--auto-close:lg]
hs-overlay-open:translate-x-0 lg:hs-overlay-layout-open:translate-x-0
-translate-x-full
w-60
hidden
fixed inset-y-0 z-60 start-0
bg-zinc-100
lg:block lg:-translate-x-full lg:end-auto lg:bottom-0
dark:bg-neutral-900" role="dialog" tabindex="-1" aria-label="Sidebar">
  <div class="lg:pt-13 relative flex flex-col h-full max-h-full">
    <!-- Body -->
    <nav class="p-3 size-full flex flex-col overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-200 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
      <div class="lg:hidden mb-2 flex items-center justify-between">
        <button type="button" class="flex items-center gap-x-1.5 py-2 px-2.5 font-medium text-xs bg-black text-white rounded-lg focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none dark:bg-white dark:text-black">
          <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z" />
          </svg>
          Ask AI
        </button>

        <!-- Sidebar Toggle -->
        <button type="button" class="p-1.5 size-7.5 inline-flex items-center gap-x-1 text-xs rounded-md text-gray-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden dark:text-neutral-500" aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-pro-sidebar" data-hs-overlay="#hs-pro-sidebar">
          <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
          <span class="sr-only">Sidebar Toggle</span>
        </button>
        <!-- End Sidebar Toggle -->
      </div>

      <button type="button" class="p-1.5 ps-2.5 w-full inline-flex items-center gap-x-2 text-sm rounded-lg bg-white border border-gray-200 text-gray-600 shadow-xs hover:border-gray-300 focus:outline-hidden focus:border-gray-300 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-600 dark:focus:border-neutral-600" aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-pro-cmsssm" data-hs-overlay="#hs-pro-cmsssm">
        Search
        <span class="ms-auto flex items-center gap-x-1 py-px px-1.5 border border-gray-200 rounded-md dark:border-neutral-700">
          <svg class="shrink-0 size-2.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"></path>
          </svg>
          <span class="text-[11px] uppercase">k</span>
        </span>
      </button>

      <div class="pt-3 mt-3 flex flex-col border-t border-gray-200 first:border-t-0 first:pt-0 first:mt-0 dark:border-neutral-700">
        <span class="block ps-2.5 mb-2 font-medium text-xs uppercase text-gray-500 dark:text-neutral-500">
          Home
        </span>

        <!-- List -->
        <ul class="flex flex-col gap-y-1">
          <li>
            <a href="/" class="w-full flex items-center gap-x-2 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 dark:text-neutral-200">
              <i class="hgi hgi-stroke hgi-analytics-01"></i>
              Dashboard
            </a>
          </li>
        </ul>
        <!-- End List -->
      </div>

      <div class="pt-3 mt-3 flex flex-col border-t border-gray-200 first:border-t-0 first:pt-0 first:mt-0 dark:border-neutral-700">
        <span class="block ps-2.5 mb-2 font-medium text-xs uppercase text-gray-500 dark:text-neutral-500">
          Content
        </span>

        <!-- List -->
        <ul class="flex flex-col gap-y-1">
          <li>
            <a href="/posts" class="w-full flex items-center gap-x-2 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 dark:text-neutral-200">
              <i class="hgi hgi-stroke hgi-license-draft"></i>
              Posts
            </a>
          </li>
        </ul>
        <!-- End List -->
      </div>
    </nav>
    <!-- End Body -->

    <!-- Footer -->
    <footer class="mt-auto p-3 flex flex-col">
      <!-- List -->
      <ul class="flex flex-col gap-y-1">
        <li>
          <a class="w-full flex items-center gap-x-2 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 dark:text-neutral-200" href="#">
            <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </svg>
            What's new?
          </a>
        </li>
        <li>
          <a class="w-full flex items-center gap-x-2 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 dark:text-neutral-200" href="#">
            <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
            </svg>
            Help & support
          </a>
        </li>
        <li class="lg:hidden">
          <a class="w-full flex items-center gap-x-2 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 dark:text-neutral-200" href="#">
            <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 7v14" />
              <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
            </svg>
            Knowledge Base
          </a>
        </li>
      </ul>
      <!-- End List -->
    </footer>
    <!-- End Footer -->
  </div>
</div>