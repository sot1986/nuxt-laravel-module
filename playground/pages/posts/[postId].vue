<script setup lang="ts">
import { z } from 'zod'
import { LaraApiSchemas, computed, definePageMeta, useAsyncData, useNuxtApp, useRoute } from '#imports'
import { PostSchema, UserSchema } from '~/schemas'

defineOptions({
  name: 'PostIdLayout',
  inheritAttrs: false,
})

const { $api } = useNuxtApp()

definePageMeta({
  validate: route => !!(
    typeof route.params.postId === 'string'
    && route.params.postId.match(/^\d+$/)
  ),
})

const PostDetailsSchema = PostSchema.merge(z.object({
  user: UserSchema,
}))

const route = useRoute()
const postId = computed(() => route.params.postId as string)

const { data: post } = await useAsyncData('post-details', () => $api(`/api/posts/${postId.value}`, undefined, { validate: LaraApiSchemas.simpleResource(PostDetailsSchema) }), { watch: [postId] })
</script>

<template>
  <div>
    <NuxtPage :post="post?.data" />
  </div>
</template>
