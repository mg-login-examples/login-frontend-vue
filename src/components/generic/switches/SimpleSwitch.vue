<template>
  <div
    class="w-9 h-6 flex items-center rounded-full p-1 duration-300 border-[1px] border-solid border-slate-400 dark:border-slate-500 hover:border-slate-700 hover:dark:border-slate-300"
    :class="[switchBackground, switchAnimation ? 'ease-in' : '']"
    @click="toggleSwitch"
    data-cc="switch--container"
  >
    <div
      class="w-4 h-4 rounded-full shadow-md transform duration-300 flex items-center justify-center"
      :class="[
        modelValue ? 'translate-x-3' : '',
        switchButtonBackground,
        switchAnimation ? 'ease-in-out' : ''
      ]"
      data-cc="switch--button"
    >
      <font-awesome-icon
        v-if="(switchOffIcon || switchIcon) && !modelValue"
        :icon="switchOffIcon ? switchOffIcon : switchIcon"
        size="xs"
        class="p-0"
        :class="switchOffIconColor"
        data-cc="switch-off--icon"
      />
      <font-awesome-icon
        v-if="(switchOnIcon || switchIcon) && modelValue"
        :icon="switchOnIcon ? switchOnIcon : switchIcon"
        size="xs"
        class="p-0"
        :class="switchOnIconColor"
        data-cc="switch-on--icon"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
  switchAnimation?: boolean

  switchIcon?: string

  switchOffBackground?: string
  switchOffButtonBackground?: string
  switchOffIcon?: string
  switchOffIconColor?: string

  switchOnBackground?: string
  switchOnButtonBackground?: string
  switchOnIcon?: string
  switchOnIconColor?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

function toggleSwitch() {
  emit('update:modelValue', !props.modelValue)
}

const switchBackground = computed(() => {
  if (props.modelValue) {
    return props.switchOnBackground ? props.switchOnBackground : 'bg-green-400'
  }
  return props.switchOffBackground ? props.switchOffBackground : 'bg-gray-300 dark:bg-gray-700'
})
const switchButtonBackground = computed(() => {
  if (props.modelValue) {
    return props.switchOnButtonBackground
      ? props.switchOnButtonBackground
      : 'bg-white dark:bg-black'
  }
  return props.switchOffButtonBackground
    ? props.switchOffButtonBackground
    : 'bg-white dark:bg-black'
})
</script>
