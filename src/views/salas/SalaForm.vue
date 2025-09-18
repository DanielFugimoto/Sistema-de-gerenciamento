<template>
  <PageLayout
    :title="isEdit ? 'Editar Sala' : 'Nova Sala'"
    :subtitle="isEdit ? 'Edite os dados da sala' : 'Cadastre uma nova sala no sistema'"
    icon="mdi-door"
    icon-color="success"
    back-route="/salas"
    back-tooltip="Voltar para Salas"
  >
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="5">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-form</v-icon>
            Dados da Sala
          </v-card-title>

          <v-form
            ref="form"
            v-model="valid"
            @submit.prevent="saveSala"
          >
            <v-card-text>
              <v-text-field
                v-model="sala.nome"
                label="Nome da Sala"
                :rules="nomeRules"
                :error-messages="errors.nome"
                required
                prepend-icon="mdi-door"
                variant="outlined"
                class="mb-4"
              ></v-text-field>

              <v-text-field
                v-model.number="sala.capacidade"
                label="Capacidade"
                type="number"
                :rules="capacidadeRules"
                :error-messages="errors.capacidade"
                required
                prepend-icon="mdi-account-group"
                variant="outlined"
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
import { salaService } from '../../services/storage'
import { validarSala } from '../../utils/validators'
import PageLayout from '../../components/common/PageLayout.vue'
import type { Sala, FormErrors } from '../../types'

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

// Dados da sala
const sala = reactive<Omit<Sala, 'id'>>({
  nome: '',
  capacidade: 1
})

// Computed
const isEdit = computed(() => !!route.params.id)

// Regras de validação
const nomeRules = [
  (v: string) => !!v || 'Nome é obrigatório',
  (v: string) => (v && v.length >= 2) || 'Nome deve ter pelo menos 2 caracteres'
]

const capacidadeRules = [
  (v: number) => !!v || 'Capacidade é obrigatória',
  (v: number) => v > 0 || 'Capacidade deve ser maior que zero',
  (v: number) => v <= 1000 || 'Capacidade não pode ser maior que 1000'
]

// Carregar sala para edição
const loadSala = async () => {
  if (!isEdit.value) return

  const id = parseInt(route.params.id as string)
  const salaData = salaService.getById(id)

  if (!salaData) {
    showSnackbar('Sala não encontrada', 'error')
    router.push('/salas')
    return
  }

  sala.nome = salaData.nome
  sala.capacidade = salaData.capacidade
}

// Salvar sala
const saveSala = async () => {
  if (!form.value) return

  const { valid: formValid } = await form.value.validate()
  if (!formValid) return

  // Limpar erros anteriores
  errors.value = {}

  // Validar dados
  const validationErrors = validarSala(sala)
  if (Object.keys(validationErrors).length > 0) {
    errors.value = validationErrors
    return
  }

  saving.value = true

  try {
    if (isEdit.value) {
      const id = parseInt(route.params.id as string)
      const updated = salaService.update(id, sala)
      if (updated) {
        showSnackbar('Sala atualizada com sucesso!', 'success')
        router.push('/salas')
      } else {
        showSnackbar('Erro ao atualizar sala', 'error')
      }
    } else {
      const created = salaService.create(sala)
      if (created) {
        showSnackbar('Sala criada com sucesso!', 'success')
        router.push('/salas')
      } else {
        showSnackbar('Erro ao criar sala', 'error')
      }
    }
  } catch (error) {
    console.error('Erro ao salvar sala:', error)
    showSnackbar('Erro ao salvar sala', 'error')
  } finally {
    saving.value = false
  }
}

// Voltar
const goBack = () => {
  router.push('/salas')
}

// Mostrar notificação
const showSnackbar = (text: string, color: string) => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

// Carregar dados ao montar o componente
onMounted(() => {
  loadSala()
})
</script>
