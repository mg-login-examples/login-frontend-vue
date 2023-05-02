<template>
  <MenuAttached
    v-model="searchMenuOpen"
    :widthSameAsMenuButton="true"
    :class="$attrs.class"
  >
    <div
      class="flex flex-wrap relative cursor-text"
      :class="[
        $attrs['class-select-field'],
        getDynamicMultiSelectContainerClasses(),
      ]"
      :data-test="$attrs['data-test-container']"
      @click="openSearchMenu"
      @mouseenter="multiSelectHovered = true"
      @mouseleave="multiSelectHovered = false"
    >
      <span v-if="!multiple && modelValue" class="mr-2">
        <slot name="selectedSingleItem">
          <span>
            {{ getItemDisplayValue(modelValue) }}
          </span>
        </slot>
      </span>
      <template v-if="multiple">
        <slot name="selectedMultipleItems">
          <span v-for="(selectedValue, index) in modelValue" :key="index">
            <slot name="selectedItemInMultiple">
              <span
                v-if="!chips"
                class="pr-1"
                :class="index + 1 === modelValue.length ? 'mr-2' : ''"
              >
                {{ getItemDisplayValue(selectedValue) }}
                {{ index + 1 === modelValue.length ? "" : "," }}
              </span>
              <span
                v-if="chips"
                class="inline-flex items-center rounded-full text-xs font-medium bg-slate-400 dark:bg-slate-600 px-2 py-1 mr-1"
              >
                {{ getItemDisplayValue(selectedValue) }}
              </span>
            </slot>
          </span>
        </slot>
      </template>
      <input
        ref="input"
        :value="search"
        @input="onSearchInput"
        @focus="multiSelectFocused = true"
        @focusout="multiSelectFocused = false"
        :placeholder="placeholder"
        class="bg-transparent outline-0 min-w-0 basis-4 flex-grow flex-shrink"
        :class="[inputIcon ? 'pl-8' : '']"
        :data-test="$attrs['data-test']"
        data-cc="simple-input--input"
      />
      <button
        v-if="clearable && multiSelectHovered"
        class="absolute w-6 right-2 top-0 opacity-60 z-10 py-2"
        @click="clearItems"
      >
        <font-awesome-icon icon="xmark" />
      </button>
    </div>
    <template v-slot:menu>
      <div class="py-2 shadow-lg bg-white dark:bg-slate-800">
        <div v-if="isLoading">
          <div class="hover:bg-slate-300 hover:dark:bg-slate-600 px-4 py-2">
            <slot name="menuLoading">
              <span class="mr-2"> Please wait. Loading... </span>
              <span>
                <font-awesome-icon icon="spinner" pulse />
              </span>
            </slot>
          </div>
        </div>
        <div
          v-if="
            !isLoading && (filteredItems.length === 0 || items.length === 0)
          "
          class="text-slate-500 dark:text-slate-500 hover:bg-slate-300 hover:dark:bg-slate-600 px-4 py-2"
        >
          No items found
        </div>
        <slot name="items">
          <div
            v-for="(item, index) in filteredItems"
            :key="index"
            @click="selectItem(index)"
            class="hover:bg-slate-300 hover:dark:bg-slate-600 cursor-pointer"
            :class="[isSelected(index) ? 'bg-slate-200 dark:bg-slate-700' : '']"
          >
            <slot menu="item">
              <div class="px-4 py-2">
                {{ getItemDisplayValue(item) }}
              </div>
            </slot>
          </div>
        </slot>
      </div>
    </template>
  </MenuAttached>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { ref, unref, computed } from "vue";

import MenuAttached from "@/components/generic/menu/MenuAttached.vue";
import { debounce } from "@/utils/commonUtils/debounce";

export interface Props {
  modelValue: any;
  multiple?: boolean;
  search?: string;
  resetSearchOnMenuAction?: boolean;
  clearable?: boolean;
  inputIcon?: string;
  placeholder?: string;
  items: any[];
  itemKey?: string;
  itemDisplay?: string | Function;
  isLoading?: boolean;
  debounceSearch?: boolean;
  chips?: boolean;
  filterItems?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  search: "",
  isLoading: false,
  multiple: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
  (e: "update:search", value: string): void;
  (e: "searchUpdatedDebounced"): void;
}>();

const multiSelectFocused = ref(false);
const multiSelectHovered = ref(false);

function getDynamicMultiSelectContainerClasses() {
  if (multiSelectFocused.value) {
    return "bg-slate-300 dark:bg-slate-700";
  }
  if (multiSelectHovered.value) {
    return "bg-slate-300/70 dark:bg-slate-700/70";
  }
  return "bg-slate-200 dark:bg-slate-800";
}

const searchMenuOpen = ref(false);

function openSearchMenu() {
  searchMenuOpen.value = true;
}

const debounceSearchEntered = debounce(() => {
  emit("searchUpdatedDebounced");
}, 1000);

function onSearchInput(event: Event) {
  emit("update:search", (event.target as HTMLInputElement).value);
  debounceSearchEntered();
  openSearchMenu();
}

const filteredItems = computed(() => {
  if (props.filterItems) {
    return props.items.filter((item) =>
      getItemDisplayValue(item).includes(props.search)
    );
  } else {
    return props.items;
  }
});

function isSelected(itemIndex: number) {
  const alreadySelectedItems = unref(props.modelValue) as any[];
  if (alreadySelectedItems && Array.isArray(alreadySelectedItems)) {
    const item = filteredItems.value[itemIndex];
    if (props.itemKey) {
      const alreadySelectedItemsKeys = alreadySelectedItems.map(
        (item) => item[props.itemKey as string]
      );
      return alreadySelectedItemsKeys.includes(item[props.itemKey]);
    }
    return alreadySelectedItems.includes(item);
  }
  return false;
}

function selectItem(itemIndex: number) {
  const itemSelected = filteredItems.value[itemIndex];
  if (!props.multiple) {
    // if single select
    emit("update:modelValue", itemSelected);
  } else {
    // if multi select
    const alreadySelectedItems = unref(props.modelValue) as any[];
    if (!alreadySelectedItems) {
      // if modelValue undefined
      emit("update:modelValue", [itemSelected]);
    } else {
      // if modelValue an array
      if (props.itemKey) {
        const itemkey = props.itemKey as string;
        const alreadySelectedItemsKeys = alreadySelectedItems.map(
          (item) => item[itemkey]
        );
        if (
          (alreadySelectedItemsKeys as any[]).includes(itemSelected[itemkey])
        ) {
          // if selectedItem already selected, then unselect it
          const updatedItems = alreadySelectedItems.filter(
            (item) => item[itemkey] !== itemSelected[itemkey]
          );
          emit("update:modelValue", updatedItems);
        } else {
          // if selectedItem not already select, add it
          const updatedItems = [...alreadySelectedItems, itemSelected];
          emit("update:modelValue", updatedItems);
        }
      } else {
        if ((alreadySelectedItems as any[]).includes(itemSelected)) {
          // if selectedItem already selected, then unselect it
          const updatedItems = alreadySelectedItems.filter(
            (item) => item !== itemSelected
          );
          emit("update:modelValue", updatedItems);
        } else {
          // if selectedItem not already select, add it
          const updatedItems = [...alreadySelectedItems, itemSelected];
          emit("update:modelValue", updatedItems);
        }
      }
    }
  }
  // close menu after action
  searchMenuOpen.value = false;
  // keep focus on input
  input.value?.focus();
  // reset search
  if (props.resetSearchOnMenuAction) {
    emit("update:search", "");
  }
}

function getItemDisplayValue(item: any) {
  if (props.itemDisplay) {
    if (typeof props.itemDisplay === "function") {
      return props.itemDisplay(item);
    } else {
      return item[props.itemDisplay];
    }
  }
  return item;
}

const input = ref<InstanceType<typeof HTMLElement>>();

function clearItems() {
  if (props.multiple) {
    emit("update:modelValue", []);
    input.value?.focus();
  } else {
    emit("update:modelValue", undefined);
    input.value?.focus();
  }
}
</script>
