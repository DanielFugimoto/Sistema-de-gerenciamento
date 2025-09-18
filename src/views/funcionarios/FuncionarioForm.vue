<template>
  <PageLayout
    :title="isEdit ? 'Editar Funcionário' : 'Novo Funcionário'"
    :subtitle="isEdit ? 'Edite os dados do funcionário' : 'Cadastre um novo funcionário no sistema'"
    icon="mdi-account-group"
    icon-color="secondary"
    back-route="/funcionarios"
    back-tooltip="Voltar para Funcionários"
  >
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="5">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-form</v-icon>
            Dados do Funcionário
          </v-card-title>

          <v-form
            ref="form"
            v-model="valid"
            @submit.prevent="saveFuncionario"
          >
            <v-card-text>
              <v-text-field
                v-model="funcionario.nome"
                label="Nome do Funcionário"
                :rules="nomeRules"
                :error-messages="errors.nome"
                required
                prepend-icon="mdi-account"
                variant="outlined"
                class="mb-4"
              ></v-text-field>

              <v-select
                v-model="funcionario.empresa_id"
                :items="empresas"
                item-title="nome"
                item-value="id"
                label="Empresa"
                :rules="empresaRules"
                :error-messages="errors.empresa_id"
                required
                prepend-icon="mdi-domain"
                variant="outlined"
                class="mb-4"
              ></v-select>

              <v-alert
                v-if="Object.keys(errors).length > 0"
                type="error"
                variant="tonal"
                class="mb-4"
              >
                <div v-for="(fieldErrors, field) in errors" :key="field">
                  <div v-for="error in fieldErrors" :key="error">
                    {{ error }}
                  </div>
                </div>
              </v-alert>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="grey"
                variant="text"
                @click="goBack"
                :disabled="saving"
              >
                Cancelar
              </v-btn>
              <v-btn
                color="primary"
                variant="flat"
                type="submit"
                :loading="saving"
                :disabled="!valid"
              >
                {{ isEdit ? 'Atualizar' : 'Salvar' }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { funcionarioService, empresaService } from '../../services/storage'
import { validarFuncionario } from '../../utils/validators'
import PageLayout from '../../components/common/PageLayout.vue'
import type { Funcionario, Empresa, FormErrors } from '../../types'

const router = useRouter()
const route = useRoute()

// Estado reativo
const form = ref()
const valid = ref(false)
const saving = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')
const errors = ref<FormErrors>({})
const empresas = ref<Empresa[]>([])

// Dados do funcionário
const funcionario = reactive<Omit<Funcionario, 'id' | 'empresa'>>({
  nome: '',
  empresa_id: 0
})

// Computed
const isEdit = computed(() => !!route.params.id)

// Regras de validação
const nomeRules = [
  (v: string) => !!v || 'Nome é obrigatório',
  (v: string) => (v && v.length >= 2) || 'Nome deve ter pelo menos 2 caracteres'
]

const empresaRules = [
  (v: number) => !!v || 'Empresa é obrigatória'
]

// Carregar empresas
const loadEmpresas = async () => {
  try {
    empresas.value = empresaService.getAll()
  } catch (error) {
    console.error('Erro ao carregar empresas:', error)
    showSnackbar('Erro ao carregar empresas', 'error')
  }
}

// Carregar funcionário para edição
const loadFuncionario = async () => {
  if (!isEdit.value) return

  const id = parseInt(route.params.id as string)
  const funcionarioData = funcionarioService.getById(id)

  if (!funcionarioData) {
    showSnackbar('Funcionário não encontrado', 'error')
    router.push('/funcionarios')
    return
  }

  funcionario.nome = funcionarioData.nome
  funcionario.empresa_id = funcionarioData.empresa_id
}

// Salvar funcionário
const saveFuncionario = async () => {
  if (!form.value) return

  const { valid: formValid } = await form.value.validate()
  if (!formValid) return

  // Limpar erros anteriores
  errors.value = {}

  // Validar dados
  const validationErrors = validarFuncionario(funcionario)
  if (Object.keys(validationErrors).length > 0) {
    errors.value = validationErrors
    return
  }

  saving.value = true

  try {
    if (isEdit.value) {
      const id = parseInt(route.params.id as string)
      const updated = funcionarioService.update(id, funcionario)
      if (updated) {
        showSnackbar('Funcionário atualizado com sucesso!', 'success')
        router.push('/funcionarios')
      } else {
        showSnackbar('Erro ao atualizar funcionário', 'error')
      }
    } else {
      const created = funcionarioService.create(funcionario)
      if (created) {
        showSnackbar('Funcionário criado com sucesso!', 'success')
        router.push('/funcionarios')
      } else {
        showSnackbar('Erro ao criar funcionário', 'error')
      }
    }
  } catch (error) {
    console.error('Erro ao salvar funcionário:', error)
    showSnackbar('Erro ao salvar funcionário', 'error')
  } finally {
    saving.value = false
  }
}

// Voltar
const goBack = () => {
  router.push('/funcionarios')
}

// Mostrar notificação
const showSnackbar = (text: string, color: string) => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

// Carregar dados ao montar o componente
onMounted(async () => {
  await loadEmpresas()
  await loadFuncionario()
})
</script>
