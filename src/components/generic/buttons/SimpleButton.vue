<template>
  <button
    ref="button"
    class="relative shadow active:shadow-none dark:shadow-black"
    :disabled="disabled"
  >
    <div class="absolute inset-0 z-0" :class="[getDynamicClasses()]"></div>
    <div class="inset-0 z-10">
      <slot></slot>
    </div>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  inverted?: boolean
  disabled?: boolean
}>()

function getDynamicClasses() {
  if (props.disabled) {
    return ''
  }
  if (props.inverted) {
    return 'hover:bg-white hover:bg-opacity-70 dark:hover:bg-black dark:hover:bg-opacity-70'
  }
  return (
    'hover:bg-black hover:bg-opacity-5 dark:hover:bg-white dark:hover:bg-opacity-5 ' +
    'active:bg-white active:bg-opacity-5 dark:active:bg-black dark:active:bg-opacity-5'
  )
}
</script>
