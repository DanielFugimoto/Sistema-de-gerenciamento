<template>
  <PageLayout
    title="Funcionários"
    subtitle="Gerencie os funcionários cadastrados no sistema"
    icon="mdi-account-group"
    icon-color="secondary"
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
        Novo Funcionário
      </v-btn>
    </template>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-format-list-bulleted</v-icon>
            Lista de Funcionários
          </v-card-title>
          
          <v-data-table
            :headers="headers"
            :items="funcionarios"
            :loading="loading"
            class="elevation-1"
          >
            <template v-slot:item.empresa="{ item }">
              {{ item.empresa?.nome || 'N/A' }}
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn
                icon="mdi-pencil"
                size="small"
                color="primary"
                variant="text"
                @click="editFuncionario(item)"
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
                <v-icon size="64" color="grey">mdi-account-off</v-icon>
                <p class="text-h6 mt-2">Nenhum funcionário cadastrado</p>
                <p class="text-body-2">Clique em "Novo Funcionário" para começar</p>
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
          Tem certeza que deseja excluir o funcionário 
          <strong>{{ funcionarioToDelete?.nome }}</strong>?
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
            @click="deleteFuncionario"
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
import { funcionarioService } from '../../services/storage'
import PageLayout from '../../components/common/PageLayout.vue'
import type { Funcionario } from '../../types'

const router = useRouter()

// Estado reativo
const funcionarios = ref<Funcionario[]>([])
const loading = ref(false)
const deleteDialog = ref(false)
const funcionarioToDelete = ref<Funcionario | null>(null)
const deleting = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

// Headers da tabela
const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Nome', key: 'nome', sortable: true },
  { title: 'Empresa', key: 'empresa', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false, width: '120px' }
]

// Carregar funcionários
const loadFuncionarios = async () => {
  loading.value = true
  try {
    funcionarios.value = funcionarioService.getAll()
  } catch (error) {
    console.error('Erro ao carregar funcionários:', error)
    showSnackbar('Erro ao carregar funcionários', 'error')
  } finally {
    loading.value = false
  }
}

// Navegar para novo funcionário
const navigateToNew = () => {
  router.push('/funcionarios/novo')
}

// Editar funcionário
const editFuncionario = (funcionario: Funcionario) => {
  router.push(`/funcionarios/${funcionario.id}`)
}

// Confirmar exclusão
const confirmDelete = (funcionario: Funcionario) => {
  funcionarioToDelete.value = funcionario
  deleteDialog.value = true
}

// Excluir funcionário
const deleteFuncionario = async () => {
  if (!funcionarioToDelete.value) return

  deleting.value = true
  try {
    const success = funcionarioService.delete(funcionarioToDelete.value.id)
    if (success) {
      showSnackbar('Funcionário excluído com sucesso!', 'success')
      await loadFuncionarios()
    } else {
      showSnackbar('Erro ao excluir funcionário', 'error')
    }
  } catch (error) {
    console.error('Erro ao excluir funcionário:', error)
    showSnackbar('Erro ao excluir funcionário', 'error')
  } finally {
    deleting.value = false
    deleteDialog.value = false
    funcionarioToDelete.value = null
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
  loadFuncionarios()
})
</script>
