<template>
  <PageLayout
    :title="isEdit ? 'Editar Reserva' : 'Nova Reserva'"
    :subtitle="isEdit ? 'Edite os dados da reserva' : 'Faça uma nova reserva de sala'"
    icon="mdi-calendar"
    icon-color="warning"
    back-route="/reservas"
    back-tooltip="Voltar para Reservas"
  >
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="5">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-form</v-icon>
            Dados da Reserva
          </v-card-title>

          <v-form
            ref="form"
            v-model="valid"
            @submit.prevent="saveReserva"
          >
            <v-card-text>
              <v-select
                v-model="reserva.funcionario_id"
                :items="funcionarios"
                item-title="nome"
                item-value="id"
                label="Funcionário"
                :rules="funcionarioRules"
                :error-messages="errors.funcionario_id"
                required
                prepend-icon="mdi-account"
                variant="outlined"
                class="mb-4"
              ></v-select>

              <v-select
                v-model="reserva.sala_id"
                :items="salas"
                item-title="nome"
                item-value="id"
                label="Sala"
                :rules="salaRules"
                :error-messages="errors.sala_id"
                required
                prepend-icon="mdi-door"
                variant="outlined"
                class="mb-4"
              ></v-select>

              <v-text-field
                v-model="reserva.data"
                label="Data"
                type="date"
                :rules="dataRules"
                :error-messages="errors.data"
                required
                prepend-icon="mdi-calendar"
                variant="outlined"
                class="mb-4"
              ></v-text-field>

              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="reserva.horario_inicio"
                    label="Horário Início"
                    type="time"
                    :rules="horarioInicioRules"
                    :error-messages="errors.horario_inicio"
                    required
                    prepend-icon="mdi-clock-start"
                    variant="outlined"
                    class="mb-4"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="reserva.horario_fim"
                    label="Horário Fim"
                    type="time"
                    :rules="horarioFimRules"
                    :error-messages="errors.horario_fim"
                    required
                    prepend-icon="mdi-clock-end"
                    variant="outlined"
                    class="mb-4"
                  ></v-text-field>
                </v-col>
              </v-row>

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
import { reservaService, funcionarioService, salaService } from '../../services/storage'
import { validarReserva } from '../../utils/validators'
import PageLayout from '../../components/common/PageLayout.vue'
import type { Reserva, Funcionario, Sala, FormErrors } from '../../types'

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
const funcionarios = ref<Funcionario[]>([])
const salas = ref<Sala[]>([])

// Dados da reserva
const reserva = reactive<Omit<Reserva, 'id' | 'funcionario' | 'sala'>>({
  funcionario_id: 0,
  sala_id: 0,
  data: '',
  horario_inicio: '',
  horario_fim: ''
})

// Computed
const isEdit = computed(() => !!route.params.id)

// Regras de validação
const funcionarioRules = [
  (v: number) => !!v || 'Funcionário é obrigatório'
]

const salaRules = [
  (v: number) => !!v || 'Sala é obrigatória'
]

const dataRules = [
  (v: string) => !!v || 'Data é obrigatória'
]

const horarioInicioRules = [
  (v: string) => !!v || 'Horário de início é obrigatório'
]

const horarioFimRules = [
  (v: string) => !!v || 'Horário de fim é obrigatório'
]

// Carregar dados
const loadData = async () => {
  try {
    funcionarios.value = funcionarioService.getAll()
    salas.value = salaService.getAll()
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    showSnackbar('Erro ao carregar dados', 'error')
  }
}

// Carregar reserva para edição
const loadReserva = async () => {
  if (!isEdit.value) return

  const id = parseInt(route.params.id as string)
  const reservaData = reservaService.getById(id)

  if (!reservaData) {
    showSnackbar('Reserva não encontrada', 'error')
    router.push('/reservas')
    return
  }

  reserva.funcionario_id = reservaData.funcionario_id
  reserva.sala_id = reservaData.sala_id
  reserva.data = reservaData.data
  reserva.horario_inicio = reservaData.horario_inicio
  reserva.horario_fim = reservaData.horario_fim
}

// Salvar reserva
const saveReserva = async () => {
  if (!form.value) return

  const { valid: formValid } = await form.value.validate()
  if (!formValid) return

  // Limpar erros anteriores
  errors.value = {}

  // Validar dados
  const validationErrors = validarReserva(reserva)
  if (Object.keys(validationErrors).length > 0) {
    errors.value = validationErrors
    return
  }

  // Verificar conflitos de horário
  const hasConflict = reservaService.hasConflict(
    reserva.sala_id,
    reserva.data,
    reserva.horario_inicio,
    reserva.horario_fim,
    isEdit.value ? parseInt(route.params.id as string) : undefined
  )

  if (hasConflict) {
    errors.value = {
      horario_inicio: ['Já existe uma reserva para esta sala no horário selecionado']
    }
    return
  }

  saving.value = true

  try {
    if (isEdit.value) {
      const id = parseInt(route.params.id as string)
      const updated = reservaService.update(id, reserva)
      if (updated) {
        showSnackbar('Reserva atualizada com sucesso!', 'success')
        router.push('/reservas')
      } else {
        showSnackbar('Erro ao atualizar reserva', 'error')
      }
    } else {
      const created = reservaService.create(reserva)
      if (created) {
        showSnackbar('Reserva criada com sucesso!', 'success')
        router.push('/reservas')
      } else {
        showSnackbar('Erro ao criar reserva', 'error')
      }
    }
  } catch (error) {
    console.error('Erro ao salvar reserva:', error)
    showSnackbar('Erro ao salvar reserva', 'error')
  } finally {
    saving.value = false
  }
}

// Voltar
const goBack = () => {
  router.push('/reservas')
}

// Mostrar notificação
const showSnackbar = (text: string, color: string) => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

// Carregar dados ao montar o componente
onMounted(async () => {
  await loadData()
  await loadReserva()
})
</script>
