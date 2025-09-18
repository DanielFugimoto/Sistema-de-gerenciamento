<template>
  <div class="dashboard-wrapper">
    <v-container fluid class="pa-4">
    <!-- Título da página -->
    <div class="text-center mb-6">
      <h1 class="text-h3 mb-2">
        <v-icon class="mr-3" color="primary">mdi-view-dashboard</v-icon>
        Dashboard
      </h1>
      <p class="text-h6 text-grey-darken-1">
        Sistema de Gerenciamento de Condomínio Corporativo
      </p>
    </div>

    <v-row>
      <v-col
        v-for="card in dashboardCards"
        :key="card.title"
        cols="12"
        sm="6"
        md="3"
      >
        <v-card
          class="pa-4 text-center"
          elevation="2"
          hover
          @click="navigateTo(card.route)"
        >
          <v-icon
            :color="card.color"
            size="48"
            class="mb-3"
          >
            {{ card.icon }}
          </v-icon>
          <v-card-title class="text-h6">
            {{ card.title }}
          </v-card-title>
          <v-card-text class="text-body-2">
            {{ card.description }}
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn
              :color="card.color"
              variant="outlined"
              @click.stop="navigateTo(card.route)"
            >
              Acessar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Estatísticas -->
    <v-row class="mt-8">
      <v-col cols="12">
        <h2 class="text-h5 mb-4">
          <v-icon class="mr-2">mdi-chart-line</v-icon>
          Estatísticas do Sistema
        </h2>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        v-for="stat in estatisticas"
        :key="stat.title"
        cols="12"
        sm="6"
        md="3"
      >
        <v-card class="pa-4" :color="stat.color" variant="tonal">
          <div class="d-flex align-center">
            <v-icon :color="stat.iconColor" size="40" class="mr-3">
              {{ stat.icon }}
            </v-icon>
            <div>
              <div class="text-h4 font-weight-bold">{{ stat.value }}</div>
              <div class="text-body-2">{{ stat.title }}</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Reservas de Hoje -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-calendar-today</v-icon>
            Reservas de Hoje
          </v-card-title>
          <v-card-text>
            <v-list v-if="reservasHojeAtivas.length > 0">
              <v-list-item
                v-for="reserva in reservasHojeAtivas"
                :key="reserva.id"
                class="mb-2"
              >
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-calendar-clock</v-icon>
                </template>
                <v-list-item-title>
                  {{ reserva.funcionario?.nome }} - {{ reserva.sala?.nome }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ reserva.horario_inicio }} - {{ reserva.horario_fim }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <div v-else class="text-center pa-4">
              <v-icon size="48" color="grey">mdi-calendar-blank</v-icon>
              <p class="text-h6 mt-2">Nenhuma reserva ativa hoje</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Informações do Sistema -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-information</v-icon>
            Sobre o Sistema
          </v-card-title>
          <v-card-text>
            <p>
              Este sistema permite gerenciar empresas, funcionários, salas e reservas 
              em um condomínio corporativo. Utilize o menu lateral para navegar entre 
              as diferentes seções do sistema.
            </p>
            <v-list>
              <v-list-item>
                <v-list-item-title>Empresas</v-list-item-title>
                <v-list-item-subtitle>Cadastre e gerencie as empresas do condomínio</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Funcionários</v-list-item-title>
                <v-list-item-subtitle>Gerencie os funcionários vinculados às empresas</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Salas</v-list-item-title>
                <v-list-item-subtitle>Configure as salas disponíveis para reserva</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Reservas</v-list-item-title>
                <v-list-item-subtitle>Faça e gerencie reservas de salas</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { empresaService, funcionarioService, salaService, reservaService } from '../services/storage'
import type { Reserva } from '../types'

const router = useRouter()

// Estado reativo
const empresas = ref(0)
const funcionarios = ref(0)
const salas = ref(0)
const reservas = ref(0)
const reservasHoje = ref<Reserva[]>([])
const now = ref<Date>(new Date())
let intervalId: number | undefined

// Computed para estatísticas
const estatisticas = computed(() => [
  {
    title: 'Empresas',
    value: empresas.value,
    icon: 'mdi-domain',
    color: 'primary',
    iconColor: 'primary'
  },
  {
    title: 'Funcionários',
    value: funcionarios.value,
    icon: 'mdi-account-group',
    color: 'secondary',
    iconColor: 'secondary'
  },
  {
    title: 'Salas',
    value: salas.value,
    icon: 'mdi-door',
    color: 'success',
    iconColor: 'success'
  },
  {
    title: 'Reservas',
    value: reservas.value,
    icon: 'mdi-calendar',
    color: 'warning',
    iconColor: 'warning'
  }
])

const dashboardCards = [
  {
    title: 'Empresas',
    description: 'Gerenciar empresas cadastradas',
    icon: 'mdi-domain',
    color: 'primary',
    route: '/empresas'
  },
  {
    title: 'Funcionários',
    description: 'Gerenciar funcionários',
    icon: 'mdi-account-group',
    color: 'secondary',
    route: '/funcionarios'
  },
  {
    title: 'Salas',
    description: 'Gerenciar salas disponíveis',
    icon: 'mdi-door',
    color: 'success',
    route: '/salas'
  },
  {
    title: 'Reservas',
    description: 'Gerenciar reservas de salas',
    icon: 'mdi-calendar',
    color: 'warning',
    route: '/reservas'
  }
]

// Carregar dados
const loadData = () => {
  empresas.value = empresaService.getAll().length
  funcionarios.value = funcionarioService.getAll().length
  salas.value = salaService.getAll().length
  refreshReservasStats()

  // Carregar reservas de hoje
  const hoje = new Date().toISOString().split('T')[0]
  reservasHoje.value = reservaService.getByData(hoje)
}

// Helpers para reservas ativas de hoje
const getFimReserva = (r: Reserva): Date => {
  const [year, month, day] = r.data.split('-').map(Number)
  const [hour, minute] = r.horario_fim.split(':').map(Number)
  return new Date(year, month - 1, day, hour, minute, 0, 0)
}

// Atualizar contador de reservas (apenas ativas)
const refreshReservasStats = () => {
  const todas = reservaService.getAll()
  reservas.value = todas.filter(r => getFimReserva(r).getTime() > now.value.getTime()).length
}

const reservasHojeAtivas = computed(() =>
  reservasHoje.value.filter(r => getFimReserva(r).getTime() > now.value.getTime())
)

const navigateTo = (route: string) => {
  router.push(route)
}


// Carregar dados ao montar o componente
onMounted(() => {
  loadData()
  intervalId = window.setInterval(() => {
    now.value = new Date()
    refreshReservasStats()
  }, 60000)
})

onUnmounted(() => {
  if (intervalId) {
    window.clearInterval(intervalId)
  }
})
</script>

<style scoped>
.dashboard-wrapper {
  min-height: calc(100vh - 64px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  overflow-y: auto;
}
</style>

