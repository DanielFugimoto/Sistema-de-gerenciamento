<template>
  <PageLayout
    title="Salas"
    subtitle="Gerencie as salas disponíveis para reserva"
    icon="mdi-door"
    icon-color="success"
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
        Nova Sala
      </v-btn>
    </template>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-format-list-bulleted</v-icon>
            Lista de Salas
          </v-card-title>
          
          <v-data-table
            :headers="headers"
            :items="salas"
            :loading="loading"
            class="elevation-1"
          >
            <template v-slot:item.capacidade="{ item }">
              {{ item.capacidade }} pessoas
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn
                icon="mdi-pencil"
                size="small"
                color="primary"
                variant="text"
                @click="editSala(item)"
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
                <v-icon size="64" color="grey">mdi-door-closed</v-icon>
                <p class="text-h6 mt-2">Nenhuma sala cadastrada</p>
                <p class="text-body-2">Clique em "Nova Sala" para começar</p>
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
          Tem certeza que deseja excluir a sala 
          <strong>{{ salaToDelete?.nome }}</strong>?
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
            @click="deleteSala"
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { salaService } from '../../services/storage'
import PageLayout from '../../components/common/PageLayout.vue'
import type { Sala } from '../../types'

const router = useRouter()

// Estado reativo
const salas = ref<Sala[]>([])
const loading = ref(false)
const deleteDialog = ref(false)
const salaToDelete = ref<Sala | null>(null)
const deleting = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

// Headers da tabela
const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Nome', key: 'nome', sortable: true },
  { title: 'Capacidade', key: 'capacidade', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false, width: '120px' }
]

// Carregar salas
const loadSalas = async () => {
  loading.value = true
  try {
    salas.value = salaService.getAll()
  } catch (error) {
    console.error('Erro ao carregar salas:', error)
    showSnackbar('Erro ao carregar salas', 'error')
  } finally {
    loading.value = false
  }
}

// Navegar para nova sala
const navigateToNew = () => {
  router.push('/salas/nova')
}

// Editar sala
const editSala = (sala: Sala) => {
  router.push(`/salas/${sala.id}`)
}

// Confirmar exclusão
const confirmDelete = (sala: Sala) => {
  salaToDelete.value = sala
  deleteDialog.value = true
}

// Excluir sala
const deleteSala = async () => {
  if (!salaToDelete.value) return

  deleting.value = true
  try {
    const success = salaService.delete(salaToDelete.value.id)
    if (success) {
      showSnackbar('Sala excluída com sucesso!', 'success')
      await loadSalas()
    } else {
      showSnackbar('Erro ao excluir sala', 'error')
    }
  } catch (error) {
    console.error('Erro ao excluir sala:', error)
    showSnackbar('Erro ao excluir sala', 'error')
  } finally {
    deleting.value = false
    deleteDialog.value = false
    salaToDelete.value = null
  }
}

// Mostrar notificação
const showSnackbar = (text: string, color: string) => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

// Carregar dados ao montar o componente
onMounted(() => {
  loadSalas()
})
</script>
