<script setup lang="ts">
import { z } from 'zod'
import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/vue/24/solid'
import { PostSchema, UserSchema } from '../../schemas'
import { LaraApiSchemas, computed, definePageMeta, navigateTo, ref, useAsyncData, useNuxtApp, usePagePagination } from '#imports'

defineOptions({
  name: 'PostsList',
  inheritAttrs: false,
})

definePageMeta({
  middleware: 'auth',
})

const { $api } = useNuxtApp()

const PostListSchema = z.array(
  PostSchema.merge(z.object({
    user: UserSchema.pick({ name: true }),
  })),
)

const page = ref(1)

const { data: posts, error } = await useAsyncData('posts-with-users', () =>
  $api('api/posts', { query: { page: page.value } }, { validate: LaraApiSchemas.pagePaginatedResource (PostListSchema) }),
{ watch: [page] },
)

const pagination = computed(() => posts.value?.meta)

const { setPage, moveNext, movePrev, isCurrentPage } = usePagePagination({ pagination, page })

const navLinks = computed(
  () => pagination.value?.links.filter(link => !link.label.match(/(prev|next)/i)),
)

function goToPost(postId: bigint) {
  return navigateTo({ path: `/posts/${postId}` })
}
</script>

<template>
  <div>
    <h1 class="text-2xl py-4">
      Post list
    </h1>
    {{ error }}
    <template v-if="posts?.data.length">
      <ul

        role="list"
        class="divide-y divide-gray-100"
      >
        <li
          v-for="post in posts.data"
          :key="`post-${post.id}`"
          class="flex justify-between gap-x-6 py-5 cursor-pointer"
          @click="goToPost(post.id)"
        >
          <div class="flex gap-x-4">
            <div class="min-w-0 flex-auto">
              <p class="text-sm font-semibold leading-6 text-gray-900">
                {{ post.title }}
              </p>
              <p class="mt-1 truncate text-xs leading-5 text-gray-500 line-clamp-2">
                {{ post.content }}
              </p>
            </div>
          </div>
          <div class="hidden sm:flex sm:flex-col sm:items-end">
            <p class="text-sm leading-6 text-gray-900">
              {{ post.user.name }}
            </p>
          </div>
        </li>
      </ul>

      <nav
        v-if="pagination"
        class="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mb-10"
      >
        <div class="-mt-px flex w-0 flex-1">
          <button
            type="button"
            class="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            @click="movePrev"
          >
            <ArrowLongLeftIcon
              class="mr-3 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            Previous
          </button>
        </div>
        <div class="hidden md:-mt-px md:flex">
          <button
            v-for="(link, idx) in navLinks"
            :key="`posts-page-link-${idx}`"
            type="button"
            :class="`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
              isCurrentPage(link.label)
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`"
            @click="setPage(link.label)"
          >
            {{ link.label }}
          </button>
        </div>
        <div class="-mt-px flex w-0 flex-1 justify-end">
          <button
            type="button"
            class="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            @click="moveNext"
          >
            Next
            <ArrowLongRightIcon
              class="ml-3 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </button>
        </div>
      </nav>
    </template>
    <template v-else>
      <p class="text-lg text-gray-500 py-500">
        No post available ...
      </p>
    </template>
  </div>
</template>
