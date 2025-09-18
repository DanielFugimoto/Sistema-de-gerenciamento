<template>
  <v-app-bar
    color="primary"
    dark
    prominent
  >
    <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
    
    <v-toolbar-title>
      <v-icon class="mr-2">mdi-office-building</v-icon>
      Condomínio Corporativo
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn icon>
      <v-icon>mdi-account</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script setup lang="ts">
interface Props {
  drawer?: boolean
}

interface Emits {
  (e: 'update:drawer', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const toggleDrawer = () => {
  emit('update:drawer', !props.drawer)
}
</script>
