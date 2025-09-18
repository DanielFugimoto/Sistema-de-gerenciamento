<template>
  <v-navigation-drawer
    v-model="drawer"
    temporary
    location="left"
    width="280"
  >
    <v-list>
      <v-list-item
        prepend-icon="mdi-view-dashboard"
        title="Dashboard"
        value="dashboard"
        @click="navigateTo('/')"
      ></v-list-item>

      <v-list-group value="empresas">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-domain"
            title="Empresas"
          ></v-list-item>
        </template>
        <v-list-item
          prepend-icon="mdi-format-list-bulleted"
          title="Listar"
          value="empresas-list"
          @click="navigateTo('/empresas')"
        >
          <template v-slot:append>
            <v-chip size="small" color="primary" variant="tonal">
              {{ empresasCount }}
            </v-chip>
          </template>
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-plus"
          title="Nova Empresa"
          value="empresas-new"
          @click="navigateTo('/empresas/nova')"
        ></v-list-item>
      </v-list-group>

      <v-list-group value="funcionarios">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-account-group"
            title="Funcionários"
          ></v-list-item>
        </template>
        <v-list-item
          prepend-icon="mdi-format-list-bulleted"
          title="Listar"
          value="funcionarios-list"
          @click="navigateTo('/funcionarios')"
        >
          <template v-slot:append>
            <v-chip size="small" color="secondary" variant="tonal">
              {{ funcionariosCount }}
            </v-chip>
          </template>
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-plus"
          title="Novo Funcionário"
          value="funcionarios-new"
          @click="navigateTo('/funcionarios/novo')"
        ></v-list-item>
      </v-list-group>

      <v-list-group value="salas">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-door"
            title="Salas"
          ></v-list-item>
        </template>
        <v-list-item
          prepend-icon="mdi-format-list-bulleted"
          title="Listar"
          value="salas-list"
          @click="navigateTo('/salas')"
        >
          <template v-slot:append>
            <v-chip size="small" color="success" variant="tonal">
              {{ salasCount }}
            </v-chip>
          </template>
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-plus"
          title="Nova Sala"
          value="salas-new"
          @click="navigateTo('/salas/nova')"
        ></v-list-item>
      </v-list-group>

      <v-list-group value="reservas">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-calendar"
            title="Reservas"
          ></v-list-item>
        </template>
        <v-list-item
          prepend-icon="mdi-format-list-bulleted"
          title="Listar"
          value="reservas-list"
          @click="navigateTo('/reservas')"
        >
          <template v-slot:append>
            <v-chip size="small" color="warning" variant="tonal">
              {{ reservasCount }}
            </v-chip>
          </template>
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-plus"
          title="Nova Reserva"
          value="reservas-new"
          @click="navigateTo('/reservas/nova')"
        ></v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { empresaService, funcionarioService, salaService, reservaService } from '../../services/storage'

const router = useRouter()

// Props e Emits para v-model
interface Props {
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Computed para v-model
const drawer = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Contadores
const empresasCount = ref(0)
const funcionariosCount = ref(0)
const salasCount = ref(0)
const reservasCount = ref(0)

// Carregar contadores
const loadCounters = () => {
  empresasCount.value = empresaService.getAll().length
  funcionariosCount.value = funcionarioService.getAll().length
  salasCount.value = salaService.getAll().length
  reservasCount.value = reservaService.getAll().length
}

const navigateTo = (path: string) => {
  router.push(path)
  drawer.value = false
}

// Carregar dados ao montar
onMounted(() => {
  loadCounters()
})
</script>
