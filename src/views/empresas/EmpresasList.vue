<template>
  <PageLayout
    title="Empresas"
    subtitle="Gerencie as empresas cadastradas no condomínio"
    icon="mdi-domain"
    icon-color="primary"
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
        Nova Empresa
      </v-btn>
    </template>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-format-list-bulleted</v-icon>
            Lista de Empresas
          </v-card-title>
          
          <v-data-table
            :headers="headers"
            :items="empresas"
            :loading="loading"
            class="elevation-1"
          >
            <template v-slot:item.cnpj="{ item }">
              {{ formatarCNPJ(item.cnpj) }}
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn
                icon="mdi-pencil"
                size="small"
                color="primary"
                variant="text"
                @click="editEmpresa(item)"
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
                <v-icon size="64" color="grey">mdi-domain-off</v-icon>
                <p class="text-h6 mt-2">Nenhuma empresa cadastrada</p>
                <p class="text-body-2">Clique em "Nova Empresa" para começar</p>
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
          Tem certeza que deseja excluir a empresa 
          <strong>{{ empresaToDelete?.nome }}</strong>?
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
            @click="deleteEmpresa"
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
import { empresaService } from '../../services/storage'
import { formatarCNPJ } from '../../utils/validators'
import PageLayout from '../../components/common/PageLayout.vue'
import type { Empresa } from '../../types'

const router = useRouter()

// Estado reativo
const empresas = ref<Empresa[]>([])
const loading = ref(false)
const deleteDialog = ref(false)
const empresaToDelete = ref<Empresa | null>(null)
const deleting = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

// Headers da tabela
const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Nome', key: 'nome', sortable: true },
  { title: 'CNPJ', key: 'cnpj', sortable: false },
  { title: 'Ações', key: 'actions', sortable: false, width: '120px' }
]

// Carregar empresas
const loadEmpresas = async () => {
  loading.value = true
  try {
    empresas.value = empresaService.getAll()
  } catch (error) {
    console.error('Erro ao carregar empresas:', error)
    showSnackbar('Erro ao carregar empresas', 'error')
  } finally {
    loading.value = false
  }
}

// Navegar para nova empresa
const navigateToNew = () => {
  router.push('/empresas/nova')
}


// Editar empresa
const editEmpresa = (empresa: Empresa) => {
  router.push(`/empresas/${empresa.id}`)
}

// Confirmar exclusão
const confirmDelete = (empresa: Empresa) => {
  empresaToDelete.value = empresa
  deleteDialog.value = true
}

// Excluir empresa
const deleteEmpresa = async () => {
  if (!empresaToDelete.value) return

  deleting.value = true
  try {
    const success = empresaService.delete(empresaToDelete.value.id)
    if (success) {
      showSnackbar('Empresa excluída com sucesso!', 'success')
      await loadEmpresas()
    } else {
      showSnackbar('Erro ao excluir empresa', 'error')
    }
  } catch (error) {
    console.error('Erro ao excluir empresa:', error)
    showSnackbar('Erro ao excluir empresa', 'error')
  } finally {
    deleting.value = false
    deleteDialog.value = false
    empresaToDelete.value = null
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
  loadEmpresas()
})
</script>
