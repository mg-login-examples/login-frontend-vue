<template>
  <div
    class="inline-block relative"
    ref="menuControl"
    data-cc="menu--button--container"
    v-click-outside="onClickOutsideMenu"
  >
    <slot></slot>
    <div
      v-if="menuOpen"
      @click.stop=""
      class="absolute z-30"
      :style="menuPositionStyle"
      data-cc="menu--container"
    >
      <slot name="menu"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref, watchEffect, computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: undefined },
  closeWhenClickOutside: Boolean,
  menuPosition: String, // top, left, bottom, right
  widthSameAsMenuButton: { type: Boolean, default: false }
})

const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()

const menuOpen = ref(props.modelValue ? props.modelValue : false)
watchEffect(() => {
  if (props.modelValue !== undefined) {
    menuOpen.value = props.modelValue
  }
})

function toggleMenu() {
  menuOpen.value = !menuOpen.value
  emit('update:modelValue', menuOpen.value)
}

function onClickOutsideMenu() {
  const closeMenuWhenClickOutside = props.closeWhenClickOutside ? props.closeWhenClickOutside : true
  if (closeMenuWhenClickOutside) {
    menuOpen.value = false
    emit('update:modelValue', false)
  }
}

const menuControl = ref<InstanceType<typeof HTMLElement>>()

const menuPositionStyle = computed(() => {
  if (menuControl.value) {
    const menuPosition = props.menuPosition ? props.menuPosition : 'bottom'
    const menuControlWidth = (menuControl as Ref<HTMLElement>).value.clientWidth
    const menuControlHeight = (menuControl as Ref<HTMLElement>).value.clientHeight
    let menuTop = ''
    let menuRight = ''
    let menuBottom = ''
    let menuLeft = ''
    if (menuPosition === 'top') {
      menuBottom = `${menuControlHeight}px`
      menuLeft = `0px`
      if (props.widthSameAsMenuButton) {
        menuRight = `0px`
      }
    } else if (menuPosition === 'right') {
      menuTop = `0px`
      menuLeft = `${menuControlWidth}px`
    } else if (menuPosition === 'left') {
      menuTop = `0px`
      menuRight = `${menuControlWidth}px`
    } else {
      menuTop = `${menuControlHeight}px`
      menuLeft = `0px`
      if (props.widthSameAsMenuButton) {
        menuRight = `0px`
      }
    }
    const position = {
      top: menuTop,
      bottom: menuBottom,
      left: menuLeft,
      right: menuRight
    }
    return position
  }
  return {}
})

defineExpose({ toggleMenu })
</script>
