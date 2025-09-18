<template>
  <v-card class="mb-4" elevation="2">
    <v-card-text class="pa-4">
      <div class="d-flex align-center">
        <v-btn
          icon="mdi-arrow-left"
          variant="text"
          color="primary"
          size="large"
          @click="goBack"
          class="mr-4"
        >
          <v-icon>mdi-arrow-left</v-icon>
          <v-tooltip activator="parent" location="bottom">{{ backTooltip }}</v-tooltip>
        </v-btn>
        <div class="d-flex justify-space-between align-center flex-grow-1">
          <div>
            <h1 class="text-h4 mb-2">
              <v-icon class="mr-3" :color="iconColor">{{ icon }}</v-icon>
              {{ title }}
            </h1>
            <p class="text-body-1 text-grey-darken-1 mb-0">
              {{ subtitle }}
            </p>
          </div>
          <div class="d-flex gap-2">
            <v-btn
              icon="mdi-home"
              variant="text"
              color="primary"
              size="large"
              @click="goToDashboard"
              class="mr-2"
            >
              <v-icon>mdi-home</v-icon>
              <v-tooltip activator="parent" location="bottom">Voltar ao Dashboard</v-tooltip>
            </v-btn>
            <div v-if="$slots.actions" class="d-flex gap-2">
              <slot name="actions"></slot>
            </div>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Props {
  title: string
  subtitle: string
  icon: string
  iconColor?: string
  backRoute?: string
  backTooltip?: string
}

const props = withDefaults(defineProps<Props>(), {
  iconColor: 'primary',
  backRoute: '/',
  backTooltip: 'Voltar ao Dashboard'
})

const router = useRouter()

const goBack = () => {
  router.push(props.backRoute)
}

const goToDashboard = () => {
  router.push('/')
}
</script>

