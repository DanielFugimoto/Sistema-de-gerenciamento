<template>
  <v-dialog v-model="dialog" max-width="400" persistent>
    <v-card>
      <v-card-title class="text-h6">
        <v-icon class="mr-2" :color="iconColor">{{ icon }}</v-icon>
        {{ title }}
      </v-card-title>
      <v-card-text>
        {{ message }}
        <v-alert
          v-if="warning"
          type="warning"
          variant="tonal"
          class="mt-2"
        >
          {{ warning }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="grey"
          variant="text"
          @click="cancel"
          :disabled="loading"
        >
          {{ cancelText }}
        </v-btn>
        <v-btn
          :color="confirmColor"
          variant="flat"
          @click="confirm"
          :loading="loading"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
interface Props {
  dialog: boolean
  title: string
  message: string
  warning?: string
  confirmText?: string
  cancelText?: string
  confirmColor?: string
  icon?: string
  iconColor?: string
  loading?: boolean
}

interface Emits {
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'update:dialog', value: boolean): void
}

withDefaults(defineProps<Props>(), {
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  confirmColor: 'primary',
  icon: 'mdi-help-circle',
  iconColor: 'primary',
  loading: false
})

const emit = defineEmits<Emits>()

const confirm = () => {
  emit('confirm')
}

const cancel = () => {
  emit('cancel')
  emit('update:dialog', false)
}
</script>
