<template>
  <PageLayout
    title="Reservas"
    subtitle="Gerencie as reservas de salas do sistema"
    icon="mdi-calendar"
    icon-color="warning"
    back-route="/"
    back-tooltip="Voltar ao Dashboard"
  >
    <template v-slot:actions>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="navigateToNew"
        size="large"
      >
        Nova Reserva
      </v-btn>
    </template>

    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2" color="success">mdi-play-circle-outline</v-icon>
            Reservas Ativas
          </v-card-title>

          <v-data-table
            :headers="headers"
            :items="reservasAtivas"
            :loading="loading"
            class="elevation-1"
          >
            <template v-slot:item.funcionario="{ item }">
              {{ item.funcionario?.nome || 'N/A' }}
            </template>

            <template v-slot:item.sala="{ item }">
              {{ item.sala?.nome || 'N/A' }}
            </template>

            <template v-slot:item.data="{ item }">
              {{ formatarData(item.data) }}
            </template>

            <template v-slot:item.horario="{ item }">
              {{ item.horario_inicio }} - {{ item.horario_fim }}
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn
                icon="mdi-pencil"
                size="small"
                color="primary"
                variant="text"
                @click="editReserva(item)"
              ></v-btn>
              <v-btn
                icon="mdi-delete"
                size="small"
                color="error"
                variant="text"
                @click="confirmDelete(item)"
              ></v-btn>
            </template>

            <template v-slot:no-data>
              <div class="text-center pa-4">
                <v-icon size="64" color="grey">mdi-calendar-blank-outline</v-icon>
                <p class="text-h6 mt-2">Nenhuma reserva ativa</p>
                <p class="text-body-2">Clique em "Nova Reserva" para começar</p>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2" color="grey">mdi-history</v-icon>
            Reservas Expiradas
          </v-card-title>

          <v-data-table
            :headers="headers"
            :items="reservasExpiradas"
            :loading="loading"
            class="elevation-1"
          >
            <template v-slot:item.funcionario="{ item }">
              {{ item.funcionario?.nome || 'N/A' }}
            </template>

            <template v-slot:item.sala="{ item }">
              {{ item.sala?.nome || 'N/A' }}
            </template>

            <template v-slot:item.data="{ item }">
              {{ formatarData(item.data) }}
            </template>

            <template v-slot:item.horario="{ item }">
              {{ item.horario_inicio }} - {{ item.horario_fim }}
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn
                icon="mdi-pencil"
                size="small"
                color="primary"
                variant="text"
                @click="editReserva(item)"
              ></v-btn>
              <v-btn
                icon="mdi-delete"
                size="small"
                color="error"
                variant="text"
                @click="confirmDelete(item)"
              ></v-btn>
            </template>

            <template v-slot:no-data>
              <div class="text-center pa-4">
                <v-icon size="64" color="grey">mdi-calendar-remove-outline</v-icon>
                <p class="text-h6 mt-2">Nenhuma reserva expirada</p>
                <p class="text-body-2">As reservas expiradas aparecerão aqui</p>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog de confirmação de exclusão -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          <v-icon class="mr-2" color="error">mdi-alert</v-icon>
          Confirmar Exclusão
        </v-card-title>
        <v-card-text>
          Tem certeza que deseja excluir a reserva?
          <br><br>
          <v-alert
            type="warning"
            variant="tonal"
            class="mt-2"
          >
            Esta ação não pode ser desfeita!
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            variant="text"
            @click="deleteDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            variant="flat"
            @click="deleteReserva"
            :loading="deleting"
          >
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar para notificações -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="3000"
    >
      {{ snackbarText }}
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
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { reservaService } from '../../services/storage'
import { formatarData } from '../../utils/validators'
import PageLayout from '../../components/common/PageLayout.vue'
import type { Reserva } from '../../types'

const router = useRouter()

// Estado reativo
const reservas = ref<Reserva[]>([])
const loading = ref(false)
const deleteDialog = ref(false)
const reservaToDelete = ref<Reserva | null>(null)
const deleting = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

// Headers da tabela
const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Funcionário', key: 'funcionario', sortable: true },
  { title: 'Sala', key: 'sala', sortable: true },
  { title: 'Data', key: 'data', sortable: true },
  { title: 'Horário', key: 'horario', sortable: false },
  { title: 'Ações', key: 'actions', sortable: false, width: '120px' }
]

// Carregar reservas
const loadReservas = async () => {
  loading.value = true
  try {
    reservas.value = reservaService.getAll()
  } catch (error) {
    console.error('Erro ao carregar reservas:', error)
    showSnackbar('Erro ao carregar reservas', 'error')
  } finally {
    loading.value = false
  }
}

// Relógio para reclassificação automática
const now = ref<Date>(new Date())
let clockInterval: number | undefined

// Montar data/hora final da reserva
const getReservaEndDate = (reserva: Reserva): Date => {
  const [year, month, day] = reserva.data.split('-').map(Number)
  const [hour, minute] = reserva.horario_fim.split(':').map(Number)
  return new Date(year, month - 1, day, hour, minute, 0, 0)
}

// Verificar se a reserva já expirou
const isReservaExpirada = (reserva: Reserva): boolean => {
  const fim = getReservaEndDate(reserva)
  return fim.getTime() < now.value.getTime()
}

// Computeds para separar reservas
const reservasAtivas = computed(() => reservas.value.filter(r => !isReservaExpirada(r)))
const reservasExpiradas = computed(() => reservas.value.filter(r => isReservaExpirada(r)))

// Navegar para nova reserva
const navigateToNew = () => {
  router.push('/reservas/nova')
}

// Editar reserva
const editReserva = (reserva: Reserva) => {
  router.push(`/reservas/${reserva.id}`)
}

// Confirmar exclusão
const confirmDelete = (reserva: Reserva) => {
  reservaToDelete.value = reserva
  deleteDialog.value = true
}

// Excluir reserva
const deleteReserva = async () => {
  if (!reservaToDelete.value) return

  deleting.value = true
  try {
    const success = reservaService.delete(reservaToDelete.value.id)
    if (success) {
      showSnackbar('Reserva excluída com sucesso!', 'success')
      await loadReservas()
    } else {
      showSnackbar('Erro ao excluir reserva', 'error')
    }
  } catch (error) {
    console.error('Erro ao excluir reserva:', error)
    showSnackbar('Erro ao excluir reserva', 'error')
  } finally {
    deleting.value = false
    deleteDialog.value = false
    reservaToDelete.value = null
  }
}

// Mostrar notificação
const showSnackbar = (text: string, color: string) => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

// Carregar dados ao montar o componente e iniciar relógio
onMounted(() => {
  loadReservas()
  clockInterval = window.setInterval(() => {
    now.value = new Date()
  }, 60000)
})

onUnmounted(() => {
  if (clockInterval) {
    window.clearInterval(clockInterval)
  }
})
</script>
