<template inheritAttrs="false">
  <div
    class="bg-slate-200 dark:bg-slate-700 relative"
    :data-test="$attrs['data-test-container']"
  >
    <div
      v-if="inputIcon"
      class="absolute left-0 top-0 bottom-0 opacity-50 flex items-center justify-center w-8 pointer-events-none"
    >
      <font-awesome-icon :icon="inputIcon" data-cc="simple-input--input-icon" />
    </div>
    <button
      v-if="type == 'password'"
      class="absolute w-6 right-4 top-0 bottom-0 opacity-60 z-10"
      @click="togglePasswordVisibility"
      tabindex="-1"
      data-cc="simple-input--show-password-button"
    >
      <font-awesome-icon
        :icon="showPassword ? 'eye-slash' : 'eye'"
        data-cc="simple-input--show-password-icon"
      />
    </button>
    <input
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      :type="showPassword ? 'text' : type"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      class="bg-slate-200 dark:bg-slate-700 outline-0"
      :class="[$attrs.class, inputIcon ? 'pl-8' : '']"
      :data-test="$attrs['data-test']"
      data-cc="simple-input--input"
    />
  </div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  modelValue: string;
  inputIcon?: string;
  placeholder?: string;
  type?: string;
  autocomplete?: string;
}>();

defineEmits<{ (e: "update:modelValue", value: string): void }>();

const showPassword = ref(false);
function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}
</script>
