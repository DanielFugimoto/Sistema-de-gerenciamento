<template>
  <v-container fluid class="pa-0">
    <PageHeader
      :title="title"
      :subtitle="subtitle"
      :icon="icon"
      :icon-color="iconColor"
      :back-route="backRoute"
      :back-tooltip="backTooltip"
    >
      <template v-slot:actions>
        <slot name="actions"></slot>
      </template>
    </PageHeader>

    <div class="pa-4">
      <slot></slot>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import PageHeader from './PageHeader.vue'

interface Props {
  title: string
  subtitle: string
  icon: string
  iconColor?: string
  backRoute?: string
  backTooltip?: string
}

withDefaults(defineProps<Props>(), {
  iconColor: 'primary',
  backRoute: '/',
  backTooltip: 'Voltar ao Dashboard'
})
</script>

