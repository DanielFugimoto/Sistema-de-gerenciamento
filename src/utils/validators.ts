import type { FormErrors } from '../types'

// ===== VALIDAÇÃO DE CNPJ =====
export function validarCNPJ(cnpj: string): boolean {
  // Remove caracteres não numéricos
  cnpj = cnpj.replace(/[^\d]/g, '')
  
  // Verifica se tem 14 dígitos
  if (cnpj.length !== 14) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cnpj)) return false
  
  // Validação do primeiro dígito verificador
  let soma = 0
  let peso = 5
  for (let i = 0; i < 12; i++) {
    soma += parseInt(cnpj[i]) * peso
    peso = peso === 2 ? 9 : peso - 1
  }
  let resto = soma % 11
  let dv1 = resto < 2 ? 0 : 11 - resto
  
  if (parseInt(cnpj[12]) !== dv1) return false
  
  // Validação do segundo dígito verificador
  soma = 0
  peso = 6
  for (let i = 0; i < 13; i++) {
    soma += parseInt(cnpj[i]) * peso
    peso = peso === 2 ? 9 : peso - 1
  }
  resto = soma % 11
  let dv2 = resto < 2 ? 0 : 11 - resto
  
  return parseInt(cnpj[13]) === dv2
}

// ===== VALIDAÇÃO DE CAMPOS OBRIGATÓRIOS =====
export function validarCampoObrigatorio(valor: string, nomeCampo: string): string | null {
  if (!valor || valor.trim() === '') {
    return `${nomeCampo} é obrigatório`
  }
  return null
}

// ===== VALIDAÇÃO DE EMAIL =====
export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// ===== VALIDAÇÃO DE HORÁRIO =====
export function validarHorario(horario: string): boolean {
  const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
  return regex.test(horario)
}

// ===== VALIDAÇÃO DE DATA =====
export function validarData(data: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/
  if (!regex.test(data)) return false
  
  // Criar datas usando apenas ano, mês e dia
  const [ano, mes, dia] = data.split('-').map(Number)
  const dataObj = new Date(ano, mes - 1, dia) // mes - 1 porque Date usa 0-11
  
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  
  // Permitir reservas para hoje ou datas futuras
  return dataObj >= hoje
}

// ===== VALIDAÇÃO DE CAPACIDADE =====
export function validarCapacidade(capacidade: number): string | null {
  if (!capacidade || capacidade <= 0) {
    return 'Capacidade deve ser maior que zero'
  }
  if (capacidade > 1000) {
    return 'Capacidade não pode ser maior que 1000'
  }
  return null
}

// ===== VALIDAÇÃO DE HORÁRIOS DE RESERVA =====
export function validarHorariosReserva(horarioInicio: string, horarioFim: string): string | null {
  if (!validarHorario(horarioInicio)) {
    return 'Horário de início inválido'
  }
  
  if (!validarHorario(horarioFim)) {
    return 'Horário de fim inválido'
  }
  
  if (horarioInicio >= horarioFim) {
    return 'Horário de fim deve ser posterior ao horário de início'
  }
  
  // Verificar se a reserva não é muito longa (máximo 8 horas)
  const inicio = new Date(`2000-01-01T${horarioInicio}`)
  const fim = new Date(`2000-01-01T${horarioFim}`)
  const diferenca = (fim.getTime() - inicio.getTime()) / (1000 * 60 * 60) // em horas
  
  if (diferenca > 8) {
    return 'Reserva não pode ser superior a 8 horas'
  }
  
  return null
}

// ===== VALIDAÇÃO DE EMPRESA =====
export function validarEmpresa(empresa: { nome: string; cnpj: string }): FormErrors {
  const errors: FormErrors = {}
  
  // Validar nome
  const nomeError = validarCampoObrigatorio(empresa.nome, 'Nome')
  if (nomeError) {
    errors.nome = [nomeError]
  }
  
  // Validar CNPJ
  const cnpjError = validarCampoObrigatorio(empresa.cnpj, 'CNPJ')
  if (cnpjError) {
    errors.cnpj = [cnpjError]
  } else if (!validarCNPJ(empresa.cnpj)) {
    errors.cnpj = ['CNPJ inválido']
  }
  
  return errors
}

// ===== VALIDAÇÃO DE FUNCIONÁRIO =====
export function validarFuncionario(funcionario: { nome: string; empresa_id: number }): FormErrors {
  const errors: FormErrors = {}
  
  // Validar nome
  const nomeError = validarCampoObrigatorio(funcionario.nome, 'Nome')
  if (nomeError) {
    errors.nome = [nomeError]
  }
  
  // Validar empresa
  if (!funcionario.empresa_id) {
    errors.empresa_id = ['Empresa é obrigatória']
  }
  
  return errors
}

// ===== VALIDAÇÃO DE SALA =====
export function validarSala(sala: { nome: string; capacidade: number }): FormErrors {
  const errors: FormErrors = {}
  
  // Validar nome
  const nomeError = validarCampoObrigatorio(sala.nome, 'Nome')
  if (nomeError) {
    errors.nome = [nomeError]
  }
  
  // Validar capacidade
  const capacidadeError = validarCapacidade(sala.capacidade)
  if (capacidadeError) {
    errors.capacidade = [capacidadeError]
  }
  
  return errors
}

// ===== VALIDAÇÃO DE RESERVA =====
export function validarReserva(reserva: { 
  funcionario_id: number; 
  sala_id: number; 
  data: string; 
  horario_inicio: string; 
  horario_fim: string 
}): FormErrors {
  const errors: FormErrors = {}
  
  // Validar funcionário
  if (!reserva.funcionario_id) {
    errors.funcionario_id = ['Funcionário é obrigatório']
  }
  
  // Validar sala
  if (!reserva.sala_id) {
    errors.sala_id = ['Sala é obrigatória']
  }
  
  // Validar data
  if (!reserva.data) {
    errors.data = ['Data é obrigatória']
  } else if (!validarData(reserva.data)) {
    errors.data = ['Data inválida ou deve ser hoje ou futura']
  }
  
  // Validar horários
  const horariosError = validarHorariosReserva(reserva.horario_inicio, reserva.horario_fim)
  if (horariosError) {
    errors.horario_inicio = [horariosError]
  }
  
  return errors
}

// ===== FORMATAÇÃO DE CNPJ =====
export function formatarCNPJ(cnpj: string): string {
  // Remove caracteres não numéricos
  cnpj = cnpj.replace(/[^\d]/g, '')
  
  // Aplica a máscara
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
}

// ===== FORMATAÇÃO DE DATA =====
export function formatarData(data: string): string {
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

// ===== FORMATAÇÃO DE HORÁRIO =====
export function formatarHorario(horario: string): string {
  return horario
}
