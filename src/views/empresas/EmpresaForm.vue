<template>
  <PageLayout
    :title="isEdit ? 'Editar Empresa' : 'Nova Empresa'"
    :subtitle="isEdit ? 'Edite os dados da empresa' : 'Cadastre uma nova empresa no sistema'"
    icon="mdi-domain"
    icon-color="primary"
    back-route="/empresas"
    back-tooltip="Voltar para Empresas"
  >
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="5">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-form</v-icon>
            Dados da Empresa
          </v-card-title>

          <v-form
            ref="form"
            v-model="valid"
            @submit.prevent="saveEmpresa"
          >
            <v-card-text>
              <v-text-field
                v-model="empresa.nome"
                label="Nome da Empresa"
                :rules="nomeRules"
                :error-messages="errors.nome"
                required
                prepend-icon="mdi-domain"
                variant="outlined"
                class="mb-4"
              ></v-text-field>

              <v-text-field
                v-model="empresa.cnpj"
                label="CNPJ"
                :rules="cnpjRules"
                :error-messages="errors.cnpj"
                required
                prepend-icon="mdi-card-account-details"
                variant="outlined"
                placeholder="00.000.000/0000-00"
                @input="formatCNPJ"
                class="mb-4"
              ></v-text-field>

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
import { empresaService } from '../../services/storage'
import { validarEmpresa, formatarCNPJ, validarCNPJ } from '../../utils/validators'
import PageLayout from '../../components/common/PageLayout.vue'
import type { Empresa, FormErrors } from '../../types'

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

// Dados da empresa
const empresa = reactive<Omit<Empresa, 'id'>>({
  nome: '',
  cnpj: ''
})

// Computed
const isEdit = computed(() => !!route.params.id)

// Regras de validação
const nomeRules = [
  (v: string) => !!v || 'Nome é obrigatório',
  (v: string) => (v && v.length >= 2) || 'Nome deve ter pelo menos 2 caracteres'
]

const cnpjRules = [
  (v: string) => !!v || 'CNPJ é obrigatório',
  (v: string) => {
    if (!v) return true
    const cnpj = v.replace(/[^\d]/g, '')
    if (cnpj.length !== 14) return 'CNPJ deve ter 14 dígitos'
    return validarCNPJ(v) || 'CNPJ inválido'
  }
]

// Carregar empresa para edição
const loadEmpresa = async () => {
  if (!isEdit.value) return

  const id = parseInt(route.params.id as string)
  const empresaData = empresaService.getById(id)

  if (!empresaData) {
    showSnackbar('Empresa não encontrada', 'error')
    router.push('/empresas')
    return
  }

  empresa.nome = empresaData.nome
  empresa.cnpj = empresaData.cnpj
}

// Formatar CNPJ durante digitação
const formatCNPJ = () => {
  empresa.cnpj = formatarCNPJ(empresa.cnpj)
}

// Salvar empresa
const saveEmpresa = async () => {
  if (!form.value) return

  const { valid: formValid } = await form.value.validate()
  if (!formValid) return

  // Limpar erros anteriores
  errors.value = {}

  // Validar dados
  const validationErrors = validarEmpresa(empresa)
  if (Object.keys(validationErrors).length > 0) {
    errors.value = validationErrors
    return
  }

  saving.value = true

  try {
    if (isEdit.value) {
      const id = parseInt(route.params.id as string)
      const updated = empresaService.update(id, empresa)
      if (updated) {
        showSnackbar('Empresa atualizada com sucesso!', 'success')
        router.push('/empresas')
      } else {
        showSnackbar('Erro ao atualizar empresa', 'error')
      }
    } else {
      const created = empresaService.create(empresa)
      if (created) {
        showSnackbar('Empresa criada com sucesso!', 'success')
        router.push('/empresas')
      } else {
        showSnackbar('Erro ao criar empresa', 'error')
      }
    }
  } catch (error) {
    console.error('Erro ao salvar empresa:', error)
    showSnackbar('Erro ao salvar empresa', 'error')
  } finally {
    saving.value = false
  }
}

// Voltar
const goBack = () => {
  router.push('/empresas')
}

// Mostrar notificação
const showSnackbar = (text: string, color: string) => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

// Carregar dados ao montar o componente
onMounted(() => {
  loadEmpresa()
})
</script>
