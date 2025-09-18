<template>
  <v-snackbar
    v-model="snackbar"
    :color="color"
    :timeout="timeout"
    :location="location"
  >
    <div class="d-flex align-center">
      <v-icon class="mr-2">{{ icon }}</v-icon>
      {{ message }}
    </div>
    <template v-slot:actions>
      <v-btn
        color="white"
        variant="text"
        @click="snackbar = false"
      >
        Fechar
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Anchor =
  | 'top'
  | 'bottom'
  | 'start'
  | 'end'
  | 'top start'
  | 'top end'
  | 'bottom start'
  | 'bottom end'

interface Props {
  modelValue: boolean
  message: string
  color?: string
  timeout?: number
  location?: Anchor
  type?: 'success' | 'error' | 'warning' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'success',
  timeout: 3000,
  location: 'top end',
  type: 'success'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const snackbar = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const icon = computed(() => {
  switch (props.type) {
    case 'success':
      return 'mdi-check-circle'
    case 'error':
      return 'mdi-alert-circle'
    case 'warning':
      return 'mdi-alert'
    case 'info':
      return 'mdi-information'
    default:
      return 'mdi-information'
  }
})
</script>
