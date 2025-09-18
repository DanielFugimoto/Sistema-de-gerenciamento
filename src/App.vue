<template>
  <v-app>
    <AppBar 
      :drawer="drawer"
      @update:drawer="drawer = $event"
    />
    
    <NavigationDrawer 
      v-model="drawer"
    />

    <v-main class="main-content">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppBar from './components/layout/AppBar.vue'
import NavigationDrawer from './components/layout/NavigationDrawer.vue'

const drawer = ref(false)
</script>

<style>
.main-content {
  min-height: calc(100vh - 64px);
  overflow-y: auto;
}
</style>
