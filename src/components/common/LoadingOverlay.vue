<template>
  <v-overlay
    :model-value="loading"
    class="align-center justify-center"
    persistent
  >
    <v-progress-circular
      color="primary"
      indeterminate
      size="64"
    ></v-progress-circular>
    <div class="text-h6 mt-4 text-center">
      {{ message }}
    </div>
  </v-overlay>
</template>

<script setup lang="ts">
interface Props {
  loading: boolean
  message?: string
}

withDefaults(defineProps<Props>(), {
  loading: false,
  message: 'Carregando...'
})
</script>
