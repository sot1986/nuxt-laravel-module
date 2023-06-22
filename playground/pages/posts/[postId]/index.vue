<script setup lang="ts">
import { z } from 'zod'
import { PostSchema, UserSchema } from '~/schemas'

defineProps<{
  post?: z.infer<typeof PostDetailsSchema>
}>()

defineOptions({
  name: 'PostDetails',
  inheritAttrs: false,
})

const PostDetailsSchema = PostSchema.merge(z.object({
  user: UserSchema,
}))
</script>

<template>
  <div
    v-if="post"
    class="prose lg:prose-xl"
  >
    <h2>
      {{ post.title }}
    </h2>
    <p>
      {{ post.content }}
    </p>

    <div class="flex justify-end space-x-4">
      <span>updated on {{ new Date(post.updatedAt).toDateString() }}</span>
      <strong>{{ post.user.name }}</strong>
    </div>

    <div class="mt-4 flex justify-end">
      <nuxt-link
        to="/posts"
        class="no-underline"
      >
        Back
      </nuxt-link>
    </div>
  </div>
  <div v-else>
    <p>No Post found</p>
  </div>
</template>
